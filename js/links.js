// 连接页：渲染友链与社交信息
async function initLinks() {
  const config = await initLayout("links.html");
    // 渲染页面文案
  const lp = ((config && config.pageCopy) || {}).linksPage || {};
  const tEl = document.getElementById("page-title");
  const sEl = document.getElementById("page-subtitle");
  const nEl = document.getElementById("neighbors-title");
  const mEl = document.getElementById("my-sites-title");
  const eEl = document.getElementById("exchange-note");
  if (tEl) tEl.textContent = lp.title || "连接";
  if (sEl) sEl.textContent = lp.subtitle || "";
  if (nEl) nEl.innerHTML = `<i class="fas fa-link has-text-primary mr-2"></i>${lp.neighborsTitle || "我的邻居们"}`;
  if (mEl) mEl.innerHTML = `<i class="fas fa-satellite-dish has-text-primary mr-2"></i>${lp.mySitesTitle || "我的阵地"}`;
  if (eEl) eEl.innerHTML = `<strong>${lp.exchangeTitle || "交换友链？"}</strong><br>${lp.exchangeNote || ""}`;
const el = document.getElementById("link-list");
  const socialEl = document.getElementById("social-list");
  
  // 渲染右侧社交链接
  if (socialEl && config.social) {
    socialEl.innerHTML = config.social.map(s => `
      <a href="${s.href}" target="_blank" class="is-flex is-align-items-center mb-3">
        <span class="icon has-text-primary mr-2"><i class="${s.icon}"></i></span>
        <span class="is-size-6 has-text-weight-semibold">${s.label}</span>
      </a>
    `).join("");
  }

  let links = [];
  try {
    const res = await fetch("links.json");
    if (!res.ok) throw new Error("HTTP " + res.status);
    links = await res.json();
  } catch (e) {
    if (window.__LINKS_FALLBACK__) links = window.__LINKS_FALLBACK__;
    else { el.innerHTML = `<div class="column is-12"><div class="notification is-danger">读取 links.json 失败：${e.message}</div></div>`; return; }
  }

  el.innerHTML = links.map(l => {
    // 利用 Google Favicon API 自动抓取对方的网站图标
    let domain = "";
    try { domain = new URL(l.url).hostname; } catch(e) {}
    const favicon = domain ? `https://www.google.com/s2/favicons?domain=${domain}&sz=64` : "";
    
    return `
      <div class="column is-6">
        <div class="card" style="height: 100%;">
          <div class="card-content">
            <div class="is-flex is-align-items-center mb-3">
              ${favicon ? `<figure class="image is-32x32 mr-3"><img src="${favicon}" alt="icon" style="border-radius: 50%;"></figure>` : `<span class="icon is-large has-text-primary mr-3"><i class="fas fa-globe"></i></span>`}
              <div>
                <a href="${l.url}" target="_blank" rel="noopener" class="title is-6 mb-0 has-text-link">${l.name}</a>
              </div>
            </div>
            <p class="is-size-7 has-text-grey">${l.description || "暂无描述"}</p>
          </div>
          <footer class="card-footer" style="border-top: none; padding: 0 1.5rem 1rem;">
            <a href="${l.url}" target="_blank" rel="noopener" class="button is-small is-fullwidth is-light is-rounded">
              访问网站
            </a>
          </footer>
        </div>
      </div>
    `;
  }).join("");
}

initLinks();