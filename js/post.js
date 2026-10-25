// 文章详情页：支持系列独立排序、上下篇正确导航

function getSlug() {
  return new URLSearchParams(window.location.search).get("slug");
}

function parseFrontMatter(raw) {
  const m = raw.match(/^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/);
  if (!m) return { meta: {}, body: raw };
  const meta = {};
  m[1].split("\n").forEach(line => {
    const idx = line.indexOf(":");
    if (idx === -1) return;
    const key = line.slice(0, idx).trim();
    let val = line.slice(idx + 1).trim();
    if (/^\[.*\]$/.test(val)) {
      meta[key] = val.slice(1, -1).split(",").map(s => s.trim().replace(/^["']|["']$/g, "")).filter(Boolean);
    } else {
      meta[key] = val.replace(/^["']|["']$/g, "");
    }
  });
  return { meta, body: m[2] };
}

async function loadPostIndex() {
  try {
    const res = await fetch("posts/index.json");
    if (!res.ok) throw new Error("HTTP " + res.status);
    return await res.json();
  } catch (e) {
    if (window.__POSTS_FALLBACK__) return window.__POSTS_FALLBACK__;
    throw e;
  }
}

function calcReadTime(text) {
  const chineseChars = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
  const englishWords = (text.match(/[a-zA-Z0-9_\u0392-\u03c9\u0400-\u04FF]+/g) || []).length;
  const minutes = Math.ceil((chineseChars / 400) + (englishWords / 200));
  return minutes > 0 ? minutes : 1;
}

function generateTOC() {
  const tocList = document.getElementById("toc-list");
  const headings = document.querySelectorAll("#post-body h2, #post-body h3");
  
  if (!headings.length) {
    tocList.innerHTML = `<li><a class="is-size-7 has-text-grey">无小标题</a></li>`;
    return;
  }

  tocList.innerHTML = Array.from(headings).map((h, i) => {
    if (!h.id) h.id = `heading-${i}`;
    const level = h.tagName.toLowerCase();
    const cls = level === "h3" ? "toc-h3" : "toc-h2";
    return `<li><a class="${cls}" href="#${h.id}" data-target="${h.id}">${h.innerText}</a></li>`;
  }).join("");

  const links = tocList.querySelectorAll("a");
  
  links.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.dataset.target;
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        const yOffset = -80; 
        const y = targetEl.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    });
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        links.forEach(l => l.classList.remove("is-active"));
        const activeLink = tocList.querySelector(`a[data-target="${entry.target.id}"]`);
        if (activeLink) activeLink.classList.add("is-active");
      }
    });
  }, { rootMargin: "0px 0px -80% 0px" });

  headings.forEach(h => observer.observe(h));
}

