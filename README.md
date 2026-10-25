# 🌱 Bulma-Garden

![Bulma](https://img.shields.io/badge/Bulma-1.0.2-00d1b2?style=flat-square&logo=bulma)
![Vanilla JS](https://img.shields.io/badge/Vanilla_JS-ES6+-f7df1e?style=flat-square&logo=javascript)
![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)

这是一个基于 **Bulma CSS** 和 **原生 JavaScript** 构建的纯静态个人博客系统。无需任何构建工具（Webpack/Vite/Nuxt），不需要数据库，双击即可运行，完美适配 GitHub Pages 等静态托管服务。

## ✨ 特性 (Features)

* **多主题与多配色**：支持亮暗模式切换，内置 **6 套精选配色**（薄荷、森林、樱花、海洋、落日、极简），记忆用户选择，毫无冲突。
* **动态粒子特效**：左下角面板可切换**星空、爱心、花朵**等背景飘落特效，支持点击爆炸扩散（已深度性能优化，完全不卡顿），并支持**透明度实时调节**。
* **动态首页**：Hero 标题支持**打字机逐字渲染**（完美支持 Emoji），侧边栏集成**时间感知问候**（早上好/夜深了）。
* **极简架构**：HTML + CSS + 原生 JS，零依赖，拒绝臃肿。
* **数据与视图分离**：全站文案、项目、友链、功能开关均由 `config.json` 等 JSON 文件驱动。
* **通用化组件**：利用 Web Components 封装了 `<code-block>`，样式完全隔离，方便代码复用。
* **沉浸式阅读**：自动生成目录（TOC）、阅读进度条、阅读时长估算、图片点击放大（Lightbox）。
* **全文搜索**：基于 JSON 索引的本地全文搜索，支持 `Ctrl+K` 快速唤起。

## 📂 目录结构

~~~text
my-blog/
├── index.html                 # 首页（文章列表、侧边栏）
├── post.html                  # 文章详情页
├── about.html                 # 关于页
├── projects.html              # 项目页
├── links.html                 # 友链页
├── 404.html                   # 404 错误页
├── config.json                # 站点全局配置（标题、作者、功能开关、全站文案等）
├── projects.json              # 项目数据
├── links.json                 # 友链数据
├── rss.xml                    # 自动生成的 RSS 订阅
├── custom.css                 # 核心自定义样式（全局、深浅模式组件微调）
├── custom-themes.css          # 主题配色面板与主题变量、特效面板样式
├── dev.js                     # 本地数据监听同步脚本
├── js/
│   ├── fallback-data.js       # 本地双击预览时的兜底数据
│   ├── common.js              # 公共逻辑（导航、主题状态应用、搜索模态框）
│   ├── theme.js               # 左下角调色盘与特效面板交互
│   ├── effects.js             # 高性能粒子特效引擎 (Canvas)
│   ├── home.js                # 首页逻辑（打字机、动态问候、文章列表）
│   ├── post.js                # 详情页逻辑（Markdown解析、CodeBlock组件、TOC）
│   ├── about.js               # 关于页逻辑
│   ├── projects.js            # 项目页逻辑
│   └── links.js               # 友链页逻辑
├── posts/
│   ├── index.json             # 文章索引清单（脚本自动生成）
│   ├── search-index.json      # 全文搜索索引（脚本自动生成）
│   └── *.md                   # Markdown 文章
└── scripts/
    ├── generate-index.js      # 扫描 md，生成清单、搜索索引，并同步至 fallback-data.js
    └── generate-rss.js        # 生成 RSS 订阅文件
~~~

## 🚀 快速开始与开发指南

### 推荐开发方式：VSCode + 自动同步（丝滑体验）

1. **启动数据监听**：在 VSCode 终端运行 `node dev.js`。它会监听 `config.json`、`posts/` 等文件的改动，一旦保存，立刻自动执行 `generate-index.js` 更新数据。
2. **启动本地服务器**：安装 VSCode 插件 **Live Server**，右键 `index.html` -> `Open with Live Server`。
3. **开始写作/调试**：修改配置或保存 Markdown 文件，浏览器会自动刷新，所见即所得。

### 方式二：一键启动本地服务器

1. 确保没有其他程序占用 8000 端口。
2. 双击 `start.bat`，它会自动启动内置的 `dev.js` 服务器并打开浏览器。
3. 访问 `http://localhost:8000`。

## 📝 写作与配置指南

### 1. 新增一篇文章

在 `posts/` 目录下新建 Markdown 文件（如 `css-flexbox.md`），文件头部必须包含规范的 Front-matter：

~~~markdown
---
title: 深入理解 Flexbox 布局
date: 2025-11-01
order: 8 # 可选：用于自定义排序
tags: [前端, CSS, 布局]
series: CSS 进阶之路 # 可选：系列名称
summary: 一句话摘要，用于列表页展示。
---
# 正文标题

这里是正文内容...
~~~

保存后，运行 `node scripts/generate-index.js` 或在 `dev.js` 监听下自动更新数据。

### 2. 修改站点配置 (config.json)

* `siteTitle` / `siteSubtitle` / `siteUrl`：站点基本信息
* `author`：作者信息（姓名、头像、简介、邮箱、起始年份、技能标签、关于页长文）
* `features`：**功能开关** (例如 `"effects": true`, `"search": true`, `"backToTop": true`)。你可以自由关闭不需要的模块。
* `hero`：首页首屏的标题与副标题（打字机效果的数据来源）
* `pageCopy`：各页面的文案
* `postLicense`：文章底部的版权许可协议文案
* `theme`：主题色 HSL 默认值

### 3. 个性化你的视觉

* 直接点击页面左下角的 🎨 按钮，可以自由切换**亮暗模式**、**6 种配色**以及**粒子特效**。
* 所有的偏好设置都会自动保存在本地 `localStorage` 中，下次访问依然生效。

## 🌐 部署到 GitHub Pages

1. 在 GitHub 上创建一个新仓库，并将本项目代码推送到 `main` 分支。
2. 打开仓库的 **Settings** -> **Pages**。
3. 在 **Build and deployment** 下：
   - Source 选择 `Deploy from a branch`。
   - Branch 选择 `main`，目录选择 `/ (root)`。
4. 点击 Save，等待一两分钟，你的博客就会发布在 `https://你的用户名.github.io/仓库名/`。

## 🐛 已知问题与路线图

### 已修复与新增
- [x] 粒子特效引擎重构（移除高耗能阴影，增加内存限制与 RGB 缓存，大幅提升渲染性能）
- [x] 主题状态冲突修复（完全解耦状态管理，确保选中态即时响应）
- [x] 防闪烁处理（Anti-FOUC 脚本注入）
- [x] 通用化功能开关（在 config.json 中通过 features 节点关闭特定模块）
- [x] 通用化代码块组件 `<code-block>`
- [x] 动态首页效果（打字机与时间段问候）

### 待处理
- [ ] `search-index.json` 在 `file://` 下无法加载，搜索只能依赖示例兜底数据
- [ ] 渲染 Markdown 时未做 XSS 防护（`marked.parse` 结果直接 `innerHTML`）

## 📄 许可协议

本项目基于 [MIT License](https://opensource.org/licenses/MIT) 开源。博客文章内容基于 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 许可。
