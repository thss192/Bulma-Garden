// 首页：按系列分组，支持三种排序（时间正倒序、自定义ID），独立分页

let ALL_POSTS = [];
let SITE_CONFIG = {};        
let ACTIVE_TAG = "__all__"; 
const SERIES_PAGES = {};
const SERIES_SORTS = {}; 
const OPEN_SERIES = {}; 
const POSTS_PER_PAGE = 4; 

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

function renderCard(post) {
  const tags = (post.tags || []).map(t => `<span class="tag is-info is-light mr-1">${t}</span>`).join("");
  return `
    <div class="column is-6">
      <div class="card h-100">
        <div class="card-content">
          <p class="title is-5 mb-2"><a href="post.html?slug=${encodeURIComponent(post.slug)}">${post.title}</a></p>
          <p class="subtitle is-7 has-text-grey mb-3">${post.date}</p>
          <div class="content">${post.summary || ""}</div>
          <div class="tags">${tags}</div>
        </div>
        <footer class="card-footer">
          <a class="card-footer-item" href="post.html?slug=${encodeURIComponent(post.slug)}">阅读全文</a>
        </footer>
      </div>
    </div>`;
}

function collectTags(posts) {
  const set = new Set();
  posts.forEach(p => (p.tags || []).forEach(t => set.add(t)));
  return Array.from(set);
}

function renderTagFilter() {
  const el = document.getElementById("tag-filter");
  const tags = collectTags(ALL_POSTS);
  const items = [{ label: "全部", value: "__all__" }, ...tags.map(t => ({ label: t, value: t }))];

  el.innerHTML = items.map(item => {
    const active = item.value === ACTIVE_TAG ? " is-primary" : " is-light";
    return `<span class="tag is-medium is-clickable${active}" data-tag="${item.value}">${item.label}</span>`;
  }).join("");

  el.querySelectorAll("[data-tag]").forEach(node => {
    node.addEventListener("click", () => {
      const tag = node.dataset.tag;
      if (tag === ACTIVE_TAG) return;
      
      ACTIVE_TAG = tag;
      Object.keys(SERIES_PAGES).forEach(k => SERIES_PAGES[k] = 1);

      const url = new URL(window.location);
      if (ACTIVE_TAG === "__all__") {
        url.searchParams.delete("tag");
      } else {
        url.searchParams.set("tag", ACTIVE_TAG);
      }
      window.history.pushState({}, "", url);

      renderTagFilter();   
      renderList();        
    });
  });
}

function renderSeriesPaginated(seriesName, postsInSeries, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (!SERIES_PAGES[seriesName]) SERIES_PAGES[seriesName] = 1;
  
  // 使用当前的排序模式
  const sortMode = SERIES_SORTS[seriesName];
  const currentPage = SERIES_PAGES[seriesName];

  // 根据排序模式处理
  const sortedPosts = [...postsInSeries].sort((a, b) => {
    if (sortMode === "order") return (a.order || 0) - (b.order || 0);
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return sortMode === "asc" ? dateA - dateB : dateB - dateA;
  });

  const totalPages = Math.ceil(sortedPosts.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const currentPosts = sortedPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);

  let html = `<div class="columns is-multiline mt-2">${currentPosts.map(renderCard).join("")}</div>`;

  if (totalPages > 1) {
    html += `
      <nav class="pagination is-small is-centered mt-5" role="navigation">
        <a class="pagination-previous ${currentPage === 1 ? "is-disabled" : ""}" data-series="${seriesName}" data-dir="prev">上一页</a>
        <a class="pagination-next ${currentPage === totalPages ? "is-disabled" : ""}" data-series="${seriesName}" data-dir="next">下一页</a>
        <ul class="pagination-list">
          ${Array.from({length: totalPages}, (_, i) => i + 1).map(p => `
            <li><a class="pagination-link ${p === currentPage ? "is-current" : ""}" data-series="${seriesName}" data-page="${p}">${p}</a></li>
          `).join("")}
        </ul>
      </nav>
    `;
  }

  container.innerHTML = html;

  container.querySelectorAll("a[data-series]").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      if (btn.classList.contains("is-disabled")) return;

      if (btn.dataset.dir === "prev") SERIES_PAGES[seriesName]--;
      else if (btn.dataset.dir === "next") SERIES_PAGES[seriesName]++;
      else if (btn.dataset.page) SERIES_PAGES[seriesName] = parseInt(btn.dataset.page, 10);

      renderSeriesPaginated(seriesName, postsInSeries, containerId);
    });
  });
}

