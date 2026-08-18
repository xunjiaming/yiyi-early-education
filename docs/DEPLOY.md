# 线上部署指南

## 1. 首次发布

项目已配置 GitHub Actions 自动构建并发布到 GitHub Pages。你只需要让本机可以访问 GitHub，然后执行：

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\deploy-github.ps1
```

脚本会自动：创建公共仓库、推送代码、启用 GitHub Pages、等待构建完成并输出访问地址。

## 2. Token 配置（两种方式任选其一）

推荐使用 Windows 已保存的 GitHub 凭据，脚本会自动读取，不需要手动配置。

如果本机没有保存凭据，请在项目根目录新建文件 `.github-token.local`，文件中只放 token，不要提交到仓库。脚本用完会自动删除该文件。

Token 需要最小权限：仓库读写权限（`repo` 或 `public_repo`）以及 `workflow` 权限。

## 3. 日常更新

日常修改代码后，直接在项目目录执行：

```powershell
git add .
git commit -m "feat: 更新内容"
git push origin main
```

GitHub Actions 会自动重新构建并更新线上页面。

## 4. 手机添加到桌面

部署完成后，用手机浏览器打开线上地址，浏览器菜单选择“添加到主屏幕”，即可像 App 一样使用。

## 5. 注意事项

- 首次部署后 GitHub Pages 可能需要 1-2 分钟生效。
- PWA 更新后手机端可能需要刷新一次，或清除站点缓存才能看到新内容。
- 数据默认保存在浏览器本机，换设备后可到“我的”导出备份并在新设备导入。
