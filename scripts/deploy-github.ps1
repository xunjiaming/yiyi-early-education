param(
  [string]$RepoName = "zhizhi-early-education"
)
$ErrorActionPreference = "Continue"
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

function Push-WithSsh {
  param($PrivKeyPath, $PubKeyPath, $Owner, $RepoName)
  $pub = (Get-Content $PubKeyPath -Raw).Trim()
  $keyBody = @{ title = "codex-deploy"; key = $pub; read_only = $false } | ConvertTo-Json
  $keyResult = Invoke-RestMethod -Method Post -Uri "https://api.github.com/repos/$Owner/$RepoName/keys" -Headers $headers -Body $keyBody -ContentType "application/json"
  $env:GIT_SSH_COMMAND = "ssh -i `"$PrivKeyPath`" -o StrictHostKeyChecking=accept-new -o UserKnownHostsFile=$env:TEMP\codex-known-hosts -p 443"
  & git remote set-url origin "ssh://git@ssh.github.com:443/$Owner/$RepoName.git"
  & git push -u origin main
  $pushExit = $LASTEXITCODE
  if ($pushExit -ne 0) { throw "SSH 推送失败，请检查 GitHub 网络或 token 权限。" }
  & git remote set-url origin "https://github.com/$Owner/$RepoName.git"
  try {
    Invoke-RestMethod -Method Delete -Uri "https://api.github.com/repos/$Owner/$RepoName/keys/$($keyResult.id)" -Headers $headers | Out-Null
  } catch {}
  Write-Host "SSH 推送完成并已清理临时部署密钥。"
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
git branch -M main
git add .
git remote remove origin 2>$null
git diff --cached --quiet
if ($LASTEXITCODE -ne 0) {
  git commit -m "feat: 0-3 岁早教工作台线上部署"
  if ($LASTEXITCODE -ne 0) { throw "git commit 失败，请检查本机 Git 配置。" }
}
git remote add origin "https://github.com/$owner/$RepoName.git"
git push -u origin main
if ($LASTEXITCODE -ne 0) {
  Write-Host "HTTPS 推送失败，改用 SSH over 443 通道重试..."
  $keyBase = Join-Path $env:TEMP "codex-deploy-key-zhizhi"
  if (Test-Path $keyBase) { Remove-Item $keyBase -Force }
  if (Test-Path "$keyBase.pub") { Remove-Item "$keyBase.pub" -Force }
  ssh-keygen -t ed25519 -N '' -f $keyBase -C "codex-deploy" | Out-Null
  if ($LASTEXITCODE -ne 0) { throw "SSH 密钥生成失败。" }
  Push-WithSsh -PrivKeyPath $keyBase -PubKeyPath "$keyBase.pub" -Owner $owner -RepoName $RepoName
}

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
