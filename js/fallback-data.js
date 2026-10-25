// 终极兜底数据：用于 file:// 双击预览时绕过 CORS 限制

// 1. 站点配置兜底
window.__CONFIG__ = {
  "siteTitle": "我的个人博客",
  "siteSubtitle": "记录代码与生活",
  "siteUrl": "https://your-domain.com",
  "author": {
    "name": "张三",
    "bio": "前端开发者，喜欢 CSS 和咖啡。",
    "avatar": "images/avatar.png",
    "email": "zhangsan@example.com",
    "startYear": 2021,
    "skills": [
      "全栈开发"
    ],
    "about": {
      "greeting": "你好，我是 {name} 👋",
      "paragraphs": [
        "欢迎来到我的数字花园。我是一名热爱技术、喜欢折腾的开发者。在这里，我会记录我在编程路上的所学、所思、所想。",
        "如果你对我的文章感兴趣，或者有项目想要合作，欢迎随时通过邮件与我联系。"
      ],
      "contactTitle": "联系我"
    }
  },
  "nav": [
    {
      "label": "首页",
      "href": "index.html"
    },
    {
      "label": "项目",
      "href": "projects.html"
    },
    {
      "label": "友链",
      "href": "links.html"
    },
    {
      "label": "关于",
      "href": "about.html"
    }
  ],
  "social": [
    {
      "label": "GitHub",
      "href": "https://github.com/",
      "icon": "fab fa-github"
    },
    {
      "label": "Twitter",
      "href": "https://twitter.com/",
      "icon": "fab fa-twitter"
    }
  ],
  "theme": {
    "primary": {
      "h": 171,
      "s": 100,
      "l": 41
    },
    "link": {
      "h": 233,
      "s": 100,
      "l": 63
    }
  },
  "defaultSort": "asc",
  "hero": {
    "title": "你好，欢迎来到我的数字花园 🌱",
    "subtitle": "记录代码、思考与生活的碎片。"
  },
  "pageCopy": {
    "projectsPage": {
      "title": "开源项目",
      "subtitle": "这里记录了我做过的一些开源项目与实战作品。"
    },
    "linksPage": {
      "title": "连接",
      "subtitle": "互联网是一座座孤岛，友链让我们连成大陆。",
      "neighborsTitle": "我的邻居们",
      "mySitesTitle": "我的阵地",
      "exchangeTitle": "交换友链？",
      "exchangeNote": "如果你也有自己的博客，欢迎发邮件与我交换友链！"
    },
    "aboutPage": {
      "title": "关于我"
    },
    "page404": {
      "code": "404",
      "title": "哎呀，页面走丢了...",
      "description": "你要找的页面可能被外星人抓走了，或者你输入了错误的地址。",
      "backHome": "返回首页"
    }
  },
  "postLicense": {
    "name": "CC BY-NC-SA 4.0",
    "url": "https://creativecommons.org/licenses/by-nc-sa/4.0/",
    "text": "本文《{title}》采用 {name} 许可协议。",
    "publishedText": "发布于 {date} · 作者保留所有权利，转载请注明出处。",
    "copyLink": "复制本文链接"
  }
};// 2. 文章列表兜底
window.__POSTS_FALLBACK__ = [
  {
    "slug": "bulma-01",
    "title": "01 - Bulma 的核心概念与安装",
    "date": "2025-10-25",
    "order": 1,
    "tags": [
      "前端",
      "教程",
      "Bulma"
    ],
    "series": "Bulma 深入浅出",
    "summary": "了解 Bulma 的纯 CSS 设计哲学，以及如何通过 CDN 快速引入。"
  },
  {
    "slug": "bulma-02",
    "title": "02 - 强大的栅格系统与列布局",
    "date": "2025-10-26",
    "order": 2,
    "tags": [
      "前端",
      "教程",
      "Bulma",
      "布局"
    ],
    "series": "Bulma 深入浅出",
    "summary": "掌握 Columns 和 Grid，轻松实现响应式网页布局。"
  },
  {
    "slug": "bulma-03",
    "title": "03 - 表单组件全解析：构建优雅的用户输入",
    "date": "2025-10-27",
    "order": 3,
    "tags": [
      "前端",
      "教程",
      "Bulma",
      "表单"
    ],
    "series": "Bulma 深入浅出",
    "summary": "输入框、下拉菜单、复选框以及如何优雅地排版表单。"
  },
  {
    "slug": "bulma-04",
    "title": "04 - 常用 UI 元素与卡片设计",
    "date": "2025-10-28",
    "order": 4,
    "tags": [
      "前端",
      "教程",
      "Bulma",
      "UI"
    ],
    "series": "Bulma 深入浅出",
    "summary": "使用 Box、Notification、Tag 和 Card 搭建美观的内容区块。"
  },
  {
    "slug": "bulma-05",
    "title": "05 - 导航栏（Navbar）与响应式菜单",
    "date": "2025-10-29",
    "order": 5,
    "tags": [
      "前端",
      "教程",
      "Bulma",
      "导航"
    ],
    "series": "Bulma 深入浅出",
    "summary": "打造完美的顶部导航与侧边菜单，适配移动端汉堡按钮。"
  },
  {
    "slug": "bulma-06",
    "title": "06 - 模态框（Modal）与消息提示（Message）",
    "date": "2025-10-30",
    "order": 6,
    "tags": [
      "前端",
      "教程",
      "Bulma",
      "交互"
    ],
    "series": "Bulma 深入浅出",
    "summary": "如何使用 Bulma 的弹窗覆盖层与组合式消息提示组件。"
  },
  {
    "slug": "bulma-07",
    "title": "07 - 使用 CSS 变量进行主题定制",
    "date": "2025-10-31",
    "order": 7,
    "tags": [
      "前端",
      "教程",
      "Bulma",
      "主题"
    ],
    "series": "Bulma 深入浅出",
    "summary": "拥抱 Bulma v1，通过简单的 CSS 变量覆盖，实现一键换肤与深色模式。"
  },
  {
    "slug": "bulma-tutorial",
    "title": "一篇介绍 Bulma 的教程文章",
    "date": "2025-10-25",
    "order": 9999,
    "tags": [
      "前端",
      "CSS",
      "Bulma"
    ],
    "series": "",
    "summary": "本文带你快速了解 Bulma 框架的核心概念，包括变量、网格和响应式设计。"
  },
  {
    "slug": "hello-world",
    "title": "你好，世界",
    "date": "2025-01-01",
    "order": 9999,
    "tags": [
      "随笔",
      "开始"
    ],
    "series": "",
    "summary": "这是第一篇示例文章。"
  },
  {
    "slug": "second-post",
    "title": "第二篇文章",
    "date": "2025-01-05",
    "order": 9999,
    "tags": [
      "技术"
    ],
    "series": "",
    "summary": "演示多篇文章的列表渲染。"
  }
];

// 3. 项目兜底
window.__PROJECTS_FALLBACK__ = [
  { "name": "My Blog", "description": "基于 Bulma 的纯静态博客。", "url": "https://github.com/", "tags": ["HTML", "Bulma"] },
  { "name": "Todo App", "description": "原生 JS 待办应用。", "url": "https://github.com/", "tags": ["JS"] }
];

// 4. 友链兜底
window.__LINKS_FALLBACK__ = [
  { "name": "Bulma", "url": "https://bulma.io", "description": "现代 CSS 框架。" },
  { "name": "MDN", "url": "https://developer.mozilla.org", "description": "Web 文档。" }
];

// 5. 搜索索引兜底（如果你需要本地双击使用全文搜索，这个数据会很大，这里仅做示例）
// 实际上搜索通常需要起服务器，双击状态下如果搜索，就用这里的数据
window.__SEARCH_FALLBACK__ = [
  { "slug": "bulma-01", "title": "01 - Bulma 的核心概念与安装", "content": "第一节：基础 这里是正文内容。" },
  { "slug": "bulma-02", "title": "02 - 强大的栅格系统与列布局", "date": "2025-10-26", "content": "第二节：栅格 这里是正文内容。" }
];