// ================= 核心升级：系列内上下篇（支持排序） =================
async function renderPostNav(currentSlug) {
  const navEl = document.getElementById("post-nav");
  if (!navEl) return;
  try {
    let posts = await loadPostIndex();
    const currentPost = posts.find(p => p.slug === currentSlug);
    if (!currentPost) { navEl.innerHTML = ""; return; }

    // 过滤同系列
    let seriesPosts = currentPost.series ? posts.filter(p => p.series === currentPost.series) : [...posts];
    
    // 读取配置文件的默认排序，如果没有默认时间倒序
    const config = window.__CONFIG__ || { defaultSort: "desc" };
    const defaultSort = config.defaultSort || "desc";
    
    // 从 localStorage 读取用户手动切换的排序（如果没有就用默认）
    let sortMode = localStorage.getItem(`seriesSort_${currentPost.series || 'default'}`) || defaultSort;

    // 根据模式进行排序
    seriesPosts.sort((a, b) => {
      if (sortMode === "order") return (a.order || 0) - (b.order || 0); // 按自定义 ID
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortMode === "asc" ? dateA - dateB : dateB - dateA; // 正序 / 倒序
    });

    const idx = seriesPosts.findIndex(p => p.slug === currentSlug);
    const prev = seriesPosts[idx - 1];
    const next = seriesPosts[idx + 1];

    const seriesLabel = currentPost.series ? ` [${currentPost.series}]` : "";

    // 对于“上一篇/下一篇”的直观理解，如果是正序，上一篇就是之前的时间，倒序相反
    const prevText = sortMode === "desc" ? "← 上一篇 (更新)" : "← 上一篇";
    const nextText = sortMode === "desc" ? "下一篇 (更早) →" : "下一篇 →";

    const prevHtml = prev
      ? `<div class="column is-6">
           <a class="box is-block" href="post.html?slug=${encodeURIComponent(prev.slug)}">
             <p class="is-size-7 has-text-grey">${prevText}${seriesLabel}</p>
             <p class="has-text-weight-semibold">${prev.title}</p>
           </a>
         </div>`
      : `<div class="column is-6"></div>`;

    const nextHtml = next
      ? `<div class="column is-6">
           <a class="box is-block has-text-right" href="post.html?slug=${encodeURIComponent(next.slug)}">
             <p class="is-size-7 has-text-grey">${nextText}${seriesLabel}</p>
             <p class="has-text-weight-semibold">${next.title}</p>
           </a>
         </div>`
      : `<div class="column is-6"></div>`;

    navEl.innerHTML = `<div class="columns">${prevHtml}${nextHtml}</div>`;
  } catch (e) {
    navEl.innerHTML = "";
  }
}

function initLightbox() {
  const modalHtml = `
    <div id="image-modal" class="modal">
      <div class="modal-background"></div>
      <div class="modal-content" style="max-width: 90vw;">
        <p class="image"><img id="modal-image" src="" alt="预览图" style="width: 100%; max-height: 85vh; object-fit: contain;"></p>
      </div>
      <button class="modal-close is-large" aria-label="close"></button>
    </div>
  `;
  document.body.insertAdjacentHTML("beforeend", modalHtml);
  const modal = document.getElementById("image-modal");
  const modalImg = document.getElementById("modal-image");
  const closeBtn = modal.querySelector(".modal-close");
  const bg = modal.querySelector(".modal-background");

  const postImages = document.querySelectorAll("#post-body img");
  postImages.forEach(img => {
    img.style.cursor = "zoom-in";
    img.addEventListener("click", () => { modalImg.src = img.src; modal.classList.add("is-active"); });
  });
  const closeModal = () => modal.classList.remove("is-active");
  closeBtn.addEventListener("click", closeModal);
  bg.addEventListener("click", closeModal);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && modal.classList.contains("is-active")) closeModal(); });
}

function initCopyButtons() {
  const preBlocks = document.querySelectorAll("#post-body pre");
  preBlocks.forEach(pre => {
    // 防止重复添加
    if (pre.querySelector(".copy-code-btn")) return;

    const btn = document.createElement("button");
    btn.className = "button is-small copy-code-btn";
    // 用简单的纯文本加图标
    btn.innerHTML = `<i class="fas fa-copy"></i> 复制`;
    
    btn.addEventListener("click", () => {
      const code = pre.querySelector("code").innerText;
      navigator.clipboard.writeText(code).then(() => {
        btn.innerHTML = `<i class="fas fa-check"></i> 已复制`;
        btn.classList.add("is-success");
        // 改变一下背景色以作提示
        btn.style.backgroundColor = "var(--bulma-success)";
        btn.style.color = "#fff";
        
        setTimeout(() => {
          btn.innerHTML = `<i class="fas fa-copy"></i> 复制`;
          btn.classList.remove("is-success");
          btn.style.backgroundColor = "";
          btn.style.color = "";
        }, 2000);
      });
    });
    pre.appendChild(btn);
  });
}
function initReadingProgress() {
  if (document.getElementById("reading-progress")) return;
  const progressBar = document.createElement("div");
  progressBar.id = "reading-progress";
  document.body.appendChild(progressBar);
  window.addEventListener("scroll", () => {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollTop = window.scrollY;
    if (docHeight > 0) progressBar.style.width = ((scrollTop / docHeight) * 100) + "%";
  });
}

