---
title: 03 - 表单组件全解析：构建优雅的用户输入
date: 2025-10-27
order: 3
tags: [前端, 教程, Bulma, 表单]
series: Bulma 深入浅出
summary: 输入框、下拉菜单、复选框以及如何优雅地排版表单。
---
# 表单组件全解析：构建优雅的用户输入

表单是 Web 应用与用户交互的核心。Bulma 通过 `control` 和 `field` 两个容器，把表单的间距和对齐处理得井井有条。

## 1. 基础结构

一个完整的表单字段通常包含 `label`、`control`（包裹输入框）和 `help`（提示文字）。

~~~html
<div class="field">
  <label class="label">用户名</label>
  <div class="control">
    <input class="input" type="text" placeholder="请输入用户名">
  </div>
  <p class="help is-success">该用户名可用。</p>
</div>
~~~

## 2. 带有图标的输入框

想要输入框里带一个小图标？只需用 `has-icons-left` 修饰 `control`：

~~~html
<div class="control has-icons-left has-icons-right">
  <input class="input is-success" type="email" placeholder="Email">
  <span class="icon is-small is-left">
    <i class="fas fa-envelope"></i>
  </span>
  <span class="icon is-small is-right">
    <i class="fas fa-check"></i>
  </span>
</div>
~~~

## 3. 复合控件组合

使用 `has-addons` 可以让输入框和按钮紧紧贴合在一起：

~~~html
<div class="field has-addons">
  <div class="control is-expanded">
    <input class="input" type="text" placeholder="输入关键词">
  </div>
  <div class="control">
    <button class="button is-info">搜索</button>
  </div>
</div>
~~~

