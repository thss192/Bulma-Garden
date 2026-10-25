// Theme Switcher: 亮/暗 模式 + 多种配色
// 设计：DOM 上的 data-theme / data-palette 是唯一真相来源，UI 由 MutationObserver 同步
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

  // ---------- 应用 ----------
  const applyMode = (mode) => {
    if (mode === "dark") html.setAttribute("data-theme", "dark");
    else html.removeAttribute("data-theme");

    const hljs = document.getElementById("hljs-theme");
    if (hljs) hljs.href = mode === "dark" ? "libs/github-dark.min.css" : "libs/github.min.css";
  };

  const applyPalette = (palette) => {
    if (palette === "default") html.removeAttribute("data-palette");
    else html.setAttribute("data-palette", palette);

    // 重置行内变量
    ["primary-h","primary-s","primary-l","link-h","link-s","link-l"].forEach(k =>
      html.style.removeProperty("--bulma-" + k)
    );

    if (palette === "mono") {
      html.style.setProperty("--bulma-primary-h", "220");
      html.style.setProperty("--bulma-primary-s", "10%");
      html.style.setProperty("--bulma-primary-l", "45%");
      html.style.setProperty("--bulma-link-h", "220");
      html.style.setProperty("--bulma-link-s", "10%");
      html.style.setProperty("--bulma-link-l", "45%");
    } else if (window.__CONFIG__ && window.__CONFIG__.theme) {
      // 非 mono 且非 default 时，仍以 config 里的 HSL 为基准（custom-themes.css 会覆盖它们）
      const t = window.__CONFIG__.theme;
      if (t.primary) {
        html.style.setProperty("--bulma-primary-h", t.primary.h);
        html.style.setProperty("--bulma-primary-s", t.primary.s + "%");
        html.style.setProperty("--bulma-primary-l", t.primary.l + "%");
      }
      if (t.link) {
        html.style.setProperty("--bulma-link-h", t.link.h);
        html.style.setProperty("--bulma-link-s", t.link.s + "%");
        html.style.setProperty("--bulma-link-l", t.link.l + "%");
      }
    }
  };

  // ---------- UI 同步 ----------
  const syncUI = () => {
    const mode = currentMode();
    const palette = currentPalette();
    document.querySelectorAll("#theme-panel .mode-btn").forEach(b =>
      b.classList.toggle("is-active", b.dataset.mode === mode)
    );
    document.querySelectorAll("#theme-panel .palette-btn").forEach(b =>
      b.classList.toggle("is-active", b.dataset.palette === palette)
    );
  };

  // ---------- 面板构建 ----------
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

    panel.addEventListener("click", (e) => {
      const modeBtn = e.target.closest(".mode-btn");
      if (modeBtn) {
        localStorage.setItem(KEY_MODE, modeBtn.dataset.mode);
        applyMode(modeBtn.dataset.mode);
        return;
      }
      const palBtn = e.target.closest(".palette-btn");
      if (palBtn) {
        localStorage.setItem(KEY_PALETTE, palBtn.dataset.palette);
        applyPalette(palBtn.dataset.palette);
      }
    });
  };

  // ---------- 真相来源 -> UI 同步 ----------
  const observeHtml = () => {
    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === "attributes" &&
            (m.attributeName === "data-theme" || m.attributeName === "data-palette" || m.attributeName === "style")) {
          syncUI();
          // 若外部改了 data-theme，同步 hljs
          if (m.attributeName === "data-theme") {
            const hljs = document.getElementById("hljs-theme");
            if (hljs) hljs.href = currentMode() === "dark" ? "libs/github-dark.min.css" : "libs/github.min.css";
          }
        }
      }
    });
    observer.observe(html, { attributes: true, attributeFilter: ["data-theme", "data-palette", "style"] });
  };

  // ---------- 初始化 ----------
  const init = () => {
    // 1) 首次读取存储
    const savedMode = localStorage.getItem(KEY_MODE);
    const savedPalette = localStorage.getItem(KEY_PALETTE);
    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialMode = savedMode || (prefersDark ? "dark" : "light");
    const initialPalette = savedPalette || "default";

    // 2) 应用（先应用，再构建面板，这样面板初次渲染就能对）
    applyMode(initialMode);
    applyPalette(initialPalette);

    // 3) 面板 + 观察
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
