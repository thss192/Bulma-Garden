<div align="center">

# 🌱 Bulma-Garden

**一个真正“零门槛、零依赖”的极简纯静态博客系统**

[![Bulma](https://img.shields.io/badge/Bulma-1.0.2-00d1b2?style=flat-square&logo=bulma)](https://bulma.io)
[![Vanilla JS](https://img.shields.io/badge/Vanilla_JS-ES6+-f7df1e?style=flat-square&logo=javascript)](#)
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](LICENSE.txt)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://github.com/thss192/Bulma-Garden/pulls)

🚀 **[在线预览 (Live Demo)](https://thss192.github.io/Bulma-Garden/)** 

*无需安装 Node.js，无需学习复杂的构建工具。只需改改 JSON 和 Markdown，就能拥有一个极简、优雅的个人数字花园。*

</div>

---

## ✨ 为什么选择 Bulma-Garden？

市面上有很多博客框架，但大部分需要你配置繁琐的 Node.js 环境、敲一堆看不懂的命令，或者学习新的框架语法。
**Bulma-Garden 的哲学是：“把简单还给写作”。**

你不需要懂前端工程化，只要你会打字、懂一点点 Markdown，你就能拥有一个极具现代感、丝滑流畅的个人主页。

### 💡 极致的简单方便 (Why it's easy)

- **改 JSON 就能变样**：全站的标题、作者信息、功能开关、导航菜单，全部写在 `config.json` 里。想换个网站名字？改一行字就行。
- **写 MD 就是发文**：文章全都在 `posts/` 文件夹下，用纯文本写 Markdown，保存即完成。
- **一键自动跟随**：Windows 用户只需双击 `start.bat`，脚本会自动打开 VSCode、启动本地服务器，并**实时监听你的所有改动**（甚至不用手动刷新浏览器，网页会自己变）。
- **零依赖，不折腾**：不用 `npm install`，没有 `node_modules`，没有任何第三方打包工具。扔到 GitHub Pages 就能直接上线。

### 🎨 惊艳的视觉体验 (Features)

- **动态视觉特效**：自带丝滑的 Canvas 粒子引擎（星空、爱心、花朵飘落），点击屏幕还有爆炸反馈，且性能极佳（稳定 60 帧）。
- **多主题与调色盘**：内置 6 套精选配色，完美支持亮暗模式一键切换。
- **生动的首页体验**：首页标题支持打字机逐字渲染（完美兼容 Emoji），侧边栏还有时间感知的问候语。
- **沉浸式阅读**：自动生成目录（TOC）、阅读进度条、代码高亮一键复制、图片点击放大。
- **极速全文搜索**：支持 `Ctrl+K` 唤醒本地全文搜索，找文章不用等。

---

## 📸 界面截图

<table align="center" style="border-collapse: collapse; border: none;">
  <tr>
    <td align="center" width="50%">
      <img src="images/screenshot-1.png" alt="首页亮色模式" width="100%" style="border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
      <br><sub>✨ 首页亮色模式</sub>
    </td>
    <td align="center" width="50%">
      <img src="images/screenshot-2.png" alt="文章暗色模式" width="100%" style="border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
      <br><sub>🌙 文章暗色模式</sub>
    </td>
  </tr>
  <tr>
    <td align="center" width="50%">
      <img src="images/screenshot-3.png" alt="自定义主题" width="100%" style="border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
      <br><sub>🎨 自定义主题与特效</sub>
    </td>
    <td align="center" width="50%">
      <img src="images/screenshot-4.png" alt="文章页面" width="100%" style="border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
      <br><sub>📝 沉浸式文章阅读</sub>
    </td>
  </tr>
</table>

## 🚀 快速开始 (Fork & Deploy)

想要拥有同款博客？只需要简单的三步：

### 第一步：克隆或 Fork 本仓库
将本项目下载到本地，或者直接 Fork 到你的 GitHub 账号下。

### 第二步：修改你的个人信息
打开 `config.json`，把你自己的信息替换进去：
~~~json
{
  "siteTitle": "你的博客名字",
  "author": {
    "name": "你的名字",
    "bio": "你的简介",
    "avatar": "images/avatar.png"
  },
  "features": {
    "effects": true,
    "search": true,
    "backToTop": true
  }
}
~~~

### 第三步：开始写作 & 部署
1. 在 `posts/` 目录下新建 `.md` 文件，写文章。
2. 运行 `node scripts/generate-index.js`（或使用本地开发流）更新文章索引。
3. 推送到 GitHub，在仓库设置中开启 **GitHub Pages**，即可发布！

---

## 🛠️ 本地开发指南（极简流）

如果你想在本地预览和调试，我们为你准备了“保姆级”流程：

1. **一键启动**：双击项目根目录下的 `start.bat`。
2. **自动工作区**：脚本会在后台静默启动数据监听器（`dev.js`），并自动打开 VSCode。
3. **极速刷新**：你在 VSCode 里修改任何文件（写文章、改配置、调 CSS），只要一按保存，浏览器页面会自动刷新，完全不需要手动切窗口按 F5。

*(注：macOS/Linux 用户，在终端运行 `node dev.js` 即可享受同等体验。)*

---

## 📂 目录结构说明

~~~text
Bulma-Garden/
├── index.html                 # 首页
├── post.html                  # 文章详情页
├── config.json                # 站点全局配置（作者信息、功能开关、配色等）
├── custom.css                 # 核心自定义样式
├── custom-themes.css          # 调色盘面板与多主题变量、特效面板样式
├── js/
│   ├── common.js              # 公共逻辑（导航、搜索、主题状态应用）
│   ├── theme.js               # 调色盘与特效面板交互
│   ├── effects.js             # 高性能 Canvas 粒子引擎
│   ├── home.js                # 首页逻辑（打字机、动态问候、列表渲染）
│   ├── post.js                # 详情页逻辑（Markdown、CodeBlock、TOC）
│   └── ...
├── posts/                     # 存放 Markdown 文章和自动生成的 JSON 索引
└── scripts/                   # Node.js 构建脚本（生成索引、生成 RSS）
~~~

---

## 🤝 参与贡献

如果你想为这个项目添加新的特效、重构代码或完善文档，非常欢迎提交 Pull Request！
1. Fork 本仓库
2. 创建你的分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启一个 Pull Request

---

## 📄 开源协议

- **代码**：基于 [MIT License](LICENSE.txt) 开源，你可以自由用于个人或商业项目。
- **博客文章内容**：基于 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 许可。

<div align="center">
  <i>用最纯粹的技术，建最优雅的花园。</i>
</div>
