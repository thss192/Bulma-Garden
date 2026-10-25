// dev.js - 零依赖的本地开发服务器 + 文件竑听
const http = require("http");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

const PORT = process.env.PORT || 8000;
const ROOT = __dirname;

// 1. 极简静态文件服务器
const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".md": "text/markdown; charset=utf-8",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".woff": "font/woff"
};

const server = http.createServer((req, res) => {
  // 防止 path 渗染参，避免 post.html?slug=xxx 报错
  let urlPath = req.url.split("?")[0];
  if (urlPath === "/") urlPath = "/index.html";

  const filePath = path.join(ROOT, decodeURIComponent(urlPath));
  
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("404 Not Found");
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || "application/octet-stream";
    res.writeHead(200, { "Content-Type": contentType, "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate" });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`\n🚦 本地开发服务器已启动: http://localhost:${PORT}`);
  console.log(`👀 正在监听 posts/━、config.json、projects.json 变化...\n`);
});

// 2. 文件监听与自动同步
function runGenerate() {
  console.log("🔄 正在同步数据...");
  exec("node scripts/generate-index.js", (err, stdout, stderr) => {
    if (err) {
      console.error("❌ 生成索引数据失败:\n", stderr);
    } else {
      console.log(`✅ 数据已同步完比 ${new Date().toLocaleTimeString()}\n${stdout.trim()}\n`);
    }
  });
}

// 初始化时先跑一次，确保数据是最新的
runGenerate();

const watchTargets = [
  path.join(ROOT, "posts"),
  path.join(ROOT, "config.json"),
  path.join(ROOT, "projects.json"),
  path.join(ROOT, "links.json"),
  path.join(ROOT, "custom.css")
];

let timeout = null;
watchTargets.forEach(target => {
  if (fs.existsSync(target)) {
    fs.watch(target, { recursive: true }, (eventType, filename) => {
      // 忽略脚本自己生成的文件变化，防止死循环
      if (filename && (filename.includes("index.json") || filename.includes("search-index.json") || filename.includes("fallback-data"))) return;
      
      // 防抖：文件保存可能会触发多次事件
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        console.log(`📝 检测到变动: ${filename || target}`);
        runGenerate();
      }, 100);
    });
  }
});
