---
title: 06 - 模态框（Modal）与消息提示（Message）
date: 2025-10-30
order: 6
tags: [前端, 教程, Bulma, 交互]
series: Bulma 深入浅出
summary: 如何使用 Bulma 的弹窗覆盖层与组合式消息提示组件。
---
# 模态框（Modal）与消息提示（Message）

在现代 Web 体验中，弹窗是不可或缺的。Bulma 的 `modal` 组件默认隐藏，通过切换 `is-active` 类名就可以平滑呼出。

## 1. 模态框结构

模态框包含三个部分：背景遮罩（`modal-background`）、内容区（`modal-content` 或 `modal-card`）、关闭按钮。

~~~html
<div id="my-modal" class="modal">
  <div class="modal-background"></div>
  <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">提示</p>
      <button class="delete" aria-label="close"></button>
    </header>
    <section class="modal-card-body">
      确定要删除这条记录吗？此操作不可撤销。
    </section>
    <footer class="modal-card-foot">
      <button class="button is-danger">删除</button>
      <button class="button">取消</button>
    </footer>
  </div>
</div>
~~~

## 2. 用 JS 控制它

~~~javascript
const modal = document.getElementById('my-modal');
// 打开
document.getElementById('open-btn').addEventListener('click', () => {
  modal.classList.add('is-active');
});
// 关闭
modal.querySelector('.delete').addEventListener('click', () => {
  modal.classList.remove('is-active');
});
~~~

## 3. 多部分消息组件

Message 非常适合用来展示一段带有标题的长文本说明：

~~~html
<article class="message is-warning">
  <div class="message-header">
    <p>系统通知</p>
    <button class="delete" aria-label="delete"></button>
  </div>
  <div class="message-body">
    您的服务器将于今晚 12 点进行例行维护，请提前保存工作。
  </div>
</article>
~~~

