# 🌱 Bulma-Garden

!\[Bulma](https://img.shields.io/badge/Bulma-1.0.2-00d1b2?style=flat-square\&logo=bulma)
!\[Vanilla JS](https://img.shields.io/badge/Vanilla\_JS-ES6+-f7df1e?style=flat-square\&logo=javascript)
!\[License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)
!\[PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)

这是一个基于 **Bulma CSS** 和 **原生 JavaScript** 构建的纯静态个人博客系统。无需任何构建工具（Webpack/Vite/Nuxt），不需要数据库，双击即可运行，完美适配 GitHub Pages 等静态托管服务。



## ✨ 特性 (Features)



* **极简架构**：HTML + CSS + 原生 JS，零依赖，拒绝臃肿。
* **内容与视图分离**：文章数据统一交由 JSON 管理，前端负责渲染。
* **系列教程管理**：支持按 `series` 分组，内置手风琴折叠与系列独立分页。
* **灵活排序**：支持基于时间（正序/倒序）或自定义 ID（`order`）排序。
* **深色模式**：完美适配系统偏好，支持手动一键切换并记忆至 `localStorage`。
* **全文搜索**：基于 JSON 索引的本地全文搜索，支持 `Ctrl+K` 快速唤起。
* **沉浸式阅读**：自动生成目录（TOC）、阅读进度条、阅读时长估算、图片点击放大（Lightbox）、代码一键复制。
* **无缝部署**：支持直接双击 `index.html` 预览（自带兜底数据），也支持本地服务器运行。



## 📂 目录结构



```text

my-blog/

├── index.html                 # 首页（文章列表、侧边栏）

├── post.html                  # 文章详情页

├── about.html                 # 关于页

├── projects.html              # 项目页

├── links.html                 # 友链页

├── 404.html                   # 404 错误页

├── config.json                # 站点全局配置（标题、作者、导航、默认排序等）

├── projects.json              # 项目数据

├── links.json                 # 友链数据

├── custom.css                 # 唯一自定义 CSS（主题色、深色模式微调）

├── js/

│   ├── fallback-data.js       # 本地双击预览时的兜底数据

│   ├── common.js              # 公共逻辑（导航、主题、搜索、回顶部）

│   ├── home.js                # 首页逻辑

│   ├── post.js                # 详情页逻辑

│   ├── about.js               # 关于页逻辑

│   ├── projects.js            # 项目页逻辑

│   └── links.js               # 友链页逻辑

├── posts/

│   ├── index.json             # 文章索引清单（脚本自动生成）

│   ├── search-index.json      # 全文搜索索引（脚本自动生成）

│   ├── bulma-01.md            # 示例文章 1

│   └── ...                    # 更多 Markdown 文章

└── scripts/

\\\&#x20;   ├── generate-index.js      # 扫描 md 生成文章清单与搜索索引

\\\&#x20;   └── generate-rss.js        # 生成 RSS 订阅文件

```



## 🚀 快速开始



### 方式一：本地直接预览（推荐用于快速查看）

直接双击打开 `index.html`。

*(注：由于浏览器 `file://` 安全限制，详情页的动态 Markdown 渲染会被拦截，首页列表将读取 `fallback-data.js` 中的兜底数据。)*



### 方式二：本地服务器运行（完整功能体验）

在项目目录下运行以下命令启动本地服务器：

```bash

# 如果安装了 Python

python -m http.server 8000



# 或者使用 Node.js

npx serve .

```

然后访问 `http://localhost:8000`，体验完整的 Markdown 渲染与全文搜索。



## 📝 写作与数据更新指南



### 新增一篇文章

1. 在 `posts/` 目录下新建 Markdown 文件，文件名即 URL 的 slug（如 `css-flexbox.md`）。
2. 文件头部必须包含规范的 Front-matter：

```markdown

---

title: 深入理解 Flexbox 布局

date: 2025-11-01

order: 8 # 可选：用于自定义排序

tags: \\\[前端, CSS, 布局]

series: CSS 进阶之路 # 可选：系列名称

summary: 一句话摘要，用于列表页展示。

---

# 正文标题



这里是正文内容...

```

3. 运行脚本更新文章索引：

```bash

node scripts/generate-index.js

```

*(该脚本会自动更新 `posts/index.json`、`posts/search-index.json` 以及 `js/fallback-data.js` 中的兜底数据)*



### 修改站点配置 (config.json)

打开 `config.json`，你可以修改：

* `siteTitle`：站点标题
* `author`：作者信息（姓名、头像、简介、邮箱）
* `nav`：顶部导航菜单
* `social`：社交链接（GitHub、Twitter 等）
* `defaultSort`：全局默认排序方式（`"asc"` 时间正序 / `"desc"` 时间倒序 / `"order"` 自定义 ID）
* `theme`：主题色 HSL 值



### 修改主题色 / 样式

* **改颜色**：修改 `config.json` 中的 `theme` 字段，或者直接修改 `custom.css` 的 `:root` 变量。
* **改排版**：打开 `custom.css`，代码按功能模块做了非常清晰的注释划分，直接修改对应区域的 CSS 即可。



### 新增项目 / 友链

* 项目：编辑 `projects.json`，在数组中添加对象即可。
* 友链：编辑 `links.json`，在数组中添加对象即可。



## 🌐 部署到 GitHub Pages



1. 在 GitHub 上创建一个新仓库，并将本项目代码推送到 `main` 分支。
2. 打开仓库的 **Settings** -> **Pages**。
3. 在 **Build and deployment** 下：

&#x20;  - Source 选择 `Deploy from a branch`。

&#x20;  - Branch 选择 `main`，目录选择 `/ (root)`。

4. 点击 Save，等待一两分钟，你的博客就会发布在 `https://你的用户名.github.io/仓库名/`。



## 📄 许可协议



本项目基于 [MIT License](https://opensource.org/licenses/MIT) 开源。博客文章内容基于 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 许可。

