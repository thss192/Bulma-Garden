// 终极版 Particle Effects
(function () {
  // 动态创建 Canvas，层级设为 z-index: 1，但不阻挡鼠标点击
  const canvas = document.createElement("canvas");
  canvas.id = "effects-canvas";
  canvas.style.cssText = "position:fixed;top:0;left:0;width:100vw;height:100vh;pointer-events:none;z-index:1;";
  document.body.appendChild(canvas); // 放到 body 最后

  const ctx = canvas.getContext("2d");
  let particles = [];
  let animId = null;
  
  // 默认特效：flower，默认透明度：0.6
  let currentEffect = localStorage.getItem("effect") || "flower";
  let currentOpacity = parseFloat(localStorage.getItem("effect_opacity") || "0.6");

  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  window.addEventListener("resize", resize);
  resize();

  const getThemeColor = (hexFallback) => {
    const primary = getComputedStyle(document.documentElement).getPropertyValue("--bulma-primary").trim();
    return primary || hexFallback;
  };

  class Particle {
    constructor(type, isClick) {
      this.type = type;
      this.isClick = isClick;
      this.x = isClick ? isClick.x : Math.random() * canvas.width;
      this.y = isClick ? isClick.y : -30; // 从屏幕顶部上方开始
      
      this.size = isClick ? Math.random() * 8 + 6 : Math.random() * 6 + 4;
      
      // 下落速度
      this.speedX = (Math.random() - 0.5) * 1.2;
      this.speedY = type === "star" ? Math.random() * 1 + 0.5 : Math.random() * 1.5 + 1;
      
      this.life = 1;
      this.decay = isClick ? 0.02 : 0.002;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotSpeed = (Math.random() - 0.5) * 0.04;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.rotation += this.rotSpeed;
      
      if (this.isClick) {
        this.life -= 0.03;
      } else {
        this.life -= this.decay;
        if (this.y > canvas.height + 50 || this.x < -50 || this.x > canvas.width + 50) {
          this.life = 0;
        }
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.globalAlpha = Math.max(0, this.life) * currentOpacity;

      const color = getThemeColor("#00d1b2");
      
      if (this.type === "star") {
        ctx.fillStyle = color;
        ctx.beginPath();
        for (let i = 0; i < 4; i++) {
          ctx.rotate(Math.PI / 2);
          ctx.moveTo(0, 0);
          ctx.quadraticCurveTo(this.size/2, this.size/2, 0, this.size);
        }
        ctx.fill();
      } else if (this.type === "heart") {
        ctx.fillStyle = "#ff4d6d";
        ctx.beginPath();
        ctx.moveTo(0, this.size * 0.3);
        ctx.bezierCurveTo(0, 0, -this.size, -this.size * 0.2, -this.size, -this.size * 0.8);
        ctx.bezierCurveTo(-this.size, -this.size * 1.5, 0, -this.size * 1.5, 0, -this.size * 0.6);
        ctx.bezierCurveTo(0, -this.size * 1.5, this.size, -this.size * 1.5, this.size, -this.size * 0.8);
        ctx.bezierCurveTo(this.size, -this.size * 0.2, 0, 0, 0, this.size * 0.3);
        ctx.fill();
      } else if (this.type === "flower") {
        ctx.fillStyle = "#ffb7c5";
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

  const loop = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 持续生成背景粒子
    if (currentEffect !== "none" && Math.random() < 0.08) {
      particles.push(new Particle(currentEffect, null));
    }

    for (let i = particles.length - 1; i >= 0; i--) {
      particles[i].update();
      particles[i].draw();
      if (particles[i].life <= 0) {
        particles.splice(i, 1);
      }
    }
    animId = requestAnimationFrame(loop);
  };

  // 鼠标点击爆裂特效
  document.addEventListener("click", (e) => {
    if (currentEffect === "none") return;
    if (e.target.closest("button") || e.target.closest("a") || e.target.closest("input")) return;

    const count = currentEffect === "heart" ? 12 : 8;
    for (let i = 0; i < count; i++) {
      particles.push(new Particle(currentEffect, { x: e.clientX, y: e.clientY }));
    }
  });

  // 暴露接口
  window.__setEffect = (effect) => {
    currentEffect = effect;
    localStorage.setItem("effect", effect);
    if (effect !== "none" && !animId) loop();
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

  // 初始启动（强制启动一次以确保可见）
  setTimeout(() => {
    if (currentEffect !== "none") loop();
  }, 500);
})();
