---
title: 07 - 使用 CSS 变量进行主题定制
date: 2025-10-31
order: 7
tags: [前端, 教程, Bulma, 主题]
series: Bulma 深入浅出
summary: 拥抱 Bulma v1，通过简单的 CSS 变量覆盖，实现一键换肤与深色模式。
---
# 使用 CSS 变量进行主题定制

在 Bulma v1 中，所有的颜色、字体、间距都被转换成了 CSS 变量（CSS Custom Properties）。这意味着你不需要重新编译 Sass，直接在 CSS 里修改即可。

## 1. 修改主色调

假设你想把网站的主题色从默认的薄荷绿改成紫色，只需要在 `:root` 中覆盖它的 HSL 变量：

~~~css
:root {
  /* 原来的绿：hsl(171, 100%, 41%) */
  /* 改为紫色 */
  --bulma-primary-h: 280;
  --bulma-primary-s: 80%;
  --bulma-primary-l: 50%;
}
~~~

保存后，全站所有的按钮、链接高亮都会瞬间变紫。

## 2. 黑魔法：`soft` 与 `bold`

Bulma 提供了一组极其聪明的辅助变量。在浅色模式下，`soft` 是浅色，在深色模式下自动变成深色。

~~~css
/* 完美的标签设计 */
.my-custom-tag {
  background-color: var(--bulma-primary-soft);
  color: var(--bulma-primary-bold);
}
~~~

## 3. 深度兼容的深色模式

通过 `[data-theme="dark"]` 选择器，你可以为深色模式单独覆写变量，而不影响浅色模式：

~~~css
[data-theme="dark"] body {
  background-color: #121212;
}

[data-theme="dark"] .my-custom-tag {
  background-color: var(--bulma-primary-soft);
  color: var(--bulma-primary-bold);
}
~~~

这就是现代 CSS 框架的威力所在——极简、灵活、强大。

