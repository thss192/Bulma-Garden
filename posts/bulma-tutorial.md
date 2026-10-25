---

title: 一篇介绍 Bulma 的教程文章

date: 2025-10-25

tags: [前端, CSS, Bulma]

summary: 本文带你快速了解 Bulma 框架的核心概念，包括变量、网格和响应式设计。

---

# 一篇介绍 Bulma 的教程文章



Bulma 是一个基于 Flexbox 的现代 CSS 框架，它不包含任何 JavaScript 代码，完全依赖 CSS 类名来实现布局和交互。



## 为什么选择 Bulma？



相比于 Bootstrap，Bulma 更加轻量，而且它所有的样式都基于 Sass 变量和 CSS 变量，自定义起来非常方便。



- 纯 CSS 框架，没有 JS 依赖

- 支持原生的深色模式

- 模块化引入，按需使用



## 安装与引入



你可以通过 CDN 直接引入 Bulma，这也是我们这个博客使用的方式：



```html

<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@1.0.2/css/bulma.min.css" />

```



## 栅格系统示例



Bulma 的列系统非常强大，通过简单的类名就能实现响应式布局：



```html

<div class="columns">

&#x20; <div class="column">第一列</div>

&#x20; <div class="column">第二列</div>

</div>

```



## 总结



Bulma 的优雅之处在于它“只做 CSS 该做的事”。结合原生 JS，你能构建出非常轻量且现代的静态站点。

