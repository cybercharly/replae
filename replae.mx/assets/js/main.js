/* ===========================================================
   REPLAE — Main JS
   - Mobile menu toggle
   - Active nav link by page
   - WhatsApp link builder (data-wa="mensaje")
   - Scroll reveal (fadeInUp + variantes direccionales)
   - Contact form -> WhatsApp
   - Scroll progress bar / back-to-top
   - Contadores animados
   - Catálogo: buscador + filtros por categoría
   - Marquesina de marcas
   - Lightbox con navegación
   =========================================================== */

// ---- CONFIG ----
const WA_NUMBER = "5213339556619"; // 52 (MX) + 1 + 3339556619  (número principal)

document.addEventListener("DOMContentLoaded", () => {
  initMobileMenu();
  initActiveNav();
  initWhatsAppLinks();
  initScrollReveal();
  initContactForm();
  initNavbarShadow();
  initScrollProgress();
  initBackToTop();
  initCounters();
  initMarquee();
  initCatalogFilter();
  initLightbox();
  setYear();
});

/* ---------- Mobile menu ---------- */
function initMobileMenu() {
  const btn = document.getElementById("menuBtn");
  const menu = document.getElementById("mobileMenu");
  if (!btn || !menu) return;

  btn.addEventListener("click", () => {
    menu.classList.toggle("open");
    const icon = btn.querySelector("i");
    if (icon) {
      icon.classList.toggle("fa-bars");
      icon.classList.toggle("fa-xmark");
    }
  });

  menu.querySelectorAll("a").forEach(a =>
    a.addEventListener("click", () => menu.classList.remove("open"))
  );
}

/* ---------- Active nav link ---------- */
function initActiveNav() {
  let page = window.location.pathname.split("/").pop();
  if (!page || page === "") page = "index.html";
  document.querySelectorAll("[data-page]").forEach(link => {
    if (link.getAttribute("data-page") === page) link.classList.add("active");
  });
}

/* ---------- WhatsApp links ---------- */
function buildWaUrl(message) {
  const text = encodeURIComponent(message || "Hola REPLAE, me gustaría recibir información.");
  return `https://wa.me/${WA_NUMBER}?text=${text}`;
}
function initWhatsAppLinks() {
  document.querySelectorAll("[data-wa]").forEach(el => {
    const msg = el.getAttribute("data-wa");
    el.setAttribute("href", buildWaUrl(msg));
    el.setAttribute("target", "_blank");
    el.setAttribute("rel", "noopener");
  });
}

/* ---------- Scroll reveal (fade-up + [data-reveal]) ---------- */
function initScrollReveal() {
  const items = document.querySelectorAll(".fade-up, [data-reveal]");
  if (!("IntersectionObserver" in window)) {
    items.forEach(i => { i.classList.add("in-view"); i.classList.add("revealed"); });
    return;
  }
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add("in-view");
        e.target.classList.add("revealed");
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  items.forEach(i => obs.observe(i));
}

