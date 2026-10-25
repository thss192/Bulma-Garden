// Theme Switcher UI Controller
// 状态管理由 common.js 的 applyTheme 统一接管，这里只负责绘制面板和响应用户操作
(function () {
  const MODES = ["light", "dark"];
  const PALETTES = [
    { id: "default", label: "薄荷" },
    { id: "forest",  label: "森林" },
    { id: "sakura",  label: "樱花" },
    { id: "ocean",   label: "海洋" },
    { id: "sunset",  label: "落日" },
    { id: "mono",    label: "极简" },
  ];
  const KEY_MODE = "theme";
  const KEY_PALETTE = "palette";
  const html = document.documentElement;

  const currentMode = () => (html.getAttribute("data-theme") === "dark" ? "dark" : "light");
  const currentPalette = () => html.getAttribute("data-palette") || "default";

  // ---------- UI 状态同步 ----------
  const syncUI = () => {
    const mode = currentMode();
    const palette = currentPalette();
    
    // 同步模式按钮的内联样式（最暴力的高亮方式，防止被框架覆盖）
    document.querySelectorAll("#theme-panel .mode-btn").forEach(b => {
      if (b.dataset.mode === mode) {
        b.classList.add("is-active");
      } else {
        b.classList.remove("is-active");
      }
    });

    // 同步配色按钮
    document.querySelectorAll("#theme-panel .palette-btn").forEach(b => {
      if (b.dataset.palette === palette) {
        b.classList.add("is-active");
      } else {
        b.classList.remove("is-active");
      }
    });
  };

  // ---------- 构建面板 ----------
  const buildPanel = () => {
    if (document.getElementById("theme-fab")) return;

    const mode = currentMode();
    const palette = currentPalette();

    const modeHtml = MODES.map(m => `
      <button class="mode-btn ${m === mode ? "is-active" : ""}" data-mode="${m}">
        <i class="fas ${m === "light" ? "fa-sun" : "fa-moon"}"></i>
        ${m === "light" ? "亮色" : "暗色"}
      </button>`).join("");

    const paletteHtml = PALETTES.map(p => `
      <button class="palette-btn ${p.id === palette ? "is-active" : ""}"
              data-palette="${p.id}" data-label="${p.label}" title="${p.label}"></button>`).join("");

    document.body.insertAdjacentHTML("beforeend", `
      <button id="theme-fab" title="切换主题" aria-label="切换主题">
        <i class="fas fa-palette"></i>
      </button>
      <div id="theme-panel" role="dialog" aria-label="主题选择">
        <p class="panel-title">显示模式</p>
        <div class="mode-row">${modeHtml}</div>
        <div class="panel-divider"></div>
        <p class="panel-title">配色方案</p>
        <div class="palette-grid">${paletteHtml}</div>
      </div>
    `);

    const fab = document.getElementById("theme-fab");
    const panel = document.getElementById("theme-panel");

    fab.addEventListener("click", (e) => {
      e.stopPropagation();
      panel.classList.toggle("is-open");
    });
    document.addEventListener("click", (e) => {
      if (!panel.contains(e.target) && e.target !== fab) panel.classList.remove("is-open");
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") panel.classList.remove("is-open");
    });

    // 点击事件交给 common.js 去真正修改状态，这里只更新 localStorage
    panel.addEventListener("click", (e) => {
      const modeBtn = e.target.closest(".mode-btn");
      if (modeBtn) {
        localStorage.setItem(KEY_MODE, modeBtn.dataset.mode);
        if (window.__applyTheme) window.__applyTheme();
        return;
      }
      const palBtn = e.target.closest(".palette-btn");
      if (palBtn) {
        localStorage.setItem(KEY_PALETTE, palBtn.dataset.palette);
        if (window.__applyTheme) window.__applyTheme();
      }
    });
  };

  // ---------- 监听真理变化 ----------
  const observeHtml = () => {
    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === "attributes" && (m.attributeName === "data-theme" || m.attributeName === "data-palette")) {
          syncUI();
        }
      }
    });
    observer.observe(html, { attributes: true, attributeFilter: ["data-theme", "data-palette"] });
  };

  const init = () => {
    buildPanel();
    observeHtml();
    syncUI();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();