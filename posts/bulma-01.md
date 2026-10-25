---
title: 01 - Bulma 的核心概念与安装
date: 2025-10-25
order: 1
tags: [前端, 教程, Bulma]
series: Bulma 深入浅出
summary: 了解 Bulma 的纯 CSS 设计哲学，以及如何通过 CDN 快速引入。
---
# Bulma 的核心概念与安装

Bulma 是一个基于 Flexbox 的现代 CSS 框架。与 Bootstrap 等框架最大的不同在于，**Bulma 完全没有任何 JavaScript 代码**，它只负责样式，将交互的控制权完全交还给开发者。

## 1. 为什么选择 Bulma？

- **极简与纯粹**：不需要引入 jQuery 或任何其他 JS 库。
- **基于 Flexbox**：栅格系统和组件布局极度灵活。
- **CSS 变量驱动**：Bulma v1 拥抱了 CSS 变量，极其容易定制主题。
- **自带深色模式**：原生支持自动检测和手动切换。

## 2. 引入 Bulma

最简单的引入方式是使用 CDN。你可以在 HTML 的 `<head>` 标签中加入以下代码：

~~~html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@1.0.2/css/bulma.min.css" />
~~~

如果你本地使用 Node.js，也可以通过 npm 安装：

~~~bash
npm install bulma
~~~

## 3. 入门示例

Bulma 的类名非常语义化。比如，创建一个按钮和一个输入框：

~~~html
<button class="button is-primary">主要按钮</button>
<input class="input" type="text" placeholder="请输入内容">
~~~

通过添加修饰符（如 `is-primary`、`is-small`），你可以快速改变元素的颜色和尺寸。

