(function () {
  "use strict";

  const D = window.PORTFOLIO;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };

  const ICONS = {
    github: '<path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21"/>',
    linkedin: '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>',
    x: '<path d="M4 4l11.7 16H20L8.3 4z"/><path d="M4 20l6.8-6.8M13.2 10.8 20 4"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
    phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/>',
    pin: '<path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
    brief: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
    cap: '<path d="M22 10 12 5 2 10l10 5 10-5z"/><path d="M6 12v5c3 2 9 2 12 0v-5"/>',
    layout: '<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M3 9h18M9 21V9"/>',
    server: '<rect x="3" y="3" width="18" height="7" rx="2"/><rect x="3" y="14" width="18" height="7" rx="2"/><path d="M7 6.5h.01M7 17.5h.01"/>',
    tool: '<path d="M14.7 6.3a4 4 0 0 0 5 5L21 13l-8 8-3-3 6.3-6.3a4 4 0 0 1-5-5L13 5z"/><path d="m3 21 6-6"/>',
    repo: '<path d="M4 19.5V5a2 2 0 0 1 2-2h13v15H6.5a2.5 2.5 0 0 0 0 5H19"/><path d="M9 3v7l2-1.5L13 10V3"/>',
    star: '<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3 6.4 20.2l1.1-6.2L3 9.6l6.2-.9z"/>',
    fork: '<circle cx="6" cy="5" r="2"/><circle cx="18" cy="5" r="2"/><circle cx="12" cy="19" r="2"/><path d="M6 7v1a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3V7M12 11v6"/>',
    arrow: '<path d="M7 17 17 7M8 7h9v9"/>',
    chev: '<path d="m9 6 6 6-6 6"/>'
  };
  const icon = (n) => `<svg viewBox="0 0 24 24" aria-hidden="true">${ICONS[n] || ""}</svg>`;
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  let lang = store.get("lang") === "tr" ? "tr" : "en";
  const t = (v) => (v && typeof v === "object" && !Array.isArray(v) ? v[lang] ?? v.en ?? "" : v ?? "");
  const ui = () => D.ui[lang];
  const locale = () => (lang === "tr" ? "tr-TR" : "en-US");

  const fmtDate = (ym) => {
    if (!ym) return ui().present;
    const [y, m] = ym.split("-").map(Number);
    return new Intl.DateTimeFormat(locale(), { month: "short", year: "numeric" }).format(new Date(y, (m || 1) - 1));
  };

  const duration = (start, end) => {
    const [sy, sm] = start.split("-").map(Number);
    const now = new Date();
    const [ey, em] = end ? end.split("-").map(Number) : [now.getFullYear(), now.getMonth() + 1];
    const months = (ey - sy) * 12 + (em - sm) + 1;
    const y = Math.floor(months / 12), m = months % 12;
    return [y && `${y} ${ui().yr}`, m && `${m} ${ui().mo}`].filter(Boolean).join(" ");
  };

  const timeAgo = (iso) => {
    const diff = (new Date(iso) - Date.now()) / 1000;
    const rtf = new Intl.RelativeTimeFormat(lang, { numeric: "auto" });
    const units = [["year", 31536000], ["month", 2592000], ["week", 604800], ["day", 86400], ["hour", 3600], ["minute", 60]];
    for (const [u, s] of units) if (Math.abs(diff) >= s) return rtf.format(Math.round(diff / s), u);
    return rtf.format(0, "minute");
  };

  const initialsOf = (name) =>
    String(name || "")
      .split(/\s+/)
      .map((w) => (w.match(/[\p{L}\p{N}]/u) || [""])[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toLocaleUpperCase("tr");

  const logoTile = (src, name) => {
    const mono = initialsOf(name);
    return src
      ? `<span class="logo-tile has-img"><img src="${esc(src)}" alt="${esc(name)}" loading="lazy"
          onerror="this.parentNode.classList.remove('has-img');this.parentNode.textContent='${mono}'"></span>`
      : `<span class="logo-tile" aria-hidden="true">${esc(mono)}</span>`;
  };

  const chips = (list) => (list && list.length ? `<div class="chips">${list.map((x) => `<span class="chip">${esc(x)}</span>`).join("")}</div>` : "");

  function render() {
    const U = ui();
    document.documentElement.lang = lang;
    document.title = D.meta.name;

    $$("[data-t]").forEach((el) => (el.textContent = U[el.dataset.t] ?? ""));

    const photo = D.meta.avatar;
    $("[data-brand]").innerHTML =
      (photo
        ? `<span class="brand-mark has-photo"><img src="${esc(photo)}" alt=""></span>`
        : `<span class="brand-mark">${esc(D.meta.initials)}</span>`) +
      `<span class="brand-text">${esc(D.meta.name)}</span>`;

    $("[data-nav]").innerHTML = ["about", "skills", "experience", "repos", "contact"]
      .map((s) => `<li><a href="#${s}" data-link="${s}">${esc(U.nav[s])}</a></li>`)
      .join("");
    $("[data-lang-toggle]").setAttribute("aria-label", U.langLabel);
    $("[data-theme-toggle]").setAttribute("aria-label", U.themeLabel);
    $("[data-theme-toggle]").title = U.themeLabel;

    $$("[data-avatar]").forEach((el) => {
      el.innerHTML = photo ? `<img src="${esc(photo)}" alt="${esc(D.meta.name)}">` : esc(D.meta.initials);
      el.classList.toggle("has-photo", !!photo);
    });
    $("[data-greeting]").textContent = t(D.hero.greeting);
    $("[data-name]").textContent = D.meta.name;
    $("[data-role]").innerHTML = t(D.hero.roles).map(esc).join("<i>·</i>");
    $("[data-tagline]").textContent = t(D.hero.tagline);

    const ghUrl = `https://github.com/${D.github.username}`;
    const ghHero = $("[data-gh-hero]");
    ghHero.href = ghUrl;
    ghHero.innerHTML = `${icon("github")}<span>GitHub</span>`;
    const cv = $("[data-cv]");
    cv.hidden = !D.meta.cv;
    if (D.meta.cv) cv.href = D.meta.cv;

    $$("[data-section]").forEach((el) => {
      const s = U.sections[el.dataset.section];
      el.innerHTML = `<span class="eyebrow">${esc(s.eyebrow)}</span><h2 class="section-title">${esc(s.title)}</h2>`;
    });
    $$("[data-section-title]").forEach((el) => (el.textContent = U.sections[el.dataset.sectionTitle].title));

    $("[data-about]").innerHTML =
      t(D.about.paragraphs).map((p) => `<p>${esc(p)}</p>`).join("") +
      `<div class="about-meta">
        <span class="chip">${icon("pin")}${esc(t(D.meta.location))}</span>
        <span class="chip">${icon("mail")}${esc(D.meta.email)}</span>
      </div>`;

    $("[data-skills]").innerHTML = D.skills
      .map(
        (g) => `<article class="glass skill-card reveal">
          <div class="skill-head"><span class="skill-icon">${icon(g.icon)}</span><h3>${esc(t(g.category))}</h3></div>
          <ul class="skill-tags">${g.items.map((it) => `<li>${esc(it)}</li>`).join("")}</ul>
        </article>`
      )
      .join("");
    $("[data-tools]").innerHTML = D.tools.map((x) => `<span class="chip">${esc(x)}</span>`).join("");

    $("[data-experience]").innerHTML = D.experience
      .map((e) => {
        const hl = t(e.highlights) || [];
        return `<li class="tl-item reveal ${e.end ? "" : "current"}">
          <span class="tl-dot"></span>
          <article class="glass tl-card">
            <div class="tl-top">
              <div class="tl-head">
                ${logoTile(e.logo, e.company)}
                <div>
                  <h3 class="tl-role">${esc(t(e.role))}</h3>
                  <p class="tl-company"><strong>${esc(e.company)}</strong>
                    ${t(e.location) ? `<span>${icon("pin")}${esc(t(e.location))}</span>` : ""}
                    ${t(e.type) ? `<span>${icon("brief")}${esc(t(e.type))}</span>` : ""}
                  </p>
                </div>
              </div>
              <div class="tl-date">${fmtDate(e.start)} — ${fmtDate(e.end)}<small>${duration(e.start, e.end)}</small></div>
            </div>
            ${t(e.description) ? `<p class="tl-desc">${esc(t(e.description))}</p>` : ""}
            ${hl.length ? `<ul class="tl-highlights">${hl.map((h) => `<li>${esc(h)}</li>`).join("")}</ul>` : ""}
            ${chips(e.tags)}
          </article>
        </li>`;
      })
      .join("");

    $("[data-education-wrap]").hidden = !D.education.length;
    $("[data-education]").innerHTML = D.education
      .map(
        (e) => `<article class="glass edu-card reveal">
          ${e.logo ? logoTile(e.logo, e.school) : `<span class="skill-icon">${icon("cap")}</span>`}
          <div>
            <h4>${esc(t(e.degree))}</h4>
            <p>${esc(e.school)}</p>
            ${t(e.note) ? `<p>${esc(t(e.note))}</p>` : ""}
            <div class="tl-date">${fmtDate(e.start)} — ${fmtDate(e.end)}</div>
          </div>
        </article>`
      )
      .join("");

    const prof = $("[data-gh-profile]");
    prof.href = ghUrl;
    prof.innerHTML = `${icon("github")}<span>@${esc(D.github.username)}</span>`;
    renderRepos();

    $("[data-contact-role]").textContent = t(D.contact.role);
    $("[data-contact-bio]").textContent = t(D.contact.intro);
    const pretty = (u) => u.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
    const row = (ic, label, value, href, extra = "") => {
      const inner = `<span class="cl-icon">${icon(ic)}</span><span class="cl-text"><small>${esc(label)}</small><span>${esc(value)}</span></span>`;
      if (!href) return `<li><div class="cl-row">${inner}</div></li>`;
      const target = href.startsWith("http") ? ' target="_blank" rel="noopener"' : "";
      return `<li><a class="cl-row" href="${esc(href)}"${target}>${inner}${extra || `<span class="cl-chev">${icon("chev")}</span>`}</a></li>`;
    };
    $("[data-contact-list]").innerHTML = [
      D.meta.email && row("mail", U.lEmail, D.meta.email, `mailto:${D.meta.email}`, `<button class="cl-copy" type="button" data-copy>${esc(U.copy)}</button>`),
      D.meta.phone && row("phone", U.lPhone, D.meta.phone, `tel:${D.meta.phone.replace(/\s/g, "")}`),
      row("pin", U.lLocation, t(D.meta.location)),
      ...D.socials.map((s) => row(s.icon, s.label, decodeURIComponent(pretty(s.url)), s.url))
    ]
      .filter(Boolean)
      .join("");

    $("[data-year]").textContent = new Date().getFullYear();
    $$("[data-name-plain]").forEach((el) => (el.textContent = D.meta.name));

    observe();
    bindGlass();
    setActiveLink();
  }

  const repoState = { status: "loading", items: [] };

  async function loadRepos() {
    const gh = D.github;
    const key = `gh-repos:${gh.username}`;
    let raw = null;
    try {
      const cached = JSON.parse(store.get(key) || "null");
      if (cached && Date.now() - cached.at < 30 * 60 * 1000) raw = cached.data;
    } catch (e) {}
    try {
      if (!raw) {
        const res = await fetch(`https://api.github.com/users/${encodeURIComponent(gh.username)}/repos?per_page=100&sort=updated`, {
          headers: { Accept: "application/vnd.github+json" }
        });
        if (!res.ok) throw new Error(res.status);
        raw = (await res.json()).map((r) => ({
          name: r.name, url: r.html_url, description: r.description, language: r.language,
          stars: r.stargazers_count, forks: r.forks_count, topics: r.topics || [],
          updated: r.pushed_at || r.updated_at, fork: r.fork
        }));
        store.set(key, JSON.stringify({ at: Date.now(), data: raw }));
      }
      const exclude = new Set(gh.exclude.map((x) => x.toLowerCase()));
      const pinned = gh.pinned.map((x) => x.toLowerCase());
      const rank = (r) => { const i = pinned.indexOf(r.name.toLowerCase()); return i < 0 ? Infinity : i; };
      let items = raw.filter((r) => (gh.includeForks || !r.fork) && !exclude.has(r.name.toLowerCase()));
      items.sort((a, b) => {
        if (rank(a) !== rank(b)) return rank(a) - rank(b);
        if (gh.sort === "stars" && b.stars !== a.stars) return b.stars - a.stars;
        return new Date(b.updated) - new Date(a.updated);
      });
      if (gh.limit > 0) items = items.slice(0, gh.limit);
      Object.assign(repoState, { status: items.length ? "ok" : "empty", items });
    } catch (e) {
      repoState.status = "error";
    }
    renderRepos();
    bindGlass();
  }

  function renderRepos() {
    const U = ui(), box = $("[data-repos]");
    if (repoState.status === "loading") {
      box.innerHTML = Array.from({ length: Math.min(D.github.limit || 6, 6) }, () =>
        `<div class="glass repo skeleton"><i style="width:55%"></i><i style="width:90%;margin-top:14px"></i><i style="width:75%"></i><i style="width:35%;margin-top:auto"></i></div>`
      ).join("");
      return;
    }
    if (repoState.status !== "ok") {
      box.innerHTML = `<div class="glass repos-state">${esc(repoState.status === "error" ? U.reposError : U.reposEmpty)}<br>
        <a class="btn btn-ghost" href="https://github.com/${esc(D.github.username)}" target="_blank" rel="noopener">${icon("github")}${esc(U.viewAll)}</a></div>`;
      return;
    }
    box.innerHTML = repoState.items
      .map((r) => `<a class="glass repo reveal in" href="${esc(r.url)}" target="_blank" rel="noopener">
        <div class="repo-top">
          <span class="repo-name">${icon("repo")}<span>${esc(r.name)}</span></span>
          <span class="repo-arrow">${icon("arrow")}</span>
        </div>
        <p class="repo-desc ${r.description ? "" : "muted"}">${esc(r.description || U.noDesc)}</p>
        ${chips(r.topics.slice(0, 4))}
        <div class="repo-meta">
          ${r.language ? `<span><i class="lang-dot"></i>${esc(r.language)}</span>` : ""}
          <span title="Stars">${icon("star")}${r.stars}</span>
          <span title="Forks">${icon("fork")}${r.forks}</span>
          <span class="updated" title="${esc(U.updated)}">${esc(timeAgo(r.updated))}</span>
        </div>
      </a>`)
      .join("");
  }

  let revealIO;
  function observe() {
    if (revealIO) revealIO.disconnect();
    revealIO = new IntersectionObserver(
      (entries) => entries.forEach((en) => {
        if (!en.isIntersecting) return;
        en.target.classList.add("in");
        revealIO.unobserve(en.target);
      }),
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    $$(".reveal:not(.in)").forEach((el, i) => {
      el.style.transitionDelay = `${(i % 3) * 80}ms`;
      revealIO.observe(el);
    });
  }

  function bindGlass() {
    $$(".glass").forEach((el) => {
      if (el.dataset.glass) return;
      el.dataset.glass = "1";
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        el.style.setProperty("--mx", `${e.clientX - r.left}px`);
        el.style.setProperty("--my", `${e.clientY - r.top}px`);
      });
    });
  }

  let navIO;
  function setActiveLink() {
    if (navIO) navIO.disconnect();
    navIO = new IntersectionObserver(
      (entries) => entries.forEach((en) => {
        if (!en.isIntersecting) return;
        $$("[data-link]").forEach((a) => a.classList.toggle("active", a.dataset.link === en.target.id));
      }),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    $$("section[id]").forEach((s) => navIO.observe(s));
  }

  $("[data-lang-toggle]").addEventListener("click", () => {
    lang = lang === "tr" ? "en" : "tr";
    store.set("lang", lang);
    const main = $("main");
    main.classList.remove("swap");
    void main.offsetWidth;
    main.classList.add("swap");
    render();
    $$(".reveal").forEach((el) => el.classList.add("in"));
  });

  const applyTheme = (theme) => {
    document.documentElement.setAttribute("data-theme", theme);
    $('meta[name="theme-color"]').setAttribute("content", theme === "light" ? "#f5f5f7" : "#000000");
  };
  $("[data-theme-toggle]").addEventListener("click", () => {
    const next = document.documentElement.getAttribute("data-theme") === "light" ? "dark" : "light";
    applyTheme(next);
    store.set("theme", next);
  });
  matchMedia("(prefers-color-scheme: light)").addEventListener("change", (e) => {
    if (!store.get("theme")) applyTheme(e.matches ? "light" : "dark");
  });

  const nav = $(".nav"), menuBtn = $("[data-menu]");
  const closeMenu = () => { nav.classList.remove("open"); menuBtn.setAttribute("aria-expanded", "false"); };
  menuBtn.addEventListener("click", () => menuBtn.setAttribute("aria-expanded", nav.classList.toggle("open")));
  $("[data-nav]").addEventListener("click", (e) => { if (e.target.closest("a")) closeMenu(); });
  document.addEventListener("click", (e) => { if (!nav.contains(e.target)) closeMenu(); });

  $("[data-contact-list]").addEventListener("click", async (e) => {
    const btn = e.target.closest("[data-copy]");
    if (!btn) return;
    e.preventDefault();
    try {
      await navigator.clipboard.writeText(D.meta.email);
      btn.textContent = ui().copied;
    } catch (err) {
      location.href = `mailto:${D.meta.email}`;
    }
    setTimeout(() => (btn.textContent = ui().copy), 1600);
  });

  render();
  loadRepos();
})();
