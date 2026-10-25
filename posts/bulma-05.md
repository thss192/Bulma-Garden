---
title: 05 - 导航栏（Navbar）与响应式菜单
date: 2025-10-29
order: 5
tags: [前端, 教程, Bulma, 导航]
series: Bulma 深入浅出
summary: 打造完美的顶部导航与侧边菜单，适配移动端汉堡按钮。
---
# 导航栏（Navbar）与响应式菜单

一个网站的灵魂之一是导航。Bulma 的 `navbar` 组件非常强大，它内置了移动端的折叠逻辑，但需要你写一点点 JavaScript 来触发。

## 1. 导航栏基础结构

`navbar` 主要由两部分组成：`navbar-brand`（左侧 Logo 和移动端汉堡按钮）以及 `navbar-menu`（右侧链接集合）。

~~~html
<nav class="navbar" role="navigation">
  <div class="navbar-brand">
    <a class="navbar-item" href="#">
      <strong>MySite</strong>
    </a>
    <!-- 移动端汉堡按钮 -->
    <a role="button" class="navbar-burger" aria-label="menu">
      <span aria-hidden="true"></span><span aria-hidden="true"></span><span aria-hidden="true"></span>
    </a>
  </div>
  <div class="navbar-menu">
    <div class="navbar-start">
      <a class="navbar-item">首页</a>
      <a class="navbar-item">关于</a>
    </div>
  </div>
</nav>
~~~

## 2. 如何让它工作？

Bulma 本身不包含 JS。你需要写一段简短的脚本：

~~~javascript
document.addEventListener('DOMContentLoaded', () => {
  const burger = document.querySelector('.navbar-burger');
  const menu = document.querySelector('.navbar-menu');
  burger.addEventListener('click', () => {
    burger.classList.toggle('is-active');
    menu.classList.toggle('is-active');
  });
});
~~~

## 3. 侧边菜单（Menu）

如果是后台系统，通常使用垂直的 `menu` 组件：

~~~html
<aside class="menu">
  <p class="menu-label">常规管理</p>
  <ul class="menu-list">
    <li><a class="is-active">控制台</a></li>
    <li><a>文章管理</a></li>
  </ul>
</aside>
~~~

