param(
  [string]$RepoName = "zhizhi-early-education"
)
$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
Set-Location $root
$tokenFile = Join-Path $root ".github-token.local"

function Get-GitHubToken {
  if (Test-Path $tokenFile) {
    return (Get-Content $tokenFile -Raw).Trim()
  }
  $input = "protocol=https`nhost=github.com`n`n"
  $raw = $input | git credential fill 2>$null
  $lines = $raw -split "`n"
  $pass = $lines | Where-Object { $_ -like "password=*" } | ForEach-Object { $_.Substring(9) }
  if ([string]::IsNullOrWhiteSpace($pass)) {
    throw "未找到 GitHub 凭据。请将 token 写入项目根目录 .github-token.local 后重试。"
  }
  return $pass
}

$token = Get-GitHubToken
$headers = @{ Authorization = "Bearer $token"; Accept = "application/vnd.github+json" }
$user = Invoke-RestMethod -Method Get -Uri "https://api.github.com/user" -Headers $headers
$owner = $user.login
$api = "https://api.github.com"
$repoUrl = "$api/repos/$owner/$RepoName"

try {
  $repo = Invoke-RestMethod -Method Get -Uri $repoUrl -Headers $headers
  Write-Host "仓库已存在: $($repo.full_name)"
} catch {
  $body = @{
    name = $RepoName
    description = "之之早教工作台（0-3 岁月龄自适应）"
    private = $false
    auto_init = $false
  } | ConvertTo-Json
  $repo = Invoke-RestMethod -Method Post -Uri "$api/user/repos" -Headers $headers -Body $body -ContentType "application/json"
  Write-Host "仓库已创建: $($repo.full_name)"
}

git init
git config user.name "$owner"
git config user.email "$owner@users.noreply.github.com"
git add .
git commit -m "feat: 0-3 岁早教工作台线上部署"
git remote remove origin 2>$null
git remote add origin "https://github.com/$owner/$RepoName.git"
git push -u origin main

try {
  $pagesBody = @{ build_type = "workflow" } | ConvertTo-Json
  Invoke-RestMethod -Method Post -Uri "$repoUrl/pages" -Headers $headers -Body $pagesBody -ContentType "application/json" | Out-Null
} catch {
  $status = $_.Exception.Response.StatusCode.value__
  if ($status -ne 409 -and $status -ne 422) { throw }
}

Write-Host "等待 GitHub Actions 构建..."
$deadline = (Get-Date).AddMinutes(4)
$conclusion = $null
while ((Get-Date) -lt $deadline) {
  Start-Sleep -Seconds 10
  try {
    $runs = Invoke-RestMethod -Method Get -Uri "$repoUrl/actions/runs?per_page=5&event=push" -Headers $headers
    $run = $runs.workflow_runs | Where-Object { $_.head_branch -eq "main" } | Select-Object -First 1
    if ($run) {
      if ($run.status -eq "completed") {
        $conclusion = $run.conclusion
        Write-Host "构建状态: $conclusion"
        break
      }
      Write-Host "构建中: $($run.status)"
    }
  } catch {
    Write-Host "查询状态中..."
  }
}

if ($conclusion -ne "success") {
  throw "GitHub Actions 未在 4 分钟内成功完成，请到仓库 Actions 页查看详情。"
}

Write-Host "部署完成: https://$owner.github.io/$RepoName/"
if (Test-Path $tokenFile) {
  Remove-Item $tokenFile -Force
  Write-Host "已删除本地 token 文件。"
}
