---
title: 04 - 常用 UI 元素与卡片设计
date: 2025-10-28
order: 4
tags: [前端, 教程, Bulma, UI]
series: Bulma 深入浅出
summary: 使用 Box、Notification、Tag 和 Card 搭建美观的内容区块。
---
# 常用 UI 元素与卡片设计

在构建页面时，我们经常需要各种容器来划分内容。Bulma 提供了极其丰富的内置元素，让你不加一行自定义 CSS 也能做出极具现代感的 UI。

## 1. 基础容器：Box 与 Notification

**Box** 是一个带白底和阴影的简单容器，适合包裹模块：

~~~html
<div class="box">
  这是一块内容，常用于包裹侧边栏或者一段独立的信息。
</div>
~~~

**Notification** 是一个醒目的颜色块，非常适合做警告或提示：

~~~html
<div class="notification is-primary">
  这是一条主色调的通知，自带关闭按钮（需要自己写 JS 控制删除）。
</div>
~~~

## 2. 标签（Tags）

经常用来展示分类或者状态：

~~~html
<div class="tags">
  <span class="tag is-primary">前端</span>
  <span class="tag is-link">CSS</span>
  <span class="tag is-success is-light">已发布</span>
</div>
~~~

## 3. 经典的卡片（Card）

`Card` 是组合度极高的组件，通常包含头部、图片、内容和底部操作区：

~~~html
<div class="card">
  <div class="card-image">
    <figure class="image is-4by3">
      <img src="https://bulma.io/assets/images/placeholders/1280x960.png" alt="封面">
    </figure>
  </div>
  <div class="card-content">
    <div class="media">
      <div class="media-content">
        <p class="title is-4">文章标题</p>
        <p class="subtitle is-6">@zhangsan</p>
      </div>
    </div>
    <div class="content">
      这里是文章的摘要内容，非常清晰明了。
      <a href="#">#前端</a> <a href="#">#技术</a>
    </div>
  </div>
  <footer class="card-footer">
    <a href="#" class="card-footer-item">阅读</a>
    <a href="#" class="card-footer-item">分享</a>
  </footer>
</div>
~~~