/* ---------- Navbar shadow / blur on scroll ---------- */
function initNavbarShadow() {
  const nav = document.getElementById("navbar");
  if (!nav) return;
  const onScroll = () => {
    if (window.scrollY > 10) { nav.classList.add("shadow-lg", "nav-scrolled"); }
    else { nav.classList.remove("shadow-lg", "nav-scrolled"); }
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

/* ---------- Scroll progress bar ---------- */
function initScrollProgress() {
  const bar = document.getElementById("scrollProgress");
  if (!bar) return;
  const onScroll = () => {
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    const pct = max > 0 ? (h.scrollTop / max) * 100 : 0;
    bar.style.width = pct + "%";
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

/* ---------- Back to top ---------- */
function initBackToTop() {
  const btn = document.getElementById("backToTop");
  if (!btn) return;
  const onScroll = () => {
    if (window.scrollY > 450) btn.classList.add("show");
    else btn.classList.remove("show");
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
  btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

/* ---------- Contadores animados ---------- */
function initCounters() {
  const nums = document.querySelectorAll("[data-count]");
  if (!nums.length) return;
  const run = (el) => {
    const target = parseFloat(el.getAttribute("data-count"));
    const prefix = el.getAttribute("data-prefix") || "";
    const suffix = el.getAttribute("data-suffix") || "";
    const dur = 1400;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      el.textContent = prefix + Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = prefix + target + suffix;
    };
    requestAnimationFrame(step);
  };
  if (!("IntersectionObserver" in window)) { nums.forEach(run); return; }
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { run(e.target); obs.unobserve(e.target); }
    });
  }, { threshold: 0.4 });
  nums.forEach(n => obs.observe(n));
}

/* ---------- Marquesina de marcas (loop sin fin) ---------- */
function initMarquee() {
  document.querySelectorAll(".marquee-track").forEach(track => {
    track.innerHTML += track.innerHTML; // duplica para loop continuo
  });
}

/* ---------- Catálogo: buscador + filtros ---------- */
function initCatalogFilter() {
  const search = document.getElementById("catalogSearch");
  const filters = document.getElementById("catalogFilters");
  const cards = document.querySelectorAll("[data-category]");
  if (!cards.length || (!search && !filters)) return;

  const countEl = document.getElementById("catalogCount");
  let activeFilter = "all";

  const apply = () => {
    const q = (search?.value || "").trim().toLowerCase();
    let visible = 0;
    cards.forEach(card => {
      const cat = card.getAttribute("data-category");
      const name = card.getAttribute("data-name") || "";
      const matchCat = activeFilter === "all" || cat === activeFilter;
      const matchText = !q || name.includes(q);
      const show = matchCat && matchText;
      card.style.display = show ? "" : "none";
      if (show) visible++;
    });
    // Mostrar/ocultar encabezados de categoría sin resultados
    document.querySelectorAll(".cat-grid").forEach(grid => {
      const slug = grid.getAttribute("data-cat");
      const anyVisible = grid.querySelectorAll('[data-category]:not([style*="display: none"])').length > 0;
      const head = document.querySelector('.cat-head[data-cat="' + slug + '"]');
      grid.style.display = anyVisible ? "" : "none";
      if (head) head.style.display = anyVisible ? "" : "none";
    });
    if (countEl) {
      countEl.textContent = visible === 0
        ? "Sin resultados — prueba con otra búsqueda."
        : `${visible} equipo${visible === 1 ? "" : "s"} disponible${visible === 1 ? "" : "s"}.`;
    }
  };

  if (filters) {
    filters.querySelectorAll(".cat-filter").forEach(btn => {
      btn.addEventListener("click", () => {
        filters.querySelectorAll(".cat-filter").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        activeFilter = btn.getAttribute("data-filter");
        apply();
      });
    });
  }
  if (search) search.addEventListener("input", apply);
  apply();
}

/* ---------- Contact form -> WhatsApp ---------- */
function initContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const nombre   = (data.get("nombre")   || "").toString().trim();
    const telefono = (data.get("telefono") || "").toString().trim();
    const email    = (data.get("email")    || "").toString().trim();
    const servicio = (data.get("servicio") || "").toString().trim();
    const mensaje  = (data.get("mensaje")  || "").toString().trim();

    const lines = [
      "*Nueva solicitud desde el sitio web REPLAE*",
      "",
      `*Nombre:* ${nombre}`,
      `*Teléfono:* ${telefono}`,
      email    ? `*Email:* ${email}` : null,
      servicio ? `*Servicio de interés:* ${servicio}` : null,
      "",
      `*Mensaje:* ${mensaje}`
    ].filter(Boolean);

    window.open(buildWaUrl(lines.join("\n")), "_blank", "noopener");
    form.reset();

    const ok = document.getElementById("formSuccess");
    if (ok) {
      ok.classList.remove("hidden");
      setTimeout(() => ok.classList.add("hidden"), 6000);
    }
  });
}

/* ---------- Lightbox con navegación ---------- */
function initLightbox() {
  const modal = document.getElementById("imgLightbox");
  if (!modal) return;
  const img = document.getElementById("imgLightboxImg");
  const cap = document.getElementById("imgLightboxCaption");
  const btns = Array.from(document.querySelectorAll(".catalog-img"));
  let current = -1;

  const show = (i) => {
    if (i < 0) i = btns.length - 1;
    if (i >= btns.length) i = 0;
    current = i;
    const btn = btns[i];
    const inner = btn.querySelector("img");
    img.setAttribute("src", btn.getAttribute("data-full"));
    const title = inner ? inner.getAttribute("alt") : "";
    img.setAttribute("alt", title || "");
    if (cap) cap.textContent = title || "";
  };
  const open = (i) => {
    show(i);
    modal.classList.remove("hidden");
    modal.classList.add("flex");
    document.body.style.overflow = "hidden";
  };
  const close = () => {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
    img.setAttribute("src", "");
    document.body.style.overflow = "";
  };

  btns.forEach((btn, i) => btn.addEventListener("click", () => open(i)));

  document.getElementById("imgLightboxClose")?.addEventListener("click", close);
  document.getElementById("imgLightboxClose2")?.addEventListener("click", close);
  document.getElementById("imgLightboxPrev")?.addEventListener("click", (e) => { e.stopPropagation(); show(current - 1); });
  document.getElementById("imgLightboxNext")?.addEventListener("click", (e) => { e.stopPropagation(); show(current + 1); });
  modal.addEventListener("click", (e) => { if (e.target === modal) close(); });
  document.addEventListener("keydown", (e) => {
    if (modal.classList.contains("hidden")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") show(current - 1);
    if (e.key === "ArrowRight") show(current + 1);
  });
}

/* ---------- Footer year ---------- */
function setYear() {
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
}
