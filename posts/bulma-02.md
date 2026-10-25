---
title: 02 - 强大的栅格系统与列布局
date: 2025-10-26
order: 2
tags: [前端, 教程, Bulma, 布局]
series: Bulma 深入浅出
summary: 掌握 Columns 和 Grid，轻松实现响应式网页布局。
---
# 强大的栅格系统与列布局

Web 开发中，布局是最基础也是最重要的一环。Bulma 提供了两套布局系统：**Columns（基于 Flexbox 的列系统）** 和 **Grid（基于 CSS Grid 的网格系统）**。

## 1. 基础 Columns

只需给父元素加上 `.columns`，子元素加上 `.column`，即可实现等宽列：

~~~html
<div class="columns">
  <div class="column">第一列</div>
  <div class="column">第二列</div>
  <div class="column">第三列</div>
</div>
~~~

## 2. 指定列宽

Bulma 支持分数（如 `is-half`、`is-one-third`）和 12 列系统（如 `is-4`、`is-8`）：

~~~html
<div class="columns">
  <div class="column is-4">占 4 份</div>
  <div class="column is-8">占 8 份</div>
</div>
~~~

## 3. 响应式布局

在移动端，列默认会垂直堆叠。如果你希望平板上占一半，桌面上占三分之一，可以叠加类名：

~~~html
<div class="columns">
  <div class="column is-full-mobile is-half-tablet is-one-third-desktop">
    响应式列
  </div>
</div>
~~~

## 4. 现代化 Grid 系统（v1 新增）

如果你喜欢 CSS Grid，Bulma v1 提供了一套更强大的 `grid`：

~~~html
<div class="grid is-col-min-10">
  <div class="cell">Cell 1</div>
  <div class="cell">Cell 2</div>
  <div class="cell">Cell 3</div>
</div>
~~~

`is-col-min-10` 表示每列最小宽度为 10rem，Bulma 会自动计算每行能放下几个格子，完全不用写复杂的媒体查询！

