// 项目页：读取 projects.json，渲染立体感项目卡片
async function initProjects() {
  await initLayout("projects.html");
    // 渲染页面标题/副标题
  const pp = ((config.pageCopy) || {}).projectsPage || {};
  const tEl = document.getElementById("page-title");
  const sEl = document.getElementById("page-subtitle");
  if (tEl) tEl.textContent = pp.title || "开源项目";
  if (sEl) sEl.textContent = pp.subtitle || "";
const el = document.getElementById("project-list");
  let projects = [];
  try {
    const res = await fetch("projects.json");
    if (!res.ok) throw new Error("HTTP " + res.status);
    projects = await res.json();
  } catch (e) {
    if (window.__PROJECTS_FALLBACK__) projects = window.__PROJECTS_FALLBACK__;
    else { el.innerHTML = `<div class="column is-12"><div class="notification is-danger">读取 projects.json 失败：${e.message}</div></div>`; return; }
  }

  // 用动态渲染生成更具质感的卡片
  el.innerHTML = projects.map(p => {
    const tags = (p.tags || []).map(t => `<span class="tag is-link is-light mr-1">${t}</span>`).join("");
    
    // 根据项目性质生成一个装饰性图标
    const projectIcon = p.icon || "fa-cube";

    return `
      <div class="column is-6">
        <div class="card" style="height: 100%;">
          <div class="card-content">
            <div class="is-flex is-align-items-center mb-3">
              <span class="icon is-large has-text-primary mr-3" style="background-color: var(--bulma-primary-soft); border-radius: var(--bulma-radius-large); padding: 1rem;">
                <i class="fas ${projectIcon} fa-lg"></i>
              </span>
              <div>
                <p class="title is-5 mb-0">${p.name}</p>
              </div>
            </div>
            
            <div class="content mt-3">
              ${p.description || "暂无描述"}
            </div>
            
            <div class="tags mt-3">
              ${tags}
            </div>
          </div>
          <footer class="card-footer">
            <a class="card-footer-item is-primary" href="${p.url}" target="_blank" rel="noopener">
              <span class="icon is-small mr-1"><i class="fas fa-external-link-alt"></i></span>
              访问项目主页
            </a>
          </footer>
        </div>
      </div>
    `;
  }).join("");
}

initProjects();
