// dev.js - 零依赖的本地开发服务器 + 全目录监听 + 自动刷新
const http = require("http");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const crypto = require("crypto");

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
    
    // 注入自动刷新代码
    if (ext === ".html") {
      let html = data.toString("utf8");
      const reloadScript = `
        <script>
          (function() {
            const ws = new WebSocket('ws://' + location.host);
            ws.onmessage = function(e) {
              if (e.data === 'reload') {
                console.log('🔄 检测到文件变动，自动刷新页面...');
                location.reload();
              }
            };
          })();
        </script>
      `;
      html = html.replace("</body>", reloadScript + "</body>");
      data = Buffer.from(html, "utf8");
    }

    res.writeHead(200, { "Content-Type": contentType, "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate" });
    res.end(data);
  });
});

// 2. WebSocket 广播机制
let wsClients = [];
server.on("upgrade", (req, socket) => {
  if (req.headers.upgrade.toLowerCase() !== "websocket") return socket.destroy();
  const acceptKey = req.headers["sec-websocket-key"];
  const hash = crypto.createHash("sha1").update(acceptKey + "258EAFA5-E914-47DA-95CA-C5AB0DC85B11").digest("base64");
  socket.write("HTTP/1.1 101 Switching Protocols\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Accept: " + hash + "\r\n\r\n");
  wsClients.push(socket);
  socket.on("close", () => { wsClients = wsClients.filter(s => s !== socket); });
  socket.on("error", () => { wsClients = wsClients.filter(s => s !== socket); });
});

function broadcastReload() {
  // 将断开的客户端过滤掉，避免写入异常
  wsClients = wsClients.filter(socket => {
    try {
      if (socket.destroyed) return false;
      const msg = Buffer.from("reload");
      const frame = Buffer.concat([Buffer.from([0x81, msg.length]), msg]);
      socket.write(frame);
      return true;
    } catch (e) {
      return false; // 写入失败则踢出列表
    }
  });
}

server.listen(PORT, () => {
  console.log(`\n🚦 本地开发服务器已启动: http://localhost:${PORT}`);
  console.log(`👀 正在监听整个项目文件夹，修改任意文件均会自动刷新...\n`);
});

// 3. 自动同步脚本逻辑
function runGenerate() {
  console.log("🔄 正在同步数据...");
  exec("node scripts/generate-index.js", (err, stdout, stderr) => {
    if (err) {
      console.error("❌ 生成索引失败:\n", stderr);
    } else {
      console.log(`✅ 数据已同步 ${new Date().toLocaleTimeString()}\n${stdout.trim()}\n`);
      broadcastReload(); // 数据同步完后广播刷新
    }
  });
}

runGenerate();

// 4. 监听整个根目录
let timeout = null;
// 允许监听的后缀（过滤掉不需要刷新的文件，比如图片、字体等）
const ALLOWED_EXTS = [".html", ".css", ".js", ".json", ".md", ".svg"];
// 忽略的文件夹和特定文件（防止刷新死循环）
const IGNORE_DIRS = [".git", "node_modules", "images", "libs"];
const IGNORE_FILES = ["index.json", "search-index.json", "fallback-data.js", "dev.js", "start.bat"];

fs.watch(ROOT, { recursive: true }, (eventType, filename) => {
  if (!filename) return;

  // 1. 过滤掉忽略的目录
  const pathParts = filename.split(path.sep);
  if (pathParts.some(part => IGNORE_DIRS.includes(part))) return;
  
  // 2. 过滤掉忽略的文件
  if (IGNORE_FILES.includes(path.basename(filename))) return;

  // 3. 只处理指定后缀的文件
  const ext = path.extname(filename).toLowerCase();
  if (!ALLOWED_EXTS.includes(ext)) return;

  // 4. 防抖处理：文件保存可能触发多次事件，合并成一次刷新
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    console.log(`📝 检测到变动: ${filename}`);
    
    // 如果改的是 md 文件或 config.json，先跑数据生成，然后再刷新
    if (filename.endsWith(".md") || filename === "config.json" || filename === "projects.json" || filename === "links.json") {
      runGenerate();
    } else {
      // 如果改的是 html/css/js，直接刷新
      broadcastReload();
    }
  }, 150); // 150ms 防抖延迟
});