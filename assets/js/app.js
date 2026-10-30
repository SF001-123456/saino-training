/* HRMS 3.0 Help Centre app: hash routing, guide viewer, lightbox, presenter mode, search. Works from file:// with no network. */
(function () {
  "use strict";
  const HC = window.HC, SL = window.SLIDES || {};
  // Set config.showDemo to true in content.js to bring the Demo journey back.
  const SHOW_DEMO = !(HC.config && HC.config.showDemo === false);
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const icon = (n, cls = "") => `<svg class="icon ${cls}" aria-hidden="true"><use href="#i-${n}"></use></svg>`;
  const store = {
    get(k, d) { try { const v = localStorage.getItem("hc-" + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem("hc-" + k, JSON.stringify(v)); } catch (e) { /* storage unavailable */ } }
  };
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- icons ---------- */
  const ICONS = {
    home: '<path d="M3 10.5 12 3l9 7.5V21h-6v-6H9v6H3z"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>',
    presentation: '<rect x="3" y="4" width="18" height="12" rx="1.5"/><path d="M12 16v4M8 20h8"/>',
    graduation: '<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c3 2 9 2 12 0v-5"/>',
    "user-cog": '<circle cx="9" cy="8" r="4"/><path d="M3 20c0-3.3 2.7-6 6-6h1.5"/><circle cx="17.5" cy="16.5" r="2.5"/><path d="M17.5 12.5v1.5M17.5 19v1.5M21.5 16.5H20M15 16.5h-1.5"/>',
    wallet: '<rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 10h18"/><circle cx="16.5" cy="14.5" r="1"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2 20c0-3.6 3-6 7-6s7 2.4 7 6"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14c2.4.6 4 2.8 4 6"/>',
    "life-buoy": '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/><path d="M5.6 5.6l3.6 3.6M14.8 14.8l3.6 3.6M18.4 5.6l-3.6 3.6M9.2 14.8l-3.6 3.6"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/>',
    receipt: '<path d="M5 3h14v18l-3-2-2 2-2-2-2 2-2-2-3 2z"/><path d="M9 8h6M9 12h6"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
    building: '<rect x="4" y="3" width="16" height="18" rx="1"/><path d="M9 7h2M13 7h2M9 11h2M13 11h2M10 21v-4h4v4"/>',
    leaf: '<path d="M5 19c0-9 6-14 15-14 0 9-5 15-14 15"/><path d="M5 19c3-4 6-6 9-7"/>',
    shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/>',
    alert: '<path d="M12 3l10 18H2z"/><path d="M12 10v5M12 18h.01"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5h.01"/>',
    bulb: '<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-4 10.5c.7.7 1 1.5 1 2.5h6c0-1 .3-1.8 1-2.5A6 6 0 0 0 12 3z"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7"/>',
    "chev-l": '<path d="M15 6l-6 6 6 6"/>', "chev-r": '<path d="M9 6l6 6-6 6"/>', "chev-d": '<path d="M6 9l6 6 6-6"/>',
    x: '<path d="M6 6l12 12M18 6L6 18"/>',
    "zoom-in": '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5M11 8v6M8 11h6"/>',
    "zoom-out": '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5M8 11h6"/>',
    maximize: '<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>',
    monitor: '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/>',
    phone: '<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/>',
    "arrow-r": '<path d="M5 12h14M13 6l6 6-6 6"/>',
    play: '<path d="M7 4l13 8-13 8z"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    keyboard: '<rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M7 14h10"/>',
    grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
    list: '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
    sidebar: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16"/>',
    "chevrons-l": '<path d="M11 17l-5-5 5-5M18 17l-5-5 5-5"/>',
    "chevrons-r": '<path d="M13 17l5-5-5-5M6 17l5-5-5-5"/>'
  };
  document.body.insertAdjacentHTML("afterbegin", `<svg width="0" height="0" style="position:absolute" aria-hidden="true">${Object.entries(ICONS).map(([k, v]) => `<symbol id="i-${k}" viewBox="0 0 24 24">${v}</symbol>`).join("")}</svg>`);

  /* ---------- data helpers ---------- */
  const ROLE = id => HC.roles.find(r => r.id === id);
  const rc = id => `var(--role-${(ROLE(id) || { color: "help" }).color})`;
  const rbg = id => `var(--role-${(ROLE(id) || { color: "help" }).color}-bg)`;
  const IMG = k => `assets/img/${k}.png`;
  const SLIDE = (d, n) => `assets/slides/${d}/${String(n).padStart(2, "0")}.jpg`;
  const info = (d, n) => (SL[d] || [])[n - 1] || {};
  function parseRef(ref) {
    if (!ref) return [];
    const [d, r] = ref.split(":");
    return r.split(",").flatMap(p => { const [a, b] = p.split("-").map(Number); const o = []; for (let i = a; i <= (b || a); i++) o.push({ deck: d, n: i }); return o; });
  }
  function splitCallout(c) { const m = c.match(/^(\d+)\.\s*(.*)$/); return m ? [m[1], m[2]] : ["", c]; }
  function calloutsFor(slides) {
    const seen = new Set(), out = [];
    slides.forEach(s => (info(s.deck, s.n).steps || []).forEach(c => { if (!seen.has(c)) { seen.add(c); out.push(c); } }));
    return out;
  }
  function altFor(g, step, s) {
    const i = info(s.deck, s.n);
    const cs = (i.steps || []).map(c => splitCallout(c)[1]).slice(0, 4).join(", ");
    return `${i.title || g.title} screen. ${i.instr || step.t}${cs ? ". Highlighted: " + cs : ""}`.slice(0, 200);
  }
  Object.entries(HC.guides).forEach(([id, g]) => {
    g.id = id; g.flat = [];
    g.steps.forEach((st, si) => {
      st.slides = parseRef(st.s);
      st.callouts = calloutsFor(st.slides);
      st.first = g.flat.length;
      st.slides.forEach((s, k) => g.flat.push({ step: si, k, deck: s.deck, n: s.n, src: SLIDE(s.deck, s.n), alt: altFor(g, st, s) }));
    });
  });
  /* Guides covering both the web portal and the mobile app tag each step p: "web" | "mobile";
     untagged steps apply to both. viewFor() returns the guide as seen on one platform. */
  const PLAT = { web: "Web portal", mobile: "Mobile app" };
  const hasBoth = g => g.steps.some(s => s.p === "web") && g.steps.some(s => s.p === "mobile");
  function viewFor(g, mode) {
    if (!mode || !hasBoth(g)) return Object.assign(Object.create(g), { mode: null, dual: false });
    const steps = [], flat = [];
    g.steps.filter(s => !s.p || s.p === mode).forEach((st, si) => {
      steps.push(Object.assign({}, st, { first: flat.length }));
      st.slides.forEach((s, k) => flat.push(Object.assign({}, g.flat[st.first + k], { step: si, k })));
    });
    return Object.assign(Object.create(g), { steps, flat, mode, dual: true, menuPath: mode === "mobile" && g.menuPathMobile ? g.menuPathMobile : g.menuPath });
  }
  const guideOrder = HC.roles.flatMap(r => r.groups.flatMap(gr => gr.ids));
  const roleGuides = rid => ROLE(rid).groups.flatMap(gr => gr.ids);
  const MODULE_ICON = { Leave: "calendar", Claim: "receipt", Payroll: "wallet", Attendance: "clock", Performance: "target", Organisation: "building", ESG: "leaf" };

  /* ---------- shell ---------- */
  const app = $("#app"), live = $("#live");
  let current = { journey: "none" };
  function toast(msg) { const t = document.createElement("div"); t.className = "toast"; t.setAttribute("role", "status"); t.textContent = msg; document.body.appendChild(t); setTimeout(() => t.remove(), 2200); }
  function setJourney(j) {
    current.journey = j;
    document.body.dataset.journey = j;
    document.documentElement.style.setProperty("--journey", j === "demo" ? "var(--brand-navy)" : "var(--brand-blue)");
    $$(".journey-switch a").forEach(a => a.setAttribute("aria-current", String(a.dataset.j === j)));
    $("#presentBtn").hidden = j !== "demo" || !SHOW_DEMO;
  }
  function page(html, opts = {}) {
    setJourney(opts.journey || "none");
    const nav = opts.nav ? `<nav class="side-nav" id="sideNav" aria-label="Primary">${opts.nav}</nav>` : "";
    app.innerHTML = opts.full ? html : `<div class="layout ${opts.nav ? "" : "no-nav"}">${nav}<main id="main" class="content ${opts.wide ? "wide" : ""} ${opts.cls || ""}" tabindex="-1">${html}</main></div>`;
    $("#menuToggle").hidden = !opts.nav;
    $("#navCollapse").hidden = !opts.nav;
    document.body.dataset.hasnav = opts.nav ? "1" : "0";
    closeSearch();
    document.title = (opts.title ? opts.title + " · " : "") + "HRMS 3.0 Help Centre";
    live.textContent = opts.title || "Home";
    bindNav();
    if (!opts.keepScroll) window.scrollTo(0, 0);
    const h1 = $("h1", app); if (h1 && !opts.noFocus) { h1.setAttribute("tabindex", "-1"); h1.classList.add("page-title-focus"); h1.focus({ preventScroll: true }); }
  }
  function bindNav() {
    $$("[data-navclose]", app).forEach(b => b.addEventListener("click", () => {
      if (innerWidth >= 1200) { setCollapsed(true); $("#navReopen").focus(); } else { closeDrawer(); $("#menuToggle").focus(); }
    }));
    $$(".grp-btn", app).forEach(b => b.addEventListener("click", () => {
      const open = b.getAttribute("aria-expanded") !== "true";
      b.setAttribute("aria-expanded", String(open)); $("#" + b.getAttribute("aria-controls")).hidden = !open;
      const st = store.get("navopen", {}); st[b.dataset.role] = open; store.set("navopen", st);
    }));
  }
  /* Collapsible side menu on desktop, remembered per viewer. */
  function setCollapsed(on) {
    document.body.classList.toggle("nav-collapsed", on);
    const b = $("#navCollapse"); b.setAttribute("aria-pressed", String(on)); b.setAttribute("aria-label", on ? "Show side menu" : "Hide side menu"); b.title = (on ? "Show" : "Hide") + " side menu ( [ )";
    store.set("collapsed", on);
  }
  setCollapsed(store.get("collapsed", false));
  $("#navCollapse").addEventListener("click", () => setCollapsed(!document.body.classList.contains("nav-collapsed")));
  $("#navReopen").addEventListener("click", () => { setCollapsed(false); const c = $("[data-navclose]"); if (c) c.focus(); });

  /* Phone search: an icon that opens a full-width search bar. */
  function openSearch() { document.body.classList.add("search-open"); $("#searchToggle").setAttribute("aria-expanded", "true"); const i = $("#siteSearch"); i.focus(); }
  function focusSearch() {
    const hero = $("#heroSearch");
    if (hero) { hero.focus(); hero.select(); return; }
    if (getComputedStyle($("#searchToggle")).display !== "none") { openSearch(); return; }
    const i = $("#siteSearch"); i.focus(); i.select();
  }
  function closeSearch() { if (!document.body.classList.contains("search-open")) return; document.body.classList.remove("search-open"); $("#searchToggle").setAttribute("aria-expanded", "false"); $("#sitePop").hidden = true; }
  $("#searchToggle").addEventListener("click", openSearch);
  $("#searchClose").addEventListener("click", () => { $("#siteSearch").value = ""; closeSearch(); $("#searchToggle").focus(); });

  function closeDrawer() { const n = $("#sideNav"); if (n) n.classList.remove("open"); const s = $(".nav-scrim"); if (s) s.remove(); $("#menuToggle").setAttribute("aria-expanded", "false"); }
  $("#menuToggle").addEventListener("click", () => {
    const n = $("#sideNav"); if (!n) return;
    if (n.classList.contains("open")) { closeDrawer(); return; }
    n.classList.add("open"); $("#menuToggle").setAttribute("aria-expanded", "true");
    const s = document.createElement("div"); s.className = "nav-scrim"; s.addEventListener("click", closeDrawer); document.body.appendChild(s);
    const f = $("a, button", n); if (f) f.focus();
  });

  if (!SHOW_DEMO) { $(".journey-switch").hidden = true; }

  /* ---------- navs ---------- */
  const navClose = `<button class="nav-close" data-navclose aria-label="Close menu" title="Close menu">${icon("chevrons-l", "sm")}</button>`;
  function demoNav(active) {
    const ch = HC.demo.chapters;
    return `<div class="nav-h">${icon("presentation")}<span>Discover HRMS 3.0</span>${navClose}</div>
      <a href="#demo" ${active === "overview" ? 'aria-current="page"' : ""}>${icon("list", "sm")} Overview</a>
      ${ch.map((c, i) => `<a href="#demo-${c.id}" ${active === c.id ? 'aria-current="page"' : ""}><span class="num">${i + 1}</span>${esc(c.title)}</a>`).join("")}
      <button class="btn btn-navy present" data-present>${icon("play", "sm")} Present <kbd style="background:transparent;color:#fff;border-color:rgba(255,255,255,.5)">P</kbd></button>`;
  }
  function trainNav(activeRole, activeGuide, activeOther) {
    const open = store.get("navopen", {});
    const roles = HC.roles.map(r => {
      const isOpen = r.id === activeRole || open[r.id] === true;
      const ids = roleGuides(r.id);
      return `<button class="grp-btn" aria-expanded="${isOpen}" aria-controls="ng-${r.id}" data-role="${r.id}"><span class="rolebar" style="background:${rc(r.id)}"></span>${esc(r.name)}<span class="count">${ids.length}</span>${icon("chev-d", "sm chev")}</button>
        <div class="sub" id="ng-${r.id}" ${isOpen ? "" : "hidden"}>
          <a href="#role-${r.id}" ${activeOther === "role-" + r.id ? 'aria-current="page"' : ""}>Overview</a>
          ${r.groups.map(gr => `${r.groups.length > 1 ? `<div class="subhead">${esc(gr.title)}</div>` : ""}${gr.ids.map((id, i) => `<a href="#guide-${id}" ${activeGuide === id ? 'aria-current="page"' : ""}>${r.ordered ? `<span class="num">${roleGuides(r.id).indexOf(id) + 1}</span>` : ""}${esc(HC.guides[id].title)}</a>`).join("")}`).join("")}
        </div>`;
    }).join("");
    return `<div class="nav-h">${icon("graduation")}<span>HRMS 3.0 Guidance</span>${navClose}</div>
      <a href="#guidance" ${activeOther === "train" ? 'aria-current="page"' : ""}>${icon("home", "sm")} Guidance hub</a>
      <div class="label">Roles</div>${roles}
      <div class="label">Support</div>
      <a href="#help" ${activeOther === "help" ? 'aria-current="page"' : ""}>${icon("life-buoy", "sm")} Troubleshooting and FAQ</a>
      <a href="#train-day">${icon("calendar", "sm")} Training day plan</a>`;
  }

  /* ---------- shared components ---------- */
  function guideRow(id, opts = {}) {
    const g = HC.guides[id], r = ROLE(g.role);
    return `<a class="guide-row" href="#guide-${id}" style="--rc:${rc(g.role)}"><b>${esc(g.title)}</b><small>${esc(g.summary)}</small>
      <span class="tags"><span>${esc(opts.noRole ? g.module : r.short)} · ${esc(g.type)}</span><span>${hasBoth(g) ? `${viewFor(g, "web").steps.length} web · ${viewFor(g, "mobile").steps.length} app steps` : `${g.steps.length} steps`} · ${g.flat.length} screen${g.flat.length === 1 ? "" : "s"} · ${g.platform.map(p => p === "web" ? "Web" : "Mobile").join(" + ")}</span></span></a>`;
  }
  function shot(key, alt, phone) {
    return `<button class="shot ${phone ? "phone" : ""}" data-zoom="${esc(IMG(key))}" data-alt="${esc(alt)}" aria-label="Enlarge screenshot: ${esc(alt)}"><span class="chrome"><i></i><i></i><i></i></span><img src="${IMG(key)}" alt="${esc(alt)}" loading="lazy"></button>`;
  }
  function bindZoom(root = app) {
    $$("[data-zoom]", root).forEach(b => b.addEventListener("click", () => Lightbox.open([{ src: b.dataset.zoom, alt: b.dataset.alt, title: b.dataset.alt, callouts: [] }], 0, "Screenshot", b)));
  }
  function bindPresent(root = app) { $$("[data-present]", root).forEach(b => b.addEventListener("click", () => { location.hash = "present-" + (b.dataset.present || 1); })); }

  /* ---------- HOME ---------- */
  function renderHome() {
    const nGuides = Object.keys(HC.guides).length;
    page(`<main id="main" tabindex="-1">
      <section class="hero"><div class="hero-in">
        <h1>HRMS 3.0 Help Centre</h1>
        <p>Everything you need to see HRMS 3.0, learn it and run it, with step-by-step guides built from the official user guides.</p>
        <div class="hero-search">${icon("search", "lg")}<input id="heroSearch" type="search" placeholder='Search guides, e.g. "process payroll" or "apply leave"' aria-label="Search the Help Centre" autocomplete="off" role="combobox" aria-expanded="false" aria-controls="heroPop"><div class="search-pop" id="heroPop" role="listbox" hidden></div></div>
      </div></section>
      <div class="home-body">
        <div class="journeys${SHOW_DEMO ? "" : " single"}">
          ${SHOW_DEMO ? `          <article class="jcard" style="--jc:var(--brand-navy)">
            <a class="cover" href="#demo" aria-label="Open the Demo journey"></a>
            <div class="ico">${icon("presentation", "lg")}</div>
            <h2>Discover HRMS 3.0</h2>
            <p>For first meetings with prospects. Why HRMS, the connected HR cycle, compliance and next steps.</p>
            <ul>${HC.demo.chapters.slice(0, 5).map(c => `<li>${icon("check", "sm")}${esc(c.title)}</li>`).join("")}</ul>
            <div class="stats">${HC.demo.chapters.length} chapters · presenter mode for projectors</div>
            <div class="actions"><a class="btn btn-navy" href="#demo">Open demo ${icon("arrow-r", "sm")}</a><button class="btn btn-secondary" data-present="1">${icon("play", "sm")} Present</button></div>
          </article>` : ""}
          <article class="jcard" style="--jc:var(--brand-blue)">
            <a class="cover" href="#guidance" aria-label="Open Guidance"></a>
            <div class="ico">${icon("graduation", "lg")}</div>
            <h2>Guidance</h2>
            <p>For signed clients. Step-by-step guides for every HR task, with the annotated screens from the user guides.</p>
            <ul><li>${icon("check", "sm")}One-time setup, in order</li><li>${icon("check", "sm")}Onboarding and monthly payroll</li><li>${icon("check", "sm")}Employee, supervisor and management tasks</li><li>${icon("check", "sm")}Troubleshooting and FAQ</li></ul>
            <div class="stats">${nGuides} guides · ${HC.roles.length} roles · ${Object.values(HC.guides).reduce((n, g) => n + g.flat.length, 0)} annotated screens</div>
            <div class="actions"><a class="btn btn-primary" href="#guidance">Open guidance ${icon("arrow-r", "sm")}</a></div>
          </article>
        </div>
        <div class="section"><h2>Go straight to your role</h2>
          <div class="role-chips">${HC.roles.map(r => `<a class="role-chip" href="#role-${r.id}"><i style="background:${rc(r.id)}"></i>${esc(r.name)}</a>`).join("")}<a class="role-chip" href="#help"><i style="background:var(--role-help)"></i>Troubleshooting</a></div>
        </div>
        <div class="section"><h2>Popular guides</h2><div class="popular">${HC.popular.map(id => guideRow(id)).join("")}</div></div>
      </div></main>`, { full: true, title: "", noFocus: true });
    bindPresent(); attachSearch($("#heroSearch"), $("#heroPop"));
  }

  /* ---------- DEMO ---------- */
  function chapterPager(id) {
    const ch = HC.demo.chapters, i = ch.findIndex(c => c.id === id);
    const prev = i > 0 ? ch[i - 1] : null, next = ch[i + 1];
    return `<nav class="pager" aria-label="Chapters">${prev ? `<a href="#demo-${prev.id}"><small>Previous</small><b>${esc(prev.title)}</b></a>` : `<a href="#demo"><small>Back to</small><b>Overview</b></a>`}${next ? `<a class="next" href="#demo-${next.id}"><small>Next</small><b>${esc(next.title)}</b></a>` : `<a class="next" href="#guidance"><small>After signing</small><b>Continue to Guidance</b></a>`}</nav>`;
  }
  function demoHead(c, i) { return `<div class="kicker">Chapter ${i + 1} of ${HC.demo.chapters.length}</div><h1 class="page-title">${esc(c.title)}</h1><p class="lead">${esc(c.lead)}</p>`; }
  function cycleHtml(sel) {
    return `<div class="cycle-row" role="tablist" aria-label="HR cycle steps">${HC.demo.cycle.map((c, i) => `<button role="tab" aria-selected="${c.id === sel}" data-cycle="${c.id}"><em>${i + 1}</em><b>${esc(c.name)}</b><span>${esc(c.role)}</span></button>${i < HC.demo.cycle.length - 1 ? `<i aria-hidden="true">${icon("chev-r", "sm")}</i>` : ""}`).join("")}</div>`;
  }
  function renderDemoOverview() {
    page(`<div class="demo measure-wide">
      <div class="kicker">Demo journey</div><h1 class="page-title">Discover HRMS 3.0</h1>
      <p class="lead">A guided story for first meetings: open with the prospect's pain points, show the one connected HR cycle, prove it on screen and agree next steps.</p>
      <div style="display:flex;gap:10px;flex-wrap:wrap;margin:20px 0 8px"><button class="btn btn-navy" data-present="1">${icon("play", "sm")} Start presenting</button><a class="btn btn-secondary" href="#demo-why">Read chapter 1 ${icon("arrow-r", "sm")}</a></div>
      <div class="demo-tiles">${HC.demo.stats.map(s => `<div class="stat"><b>${esc(s[0])}</b><span>${esc(s[1])}</span></div>`).join("")}</div>
      <div class="section"><h2>Run of show</h2><div class="run-of-show">${HC.demo.chapters.map((c, i) => `<a href="#demo-${c.id}"><em>Chapter ${i + 1}</em><b>${esc(c.title)}</b><span>${esc(c.lead)}</span></a>`).join("")}</div></div>
      <div class="section"><div class="callout note">${icon("keyboard")}<div><b>Presenting on a projector</b>Press P on any demo page. Arrow keys, Space or a clicker move between slides; G opens the slide list, F goes full screen, B blanks the screen, Esc exits.</div></div></div>
    </div>`, { journey: "demo", nav: demoNav("overview"), title: "Discover HRMS 3.0", cls: "demo" });
    bindPresent();
  }
  function renderDemoChapter(id, tab) {
    const ch = HC.demo.chapters, i = ch.findIndex(c => c.id === id), c = ch[i], D = HC.demo;
    let body = "";
    if (id === "why") {
      body = `<div class="demo-tiles">${D.stats.map(s => `<div class="stat"><b>${esc(s[0])}</b><span>${esc(s[1])}</span></div>`).join("")}</div>
        <div class="pain-list">${D.pains.map(p => `<div class="pain card"><div class="was"><small>Today</small>${esc(p.was)}</div><div class="arrow">${icon("arrow-r", "lg")}</div><div class="now"><b>${esc(p.now)}</b><span>${esc(p.detail)}</span></div>${shot(p.img, p.now + ": " + p.detail, false)}</div>`).join("")}</div>`;
    } else if (id === "cycle") {
      const sel = D.cycle[0];
      body = `${cycleHtml(sel.id)}<div class="cycle-caption card" id="cycleCap" role="tabpanel"></div>`;
    } else if (id === "roles") {
      const sel = D.roles.find(r => r.id === tab) || D.roles[0];
      body = `<div class="tabs" role="tablist" aria-label="Roles">${D.roles.map(r => `<button role="tab" id="tab-${r.id}" aria-selected="${r.id === sel.id}" aria-controls="rolePanel" tabindex="${r.id === sel.id ? 0 : -1}" data-rtab="${r.id}">${esc(r.name)}</button>`).join("")}</div>
        <div id="rolePanel" role="tabpanel" aria-labelledby="tab-${sel.id}" class="role-panel">
          <ul class="gains">${sel.gains.map(g => `<li>${icon("check", "lg")}<div><b>${esc(g[0])}</b><span>${esc(g[1])}</span></div></li>`).join("")}</ul>
          ${shot(sel.img, sel.name + " screen in HRMS 3.0", sel.phone)}
        </div>`;
    } else if (id === "compliance") {
      body = `<div class="compliance">${D.compliance.map(x => `<div class="comp card"><span class="tick">${icon("shield")}</span><div><b>${esc(x[0])}</b><span>${esc(x[1])}</span></div></div>`).join("")}</div>`;
    } else if (id === "moments") {
      body = `<div class="moments">${D.moments.map((m, k) => `<div class="moment card"><span class="n">${k + 1}</span><div><h3>${esc(m.title)}</h3><p>${esc(m.text)}</p></div>${shot(m.img, m.title, m.phone)}</div>`).join("")}</div>`;
    } else if (id === "faq") {
      body = accordion(D.faq.map(q => ({ q: q[0], a: `<p>${esc(q[1])}</p>` })));
    } else if (id === "next") {
      body = `<div class="timeline">${D.next.map(n => `<div><b>${esc(n[0])}</b><span>${esc(n[1])}</span></div>`).join("")}</div>
        <div class="section card" style="padding:24px;display:grid;gap:8px"><h2 style="font-size:20px">Keep this Help Centre</h2><p style="color:var(--text-2);margin:0">The same site carries Guidance: step-by-step guides for every role, ready for the training day and for self-service after go-live.</p><div><a class="btn btn-primary" href="#guidance">Open Guidance ${icon("arrow-r", "sm")}</a></div></div>`;
    }
    page(`<div class="demo">${demoHead(c, i)}<div class="section" style="margin-top:28px">${body}</div>${chapterPager(id)}</div>`,
      { journey: "demo", nav: demoNav(id), title: c.title, cls: "demo" });
    bindZoom(); bindPresent(); bindAccordion();
    if (id === "cycle") {
      const show = cid => {
        const x = D.cycle.find(z => z.id === cid);
        $$("[data-cycle]").forEach(b => b.setAttribute("aria-selected", String(b.dataset.cycle === cid)));
        $("#cycleCap").innerHTML = `<div><div class="kicker">${esc(x.role)}</div><h3>${esc(x.name)}</h3><p style="margin:0;color:var(--text-2)">${esc(x.text)}</p></div>${shot(x.img, x.name + ": " + x.text, /mobile_b|ea_form/.test(x.img))}`;
        bindZoom($("#cycleCap"));
      };
      $$("[data-cycle]").forEach(b => b.addEventListener("click", () => show(b.dataset.cycle)));
      show(D.cycle[0].id);
    }
    if (id === "roles") {
      const tabs = $$("[data-rtab]");
      tabs.forEach((b, k) => {
        b.addEventListener("click", () => { history.replaceState(null, "", "#demo-roles-" + b.dataset.rtab); renderDemoChapter("roles", b.dataset.rtab); $("[data-rtab][aria-selected=true]").focus(); });
        b.addEventListener("keydown", e => { if (e.key === "ArrowRight" || e.key === "ArrowLeft") { e.preventDefault(); const n = tabs[(k + (e.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length]; n.click(); } });
      });
    }
  }
  function accordion(items) {
    return `<div class="accordion">${items.map((it, k) => `<div class="acc-item"><button aria-expanded="false" aria-controls="acc-${k}" id="accb-${k}">${it.head || esc(it.q)}${icon("chev-d")}</button><div class="acc-body" id="acc-${k}" role="region" aria-labelledby="accb-${k}" hidden>${it.a}</div></div>`).join("")}</div>`;
  }
  function bindAccordion() {
    $$(".acc-item > button", app).forEach(b => b.addEventListener("click", () => {
      const o = b.getAttribute("aria-expanded") !== "true"; b.setAttribute("aria-expanded", String(o)); $("#" + b.getAttribute("aria-controls")).hidden = !o;
    }));
  }

  /* ---------- TRAINING HUB ---------- */
  const filt = { role: "all", module: "all", type: "all", text: "" };
  function renderTrain(scrollTo) {
    const T = HC.training, mods = [...new Set(Object.values(HC.guides).map(g => g.module))], types = ["Setup", "Daily", "Monthly", "Report", "Fix"];
    const recent = store.get("recent", []).filter(id => HC.guides[id]).slice(0, 5);
    const chips = (key, vals, labels) => `<div class="chip-row" role="group" aria-label="${key}"><span>${key[0].toUpperCase() + key.slice(1)}</span>${["all", ...vals].map((v, k) => `<button class="chip" data-f="${key}" data-v="${esc(v)}" aria-pressed="${filt[key] === v}">${esc(v === "all" ? "All" : labels ? labels[k - 1] : v)}</button>`).join("")}</div>`;
    page(`
      <div class="crumbs"><a href="#home">Home</a><span>›</span><span>Guidance</span></div>
      <div class="kicker">Guidance</div>
      <h1 class="page-title">Guidance hub</h1>
      <p class="lead">Step-by-step guides for every HR task, each paired with the annotated screens from the HRMS user guides.</p>
      <div class="section"><h2>Learning path to go-live</h2>
        <div class="path-stepper">${T.path.map((p, k) => `<a class="path-step" href="#${p[2]}" style="color:inherit"><span class="dot">${k + 1}</span><b>${esc(p[0])}</b><span>${esc(p[1])}</span></a>`).join("")}</div></div>
      <div class="section"><h2>Choose your role</h2>
        <div class="role-cards">${HC.roles.map(r => `<a class="role-card" href="#role-${r.id}" style="--rc:${rc(r.id)}"><span class="ico">${icon(r.icon, "lg")}</span><b>${esc(r.name)}</b><span>${esc(r.who)}</span><small>${roleGuides(r.id).length} guides</small></a>`).join("")}</div></div>
      ${recent.length ? `<div class="section"><h2>Recently viewed</h2><div class="guide-list">${recent.map(id => guideRow(id)).join("")}</div></div>` : ""}
      <div class="section" id="library"><div class="section-head"><h2>All use cases</h2></div>
        <div class="filters">
          <div class="filter-input">${icon("search", "sm")}<input id="libFilter" type="search" placeholder="Filter by task, e.g. payslip" aria-label="Filter guides" value="${esc(filt.text)}"></div>
          ${chips("role", HC.roles.map(r => r.id), HC.roles.map(r => r.short))}
          ${chips("module", mods)}
          ${chips("type", types)}
        </div>
        <div class="result-count"><span id="libCount" aria-live="polite"></span><button id="libClear">Clear filters</button></div>
        <div class="guide-list" id="libList"></div></div>
      <div class="section" id="train-day"><h2>Training day plan</h2>
        <p style="color:var(--text-2)">A full day, about 6.5 hours of content plus breaks. Slides: <a class="inline" href="../HRMS%203.0%20End-to-End%20User%20Training.pptx">HRMS 3.0 End-to-End User Training.pptx</a>; speaker notes say what to demo live.</p>
        <div class="table-wrap"><table><thead><tr><th>Time</th><th>Session</th><th>Audience</th></tr></thead><tbody>${T.day.map(d => `<tr><td>${d[0]}</td><td style="font-weight:${d[2] ? 400 : 400};color:${d[2] ? "inherit" : "var(--text-3)"}">${esc(d[1])}</td><td>${esc(d[2])}</td></tr>`).join("")}</tbody></table></div></div>
    `, { journey: "train", nav: trainNav(null, null, "train"), title: "Guidance hub", wide: true, noFocus: !!scrollTo });
    const draw = () => {
      const t = filt.text.toLowerCase();
      const ids = guideOrder.filter(id => { const g = HC.guides[id]; return (filt.role === "all" || g.role === filt.role) && (filt.module === "all" || g.module === filt.module) && (filt.type === "all" || g.type === filt.type) && (!t || (g.title + " " + g.summary + " " + g.keywords.join(" ")).toLowerCase().includes(t)); });
      $("#libList").innerHTML = ids.length ? ids.map(id => guideRow(id)).join("") : `<p style="color:var(--text-2)">No guides match. <button class="chip" id="libClear2">Clear filters</button></p>`;
      $("#libCount").textContent = `Showing ${ids.length} of ${guideOrder.length} guides`;
      const c2 = $("#libClear2"); if (c2) c2.addEventListener("click", clear);
    };
    const clear = () => { Object.assign(filt, { role: "all", module: "all", type: "all", text: "" }); $("#libFilter").value = ""; $$("[data-f]").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.v === "all"))); draw(); };
    $$("[data-f]").forEach(b => b.addEventListener("click", () => { filt[b.dataset.f] = b.dataset.v; $$(`[data-f="${b.dataset.f}"]`).forEach(x => x.setAttribute("aria-pressed", String(x === b))); draw(); }));
    $("#libFilter").addEventListener("input", e => { filt.text = e.target.value; draw(); });
    $("#libClear").addEventListener("click", clear);
    draw();
    if (scrollTo) { const el = $("#" + scrollTo); if (el) el.scrollIntoView(); }
  }

  /* ---------- ROLE ---------- */
  function renderRole(id) {
    const r = ROLE(id);
    page(`
      <div class="crumbs"><a href="#home">Home</a><span>›</span><a href="#guidance">Guidance</a><span>›</span><span>${esc(r.name)}</span></div>
      <div class="role-band" style="--rc:${rc(id)};--rbg:${rbg(id)}"><span class="ico">${icon(r.icon, "xl")}</span><div><span class="pill" style="color:${rc(id)};background:#fff">${esc(r.name)}</span><h1 class="page-title" style="margin-top:8px">${esc(r.name)}</h1><p>${esc(r.who)} ${esc(r.first)}</p></div></div>
      ${r.groups.map(gr => `${r.groups.length > 1 ? `<h2 class="group-title">${esc(gr.title)}</h2>` : ""}<div class="guide-list ${r.ordered ? "ordered" : ""}">${gr.ids.map(gid => guideRow(gid, { noRole: true })).join("")}</div>`).join("")}
    `, { journey: "train", nav: trainNav(id, null, "role-" + id), title: r.name, wide: true });
  }

  /* ---------- GUIDE ---------- */
  let G = null;
  function renderGuide(id, stepNo, plat, keepScroll) {
    const base = HC.guides[id];
    let mode = null;
    if (hasBoth(base)) { mode = plat || store.get("platform", "web"); store.set("platform", mode); }
    const g = viewFor(base, mode), r = ROLE(g.role);
    const platSwitch = g.dual ? `<div class="platform-switch" role="radiogroup" aria-label="Show steps for">        ${["web", "mobile"].map(p => `<button role="radio" aria-checked="${mode === p}" tabindex="${mode === p ? 0 : -1}" data-plat="${p}">${icon(p === "web" ? "monitor" : "phone", "sm")}<span>${PLAT[p]}</span><small>${viewFor(base, p).steps.length} steps</small></button>`).join("")}
      </div>` : "";
    const rec = store.get("recent", []).filter(x => x !== id); rec.unshift(id); store.set("recent", rec.slice(0, 8));
    const order = roleGuides(g.role), oi = order.indexOf(id), prev = order[oi - 1], next = order[oi + 1];
    const group = r.groups.find(gr => gr.ids.includes(id));
    const hasSlides = g.flat.length > 0;
    const stepHtml = g.steps.map((st, si) => `
      <li class="step" id="step-${si + 1}" data-step="${si}" style="--rc:${rc(g.role)}" tabindex="0" aria-label="Step ${si + 1}: ${esc(st.t)}">
        <span class="badge" aria-hidden="true">${si + 1}</span>
        <div>
          <h3>${esc(st.t)}</h3>
          ${st.d ? `<p>${esc(st.d)}</p>` : ""}
          ${st.callouts.length ? `<ul class="callouts" aria-label="Highlighted on the screen">${st.callouts.map(c => { const [n, t] = splitCallout(c); return `<li>${n ? `<span class="tagn">${n}</span>` : "<span></span>"}<span>${esc(t)}</span></li>`; }).join("")}</ul>` : ""}
          ${st.w ? `<div class="callout ${st.w.k}">${icon(st.w.k === "warn" ? "alert" : st.w.k === "tip" ? "bulb" : "info")}<div><b>${esc(st.w.t)}</b>${esc(st.w.x)}</div></div>` : ""}
          ${st.slides.length ? `<div class="inline-shots">${st.slides.map((s, k) => `<button data-flat="${st.first + k}" aria-label="Enlarge screen ${k + 1} of step ${si + 1}"><img src="${SLIDE(s.deck, s.n)}" alt="${esc(g.flat[st.first + k].alt)}" loading="lazy" decoding="async" width="1280" height="720"></button>`).join("")}</div><span class="slides-n">${st.slides.length} screen${st.slides.length > 1 ? "s" : ""}</span>` : ""}
        </div>
      </li>`).join("");
    const viewer = hasSlides ? `
      <aside class="viewer" role="region" aria-label="Screenshot viewer">
        <button class="viewer-frame" id="vFrame" aria-label="Open screenshot full screen"><img id="vImg" alt=""><span class="zoom-hint">${icon("maximize", "sm")} Click or press F to enlarge</span></button>
        <div class="viewer-cap"><b id="vTitle"></b><span id="vPos" aria-live="polite"></span></div>
        <div class="viewer-controls"><button class="btn btn-secondary" id="vPrev" aria-label="Previous screen">${icon("chev-l", "sm")} Prev</button><div class="dots" id="vDots"></div><button class="btn btn-secondary" id="vNext" aria-label="Next screen">Next ${icon("chev-r", "sm")}</button></div>
        <div class="thumbs" id="vThumbs"></div>
      </aside>` : "";
    page(`
      <div class="crumbs"><a href="#home">Home</a><span>›</span><a href="#guidance">Guidance</a><span>›</span><a href="#role-${r.id}">${esc(r.name)}</a>${group && r.groups.length > 1 ? `<span>›</span><span>${esc(group.title)}</span>` : ""}</div>
      <div class="meta"><span class="pill" style="color:${rc(g.role)};background:${rbg(g.role)}">${esc(r.short)}</span><span>${icon(MODULE_ICON[g.module] || "book", "sm")}${esc(g.module)}</span><span>${esc(g.type)}</span><span>${g.steps.length} steps</span>${hasSlides ? `<span>${g.flat.length} screens</span>` : ""}<span>${g.platform.map(p => icon(p === "web" ? "monitor" : "phone", "sm") + (p === "web" ? "Web" : "Mobile")).join(" ")}</span></div>
      <h1 class="page-title">${esc(g.title)}</h1>
      <p class="lead">${esc(g.summary)}</p>
      ${g.intro ? `<p style="max-width:76ch;color:var(--text-2)">${esc(g.intro)}</p>` : ""}
      ${platSwitch}
      <div class="menu-path"><div class="chips"><span class="lbl">${g.mode === "mobile" ? "App path" : "Menu path"}</span>${g.menuPath.map((m, k) => `${k ? "<i>›</i>" : ""}<span class="c">${esc(m)}</span>`).join("")}</div></div>
      ${(g.before || g.prerequisites.length) ? `<div class="pre-grid">
        ${g.before ? `<div class="pre card"><h3>${icon("check", "sm")} Before you start</h3><ul>${g.before.map((b, k) => `<li><label><input type="checkbox" id="pre-${id}-${k}"> ${esc(b)}</label></li>`).join("")}</ul></div>` : ""}
        ${g.prerequisites.length ? `<div class="pre card"><h3>${icon("arrow-r", "sm")} You need first</h3><ul>${g.prerequisites.map(p => `<li><a href="#guide-${p}">${esc(HC.guides[p].title)}</a></li>`).join("")}</ul></div>` : ""}
      </div>` : ""}
      <div class="guide-grid ${hasSlides ? "" : "text-only"}">
        <div><div class="steps-h">Steps</div><ol class="steps" id="steps">${stepHtml}</ol></div>
        ${viewer}
      </div>
      <div class="guide-extra">
        ${g.formula ? `<h2>How scores are calculated</h2><div class="formula">${esc(g.formula).replace(/\n/g, "<br>")}</div>` : ""}
        ${g.table ? `<h2>${esc(g.table.title)}</h2><div class="table-wrap"><table><thead><tr>${g.table.head.map(h => `<th>${esc(h)}</th>`).join("")}</tr></thead><tbody>${g.table.rows.map(rw => `<tr>${rw.map(c => `<td>${esc(c)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>` : ""}
        ${g.related.length ? `<h2>Related guides</h2><div class="related">${g.related.map(x => guideRow(x)).join("")}</div>` : ""}
      </div>
      <div class="step-bar" id="stepBar" role="navigation" aria-label="Step navigation">
        <button class="btn btn-secondary" id="sbPrev" aria-label="Previous step">${icon("chev-l", "sm")}<span>Prev</span></button>
        <button class="sb-pos" id="sbPos" aria-label="Back to the top of the guide"></button>
        <button class="btn btn-primary" id="sbNext" aria-label="Next step"><span>Next</span>${icon("chev-r", "sm")}</button>
      </div>
      <nav class="pager" aria-label="Guides">${prev ? `<a href="#guide-${prev}"><small>Previous</small><b>${esc(HC.guides[prev].title)}</b></a>` : `<a href="#role-${r.id}"><small>Back to</small><b>${esc(r.name)}</b></a>`}${next ? `<a class="next" href="#guide-${next}"><small>Next</small><b>${esc(HC.guides[next].title)}</b></a>` : `<a class="next" href="#help"><small>Need help?</small><b>Troubleshooting and FAQ</b></a>`}</nav>
    `, { journey: "train", nav: trainNav(g.role, id), title: g.title + (g.dual ? ` (${PLAT[g.mode]})` : ""), wide: true, noFocus: !!stepNo || keepScroll, keepScroll });

    // Platform switch: re-render in place for the chosen platform, keeping the page position.
    const radios = $$("[data-plat]");
    radios.forEach((b, k) => {
      b.addEventListener("click", () => {
        if (b.dataset.plat === mode) return;
        history.replaceState(null, "", `#guide-${id}-${b.dataset.plat}`);
        renderGuide(id, null, b.dataset.plat, true);
        const sel = $(`[data-plat="${b.dataset.plat}"]`); if (sel) sel.focus({ preventScroll: true });
        live.textContent = `Showing ${PLAT[b.dataset.plat]} steps`;
      });
      b.addEventListener("keydown", e => {
        if (["ArrowRight", "ArrowLeft", "ArrowDown", "ArrowUp"].includes(e.key)) { e.preventDefault(); radios[(k + 1) % radios.length].click(); }
      });
    });

    G = { g, idx: 0, auto: false };
    $$(".step").forEach(li => {
      const go = () => { const st = g.steps[+li.dataset.step]; if (st.slides.length) setSlide(st.first, false); else markStep(+li.dataset.step); };
      li.addEventListener("click", e => { if (e.target.closest("a, button, input, label")) return; go(); });
      li.addEventListener("keydown", e => { if (e.key === "Enter" && e.target === li) { go(); } });
    });
    $$(".inline-shots button").forEach(b => b.addEventListener("click", () => openGuideLightbox(+b.dataset.flat, b)));
    bindStepBar(g);
    if (hasSlides) {
      $("#vDots").innerHTML = g.steps.map((st, si) => st.slides.length ? `<span class="dg">${st.slides.map((s, k) => `<button data-flat="${st.first + k}" aria-label="Step ${si + 1}, screen ${k + 1}"></button>`).join("")}</span>` : "").join("");
      $("#vThumbs").innerHTML = g.flat.map((f, k) => `<button data-flat="${k}" aria-label="Step ${f.step + 1}, screen ${f.k + 1}"><img src="${f.src}" alt="" loading="lazy"></button>`).join("");
      $$("#vDots button, #vThumbs button").forEach(b => b.addEventListener("click", () => setSlide(+b.dataset.flat, true)));
      $("#vPrev").addEventListener("click", () => setSlide(G.idx - 1, true));
      $("#vNext").addEventListener("click", () => setSlide(G.idx + 1, true));
      $("#vFrame").addEventListener("click", () => openGuideLightbox(G.idx, $("#vFrame")));
      let start = 0;
      if (stepNo) { const st = g.steps[stepNo - 1]; if (st) start = st.slides.length ? st.first : 0; }
      setSlide(start, false, true);
    }
    if (stepNo) { const li = $("#step-" + stepNo); if (li) { markStep(stepNo - 1); G.auto = true; setTimeout(() => li.scrollIntoView({ block: "center" }), 30); setTimeout(() => { if (G) G.auto = false; }, 800); li.focus({ preventScroll: true }); } }
  }
  function markStep(si) {
    $$(".step").forEach(li => li.classList.toggle("active", +li.dataset.step === si));
    const pos = $("#sbPos"); if (pos && G) { pos.textContent = `Step ${si + 1} of ${G.g.steps.length}`; $("#sbPrev").disabled = si <= 0; $("#sbNext").disabled = si >= G.g.steps.length - 1; }
  }
  /* Phone and tablet: sticky step bar; the step crossing the upper third of the screen becomes current. */
  let stepObs = null;
  function bindStepBar(g) {
    if (stepObs) { stepObs.disconnect(); stepObs = null; }
    const goStep = n => { n = Math.max(0, Math.min(g.steps.length - 1, n)); markStep(n); const li = $("#step-" + (n + 1)); G.auto = true; li.scrollIntoView({ block: "start", behavior: reduced ? "auto" : "smooth" }); setTimeout(() => { if (G) G.auto = false; }, 700); };
    const cur = () => { const a = $(".step.active"); return a ? +a.dataset.step : 0; };
    $("#sbPrev").addEventListener("click", () => goStep(cur() - 1));
    $("#sbNext").addEventListener("click", () => goStep(cur() + 1));
    $("#sbPos").addEventListener("click", () => window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" }));
    if (!$(".step.active")) markStep(0);
    if ("IntersectionObserver" in window) {
      stepObs = new IntersectionObserver(entries => {
        if (innerWidth >= 1200 || (G && G.auto)) return;
        entries.forEach(e => { if (e.isIntersecting) markStep(+e.target.dataset.step); });
      }, { rootMargin: "-20% 0px -65% 0px" });
      $$(".step").forEach(li => stepObs.observe(li));
    }
  }
  function setSlide(i, fromViewer, initial) {
    const g = G.g; if (!g.flat.length) return;
    i = Math.max(0, Math.min(g.flat.length - 1, i)); G.idx = i;
    const f = g.flat[i], st = g.steps[f.step];
    const img = $("#vImg");
    if (img.getAttribute("src") !== f.src) { img.classList.add("loading"); img.onload = img.onerror = () => img.classList.remove("loading"); img.src = f.src; }
    img.alt = f.alt;
    $("#vTitle").textContent = `Step ${f.step + 1}: ${st.t}`;
    $("#vPos").textContent = `Screen ${i + 1} of ${g.flat.length}`;
    $$("#vDots button, #vThumbs button").forEach(b => b.setAttribute("aria-current", String(+b.dataset.flat === i)));
    const th = $(`#vThumbs button[data-flat="${i}"]`), strip = $("#vThumbs");
    if (th) strip.scrollTo({ left: th.offsetLeft - strip.clientWidth / 2 + th.clientWidth / 2, behavior: reduced || initial ? "auto" : "smooth" });
    $("#vPrev").disabled = i === 0; $("#vNext").disabled = i === g.flat.length - 1;
    [i - 1, i + 1].forEach(k => { if (g.flat[k]) { const p = new Image(); p.src = g.flat[k].src; } });
    markStep(f.step);
    if (!initial) history.replaceState(null, "", `#guide-${g.id}-s${f.step + 1}${g.mode ? "-" + g.mode : ""}`);
    if (fromViewer) {
      const li = $("#step-" + (f.step + 1));
      if (li) { const r = li.getBoundingClientRect(); if (r.top < 90 || r.bottom > innerHeight) { G.auto = true; li.scrollIntoView({ block: "center", behavior: reduced ? "auto" : "smooth" }); setTimeout(() => { if (G) G.auto = false; }, 700); } }
    }
  }
  // Scrolling the steps column activates the step crossing 35% of the viewport (desktop viewer only).
  let scrollT;
  window.addEventListener("scroll", () => {
    if (!G || !$("#vImg") || G.auto || innerWidth < 1200) return;
    clearTimeout(scrollT);
    scrollT = setTimeout(() => {
      const y = innerHeight * 0.35; let best = null;
      $$(".step").forEach(li => { const r = li.getBoundingClientRect(); if (r.top <= y) best = li; });
      if (best) { const st = G.g.steps[+best.dataset.step]; const cur = G.g.flat[G.idx]; if (st.slides.length && cur.step !== +best.dataset.step) setSlide(st.first, false); }
    }, 90);
  }, { passive: true });
  function openGuideLightbox(i, opener) {
    const g = G.g;
    Lightbox.open(g.flat.map(f => ({ src: f.src, alt: f.alt, title: `Step ${f.step + 1}: ${g.steps[f.step].t}`, callouts: g.steps[f.step].slides.length ? (info(f.deck, f.n).steps || []) : [] })), i, g.title, opener, k => { if ($("#vImg")) setSlide(k, true); });
  }

  /* ---------- LIGHTBOX ---------- */
  const Lightbox = (() => {
    let el, list, idx, opener, onChange, s = 1, tx = 0, ty = 0, title;
    function apply() { const im = $("#lbImg"); im.style.transform = `translate(${tx}px, ${ty}px) scale(${s})`; $(".lb-stage").classList.toggle("zoomed", s > 1); $("#lbZoom").textContent = s === 1 ? "Fit" : Math.round(s * 100) + "%"; }
    function zoomTo(n, cx, cy) {
      n = Math.max(1, Math.min(4, n));
      const st = $(".lb-stage").getBoundingClientRect();
      if (cx != null) { const ox = cx - (st.left + st.width / 2), oy = cy - (st.top + st.height / 2); tx = ox - (ox - tx) * (n / s); ty = oy - (oy - ty) * (n / s); }
      s = n; if (s === 1) { tx = 0; ty = 0; } apply();
    }
    function show(i) {
      if (idx != null && (i < 0 || i >= list.length)) return;
      idx = Math.max(0, Math.min(list.length - 1, i)); s = 1; tx = 0; ty = 0;
      const it = list[idx], im = $("#lbImg"); im.src = it.src; im.alt = it.alt;
      $("#lbPos").textContent = list.length > 1 ? `${idx + 1} of ${list.length}` : "";
      $("#lbCap").innerHTML = `<b>${esc(it.title)}</b>${it.callouts.length ? `<ul>${it.callouts.map(c => { const [n, t] = splitCallout(c); return `<li>${n ? `<span class="tagn">${n}</span>` : ""}${esc(t)}</li>`; }).join("")}</ul>` : ""}`;
      $(".lb-nav.prev", el).hidden = idx === 0; $(".lb-nav.next", el).hidden = idx === list.length - 1;
      if (document.activeElement && document.activeElement.hidden) $("#lbClose").focus();
      apply(); if (onChange) onChange(idx);
    }
    function close() { if (!el) return; el.remove(); el = null; document.removeEventListener("keydown", key, true); $("#app").inert = false; $(".site-header").inert = false; if (opener && opener.focus) opener.focus(); }
    function key(e) {
      if (!el) return;
      const k = e.key;
      if (k === "Escape") { e.preventDefault(); close(); }
      else if (k === "ArrowRight" || k === "ArrowLeft") { e.preventDefault(); if (s > 1) { tx += k === "ArrowRight" ? -80 : 80; apply(); } else show(idx + (k === "ArrowRight" ? 1 : -1)); }
      else if ((k === "ArrowUp" || k === "ArrowDown") && s > 1) { e.preventDefault(); ty += k === "ArrowDown" ? -80 : 80; apply(); }
      else if (k === "+" || k === "=") { e.preventDefault(); zoomTo(s + 0.5); }
      else if (k === "-") { e.preventDefault(); zoomTo(s - 0.5); }
      else if (k === "0") { e.preventDefault(); zoomTo(1); }
      else if (k === "Home") { e.preventDefault(); show(0); }
      else if (k === "End") { e.preventDefault(); show(list.length - 1); }
      else if (k === "Tab") { const f = $$("button", el).filter(b => b.offsetParent); const a = f.indexOf(document.activeElement); e.preventDefault(); f[(a + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus(); }
    }
    function open(items, i, t, op, cb) {
      close(); list = items; idx = null; opener = op; onChange = null; title = t;
      el = document.createElement("div"); el.className = "lightbox"; el.setAttribute("role", "dialog"); el.setAttribute("aria-modal", "true"); el.setAttribute("aria-label", "Screenshot viewer");
      el.innerHTML = `<div class="lb-top"><span class="t">${esc(t)}</span><span class="pos" id="lbPos"></span><span class="sp"></span>
        <button class="lb-btn" id="lbOut" aria-label="Zoom out">${icon("zoom-out", "sm")}</button><button class="lb-btn" id="lbZoom" aria-label="Fit to screen">Fit</button><button class="lb-btn" id="lbIn" aria-label="Zoom in">${icon("zoom-in", "sm")}</button>
        <button class="lb-btn" id="lbClose" aria-label="Close">${icon("x", "sm")}</button></div>
        <div class="lb-stage"><img id="lbImg" alt="" draggable="false"><button class="lb-btn lb-nav prev" aria-label="Previous">${icon("chev-l")}</button><button class="lb-btn lb-nav next" aria-label="Next">${icon("chev-r")}</button></div>
        <div class="lb-cap" id="lbCap" aria-live="polite"></div>`;
      document.body.appendChild(el); $("#app").inert = true; $(".site-header").inert = true;
      $("#lbClose").onclick = close; $("#lbIn").onclick = () => zoomTo(s + 0.5); $("#lbOut").onclick = () => zoomTo(s - 0.5); $("#lbZoom").onclick = () => zoomTo(1);
      $(".lb-nav.prev", el).onclick = () => show(idx - 1); $(".lb-nav.next", el).onclick = () => show(idx + 1);
      const stage = $(".lb-stage", el), im = $("#lbImg");
      let downOnStage = false, downAt = null;
      stage.addEventListener("click", e => { const still = downAt && Math.hypot(e.clientX - downAt.x, e.clientY - downAt.y) < 6; if (downOnStage && still) close(); downOnStage = false; });
      im.addEventListener("dblclick", e => zoomTo(s > 1 ? 1 : 2, e.clientX, e.clientY));
      stage.addEventListener("wheel", e => { if (e.ctrlKey || e.metaKey || s > 1) { e.preventDefault(); if (e.ctrlKey || e.metaKey) zoomTo(s * (e.deltaY < 0 ? 1.2 : 1 / 1.2), e.clientX, e.clientY); else { tx -= e.deltaX; ty -= e.deltaY; apply(); } } }, { passive: false });
      const pts = new Map(); let drag = null, pinch = null, swipe = null;
      stage.addEventListener("pointerdown", e => {
        if (e.target.closest("button")) return;
        downOnStage = e.target === stage; downAt = { x: e.clientX, y: e.clientY };
        stage.setPointerCapture(e.pointerId); pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
        if (pts.size === 2) { const [a, b] = [...pts.values()]; pinch = { d: Math.hypot(a.x - b.x, a.y - b.y), s }; drag = null; }
        else if (s > 1) { drag = { x: e.clientX - tx, y: e.clientY - ty }; stage.classList.add("dragging"); }
        else swipe = { x: e.clientX, y: e.clientY };
      });
      stage.addEventListener("pointermove", e => {
        if (!pts.has(e.pointerId)) return; pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
        if (pinch && pts.size === 2) { const [a, b] = [...pts.values()]; zoomTo(pinch.s * Math.hypot(a.x - b.x, a.y - b.y) / pinch.d); }
        else if (drag) { tx = e.clientX - drag.x; ty = e.clientY - drag.y; apply(); }
      });
      const up = e => {
        pts.delete(e.pointerId); stage.classList.remove("dragging");
        if (swipe && pts.size === 0) { const dx = e.clientX - swipe.x; if (Math.abs(dx) > 60 && Math.abs(e.clientY - swipe.y) < 80) show(idx + (dx < 0 ? 1 : -1)); }
        if (pts.size < 2) pinch = null; if (pts.size === 0) { drag = null; swipe = null; }
      };
      stage.addEventListener("pointerup", up); stage.addEventListener("pointercancel", up);
      document.addEventListener("keydown", key, true);
      show(i); onChange = cb || null; $("#lbClose").focus();
    }
    return { open, isOpen: () => !!el };
  })();

  /* ---------- HELP ---------- */
  function renderHelp(sec) {
    const H = HC.help, topics = [...new Set(H.issues.map(i => i.topic))];
    page(`
      <div class="crumbs"><a href="#home">Home</a><span>›</span><a href="#guidance">Guidance</a><span>›</span><span>Troubleshooting</span></div>
      <div class="kicker">Guidance</div>
      <h1 class="page-title">Troubleshooting and FAQ</h1>
      <p class="lead">Start with the symptom. Most issues trace back to a setup field or a missing record, and every fix links to the guide that solves it.</p>
      <div class="section" id="sec-issues"><h2>Common issues</h2>
        <div class="filters"><div class="filter-input">${icon("search", "sm")}<input id="issueFilter" type="search" placeholder='Describe the problem, e.g. "payroll failed"' aria-label="Filter issues"></div>
        <div class="chip-row"><span>Topic</span>${["All", ...topics].map((t, k) => `<button class="chip" data-topic="${t}" aria-pressed="${k === 0}">${t}</button>`).join("")}</div></div>
        <div id="issues"></div></div>
      <div class="section" id="sec-statuses"><h2>Status reference</h2>
        <div class="table-wrap"><table><thead><tr><th>Module</th><th>Status journey</th><th>Who acts next</th></tr></thead><tbody>${H.statuses.map(s => `<tr><td>${s.module}</td><td>${s.flow.map(f => `<span class="status-pill st-${f[1]}">${esc(f[0])}</span>`).join(" ")}</td><td>${esc(s.next)}</td></tr>`).join("")}</tbody></table></div></div>
      <div class="section" id="sec-ticket"><div class="ticket card"><span class="ico">${icon("life-buoy", "lg")}</span><div><h2 style="font-size:20px">Still stuck? Raise a SainoDesk ticket</h2><p style="margin:6px 0 0;color:var(--text-2)">SainoForce answers every ticket; repeat questions become new guides here. Include:</p><ul><li>The menu path where it happened</li><li>Company and employee code</li><li>A screenshot of the screen or error</li><li>What you expected to happen</li></ul></div></div></div>
    `, { journey: "train", nav: trainNav(null, null, "help"), title: "Troubleshooting and FAQ", wide: true, noFocus: !!sec });
    let topic = "All";
    const draw = () => {
      const t = $("#issueFilter").value.toLowerCase();
      const list = H.issues.filter(i => (topic === "All" || i.topic === topic) && (!t || (i.symptom + " " + i.cause + " " + i.fix.join(" ")).toLowerCase().includes(t)));
      $("#issues").innerHTML = list.length ? accordion(list.map(i => ({ head: `<span>${esc(i.symptom)} <span class="status-pill st-neutral tag">${esc(i.topic)}</span></span>`, a: `${i.cause ? `<p><b style="color:var(--text-1)">Why:</b> ${esc(i.cause)}</p>` : ""}<p style="margin-bottom:4px"><b style="color:var(--text-1)">Fix:</b></p><ol style="margin:0 0 10px;padding-left:20px">${i.fix.map(f => `<li>${esc(f)}</li>`).join("")}</ol><a href="#guide-${i.guide}">Full guide: ${esc(HC.guides[i.guide].title)} ${icon("arrow-r", "sm")}</a>` }))) : `<p style="color:var(--text-2)">No matching issue. Try the search bar or raise a SainoDesk ticket.</p>`;
      bindAccordion();
    };
    $$("[data-topic]").forEach(b => b.addEventListener("click", () => { topic = b.dataset.topic; $$("[data-topic]").forEach(x => x.setAttribute("aria-pressed", String(x === b))); draw(); }));
    $("#issueFilter").addEventListener("input", draw);
    draw();
    if (sec) { const el = $("#sec-" + sec); if (el) el.scrollIntoView(); }
  }

  /* ---------- SEARCH ---------- */
  const INDEX = [];
  Object.values(HC.guides).forEach(g => INDEX.push({ kind: "guide", journey: "train", group: ROLE(g.role).name, color: rc(g.role), title: g.title, href: "#guide-" + g.id, sub: g.summary,
    kw: g.keywords.join(" ") + " " + g.menuPath.join(" ") + " " + (g.menuPathMobile || []).join(" ") + " " + g.module + (hasBoth(g) ? " web mobile app" : ""), body: g.summary + " " + (g.intro || ""),
    steps: hasBoth(g)
      ? ["web", "mobile"].flatMap(pm => viewFor(g, pm).steps.map((s, i) => ({ i: i + 1, plat: pm, t: s.t, text: (s.d || "") + " " + s.callouts.join(" ") + " " + (pm === "mobile" ? "mobile app phone" : "web portal") })).filter((s, i) => { const st = viewFor(g, pm).steps[i]; return st.p === pm || (!st.p && pm === "web"); }))
      : g.steps.map((s, i) => ({ i: i + 1, t: s.t, text: (s.d || "") + " " + s.callouts.join(" ") })) }));
  const stepHref = r => `${r.it.href}-s${r.stepHit.i}${r.stepHit.plat ? "-" + r.stepHit.plat : ""}`;
  const stepLabel = (r, q) => `Step ${r.stepHit.i}${r.stepHit.plat ? ` · ${PLAT[r.stepHit.plat]}` : ""}: ${hl(r.stepHit.t, q)}`;
  if (SHOW_DEMO) HC.demo.chapters.forEach(c => INDEX.push({ kind: "demo", journey: "demo", group: "Demo", color: "var(--brand-navy)", title: c.title, href: "#demo-" + c.id, sub: c.lead, kw: "", body: c.lead, steps: [] }));
  if (SHOW_DEMO) HC.demo.moments.forEach(m => INDEX.push({ kind: "demo", journey: "demo", group: "Demo", color: "var(--brand-navy)", title: "Moments: " + m.title, href: "#demo-moments", sub: m.text, kw: "", body: m.text, steps: [] }));
  if (SHOW_DEMO) HC.demo.faq.forEach(q => INDEX.push({ kind: "demo", journey: "demo", group: "Demo", color: "var(--brand-navy)", title: q[0], href: "#demo-faq", sub: q[1], kw: "", body: q[1], steps: [] }));
  HC.help.issues.forEach(i => INDEX.push({ kind: "help", journey: "help", group: "Troubleshooting", color: "var(--role-help)", title: i.symptom, href: "#help-issues", sub: i.cause || i.fix[0], kw: i.topic, body: (i.cause || "") + " " + i.fix.join(" "), steps: [] }));
  function search(q) {
    const toks = q.toLowerCase().replace(/[^\w\s/&-]/g, " ").split(/\s+/).filter(Boolean);
    if (!toks.length) return [];
    const variants = toks.map(t => [t, ...(Object.prototype.hasOwnProperty.call(HC.synonyms, t) ? HC.synonyms[t] : [])]);
    return INDEX.map(it => {
      const T = it.title.toLowerCase(), K = it.kw.toLowerCase(), B = it.body.toLowerCase();
      let score = 0, stepHit = null, ok = true;
      variants.forEach((vs, vi) => {
        const last = vi === toks.length - 1;
        let m = 0;
        vs.forEach(v => {
          const re = new RegExp("\\b" + v.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + (last ? "" : "\\b"));
          if (re.test(T)) m = Math.max(m, T.startsWith(v) ? 12 : 9);
          else if (re.test(K)) m = Math.max(m, 6);
          else { const sh = it.steps.find(s => re.test(s.t.toLowerCase())); if (sh) { m = Math.max(m, 4); stepHit = stepHit || sh; } else if (re.test(B)) m = Math.max(m, 2); else { const s2 = it.steps.find(s => re.test(s.text.toLowerCase())); if (s2) { m = Math.max(m, 1); stepHit = stepHit || s2; } } }
        });
        if (!m) ok = false; score += m;
      });
      return ok ? { it, score, stepHit } : null;
    }).filter(Boolean).sort((a, b) => b.score - a.score);
  }
  const hl = (s, q) => { let o = esc(s); q.toLowerCase().split(/\s+/).filter(w => w.length > 1).forEach(w => { o = o.replace(new RegExp("(" + esc(w).replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")", "gi"), "<mark>$1</mark>"); }); return o; };
  let lastQuery = "";
  function attachSearch(input, pop) {
    let sel = -1, items = [], t;
    const close = () => { pop.hidden = true; input.setAttribute("aria-expanded", "false"); sel = -1; };
    const draw = () => {
      const q = input.value.trim(); lastQuery = q;
      if (q.length < 2) { close(); return; }
      const res = search(q);
      const order = current.journey === "demo" ? ["demo", "train", "help"] : ["train", "demo", "help"];
      const groups = {}; res.forEach(r => { const key = r.it.journey === "train" ? "Guidance · " + r.it.group : r.it.journey === "demo" ? "Demo" : "Troubleshooting"; (groups[key] = groups[key] || { j: r.it.journey, list: [] }).list.push(r); });
      const keys = Object.keys(groups).sort((a, b) => order.indexOf(groups[a].j) - order.indexOf(groups[b].j));
      let shown = 0, html = "";
      items = [];
      keys.forEach(k => {
        if (shown >= 8) return;
        const l = groups[k].list.slice(0, Math.min(3, 8 - shown)); shown += l.length;
        html += `<div class="grp">${esc(k)}</div>` + l.map(r => { const href = r.stepHit && r.it.kind === "guide" ? stepHref(r) : r.it.href; items.push(href); return `<a href="${href}" role="option" id="opt-${items.length - 1}" aria-selected="false"><span class="bar" style="background:${r.it.color}"></span><span><b>${hl(r.it.title, q)}</b><small>${r.stepHit && r.it.kind === "guide" ? stepLabel(r, q) : hl(r.it.sub, q)}</small></span></a>`; }).join("");
      });
      pop.innerHTML = res.length ? html + `<a class="all" href="#search">See all ${res.length} result${res.length > 1 ? "s" : ""} for “${esc(q)}”</a>` : `<div class="none">No matches for “${esc(q)}”. Try leave, payroll or claim, or see <a href="#help">Troubleshooting</a>.</div>`;
      pop.hidden = false; input.setAttribute("aria-expanded", "true"); sel = -1;
      $$("a", pop).forEach(a => a.addEventListener("click", () => { close(); if (a.getAttribute("href") === location.hash) route(); }));
    };
    input.addEventListener("input", () => { clearTimeout(t); t = setTimeout(draw, 80); });
    input.addEventListener("focus", () => { if (input.value.trim().length >= 2) draw(); });
    input.addEventListener("keydown", e => {
      const opts = $$('a[role="option"]', pop);
      if (e.key === "ArrowDown" || e.key === "ArrowUp") { e.preventDefault(); if (pop.hidden) draw(); sel = Math.max(-1, Math.min(opts.length - 1, sel + (e.key === "ArrowDown" ? 1 : -1))); opts.forEach((o, k) => o.setAttribute("aria-selected", String(k === sel))); input.setAttribute("aria-activedescendant", sel >= 0 ? opts[sel].id : ""); if (opts[sel]) opts[sel].scrollIntoView({ block: "nearest" }); }
      else if (e.key === "Enter") { e.preventDefault(); const q = input.value.trim(); if (q.length < 2) return; close(); if (sel >= 0 && opts[sel]) location.hash = opts[sel].getAttribute("href").slice(1); else { lastQuery = q; if (location.hash === "#search") renderSearch(); else location.hash = "search"; } input.blur(); }
      else if (e.key === "Escape") { if (!pop.hidden) close(); else { input.value = ""; closeSearch(); } }
    });
  }
  document.addEventListener("click", e => {
    if (e.target.closest(".header-search, .hero-search")) return;
    $$(".search-pop").forEach(p => { p.hidden = true; });
    $$('[role="combobox"]').forEach(i => i.setAttribute("aria-expanded", "false"));
  });
  function renderSearch() {
    const q = lastQuery, res = q ? search(q) : [];
    page(`<div class="crumbs"><a href="#home">Home</a><span>›</span><span>Search</span></div>
      <h1 class="page-title">${q ? `Results for “${esc(q)}”` : "Search the Help Centre"}</h1>
      <p class="lead">${q ? `${res.length} result${res.length === 1 ? "" : "s"}` : "Type a task in the search bar above, for example “process payroll”."}</p>
      <div class="guide-list" style="margin-top:20px;max-width:860px">${res.map(r => { const href = r.stepHit && r.it.kind === "guide" ? stepHref(r) : r.it.href; return `<a class="guide-row" href="${href}" style="--rc:${r.it.color}"><b>${hl(r.it.title, q)}</b><small>${r.stepHit && r.it.kind === "guide" ? stepLabel(r, q) : hl(r.it.sub, q)}</small><span class="tags"><span>${esc(r.it.journey === "train" ? "Guidance" : r.it.journey === "demo" ? "Demo" : "Troubleshooting")}</span><span>${esc(r.it.journey === "train" ? r.it.group : "")}</span></span></a>`; }).join("")}</div>
      ${q && !res.length ? `<p style="color:var(--text-2)">No matches. Try a shorter word such as leave, payroll or claim, or see <a class="inline" href="#help">Troubleshooting</a>.</p>` : ""}`,
      { journey: current.journey === "none" ? "train" : current.journey, nav: null, title: "Search", wide: true });
    if (!q) focusSearch();
  }

  /* ---------- PRESENTER ---------- */
  const SLIDESET = (() => {
    const D = HC.demo, S = [];
    S.push({ ch: "why", type: "title", kicker: "SainoForce", title: "HRMS 3.0", lead: "One connected HR system for Malaysian companies: leave, claims, attendance, payroll, performance and ESG, on web and mobile." });
    S.push({ ch: "why", type: "tiles", kicker: "Why HRMS 3.0", title: "Everything in HR, in one system", tiles: D.stats });
    S.push({ ch: "why", type: "points", kicker: "Why HRMS 3.0", title: "From manual HR to one connected flow", points: D.pains.slice(0, 5).map(p => p.now + ": " + p.detail), img: "leave_dash" });
    S.push({ ch: "cycle", type: "cycle", kicker: "The big idea", title: "One connected HR cycle", lead: "Data entered once flows through to approvals, payroll and reports." });
    D.roles.forEach(r => S.push({ ch: "roles", type: "points", kicker: "Value by role", title: r.name, points: r.gains.map(g => g[0] + ": " + g[1]), img: r.img, phone: r.phone }));
    S.push({ ch: "compliance", type: "grid", kicker: "Compliance", title: "Malaysia-ready from day one", grid: D.compliance.slice(0, 8) });
    D.moments.forEach((m, k) => S.push({ ch: "moments", type: "shot", kicker: `Live moment ${k + 1} of ${D.moments.length}`, title: m.title, lead: m.text, img: m.img, phone: m.phone }));
    S.push({ ch: "faq", type: "qa", kicker: "Questions", title: "What prospects usually ask", grid: D.faq.slice(0, 6) });
    S.push({ ch: "next", type: "qa", kicker: "Next steps", title: "Path to go-live", grid: D.next, numbered: true });
    S.push({ ch: "next", type: "title", kicker: "Thank you", title: "Questions?", lead: "Keep this Help Centre: Guidance has step-by-step guides for every role." });
    return S;
  })();
  let P = null;
  function slideHtml(sl, n) {
    const logo = `<img class="p-logo" src="assets/img/sainoforce-logo.png" alt="SainoForce">`;
    const head = `<div class="p-kicker">${esc(sl.kicker)}</div><h1>${esc(sl.title)}</h1>${sl.lead && sl.type !== "title" ? `<p class="p-lead">${esc(sl.lead)}</p>` : ""}`;
    let body = "";
    if (sl.type === "title") return `<div class="p-canvas p-title">${logo}<div class="p-kicker">${esc(sl.kicker)}</div><h1>${esc(sl.title)}</h1><p class="p-lead">${esc(sl.lead)}</p></div>`;
    if (sl.type === "tiles") body = `<div class="p-tiles">${sl.tiles.map(t => `<div><b>${esc(t[0])}</b><span>${esc(t[1])}</span></div>`).join("")}</div>`;
    if (sl.type === "points") body = `<ul class="p-points">${sl.points.map(p => { const [a, ...b] = p.split(": "); return `<li>${icon("check")}<span><b>${esc(a)}</b>${b.length ? ": " + esc(b.join(": ")) : ""}</span></li>`; }).join("")}</ul><div class="p-shot ${sl.phone ? "phone" : ""}"><img src="${IMG(sl.img)}" alt=""></div>`;
    if (sl.type === "shot") body = `<div class="p-shot ${sl.phone ? "phone" : ""}"><img src="${IMG(sl.img)}" alt="${esc(sl.title)}"></div>`;
    if (sl.type === "grid") body = `<div class="p-grid">${sl.grid.map(g => `<div><span class="tick">${icon("shield")}</span><div><b>${esc(g[0])}</b><span>${esc(g[1])}</span></div></div>`).join("")}</div>`;
    if (sl.type === "qa") body = `<div class="p-grid">${sl.grid.map((g, k) => `<div><span class="tick" style="background:var(--brand-50);color:var(--brand-navy);font-weight:700;font-family:var(--f-head)">${sl.numbered ? k + 1 : "?"}</span><div><b style="font-size:21px">${esc(g[0])}</b><span style="font-size:17px">${esc(g[1])}</span></div></div>`).join("")}</div>`;
    if (sl.type === "cycle") body = `<div class="cycle-row present-cycle">${HC.demo.cycle.map((c, i) => `<div class="pc"><em>${i + 1}</em><b>${esc(c.name)}</b><span>${esc(c.role)}</span></div>${i < HC.demo.cycle.length - 1 ? `<i>${icon("chev-r")}</i>` : ""}`).join("")}</div>`;
    return `<div class="p-canvas">${logo}${head}<div class="p-body">${body}</div></div>`;
  }
  function renderPresent(n) {
    n = Math.max(1, Math.min(SLIDESET.length, n || 1));
    if (!P) {
      const el = document.createElement("div"); el.className = "presenter"; el.setAttribute("role", "dialog"); el.setAttribute("aria-label", "Presenter mode");
      el.innerHTML = `<div id="pStage"></div><div class="p-bar"><div class="track"><i id="pTrack"></i></div><div class="row"><span id="pPos"></span><span class="sp"></span><button class="btn btn-ghost" id="pGrid">${icon("grid", "sm")} Slides (G)</button><button class="btn btn-ghost" id="pFull">${icon("maximize", "sm")} Full screen (F)</button><button class="btn btn-ghost" id="pExit">${icon("x", "sm")} Exit (Esc)</button></div></div>`;
      document.body.appendChild(el); document.body.style.overflow = "hidden";
      P = { el, n, idle: null };
      $("#pExit").onclick = exitPresent; $("#pGrid").onclick = jumpGrid; $("#pFull").onclick = toggleFull;
      el.addEventListener("mousemove", wake); el.addEventListener("click", e => { if (!e.target.closest("button") && !$(".p-jump")) go(P.n + 1); });
      document.addEventListener("keydown", pKey); window.addEventListener("resize", fit);
      wake();
    }
    P.n = n;
    $("#pStage").innerHTML = slideHtml(SLIDESET[n - 1], n);
    $("#pTrack").style.width = (n / SLIDESET.length * 100) + "%";
    $("#pPos").textContent = `${n} / ${SLIDESET.length} · ${HC.demo.chapters.find(c => c.id === SLIDESET[n - 1].ch).title}`;
    document.title = `Presenting ${n}/${SLIDESET.length} · HRMS 3.0 Help Centre`;
    fit();
  }
  function fit() { if (!P) return; const c = $(".p-canvas"); if (!c) return; const s = Math.min(innerWidth / 1280, innerHeight / 720) * 0.96; c.style.transform = `translate(-50%, -50%) scale(${s})`; }
  function go(n) { if (!P) return; n = Math.max(1, Math.min(SLIDESET.length, n)); history.replaceState(null, "", "#present-" + n); renderPresent(n); }
  function wake() { if (!P) return; $(".p-bar").classList.remove("idle"); P.el.classList.remove("hide-cursor"); clearTimeout(P.idle); P.idle = setTimeout(() => { if (!P) return; $(".p-bar").classList.add("idle"); P.el.classList.add("hide-cursor"); }, 2000); }
  function toggleFull() { try { if (document.fullscreenElement) document.exitFullscreen(); else document.documentElement.requestFullscreen().catch(() => toast("Full screen is not available here")); } catch (e) { toast("Full screen is not available here"); } }
  function jumpGrid() {
    if ($(".p-jump")) { $(".p-jump").remove(); return; }
    const d = document.createElement("div"); d.className = "p-jump";
    d.innerHTML = `<h2>Jump to a slide</h2><div class="p-jump-grid">${SLIDESET.map((s, k) => `<button data-n="${k + 1}" aria-current="${k + 1 === P.n}"><em>${k + 1}</em><b>${esc(s.title)}</b><span style="font-size:13px;color:var(--text-3)">${esc(s.kicker)}</span></button>`).join("")}</div>`;
    P.el.appendChild(d); $$("button", d).forEach(b => b.onclick = e => { e.stopPropagation(); d.remove(); go(+b.dataset.n); });
    const cur = $(`button[data-n="${P.n}"]`, d); if (cur) cur.focus();
  }
  function pKey(e) {
    if (!P) return; wake();
    const k = e.key;
    if ($(".p-jump")) { if (k === "Escape" || k === "g" || k === "G") { e.preventDefault(); $(".p-jump").remove(); } return; }
    if (["ArrowRight", " ", "PageDown", "ArrowDown", "Enter"].includes(k)) { e.preventDefault(); go(P.n + 1); }
    else if (["ArrowLeft", "PageUp", "ArrowUp", "Backspace"].includes(k)) { e.preventDefault(); go(P.n - 1); }
    else if (k === "Home") { e.preventDefault(); go(1); }
    else if (k === "End") { e.preventDefault(); go(SLIDESET.length); }
    else if (k === "g" || k === "G") { e.preventDefault(); jumpGrid(); }
    else if (k === "f" || k === "F") { e.preventDefault(); toggleFull(); }
    else if (k === "b" || k === "B" || k === ".") { e.preventDefault(); const b = $(".p-blank", P.el); if (b) b.remove(); else { const x = document.createElement("div"); x.className = "p-blank"; P.el.appendChild(x); } }
    else if (k === "Escape") { e.preventDefault(); exitPresent(); }
  }
  function exitPresent() {
    if (!P) return; const ch = SLIDESET[P.n - 1].ch;
    document.removeEventListener("keydown", pKey); window.removeEventListener("resize", fit);
    clearTimeout(P.idle); P.el.remove(); P = null; document.body.style.overflow = "";
    try { if (document.fullscreenElement) document.exitFullscreen(); } catch (e) { /* ignore */ }
    location.hash = "demo-" + ch;
  }

  /* ---------- shortcuts dialog ---------- */
  function shortcuts() {
    if ($(".dialog-back")) return;
    const rows = [["/ or Ctrl+K", "Search"], ...(SHOW_DEMO ? [["P", "Present the demo (demo pages)"]] : []), ["← →", "Previous or next screen in a guide"], ["J / K", "Next or previous step in a guide"], ["F", "Open the screen full size"], ["+ − 0", "Zoom in, out, fit (full-size view)"], ["Esc", "Close"], ["?", "Show these shortcuts"]];
    const d = document.createElement("div"); d.className = "dialog-back";
    d.innerHTML = `<div class="dialog" role="dialog" aria-modal="true" aria-labelledby="kbH"><h2 id="kbH">Keyboard shortcuts <button class="btn btn-ghost" aria-label="Close">${icon("x", "sm")}</button></h2><div class="table-wrap"><table><tbody>${rows.map(r => `<tr><td><kbd>${r[0]}</kbd></td><td>${r[1]}</td></tr>`).join("")}</tbody></table></div></div>`;
    document.body.appendChild(d);
    const close = () => { d.remove(); document.removeEventListener("keydown", esc2); };
    const esc2 = e => { if (e.key === "Escape") close(); };
    $("button", d).onclick = close; d.addEventListener("click", e => { if (e.target === d) close(); }); document.addEventListener("keydown", esc2); $("button", d).focus();
  }

  /* ---------- global keys ---------- */
  document.addEventListener("keydown", e => {
    if (P || Lightbox.isOpen() || $(".dialog-back")) return;
    const typing = e.target.closest("input, textarea, select, [contenteditable]");
    if ((e.key === "/" && !typing) || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k")) { e.preventDefault(); focusSearch(); return; }
    if (typing || e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.key === "Escape") { closeDrawer(); return; }
    if (e.key === "?") { e.preventDefault(); shortcuts(); return; }
    if (e.key === "[" && $("#sideNav") && innerWidth >= 1200) { e.preventDefault(); setCollapsed(!document.body.classList.contains("nav-collapsed")); return; }
    if ((e.key === "p" || e.key === "P") && current.journey === "demo") { e.preventDefault(); const m = location.hash.match(/^#demo-(\w+)/); const ch = m ? m[1] : null; const i = ch ? SLIDESET.findIndex(s => s.ch === ch) : 0; location.hash = "present-" + (Math.max(0, i) + 1); return; }
    if (G && $("#steps") && location.hash.startsWith("#guide-")) {
      if (e.target.closest("button.chip, .tabs")) return;
      if (e.key === "ArrowRight" && $("#vImg")) { e.preventDefault(); setSlide(G.idx + 1, true); }
      else if (e.key === "ArrowLeft" && $("#vImg")) { e.preventDefault(); setSlide(G.idx - 1, true); }
      else if (e.key === "j" || e.key === "k") {
        e.preventDefault(); const cur = $(".step.active"), si = cur ? +cur.dataset.step : -1, n = Math.max(0, Math.min(G.g.steps.length - 1, si + (e.key === "j" ? 1 : -1))), st = G.g.steps[n];
        if (st.slides.length && $("#vImg")) setSlide(st.first, true); else { markStep(n); $("#step-" + (n + 1)).scrollIntoView({ block: "center" }); }
      }
      else if ((e.key === "f" || e.key === "F") && G.g.flat.length) { e.preventDefault(); openGuideLightbox(G.idx, document.activeElement); }
    }
  });

  /* ---------- router ---------- */
  function route() {
    let h = decodeURIComponent((location.hash || "#home").slice(1));
    closeDrawer();
    if (Lightbox.isOpen()) $("#lbClose").click();
    let m;
    if (!SHOW_DEMO && /^(demo|present-)/.test(h)) { history.replaceState(null, "", "#home"); h = "home"; }
    if ((m = h.match(/^present-(\d+)$/))) { renderPresent(+m[1]); return; }
    if (P) { P.el.remove(); P = null; document.body.style.overflow = ""; document.removeEventListener("keydown", pKey); }
    G = null;
    if (stepObs) { stepObs.disconnect(); stepObs = null; }
    if (h === "home" || h === "") return renderHome();
    if (h === "demo") return renderDemoOverview();
    if ((m = h.match(/^demo-roles-(\w+)$/))) return renderDemoChapter("roles", m[1]);
    if ((m = h.match(/^demo-(\w+)$/)) && HC.demo.chapters.some(c => c.id === m[1])) return renderDemoChapter(m[1]);
    if (h === "train" || h === "guidance") return renderTrain();
    if (h === "train-day" || h === "library") return renderTrain(h);
    if ((m = h.match(/^role-([\w-]+)$/)) && ROLE(m[1])) return renderRole(m[1]);
    if ((m = h.match(/^guide-([\w-]+?)(?:-s(\d+))?(?:-(web|mobile))?$/)) && HC.guides[m[1]]) return renderGuide(m[1], m[2] ? +m[2] : null, m[3] || null);
    if (h === "help") return renderHelp();
    if ((m = h.match(/^help-(issues|statuses|ticket)$/))) return renderHelp(m[1]);
    if (h === "search") return renderSearch();
    toast("That page was not found"); renderHome();
  }
  attachSearch($("#siteSearch"), $("#sitePop"));
  $("#presentBtn").addEventListener("click", () => { const m = location.hash.match(/^#demo-(\w+)/); const i = m ? SLIDESET.findIndex(s => s.ch === m[1]) : 0; location.hash = "present-" + (Math.max(0, i) + 1); });
  window.addEventListener("hashchange", route);
  route();
})();