function renderList() {
  const listEl = document.getElementById("post-list");
  const statusEl = document.getElementById("post-status");

  let filteredPosts = ACTIVE_TAG === "__all__" ? ALL_POSTS : ALL_POSTS.filter(p => (p.tags || []).includes(ACTIVE_TAG));

  if (filteredPosts.length === 0) {
    statusEl.innerHTML = `<div class="notification is-warning">该标签下暂无文章。</div>`;
    listEl.innerHTML = "";
    return;
  }
  statusEl.innerHTML = "";

  const grouped = {};
  filteredPosts.forEach(post => {
    const s = post.series || "未分类文章";
    if (!grouped[s]) grouped[s] = [];
    grouped[s].push(post);
  });

  let html = "";
  let seriesIndex = 0;
  
  // 读取全局默认配置
  const defaultSort = (SITE_CONFIG && SITE_CONFIG.defaultSort) ? SITE_CONFIG.defaultSort : "desc";

  for (const [seriesName, postsInSeries] of Object.entries(grouped)) {
    const containerId = `series-content-${seriesIndex}`;
    if (!SERIES_PAGES[seriesName]) SERIES_PAGES[seriesName] = 1;
    
    // 初始排序状态
    if (!SERIES_SORTS[seriesName]) {
      const savedSort = localStorage.getItem(`seriesSort_${seriesName}`);
      SERIES_SORTS[seriesName] = savedSort || defaultSort;
    }
    
    const isOpen = OPEN_SERIES[seriesName] !== false; 
    const openClass = isOpen ? "is-active" : "";
    const displayStyle = isOpen ? "display: block;" : "display: none;";
    const iconRotate = isOpen ? "transform: rotate(180deg);" : "";

    const currentSort = SERIES_SORTS[seriesName];

    html += `
      <div class="mb-5">
        <div class="series-accordion" data-series-name="${seriesName}">
          <div class="series-header toggle-trigger" style="user-select: none;">
            <div class="series-title-wrapper">
              <span class="icon has-text-primary"><i class="fas fa-layer-group"></i></span>
              ${seriesName}
              <span class="series-count ml-2">${postsInSeries.length} 篇</span>
            </div>
            
            <div class="is-flex is-align-items-center ml-auto">
              <!-- 排序选择器 -->
              <div class="select is-small is-rounded mr-4">
                <select class="sort-select" data-series="${seriesName}" style="background-color: var(--bulma-scheme-main-bis); border-color: var(--bulma-border-weak);">
                  <option value="asc" ${currentSort === 'asc' ? 'selected' : ''}>时间正序</option>
                  <option value="desc" ${currentSort === 'desc' ? 'selected' : ''}>时间倒序</option>
                  <option value="order" ${currentSort === 'order' ? 'selected' : ''}>自定义 ID</option>
                </select>
              </div>
              <span class="icon is-small series-icon-toggle" style="${iconRotate}"><i class="fas fa-chevron-down"></i></span>
            </div>
          </div>
          <div id="${containerId}" class="series-content ${openClass}" style="${displayStyle}"></div>
        </div>
      </div>
    `;
    
    setTimeout(() => renderSeriesPaginated(seriesName, postsInSeries, containerId), 0);
    seriesIndex++;
  }

  listEl.innerHTML = html;

  // 绑定折叠事件
  listEl.querySelectorAll(".toggle-trigger").forEach(trigger => {
    trigger.addEventListener("click", (e) => {
      if (e.target.closest(".select")) return;

      const accordion = trigger.closest(".series-accordion");
      const content = accordion.querySelector(".series-content");
      const icon = trigger.querySelector(".series-icon-toggle");
      const sName = accordion.dataset.seriesName;
      
      const isHidden = content.style.display === "none";
      content.style.display = isHidden ? "block" : "none";
      icon.style.transform = isHidden ? "rotate(180deg)" : "rotate(0deg)";
      OPEN_SERIES[sName] = isHidden;
    });
  });

  // 绑定排序下拉事件
  listEl.querySelectorAll(".sort-select").forEach(select => {
    select.addEventListener("change", (e) => {
      e.stopPropagation();
      const sName = select.dataset.series;
      const newSort = e.target.value;
      
      SERIES_SORTS[sName] = newSort;
      SERIES_PAGES[sName] = 1; // 重置页码
      localStorage.setItem(`seriesSort_${sName}`, newSort); // 记忆用户的选择
      
      // 仅重新渲染当前内容区
      const accordion = select.closest(".series-accordion");
      const containerId = accordion.querySelector(".series-content").id;
      
      // 重新获取当前的系列数据
      let filteredPosts = ACTIVE_TAG === "__all__" ? ALL_POSTS : ALL_POSTS.filter(p => (p.tags || []).includes(ACTIVE_TAG));
      const grouped = {};
      filteredPosts.forEach(post => {
        const s = post.series || "未分类文章";
        if (!grouped[s]) grouped[s] = [];
        grouped[s].push(post);
      });
      
      renderSeriesPaginated(sName, grouped[sName], containerId);
    });
  });
}

