// 极致性能版 Particle Effects (去光晕，缓存变量，控制上限)
(function () {
  const canvas = document.createElement("canvas");
  canvas.id = "effects-canvas";
  canvas.style.cssText = "position:fixed;top:0;left:0;width:100vw;height:100vh;pointer-events:none;z-index:1;";
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d", { alpha: true });
  let particles = [];
  let animId = null;
  
  let currentEffect = localStorage.getItem("effect") || "flower";
  let currentOpacity = parseFloat(localStorage.getItem("effect_opacity") || "0.6");

  // 缓存颜色，防止每帧重排（极度影响性能）
  let cachedColor = { r: 0, g: 209, b: 178 }; // 默认薄荷绿 RGB
  
  const updateThemeColor = () => {
    const hex = getComputedStyle(document.documentElement).getPropertyValue("--bulma-primary").trim();
    if (hex && hex.startsWith("#")) {
      // 将 hex 转为 RGB 并缓存
      const bigint = parseInt(hex.slice(1), 16);
      cachedColor = { r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255 };
    }
  };
  // 初始化和主题切换时更新颜色
  setTimeout(updateThemeColor, 500);
  window.__updateEffectColor = updateThemeColor;

  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  window.addEventListener("resize", resize);
  resize();

  class Particle {
    constructor(type, isClick) {
      this.type = type;
      this.isClick = isClick;
      this.x = isClick ? isClick.x : Math.random() * canvas.width;
      this.y = isClick ? isClick.y : -30; 
      this.size = isClick ? Math.random() * 8 + 6 : Math.random() * 6 + 4;
      
      if (isClick) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 4 + 2; 
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.friction = 0.96;
        this.maxLife = 1500;
        this.birth = performance.now();
      } else {
        this.vx = (Math.random() - 0.5) * 1.2;
        this.vy = type === "star" ? Math.random() * 1 + 0.5 : Math.random() * 1.5 + 1;
        this.decay = 0.002;
      }
      this.life = 1;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotSpeed = (Math.random() - 0.5) * 0.04;
    }

    update(now) {
      if (this.isClick) {
        this.life = Math.max(0, 1 - (now - this.birth) / this.maxLife);
        this.vx *= this.friction;
        this.vy *= this.friction;
        this.x += this.vx;
        this.y += this.vy;
      } else {
        this.x += this.vx;
        this.y += this.vy;
        this.life -= this.decay;
        if (this.y > canvas.height + 50 || this.x < -50 || this.x > canvas.width + 50) this.life = 0;
      }
      this.rotation += this.rotSpeed;
    }

    draw() {
      const alpha = Math.max(0, this.life) * currentOpacity;
      if (alpha <= 0) return;

      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);

      // 性能优化：直接用 rgba 渲染，不再使用 globalAlpha
      const { r, g, b } = cachedColor;

      if (this.type === "star") {
        // 双层绘制模拟发光（极速）
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha * 0.4})`;
        ctx.beginPath(); ctx.arc(0, 0, this.size * 0.5, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
        ctx.beginPath();
        const s = this.size;
        ctx.moveTo(0, -s); ctx.quadraticCurveTo(0, 0, s, 0);
        ctx.quadraticCurveTo(0, 0, 0, s); ctx.quadraticCurveTo(0, 0, -s, 0);
        ctx.quadraticCurveTo(0, 0, 0, -s); ctx.fill();
      } else if (this.type === "heart") {
        ctx.fillStyle = `rgba(255, 77, 109, ${alpha})`;
        ctx.beginPath();
        ctx.moveTo(0, this.size * 0.3);
        ctx.bezierCurveTo(0, 0, -this.size, -this.size * 0.2, -this.size, -this.size * 0.8);
        ctx.bezierCurveTo(-this.size, -this.size * 1.5, 0, -this.size * 1.5, 0, -this.size * 0.6);
        ctx.bezierCurveTo(0, -this.size * 1.5, this.size, -this.size * 1.5, this.size, -this.size * 0.8);
        ctx.bezierCurveTo(this.size, -this.size * 0.2, 0, 0, 0, this.size * 0.3);
        ctx.fill();
      } else if (this.type === "flower") {
        ctx.fillStyle = `rgba(255, 183, 197, ${alpha})`;
        ctx.beginPath();
        const petals = 5;
        for (let i = 0; i < petals; i++) {
          ctx.rotate(Math.PI * 2 / petals);
          ctx.moveTo(0, 0);
          ctx.quadraticCurveTo(this.size * 0.8, -this.size * 0.8, 0, -this.size);
          ctx.quadraticCurveTo(-this.size * 0.3, -this.size * 0.5, 0, 0);
        }
        ctx.fill();
      }
      ctx.restore();
    }
  }

  const loop = (now) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 性能优化：背景粒子数量上限 60，点击粒子上限 100
    const bgCount = particles.filter(p => !p.isClick).length;
    if (currentEffect !== "none" && bgCount < 60 && Math.random() < 0.08) {
      particles.push(new Particle(currentEffect, null));
    }

    for (let i = particles.length - 1; i >= 0; i--) {
      particles[i].update(now);
      particles[i].draw();
      if (particles[i].life <= 0) {
        particles.splice(i, 1);
      }
    }
    animId = requestAnimationFrame(loop);
  };

  document.addEventListener("click", (e) => {
    if (currentEffect === "none") return;
    if (e.target.closest("button") || e.target.closest("a") || e.target.closest("input")) return;

    // 性能优化：防止狂点导致卡顿
    const clickCount = particles.filter(p => p.isClick).length;
    if (clickCount > 100) return;

    const count = 15;
    for (let i = 0; i < count; i++) {
      particles.push(new Particle(currentEffect, { x: e.clientX, y: e.clientY }));
    }
  });

  window.__setEffect = (effect) => {
    currentEffect = effect;
    localStorage.setItem("effect", effect);
    if (effect !== "none" && !animId) requestAnimationFrame(loop);
    if (effect === "none") {
      particles = [];
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (animId) { cancelAnimationFrame(animId); animId = null; }
    }
  };

  window.__setEffectOpacity = (val) => {
    currentOpacity = parseFloat(val);
    localStorage.setItem("effect_opacity", currentOpacity);
  };

  setTimeout(() => {
    if (currentEffect !== "none") requestAnimationFrame(loop);
  }, 500);
})();
