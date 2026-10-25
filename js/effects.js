// 完美版 Particle Effects (星星重构 + 点击爆炸扩散 + 1.5s 寿命)
(function () {
  const canvas = document.createElement("canvas");
  canvas.id = "effects-canvas";
  canvas.style.cssText = "position:fixed;top:0;left:0;width:100vw;height:100vh;pointer-events:none;z-index:1;";
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  let particles = [];
  let animId = null;
  
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
      
      // 坐标
      this.x = isClick ? isClick.x : Math.random() * canvas.width;
      this.y = isClick ? isClick.y : -30; 
      
      // 大小
      this.size = isClick ? Math.random() * 8 + 6 : Math.random() * 6 + 4;
      
      // 运动学参数
      if (isClick) {
        // === 点击爆炸效果 ===
        // 随机角度，全向扩散
        const angle = Math.random() * Math.PI * 2;
        // 速度不一致：基础速度 + 随机增量
        const speed = Math.random() * 4 + 2; 
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        // 爆炸受到的阻力（摩擦力）
        this.friction = 0.96;
        
        // 存活时间：1.5s
        this.maxLife = 1500; // 毫秒
        this.birth = performance.now();
        this.life = 1; 
      } else {
        // === 背景自然飘落 ===
        this.vx = (Math.random() - 0.5) * 1.2;
        this.vy = type === "star" ? Math.random() * 1 + 0.5 : Math.random() * 1.5 + 1;
        this.life = 1;
        this.decay = 0.002;
      }
      
      this.rotation = Math.random() * Math.PI * 2;
      this.rotSpeed = (Math.random() - 0.5) * 0.04;
      
      this.twinkleSpeed = Math.random() * 0.05 + 0.02;
      this.twinklePhase = Math.random() * Math.PI * 2;
    }

    update(now) {
      if (this.isClick) {
        // 1.5秒衰减计算
        const age = now - this.birth;
        this.life = Math.max(0, 1 - age / this.maxLife);

        // 物理运动（施加摩擦）
        this.vx *= this.friction;
        this.vy *= this.friction;
        this.x += this.vx;
        this.y += this.vy;
      } else {
        // 自然飘落
        this.x += this.vx;
        this.y += this.vy;
        this.life -= this.decay;
        if (this.y > canvas.height + 50 || this.x < -50 || this.x > canvas.width + 50) {
          this.life = 0;
        }
      }

      this.rotation += this.rotSpeed;
      if (this.type === "star") {
        this.twinklePhase += this.twinkleSpeed;
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      
      if (this.type === "star") {
        ctx.rotate(this.rotation * 0.2); 
      } else {
        ctx.rotate(this.rotation);
      }
      
      const twinkle = this.type === "star" ? (Math.sin(this.twinklePhase) * 0.3 + 0.7) : 1;
      ctx.globalAlpha = Math.max(0, this.life) * currentOpacity * twinkle;

      const color = getThemeColor("#00d1b2");
      
      if (this.type === "star") {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(0, 0, this.size * 0.2, 0, Math.PI * 2);
        ctx.fill();
        
        const s = this.size;
        ctx.beginPath();
        ctx.moveTo(0, -s);
        ctx.quadraticCurveTo(0, 0, s, 0);
        ctx.quadraticCurveTo(0, 0, 0, s);
        ctx.quadraticCurveTo(0, 0, -s, 0);
        ctx.quadraticCurveTo(0, 0, 0, -s);
        ctx.fill();
        
        ctx.shadowColor = color;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
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

  const loop = (now) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 背景持续生成
    if (currentEffect !== "none" && Math.random() < 0.08) {
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

    // 点击产生 15 个粒子四处扩散
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
