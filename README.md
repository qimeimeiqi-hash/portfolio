# 个人主页网站

一个纯静态（HTML / CSS / JavaScript，无需构建工具）的单页个人主页，包含首屏、关于我、技能、职务经历（时间线）、个人项目、联系方式等板块，并自动跟随系统深浅色模式。

## 本地预览

无需安装任何依赖，直接用浏览器打开 `index.html` 即可：

- **Windows**：双击 `index.html`，或在项目根目录执行
  ```
  start index.html
  ```
- 也可以用任意静态服务器预览（效果一致，区别不大），例如已安装 Python 时：
  ```
  python -m http.server 8000
  ```
  然后访问 `http://localhost:8000`

## 部署到 GitHub Pages

1. 将本项目推送到 GitHub 仓库
2. 打开仓库 **Settings → Pages**
3. **Source** 选择 `main` 分支，目录选择 `/ (root)`
4. 保存后等待几分钟，即可通过 GitHub 提供的链接访问

## 文件结构

```
todo/
├── index.html                 # 页面主体（所有板块）
├── css/style.css              # 样式（含暗色模式、响应式）
├── js/main.js                 # 交互逻辑（导航高亮、菜单、动画等）
├── assets/
│   ├── images/                # 头像占位图（SVG）
│   └── favicon.svg
└── README.md
```

## 占位内容替换清单

网站中所有需要替换成你真实信息的地方，`index.html` 里都用 `<!-- TODO: ... -->` 注释标出。对照下面的清单逐项替换即可：

- [x] **姓名与定位**：已替换为真实姓名「張美琪」及职业定位（SE / PG）
- [x] **头像**：已替换为真实照片 `assets/images/avatar.jpg`
- [x] **社交链接**：Hero 区和联系方式区已改为真实 GitHub 链接；未提供 LinkedIn / X，相关图标已移除（如以后注册了账号，可参考 `.social-link` 的现有写法补回）
- [x] **邮箱地址**：Hero 区和联系方式区已替换为真实邮箱 `qimeimeiqi@gmail.com`
- [x] **关于我**：已根据你的スキルシート自我PR内容填写，学历（千葉商科大学 商学科，2015.04–2019.03）也已加入信息卡片；如信息有变化可直接修改 `#about` 区域文字
- [x] **技能列表**：已按スキルシート中的技能等级（A〜E）填写，如有新技能可在对应分类下追加 `<span class="tag">`
- [x] **职务经历**：已根据スキルシート中的 6 段项目经历填写为时间线，并按所属公司分组（マンパワーグループ株式会社 2022.02–現在 / 株式会社ウイズ・ワン 2019–2021.10）；出生日期、最寄车站等隐私信息未收录。如有新项目，可在 `#career` 区域对应公司分组下按现有格式追加 `.timeline-item`；如加入新公司，可复制 `.timeline-company` 结构新增一组
- [x] **页脚姓名**：已更新为「張美琪」
- [x] **简历下载按钮**：已链接到 `assets/docs/resume.pdf`（职务经历书），点击会直接下载；如需更新简历内容，直接替换该 PDF 文件（保持同名）即可
- [ ] **favicon（可选）**：`assets/favicon.svg` 当前为「ZM」文字图标，可替换为自定义图标
- [ ] **SEO 描述（可选）**：`<head>` 中的 `<meta name="description">` 可按需精简调整

## 个人项目板块

`#projects` 区域（职务经历之后、联系方式之前）用卡片形式展示可公开的个人开发项目，与客户项目的职务经历区分开。目前收录了 1 个项目：

- **Webデータ変動監視ツール**（[GitHub](https://github.com/qimeimeiqi-hash/monitor-app) / [デモ](https://qimeimeiqi-hash.github.io/monitor-app/)）：Web ページの内容変化・日本五大商社株価の 2 か月最安値監視ツール。GitHub Actions + Resend + Chart.js + GitHub Pages 构建，零成本运行。

以后要追加新项目，在 `index.html` 的 `.project-grid` 内复制一份 `.project-card` 结构即可（标题、`.project-card-badge` 标签、描述、`.tag-cloud` 技术标签、`.project-card-links` 里的按钮链接），样式和响应式布局会自动适配，不需要改 CSS/JS。

## 后续可扩展方向

- **博客 / 文章列表**：等有实际文章后再加，避免出现空列表
- **推荐语 / 评价**：视情况取舍
- **个人项目 / 开源作品**：✅ 已添加，见下方「个人项目板块」小节

## 技术说明

- 全部使用原生 HTML / CSS / JavaScript，未引入任何第三方库或框架
- 暗色模式通过 `prefers-color-scheme` 媒体查询自动跟随系统设置，无需手动切换
- 导航高亮、滚动淡入动画通过 `IntersectionObserver` 实现
