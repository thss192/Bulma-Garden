// 关于页：读取 config.json 渲染开发者名片

async function initAbout() {
  const config = await initLayout("about.html");
  const el = document.getElementById("about-content");
  const a = config.author || {};

  // 计算工作年限
  const currentYear = new Date().getFullYear();
  const startYear = 2021; 
  const experience = currentYear - startYear;

  el.innerHTML = `
    <div class="columns is-vcentered mt-5">
      <!-- 左侧：头像与基础信息 -->
      <div class="column is-4 has-text-centered">
        <div class="about-card" style="border-radius: var(--bulma-radius-large); overflow: hidden; padding: 2rem 1rem;">
          <figure class="image is-128x128 is-inline-block mb-4">
            <img class="about-avatar is-rounded" src="${a.avatar || "images/avatar.png"}" alt="头像">
          </figure>
          <h2 class="title is-4 mb-1">${a.name || "佚名"}</h2>
          <p class="subtitle is-6 has-text-primary mb-3">${a.bio || "前端开发者"}</p>
          
          <div class="tags is-centered mb-4">
            <span class="tag is-light">全栈开发</span>
            <span class="tag is-light">${experience} 年经验</span>
          </div>

          <div class="buttons is-centered">
            <a href="mailto:${a.email}" class="button is-small is-primary is-light">
              <span class="icon"><i class="fas fa-envelope"></i></span>
              <span>发邮件</span>
            </a>
          </div>
        </div>
      </div>

      <!-- 右侧：详细介绍 -->
      <div class="column is-8">
        <div class="content is-medium about-content-text">
          <h3 class="title is-3 mb-4">你好，我是 ${a.name || "佚名"} 👋</h3>
          <p>
            欢迎来到我的数字花园。我是一名热爱技术、喜欢折腾的开发者。在这里，我会记录我在编程路上的所学、所思、所想。
          </p>
          <p>
            如果你对我的文章感兴趣，或者有项目想要合作，欢迎随时通过邮件与我联系。
          </p>
          
          <hr style="border-top: 1px dashed var(--bulma-border-weak); margin: 2rem 0;">

          <h4 class="title is-5 mb-3">联系我</h4>
          <div class="tags are-medium">
            <a href="mailto:${a.email}" class="tag is-link is-light">
              <span class="icon is-small mr-1"><i class="fas fa-envelope"></i></span> ${a.email}
            </a>
          </div>
        </div>
      </div>
    </div>
  `;
}

initAbout();
