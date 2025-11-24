document.addEventListener("DOMContentLoaded", () => {
  const navIcons = document.querySelectorAll(".nav-icon");
  const pages = document.querySelectorAll(".page");
  const routeMap = {
    "/": "home",
    "/home": "home",
    "/games": "games",
    "/apps": "apps",
    "/settings": "settings"
  };
  const validPages = Array.from(pages).map(p => p.id);

  function switchPage(targetPage, pushState = true) {
    if (!validPages.includes(targetPage)) return;
    navIcons.forEach(i => i.classList.remove("active"));
    pages.forEach(p => {
      p.classList.remove("active");
      p.setAttribute("aria-hidden", "true");
    });
    const icon = document.querySelector(`.nav-icon[data-page="${targetPage}"]`);
    const page = document.getElementById(targetPage);
    if (icon) icon.classList.add("active");
    if (page) {
      page.classList.add("active");
      page.removeAttribute("aria-hidden");
      page.style.animation = "contentFade 0.5s ease both";
    }
    if (pushState) {
      const path = Object.keys(routeMap).find(k => routeMap[k] === targetPage) || "/";
      history.pushState({ page: targetPage }, "", path);
    }
    if (targetPage === "apps" && typeof renderApps === "function") renderApps();
    if (targetPage === "games" && typeof renderGames === "function") renderGames();
    if (targetPage === "settings" && typeof renderSettings === "function") renderSettings();
  }

  function routeFromPath() {
    const path = location.pathname.replace(/\/+$/, "") || "/";
    const target = routeMap[path] || "home";
    switchPage(target, false);
  }

  window.addEventListener("popstate", routeFromPath);

  navIcons.forEach(icon => {
    icon.addEventListener("click", (e) => {
      e.preventDefault();
      const targetPage = icon.getAttribute("data-page");
      if (targetPage === "search") {
        fetch('proxy.html')
          .then(response => response.text())
          .then(html => {
            document.getElementById('search').innerHTML = html;
            switchPage('search');
          })
          .catch(err => console.error('Failed to load proxy.html:', err));
      } else {
        switchPage(targetPage, true);
      }
    });
  });

  routeFromPath();
});
