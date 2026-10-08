(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Nav: background on scroll, mobile toggle, active link */
  const nav = document.querySelector("[data-nav]");
  const toggle = document.querySelector("[data-nav-toggle]");
  const setScrolled = () => nav.classList.toggle("is-scrolled", window.scrollY > 40);
  setScrolled();
  window.addEventListener("scroll", setScrolled, { passive: true });

  const closeMenu = () => {
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  };
  toggle.addEventListener("click", () => {
    const open = !nav.classList.contains("is-open");
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    document.body.style.overflow = open ? "hidden" : "";
  });
  nav.querySelectorAll(".nav__menu a").forEach((a) => a.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeMenu(); });

  const navLinks = [...nav.querySelectorAll('.nav__menu a[href^="#"]')];
  const sectionFor = (id) => document.getElementById(id);
  const workIds = ["werk", "fotografie", "video", "design", "ai", "marketing"];
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      let id = entry.target.id;
      if (workIds.includes(id)) id = "werk";
      navLinks.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === "#" + id));
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  ["over", ...workIds, "social", "opleidingen", "contact"].forEach((id) => sectionFor(id) && spy.observe(sectionFor(id)));

  /* Reveal on scroll */
  const reveals = document.querySelectorAll(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    reveals.forEach((el) => el.classList.add("is-in"));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        io.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    reveals.forEach((el, i) => {
      // Small stagger for siblings that enter together
      const siblings = [...el.parentElement.children].filter((c) => c.classList.contains("reveal"));
      el.style.transitionDelay = `${Math.min(siblings.indexOf(el), 5) * 70}ms`;
      io.observe(el);
    });
  }

  /* Work index: floating image preview that follows the cursor */
  const preview = document.querySelector(".index-preview");
  const previewImg = document.querySelector("[data-preview-img]");
  if (preview && window.matchMedia("(hover: hover)").matches) {
    document.querySelectorAll("[data-preview]").forEach((link) => {
      const pre = new Image();
      pre.src = link.dataset.preview;
      link.addEventListener("mouseenter", () => {
        previewImg.src = link.dataset.preview;
        preview.classList.add("is-visible");
      });
      link.addEventListener("mouseleave", () => preview.classList.remove("is-visible"));
      link.addEventListener("mousemove", (e) => {
        preview.style.left = `${e.clientX + 150}px`;
        preview.style.top = `${e.clientY}px`;
      });
    });
  }

  /* Video players: click to play with sound, only one at a time */
  const players = document.querySelectorAll("[data-player]");
  players.forEach((player) => {
    const video = player.querySelector("video");
    const button = player.querySelector(".player__play");
    button.addEventListener("click", () => {
      players.forEach((p) => {
        const v = p.querySelector("video");
        if (v !== video && !v.paused) v.pause();
      });
      video.controls = true;
      player.classList.add("is-playing");
      video.play();
    });
    video.addEventListener("ended", () => {
      video.controls = false;
      player.classList.remove("is-playing");
      video.load(); // back to the poster
    });
  });

  /* Lightbox for image galleries */
  const box = document.querySelector("[data-lightbox]");
  const boxImg = box.querySelector("[data-lightbox-img]");
  let items = [];
  let index = 0;
  const show = (i) => {
    index = (i + items.length) % items.length;
    const link = items[index];
    boxImg.src = link.getAttribute("href");
    boxImg.alt = link.querySelector("img")?.alt || "";
  };
  document.querySelectorAll("[data-gallery]").forEach((gallery) => {
    const links = [...gallery.querySelectorAll('a[href$=".webp"]')];
    links.forEach((link, i) => {
      link.addEventListener("click", (e) => {
        if (typeof box.showModal !== "function") return; // fall back to opening the image
        e.preventDefault();
        items = links;
        show(i);
        box.showModal();
      });
    });
  });
  box.querySelector("[data-lightbox-close]").addEventListener("click", () => box.close());
  box.querySelector("[data-lightbox-prev]").addEventListener("click", () => show(index - 1));
  box.querySelector("[data-lightbox-next]").addEventListener("click", () => show(index + 1));
  box.addEventListener("click", (e) => { if (e.target === box) box.close(); });
  box.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") show(index - 1);
    if (e.key === "ArrowRight") show(index + 1);
  });
  box.addEventListener("close", () => { boxImg.removeAttribute("src"); });

  const year = document.querySelector("[data-year]");
  if (year) year.textContent = new Date().getFullYear();
})();
