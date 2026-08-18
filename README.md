# 伊伊早教工作台

面向 0-3 岁宝宝的月龄自适应早教工具。家长在首次使用时设置宝宝出生日期，系统按月龄自动切换到对应年龄段的内容，覆盖精细动作、语言启蒙、认知、英文启蒙、大运动与感统、发育观察、教具与空间等模块。

## 文档索引

- [需求文档](docs/REQUIREMENTS.md)：功能范围、内容规则、非目标与验收标准。
- [设计方案](docs/DESIGN.md)：总体架构、数据模型、年龄段划分、内容生成逻辑、技术栈与分阶段落地。
- [0-3 岁全龄早教内容设计](docs/CONTENT_0_3.md)：8 个年龄段的完整内容要点、每日示例、观察项与教具安全。
- [0-3 岁全龄早教内容设计（后续年龄段详细版）](docs/CONTENT_BANDS_7_36.md)：7-9 月至 31-36 月六个年龄段的详细内容池、观察项、教具、空间安全、英文与主题。
- [部署指南](docs/DEPLOY.md)：GitHub 配置、token 权限与日常更新方法。

## 当前状态

- PWA 原型已完成 0-3 岁全龄自适应：8 个年龄阶段、每日五大模块、发育观察、活动库（按龄段筛选）、英文启蒙池、教具与空间区均已接入。
- 数据默认保存在本机，支持手动导出与导入；线上访问使用 GitHub Pages 自动构建部署。

## 在线访问

- 线上地址：https://xunjiaming.github.io/yiyi-early-education/
- 仓库：https://github.com/xunjiaming/yiyi-early-education
- 日常更新推送 `git push origin main` 后由 GitHub Actions 自动构建部署。

## 内置儿歌音频与许可

英文启蒙内置的真实儿歌录音来自 [Wikimedia Commons](https://commons.wikimedia.org/)，均为可自由再发行的公共领域 / CC 授权音频，仅做格式转码以适配移动端播放，未改动内容：

- The Itsy Bitsy Spider — CC BY-SA 3.0（Wwaters）
- Twinkle, Twinkle, Little Star — CC0（Dcoetzee）
- Row, Row, Row Your Boat — CC BY-SA 3.0（CambridgeBayWeather）
- Baa, Baa, Black Sheep — CC BY-SA 3.0（CambridgeBayWeather）
- Old MacDonald Had a Farm — CC BY-SA 3.0（CambridgeBayWeather）
- The Alphabet Song — CC BY-SA 3.0（CambridgeBayWeather）