async function initHome() {
  const config = await initLayout("index.html");
  // 渲染 Hero
  const hero = (config && config.hero) || {};
  const heroTitle = document.getElementById("hero-title");
  const heroSubtitle = document.getElementById("hero-subtitle");
  if (heroTitle) heroTitle.textContent = hero.title || "";
  if (heroSubtitle) heroSubtitle.textContent = hero.subtitle || "";

  SITE_CONFIG = config || {};
  const statusEl = document.getElementById("post-status");
  
  const profileEl = document.getElementById("sidebar-profile");
    // 渲染侧边栏项目（取前 2 条）
  const sidebarProjects = document.getElementById("sidebar-projects");
  if (sidebarProjects) {
    let projects = [];
    try {
      const res = await fetch("projects.json");
      if (res.ok) projects = await res.json();
    } catch (e) { projects = window.__PROJECTS_FALLBACK__ || [];
      if (!projects.length) projects = [{name: 'My Blog', url:'#', description:'My Blog'}, {name:'Todo App', url:'#', description:'Todo App'}]; }
    sidebarProjects.innerHTML = projects.slice(0, 2).map(p => `
      <li class="mb-2">
        <a href="${p.url}" target="_blank" class="is-size-6">${p.name}</a>
        <p class="is-size-7 has-text-grey">${p.description || ""}</p>
      </li>
    `).join("");
  }

  if (profileEl && config && config.author) {
    const a = config.author;
    profileEl.innerHTML = `
      <div class="box has-text-centered" style="border-radius: var(--bulma-radius-large);">
        <figure class="image is-96x96 is-inline-block mb-3"><img class="is-rounded" src="${a.avatar || "images/avatar.png"}" style="object-fit: cover;"></figure>
        <h3 class="title is-5 mb-1">${a.name || "佚名"}</h3>
        <p class="is-size-7 has-text-grey mb-3">${a.bio || "开发者"}</p>
        <a href="about.html" class="button is-small is-rounded is-light">了解更多</a>
      </div>
    `;
  }

  try {
    const posts = await loadPostIndex();
    ALL_POSTS = posts;

    if (ALL_POSTS.length === 0) {
      statusEl.innerHTML = `<div class="notification is-warning">还没有文章。</div>`;
      return;
    }
    
    const urlParams = new URLSearchParams(window.location.search);
    const urlTag = urlParams.get("tag");
    if (urlTag && collectTags(ALL_POSTS).includes(urlTag)) ACTIVE_TAG = urlTag;
    else ACTIVE_TAG = "__all__";

    renderTagFilter();
    renderList();
  } catch (e) {
    statusEl.innerHTML = `<div class="notification is-danger">读取文章清单失败：${e.message}</div>`;
  }
}

initHome();