function renderPostExtras(title, date) {
  const extrasEl = document.getElementById("post-footer-extras");
  if (!extrasEl) return;
  extrasEl.innerHTML = `
    <div class="has-text-centered mt-6 mb-6 pt-5 pb-5" style="border-top: 1px dashed var(--bulma-border-weak); border-bottom: 1px dashed var(--bulma-border-weak);">
      <p class="is-size-7 has-text-grey mb-3"><i class="fas fa-copyright mr-1"></i> 本文《${title}》采用 <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank" class="has-text-weight-bold">CC BY-NC-SA 4.0</a> 许可协议。</p>
      <p class="is-size-7 has-text-grey mb-4">发布于 ${date} · 作者保留所有权利，转载请注明出处。</p>
      <button class="button is-small is-rounded is-light" onclick="navigator.clipboard.writeText(window.location.href).then(() => alert('链接已复制，快去分享吧！'))"><span class="icon is-small"><i class="fas fa-link"></i></span><span>复制本文链接</span></button>
    </div>
  `;
}

// ================= 详情页顶部排序切换 UI =================
function renderPostSortUI(currentSlug) {
  const headerEl = document.getElementById("post-header");
  if (!headerEl) return;
  
  try {
    const config = window.__CONFIG__ || { defaultSort: "desc" };
    const defaultSort = config.defaultSort || "desc";
    
    // 在文章的头部插入一个下拉切换器（仅当有系列时显示）
    // 为了不破坏原有结构，我们用 DOM 插入
    const navArea = document.createElement("div");
    navArea.className = "mt-4 mb-5 is-flex is-align-items-center is-justify-content-flex-end";
    navArea.innerHTML = `
      <span class="is-size-7 has-text-grey mr-2">阅读顺序：</span>
      <div class="select is-small is-rounded">
        <select id="post-sort-select" style="border-color: var(--bulma-border-weak);">
          <option value="asc">按时间正序</option>
          <option value="desc">按时间倒序</option>
          <option value="order">按自定义排序</option>
        </select>
      </div>
    `;
    
    // 我们把它插入到 post-status 之前，或者 post-footer-extras 之前
    const footerExtras = document.getElementById("post-footer-extras");
    if (footerExtras) {
      footerExtras.parentNode.insertBefore(navArea, footerExtras);
    }

    // 初始化状态并绑定事件
    // 注意：这里需要知道当前文章的系列，才能重置状态
    loadPostIndex().then(posts => {
      const currentPost = posts.find(p => p.slug === currentSlug);
      const seriesKey = currentPost && currentPost.series ? currentPost.series : 'default';
      const savedSort = localStorage.getItem(`seriesSort_${seriesKey}`) || defaultSort;
      
      const select = document.getElementById("post-sort-select");
      if (select) {
        select.value = savedSort;
        select.addEventListener("change", (e) => {
          localStorage.setItem(`seriesSort_${seriesKey}`, e.target.value);
          renderPostNav(currentSlug); // 重新渲染上下篇
        });
      }
    });
    
  } catch(e) {}
}

