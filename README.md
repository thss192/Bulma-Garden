# 🌱 Bulma-Garden

![Bulma](https://img.shields.io/badge/Bulma-1.0.2-00d1b2?style=flat-square&logo=bulma)
![Vanilla JS](https://img.shields.io/badge/Vanilla_JS-ES6+-f7df1e?style=flat-square&logo=javascript)
![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)

这是一个基于 **Bulma CSS** 和 **原生 JavaScript** 构建的纯静态个人博客系统。无需任何构建工具（Webpack/Vite/Nuxt），不需要数据库，双击即可运行，完美适配 GitHub Pages 等静态托管服务。

## ✨ 特性 (Features)

* **极简架构**：HTML + CSS + 原生 JS，零依赖，拒绝臃肿。
* **数据与视图彻底分离**：全站所有文案、标题、项目、友链均由 `config.json` 或独立 JSON 文件驱动，HTML 仅作骨架。
* **双通道数据源**：内置 `fallback-data.js` 兜底机制，完美兼顾“本地双击预览”与“服务器真实渲染”两种场景。
* **系列教程管理**：支持按 `series` 分组，内置手风琴折叠与系列独立分页。
* **灵活排序**：支持基于时间（正序/倒序）或自定义 ID（`order`）排序。
* **深色模式**：完美适配系统偏好，支持手动一键切换并记忆至 `localStorage`。
* **全文搜索**：基于 JSON 索引的本地全文搜索，支持 `Ctrl+K` 快速唤起。
* **沉浸式阅读**：自动生成目录（TOC）、阅读进度条、阅读时长估算、图片点击放大（Lightbox）、代码一键复制。

## 📂 目录结构

~~~text
my-blog/
├── index.html                 # 首页（文章列表、侧边栏）
├── post.html                  # 文章详情页
├── about.html                 # 关于页
├── projects.html              # 项目页
├── links.html                 # 友链页
├── 404.html                   # 404 错误页
├── config.json                # 站点全局配置（标题、作者、导航、全站文案等）
├── projects.json              # 项目数据（含图标配置）
├── links.json                 # 友链数据
├── rss.xml                    # 自动生成的 RSS 订阅
├── custom.css                 # 唯一自定义 CSS（主题色、深色模式微调）
├── js/
│   ├── fallback-data.js       # 本地双击预览时的兜底数据（由脚本生成）
│   ├── common.js              # 公共逻辑（导航、主题、搜索、回顶部、404文案）
│   ├── home.js                # 首页逻辑（Hero、侧边栏、文章列表）
│   ├── post.js                # 详情页逻辑（Markdown解析、TOC、许可协议）
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

## 🚀 快速开始

### 方式一：本地直接预览

直接双击打开 `index.html`。

*(注：由于浏览器 `file://` 安全限制，页面会自动加载 `fallback-data.js` 中的兜底数据，因此文章列表、项目、友链均能正常展示，但**文章详情页无法读取本地 .md 文件**。)*

### 方式二：本地服务器运行（完整功能体验）

在项目目录下运行以下命令启动本地服务器：

~~~bash
# 如果安装了 Python
python -m http.server 8000

# 或者使用 Node.js
npx serve .
~~~

然后访问 `http://localhost:8000`，体验完整的 Markdown 渲染与全文搜索。

## 📝 写作与数据更新指南

### 1. 新增一篇文章

1. 在 `posts/` 目录下新建 Markdown 文件，文件名即 URL 的 slug（如 `css-flexbox.md`）。
2. 文件头部必须包含规范的 Front-matter：

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

3. 运行脚本更新文章索引与兜底数据：

~~~bash
node scripts/generate-index.js
~~~

*(该脚本会自动更新 `posts/index.json`、`posts/search-index.json` 以及 `js/fallback-data.js` 中的 `__POSTS_FALLBACK__` 和 `__CONFIG__`)*

### 2. 修改站点配置 (config.json)

打开 `config.json`，你可以修改以下内容（修改后**必须**运行 `node scripts/generate-index.js` 才能在双击预览时生效，起服务器则无需运行）：

* `siteTitle` / `siteSubtitle` / `siteUrl`：站点基本信息
* `author`：作者信息（姓名、头像、简介、邮箱、**起始年份(startYear)**、**技能标签(skills)**、**关于页长文(about)**）
* `hero`：**首页首屏的标题与副标题**
* `pageCopy`：**各页面的文案**（如项目页标题、友链页标题与提示语、404页面文案等）
* `postLicense`：**文章底部的版权许可协议文案**
* `nav` / `social`：导航菜单与社交链接
* `theme`：主题色 HSL 值
* `defaultSort`：全局默认排序方式（`"asc"` 时间正序 / `"desc"` 时间倒序 / `"order"` 自定义 ID）

### 3. 修改项目 / 友链

* **项目**：编辑 `projects.json`，在数组中添加对象。支持 `icon` 字段（FontAwesome 类名，如 `fa-rocket`，不填则默认 `fa-cube`）。
* **友链**：编辑 `links.json`，在数组中添加对象。

## 🛠️ 脚本用法补充

~~~bash
# 生成清单（会写入 index.json、search-index.json、fallback-data.js）
node scripts/generate-index.js

# 只解析不写入，用于验证解析结果对不对（不会改动任何文件）
node scripts/generate-index.js --dry-run

# 生成 RSS 订阅文件（需在 config.json 中配置正确的 siteUrl）
node scripts/generate-rss.js
~~~

## 🌐 部署到 GitHub Pages

1. 在 GitHub 上创建一个新仓库，并将本项目代码推送到 `main` 分支。
2. 打开仓库的 **Settings** -> **Pages**。
3. 在 **Build and deployment** 下：
   - Source 选择 `Deploy from a branch`。
   - Branch 选择 `main`，目录选择 `/ (root)`。
4. 点击 Save，等待一两分钟，你的博客就会发布在 `https://你的用户名.github.io/仓库名/`。

## 🐛 已知问题与路线图

### 已修复
- [x] `post.js` 缺失 `loadPostIndex` 导致上下篇静默不显示
- [x] `generate-index.js` 不同步 `fallback-data.js`
- [x] `config.json` 的 `defaultSort` 对首页排序不生效
- [x] `404.html` 未引 `fallback-data.js` 导致导航栏为空
- [x] `generate-rss.js` 的 `SITE_URL` 硬编码
- [x] `config.json` 带 BOM 导致 `JSON.parse` 失败
- [x] **完成数据与 HTML 彻底分离，所有文案由 config 驱动**
- [x] **修复本地双击白屏问题，完善 fetch 异常降级**

### 待处理
- [ ] `search-index.json` 在 `file://` 下无法加载，搜索只能依赖示例兜底数据
- [ ] 详情页在 `file://` 下无法读取 `.md`，需起本地服务器
- [ ] 缺少单元测试（front-matter 解析、清单生成）
- [ ] 渲染 Markdown 时未做 XSS 防护（`marked.parse` 结果直接 `innerHTML`）

## 📄 许可协议

本项目基于 [MIT License](https://opensource.org/licenses/MIT) 开源。博客文章内容基于 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 许可。
