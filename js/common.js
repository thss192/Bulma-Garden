// 公共逻辑：加载 config、注入主题色、深色模式、渲染 navbar、全文搜索、回到顶部

async function loadConfig() {
  try {
    const res = await fetch("config.json");
    if (!res.ok) throw new Error("HTTP " + res.status);
    return await res.json();
  } catch (e) {
    console.warn("读取 config.json 失败，使用内联兜底数据。");
    // 如果 fetch 失败，直接使用 fallback-data.js 里定义的全局变量
    return window.__CONFIG__ || {};
  }
}

function applyTheme(theme) {
  if (!theme) return;
  const root = document.documentElement;
  if (theme.primary) {
    root.style.setProperty("--bulma-primary-h", theme.primary.h);
    root.style.setProperty("--bulma-primary-s", theme.primary.s + "%");
    root.style.setProperty("--bulma-primary-l", theme.primary.l + "%");
  }
  if (theme.link) {
    root.style.setProperty("--bulma-link-h", theme.link.h);
    root.style.setProperty("--bulma-link-s", theme.link.s + "%");
    root.style.setProperty("--bulma-link-l", theme.link.l + "%");
  }
}

function initTheme() {
  const html = document.documentElement;
  const saved = localStorage.getItem("theme");
  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  
  const updateHighlightTheme = (isDark) => {
    const hljsLink = document.getElementById("hljs-theme");
    if (hljsLink) {
      hljsLink.href = isDark 
        ? "libs/github-dark.min.css"
        : "libs/github.min.css";
    }
  };

  if (saved === "dark" || (!saved && prefersDark)) {
    html.setAttribute("data-theme", "dark");
    updateHighlightTheme(true);
  } else {
    html.removeAttribute("data-theme");
    updateHighlightTheme(false);
  }

  document.addEventListener("click", (e) => {
    const btn = e.target.closest("#theme-toggle");
    if (!btn) return;
    
    const isDark = html.getAttribute("data-theme") === "dark";
    if (isDark) {
      html.removeAttribute("data-theme");
      localStorage.setItem("theme", "light");
      updateHighlightTheme(false);
      btn.innerHTML = `<span class="icon is-small"><i class="fas fa-moon"></i></span><span>暗色</span>`;
    } else {
      html.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
      updateHighlightTheme(true);
      btn.innerHTML = `<span class="icon is-small"><i class="fas fa-sun"></i></span><span>亮色</span>`;
    }
  });

  setTimeout(() => {
    const btn = document.getElementById("theme-toggle");
    if (btn) {
      btn.innerHTML = html.getAttribute("data-theme") === "dark" 
        ? `<span class="icon is-small"><i class="fas fa-sun"></i></span><span>亮色</span>` 
        : `<span class="icon is-small"><i class="fas fa-moon"></i></span><span>暗色</span>`;
    }
  }, 100);
}

