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

fs.writeFileSync(path.join(postsDir, "index.json"), JSON.stringify(posts, null, 2), "utf8");
fs.writeFileSync(path.join(postsDir, "search-index.json"), JSON.stringify(searchIndex), "utf8");

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
  fs.writeFileSync(fallbackPath, next, "utf8");
}

syncFallback(posts);

console.log(`✅ 解析完成，包含 order 字段，共 ${posts.length} 篇文章。`);

