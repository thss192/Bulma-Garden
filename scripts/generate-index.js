const fs = require("fs");
const path = require("path");

const postsDir = path.join(__dirname, "..", "posts");
const files = fs.readdirSync(postsDir).filter(f => f.endsWith(".md"));

const posts = [];
const searchIndex = [];

files.forEach(f => {
  let raw = fs.readFileSync(path.join(postsDir, f), "utf8");
  raw = raw.replace(/[\uFEFF\u200B\u00A0]/g, "").replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  
  const lines = raw.split("\n");
  const meta = {};
  let bodyStartIndex = 0;
  let inFrontMatter = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith("---")) {
      if (!inFrontMatter) { inFrontMatter = true; continue; }
      else { inFrontMatter = false; bodyStartIndex = i + 1; break; }
    }
    if (inFrontMatter) {
      const idx = line.indexOf(":") !== -1 ? line.indexOf(":") : line.indexOf("：");
      if (idx === -1) continue;
      const key = line.slice(0, idx).trim();
      let val = line.slice(idx + 1).trim().replace(/^["']|["']$/g, "");
      if (val.startsWith("[") && val.endsWith("]")) {
        meta[key] = val.slice(1, -1).split(/[,，]/).map(s => s.trim().replace(/^["']|["']$/g, "")).filter(Boolean);
      } else {
        meta[key] = val;
      }
    }
  }

  const slug = f.replace(/\.md$/, "");
  const bodyText = lines.slice(bodyStartIndex).join("\n");

  if (!meta.title || !meta.date) {
    console.warn(`[warn] ${f} 缺少 title 或 date，已用兜底值。解析结果：`, meta);
  }
  posts.push({
    slug: slug,
    title: meta.title || slug,
    date: meta.date || "2000-01-01",
    order: meta.order ? parseInt(meta.order, 10) : 9999, // 提取 order
    tags: meta.tags || [],
    series: meta.series || "",
    summary: meta.summary || ""
  });

  const plainText = bodyText.replace(/```[\s\S]*?```/g, "").replace(/#/g, "").replace(/[*_`~]/g, "").replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/\s+/g, " ").trim();
  searchIndex.push({ slug, title: meta.title || slug, content: plainText });
});

const indexStr = JSON.stringify(posts, null, 2);
const indexPath = path.join(postsDir, "index.json");
if (!fs.existsSync(indexPath) || fs.readFileSync(indexPath, "utf8") !== indexStr) {
  fs.writeFileSync(indexPath, indexStr, "utf8");
  console.log("  -> 更新了 posts/index.json");
}
const searchStr = JSON.stringify(searchIndex);
const searchPath = path.join(postsDir, "search-index.json");
if (!fs.existsSync(searchPath) || fs.readFileSync(searchPath, "utf8") !== searchStr) {
  fs.writeFileSync(searchPath, searchStr, "utf8");
  console.log("  -> 更新了 posts/search-index.json");
}

// 同步文章清单到 js/fallback-data.js 的 __POSTS_FALLBACK__
function syncFallback(posts) {
  const fallbackPath = path.join(__dirname, "..", "js", "fallback-data.js");
  let src = fs.readFileSync(fallbackPath, "utf8");
  const marker = "window.__POSTS_FALLBACK__ =";
  const start = src.indexOf(marker);
  if (start === -1) {
    console.warn("[warn] fallback-data.js 未找到 __POSTS_FALLBACK__，跳过同步");
    return;
  }
  const end = src.indexOf("];", start);
  if (end === -1) {
    console.warn("[warn] fallback-data.js 的 __POSTS_FALLBACK__ 段未正常结束，跳过同步");
    return;
  }
  const next = src.slice(0, start) + marker + " " + JSON.stringify(posts, null, 2) + ";" + src.slice(end + 2);
  if (src !== next) {
    fs.writeFileSync(fallbackPath, next, "utf8");
    console.log("  -> 更新了 js/fallback-data.js (文章列表)");
  }
}

// 同步 config.json 到 js/fallback-data.js 的 __CONFIG__
function syncConfigToFallback() {
  const cfgPath = path.join(__dirname, "..", "config.json");
  const fbPath = path.join(__dirname, "..", "js", "fallback-data.js");
  let cfgRaw = fs.readFileSync(cfgPath, "utf8").replace(/^\uFEFF/, "");
  if (cfgRaw.includes("\uFFFD")) {
    console.error("[err] config.json 有 U+FFFD 替换字符，拒绝同步");
    process.exit(1);
  }
  const cfg = JSON.parse(cfgRaw);
  let fb = fs.readFileSync(fbPath, "utf8");
  const marker = "window.__CONFIG__ =";
  const start = fb.indexOf(marker);
  if (start === -1) { console.warn("[warn] fallback-data.js 未找到 __CONFIG__"); return; }
  const end = fb.indexOf("};\n", start);
  if (end === -1) { console.warn("[warn] __CONFIG__ 段未正常结束"); return; }
  const next = fb.slice(0, start) + marker + " " + JSON.stringify(cfg, null, 2) + ";" + fb.slice(end + 3);
  if (fb !== next) {
    fs.writeFileSync(fbPath, next, "utf8");
    console.log("  -> 更新了 js/fallback-data.js (站点配置)");
  }
  console.log("[ok] config.json 已同步到 fallback-data.js 的 __CONFIG__");
}

const DRY_RUN = process.argv.includes("--dry-run");
if (DRY_RUN) {
  console.log("[dry-run] 解析结果（不会写入任何文件）：");
  console.log(JSON.stringify(posts, null, 2));
  process.exit(0);
}
syncFallback(posts);
syncConfigToFallback();

console.log(`✅ 解析完成，包含 order 字段，共 ${posts.length} 篇文章。`);