// ================= 全文搜索模态框 =================
function initSearchModal() {
  const modalHtml = `
    <div id="search-modal" class="modal">
      <div class="modal-background"></div>
      <div class="modal-card" style="width: 90%; max-width: 600px;">
        <section class="modal-card-body">
          <div class="field">
            <p class="control has-icons-left">
              <input id="search-input" class="input is-medium" type="text" placeholder="搜索全文内容... (Ctrl+K)" autocomplete="off">
              <span class="icon is-left"><i class="fas fa-search"></i></span>
            </p>
          </div>
          <div id="search-results" class="menu mt-4" style="max-height: 50vh; overflow-y: auto;">
            <p class="has-text-grey-light is-size-7 text-center mt-4">输入关键词开始搜索...</p>
          </div>
        </section>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML("beforeend", modalHtml);

  const modal = document.getElementById("search-modal");
  const input = document.getElementById("search-input");
  const resultsEl = document.getElementById("search-results");
  const closeBtn = modal.querySelector(".modal-background");

  let searchIndex = [];
  fetch("posts/search-index.json")
    .then(res => res.json())
    .then(data => searchIndex = data)
    .catch(() => {
      console.warn("全文索引加载失败，使用兜底数据");
      if (window.__SEARCH_FALLBACK__) searchIndex = window.__SEARCH_FALLBACK__;
    });

  const highlight = (text, keyword) => {
    if (!keyword) return text;
    const regex = new RegExp(`(${keyword})`, "gi");
    return text.replace(regex, `<mark class="has-background-warning-light">$1</mark>`);
  };

  input.addEventListener("input", (e) => {
    const keyword = e.target.value.trim().toLowerCase();
    if (!keyword) {
      resultsEl.innerHTML = `<p class="has-text-grey-light is-size-7 text-center mt-4">输入关键词开始搜索...</p>`;
      return;
    }

    const matches = [];
    searchIndex.forEach(item => {
      const titleMatch = item.title.toLowerCase().includes(keyword);
      const contentMatch = item.content.toLowerCase().includes(keyword);

      if (titleMatch || contentMatch) {
        let snippet = "";
        if (contentMatch) {
          const idx = item.content.toLowerCase().indexOf(keyword);
          const start = Math.max(0, idx - 20);
          const end = Math.min(item.content.length, idx + 50);
          snippet = item.content.slice(start, end).replace(/\n/g, " ");
          snippet = "..." + highlight(snippet, keyword) + "...";
        }

        matches.push({
          ...item,
          titleHtml: highlight(item.title, keyword),
          snippetHtml: snippet
        });
      }
    });

    if (matches.length === 0) {
      resultsEl.innerHTML = `<p class="has-text-grey-light p-2">没有找到匹配的内容。</p>`;
    } else {
      resultsEl.innerHTML = `<ul class="menu-list">
        ${matches.map(p => `
          <li class="mb-3">
            <a href="post.html?slug=${encodeURIComponent(p.slug)}" class="is-size-6 has-text-weight-semibold">
              ${p.titleHtml}
            </a>
            ${p.snippetHtml ? `<p class="is-size-7 has-text-grey mt-1 ml-2">${p.snippetHtml}</p>` : ""}
          </li>
        `).join("")}
      </ul>`;
    }
  });

  document.addEventListener("click", (e) => {
    const btn = e.target.closest("#search-toggle");
    if (btn) {
      modal.classList.add("is-active");
      input.focus();
    }
  });

  closeBtn.addEventListener("click", () => modal.classList.remove("is-active"));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("is-active")) {
      modal.classList.remove("is-active");
    }
    if ((e.ctrlKey || e.metaKey) && e.key === "k") {
      e.preventDefault();
      modal.classList.add("is-active");
      input.focus();
    }
  });
}

function renderNavbar(config, page) {
  const mount = document.getElementById("site-navbar");
  if (!mount) return;
  const navItems = (config.nav || []).map(item => {
    const active = item.href === page ? " is-active" : "";
    return `<a class="navbar-item${active}" href="${item.href}">${item.label}</a>`;
  }).join("");
  
  const socialItems = (config.social || []).map(s =>
    `<a class="navbar-item" href="${s.href}" target="_blank" rel="noopener"><span class="icon"><i class="${s.icon}"></i></span><span>${s.label}</span></a>`
  ).join("");

  mount.innerHTML = `
    <nav class="navbar is-fixed-top has-shadow" role="navigation">
      <div class="container">
        <div class="navbar-brand">
          <a class="navbar-item" href="index.html"><strong>${config.siteTitle}</strong></a>
          <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navMenu">
            <span aria-hidden="true"></span><span aria-hidden="true"></span><span aria-hidden="true"></span>
          </a>
        </div>
        <div id="navMenu" class="navbar-menu">
          <div class="navbar-start">${navItems}</div>
          <div class="navbar-end">
            ${socialItems}
            <div class="navbar-item">
              <button id="search-toggle" class="button is-ghost" title="搜索 (Ctrl+K)">
                <span class="icon"><i class="fas fa-search"></i></span>
              </button>
            </div>
            <div class="navbar-item">
              <button id="theme-toggle" class="button is-rounded is-small is-light" title="切换深浅色模式"></button>
            </div>
          </div>
        </div>
      </div>
    </nav>`;
    
  const burger = mount.querySelector(".navbar-burger");
  const menu = mount.querySelector("#navMenu");
  burger.addEventListener("click", () => {
    burger.classList.toggle("is-active");
    menu.classList.toggle("is-active");
  });
}

function renderFooter(config) {
  const mount = document.getElementById("site-footer");
  if (!mount) return;
  const year = new Date().getFullYear();
  mount.innerHTML = `
    <footer class="footer">
      <div class="content has-text-centered">
        <p><strong>${config.siteTitle}</strong> · ${config.siteSubtitle || ""}</p>
        <p>© ${year} ${config.author?.name || ""} · Powered by Bulma</p>
      </div>
    </footer>`;
}

function initBackToTop() {
  const btn = document.createElement("button");
  btn.id = "back-to-top";
  btn.className = "button is-primary is-rounded has-shadow";
  btn.innerHTML = `<span class="icon"><i class="fas fa-arrow-up"></i></span>`;
  btn.title = "回到顶部";
  document.body.appendChild(btn);

  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) btn.classList.add("is-visible");
    else btn.classList.remove("is-visible");
  });

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

async function initLayout(page) {
  initTheme();
  const config = await loadConfig();
  applyTheme(config.theme);
  renderNavbar(config, page);
  renderFooter(config);
  initSearchModal();
  initBackToTop();
  return config;
}

window.initLayout = initLayout;