async function initPost() {
  await initLayout("post.html");
  const statusEl = document.getElementById("post-status");

  const slug = getSlug();
  if (!slug) {
    statusEl.innerHTML = `<div class="notification is-warning">缺少 slug 参数。</div>`;
    return;
  }

  // 注入排序 UI 和导航
  renderPostSortUI(slug);
  renderPostNav(slug);

  let pageTitle = slug;
  try {
    const posts = await loadPostIndex();
    const p = posts.find(x => x.slug === slug);
    if (p) pageTitle = p.title;
  } catch(e) {}
  document.title = `${pageTitle} · 我的博客`;

  if (location.protocol === "file:") {
    statusEl.innerHTML = `<div class="notification is-warning mt-4"><strong>本地双击预览受限：</strong> 浏览器安全策略禁止在 <code>file://</code> 下读取 .md 文件。<br />建议使用本地服务器预览（如 <code>python -m http.server 8000</code>）。</div>`;
    if (slug === "hello-world") {
      renderContent("你好，世界", "2025-01-01", ["随笔", "开始"], `# 你好，世界\n\n欢迎来到我的博客。这是第一篇文章。\n\n## 功能特性\n\n- 支持 **Markdown**\n- 支持 \`代码\`\n\n\`\`\`js\nconsole.log("Hello, Bulma!");\n\`\`\``);
    } else {
      document.getElementById("post-body").innerHTML = "<p class='has-text-danger'>无法加载正文。</p>";
    }
    return;
  }

  try {
    const res = await fetch(`posts/${slug}.md`);
    if (!res.ok) throw new Error("HTTP " + res.status);
    const raw = await res.text();
    const { meta, body } = parseFrontMatter(raw);
    renderContent(meta.title || slug, meta.date || "", meta.tags || [], body);
  } catch (e) {
    statusEl.innerHTML = `<div class="notification is-danger">读取文章失败：${e.message}</div>`;
  }
}

function renderContent(title, date, tags, rawBody) {
  const headerEl = document.getElementById("post-header");
  const bodyEl = document.getElementById("post-body");
  
  const readTime = calcReadTime(rawBody);

  const tagHtml = (tags || [])
    .map(t => `<a href="index.html?tag=${encodeURIComponent(t)}" class="tag is-info is-light mr-1 is-clickable">${t}</a>`)
    .join("");
    
  headerEl.innerHTML = `
    <h1 class="title is-2">${title}</h1>
    <p class="subtitle is-6 has-text-grey mb-3">${date} · 约 ${readTime} 分钟阅读</p>
    <div class="tags mb-5">${tagHtml}</div>
  `;

  bodyEl.innerHTML = marked.parse(rawBody);
  
  // 核心改造：给每个 pre 代码块外面包裹一层容器，并把复制按钮放进去
  bodyEl.querySelectorAll("pre").forEach((pre) => {
    // 1. 代码高亮
    const codeBlock = pre.querySelector("code");
    if (codeBlock) hljs.highlightElement(codeBlock);

    // 2. 获取语言类型
    let lang = "code";
    if (codeBlock && codeBlock.className) {
      const match = codeBlock.className.match(/language-(\w+)/);
      if (match) lang = match[1].toUpperCase();
    }

    // 3. 创建新的外层容器
    const wrapper = document.createElement("div");
    wrapper.className = "code-wrapper";

    // 4. 创建顶部的操作栏
    const header = document.createElement("div");
    header.className = "code-header";
    header.innerHTML = `
      <span class="code-lang">${lang}</span>
      <button class="button is-small is-ghost copy-btn">
        <span class="icon is-small"><i class="fas fa-copy"></i></span>
        <span>复制</span>
      </button>
    `;

    // 5. 移动节点
    pre.parentNode.insertBefore(wrapper, pre);
    wrapper.appendChild(header);
    wrapper.appendChild(pre);

    // 6. 绑定复制事件
    const btn = header.querySelector(".copy-btn");
    btn.addEventListener("click", () => {
      const code = codeBlock.innerText;
      navigator.clipboard.writeText(code).then(() => {
        btn.innerHTML = `<span class="icon is-small"><i class="fas fa-check"></i></span><span>已复制</span>`;
        btn.classList.add("is-success");
        btn.classList.remove("is-ghost");
        setTimeout(() => {
          btn.innerHTML = `<span class="icon is-small"><i class="fas fa-copy"></i></span><span>复制</span>`;
          btn.classList.remove("is-success");
          btn.classList.add("is-ghost");
        }, 2000);
      });
    });
  });

  generateTOC();
  initLightbox();
  initReadingProgress();
  renderPostExtras(title, date);
}

initPost();
