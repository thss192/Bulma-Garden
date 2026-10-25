// Theme Switcher UI Controller
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
  const EFFECTS = [
    { id: "none",   label: "关闭", icon: "fa-ban" },
    { id: "star",   label: "星空", icon: "fa-star" },
    { id: "heart",  label: "爱心", icon: "fa-heart" },
    { id: "flower", label: "花朵", icon: "fa-fan" },
  ];
  
  const KEY_MODE = "theme";
  const KEY_PALETTE = "palette";
  const KEY_EFFECT = "effect";
  const KEY_OPACITY = "effect_opacity";
  const html = document.documentElement;

  const currentMode = () => (html.getAttribute("data-theme") === "dark" ? "dark" : "light");
  const currentPalette = () => html.getAttribute("data-palette") || "default";
  const currentEffect = () => localStorage.getItem(KEY_EFFECT) || "flower";
  const currentOpacity = () => localStorage.getItem(KEY_OPACITY) || "0.6";

  const syncUI = () => {
    const mode = currentMode();
    const palette = currentPalette();
    const effect = currentEffect();
    
    document.querySelectorAll("#theme-panel .mode-btn").forEach(b => {
      b.classList.toggle("is-active", b.dataset.mode === mode);
    });
    document.querySelectorAll("#theme-panel .palette-btn").forEach(b => {
      b.classList.toggle("is-active", b.dataset.palette === palette);
    });
    document.querySelectorAll("#theme-panel .effect-btn").forEach(b => {
      b.classList.toggle("is-active", b.dataset.effect === effect);
    });

    const slider = document.getElementById("effect-opacity");
    if (slider) slider.value = currentOpacity();
  };

  const buildPanel = () => {
    if (document.getElementById("theme-fab")) return;

    const mode = currentMode();
    const palette = currentPalette();
    const effect = currentEffect();
    const opacity = currentOpacity();

    const modeHtml = MODES.map(m => `
      <button class="mode-btn ${m === mode ? "is-active" : ""}" data-mode="${m}">
        <i class="fas ${m === "light" ? "fa-sun" : "fa-moon"}"></i>
        ${m === "light" ? "亮色" : "暗色"}
      </button>`).join("");

    const paletteHtml = PALETTES.map(p => `
      <button class="palette-btn ${p.id === palette ? "is-active" : ""}"
              data-palette="${p.id}" data-label="${p.label}" title="${p.label}"></button>`).join("");

    const effectHtml = EFFECTS.map(e => `
      <button class="effect-btn ${e.id === effect ? "is-active" : ""}" data-effect="${e.id}" title="${e.label}">
        <i class="fas ${e.icon}"></i>
      </button>`).join("");

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
        <div class="panel-divider"></div>
        <p class="panel-title">页面特效</p>
        <div class="effect-grid">${effectHtml}</div>
        <div class="opacity-row">
          <span>透明度</span>
          <input type="range" id="effect-opacity" min="0" max="1" step="0.1" value="${opacity}">
        </div>
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

    panel.addEventListener("click", (e) => {
      const modeBtn = e.target.closest(".mode-btn");
      if (modeBtn) {
        localStorage.setItem(KEY_MODE, modeBtn.dataset.mode);
        window.__applyTheme();
        setTimeout(syncUI, 0); 
        return;
      }
      const palBtn = e.target.closest(".palette-btn");
      if (palBtn) {
        localStorage.setItem(KEY_PALETTE, palBtn.dataset.palette);
        window.__applyTheme();
        setTimeout(syncUI, 0); 
        return;
      }
      const effBtn = e.target.closest(".effect-btn");
      if (effBtn) {
        if (window.__setEffect) window.__setEffect(effBtn.dataset.effect);
        setTimeout(syncUI, 0);
      }
    });

    // 监听滑块拖动
    const slider = document.getElementById("effect-opacity");
    slider.addEventListener("input", (e) => {
      if (window.__setEffectOpacity) window.__setEffectOpacity(e.target.value);
    });
  };

  const init = () => {
    buildPanel();
    syncUI();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
