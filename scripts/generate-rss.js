// scripts/generate-rss.js
const fs = require("fs");
const path = require("path");
// 不需要额外的 npm 包，原生拼字符串即可
const postsDir = path.join(__dirname, "..", "posts");
const indexJson = JSON.parse(fs.readFileSync(path.join(postsDir, "index.json"), "utf8"));
const config = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "config.json"), "utf8"));

// 替换成你最终部署的域名
const SITE_URL = "https://your-domain.com"; 

let items = "";
indexJson.forEach(post => {
  const url = `${SITE_URL}/post.html?slug=${post.slug}`;
  items += `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${url}</link>
      <guid>${url}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <description><![CDATA[${post.summary}]]></description>
    </item>
  `;
});

const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
<channel>
  <title>${config.siteTitle}</title>
  <link>${SITE_URL}</link>
  <description>${config.siteSubtitle}</description>
  <language>zh-CN</language>
  ${items}
</channel>
</rss>`;

fs.writeFileSync(path.join(__dirname, "..", "rss.xml"), rss, "utf8");
console.log("✅ 已生成 rss.xml");
