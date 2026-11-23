/* Bahasa: ID (default) atau EN. Pilihan disimpan di localStorage dan dibaca lebih dulu oleh skrip kecil di <head> tiap halaman. */
const LANG = document.documentElement.lang === "en" ? "en" : "id";
const L = (en, id) => (LANG === "en" ? en : id);

/* Kontak per pilar (PIC). Halaman umum (Home, About, Article, dst.) memakai nomor "general".
   Nomor ditulis tanpa 0 di depan, format internasional 62xxxxxxxxxx. */
const CONTACTS = {
  software: { wa: "6281125211333", label: "+62 811-2521-1333", topic: ["software", "software"] },
  training: { wa: "6281392989719", label: "+62 813-9298-9719", topic: ["training", "training"] },
  consulting: { wa: "62811382313", label: "+62 811-382-313", topic: ["consulting", "konsultasi"] },
  groundwater: { wa: "62811382313", label: "+62 811-382-313", topic: ["groundwater", "air tanah"] },
  general: { wa: "6281392989719", label: "+62 813-9298-9719", topic: ["services", "layanan"] }, // Home, About, Article, Privacy, Terms
};
const pillarOf = () => {
  const file = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  if (file.startsWith("software")) return "software";
  if (file.startsWith("training")) return "training";
  if (file.startsWith("groundwater")) return "groundwater";
  if (file.startsWith("consulting") || file.startsWith("portfolio")) return "consulting";
  return "general"; // index, about, article*, privacy, terms
};
const CONTACT = CONTACTS[pillarOf()];
const waLink = (text) => `https://wa.me/${CONTACT.wa}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
const pillarChat = () => {
  const file = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  const own = /^(software|training|consulting|portfolio-details|groundwater)/.test(file);
  if (window.__waProduct) {
    return L(`Hello Lenusa, I would like to learn more about ${window.__waProduct}, including its features, licensing, and pricing. Could you please assist me?`,
      `Halo Lenusa, saya tertarik dengan ${window.__waProduct}. Mohon informasi mengenai fitur, lisensi, dan penawaran harganya.`);
  }
  return own
    ? L(`Hello Lenusa, I would like to ask about ${CONTACT.topic[0]}.`, `Halo Lenusa, saya ingin bertanya tentang ${CONTACT.topic[1]}.`)
    : L("Hello Lenusa, I would like to ask about your services.", "Halo Lenusa, saya ingin bertanya tentang layanan Lenusa.");
};

class SiteHeader extends HTMLElement {
  connectedCallback() {
    const activePage = this.getAttribute("active");
    const main = document.querySelector("main");
    if (main && !main.id) main.id = "main";
    if (main) main.tabIndex = -1; // lets the skip link move focus into the page content
    this.innerHTML = `
      ${main ? `<a class="skip-link" href="#${main.id}">${L("Skip to main content", "Lewati ke konten utama")}</a>` : ""}
      <header class="nav">
        <a class="nav__logo" href="index.html#home">
          <img src="assets/logos/lenusa-logo.png" alt="Lenusa.id" height="30">
        </a>
        <nav class="nav__links" id="nav-links" aria-label="Primary">
          <a class="nav__cta nav__cta--menu" href="index.html#contact">Talk to us</a>
          <a href="index.html#home" ${activePage === "home" ? 'aria-current="page"' : ""}>Home</a>
          <a href="about.html#about" ${activePage === "about" ? 'aria-current="page"' : ""}>About us</a>
          <a href="software.html" ${activePage === "software" ? 'aria-current="page"' : ""}>Software</a>
          <a href="training.html" ${activePage === "training" ? 'aria-current="page"' : ""}>Training</a>
          <a href="consulting.html" ${activePage === "consulting" ? 'aria-current="page"' : ""}>Consulting</a>
          <a href="groundwater.html" ${activePage === "groundwater" ? 'aria-current="page"' : ""}>Groundwater</a>
          <a href="article.html" ${activePage === "article" ? 'aria-current="page"' : ""}>Article</a>
        </nav>
        <div class="nav__actions">
          <div class="lang" role="group" aria-label="Language">
            <button type="button" data-lang="id" aria-pressed="false">ID</button>
            <span aria-hidden="true">/</span>
            <button type="button" data-lang="en" aria-pressed="true">EN</button>
          </div>
          <a class="nav__cta" href="index.html#contact">Talk to us</a>
          <button type="button" class="nav__toggle" aria-expanded="false" aria-controls="nav-links" aria-label="${L("Open menu", "Buka menu")}">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path class="nav__toggle-open" d="M4 7h16M4 12h16M4 17h16"/><path class="nav__toggle-close" d="M6 6l12 12M18 6L6 18"/></svg>
          </button>
        </div>
      </header>
    `;

    /* hamburger (1100px ke bawah): buka/tutup dropdown; Esc, ketuk di luar, atau pilih link menutupnya */
    const nav = this.querySelector(".nav");
    const toggle = this.querySelector(".nav__toggle");
    const setOpen = (open, focus) => {
      nav.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? L("Close menu", "Tutup menu") : L("Open menu", "Buka menu"));
      if (!open && focus) toggle.focus();
    };
    toggle.addEventListener("click", (e) => {
      const open = !nav.classList.contains("is-open");
      setOpen(open);
      /* opened from the keyboard (Enter/Space give detail 0): the menu links sit before the toggle in the DOM,
         so move focus into the menu instead of letting Tab continue into the page */
      if (open && e.detail === 0) [...nav.querySelectorAll(".nav__links a")].find((a) => a.offsetParent !== null)?.focus();
    });
    nav.querySelectorAll(".nav__links a").forEach((a) => a.addEventListener("click", () => {
      setOpen(false);
    }));
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && nav.classList.contains("is-open")) setOpen(false, true); });
    document.addEventListener("click", (e) => { if (nav.classList.contains("is-open") && !nav.contains(e.target)) setOpen(false); });
    matchMedia("(min-width: 1181px)").addEventListener("change", (e) => { if (e.matches) setOpen(false); });

    /* Auto-hide navbar: scroll turun menyembunyikan bar, scroll naik memunculkannya lagi.
       Selalu terlihat di dekat puncak halaman, saat menu hamburger terbuka, dan saat fokus keyboard ada di dalam bar (CSS). */
    const HIDE_AFTER = 80; // px dari puncak halaman sebelum bar boleh bersembunyi
    const DELTA = 8; // gerakan scroll minimum (px) supaya getaran kecil tidak memicu apa pun
    let lastY = Math.max(0, window.scrollY);
    let ticking = false;
    const syncHidden = () => {
      ticking = false;
      const y = Math.max(0, window.scrollY); // iOS rubber-band bisa memberi nilai negatif
      const diff = y - lastY;
      if (y <= HIDE_AFTER || nav.classList.contains("is-open")) {
        nav.classList.remove("is-hidden");
        lastY = y;
      } else if (Math.abs(diff) >= DELTA) {
        nav.classList.toggle("is-hidden", diff > 0);
        lastY = y;
      }
    };
    window.addEventListener("scroll", () => {
      if (!ticking) { ticking = true; requestAnimationFrame(syncHidden); }
    }, { passive: true });
    syncHidden();
  }
}

class SiteActions extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <nav class="floating-actions" aria-label="Contact">
        <a class="floating-action floating-whatsapp" href="${waLink(pillarChat())}"
          target="_blank" rel="noopener noreferrer" aria-label="Contact us on WhatsApp">
          <img src="assets/icons/social/whatsapp.png" alt="">
        </a>
      </nav>
      <button type="button" class="scroll-top" aria-label="${L("Back to top", "Kembali ke atas")}">
        <svg class="scroll-top__ring" viewBox="0 0 40 40" aria-hidden="true" focusable="false">
          <circle class="scroll-top__track" cx="20" cy="20" r="18"></circle>
          <circle class="scroll-top__bar" cx="20" cy="20" r="18"></circle>
        </svg>
        <svg class="scroll-top__arrow" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M12 19V5M5 12l7-7 7 7"></path>
        </svg>
      </button>
    `;

    /* di mobile tombol memudar saat footer terlihat (CSS hanya memakainya di 600px ke bawah) */
    const footer = document.querySelector(".site-footer .footer-end");
    const box = this.querySelector(".floating-actions");
    const top = this.querySelector(".scroll-top");
    if (footer && "IntersectionObserver" in window) {
      new IntersectionObserver(([entry]) => {
        box.classList.toggle("is-over-footer", entry.isIntersecting);
        top.classList.toggle("is-over-footer", entry.isIntersecting);
      }).observe(footer);
    }

    /* Scroll-to-top dengan cincin progres: cincin terisi sesuai seberapa jauh halaman sudah digulir; penuh = sudah sampai akhir halaman */
    const bar = top.querySelector(".scroll-top__bar");
    const CIRC = 2 * Math.PI * 18;
    bar.style.strokeDasharray = String(CIRC);
    let ticking = false;
    let lastPct = -1;
    const update = () => {
      ticking = false;
      const root = document.documentElement;
      const max = root.scrollHeight - window.innerHeight;
      const y = Math.max(0, window.scrollY);
      const p = max > 0 ? Math.min(1, y / max) : 0;
      bar.style.strokeDashoffset = String(CIRC * (1 - p));
      top.classList.toggle("is-visible", y > 240);
      top.classList.toggle("is-complete", max > 0 && p >= 0.995);
      const pct = Math.round(p * 100);
      if (pct !== lastPct) {
        lastPct = pct;
        top.setAttribute("aria-label", `${L("Back to top", "Kembali ke atas")} (${pct}%)`);
      }
    };
    const queue = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", queue, { passive: true });
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)");
    top.addEventListener("click", () => window.scrollTo({ top: 0, behavior: calm.matches ? "auto" : "smooth" }));
    update();
  }
}

/* Footer, shared by every page: <site-footer></site-footer>.
   It holds the closing CTA (contact details + enquiry form), the legal links and the copyright line, all on one background.
   The form posts to LENUSA_FORM.endpoint as JSON { name, company, service, message }.
   Today the endpoint is FormSubmit (no backend needed; the first submission sends an activation email to the address
   in the URL). For WordPress, point `endpoint` to a REST route or admin-ajax action whose handler calls wp_mail();
   nothing else in this file changes.
   MANUAL STEP (security): FormSubmit emails a random alias string after the address is confirmed. Put that string in
   FORMSUBMIT_ID instead of the address, so the inbox is not exposed in this public file. See SECURITY-REMEDIATION-REPORT.md. */
const FORMSUBMIT_ID = "info@lenusa.id";
const LENUSA_FORM = {
  endpoint: `https://formsubmit.co/ajax/${FORMSUBMIT_ID}`,
  services: ["Consulting", "Software", "Groundwater", "Training"],
};

class SiteFooter extends HTMLElement {
  connectedCallback() {
    const options = LENUSA_FORM.services.map((s) => `<option value="${s}">${s}</option>`).join("");
    this.innerHTML = `
      <footer id="contact" class="site-footer contact-cta" aria-labelledby="contact-cta-title">
        <div class="contact-cta__in">
          <div class="cta-col cta-info">
            <h2 id="contact-cta-title">Ready For Better <span>Mining Solution?</span></h2>
            <p class="contact-cta__description">We don’t manage risk on paper. We solve it on the slope. If that’s what you value, let’s talk.</p>
            <h3 class="cta-sub">Find Us On Social Media:</h3>
            <p class="cta-social">
              <a class="cta-icon" href="https://www.instagram.com/lenusa.consulting/" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><img src="assets/icons/social/instagram.svg" alt="" width="40" height="40"></a>
              <a class="cta-icon" href="https://www.linkedin.com/company/lenusaconsulting/posts/?feedView=all" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><img src="assets/icons/social/linkedin.svg" alt="" width="40" height="40"></a>
              <a class="cta-icon" href="https://www.facebook.com/lenusa.consulting/" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><img src="assets/icons/social/facebook.svg" alt="" width="40" height="40"></a>
              <a class="cta-icon" href="https://www.youtube.com/@lenusaid" target="_blank" rel="noopener noreferrer" aria-label="YouTube"><img src="assets/icons/social/youtube.svg" alt="" width="40" height="40"></a>
            </p>
            <h3 class="cta-sub">Our Contacts:</h3>
            <div class="cta-contacts">
              <p>${L("Phone", "Telepon")} : <a href="tel:+${CONTACT.wa}">${CONTACT.label}</a></p>
              <p>WhatsApp : <a href="${waLink()}" target="_blank" rel="noopener noreferrer">${CONTACT.label}</a></p>
              <p>Email : <a href="mailto:info@lenusa.id">info@lenusa.id</a></p>
              <address class="cta-address">${L("Address", "Alamat")} : Jimbaran Hub - Loft, Jl. Karang Mas No.2D, Jimbaran, Kec. Kuta Sel., Kabupaten Badung, Bali 80361</address>
            </div>
          </div>
          <form class="cta-col cta-form" novalidate>
            <h3 class="cta-form__title">Let’s Discuss Your Project:</h3>
            <div class="cta-field">
              <label for="cta-name">Name:</label>
              <input id="cta-name" name="name" type="text" placeholder="Your Name" autocomplete="name" maxlength="100" required aria-required="true" aria-describedby="cta-name-err">
              <p class="cta-err" id="cta-name-err"></p>
            </div>
            <div class="cta-field">
              <label for="cta-company">Company or Institution:</label>
              <input id="cta-company" name="company" type="text" placeholder="Institution Name" autocomplete="organization" maxlength="100" required aria-required="true" aria-describedby="cta-company-err">
              <p class="cta-err" id="cta-company-err"></p>
            </div>
            <div class="cta-field">
              <label for="cta-email">Email:</label>
              <input id="cta-email" name="email" type="email" inputmode="email" placeholder="${L("Your Email", "Email Anda")}" autocomplete="email" maxlength="254" required aria-required="true" aria-describedby="cta-email-err">
              <p class="cta-err" id="cta-email-err"></p>
            </div>
            <div class="cta-field cta-field--select">
              <label class="ar-sr" for="cta-service">Service</label>
              <select id="cta-service" name="service" required aria-required="true" aria-describedby="cta-service-err">
                <option value="" selected disabled>Select a service</option>
                ${options}
              </select>
              <p class="cta-err" id="cta-service-err"></p>
            </div>
            <div class="cta-field">
              <label for="cta-message">Message</label>
              <textarea id="cta-message" name="message" rows="1" placeholder="Start Typing" maxlength="5000" required aria-required="true" aria-describedby="cta-message-err"></textarea>
              <p class="cta-err" id="cta-message-err"></p>
            </div>
            <input class="cta-hp" type="text" name="_honey" tabindex="-1" autocomplete="off" aria-hidden="true">
            <button type="submit" class="wipe-button cta-send" aria-describedby="cta-hint">Send</button>
            <p id="cta-hint" class="cta-hint">All fields are required to send.</p>
            <p class="cta-status" role="status" aria-live="polite"></p>
          </form>
        </div>
        <div class="footer-end">
          <div class="footer-bottom">
            <a class="footer-brand" href="index.html#home" aria-label="Lenusa.id">
              <img src="assets/logos/lenusa-logo-white.png" alt="" height="30">
              <span class="footer-company">PT. LENUSA KONSULTAN INDONESIA</span>
            </a>
            <nav class="footer-legal" aria-label="${L("Legal", "Legal")}">
              <a href="terms.html">${L("Terms", "Syarat")}</a>
              <span aria-hidden="true">|</span>
              <a href="privacy.html">${L("Privacy", "Privasi")}</a>
            </nav>
          </div>
          <div class="footer-watermark">
            <p>© 2026 PT Lenusa Konsultan Indonesia. ${L("All Rights Reserved.", "Seluruh hak dilindungi.")}</p>
            <p>${L("Website Design & Development by", "Desain & Pengembangan Website oleh")} Rizal Jamalul Lail</p>
          </div>
        </div>
      </footer>`;

    const form = this.querySelector(".cta-form");
    const send = form.querySelector(".cta-send");
    const status = form.querySelector(".cta-status");
    const [fName, fCompany, fEmail, fService, fMessage] = ["name", "company", "email", "service", "message"].map((k) => form.querySelector(`#cta-${k}`));
    const fields = [fName, fCompany, fEmail, fService, fMessage];
    const area = fMessage;
    let busy = false;

    const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    const errorOf = (f) => {
      const v = f.value.trim();
      if (!v) return f === fService ? L("Please choose a service.", "Pilih salah satu layanan.") : f === fEmail ? L("Please enter your email address.", "Masukkan alamat email Anda.") : L("This field is required.", "Kolom ini wajib diisi.");
      if (f === fEmail && !EMAIL_RE.test(v)) return L("Enter a valid email address, for example name@company.com.", "Masukkan alamat email yang valid, misalnya nama@perusahaan.com.");
      return "";
    };
    const showError = (f, text) => {
      f.setAttribute("aria-invalid", text ? "true" : "false");
      form.querySelector(`#${f.id}-err`).textContent = text;
    };
    const grow = () => { area.style.height = "auto"; area.style.height = `${area.scrollHeight}px`; };
    fields.forEach((f) => f.addEventListener(f === fService ? "change" : "input", () => {
      if (f.getAttribute("aria-invalid") === "true") showError(f, errorOf(f));
      if (f === area) grow();
      status.textContent = ""; status.className = "cta-status";
    }));

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (busy || form.querySelector(".cta-hp").value) return;
      const bad = fields.filter((f) => { const m = errorOf(f); showError(f, m); return m; });
      if (bad.length) { bad[0].focus(); return; }
      busy = true;
      send.disabled = true;
      form.setAttribute("aria-busy", "true");
      send.textContent = L("Sending…", "Mengirim…");
      status.className = "cta-status";
      status.textContent = "";
      const name = fName.value.trim();
      const data = {
        name,
        company: fCompany.value.trim(),
        email: fEmail.value.trim(), // FormSubmit uses the "email" field as the reply-to address
        service: fService.value,
        message: fMessage.value.trim(),
        _subject: `Website inquiry: ${fService.value} (${name.replace(/[\r\n]+/g, " ").slice(0, 60)})`,
        _template: "table",
        _captcha: "false",
        _honey: form.querySelector(".cta-hp").value, // FormSubmit drops submissions where this is filled
      };
      const ctl = new AbortController();
      const timer = setTimeout(() => ctl.abort(), 15000); // a stalled connection becomes the normal error message
      try {
        const res = await fetch(LENUSA_FORM.endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(data),
          signal: ctl.signal,
        });
        const out = await res.json().catch(() => ({}));
        // only FormSubmit's explicit confirmation counts; an HTML page or empty body with HTTP 200 is a failure
        if (!res.ok || !(out.success === true || out.success === "true")) throw new Error("send failed");
        form.reset();
        grow();
        status.className = "cta-status is-ok";
        status.textContent = L("Thank you. Your message has been sent and we will reply soon.", "Terima kasih. Pesan Anda sudah terkirim dan kami akan segera membalas.");
      } catch (err) {
        status.className = "cta-status is-error";
        status.innerHTML = L(
          `Your message could not be sent. Please try again or <a href="https://wa.me/${CONTACT.wa}" target="_blank" rel="noopener noreferrer">contact us on WhatsApp</a>.`,
          `Pesan belum terkirim. Silakan coba lagi atau <a href="https://wa.me/${CONTACT.wa}" target="_blank" rel="noopener noreferrer">hubungi kami lewat WhatsApp</a>.`
        );
      } finally {
        clearTimeout(timer);
        busy = false;
        send.disabled = false;
        form.removeAttribute("aria-busy");
        send.textContent = L("Send", "Kirim");
      }
    });
  }
}

customElements.define("site-header", SiteHeader);
customElements.define("site-footer", SiteFooter);
customElements.define("site-actions", SiteActions);

/* Hover pop sound on every page. Browsers block audio until the first click or key press,
   so the AudioContext is created then; hovering before that stays silent. */
(() => {
  const SRC = "assets/audio/ui-click.mp3";
  const TARGETS = ".hero-card, .wipe-button, .footer-legal a, .pillars .pillar-card";
  let ctx, buffer, fallback;

  function unlock() {
    if (ctx) return;
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    fetch(SRC)
      .then((r) => r.arrayBuffer())
      .then((data) => ctx.decodeAudioData(data))
      .then((decoded) => { buffer = decoded; })
      .catch(() => { fallback = new Audio(SRC); }); // e.g. page opened from file://
  }
  document.addEventListener("pointerdown", unlock, { once: true });
  document.addEventListener("keydown", unlock, { once: true });

  document.addEventListener("pointerover", (event) => {
    if (event.pointerType === "touch") return;
    const target = event.target.closest?.(TARGETS);
    if (!target || target.contains(event.relatedTarget)) return;
    if (buffer) {
      if (ctx.state === "suspended") ctx.resume();
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.start();
    } else if (fallback) {
      fallback.currentTime = 0;
      fallback.play().catch(() => {});
    }
  });
})();

/* ---------- Bahasa ID / EN ----------
   Teks di halaman dicocokkan dengan pasangan [EN, ID] di bawah, lalu diganti ke bahasa yang dipilih. Teks yang dibuat
   JavaScript ikut diterjemahkan lewat MutationObserver. Tanda {0}, {1} adalah bagian yang berubah (nama, angka).
   Data (artikel, produk software, training) tidak diterjemahkan. Tombol ID/EN menyimpan pilihan lalu memuat ulang halaman. */
const I18N_PAIRS = [
  ["Primary", "Navigasi utama"],
  ["Find Us On Social Media:", "Temukan Kami di Media Sosial:"],
  ["Our Contacts:", "Kontak Kami:"],
  ["Let’s Discuss Your Project:", "Mari Diskusikan Proyek Anda:"],
  ["Name:", "Nama:"],
  ["Company or Institution:", "Perusahaan atau Institusi:"],
  ["Your Name", "Nama Anda"],
  ["Institution Name", "Nama Institusi"],
  ["Service", "Layanan"],
  ["Select a service", "Pilih layanan"],
  ["Message", "Pesan"],
  ["Start Typing", "Mulai mengetik"],
  ["Send", "Kirim"],
  ["All fields are required to send.", "Semua kolom wajib diisi agar bisa dikirim."],
  ["Other Book:", "Buku lainnya:"],
  ["Ask a question!", "Ajukan pertanyaan!"],
  ["Close", "Tutup"],
  ["Training Date:", "Tanggal Pelatihan:"],
  ["Download Event Calendar", "Unduh Kalender Event"],
  ["See More", "Lebih Lengkap"],
  ["Previous trainings", "Pelatihan sebelumnya"],
  ["Next trainings", "Pelatihan berikutnya"],
  ["Stay informed about upcoming events, professional training sessions, industry activities, and other important events hosted or attended by Lenusa. Discover opportunities to expand your knowledge, connect with industry professionals, and stay updated on the latest developments in mining.", "Ikuti kabar Event mendatang, sesi pelatihan profesional, kegiatan industri, dan Event penting lain yang diselenggarakan atau dihadiri Lenusa. Temukan peluang untuk memperluas pengetahuan, terhubung dengan para profesional industri, dan mengikuti perkembangan terbaru di dunia pertambangan."],
  ["Home", "Beranda"],
  ["About us", "Tentang Kami"],
  ["Software", "Perangkat Lunak"],
  ["Groundwater", "Air Tanah"],
  ["Training", "Pelatihan"],
  ["Consulting", "Konsultasi"],
  ["Article", "Artikel"],
  ["Language", "Bahasa"],
  ["Talk to us", "Hubungi Kami"],
  ["Mining Expertise for Better Operational Decisions", "Keahlian Pertambangan untuk Keputusan Operasional yang Lebih Baik"],
  ["Lenusa delivers technical consulting, groundwater services, professional training, and software solutions to support informed decisions and reliable mining operations.", "Lenusa menghadirkan konsultasi teknis, layanan air tanah, pelatihan profesional, dan solusi perangkat lunak untuk mendukung keputusan yang tepat dan operasi tambang yang andal."],
  ["Explore Our Services", "Jelajahi Layanan Kami"],
  ["Lenusa services", "Layanan Lenusa"],
  ["Our Core Services", "Layanan Utama Kami"],
  ["Lenusa supports the mining and related industries through four key service areas: consulting, groundwater services, professional training, and software solutions.", "Lenusa mendukung industri pertambangan dan industri terkait melalui empat bidang layanan utama: konsultasi, layanan air tanah, pelatihan profesional, dan solusi perangkat lunak."],
  ["Penawaran Lenusa", "What Lenusa offers"],
  ["Lenusa provides specialized software solutions designed to support mining and engineering activities. Our software portfolio covers geotechnical, groundwater, geological, and geophysical applications, helping professionals manage technical data, perform analyses, and support informed engineering decisions.", "Lenusa menyediakan solusi perangkat lunak khusus untuk mendukung kegiatan pertambangan dan rekayasa. Portofolio perangkat lunak kami mencakup aplikasi geoteknik, air tanah, geologi, dan geofisika, sehingga para profesional dapat mengelola data teknis, melakukan analisis, dan mengambil keputusan rekayasa yang tepat."],
  ["View Software Solutions!", "Lihat Solusi Perangkat Lunak!"],
  ["Lenusa provides groundwater consulting services to support responsible water resource management and regulatory compliance. Our services include technical assessments, groundwater documentation, and assistance with permitting requirements to help businesses manage groundwater resources effectively and meet applicable regulations.", "Lenusa menyediakan layanan konsultasi air tanah untuk mendukung pengelolaan sumber daya air yang bertanggung jawab dan kepatuhan terhadap regulasi. Layanan kami meliputi kajian teknis, dokumentasi air tanah, dan pendampingan pengurusan perizinan, agar bisnis dapat mengelola air tanah secara efektif dan memenuhi regulasi yang berlaku."],
  ["View Groundwater Services!", "Lihat Layanan Air Tanah!"],
  ["Lenusa delivers professional training programs designed to enhance technical knowledge and practical competencies across the mining industry. Our programs cover various industry-related disciplines, providing participants with relevant insights, technical understanding, and practical knowledge to support their professional development.", "Lenusa menyelenggarakan program pelatihan profesional untuk meningkatkan pengetahuan teknis dan kompetensi praktis di industri pertambangan. Program kami mencakup berbagai disiplin yang berkaitan dengan industri, dan memberi peserta wawasan yang relevan, pemahaman teknis, serta pengetahuan praktis untuk mendukung pengembangan profesional mereka."],
  ["View Training Programs!", "Lihat Program Pelatihan!"],
  ["Lenusa offers specialized mining consultancy services backed by engineering expertise and technical assessments. Our capabilities include geotechnical engineering, slope stability analysis, mine design, and hydrogeological studies, providing practical recommendations to address operational challenges and support safer, more reliable mining activities.", "Lenusa menawarkan jasa konsultasi pertambangan khusus yang didukung keahlian rekayasa dan kajian teknis. Kemampuan kami mencakup rekayasa geoteknik, analisis kestabilan lereng, desain tambang, dan kajian hidrogeologi, dengan rekomendasi praktis untuk menjawab tantangan operasional dan mendukung kegiatan tambang yang lebih aman dan andal."],
  ["View Consulting Services!", "Lihat Layanan Konsultasi!"],
  ["Lenusa's mining company partners", "Mitra perusahaan pertambangan Lenusa"],
  ["Trusted by 100+ Mining Company all across Indonesia", "Dipercaya oleh 100+ perusahaan pertambangan di seluruh Indonesia"],
  ["Training categories", "Kategori pelatihan"],
  ["Training & Certification", "Diklat Sertifikasi"],
  ["Lenusa’s Event Calendar", "Kalender Event Lenusa"],
  ["Quarter", "Quartal"],
  ["Quarter 1", "Quartal 1"],
  ["Quarter 2", "Quartal 2"],
  ["Quarter 3", "Quartal 3"],
  ["Quarter 4", "Quartal 4"],
  ["Reset", "Kembali"],
  ["Previous training", "Pelatihan sebelumnya"],
  ["Next training", "Pelatihan berikutnya"],
  ["Training days calendar", "Kalender hari pelatihan"],
  ["Training days", "Hari pelatihan"],
  ["Digital brochure", "Brosur Digital"],
  ["Lenusa 2027 Booklet", "Booklet Lenusa 2027"],
  ["Explore Lenusa's 2027 training catalogue, featuring a range of professional development programmes designed for the mining industry. Discover specialized training topics, technical learning opportunities, and industry-relevant programmes developed to strengthen professional knowledge, enhance practical competencies, and support workforce development across various mining disciplines.", "Jelajahi katalog pelatihan 2027 dari Lenusa, yang memuat berbagai program pengembangan profesional untuk industri pertambangan. Temukan topik pelatihan khusus, peluang belajar teknis, dan program yang relevan dengan industri, yang disusun untuk memperkuat pengetahuan profesional, meningkatkan kompetensi praktis, dan mendukung pengembangan tenaga kerja di berbagai disiplin pertambangan."],
  ["Schedule and scheme details for the 2027 Diklat and BNSP certification programmes.", "Jadwal dan skema program Diklat serta sertifikasi BNSP untuk tahun 2027."],
  ["Our 2027 public training catalogue, covering the programmes most in demand across mining.", "Katalog pelatihan publik 2027 kami, berisi program yang paling dibutuhkan industri pertambangan."],
  ["The 2026 Diklat and certification booklet, kept as a reference for earlier programmes and schedules.", "Booklet Diklat dan sertifikasi 2026, disimpan sebagai acuan program dan jadwal sebelumnya."],
  ["Previous booklet", "Booklet sebelumnya"],
  ["Next booklet", "Booklet berikutnya"],
  ["Booklets", "Booklet"],
  ["Download Booklet", "Unduh Booklet"],
  ["Get In Touch With Us", "Terhubung dengan Kami"],
  ["Ready For Better <span>Mining Solution?</span>", "Siap untuk <span>Solusi Pertambangan yang Lebih Baik?</span>"],
  ["We don’t manage risk on paper. We solve it on the slope. If that’s what you value, let’s talk.", "Kami tidak mengelola risiko di atas kertas. Kami menyelesaikannya langsung di lapangan. Jika itu yang Anda hargai, mari berbincang."],
  ["Start Consulting", "Mulai Konsultasi"],
  ["<strong>Address</strong> Jimbaran Hub - Loft, Jl. Karang Mas No.2D, Jimbaran, Kec. Kuta Sel., Kabupaten Badung, Bali 80361", "<strong>Alamat</strong> Jimbaran Hub - Loft, Jl. Karang Mas No.2D, Jimbaran, Kec. Kuta Sel., Kabupaten Badung, Bali 80361"],
  ["Social media", "Media sosial"],
  ["Quick links", "Tautan cepat"],
  ["Quick Link", "Tautan Cepat"],
  ["Contacts", "Kontak"],
  ["Copyright Lenusa Consultant @2026 <span aria-hidden=\"true\">|</span> All Rights Reserved.", "Hak Cipta Lenusa Consultant @2026 <span aria-hidden=\"true\">|</span> Seluruh Hak Dilindungi."],
  ["Terms and Conditions", "Syarat & Ketentuan"],
  ["Privacy Policy", "Kebijakan Privasi"],
  ["Contact", "Kontak"],
  ["Contact us on WhatsApp", "Hubungi kami melalui WhatsApp"],
  ["Lenusa.id | Mining Consulting for Smarter Decisions", "Lenusa.id | Konsultasi Pertambangan untuk Keputusan Lebih Baik"],
  ["ABOUT <span>US</span>", "TENTANG <span>KAMI</span>"],
  ["PT Lenusa Konsultan Indonesia provides specialized consulting, professional training, and software solutions in geotechnical and hydrogeological engineering. We support the mining industry through technical expertise and practical solutions tailored to operational requirements.", "PT Lenusa Konsultan Indonesia menyediakan konsultasi, pelatihan profesional, dan solusi perangkat lunak khusus di bidang rekayasa geoteknik dan hidrogeologi. Kami mendukung industri pertambangan melalui keahlian teknis dan solusi praktis yang disesuaikan dengan kebutuhan operasional."],
  ["Our Background", "Latar Belakang Kami"],
  ["PT Lenusa Konsultan Indonesia operates across three key areas of the mining industry: geotechnical and hydrogeological consulting, professional training, and specialized software solutions. Through these areas, we provide technical expertise, develop professional competencies, and support the application of engineering technologies to address industry requirements. Our work focuses on delivering practical knowledge and technical solutions that contribute to more effective and reliable mining operations.", "PT Lenusa Konsultan Indonesia bergerak di tiga bidang utama industri pertambangan: konsultasi geoteknik dan hidrogeologi, pelatihan profesional, dan solusi perangkat lunak khusus. Melalui ketiga bidang ini, kami menyediakan keahlian teknis, mengembangkan kompetensi profesional, dan mendukung penerapan teknologi rekayasa untuk memenuhi kebutuhan industri. Pekerjaan kami berfokus pada pengetahuan praktis dan solusi teknis yang berkontribusi pada operasi tambang yang lebih efektif dan andal."],
  ["9 Years", "9 Tahun"],
  ["Since 2017", "Sejak 2017"],
  ["5 Years", "5 Tahun"],
  ["Since 2021", "Sejak 2021"],
  ["12 Years", "12 Tahun"],
  ["Since 2014", "Sejak 2014"],
  ["Vision & Mission", "Visi & Misi"],
  ["Our vision and mission guide our commitment to delivering reliable technical services, developing professional capabilities, and supporting the evolving needs of the mining industry.", "Visi dan misi kami menjadi pedoman komitmen kami dalam menyediakan layanan teknis yang andal, mengembangkan kemampuan profesional, dan mendukung kebutuhan industri pertambangan yang terus berkembang."],
  ["Our Vision", "Visi Kami"],
  ["To become a trusted provider of geotechnical and hydrogeological consulting, professional training, and specialized software solutions within the mining industry. Through technical expertise, continuous improvement, and technological advancement, we strive to support safer, more efficient, and sustainable mining operations while creating long-term value for our clients and industry partners.", "Menjadi penyedia konsultasi geoteknik dan hidrogeologi, pelatihan profesional, dan solusi perangkat lunak khusus yang tepercaya di industri pertambangan. Melalui keahlian teknis, perbaikan berkelanjutan, dan kemajuan teknologi, kami berupaya mendukung operasi tambang yang lebih aman, lebih efisien, dan berkelanjutan, sekaligus menciptakan nilai jangka panjang bagi klien dan mitra industri kami."],
  ["Our Mission", "Misi Kami"],
  ["Deliver tailored, innovative solutions to address the unique challenges of mining operations.", "Menyediakan solusi inovatif yang disesuaikan untuk menjawab tantangan unik operasi pertambangan."],
  ["Enhance mining productivity and safety through expert consulting, training, and project services.", "Meningkatkan produktivitas dan keselamatan tambang melalui layanan konsultasi, pelatihan, dan proyek yang berbasis keahlian."],
  ["Foster long-term partnerships by exceeding client expectations with professionalism and excellence.", "Membangun kemitraan jangka panjang dengan melampaui harapan klien secara profesional dan unggul."],
  ["Commit to sustainability by integrating environmental considerations into every solution we offer.", "Berkomitmen pada keberlanjutan dengan memasukkan pertimbangan lingkungan ke dalam setiap solusi yang kami tawarkan."],
  ["Empower the mining workforce with world-class training programs designed to elevate technical skills and expertise.", "Memberdayakan tenaga kerja pertambangan melalui program pelatihan berkelas dunia untuk meningkatkan keterampilan dan keahlian teknis."],
  ["We are Licensed!", "Kami Berlisensi!"],
  ["As a trusted technical partner across mining, infrastructure, and regulatory consulting, Lenusa operates under full legal compliance, ensuring professionalism and reliability in every project. Our licenses reflect our commitment to delivering industry-leading solutions that meet the highest regulatory standards.", "Sebagai mitra teknis tepercaya di bidang pertambangan, infrastruktur, dan konsultasi regulasi, Lenusa beroperasi dengan kepatuhan hukum penuh, menjaga profesionalisme dan keandalan di setiap proyek. Lisensi kami mencerminkan komitmen kami menghadirkan solusi terdepan di industri yang memenuhi standar regulasi tinggi."],
  ["License Detail:", "Detail Lisensi:"],
  ["Mining Services Business License (IUJP) No. 07082300978270001 Classification: Supporting activities for mining and quarrying (KBLI 09900) Issued By: Ministry of Investment / BKPM", "Izin Usaha Jasa Pertambangan (IUJP) No. 07082300978270001 Klasifikasi: Kegiatan penunjang pertambangan dan penggalian (KBLI 09900) Diterbitkan oleh: Kementerian Investasi / BKPM"],
  ["Additional Business Classifications (KBLI)", "Klasifikasi Usaha Tambahan (KBLI)"],
  ["Technical Certification Services (KBLI 71201), covering geotechnical monitoring and technical certification", "Jasa Sertifikasi Teknis (KBLI 71201), mencakup pemantauan geoteknik dan sertifikasi teknis"],
  ["Technical Consulting Services (KBLI 71102), covering groundwater and technical consulting", "Jasa Konsultasi Teknis (KBLI 71102), mencakup air tanah dan konsultasi teknis"],
  ["Meet <strong>The Minds Behind Lenusa.</strong>", "Kenali <strong>Para Pemikir di Balik Lenusa.</strong>"],
  ["Behind Lenusa's services is a team of dedicated professionals with expertise in geotechnical engineering, hydrogeology, mining consultancy, and other supporting disciplines. Through collaboration, technical knowledge, and practical experience, our team works together to deliver reliable solutions and maintain the quality of our services.", "Di balik layanan Lenusa ada tim profesional berdedikasi dengan keahlian di bidang rekayasa geoteknik, hidrogeologi, konsultasi pertambangan, dan disiplin pendukung lainnya. Melalui kolaborasi, pengetahuan teknis, dan pengalaman praktis, tim kami bekerja bersama untuk menghadirkan solusi yang andal dan menjaga mutu layanan kami."],
  ["Team members", "Anggota tim"],
  ["Placeholder name", "Nama placeholder"],
  ["Position", "Jabatan"],
  ["Previous team members", "Anggota tim sebelumnya"],
  ["Next team members", "Anggota tim berikutnya"],
  ["About Us | Lenusa.id", "Tentang Kami | Lenusa.id"],
  ["Geotechnical & Hydrogeological Mining Services", "Layanan Pertambangan Geoteknik & Hidrogeologi"],
  ["Lenusa provides a comprehensive range of geotechnical and hydrogeological services specifically tailored for mining operations. With a deep understanding of mining complexities and challenges, our team delivers precise, innovative, and practical solutions to ensure operational safety, efficiency, and sustainability. Whether for open-pit, underground mining, or mining infrastructure, our expertise helps you achieve optimal results.", "Lenusa menyediakan berbagai layanan geoteknik dan hidrogeologi yang dirancang khusus untuk operasi pertambangan. Dengan pemahaman mendalam tentang kompleksitas dan tantangan pertambangan, tim kami menghadirkan solusi yang tepat, inovatif, dan praktis untuk menjaga keselamatan, efisiensi, dan keberlanjutan operasi. Baik untuk tambang terbuka, tambang bawah tanah, maupun infrastruktur tambang, keahlian kami membantu Anda mencapai hasil yang optimal."],
  ["Geotechnical Mining Services", "Layanan Geoteknik Tambang"],
  ["Hydrological & Hydrogeological Mining Services", "Layanan Hidrologi & Hidrogeologi Tambang"],
  ["Rock Mass Scanning", "Pemindaian Massa Batuan"],
  ["Our Projects Spread Through All Around Indonesia", "Proyek Kami Tersebar di Seluruh Indonesia"],
  ["As an expert in hydrology and hydrogeology consulting, Lenusa assisted CKP in conducting a detailed study using field investigations and numerical modeling. Our approach included:", "Sebagai ahli konsultasi hidrologi dan hidrogeologi, Lenusa membantu CKP melakukan kajian rinci dengan investigasi lapangan dan pemodelan numerik. Pendekatan kami meliputi:"],
  ["County", "Kabupaten"],
  ["Province", "Provinsi"],
  ["Participant", "Peserta"],
  ["Scheme", "Skema"],
  ["Pass Rate", "Tingkat Kelulusan"],
  ["Click for more information", "Klik untuk informasi selengkapnya"],
  ["Our geotechnical services provide comprehensive engineering solutions to ensure slope stability, optimize mine designs, and enhance operational safety. Combining technical expertise with advanced engineering analysis, we offer:", "Layanan geoteknik kami menyediakan solusi rekayasa menyeluruh untuk menjaga kestabilan lereng, mengoptimalkan desain tambang, dan meningkatkan keselamatan operasional. Dengan memadukan keahlian teknis dan analisis rekayasa tingkat lanjut, kami menawarkan:"],
  ["Third-Party Peer Review: Independent evaluation of geotechnical studies and engineering designs to ensure technical accuracy, reliability, and compliance with industry standards.", "Peer Review Pihak Ketiga: Evaluasi independen atas kajian geoteknik dan desain rekayasa untuk memastikan akurasi teknis, keandalan, dan kepatuhan pada standar industri."],
  ["Back Analysis (Landslide Evaluation): In-depth investigation and analysis of slope failures to identify contributing factors and develop effective mitigation strategies.", "Back Analysis (Evaluasi Longsor): Investigasi dan analisis mendalam atas kegagalan lereng untuk mengidentifikasi faktor penyebab dan menyusun strategi mitigasi yang efektif."],
  ["Open-Pit & Dump Stability Studies: Comprehensive stability assessments and engineering recommendations to support safe and reliable mining operations.", "Kajian Kestabilan Tambang Terbuka & Timbunan: Penilaian kestabilan menyeluruh dan rekomendasi rekayasa untuk mendukung operasi tambang yang aman dan andal."],
  ["2D & 3D Slope and Dump Design: Advanced numerical modeling and engineering design to optimize slope configurations, dump layouts, and overall mine planning.", "Desain Lereng dan Timbunan 2D & 3D: Pemodelan numerik dan desain rekayasa tingkat lanjut untuk mengoptimalkan konfigurasi lereng, tata letak timbunan, dan perencanaan tambang secara keseluruhan."],
  ["Geotechnical Studies for Pit Optimization: Geotechnical assessments and design recommendations to maximize resource recovery while maintaining slope stability and operational safety.", "Kajian Geoteknik untuk Optimasi Pit: Penilaian geoteknik dan rekomendasi desain untuk memaksimalkan perolehan sumber daya sambil menjaga kestabilan lereng dan keselamatan operasional."],
  ["Underground Mining Geotechnical Assessments: Engineering evaluations of underground ground conditions, excavation stability, and support systems to minimize geotechnical risks.", "Kajian Geoteknik Tambang Bawah Tanah: Evaluasi rekayasa atas kondisi batuan bawah tanah, kestabilan galian, dan sistem penyangga untuk menekan risiko geoteknik."],
  ["Tailings Storage Facility Geotechnical Assessments: Comprehensive geotechnical investigations and stability evaluations to support the safe design, construction, and operation of tailings storage facilities.", "Kajian Geoteknik Fasilitas Penyimpanan Tailing: Investigasi geoteknik dan evaluasi kestabilan yang menyeluruh untuk mendukung desain, konstruksi, dan operasi fasilitas penyimpanan tailing yang aman."],
  ["Start Consulting!", "Mulai Konsultasi!"],
  ["Close Description", "Tutup Deskripsi"],
  ["Our hydrogeological expertise ensures effective water management and aquifer assessment to support mining sustainability. Services include:", "Keahlian hidrogeologi kami memastikan pengelolaan air dan penilaian akuifer yang efektif untuk mendukung keberlanjutan pertambangan. Layanan kami meliputi:"],
  ["Third-Party Peer Review: Independent assessments of hydrogeological and hydrological studies.", "Peer Review Pihak Ketiga: Penilaian independen atas kajian hidrogeologi dan hidrologi."],
  ["Open-Pit Hydrology & Hydrogeology Studies: Ensuring water flow management and safety in surface mining.", "Kajian Hidrologi & Hidrogeologi Tambang Terbuka: Memastikan pengelolaan aliran air dan keselamatan pada tambang permukaan."],
  ["Underground Mining Hydrology & Hydrogeology Studies: Tailored solutions for underground water challenges.", "Kajian Hidrologi & Hidrogeologi Tambang Bawah Tanah: Solusi yang disesuaikan untuk tantangan air bawah tanah."],
  ["Pumping Tests: Comprehensive analysis of water extraction capabilities.", "Uji Pemompaan: Analisis menyeluruh atas kemampuan pengambilan air."],
  ["Aquifer Identification: Locating and analyzing water sources for mining operations.", "Identifikasi Akuifer: Penentuan dan analisis sumber air untuk operasi tambang."],
  ["Groundwater Modeling: Accurate simulation of groundwater behavior for planning and management.", "Pemodelan Air Tanah: Simulasi akurat perilaku air tanah untuk perencanaan dan pengelolaan."],
  ["Geoelectric Surveys: Advanced subsurface investigation for water and mineral exploration.", "Survei Geolistrik: Investigasi bawah permukaan tingkat lanjut untuk eksplorasi air dan mineral."],
  ["Using cutting-edge technology, Lenusa provides accurate and reliable rock mass data to support mining operations. Our services include:", "Dengan teknologi mutakhir, Lenusa menyediakan data massa batuan yang akurat dan andal untuk mendukung operasi pertambangan. Layanan kami meliputi:"],
  ["Drone Photogrammetry: High-resolution mapping for precise topographic and rock mass data.", "Fotogrametri Drone: Pemetaan resolusi tinggi untuk data topografi dan massa batuan yang presisi."],
  ["3D Lidar Scanning for Rock Mass: Detailed scans to ensure accurate geotechnical evaluations.", "Pemindaian Lidar 3D untuk Massa Batuan: Pemindaian detail untuk evaluasi geoteknik yang akurat."],
  ["3D Open-Pit Rock Mass Models: Comprehensive models for surface mining optimization.", "Model Massa Batuan 3D Tambang Terbuka: Model menyeluruh untuk optimasi tambang permukaan."],
  ["3D Underground Rock Mass Models: Advanced modeling for underground mining stability and design.", "Model Massa Batuan 3D Tambang Bawah Tanah: Pemodelan tingkat lanjut untuk kestabilan dan desain tambang bawah tanah."],
  ["Why Choose Us<br>As Your Mining Partner?", "Mengapa Memilih Kami<br>Sebagai Mitra Pertambangan Anda?"],
  ["Tailored Mining Solutions", "Solusi Pertambangan yang Disesuaikan"],
  ["We tailor geotechnical and hydrogeological studies, slope design, groundwater assessments, and rock mass scanning to each site's conditions and operational needs.", "Kami menyesuaikan kajian geoteknik dan hidrogeologi, desain lereng, penilaian air tanah, dan pemindaian massa batuan dengan kondisi tiap lokasi dan kebutuhan operasionalnya."],
  ["Integrated Technical Expertise", "Keahlian Teknis Terpadu"],
  ["Our consulting combines field investigations, engineering analysis, and numerical modeling to inform mine planning, slope stability, and groundwater management.", "Konsultasi kami memadukan investigasi lapangan, analisis rekayasa, dan pemodelan numerik untuk menjadi dasar perencanaan tambang, kestabilan lereng, dan pengelolaan air tanah."],
  ["Practical, Client-Focused Results", "Hasil yang Praktis dan Berpusat pada Klien"],
  ["We turn technical findings into clear, project-specific recommendations that help clients make informed decisions and support safer, more reliable operations.", "Kami mengubah temuan teknis menjadi rekomendasi yang jelas dan spesifik untuk proyek, sehingga klien dapat mengambil keputusan yang tepat dan mendukung operasi yang lebih aman dan andal."],
  ["Our Project Portfolio", "Portofolio Proyek Kami"],
  ["Comprehensive Geotechnical and Hydrogeological Solutions for Mining Challenges", "Solusi Geoteknik dan Hidrogeologi yang Komprehensif untuk Tantangan Pertambangan"],
  ["Project portfolio", "Portofolio proyek"],
  ["The IPD-14 disposal area at PT Kayan Putra Utama Coal (KPUC) experienced significant land movements in 2019 and 2020, posing risks to mining operations, nearby communities, and environmental safety. Key contributing factors included high pore water pressure, groundwater saturation, and inadequate material compaction. Lenusa conducted a comprehensive geotechnical and hydrogeological investigation, including:", "Area timbunan IPD-14 di PT Kayan Putra Utama Coal (KPUC) mengalami pergerakan tanah yang signifikan pada 2019 dan 2020, yang menimbulkan risiko bagi operasi tambang, masyarakat sekitar, dan keselamatan lingkungan. Faktor penyebab utamanya adalah tekanan air pori yang tinggi, kejenuhan air tanah, dan pemadatan material yang kurang memadai. Lenusa melakukan investigasi geoteknik dan hidrogeologi yang menyeluruh, meliputi:"],
  ["Data Collection: Geotechnical drilling at 14 points, laboratory testing, photogrammetry, and geophysical surveys.", "Pengumpulan Data: Pengeboran geoteknik di 14 titik, pengujian laboratorium, fotogrametri, dan survei geofisika."],
  ["Risk Assessment: Hazard zoning and site-specific mitigation recommendations.", "Penilaian Risiko: Zonasi bahaya dan rekomendasi mitigasi yang spesifik untuk lokasi."],
  ["Engineering Solutions: Drainage systems, slope reshaping, vegetation programs, monitoring wells, and submersible pumps.", "Solusi Rekayasa: Sistem drainase, pembentukan ulang lereng, program revegetasi, sumur pantau, dan pompa submersible."],
  ["These measures successfully improved slope stability, reduced groundwater saturation and pore water pressure, and enhanced operational safety.", "Langkah-langkah ini berhasil meningkatkan kestabilan lereng, mengurangi kejenuhan air tanah dan tekanan air pori, serta meningkatkan keselamatan operasional."],
  ["Lenusa delivers integrated geotechnical and hydrogeological solutions to help mining operations manage risks, improve stability, and ensure long-term operational reliability.", "Lenusa menghadirkan solusi geoteknik dan hidrogeologi terpadu untuk membantu operasi tambang mengelola risiko, meningkatkan kestabilan, dan menjaga keandalan operasi dalam jangka panjang."],
  ["Portfolio name 2", "Nama portofolio 2"],
  ["Placeholder description for this project.", "Deskripsi placeholder untuk proyek ini."],
  ["Placeholder detail 1.", "Detail placeholder 1."],
  ["Placeholder detail 2.", "Detail placeholder 2."],
  ["Portfolio name 3", "Nama portofolio 3"],
  ["Portfolio name 4", "Nama portofolio 4"],
  ["Previous projects", "Proyek sebelumnya"],
  ["Next projects", "Proyek berikutnya"],
  ["Consulting | Lenusa.id", "Konsultasi | Lenusa.id"],
  ["Groundwater Permit & Regulatory Compliance", "Izin Air Tanah & Kepatuhan Regulasi"],
  ["We prepare the technical studies and groundwater permit documents, submit them through the official government system, and assist until the permit is issued.", "Kami menyiapkan studi teknis dan dokumen izin air tanah, mengajukannya lewat sistem resmi pemerintah, lalu mendampingi sampai izin terbit."],
  ["View Our Services", "Lihat Layanan Kami"],
  ["See Our Services", "Lihat Layanan Kami"],
  ["Groundwater permitting for businesses and projects", "Pengurusan izin air tanah untuk usaha dan proyek"],
  ["This service helps businesses obtain groundwater permits or use approvals in Indonesia. It is aimed at hotels, villas, resorts, plantations, industry, and construction projects that use groundwater.", "Layanan ini membantu pelaku usaha mengurus izin atau persetujuan penggunaan air tanah di Indonesia. Sasarannya hotel, vila, resor, perkebunan, industri, dan proyek konstruksi yang memakai air tanah."],
  ["Lenusa prepares the technical studies and documents, submits them through the official government system, and assists the process until the permit is issued.", "Lenusa menyiapkan studi teknis dan dokumen, mengajukannya lewat sistem resmi pemerintah, lalu mendampingi prosesnya sampai izin terbit."],
  ["Groundwater Business Permit", "Izin Pengusahaan Air Tanah"],
  ["For business activities. Submitted through the OSS system.", "Untuk kegiatan usaha. Diajukan lewat sistem OSS."],
  ["Groundwater Use Approval", "Persetujuan Penggunaan Air Tanah"],
  ["For non-business activities. Submitted through the online licensing application. Construction dewatering falls under PPAT.", "Untuk kegiatan bukan usaha. Diajukan lewat aplikasi perizinan online. Dewatering konstruksi masuk PPAT."],
  ["Why this service is needed", "Mengapa layanan ini dibutuhkan"],
  ["Business use requires a permit", "Pemakaian untuk usaha wajib berizin"],
  ["For non-business activities, use above a certain limit requires approval.", "Untuk kegiatan bukan usaha, pemakaian di atas batas tertentu wajib punya persetujuan."],
  ["Permits carry no government fee", "Izin tidak dipungut biaya"],
  ["The government charges no fee for processing permits (Article 24 of ESDM Ministerial Regulation 14/2024). The costs that arise are the costs of preparing the application.", "Pemerintah tidak memungut biaya pengurusan izin (Pasal 24 Permen ESDM 14/2024). Biaya yang timbul adalah biaya proses penyusunannya."],
  ["The final decision rests with government agencies", "Keputusan akhir di instansi pemerintah"],
  ["Approval always rests with the competent agency. Lenusa does not guarantee that a permit will be issued.", "Persetujuan selalu di tangan instansi yang berwenang. Lenusa tidak menjamin izin terbit."],
  ["Service Packages", "Paket Layanan"],
  ["Four packages. Each package includes:", "Empat paket. Setiap paket mencakup:"],
  ["Field survey and technical study", "Survei lapangan dan kajian teknis"],
  ["Preparation of technical and administrative documents", "Penyusunan dokumen teknis dan administrasi"],
  ["Submission through the official government system", "Pengajuan lewat sistem resmi pemerintah"],
  ["Assistance until the permit is issued", "Pendampingan sampai izin terbit"],
  ["On-site data collection and technical feasibility analysis as the basis for meeting regulatory standards.", "Pengumpulan data langsung di lokasi serta analisis kelayakan teknis sebagai dasar pemenuhan standar regulasi."],
  ["Preparation of requirement files, study reports, and legal documents, structured according to the relevant agency's provisions.", "Penyiapan berkas persyaratan, laporan kajian, dan kelengkapan legalitas yang terstruktur sesuai ketentuan instansi terkait."],
  ["Document upload and permit application registration, integrated through the official government service portal.", "Proses unggah berkas dan registrasi permohonan perizinan secara terintegrasi melalui portal layanan resmi pemerintah."],
  ["Monitoring of verification progress and coordination of follow-up revisions, until the official permit document is issued.", "Pemantauan progres verifikasi, koordinasi tindak lanjut revisi, hingga dokumen perizinan resmi diterbitkan."],
  ["SIPA · Business", "SIPA · Usaha"],
  ["For", "Untuk"],
  ["Hotels, villas, and resorts, up to two well points.", "Hotel, vila, dan resor, sampai dua titik sumur."],
  ["Permit validity", "Masa berlaku izin"],
  ["5 years", "5 tahun"],
  ["Plantations and industrial facilities, up to four well points.", "Perkebunan dan fasilitas industri, sampai empat titik sumur."],
  ["PPAT · Non-business", "PPAT · Bukan usaha"],
  ["Facilities with monitoring wells.", "Fasilitas dengan sumur pantau."],
  ["Up to 7 years", "Paling lama 7 tahun"],
  ["PPAT · Dewatering", "PPAT · Dewatering"],
  ["Construction projects that need temporary dewatering.", "Proyek konstruksi yang butuh dewatering sementara."],
  ["Up to 1 year", "Paling lama 1 tahun"],
  ["Who this service is for", "Siapa yang cocok memakai layanan ini"],
  ["Hotels, villas, and resorts", "Hotel, vila, dan resor"],
  ["Plantations and industrial facilities", "Perkebunan dan fasilitas industri"],
  ["Facilities with monitoring wells", "Fasilitas dengan sumur pantau"],
  ["Construction projects that require dewatering", "Proyek konstruksi yang membutuhkan dewatering"],
  ["Dewatering related to mining, oil and gas, or geothermal does not require this approval (Article 6, paragraph 2).", "Dewatering yang terkait tambang, migas, atau panas bumi tidak memerlukan persetujuan ini (Pasal 6 ayat 2)."],
  ["Service Process", "Alur Layanan"],
  ["Initial Consultation", "Konsultasi Awal"],
  ["Defining the business activity, water source, and estimated daily use to choose the right permit route.", "Menentukan kegiatan usaha, sumber air, dan perkiraan pemakaian harian untuk memilih jalur izin yang tepat."],
  ["<strong>Under the regulation</strong>Determine whether SIPA or PPAT applies and the discharge plan (m³ per day).", "<strong>Dalam regulasi</strong>Menentukan SIPA atau PPAT dan rencana debit (m³ per hari)."],
  ["Survey and Technical Study", "Survei dan Kajian Teknis"],
  ["The hydrogeology team carries out the field study and prepares the supporting technical data.", "Tim hidrogeologi melakukan kajian lapangan dan menyiapkan data teknis pendukung."],
  ["<strong>Under the regulation</strong>Well point coordinates, depth and diameter, and well construction drawings.", "<strong>Dalam regulasi</strong>Koordinat titik sumur, kedalaman dan diameter, serta gambar konstruksi sumur."],
  ["Document Preparation and Submission", "Penyusunan dan Pengajuan Dokumen"],
  ["Documents are prepared to regulatory standards and submitted through official government channels.", "Dokumen disusun sesuai standar regulasi dan diajukan lewat kanal resmi pemerintah."],
  ["<strong>Under the regulation</strong>Submission through OSS (SIPA) or the online licensing application (PPAT).", "<strong>Dalam regulasi</strong>Pengajuan lewat OSS (SIPA) atau aplikasi perizinan online (PPAT)."],
  ["Process Assistance", "Pendampingan Proses"],
  ["Monitoring and following up on the application until the official permit is issued.", "Memantau dan menindaklanjuti permohonan sampai izin resmi terbit."],
  ["<strong>Under the regulation</strong>File corrections within 7 working days. Issuance within 14 working days if the file is complete.", "<strong>Dalam regulasi</strong>Perbaikan berkas dalam 7 hari kerja. Penerbitan dalam 14 hari kerja bila berkas lengkap."],
  ["Ongoing Compliance Support", "Dukungan Kepatuhan Berkelanjutan"],
  ["For clients who need it: support with periodic usage reporting.", "Bagi klien yang membutuhkan: dukungan pelaporan pemakaian berkala."],
  ["<strong>Under the regulation</strong>A technical report every 6 months when extracting more than 10 m³ per day.", "<strong>Dalam regulasi</strong>Laporan teknis tiap 6 bulan bila mengambil lebih dari 10 m³ per hari."],
  ["Estimated process duration", "Estimasi lama proses"],
  ["14 working days", "14 hari kerja"],
  ["Official issuance time once the file is declared complete. This is government time, not the total duration of the service.", "Waktu penerbitan resmi sejak berkas dinyatakan lengkap. Ini waktu pemerintah, bukan waktu keseluruhan layanan."],
  ["7 working days", "7 hari kerja"],
  ["Deadline to submit file corrections. After that, the application is void.", "Batas menyerahkan perbaikan berkas. Lewat dari itu, permohonan batal."],
  ["Validity of the SIPA. Renewal is submitted 6 to 2 months before expiry.", "Masa berlaku SIPA. Perpanjangan diajukan 6 sampai 2 bulan sebelum habis."],
  ["Regulatory Framework", "Kerangka Regulasi"],
  ["Main legal basis: Minister of Energy and Mineral Resources Regulation Number 14 of 2024 on the Implementation of Groundwater Business Permits and Groundwater Use Approvals, enacted on 2 December 2024.", "Dasar hukum utama: Peraturan Menteri ESDM Nomor 14 Tahun 2024 tentang Penyelenggaraan Izin Pengusahaan Air Tanah dan Persetujuan Penggunaan Air Tanah, ditetapkan 2 Desember 2024."],
  ["Item", "Hal"],
  ["Provision", "Ketentuan"],
  ["Basis", "Dasar"],
  ["Permit type", "Jenis izin"],
  ["Groundwater Business Permit (SIPA) for business activities, submitted through the OSS system. Groundwater Use Approval (PPAT) for non-business activities, submitted through the online licensing application. Construction dewatering falls under PPAT.", "Izin Pengusahaan Air Tanah (SIPA) untuk kegiatan usaha, diajukan lewat sistem OSS. Persetujuan Penggunaan Air Tanah (PPAT) untuk kegiatan bukan usaha, diajukan lewat aplikasi perizinan online. Dewatering konstruksi masuk PPAT."],
  ["Articles 2, 6, 7, 8", "Pasal 2, 6, 7, 8"],
  ["What does not need approval", "Yang tidak perlu persetujuan"],
  ["Basic needs below 100 m³ per month, government office buildings, places of worship, smallholder farming that is not a business, and dewatering related to mining, oil and gas, or geothermal.", "Kebutuhan pokok di bawah 100 m³ per bulan, kantor instansi pemerintah, rumah ibadah, pertanian rakyat bukan usaha, dan dewatering terkait tambang, migas, atau panas bumi."],
  ["Article 6, paragraph 2", "Pasal 6 ayat 2"],
  ["Validity", "Masa berlaku"],
  ["SIPA: 5 years. PPAT: up to 7 years for use other than basic needs. Dewatering PPAT: up to 1 year. Renewal is submitted 6 to 2 months before expiry.", "SIPA 5 tahun. PPAT paling lama 7 tahun untuk penggunaan selain kebutuhan pokok. PPAT dewatering paling lama 1 tahun. Perpanjangan diajukan 6 sampai 2 bulan sebelum habis."],
  ["Articles 12, 13, 25, 26", "Pasal 12, 13, 25, 26"],
  ["Issuance time", "Waktu penerbitan"],
  ["Up to 14 working days if the file is complete. File corrections must be submitted within 7 working days, otherwise the application is void.", "Paling lama 14 hari kerja jika berkas lengkap. Perbaikan berkas wajib diserahkan dalam 7 hari kerja, jika tidak permohonan batal."],
  ["Articles 7, 8", "Pasal 7, 8"],
  ["Processing fee", "Biaya pengurusan"],
  ["No fee. Administrative fines apply only to wells that have no permit (regularization).", "Tidak dipungut biaya. Denda administratif hanya untuk sumur yang belum berizin (penataan)."],
  ["Article 24; Articles 17 to 19", "Pasal 24; Pasal 17 sampai 19"],
  ["SIPA holder obligations", "Kewajiban pemegang SIPA"],
  ["Install a water meter, build a monitoring well with an AWLR, and submit a technical report every 6 months when extracting more than 10 m³ per day. The report contains a monthly discharge summary, water quality every 6 months, and monthly groundwater level.", "Memasang meter air, membangun sumur pantau dengan AWLR, dan menyerahkan laporan teknis tiap 6 bulan bila mengambil lebih dari 10 m³ per hari. Laporan memuat rekap debit bulanan, kualitas air tiap 6 bulan, dan muka air tanah bulanan."],
  ["Articles 9, 10", "Pasal 9, 10"],
  ["Discharge limits in conservation zones", "Batas debit zona konservasi"],
  ["Protected zone: maximum 25 m³ per day. Critical zone: maximum 10 m³ per day. Damaged zone: no new permits are accepted.", "Zona perlindungan maksimal 25 m³ per hari. Zona kritis maksimal 10 m³ per hari. Zona rusak tidak menerima izin baru."],
  ["Article 20", "Pasal 20"],
  ["Issuing authority", "Kewenangan penerbit"],
  ["The Minister for cross-country, cross-province, and nationally strategic river basins. The Governor for cross-regency or cross-city areas. The Regent or Mayor for areas within one regency or city.", "Menteri untuk wilayah sungai lintas negara, lintas provinsi, dan strategis nasional. Gubernur untuk lintas kabupaten atau kota. Bupati atau wali kota untuk dalam satu kabupaten atau kota."],
  ["Article 2, paragraph 4", "Pasal 2 ayat 4"],
  ["Well closure", "Penutupan sumur"],
  ["Wells must be closed within 30 calendar days after the permit is revoked or expires.", "Sumur wajib ditutup dalam 30 hari kalender setelah izin dicabut atau berakhir."],
  ["Articles 16, 27", "Pasal 16, 27"],
  ["Official text: <a href=\"https://jdih.esdm.go.id/common/dokumen-external/2024pmesdm14.pdf\" target=\"_blank\" rel=\"noopener noreferrer\">ESDM Regulation 14/2024 (JDIH ESDM)</a>. FAQ: <a href=\"https://geologi.esdm.go.id/artesis/tentang-kami/faq\" target=\"_blank\" rel=\"noopener noreferrer\">Geological Agency FAQ</a>.", "Teks resmi: <a href=\"https://jdih.esdm.go.id/common/dokumen-external/2024pmesdm14.pdf\" target=\"_blank\" rel=\"noopener noreferrer\">Permen ESDM 14/2024 (JDIH ESDM)</a>. Tanya jawab: <a href=\"https://geologi.esdm.go.id/artesis/tentang-kami/faq\" target=\"_blank\" rel=\"noopener noreferrer\">FAQ Badan Geologi</a>."],
  ["Documents and data prepared by the client", "Dokumen dan data yang disiapkan klien"],
  ["This list comes from Articles 7 and 8 of ESDM Ministerial Regulation 14/2024. Lenusa helps compile it, but some of the data comes from the client.", "Daftar ini berasal dari Pasal 7 dan 8 Permen ESDM 14/2024. Lenusa membantu menyusunnya, tetapi sebagian data berasal dari klien."],
  ["SIPA (business)", "SIPA (usaha)"],
  ["Well point coordinates in decimal degree format that fall within the KKPR coordinates, discharge plan, well depth and diameter, a statement of commitment to build infiltration, recharge, or monitoring wells, and well construction drawings.", "Koordinat titik sumur dalam format decimal degree yang berada dalam koordinat KKPR, rencana debit, kedalaman dan diameter sumur, pernyataan kesanggupan membuat sumur resapan, imbuhan, atau pantau, dan gambar konstruksi sumur."],
  ["PPAT (non-business)", "PPAT (bukan usaha)"],
  ["Identity and location form, coordinates, intended use, discharge plan, a letter of commitment to build infiltration wells, and construction drawings.", "Formulir identitas dan lokasi, koordinat, peruntukan, rencana debit, surat kesanggupan membuat sumur resapan, dan gambar konstruksi."],
  ["Duration, method, pump type and capacity, aquifer and pump depth, pumping discharge and duration, and technical drawings.", "Jangka waktu, metode, jenis dan kapasitas pompa, kedalaman akuifer dan pompa, debit dan durasi pemompaan, serta gambar teknis."],
  ["Groundwater Permit & Regulatory Compliance | Lenusa.id", "Izin Air Tanah & Kepatuhan Regulasi | Lenusa.id"],
  ["Geotechnical & Hydrogeological <br>Software Solutions", "Solusi Perangkat Lunak<br>Geoteknik & Hidrogeologi"],
  ["Lenusa provides access to specialized software solutions for geotechnical engineering, groundwater modeling, geology, geophysics, <br>and mining project data management. Our software portfolio supports technical analysis, data interpretation, and engineering workflows, <br>helping professionals address complex project requirements and make informed technical decisions.", "Lenusa menyediakan akses ke solusi perangkat lunak khusus untuk rekayasa geoteknik, pemodelan air tanah, geologi, geofisika, <br>dan pengelolaan data proyek tambang. Portofolio perangkat lunak kami mendukung analisis teknis, interpretasi data, dan alur kerja rekayasa, <br>sehingga para profesional dapat menjawab kebutuhan proyek yang kompleks dan mengambil keputusan teknis yang tepat."],
  ["Explore Software", "Jelajahi Perangkat Lunak"],
  ["Our Official Partner", "Mitra Resmi Kami"],
  ["Waterloo Hydrogeologic develops specialized software solutions for groundwater professionals and water resource management. Its software portfolio supports groundwater modeling, aquifer analysis, contaminant transport assessment, and hydrogeological data interpretation to assist professionals in evaluating and managing groundwater resources.", "Waterloo Hydrogeologic mengembangkan solusi perangkat lunak khusus untuk para profesional air tanah dan pengelolaan sumber daya air. Portofolio perangkat lunaknya mendukung pemodelan air tanah, analisis akuifer, kajian transpor kontaminan, dan interpretasi data hidrogeologi untuk membantu para profesional mengevaluasi dan mengelola sumber daya air tanah."],
  ["Seequent, a Bentley Systems company, develops geoscience software solutions for analyzing and interpreting complex geological and geotechnical data. Its software supports applications across mining, civil engineering, environmental management, geothermal energy, and groundwater, helping professionals gain insights from technical data and support engineering decisions.", "Seequent, perusahaan Bentley Systems, mengembangkan solusi perangkat lunak geosains untuk menganalisis dan menginterpretasi data geologi dan geoteknik yang kompleks. Perangkat lunaknya mendukung penerapan di bidang pertambangan, teknik sipil, pengelolaan lingkungan, energi panas bumi, dan air tanah, sehingga para profesional dapat menggali wawasan dari data teknis dan mendukung keputusan rekayasa."],
  ["Explore Our Software Catalogue", "Jelajahi Katalog Perangkat Lunak Kami"],
  ["Browse our selection of specialized software from Waterloo Hydrogeologic and Seequent. Explore available products, review their primary applications, and identify the solutions that best match your technical requirements and project objectives.", "Telusuri pilihan perangkat lunak khusus dari Waterloo Hydrogeologic dan Seequent. Lihat produk yang tersedia, pelajari aplikasi utamanya, dan temukan solusi yang paling sesuai dengan kebutuhan teknis dan tujuan proyek Anda."],
  ["Software catalogue", "Katalog software"],
  ["Software vendors", "Vendor software"],
  ["Search software name", "Cari nama software"],
  ["Search software name", "Cari nama software"],
  ["No software found. Try another keyword.", "Software tidak ditemukan. Coba kata kunci lain."],
  ["Frequently Asked Questions (FAQ)", "Pertanyaan yang Sering Diajukan (FAQ)"],
  ["Question :", "Pertanyaan :"],
  ["Answer :", "Jawaban :"],
  ["How much does a license cost?", "Berapa harga lisensinya?"],
  ["License prices differ by product, license type, and package. Contact Lenusa on WhatsApp for pricing.", "Harga lisensi berbeda untuk setiap produk, jenis lisensi, dan paket. Hubungi Lenusa lewat WhatsApp untuk informasi harga."],
  ["What license types are available?", "Jenis lisensi apa saja yang tersedia?"],
  ["Seequent offers Shared, Named, and other models depending on the product. PLAXIS 2D is available as a 12-month Virtuoso subscription. For Waterloo licensing, contact Lenusa.", "Seequent menawarkan Shared, Named, dan model lain sesuai produk. PLAXIS 2D tersedia dalam langganan Virtuoso 12 bulan. Untuk lisensi Waterloo, hubungi Lenusa."],
  ["Is there training or assistance after purchase?", "Apakah ada training atau pendampingan setelah pembelian?"],
  ["Seequent provides online learning material; PLAXIS 2D includes a training token. Waterloo offers a Visual MODFLOW Flex course. For assistance from Lenusa, contact our team.", "Seequent menyediakan materi belajar online; PLAXIS 2D menyertakan token training. Waterloo menawarkan kursus Visual MODFLOW Flex. Untuk pendampingan dari Lenusa, hubungi tim kami."],
  ["Is the software always kept up to date?", "Apakah versi software selalu diperbarui?"],
  ["Vendors release updates regularly. For update rights, maintenance, and support for buyers, contact Lenusa.", "Vendor merilis pembaruan berkala. Untuk hak pembaruan, maintenance, dan dukungan bagi pembeli, hubungi Lenusa."],
  ["Is it available in Bahasa Indonesia?", "Apakah tersedia dalam Bahasa Indonesia?"],
  ["Bahasa Indonesia support in the software interface and documentation cannot be confirmed yet.", "Dukungan Bahasa Indonesia pada antarmuka dan dokumentasi software belum dapat dipastikan."],
  ["Can I try the software before buying?", "Apakah saya bisa mencoba software ini sebelum membeli?"],
  ["A trial is available for PLAXIS 2D and some Waterloo products. For the duration, terms, and availability through Lenusa, contact our team.", "Trial tersedia untuk PLAXIS 2D dan beberapa produk Waterloo. Untuk durasi, syarat, dan ketersediaan melalui Lenusa, hubungi tim kami."],
  ["Which product should I choose for my needs?", "Produk apa yang harus saya pilih untuk kebutuhan saya?"],
  ["See the product selection guide and the function and license comparison table on this page.", "Lihat panduan pemilihan produk dan tabel perbandingan fungsi serta lisensi di halaman ini."],
  ["How can I reach the Lenusa team?", "Bagaimana cara menghubungi tim Lenusa?"],
  ["WhatsApp: +62 811-2521-1333 or email info@lenusa.id.", "WhatsApp: +62 811-2521-1333 atau email info@lenusa.id."],
  ["Featured training", "Pelatihan Unggulan"],
  ["Technical insights on geotechnics, groundwater, and mine dewatering. Browse selected articles and studies from across the mining industry, each with a short summary and a link to the original source.", "Wawasan teknis seputar geoteknik, air tanah, dan dewatering tambang. Telusuri artikel dan studi pilihan dari industri pertambangan, masing-masing dengan ringkasan singkat dan tautan ke sumber aslinya."],
  ["Mining Training & <br>Professional Certification", "Pelatihan Pertambangan &<br>Sertifikasi Profesi"],
  ["Litologi by Lenusa delivers practical training for geotechnical, hydrogeological, and mining professionals. <br>From BNSP-certified Diklat to public training programmes, each course is taught by industry practitioners <br>and built around real project needs, so your team gains skills it can apply on site from day one.", "Litologi by Lenusa menghadirkan pelatihan praktis untuk profesional geoteknik, hidrogeologi, dan pertambangan. <br>Dari Diklat bersertifikasi BNSP hingga program public training, setiap kelas diajarkan oleh praktisi industri <br>dan disusun sesuai kebutuhan proyek nyata, agar tim Anda punya keterampilan yang langsung bisa dipakai di lapangan."],
  ["See Our Training", "Lihat Pelatihan Kami"],
  ["Previous slide", "Slide sebelumnya"],
  ["Next slide", "Slide berikutnya"],
  ["All Training List", "Daftar Semua Pelatihan"],
  ["Search Training", "Cari Pelatihan"],
  ["Search Training", "Cari Pelatihan"],
  ["Certification", "Sertifikasi"],
  ["No training found.", "Pelatihan tidak ditemukan."],
  ["Pagination", "Navigasi halaman"],
  ["Training | Lenusa.id", "Pelatihan | Lenusa.id"],
  ["Breadcrumb", "Jejak navigasi"],
  ["What you get:", "Apa yang didapatkan:"],
  ["What you get", "Apa yang didapatkan"],
  ["Comprehensive Certificate", "Sertifikat Komprehensif"],
  ["Receive a recognized comprehensive certificate after you complete the whole training series.", "Dapatkan sertifikat komprehensif yang diakui setelah Anda menyelesaikan seluruh rangkaian pelatihan ini."],
  ["Newest Training Module", "Modul Pelatihan Terbaru"],
  ["Access training modules with the newest, up-to-date material that is relevant to current industry developments.", "Akses modul pelatihan dengan materi terbaru dan ter-update yang relevan dengan perkembangan industri saat ini."],
  ["Comfortable Meeting Room", "Ruang Pertemuan yang Nyaman"],
  ["Enjoy a comfortable meeting room that supports your focus and learning.", "Nikmati ruang pertemuan nyaman dan kondusif untuk mendukung fokus serta pembelajaran Anda."],
  ["1x Lunch, 2x Coffee Break (Onsite)", "1x Makan Siang, 2x Coffee Break (Onsite)"],
  ["One lunch and two coffee breaks during the onsite training.", "Makan siang satu kali dan coffee break dua kali selama pelatihan onsite."],
  ["Seminar materials to support your learning.", "Perlengkapan seminar untuk menunjang kegiatan belajar Anda."],
  ["Presentation material", "Materi presentasi"],
  ["Training presentation material that you can review again.", "Materi presentasi pelatihan yang dapat Anda pelajari kembali."],
  ["Register Now", "Daftar Sekarang"],
  ["Hydrology & Hydrogeology Study for Underground Mining – PT Cikondang Kancana Prima (CKP)", "Studi Hidrologi & Hidrogeologi untuk Tambang Bawah Tanah – PT Cikondang Kancana Prima (CKP)"],
  ["Project Overview: Hydrogeological Risk Assessment for Underground Mining at PT. CKP's site", "Gambaran Proyek: Penilaian Risiko Hidrogeologi untuk Tambang Bawah Tanah di lokasi PT CKP"],
  ["Project Overview: Geotechnical Risk Assessment for IPD-14 Disposal Area", "Gambaran Proyek: Penilaian Risiko Geoteknik untuk Area Timbunan IPD-14"],
  ["Page sections", "Bagian halaman"],
  ["Training Description", "Deskripsi Training"],
  ["Feedback", "Feedback"],
  ["Other Training", "Pelatihan Lain"],
  ["Training Material:", "Materi Training:"],
  ["Training Method", "Metode Training"],
  ["Who Should Attend This Training?", "Siapa Yang Harus Mengikuti Pelatihan Ini?"],
  ["Participant Feedback", "Feedback Peserta"],
  ["Participant feedback", "Feedback peserta"],
  ["File Recording", "File Recording"],
  ["Get a complete recording of every training session to review again anytime, with no time limit.", "Dapatkan rekaman lengkap dari seluruh sesi pelatihan untuk dipelajari kembali kapan saja tanpa batas waktu."],
  ["Lenusa’s Article", "Artikel Lenusa"],
  ["Explanation of maintenance strategies (corrective, preventive, predictive, condition-based) and their application to mining fleets and fixed plant Introduction to the main components and critical system functions of each asset category Application of PM procedures based on hourmeter, duty cycle, and calendar schedule", "Penjelasan strategi pemeliharaan (corrective, preventive, predictive, condition-based) dan penerapannya pada fleet tambang dan plant tetap Pengenalan komponen utama dan fungsi sistem kritis tiap kategori aset Penerapan prosedur PM berbasis hourmeter, duty cycle, dan jadwal kalender"],
  ["Articles", "Daftar artikel"],
  ["Article category", "Kategori artikel"],
  ["Latest Article", "Artikel Terbaru"],
  ["Geotech Article", "Artikel Geoteknik"],
  ["Groundwater Article", "Artikel Air Tanah"],
  ["Dewatering Article", "Artikel Dewatering"],
  ["No article found.", "Artikel tidak ditemukan."],
  ["Lenusa’s Article | Lenusa.id", "Artikel Lenusa | Lenusa.id"],
  ["Mining site photo", "Foto lokasi tambang"],
  ["Summary", "Ringkasan"],
  ["Read the original", "Baca sumber aslinya"],
  ["Relevant Article", "Artikel Terkait"],
  ["{0} trainings found", "{0} pelatihan ditemukan"],
  ["{0} training found", "{0} pelatihan ditemukan"],
  ["No training found", "Pelatihan tidak ditemukan"],
  ["{0} articles found", "{0} artikel ditemukan"],
  ["{0} article found", "{0} artikel ditemukan"],
  ["{0} trainings, page {1} of {2}", "{0} pelatihan, halaman {1} dari {2}"],
  ["Page {0}", "Halaman {0}"],
  ["Previous", "Sebelumnya"],
  ["Next", "Berikutnya"],
  ["Previous page", "Halaman sebelumnya"],
  ["Next page", "Halaman berikutnya"],
  ["Show pages {0}–{1}", "Tampilkan halaman {0}–{1}"],
  ["Pagination", "Navigasi halaman"],
  ["Rated {0} out of 5, {1} ratings", "Rating {0} dari 5, {1} rating"],
  ["{0} out of 5 stars", "{0} dari 5 bintang"],
  ["Breadcrumb", "Jejak navigasi"],
  ["See Details", "Lihat Detail"],
  ["Published:", "Dipublikasikan:"],
  ["Source:", "Sumber:"],
  ["View Full Article", "Lihat Artikel Lengkap"],
  ["Explore Article", "Jelajahi Artikel"],
  ["Geotech", "Geoteknik"],
  ["Groundwater", "Air Tanah"],
  ["Read the original article", "Baca artikel aslinya"],
  ["(opens in a new tab)", "(terbuka di tab baru)"],
  ["Contact Us", "Hubungi Kami"],
  ["Inquire via WhatsApp", "Tanya via WhatsApp"],
  ["or", "atau"],
  ["if you want to discuss this topic for your operation.", "jika Anda ingin membahas topik ini untuk operasi Anda."],
  ["This is a short summary written for Lenusa’s article list. The full text is published by {0}.", "Ini ringkasan singkat yang ditulis untuk daftar artikel Lenusa. Teks lengkapnya diterbitkan oleh {0}."],
  ["Previous software, Waterloo Hydrogeologic", "Software sebelumnya, Waterloo Hydrogeologic"],
  ["Next software, Waterloo Hydrogeologic", "Software berikutnya, Waterloo Hydrogeologic"],
  ["Waterloo Hydrogeologic software", "Software Waterloo Hydrogeologic"],
  ["Previous software, Seequent", "Software sebelumnya, Seequent"],
  ["Next software, Seequent", "Software berikutnya, Seequent"],
  ["Seequent software", "Software Seequent"],
  ["View details of {0}", "Lihat detail {0}"],
  ["about {0}", "tentang {0}"],
  ["Learn more", "Selengkapnya"],
  ["Overview of {0}", "Gambaran {0}"],
  ["Main function", "Fungsi utama"],
  ["Version and release", "Versi dan rilis"],
  ["Being verified", "Sedang diverifikasi"],
  ["Needs verification", "Perlu verifikasi"],
  ["Product information", "Informasi produk"],
  ["Latest details", "Rincian terbaru"],
  ["Contact Lenusa for the latest feature, version, and license details.", "Hubungi Lenusa untuk rincian fitur, versi, dan lisensi terbaru."],
  ["Source: {0}", "Sumber: {0}"],
  ["Training not found.", "Training tidak ditemukan."],
  ["Back to training", "Kembali ke training"],
  ["Software not found", "Software tidak ditemukan"],
  ["The product you are looking for does not exist or has been moved.", "Produk yang Anda cari tidak ada atau sudah dipindahkan."],
  ["View all software", "Lihat semua software"],
  ["This service helps businesses obtain groundwater permits or approvals in Indonesia. It is aimed at hotels, villas, resorts, plantations, industry, and construction projects that use groundwater. Lenusa prepares the technical study and documents, submits them through the official government system, then assists the process until the permit is issued.", "Layanan ini membantu pelaku usaha mengurus izin atau persetujuan penggunaan air tanah di Indonesia. Sasarannya hotel, vila, resor, perkebunan, industri, dan proyek konstruksi yang memakai air tanah. Lenusa menyiapkan studi teknis dan dokumen, mengajukannya lewat sistem resmi pemerintah, lalu mendampingi prosesnya sampai izin terbit."],
  ["Business", "Usaha"],
  ["Non-business", "Bukan usaha"],
  ["Why is this service needed?", "Mengapa layanan ini dibutuhkan?"],
  ["Our Service Process", "Alur Layanan Kami"],
  ["Identify the business activity, water source, and estimated daily usage to determine the correct permit pathway.", "Menentukan kegiatan usaha, sumber air, dan perkiraan pemakaian harian untuk memilih jalur izin yang tepat."],
  ["Survey & Technical Study", "Survei dan Kajian Teknis"],
  ["Our hydrogeology team conducts field assessment and prepares supporting technical data.", "Tim hidrogeologi melakukan kajian lapangan dan menyiapkan data teknis pendukung."],
  ["Document Preparation & Submission", "Penyusunan dan Pengajuan Dokumen"],
  ["All documentation is prepared to regulatory standard and submitted through official government channels.", "Dokumen disusun sesuai standar regulasi dan diajukan lewat kanal resmi pemerintah."],
  ["Process Accompaniment", "Pendampingan Proses"],
  ["We monitor and follow up on the application until the permit is officially issued.", "Memantau dan menindaklanjuti permohonan sampai izin resmi terbit."],
  ["For clients who need it, we provide continued support or periodic usage reporting to maintain long-term compliance.", "Bagi klien yang membutuhkan: dukungan pelaporan pemakaian berkala."],
  ["Discuss Your Groundwater Needs", "Diskusikan Kebutuhan Air Tanah Anda"],
  ["What types of groundwater permits are there?", "Apa saja jenis izin penggunaan air tanah?"],
  ["Who does not need groundwater use approval?", "Siapa yang tidak perlu persetujuan penggunaan air tanah?"],
  ["How long is a permit valid and when is it renewed?", "Berapa lama masa berlaku izin dan kapan diperpanjang?"],
  ["How long does permit issuance take?", "Berapa lama proses penerbitan izin?"],
  ["Is there a fee for processing the permit?", "Apakah pengurusan izin dikenakan biaya?"],
  ["What are the obligations of a SIPA holder?", "Apa saja kewajiban pemegang SIPA?"],
  ["What are the discharge limits in conservation zones?", "Berapa batas debit di zona konservasi?"],
  ["Who has the authority to issue permits?", "Siapa yang berwenang menerbitkan izin?"],
  ["When must a well be closed?", "Kapan sumur wajib ditutup?"],
  ["ESDM Regulation 14/2024", "Permen ESDM 14/2024"]
];

(() => {
  const norm = (s) => s.replace(/&amp;/g, "&").replace(/&nbsp;/g, " ").replace(/<br\s*\/?>/gi, "<br>").replace(/\s+/g, " ").trim();
  const escRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const compile = (text) => {
    const order = [];
    const source = escRe(text).replace(/\\\{(\d)\\\}/g, (_, n) => { order.push(Number(n)); return "(.+?)"; });
    return { re: new RegExp("^" + source + "$"), order };
  };
  const exact = new Map();
  const patterns = [];
  for (const pair of I18N_PAIRS) {
    const both = pair.map(norm);
    if (both[0] === both[1]) continue;
    if (/\{\d\}/.test(both[0] + both[1])) {
      both.forEach((text) => patterns.push({ pair: both, ...compile(text) }));
    } else {
      both.forEach((text) => exact.set(text, both));
    }
  }
  const index = LANG === "en" ? 0 : 1;
  const lookup = (key) => {
    const hit = exact.get(key);
    if (hit) return hit[index];
    for (const p of patterns) {
      const m = key.match(p.re);
      if (!m) continue;
      const values = {};
      p.order.forEach((n, i) => { values[n] = m[i + 1]; });
      return p.pair[index].replace(/\{(\d)\}/g, (_, n) => values[n] ?? "");
    }
    return null;
  };

  const SKIP = new Set(["SCRIPT", "STYLE", "SVG", "NOSCRIPT", "TEXTAREA", "IFRAME", "HEAD"]);
  const ATTRIBUTES = ["aria-label", "placeholder", "title"];
  const apply = (el) => {
    if (el.tagName === "SCRIPT" || el.tagName === "STYLE" || el.tagName === "HEAD") return;
    for (const attribute of ATTRIBUTES) {
      const value = el.getAttribute(attribute);
      if (!value) continue;
      const out = lookup(norm(value));
      if (out !== null && out !== value) el.setAttribute(attribute, out);
    }
    if (SKIP.has(el.tagName)) return;
    if (![...el.childNodes].some((n) => n.nodeType === 3 && n.nodeValue.trim())) return;
    const whole = lookup(norm(el.innerHTML));
    if (whole !== null) {
      if (norm(whole) !== norm(el.innerHTML)) el.innerHTML = whole;
      return;
    }
    for (const node of [...el.childNodes]) {
      if (node.nodeType !== 3) continue;
      const key = norm(node.nodeValue);
      if (!key) continue;
      const out = lookup(key);
      if (out !== null && out !== key) {
        node.nodeValue = node.nodeValue.match(/^\s*/)[0] + out + node.nodeValue.match(/\s*$/)[0];
      }
    }
  };
  const run = (root) => {
    if (root.nodeType !== 1) return;
    apply(root);
    root.querySelectorAll("*").forEach((el) => { if (!el.closest("svg")) apply(el); });
  };

  const observer = new MutationObserver((records) => {
    observer.disconnect();
    for (const r of records) {
      if (r.type === "childList") r.addedNodes.forEach((n) => (n.nodeType === 1 ? run(n) : n.nodeType === 3 && n.parentElement && apply(n.parentElement)));
      else if (r.type === "characterData" && r.target.parentElement) apply(r.target.parentElement);
    }
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
  });

  run(document.body);
  const title = lookup(norm(document.title));
  if (title !== null) document.title = title;
  document.documentElement.lang = LANG;
  document.querySelectorAll(".lang button").forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.lang === LANG)));
  observer.observe(document.body, { childList: true, subtree: true, characterData: true });
  document.documentElement.classList.remove("i18n-wait");

  document.addEventListener("click", (event) => {
    const button = event.target.closest(".lang button");
    if (!button || button.dataset.lang === LANG) return;
    try { localStorage.setItem("lenusa-lang", button.dataset.lang); } catch (e) { /* tanpa penyimpanan: pilihan tidak diingat */ }
    location.reload();
  });
})();

if (document.querySelector(".hero")) {
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

/* hero cards open the matching "What Lenusa Offers" card: scroll to it and open it (hover opens the others as before) */
const pillarCards = [...document.querySelectorAll(".pillar-card")];
const closePillars = () => pillarCards.forEach((c) => c.classList.remove("is-open"));
let openedAt = 0; /* the page scrolling under a still cursor must not close the card we just opened */
pillarCards.forEach((c) =>
  ["pointerenter", "focusin"].forEach((ev) =>
    c.addEventListener(ev, () => {
      if (!c.classList.contains("is-open") && Date.now() - openedAt > 1500) closePillars();
    })
  )
);
document.querySelectorAll(".hero-card").forEach((a) =>
  a.addEventListener("click", (e) => {
    const target = document.querySelector(a.getAttribute("href"));
    if (!target) return;
    e.preventDefault();
    closePillars();
    target.classList.add("is-open");
    openedAt = Date.now();
    target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
    /* the opened card and the one that closes animate their height while the page scrolls, which leaves the target off-centre: centre it once more when the animation is done (skipped if the visitor scrolled meanwhile) */
    let moved = false;
    document.documentElement.classList.add("pillar-scrolling"); /* the cursor must not open (and so resize) the cards it scrolls under */
    const stop = () => (moved = true);
    ["wheel", "touchstart", "keydown"].forEach((ev) => addEventListener(ev, stop, { once: true, passive: true }));
    setTimeout(() => {
      ["wheel", "touchstart", "keydown"].forEach((ev) => removeEventListener(ev, stop));
      const r = target.getBoundingClientRect();
      if (!moved && Math.abs(r.top + r.height / 2 - innerHeight / 2) > 40) target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
      setTimeout(() => document.documentElement.classList.remove("pillar-scrolling"), 1000);
    }, 1300);
  })
);

const scrollRevealTargets = document.querySelectorAll(
  ".pillars > .intro, .pillars > .pillar-cards, " +
    ".cal .cal-hero__in, .cal .cal__top, .cal .cal__main, .cal .cal__side, " +
    ".brochure > .brochure-intro, .brochure > .slider, .brochure > .wipe-button, " +
    ".contact-cta .cta-col"
);
if (!reduceMotion && "IntersectionObserver" in window && scrollRevealTargets.length) {
  const staggeredCards = document.querySelectorAll(
    ".pillars .pillar-card"
  );
  staggeredCards.forEach((card, index) => {
    card.style.setProperty("--reveal-index", index);
  });

  document.documentElement.classList.add("has-scroll-reveal");
  const scrollRevealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.15 }
  );
  scrollRevealTargets.forEach((target) => scrollRevealObserver.observe(target));
}


(() => {
  const track = document.querySelector(".track");
  if (!track) return;

  const slider = track.closest(".slider");
  const slides = [...track.children];
  const previous = slider.querySelector('.arrow[data-dir="-1"]');
  const next = slider.querySelector('.arrow[data-dir="1"]');
  const interval = 3000;
  const autoplay = true;
  const mobile = matchMedia("(max-width: 900px)");

  let timer = null;
  let stopped = false;
  let focused = false;
  let atEnd = false;
  let drag = null;
  let suppressClick = false;

  const gap = () => parseFloat(getComputedStyle(track).columnGap) || 0;
  const step = () => slides[0].offsetWidth + gap();
  const maxScroll = () => track.scrollWidth - track.clientWidth;

  function update() {
    const max = maxScroll();
    previous.disabled = track.scrollLeft <= 2;
    atEnd = track.scrollLeft >= max - 2;
    next.disabled = atEnd;

    if (drag?.moved) return;
    const front = atEnd ? slides.length - 1 : Math.round(track.scrollLeft / step());
    slides.forEach((slide, index) => {
      slide.classList.toggle("is-active", max <= 2 || index === front);
    });
  }

  function goTo(index) {
    track.scrollTo({ left: Math.min(index * step(), maxScroll()), behavior: "smooth" });
  }

  function go(direction) {
    track.scrollBy({ left: direction * step(), behavior: "smooth" });
  }

  function stopAuto() {
    stopped = true;
    clearInterval(timer);
  }

  function tick() {
    if (!mobile.matches || stopped || focused || slider.matches(":hover")) return;
    if (atEnd) return stopAuto();
    go(1);
  }

  function snap() {
    const max = maxScroll();
    if (track.scrollLeft >= max - step() / 2) {
      track.scrollTo({ left: max, behavior: "smooth" });
      return;
    }
    goTo(Math.round(track.scrollLeft / step()));
  }

  previous.addEventListener("click", () => {
    stopAuto();
    go(-1);
  });
  next.addEventListener("click", () => {
    stopAuto();
    go(1);
  });

  track.addEventListener("scroll", update, { passive: true });
  track.addEventListener("wheel", stopAuto, { passive: true });
  track.addEventListener("keydown", stopAuto);
  slider.addEventListener("pointerdown", stopAuto);
  window.addEventListener("resize", update);
  mobile.addEventListener("change", update);

  window.addEventListener("blur", () => {
    setTimeout(() => {
      if (slider.contains(document.activeElement)) stopAuto();
    });
  });

  slider.addEventListener("focusin", () => {
    focused = true;
  });
  slider.addEventListener("focusout", () => {
    focused = false;
  });

  track.addEventListener("pointerdown", (event) => {
    if (!mobile.matches || event.pointerType !== "mouse" || event.button !== 0) return;
    drag = { x: event.clientX, left: track.scrollLeft, moved: false };
  });

  track.addEventListener("pointermove", (event) => {
    if (!drag) return;
    if (event.buttons === 0) return endDrag();

    const delta = event.clientX - drag.x;
    if (!drag.moved && Math.abs(delta) > 5) {
      drag.moved = true;
      track.classList.add("dragging");
      track.setPointerCapture(event.pointerId);
    }
    if (drag.moved) track.scrollLeft = drag.left - delta;
  });

  function endDrag() {
    if (!drag) return;
    const moved = drag.moved;
    drag = null;
    if (!moved) return;

    stopAuto();
    suppressClick = true;
    setTimeout(() => {
      suppressClick = false;
    }, 100);
    track.classList.remove("dragging");
    update();
    snap();
  }

  track.addEventListener("pointerup", endDrag);
  track.addEventListener("pointercancel", endDrag);
  track.addEventListener("lostpointercapture", endDrag);
  track.addEventListener(
    "click",
    (event) => {
      if (suppressClick) {
        event.preventDefault();
        event.stopPropagation();
      }
    },
    true
  );
  track.addEventListener("dragstart", (event) => event.preventDefault());

  update();
  if (autoplay && !reduceMotion) timer = setInterval(tick, interval);
})();
}

/* About page interactions */
(() => {
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const vm = document.querySelector(".vm");

  if (reduceMotion) return; // static layout, no animations

  /* ---------- fade-in on scroll (once per element) ---------- */
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add("is-in");
        io.unobserve(e.target);
      }),
    { threshold: 0.15, rootMargin: "0px 0px -6% 0px" }
  );
  document.querySelectorAll("[data-fade], [data-fade-left], [data-fade-right]").forEach((el) => io.observe(el));

  /* ---------- Vision & Mission scrollytelling ----------
     One progress value p (0 when the stage gets pinned, 1 when it is released). The value eases toward the scroll
     position every frame, so text and photos glide instead of jumping. */
  if (!vm) return;
  const stage = vm.querySelector(".vm__stage");
  const head = vm.querySelector(".vm__head");

  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const seg = (p, a, b) => clamp((p - a) / (b - a));
  const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

  let total = 1;
  let target = 0;
  let current = 0;
  let frame = 0;
  let ready = false;
  let finished = false;
  const END = 0.74; // the animation windows above end at 0.74; they are stretched to fill the whole (shortened) pinned scroll
  const last = {};

  // write a CSS variable only when its value changed
  const set = (name, value) => {
    const s = value.toFixed(4);
    if (last[name] === s) return;
    last[name] = s;
    stage.style.setProperty(name, s);
  };

  const render = (p) => {
    // p = 0 when the photo is pinned, p = 1 when the section is released toward Our Team
    // wide windows + easeOut, paced like the Groundwater process (about half a screen per fade)
    const ease = (t) => 1 - Math.pow(1 - t, 3);
    p = clamp(p / END); // the last animation (mission photos) ends exactly where the pin is released
    set("--hero-in", ease(seg(p, 0.0, 0.06)));           // "Vision & Mission" fades in
    set("--lift", easeInOutCubic(seg(p, 0.08, 0.2)));    // ...then moves up
    set("--vision", ease(seg(p, 0.2, 0.34)));            // Our Vision text fades in
    set("--vision-img", ease(seg(p, 0.3, 0.44)));        // vision photo stack appears
    set("--mission", ease(seg(p, 0.5, 0.64)));          // Our Mission text fades in
    set("--mission-img", ease(seg(p, 0.6, 0.74)));      // mission photo stack appears
    // finished: everything stays on screen and the section scrolls on to Our Team right away
    const isReady = p >= 0.999;
    if (isReady !== ready) {
      ready = isReady;
      stage.classList.toggle("is-ready", ready);
    }
  };

  let prevT = 0;
  const tick = (t) => {
    frame = 0;
    target = clamp(-vm.getBoundingClientRect().top / total);
    const dt = prevT ? Math.min(t - prevT, 50) : 16; // time-based easing: same glide on 60 and 120 Hz screens
    prevT = t;
    current += (target - current) * (1 - Math.exp(-dt / 110));
    if (Math.abs(target - current) < 0.0002) current = target;
    // like Our Process: once the intro has played to the end it stays finished; scrolling back up does not replay it
    if (finished) { target = current = 1; }
    else if (current >= 0.9995) finished = true;
    render(current);
    if (current !== target) frame = requestAnimationFrame(tick);
    else prevT = 0;
  };
  const request = () => {
    if (!frame) frame = requestAnimationFrame(tick);
  };

  const measure = () => {
    total = Math.max(vm.offsetHeight - window.innerHeight, 1);
    // the title block starts at 45% of the screen height; --vm-drop is how far it must travel up
    const drop = stage.clientHeight * 0.45 - (head.offsetTop + head.offsetHeight / 2);
    stage.style.setProperty("--vm-drop", `${Math.max(drop, 0)}px`);
    request();
  };

  addEventListener("scroll", request, { passive: true });
  addEventListener("resize", measure, { passive: true });
  measure();
})();

/* ---------- Our Team carousel ----------
   Native horizontal scroll: touch swipe and trackpad work by themselves.
   JS adds the arrows, mouse dragging and a slow marquee (looped with cloned cards) that stops on hover or focus.
   With reduced motion there is no marquee and the row snaps card by card as before. */
(() => {
  const root = document.querySelector(".ot");
  if (!root) return;
  const view = root.querySelector(".ot__viewport");
  const prev = root.querySelector('.ot__arrow[data-dir="-1"]');
  const next = root.querySelector('.ot__arrow[data-dir="1"]');
  const cards = [...view.querySelectorAll(".ot-card")];
  if (cards.length < 3) return;

  // distance between two card starts (hovered card widens symmetrically, so use a two-card span)
  const step = () => (cards[2].offsetLeft - cards[0].offsetLeft) / 2;
  const sync = () => {
    if (marquee) { prev.disabled = next.disabled = false; return; } // the row loops, so both ways are always open
    prev.disabled = view.scrollLeft <= 1;
    next.disabled = view.scrollLeft >= view.scrollWidth - view.clientWidth - 1;
  };
  const marquee = !matchMedia("(prefers-reduced-motion: reduce)").matches;
  const track = view.querySelector(".ot__track");
  let hold = 0; // the marquee waits until this time (arrows and drags scroll on their own first)
  if (marquee) {
    cards.forEach((c) => {
      const k = c.cloneNode(true);
      k.setAttribute("aria-hidden", "true");
      k.querySelectorAll("a").forEach((a) => (a.tabIndex = -1));
      track.append(k);
    });
    view.classList.add("is-marquee");
  }
  const loop = () => track.children[cards.length].offsetLeft - cards[0].offsetLeft; // one full set of cards
  const go = (dir) => {
    hold = performance.now() + 900;
    if (marquee && dir < 0 && view.scrollLeft < step()) view.scrollLeft += loop(); // wrap before stepping back
    view.scrollBy({ left: dir * step(), behavior: "smooth" });
  };
  prev.addEventListener("click", () => go(-1));
  next.addEventListener("click", () => go(1));
  view.addEventListener("scroll", () => {
    if (marquee && view.scrollLeft >= loop()) view.scrollLeft -= loop();
    sync();
  }, { passive: true });
  addEventListener("resize", sync, { passive: true });
  sync();

  // mouse drag (touch already scrolls natively)
  let down = false, moved = false, startX = 0, startLeft = 0;
  view.addEventListener("pointerdown", (e) => {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    down = true;
    moved = false;
    startX = e.clientX;
    startLeft = view.scrollLeft;
  });
  addEventListener("pointermove", (e) => {
    if (!down) return;
    const dx = e.clientX - startX;
    if (!moved && Math.abs(dx) > 5) {
      moved = true;
      view.classList.add("is-dragging");
    }
    if (moved) view.scrollLeft = startLeft - dx;
  });
  addEventListener("pointerup", () => {
    if (!down) return;
    down = false;
    if (!moved) return;
    view.classList.remove("is-dragging");
    hold = performance.now() + 900;
    if (!marquee) {
      const s = step();
      view.scrollTo({ left: Math.round(view.scrollLeft / s) * s, behavior: "smooth" });
    }
    setTimeout(() => { moved = false; }, 0);
  });
  // a drag that ends on a contact icon must not open the link
  view.addEventListener("click", (e) => {
    if (moved) { e.preventDefault(); e.stopPropagation(); }
  }, true);
  view.addEventListener("dragstart", (e) => e.preventDefault());

  if (!marquee) return;
  const SPEED = 28; // px per second: slow drift
  let pos = view.scrollLeft, t0 = 0;
  const hoverable = matchMedia("(hover: hover)");
  const tick = (t) => {
    const dt = t0 ? Math.min(t - t0, 64) / 1000 : 0;
    t0 = t;
    const paused = (hoverable.matches && view.matches(":hover")) || view.contains(document.activeElement);
    if (paused || down || t < hold) pos = view.scrollLeft;
    else {
      pos += SPEED * dt;
      if (pos >= loop()) pos -= loop();
      view.scrollLeft = pos;
    }
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
})();

/* Event calendar data layer (home page). Source: Canva "Booklet - Event Calender" pages 20-23 (Diklat & Sertifikasi,
   Public Training and Online Training 2027), as transcribed by the user.
   A session is [month 1-12, first day, last day]. Later: replace all() with a fetch to the WordPress REST API. */
(() => {
  const YEAR = 2027;
  const CATEGORIES = [
    { id: "diklat", name: "Diklat Sertifikasi" },
    { id: "public", name: "Public Training" },
    { id: "online", name: "Online Training" },
    { id: "inhouse", name: "In-house Training" },
  ];
  /* Diklat & Sertifikasi: every program runs on the same 12 dates */
  const DIKLAT_DATES = [[1, 21, 24], [2, 11, 14], [3, 18, 21], [4, 15, 18], [5, 13, 16], [6, 24, 27], [7, 22, 25], [8, 19, 22], [9, 16, 19], [10, 14, 17], [11, 18, 21], [12, 16, 19]];
  /* [title, poster file in assets/images/training/posters/diklat, [offline price, online price]] (prices as on the poster, excl. PPn; one number = offline only) */
  const DIKLAT = [
    ["Pengawas Operasional (POP, POM, POU)", "pengawas-operasional-pop-pom-pou.jpg", [6500000, 4500000]],
    ["Teknisi Pengambilan Data Lapangan Geoteknik Tambang", "teknisi-pengambilan-data-lapangan-geoteknik-tambang.jpg", [9500000]],
    ["Teknisi Pengujian Sampel Geoteknik Tambang di Laboratorium", "teknisi-pengujian-sampel-geoteknik-tambang-di-laboratorium.jpg", [9500000]],
    ["Teknisi Pemantauan Geoteknik Tambang", "teknisi-pemantauan-geoteknik-tambang.jpg", [9500000]],
    ["Perencanaan Kegiatan Geoteknik Tambang Mineral dan Batubara", "perencanaan-kegiatan-geoteknik-tambang-mineral-dan-batubara.jpg", [16850000]],
    ["Pelaksanaan Kegiatan Geoteknik Tambang Mineral dan Batubara", "pelaksanaan-kegiatan-geoteknik-tambang-mineral-dan-batubara.jpg", [16850000]],
    ["Ahli Pelaporan Hasil Kegiatan Eksplorasi Terperinci Mineral/Batubara", "ahli-pelaporan-hasil-kegiatan-eksplorasi-terperinci-mineral-batubara.jpg", [16850000]],
    ["Ahli Pemodelan dan Estimasi Sumber Daya Mineral/Batubara", "ahli-pemodelan-dan-estimasi-sumber-daya-mineral-batubara.jpg", [16850000]],
    ["Ahli Estimasi Cadangan Mineral/Batubara", "ahli-estimasi-cadangan-mineral-batubara.jpg", [16850000]],
    ["Perencanaan Operasional Tambang Terbuka Jangka Pendek", "perencanaan-operasional-tambang-terbuka-jangka-pendek.jpg", [16850000]],
    ["Perencanaan Operasional Tambang Terbuka Jangka Panjang", "perencanaan-operasional-tambang-terbuka-jangka-panjang.jpg", [16850000]],
    ["Perencanaan Reklamasi pada Kegiatan Pertambangan Mineral dan Batubara", "perencanaan-reklamasi-pada-kegiatan-pertambangan-mineral-dan-batubara.jpg", [16850000]],
    ["Pelaksanaan Reklamasi pada Kegiatan Pertambangan Mineral dan Batubara", "pelaksanaan-reklamasi-pada-kegiatan-pertambangan-mineral-dan-batubara.jpg", [16850000]],
    ["Perencanaan Pascatambang Mineral dan Batubara", "perencanaan-pascatambang-mineral-dan-batubara.jpg", [15500000]],
    ["Pelaksanaan Pascatambang Mineral dan Batubara", "pelaksanaan-pascatambang-mineral-dan-batubara.jpg", [15500000]],
    ["Pelaksanaan Pemantauan Pascatambang Mineral dan Batubara", "pelaksanaan-pemantauan-pascatambang-mineral-dan-batubara.jpg", [15500000]],
  ].map(([title, file, price]) => ({ cat: "diklat", title, sessions: DIKLAT_DATES, price, image: `assets/images/training/posters/diklat/${file}` }));

  const PUBLIC = [
    ["Mechanical Maintenance for Reliable Equipment Operation", [[1, 11, 12], [6, 3, 4]], "1-mechanical-maintenance.webp", [8000000, 5000000]],
    ["Heavy Equipment Operation for Safe and Productive Performance", [[1, 19, 20], [9, 2, 3]], "2-heavy-equipment-operation-for-safe-and-productive-performancemaintenance.webp", [8000000, 5000000]],
    ["Blasting Operation for Safe, Efficient, and Cost-Controlled Result", [[6, 22, 23], [11, 2, 3]], "3-blasting-operation-for-safe-efficient-and-cost-controlled-result-trainer.webp", [8000000, 5000000]],
    ["Stockpile Management for Material Quality and Inventory Control", [[3, 18, 19], [8, 3, 4]], "4-stockpile-management-for-material-quality-and-inventory-control.webp", [8000000, 5000000]],
    ["Hauling Road Maintenance to Sustain Fleet Efficiency", [[5, 4, 5], [10, 12, 13]], "5-hauling-road-maintenance-to-sustain-fleet-efficiency.webp", [8000000, 5000000]],
    ["Port Operations for Efficient Logistics Performance", [[6, 29, 30], [12, 18, 19]], "6-port-operations-for-efficient-logistics-performance.webp", [8000000, 5000000]],
    ["Carbon Management and Emission Reduction", [[1, 25, 26], [9, 20, 21]], "8-carbon-management-and-emission-reduction.webp", [8000000, 5000000]],
    ["Reclamation and Post-Mining Management for Sustainable Closure", [[5, 18, 19], [10, 19, 20]], "9-reclamation-and-post-mining-management-for-sustainable-closure.webp", [8000000, 5000000]],
    ["Mining Operation Planning and Evaluation for Effective Production", [[6, 10, 11], [12, 16, 17]], "7-mining-operation-planning-and-evaluation-for-effective-production-trainer.webp", [8000000, 5000000]],
    ["Strategic Mud Management for Open Pit Mining Operations", [[4, 21, 23], [10, 21, 23]], "10-strategic-mud-management-for-open-pit-mining-operations.webp", [12000000, 8000000]],
    ["Market Studies And Financial Model For Metal Minerals", [[2, 2, 4], [4, 6, 8], [7, 6, 8], [10, 5, 7]], "kajian-bidang-diskontinuitas-pada-lereng-tambang.jpg", [12500000]],
    ["Introduction to Groundwater Modeling for Open Pit Mining", [[1, 6, 8], [4, 14, 16], [9, 8, 10], [11, 24, 26]], "kajian-bidang-diskontinuitas-pada-lereng-tambang-2.webp", [13000000]],
    ["Strategic Mine Slope Design", [[1, 13, 15], [5, 12, 14], [7, 14, 16], [11, 10, 12]], "proses-desain-lereng-tambang-terbuka.webp", [9000000]],
    ["Geoteknik Timbunan Tambang", [[1, 27, 29], [4, 28, 30], [8, 11, 13], [10, 27, 29]], "geoteknik-timbunan-tambang.webp", [9000000]],
    ["Analisis Balik Pada Longsoran Lereng Tambang", [[3, 22, 24], [5, 26, 28], [8, 25, 27], [12, 8, 10]], "analisis-balik-pada-longsoran-lereng-tambang.webp", [9000000]],
    ["Kajian Bidang Diskontinuitas Pada Lereng Tambang", [[3, 29, 31], [6, 16, 18], [9, 22, 24], [12, 15, 17]], "kajian-bidang-diskontinuitas-pada-lereng-tambang-4.webp", [9000000]],
  ].map(([title, sessions, file, price]) => ({ cat: "public", title, sessions, price, image: encodeURI(`assets/images/training/posters/public/${file}`) }));

  /* day 0 = the source gives only the month */
  const ONLINE = [
    ["SWAT-Based Hydrological Modeling for Mining Impact Assessment", [1, 16, 16]],
    ["Basic Knowledge Pit Optimasi dengan Metode Incremental SR Mengacu pada BESR", [1, 30, 30]],
    ["Introduction to Geostatistic Applied for Ore Grade Estimation", [2, 13, 13]],
    ["Analisa Kinematika dan Rekomendasi Potensi Longsor pada Dinding Tambang", [2, 27, 27]],
    ["Geoteknik Tambang Terbuka Untuk Pemula", [3, 0, 0]],
    ["Fundamental Geostatistics with Case Study of Gold Deposits", [3, 27, 27]],
    ["Understanding QAQC and Database in Mining", [4, 3, 3]],
    ["From Seepage to Stability: Hydrogeological Modeling for Mine Waste Dump Facilities", [4, 17, 17]],
    ["Peran Hidrologi dalam Strategi Reklamasi Tambang Berkelanjutan", [5, 8, 8]],
    ["Project Assessment: Konsep Dasar Evaluasi Proyek Pertambangan Batubara", [5, 22, 22]],
    ["Teknik Penyusunan Laporan Sumber Daya Batubara", [6, 5, 5]],
    ["Understanding Nickel Laterite Resource Estimation: From Concept to Practice", [6, 18, 20]],
    ["Breaking Into the Global Mining Industry", [7, 3, 3]],
    ["Pit Optimization Methodology for Efficiency and Profit in Nickel Mining", [7, 17, 17]],
    ["Empirical, Analytical, and Numerical Approaches to Underground Stability", [8, 14, 14]],
    ["Geological Modeling and Geostatistics for Nickel Laterite Resource Model", [8, 28, 28]],
    ["Geostatistical Methods for Grade Estimation: Application of Conditional Simulation", [9, 11, 11]],
    ["Tahapan Eksplorasi Emas: Dari Reconnaissance hingga Detail Exploration", [9, 25, 25]],
    ["Evaluasi Risiko Hidrologi dalam Kegiatan Operasi Penambangan", [10, 2, 2]],
    ["Practical QAQC for Nickel Mining: From Pit Sampling to Stockpile Reconciliation", [10, 16, 17]],
    ["Optimisasi Pit Batubara: Incremental SR & BESR", [11, 13, 13]],
    ["Mastering Variograms: From Theory to Practice", [11, 27, 27]],
    ["Fundamental Database Validation for Nickel Laterite Deposit", [12, 11, 12]],
    ["Manajemen Alat Berat yang Efektif-Efisien dan Estimasi Unit Cost Penambangan", [12, 18, 18]],
  ].map(([title, session]) => ({ cat: "online", title, sessions: [session] }));

  const DATA = [...DIKLAT, ...PUBLIC, ...ONLINE].map((e, i) => ({ id: i + 1, ...e }));

  window.EventData = { YEAR, CATEGORIES, items: () => DATA, all: async () => DATA };
})();

/* Training detail content, written from the posters in assets/images/training/posters (Diklat: scheme text, competency units, applicant requirements;
   Public: "Apa yang akan Anda kuasai", target participants, facilitator). Keyed by the training title used in EventData.
   d = lines under the title, o = description paragraphs, m = "Materi Training" list, a = target participants / requirements. */
(() => {
  const DIKLAT_NOTE = "Diklat dan sertifikasi kompetensi, Bali, Indonesia.";
  const GEO_REG = "Pengelolaan geoteknik tambang pada tambang terbuka mineral dan batubara wajib dilakukan oleh orang yang berkompeten (Permen ESDM No. 26 Tahun 2018 dan Kepmen ESDM No. 1827.K/20/MEM/2018).";
  const GEO_SKEMA = "Sehubungan dengan implementasi Peraturan Menteri ESDM No. 26 Tahun 2018 dan Keputusan Menteri ESDM No. 1827.K/20/MEM/2018 tentang Pedoman Pelaksanaan Kaidah Teknik Pertambangan yang Baik, dalam penyusunan Rencana Kerja dan Anggaran Biaya (RKAB) perusahaan pertambangan mineral dan batubara, khususnya terkait pengelolaan geoteknik tambang pada tambang terbuka, kegiatan ini harus dilakukan oleh orang yang berkompeten.";
  const EXPL_SKEMA = "Mencakup keahlian dalam menyusun Rencana Kerja dan Anggaran Biaya (RKAB) pertambangan mineral dan batubara sesuai Peraturan Menteri ESDM No. 26 Tahun 2018 dan Keputusan Menteri ESDM No. 1827.K/20/MEM/2018 tentang Pedoman Pelaksanaan Kaidah Teknik Pertambangan yang Baik. Kompetensi ini meliputi pelaporan hasil eksplorasi, estimasi sumber daya, serta estimasi cadangan mineral dan batubara, dengan keterampilan mengolah, memvalidasi, dan menyajikan data secara akurat hingga menjadi laporan teknis yang sesuai ketentuan regulasi dan standar profesional.";
  const PASCA_SKEMA = "Sehubungan dengan implementasi Peraturan Menteri ESDM No. 26 Tahun 2018 dan Keputusan Menteri ESDM No. 1827.K/20/MEM/2018 tentang Pedoman Pelaksanaan Kaidah Teknik Pertambangan yang Baik, dalam penyusunan Rencana Kerja dan Anggaran Biaya (RKAB) perusahaan pertambangan mineral dan batubara, khususnya terkait kegiatan pengelolaan pascatambang, kegiatan ini harus dilakukan oleh orang yang berkompeten.";
  const AUD_GEO = (job) => `Pendidikan jurusan Teknik Pertambangan atau Teknik Geologi, serta berpengalaman pada jabatan ${job}: D3 dengan pengalaman kerja minimal 3 tahun, atau S1 dengan pengalaman kerja minimal 1 tahun, atau tenaga profesional dengan pengalaman minimal 5 tahun pada jabatan tersebut`;
  const AUD_PLAN = "Mampu melakukan demonstrasi konseptual untuk mendukung pekerjaan | Diutamakan memiliki sertifikat pelatihan atau bukti prestasi | Pendidikan minimal S1 Teknik Pertambangan atau Teknik Geologi dengan pengalaman pada pekerjaan Perencanaan Kegiatan Geoteknik Tambang Mineral dan Batubara: WNI minimal 5 tahun, tenaga kerja asing minimal 10 tahun dan melampirkan izin kerja di Indonesia, atau tenaga profesional di luar kategori tersebut minimal 15 tahun";
  const AUD_EXPL = "Mampu melakukan demonstrasi konseptual untuk mendukung pekerjaan | Diutamakan memiliki sertifikat pelatihan atau bukti prestasi | Pendidikan minimal S1 di bidang Pertambangan, Geologi, atau Geofisika (ilmu kebumian) dengan pengalaman di bidang Kegiatan Eksplorasi Terperinci Mineral/Batubara dan studi kelayakan: WNI minimal 5 tahun, atau tenaga kerja asing minimal 10 tahun dan melampirkan izin kerja di Indonesia";
  const AUD_PASCA = (job) => `D3 Teknik Pertambangan/Geologi dengan pengalaman minimal 10 tahun di bidang ${job} | S1 Teknik Pertambangan/Geologi dengan pengalaman minimal 5 tahun di bidang ${job} | Tenaga kerja asing (TKA): S1 Teknik Pertambangan/Geologi, pengalaman minimal 10 tahun di bidang terkait, dan wajib memiliki izin kerja di Indonesia | Tenaga profesional dengan pengalaman minimal 15 tahun di bidang ${job}`;
  const AUD_REKLAMASI = (job, d3, tka) => `Pendidikan minimal S1 jurusan Teknik Pertambangan/Geologi/Sipil atau Lingkungan/Kehutanan/Pertanian dan berpengalaman minimal 3 tahun di bidang ${job} | Pendidikan minimal D3 jurusan Teknik Pertambangan/Geologi/Sipil dan berpengalaman minimal ${d3} tahun di bidang ${job} | Bagi expatriate pendidikan setara S1 dari jurusan yang sama dan berpengalaman minimal ${tka} tahun di bidang ${job}, serta melampirkan surat izin bekerja di Indonesia`;

  const D = {
    "Pengawas Operasional (POP, POM, POU)": {
      d: ["Pengawas Operasional Pertama (POP) adalah orang yang ditunjuk oleh KTT/PTL dan bertanggung jawab melakukan inspeksi, pemeriksaan, dan pengujian kegiatan operasional pertambangan di wilayah tanggung jawabnya.", "Sesuai Permen ESDM No. 43/2016 dan Kepmen ESDM No. 1827.K/20/MEM/2018, tugas ini wajib dilakukan oleh orang yang berkompeten sesuai kaidah teknik pertambangan minerba yang baik.", "Diklat dan sertifikasi kompetensi, online dan offline (Bali)."],
      o: ["Pengawas Operasional Pertama (POP) adalah orang yang ditunjuk oleh KTT/PTL dan bertanggung jawab kepada KTT/PTL untuk melakukan inspeksi, pemeriksaan, dan pengujian kegiatan operasional pertambangan di wilayah tanggung jawabnya. Sesuai Permen ESDM No. 43/2016 dan Kepmen ESDM No. 1827.K/20/MEM/2018, tugas ini wajib dilakukan oleh orang yang berkompeten sesuai kaidah teknik pertambangan minerba yang baik."],
      m: ["Melaksanakan Peraturan Perundang-undangan terkait Keselamatan Pertambangan", "Melaksanakan Tugas dan Tanggung Jawab Keselamatan Pertambangan pada Area yang Menjadi Tanggung Jawabnya", "Melaksanakan Pertemuan Keselamatan Pertambangan Terencana", "Melaksanakan Investigasi Kecelakaan", "Melaksanakan Identifikasi Bahaya dan Pengendalian Resiko", "Melaksanakan Peraturan Perundang-undangan terkait Perlindungan Lingkungan", "Melaksanakan Inspeksi", "Melaksanakan Analisis Keselamatan Pekerjaan"],
      a: "Pendidikan minimal SLTA/D3/S1/S2/S3 semua jurusan | Pengalaman di bidang pertambangan mineral dan/atau batubara: SLTA minimal 10 tahun, D3 minimal 3 tahun, S1/S2/S3 minimal 1 tahun | Sekurang-kurangnya adalah pengawas tim atau memiliki sekurang-kurangnya 2 (dua) anak buah | Bagi expatriate melampirkan surat izin bekerja di Indonesia",
    },
    "Teknisi Pengambilan Data Lapangan Geoteknik Tambang": {
      d: ["Diklat dan sertifikasi skema Teknisi Pengambilan Data Lapangan Geoteknik Tambang (TAG), SKKNI No. 083 Tahun 2021.", GEO_REG, DIKLAT_NOTE],
      o: [GEO_SKEMA],
      m: ["Menerapkan Peraturan Pelaksanaan Pekerjaan Geoteknik", "Melaksanakan Komunikasi Timbal Balik", "Melakukan penyelidikan geoteknik", "Melaksanakan pengolahan data hasil penyelidikan geoteknik", "Menyusun dan Mempresentasikan Laporan"],
      a: AUD_GEO("Teknisi Pengambilan Data Lapangan Geoteknik Tambang"),
    },
    "Teknisi Pengujian Sampel Geoteknik Tambang di Laboratorium": {
      d: ["Diklat dan sertifikasi skema Teknisi Pengujian Sampel Geoteknik Tambang di Laboratorium (TUG), SKKNI No. 083 Tahun 2021.", GEO_REG, DIKLAT_NOTE],
      o: [GEO_SKEMA],
      m: ["Menerapkan Peraturan, Pelaksanaan Pekerjaan Geoteknik", "Melaksanakan Komunikasi Timbal Balik", "Mempersiapkan sampel yang akan diuji", "Melakukan pengujian sampel geoteknik", "Menyusun dan Mempresentasikan Laporan"],
      a: AUD_GEO("Teknisi Pengujian Sampel Geoteknik Tambang di Laboratorium"),
    },
    "Teknisi Pemantauan Geoteknik Tambang": {
      d: ["Diklat dan sertifikasi skema Teknisi Pemantauan Geoteknik Tambang (TPG), SKKNI No. 083 Tahun 2021.", GEO_REG, DIKLAT_NOTE],
      o: [GEO_SKEMA],
      m: ["Menerapkan Peraturan, Pelaksanaan Pekerjaan Geoteknik", "Melaksanakan Komunikasi Timbal Balik", "Melakukan inspeksi geoteknik tambang", "Melaksanakan pemantauan geoteknik tambang", "Menindaklanjuti hasil pemantauan geoteknik", "Menyusun dan Mempresentasikan Laporan"],
      a: AUD_GEO("Teknisi Pemantauan Geoteknik Tambang"),
    },
    "Perencanaan Kegiatan Geoteknik Tambang Mineral dan Batubara": {
      d: ["Diklat dan sertifikasi skema Perencanaan Kegiatan Geoteknik Tambang Mineral dan Batubara (RGT), SKKNI No. 083 Tahun 2021.", "Mencakup keahlian merencanakan pengambilan data dan penyelidikan geoteknik, hingga mengolah dan memvalidasi data menjadi model geoteknik.", DIKLAT_NOTE],
      o: ["Mencakup keahlian dalam merencanakan pengambilan data serta penyelidikan geoteknik, hingga kemampuan untuk mengolah serta memvalidasi data hingga menjadi sebuah model geoteknik yang berisi karakterisasi, identifikasi, dan rekomendasi terkait manajemen maupun desain geoteknik tambang."],
      m: ["Menerapkan Peraturan Pelaksanaan Pekerjaan Geoteknik", "Melaksanakan Komunikasi Timbal Balik", "Mengumpulkan Data Kondisi Geologi Regional dan Lokal", "Merencanakan Penyelidikan Geoteknik", "Merencanakan Biaya Kegiatan Geoteknik Tambang", "Mempersiapkan Sampel yang Akan Diuji", "Melakukan Pengujian Sampel Geoteknik", "Mengolah Data Geoteknik yang Sudah Diverifikasi", "Melaksanakan Analisis Geoteknik Tambang", "Menyusun dan Mempresentasikan Laporan"],
      a: AUD_PLAN,
    },
    "Pelaksanaan Kegiatan Geoteknik Tambang Mineral dan Batubara": {
      d: ["Diklat dan sertifikasi skema Pelaksanaan Kegiatan Geoteknik Tambang Mineral dan Batubara (LGT), SKKNI No. 083 Tahun 2021.", "Keahlian menjalankan hasil rekomendasi penyelidikan geoteknik tambang: inspeksi, pemantauan, tindak lanjut hingga back analysis dan perencanaan tindak lanjut desain.", DIKLAT_NOTE],
      o: ["Keahlian dalam komitmen menjalankan apa yang telah ada dalam hasil rekomendasi penyelidikan geoteknik tambang. Termasuk inspeksi geoteknik, pelaksanaan pemantauan geoteknik, tindak lanjut pemantauan hingga back analysis dan perencanaan tindak lanjut desain geoteknik yang selalu dinamis mengikuti kemajuan tambang."],
      m: ["Menerapkan Peraturan Pelaksanaan Pekerjaan Geoteknik", "Melaksanakan Komunikasi Timbal Balik", "Melakukan Penyelidikan Geoteknik", "Melaksanakan Pengolahan Data Hasil Penyelidikan Geoteknik", "Membuat Laporan Rekomendasi Geoteknik Tambang", "Melaksanakan Pengelolaan Risiko", "Melakukan Inspeksi Geoteknik Tambang", "Melaksanakan Pemantauan Geoteknik Tambang", "Menindaklanjuti Hasil Pemantauan Geoteknik", "Melaksanakan Analisis Geoteknik Lanjutan untuk Perbaikan", "Menyusun dan Mempresentasikan Laporan"],
      a: AUD_PLAN,
    },
    "Ahli Pelaporan Hasil Kegiatan Eksplorasi Terperinci Mineral/Batubara": {
      d: ["Diklat dan sertifikasi skema Ahli Pelaporan Hasil Kegiatan Eksplorasi Terperinci Mineral (AEM) dan Batubara (AEB), SKKNI No. 098 Tahun 2019.", "Kompetensi meliputi pelaporan hasil eksplorasi hingga laporan teknis yang sesuai regulasi dan standar profesional.", DIKLAT_NOTE],
      o: [EXPL_SKEMA],
      m: ["Melaksanakan Komunikasi Timbal Balik", "Melaksanakan Prinsip-Prinsip Keselamatan Kerja (K3) di Tempat Kerja", "Mengevaluasi hasil interpretasi yang dihasilkan pada masing-masing metoda eksplorasi Mineral/Batubara", "Melakukan Verifikasi dan Validasi Data Eksplorasi Mineral/Batubara", "Mengevaluasi Data Teknis Pendukung (Geoteknik, Hidrogeologi, dan Lingkungan)", "Menyusun Laporan Hasil Kegiatan Eksplorasi"],
      a: AUD_EXPL,
    },
    "Ahli Pemodelan dan Estimasi Sumber Daya Mineral/Batubara": {
      d: ["Diklat dan sertifikasi skema Ahli Pemodelan dan Estimasi Sumber Daya Mineral (ASM) dan Batubara (ASB), SKKNI No. 098 Tahun 2019.", "Kompetensi meliputi pemodelan dan estimasi sumber daya hingga laporan teknis yang sesuai regulasi dan standar profesional.", DIKLAT_NOTE],
      o: [EXPL_SKEMA],
      m: ["Melaksanakan Komunikasi Timbal Balik", "Melaksanakan Prinsip-Prinsip Keselamatan Kerja (K3) di Tempat Kerja", "Mengevaluasi hasil interpretasi yang dihasilkan pada masing-masing metoda eksplorasi Mineral/Batubara", "Melakukan Verifikasi dan Validasi Data Eksplorasi Mineral/Batubara", "Membuat model sumber daya endapan", "Melakukan Estimasi, Klasifikasi, dan Pelaporan sumber daya"],
      a: AUD_EXPL,
    },
    "Ahli Estimasi Cadangan Mineral/Batubara": {
      d: ["Diklat dan sertifikasi skema Ahli Estimasi Cadangan Mineral (ACM) dan Batubara (ACB), SKKNI No. 040 Tahun 2019.", "Kompetensi meliputi estimasi cadangan hingga laporan teknis yang sesuai regulasi dan standar profesional.", DIKLAT_NOTE],
      o: [EXPL_SKEMA],
      m: ["Melaksanakan Komunikasi Timbal Balik", "Melaksanakan Prinsip-Prinsip Keselamatan Kerja (K3) di Tempat Kerja", "Melakukan Verifikasi dan Validasi Data Eksplorasi Mineral/Batubara", "Melakukan persiapan estimasi cadangan", "Melakukan proses estimasi cadangan dan pelaporan cadangan", "Menyusun dan Mempresentasikan Laporan"],
      a: AUD_EXPL,
    },
    "Perencanaan Operasional Tambang Terbuka Jangka Pendek": {
      d: ["Diklat dan sertifikasi skema Perencanaan Operasional Tambang Terbuka Jangka Pendek (PTS), SKKNI No. 064 Tahun 2021.", "Unit kompetensi mencakup integrasi data geologi, hidrologi, dan geoteknik, perencanaan sistem penyaliran, serta evaluasi operasional tambang.", DIKLAT_NOTE],
      o: ["Unit kompetensi mencakup integrasi data geologi, hidrologi, dan geoteknik, perencanaan sistem penyaliran, serta evaluasi operasional tambang. Sertifikasi ini penting untuk pengembangan SDM tambang sesuai standar nasional dan internasional, memastikan kesiapan dalam merencanakan tambang dengan efisiensi dan presisi."],
      m: ["Menerima dan Memahami Informasi yang Berkaitan dari Beberapa Sumber", "Melakukan Telaah dari Perencanaan Tambang Terbuka Jangka Panjang", "Melakukan Telaah Geologi, Hidrologi, Hidrogeologi, Geokimia, dan Geoteknik Tambang", "Membuat Perencanaan Tambang Jangka Pendek", "Membuat Rancangan Sistem Penyaliran Tambang untuk Rencana Operasi Tambang Jangka Pendek", "Membuat Perencanaan Tempat dan Desain Penimbunan Batuan dan/atau Tanah Penutup", "Membuat Perencanaan Reklamasi", "Membuat Perencanaan Sarana Prasarana Penunjang Tambang", "Menetapkan Rencana Tambang Terbuka Jangka Pendek", "Mengevaluasi Rencana Tambang Terbuka Jangka Pendek"],
      a: "Pendidikan jurusan Teknik Pertambangan/Geologi/Sipil dan berpengalaman di bidang Perencanaan Operasional Tambang Terbuka Jangka Pendek selama 3 tahun untuk pendidikan minimal S1, 5 tahun untuk pendidikan minimal D3, atau 5 tahun untuk expatriate pendidikan setara S1 dan melampirkan surat izin bekerja di Indonesia",
    },
    "Perencanaan Operasional Tambang Terbuka Jangka Panjang": {
      d: ["Diklat dan sertifikasi skema Perencanaan Operasional Tambang Terbuka Jangka Panjang (PTL), SKKNI No. 063 Tahun 2021.", "Unit kompetensi mencakup integrasi data geologi, hidrologi, dan geoteknik, perencanaan sistem penyaliran, serta evaluasi operasional tambang.", DIKLAT_NOTE],
      o: ["Unit kompetensi mencakup integrasi data geologi, hidrologi, dan geoteknik, perencanaan sistem penyaliran, serta evaluasi operasional tambang. Sertifikasi ini penting untuk pengembangan SDM tambang sesuai standar nasional dan internasional, memastikan kesiapan dalam merencanakan tambang dengan efisiensi dan presisi."],
      m: ["Mencari dan Memilih Informasi dari Beberapa Sumber", "Melakukan Tinjauan Rencana Strategis Perusahaan, Studi Kelayakan, dan Estimasi Cadangan", "Melakukan Tinjauan Rencana Tambang Terbuka Jangka Pendek", "Melakukan Optimisasi Penambangan dan Analisis Sensitivitas", "Melakukan Desain Tambang", "Merencanakan Tambang Terbuka Jangka Panjang", "Merencanakan Sarana dan Prasarana Pendukung Tambang Terbuka", "Menyusun Rencana Reklamasi Tambang Terbuka", "Menganalisis Kinerja Tambang Terbuka", "Menyusun Perencanaan Anggaran", "Menyusun Laporan"],
      a: "Pendidikan jurusan Teknik Pertambangan/Geologi/Sipil dan berpengalaman di bidang Perencanaan Operasional Tambang Terbuka Jangka Panjang selama 4 tahun untuk pendidikan minimal S1, 6 tahun untuk pendidikan minimal D3, atau 5 tahun untuk expatriate pendidikan setara S1 dan melampirkan surat izin bekerja di Indonesia",
    },
    "Perencanaan Reklamasi pada Kegiatan Pertambangan Mineral dan Batubara": {
      d: ["Diklat dan sertifikasi skema Perencanaan Reklamasi pada Kegiatan Pertambangan Mineral dan Batubara (RRP), SKKNI No. 359 Tahun 2020.", "Memberikan kompetensi merancang reklamasi sesuai regulasi: program berkelanjutan, kriteria keberhasilan, dan perencanaan anggaran.", DIKLAT_NOTE],
      o: ["Sertifikasi Perencanaan Reklamasi dalam Pertambangan Mineral dan Batubara bertujuan memberikan kompetensi dalam merancang dan melaksanakan reklamasi sesuai regulasi. Materi mencakup program reklamasi berkelanjutan, kriteria keberhasilan, pengelolaan limbah, dan perencanaan anggaran. Peserta juga mempelajari teknologi terkini untuk pemulihan ekosistem pascatambang. Sertifikasi ini ditujukan bagi profesional di pertambangan, geologi, dan lingkungan untuk mendukung keberlanjutan operasional tambang."],
      m: ["Merencanakan Pembukaan Lahan", "Merencanakan Program Reklamasi", "Merencanakan Kriteria Keberhasilan Reklamasi", "Membuat Perencanaan Biaya Reklamasi"],
      a: AUD_REKLAMASI("Merencanakan Reklamasi pada Kegiatan Pertambangan Minerba", 6, 5),
    },
    "Pelaksanaan Reklamasi pada Kegiatan Pertambangan Mineral dan Batubara": {
      d: ["Diklat dan sertifikasi skema Pelaksanaan Reklamasi pada Kegiatan Pertambangan Mineral dan Batubara (LRP), SKKNI No. 360 Tahun 2020.", "Mencakup persiapan dan pelaksanaan program reklamasi, perawatan areal reklamasi, hingga realisasi biaya pelaksanaan.", DIKLAT_NOTE],
      o: ["Sertifikasi ini mencakup berbagai kompetensi penting dalam pelaksanaan reklamasi tambang, mulai dari persiapan dan pelaksanaan program reklamasi, perawatan areal reklamasi, hingga pembuatan realisasi biaya pelaksanaan reklamasi."],
      m: ["Mengevaluasi Prinsip Dasar K3LL di Tempat Kerja", "Menerima dan Memahami Informasi dari Beberapa Sumber", "Melaksanakan Persiapan Program Reklamasi", "Melaksanakan Program Reklamasi", "Melaksanakan Perawatan Areal Reklamasi", "Membuat Realisasi Biaya Pelaksanaan Reklamasi"],
      a: AUD_REKLAMASI("Melaksanakan Reklamasi pada Kegiatan Pertambangan Minerba", 5, 4) + " | Pendidikan minimal SMA atau sederajat dan berpengalaman minimal 10 tahun di bidang Melaksanakan Reklamasi pada Kegiatan Pertambangan Minerba",
    },
    "Perencanaan Pascatambang Mineral dan Batubara": {
      d: ["Diklat dan sertifikasi skema Perencanaan Pascatambang Mineral dan Batubara (RPT), SKKNI No. 380 Tahun 2020.", "Perencanaan program, pemantauan, organisasi dan jadwal, kriteria keberhasilan, dan biaya pascatambang.", DIKLAT_NOTE],
      o: [PASCA_SKEMA],
      m: ["Mengendalikan Risiko Keselamatan dan Kesehatan Kerja", "Melaksanakan komunikasi timbal balik", "Merencanakan Program Pascatambang", "Merencanakan Kegiatan Pemantauan Lingkungan Pascatambang", "Merencanakan Organisasi dan Jadwal Pascatambang", "Merencanakan Kriteria Keberhasilan Pascatambang", "Merencanakan Biaya Pascatambang", "Menyusun Profil Wilayah", "Menyusun Kegiatan Pertambangan", "Menyusun Rona Lingkungan Akhir Lahan Pascatambang", "Menyusun dan Mempresentasikan Laporan"],
      a: AUD_PASCA("Perencanaan Pascatambang Minerba"),
    },
    "Pelaksanaan Pascatambang Mineral dan Batubara": {
      d: ["Diklat dan sertifikasi skema Pelaksanaan Pascatambang Mineral dan Batubara (LPT), SKKNI No. 380 Tahun 2020.", "Pelaksanaan program pascatambang: kestabilan dan keamanan fisik, pemeliharaan, pembongkaran, dan pengembangan sosial, budaya, serta ekonomi.", DIKLAT_NOTE],
      o: [PASCA_SKEMA],
      m: ["Mengendalikan Risiko Keselamatan dan Kesehatan Kerja", "Melaksanakan komunikasi timbal balik", "Melaksanakan Persiapan Program Pascatambang", "Melaksanakan Kestabilan dan Keamanan Fisik", "Melaksanakan Program Pemeliharaan Pascatambang", "Melaksanakan Program Pembongkaran Pascatambang", "Melaksanakan Program Pengembangan Sosial, Budaya, dan Ekonomi Pascatambang", "Melaporkan Hasil Pelaksanaan Pascatambang", "Menyusun dan Mempresentasikan Laporan"],
      a: AUD_PASCA("Pelaksanaan Pascatambang Minerba"),
    },
    "Pelaksanaan Pemantauan Pascatambang Mineral dan Batubara": {
      d: ["Diklat dan sertifikasi skema Pelaksanaan Pemantauan Pascatambang Mineral dan Batubara (PPT), SKKNI No. 380 Tahun 2020.", "Pemantauan kestabilan fisik, air permukaan dan air tanah, biologi, serta ekonomi, sosial, dan budaya pascatambang.", DIKLAT_NOTE],
      o: [PASCA_SKEMA],
      m: ["Mengendalikan Risiko Keselamatan dan Kesehatan Kerja", "Melaksanakan komunikasi timbal balik", "Melaksanakan Pemantauan Kestabilan dan Keamanan Fisik Pascatambang", "Melaksanakan Pemantauan Air Permukaan dan Air Tanah Tambang", "Melaksanakan Pemantauan Biologi Akuatik dan Terestrial", "Melaksanakan Pemantauan Ekonomi, Sosial, dan Budaya", "Melaporkan Hasil Pemantauan Pascatambang", "Menyusun dan Mempresentasikan Laporan"],
      a: AUD_PASCA("Pemantauan Pascatambang Minerba"),
    },
  };

  /* Public training: [title, mode line, facilitator, "Apa yang akan Anda kuasai" bullets, target participants] */
  const OFF_ON = "Public training di Bali, Indonesia. Tersedia offline (Bali) dan online via Zoom.";
  const BALI = "Public training di Bali, Indonesia.";
  const GILANG = "Fasilitator: Gilang Firmanda, Competent Person (CP) Geoteknik Tambang.";
  const P_INTRO = "Pelatihan ini dirancang bagi profesional yang ingin memperdalam kompetensi pada topik ini. Setelah mengikuti pelatihan, peserta akan mampu:";
  const pub = (title, lines, bullets, audience) => { D[title] = { d: lines, o: [P_INTRO], m: bullets, a: audience }; };

  pub("Mechanical Maintenance for Reliable Equipment Operation", [OFF_ON],
    ["Memahami prinsip strategi pemeliharaan preventif, prediktif, dan korektif serta parameter keandalan alat berat tambang.", "Menyusun jadwal pemeliharaan berdasarkan jam operasi dan menghitung MTBF, MTTR, serta availability alat.", "Menganalisis akar penyebab downtime berulang dan mengevaluasi efektivitas biaya program pemeliharaan terhadap availability.", "Merekomendasikan perbaikan strategi pemeliharaan berdasarkan data keandalan dan evaluasi kinerja program yang berjalan."],
    "Maintenance Planner | Maintenance Supervisor | Reliability Engineer | Equipment Engineer | Condition Monitoring Technician");
  pub("Heavy Equipment Operation for Safe and Productive Performance", [OFF_ON],
    ["Memahami karakteristik, aplikasi, dan batasan operasi alat berat utama di tambang terbuka.", "Menghitung cycle time dan produktivitas alat berdasarkan parameter operasi dan kondisi kerja aktual.", "Menganalisis penyebab productivity loss dan mengevaluasi kesesuaian alat terhadap kondisi medan dan material.", "Merekomendasikan perbaikan teknik operasi dan pengendalian risiko untuk meningkatkan kinerja produksi."],
    "Mine Supervisor | Equipment Operator Senior | Pit Superintendent | Production Engineer | Safety Officer");
  pub("Blasting Operation for Safe, Efficient, and Cost-Controlled Result", [OFF_ON],
    ["Memahami prinsip desain peledakan, geometri pemboran, dan karakteristik bahan peledak serta sistem inisiasi.", "Menentukan parameter blast design dan menghitung kebutuhan bahan peledak berdasarkan target fragmentasi.", "Menganalisis hasil fragmentasi dan mengevaluasi hubungan powder factor terhadap biaya dan kinerja produksi hilir.", "Merekomendasikan penyesuaian desain peledakan untuk mengoptimalkan fragmentasi dan mengendalikan dampak lingkungan."],
    "Drill & Blast Engineer | Mine Engineer | Pit Superintendent | Juru Ledak | Safety Officer");
  pub("Stockpile Management for Material Quality and Inventory Control", [OFF_ON],
    ["Memahami fungsi stockpile dalam rantai produksi-pengiriman serta prinsip pengendalian kualitas dan inventori material.", "Menyusun rencana blending dan menerapkan prosedur pencatatan inventori serta pencegahan self-heating.", "Menganalisis penyebab material losses, penurunan kualitas, dan selisih inventori pada operasi stockpile.", "Mengevaluasi tata kelola stockpile dan merekomendasikan perbaikan pengendalian kualitas serta akurasi inventori."],
    "Stockpile Supervisor | Quality Controller | Coal/Ore Handling Supervisor | Mine Production Engineer | Inventory Officer");
  pub("Hauling Road Maintenance to Sustain Fleet Efficiency", [OFF_ON],
    ["Memahami geometri jalan angkut, komponen rolling resistance, dan pengaruhnya terhadap kinerja hauling.", "Menyusun program pemeliharaan jalan dan pengendalian debu berdasarkan penilaian kondisi dan prioritas rute.", "Menganalisis hubungan kondisi jalan terhadap konsumsi bahan bakar, kecepatan tempuh, dan cycle time.", "Mengevaluasi efektivitas program pemeliharaan dan merekomendasikan perbaikan jalan untuk meningkatkan efisiensi hauling."],
    "Mine Engineer | Hauling Supervisor | Road Maintenance Supervisor | Production Engineer | Fleet Management Officer");
  pub("Port Operations for Efficient Logistics Performance", [OFF_ON],
    ["Memahami proses operasi pelabuhan tambang, komponen laytime, dan mekanisme demurrage dalam kontrak pengiriman.", "Menyusun jadwal pemuatan dan menghitung laytime serta potensi demurrage berdasarkan ketentuan charter party.", "Menganalisis penyebab keterlambatan operasional dan mengevaluasi throughput aktual terhadap kapasitas terpasang.", "Merekomendasikan perbaikan operasional untuk meningkatkan efisiensi pemuatan dan mencegah klaim demurrage."],
    "Port Superintendent | Loading Supervisor | Shipping Coordinator | Logistics Manager | Mine Engineer");
  pub("Mining Operation Planning and Evaluation for Effective Production", [OFF_ON],
    ["Memahami logika perencanaan jangka pendek dan menengah serta keterkaitan antar parameter produksi tambang.", "Menyusun sekuens penambangan, target produksi, dan KPI operasional yang realistis berdasarkan kapasitas tersedia.", "Menganalisis deviasi plan vs actual dan mengidentifikasi kendala produksi berdasarkan data rekonsiliasi operasional.", "Merekomendasikan penyesuaian rencana produksi berdasarkan evaluasi kapasitas sumber daya, peralatan, dan kondisi lapangan."],
    "Mine Planner | Mine Engineer | Production Supervisor | Pit Superintendent | Short-Term Planning Engineer");
  pub("Carbon Management and Emission Reduction", [OFF_ON],
    ["Memahami kerangka nilai ekonomi karbon, cakupan emisi Scope 1–3, dan sumber emisi utama operasi tambang.", "Menyusun inventori gas rumah kaca dan menghitung estimasi emisi berdasarkan data operasional perusahaan.", "Mengidentifikasi emission hotspot dan mengevaluasi opsi dekarbonisasi versus carbon offset yang tersedia.", "Menyusun prioritas program penurunan emisi dan kerangka strategi pengelolaan karbon di level operasi."],
    "HSE/Environment Officer | Sustainability/ESG Officer | Engineering & Operations Manager | Staf Energy Management | Corporate Planning/Compliance");
  pub("Reclamation and Post-Mining Management for Sustainable Closure", [OFF_ON],
    ["Memahami kewajiban reklamasi dan pascatambang, kerangka penjaminan, serta kriteria keberhasilan yang berlaku.", "Menyusun rencana reklamasi yang mencakup penyiapan lahan, pemilihan revegetasi, dan penetapan kriteria keberhasilan.", "Menganalisis data pemantauan dan mengevaluasi kinerja reklamasi aktual terhadap kriteria keberhasilan yang ditetapkan.", "Merekomendasikan tindakan korektif dan menyusun kerangka perencanaan penutupan tambang yang berkelanjutan."],
    "Environment/Reklamasi Officer | Mine Closure Planner | CSR/Community Development Officer | Land & Legal Officer | Mine Engineer");
  pub("Strategic Mud Management for Open Pit Mining Operations", [OFF_ON],
    ["Meningkatkan kompetensi teknis peserta dalam memahami sumber, karakteristik, dan dampak lumpur terhadap kegiatan operasional tambang batubara, serta cara mengelolanya secara efektif di lapangan.", "Membekali peserta dengan kemampuan perencanaan dan implementasi sistem drainase dan dewatering, termasuk penentuan kapasitas pompa, pengaturan aliran air, dan strategi pengendalian sedimen.", "Membangun standar kerja yang seragam dalam kegiatan identifikasi, pemantauan, dan pelaporan kondisi area berlumpur untuk mendukung pengambilan keputusan yang cepat dan tepat.", "Meningkatkan kemampuan analitis dan responsif peserta dalam menghadapi kondisi kritis seperti pit tergenang, longsor lumpur, atau terganggunya jalur hauling akibat curah hujan tinggi."],
    "Mine Planning Engineer dan Mining Superintendent | Production Supervisor dan Shift Boss | Geotechnical Engineer | Fleet Supervisor dan Equipment Superintendent | Pit Dewatering Engineer dan Mine Hydrology Engineer");
  pub("Market Studies And Financial Model For Metal Minerals", [BALI, "Harga Early Bird sudah termasuk penginapan, berlaku sebelum 16 Agustus 2027."],
    ["Memahami prinsip dasar market studies untuk komoditas mineral logam.", "Mengidentifikasi faktor yang memengaruhi harga, permintaan, dan prospek pasar mineral.", "Menyusun asumsi teknis dan finansial dalam model ekonomi tambang.", "Memahami komponen CAPEX, OPEX, revenue, cashflow, dan pajak/royalti.", "Mengevaluasi kelayakan proyek menggunakan indikator seperti NPV, IRR, payback period, dan sensitivitas.", "Menghubungkan hasil analisis pasar dan model finansial dengan pengambilan keputusan investasi atau pengembangan proyek tambang."],
    "Mine Planning Engineer | Mining Profesional | Resource & Reserve Estimation Team | Strategic Planning Team | Finance/Investment Analyst | Project Manager / Technical Manager");
  pub("Introduction to Groundwater Modeling for Open Pit Mining", [BALI, GILANG, "Didukung Waterloo Hydrogeologic. Harga Early Bird sudah termasuk penginapan, berlaku sebelum 1 November 2027."],
    ["Memahami konsep dan teori dasar pemodelan air tanah (Hukum Darcy, persamaan aliran, proses pembangunan model).", "Mampu menavigasi Visual MODFLOW Flex dan membangun conceptual site model dari data GIS.", "Mampu merancang boundary condition dan zona properti hidraulik yang defensible secara teknis.", "Mampu merancang dan mengevaluasi skema sumur dewatering pit tambang berbasis target drawdown.", "Mampu membandingkan tipe grid numerik (finite difference vs unstructured) untuk kebutuhan akurasi dan efisiensi model."],
    "Hydrogeologist | Geotechnical Engineer | Mine Planning Engineer | Environmental Engineer | Staf Junior Hidrogeologi Tambang");
  pub("Strategic Mine Slope Design", [BALI, GILANG],
    ["Membekali peserta dengan keterampilan QA/QC untuk memastikan data geoteknik, uji laboratorium, dan struktur geologi akurat sebagai dasar desain yang tepat.", "Memahami proses desain dari lereng tunggal (bench), inter-ramp, hingga keseluruhan, dengan mempertimbangkan mekanisme longsoran, distribusi properti material, dan tekanan air pori.", "Menganalisis performa lereng menggunakan nilai Faktor Keamanan Statis dan Dinamis serta menghitung probabilitas longsoran untuk mendukung mitigasi risiko di lapangan."],
    "Geotechnical Engineer | Mine Plan & Engineer | Supervisor Tambang & Operasional | Tim K3L | Surveyor & Hydrogeologist");
  pub("Geoteknik Timbunan Tambang", [BALI, GILANG],
    ["Menguasai terminologi, jenis timbunan, serta faktor-faktor yang memengaruhi kestabilan timbunan tambang.", "Menerapkan metode Waste Dump & Stockpile Rating, Engineering Geology Index, dan Design & Performance Index untuk menilai risiko dan performa timbunan.", "Mengidentifikasi potensi risiko longsoran dan menerapkan langkah mitigasi untuk meningkatkan keamanan dan efisiensi operasional tambang."],
    "Geologist | Mine Plan & Engineer | Geotechnical Engineer | Engineering Geologist | Professionals in Mining");
  pub("Analisis Balik Pada Longsoran Lereng Tambang", [BALI, GILANG],
    ["Menguasai metode pendekatan geologi forensik untuk membaca \"jejak\" penyebab longsoran.", "Membantu Anda memahami pola perilaku tanah dan batuan, sehingga menghasilkan desain yang aman dan produktif.", "Meningkatkan kemampuan Anda dalam memahami karakteristik longsoran untuk pengambilan keputusan yang cepat dan tepat.", "Mempertajam keahlian dengan berbagai teknik analisis untuk menghasilkan desain yang optimal dari sisi keamanan dan profitabilitas."],
    "Geologist | Mine Plan & Engineer | Geotechnical Engineer | Engineering Geologist | Professionals in Mining");
  pub("Kajian Bidang Diskontinuitas Pada Lereng Tambang", [BALI, GILANG],
    ["Mengidentifikasi struktur mayor dan minor serta klasifikasi bidang diskontinuitas yang memengaruhi potensi longsoran.", "Melakukan analisis limit equilibrium, kinematika, dan simulasi 3D untuk mengevaluasi potensi longsoran planar, baji, dan jungkiran.", "Mengembangkan keahlian dalam memahami data lapangan dan membuat desain lereng yang aman dan produktif.", "Menganalisis pola retakan dan merancang strategi mitigasi risiko untuk mengurangi potensi kerugian dan meningkatkan keamanan operasi tambang."],
    "Geotechnical Engineer | Mine Plan & Engineer | Supervisor Tambang & Operasional | Tim K3L | Surveyor & Hydrogeologist");

  window.TrainingContent = D;
})();

/* Training data layer.
   The pages only ever call TrainingData.all() and TrainingData.get(id), and both return Promises.
   To use WordPress later, replace the bodies of all() and get() with fetch() calls to the REST API
   and map each post to the same object shape as below. Nothing else needs to change. */
(() => {
  /* Trainings come from the event calendar data (EventData), so the Training page and the Home calendar always list the same programmes. */
  /* Online and In-house Training are not shown on the Training pages (the home calendar still has them) */
  const HIDDEN = ["online", "inhouse"];
  const CATEGORIES = window.EventData.CATEGORIES.filter((c) => !HIDDEN.includes(c.id)).map((c) => c.name);

  /* "Apa yang didapatkan" items. A training lists the keys it includes in `benefits`. */
  const BENEFITS = {
    certificate: { label: "Comprehensive Certificate", icon: "assets/icons/training/comprehensive.svg", text: "Dapatkan sertifikat komprehensif yang diakui setelah Anda menyelesaikan seluruh rangkaian pelatihan ini." },
    module: { label: "Newest Training Module", icon: "assets/icons/training/newesttraining.svg", text: "Akses modul pelatihan dengan materi terbaru dan ter-update yang relevan dengan perkembangan industri saat ini." },
    room: { label: "Comfortable Meeting Room", icon: "assets/icons/training/mroom.svg", text: "Nikmati ruang pertemuan nyaman dan kondusif untuk mendukung fokus serta pembelajaran Anda." },
    meal: { label: "1x Lunch, 2x Coffee Break (Onsite)", icon: "assets/icons/training/lunch.svg", text: "Makan siang satu kali dan coffee break dua kali selama pelatihan onsite." },
    kit: { label: "Seminar kit", icon: "assets/icons/training/seminar.svg", text: "Perlengkapan seminar untuk menunjang kegiatan belajar Anda." },
    material: { label: "Presentation material", icon: "assets/icons/training/presentations.svg", text: "Materi presentasi pelatihan yang dapat Anda pelajari kembali." },
    recording: { label: "File Recording", icon: "assets/icons/training/presentations.svg", text: "Dapatkan rekaman lengkap dari seluruh sesi pelatihan untuk dipelajari kembali kapan saja tanpa batas waktu." },
  };
  /* "Apa yang didapatkan" depends on the chosen format: offline lists the room, meals and kit; online only the certificate and the recording */
  const OFFLINE_BENEFITS = ["certificate", "module", "room", "meal", "kit", "material"];
  const ONLINE_BENEFITS = ["certificate", "recording"];

  /* ---------- trainings: titles, categories and dates come from the calendar; prices, modules and the rest are placeholders ---------- */
  const CARD_IMAGES = ["assets/images/consulting/portfolio/portfolio-03.jpg", "assets/images/consulting/services/gms.jpg", "assets/images/shared/fallback/fallback-photo-03.jpg", "assets/images/shared/fallback/fallback-photo-04.webp"];
  const CAT_NAME = Object.fromEntries(window.EventData.CATEGORIES.map((c) => [c.id, c.name]));
  const SOURCE = window.EventData.items().filter((e) => !HIDDEN.includes(e.cat));

  const TRAININGS = SOURCE.map((e, i) => {
    const id = e.id;
    const C = (window.TrainingContent || {})[e.title] || {};
    const online = e.cat === "online";
    return {
      id,
      title: e.title,
      category: CAT_NAME[e.cat],
      image: e.image || CARD_IMAGES[i % 4],     // card image (Diklat: its own poster; other categories: placeholder)
      sessions: e.sessions,                     // [month, first day, last day]
      heading: null,                            // detail page title; falls back to `title`
      description: C.d || [e.title],            // lines under the title (from the poster; see TrainingContent)
      overview: C.o || null,                    // "Deskripsi Training" paragraphs
      prices: e.price                           // the card shows the lowest amount; posters give the real prices, Online/In-house are still placeholders
        ? [{ label: "Offline", amount: e.price[0] }, ...(e.price[1] ? [{ label: "Online (Zoom)", amount: e.price[1] }] : [])]
        : online
        ? [{ label: "Online (Zoom)", amount: 5000000 + (i % 5) * 1000000, originalAmount: 10000000 }]
        : [
            { label: "Offline", amount: 8000000 + (i % 5) * 2000000, originalAmount: 15000000 },
            { label: "Online (Zoom)", amount: 5000000 + (i % 5) * 1000000, originalAmount: 10000000 },
          ],
      materials: C.m || [],                     // detail page: "Materi Training"
      methods: online ? [["Online", "Zoom Meeting"]] : e.price && !e.price[1] ? [["Offline", "Lenusa Training Center, Jimbaran Bali"]] : [["Offline", "Lenusa Training Center, Jimbaran Bali"], ["Online", "Zoom Meeting"]],
      audience: C.a || "",
      rating: 5,
      reviews: "100",
      benefits: OFFLINE_BENEFITS,
      onlineBenefits: ONLINE_BENEFITS,
    };
  });

  window.TrainingData = {
    CATEGORIES,
    BENEFITS,
    all: async () => TRAININGS,
    get: async (id) => TRAININGS.find((t) => t.id === Number(id)) || null,
  };
})();

(() => {
  const D = window.TrainingData;
  const $ = (id) => document.getElementById(id);
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const canHover = matchMedia("(hover: hover)").matches;

  const esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const money = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  const star = (cls = "") => `<svg class="tp-star ${cls}" aria-hidden="true"><use href="#tp-star"/></svg>`;
  const detailUrl = (t) => `training-details.html?id=${t.id}`;

  /* one card, used by the list and by "Other Training" */
  const card = (t, index = 0) => {
    const from = t.prices.length ? Math.min(...t.prices.map((p) => p.amount)) : null;
    return `<li style="--tp-appear-delay:${Math.min(index, 11) * 55}ms"><a class="tp-card" href="${detailUrl(t)}" aria-label="${esc(t.title)}, ${esc(t.category)}">
      <img src="${esc(t.image)}" alt="" loading="lazy" draggable="false">
      <span class="tp-card__panel">
        <span class="tp-card__title">${esc(t.title)}</span>
        <span class="tp-card__meta">
          <span>${from === null ? "" : `Rp. ${money(from)}`}</span>
        </span>
      </span>
    </a></li>`;
  };

  /* ================= LIST PAGE ================= */
  if ($("tp-grid")) initList();

  async function initList() {
    const all = await D.all();

    const PER_PAGE = 12;
    const params = new URLSearchParams(location.search);
    const requestedCategory = params.get("category");
    const initialCategory = D.CATEGORIES.includes(requestedCategory) ? requestedCategory : D.CATEGORIES[0];
    const initialPage = Number.parseInt(params.get("page"), 10);
    const initialQuery = params.get("q") || "";
    const state = {
      cat: initialCategory,
      q: initialQuery,
      page: Number.isSafeInteger(initialPage) && initialPage > 0 ? initialPage : 1,
    };
    const grid = $("tp-grid");
    const tabs = $("tp-tabs");
    const pages = $("tp-pages");
    const empty = $("tp-empty");
    const status = $("tp-status");
    const isIndonesian = document.documentElement.lang.toLowerCase().startsWith("id");
    pages.setAttribute("aria-label", isIndonesian ? "Navigasi halaman" : "Pagination");
    $("tp-search").value = state.q;

    tabs.innerHTML = D.CATEGORIES
      .map((c) => `<button type="button" class="ar-tab" data-cat="${esc(c)}" aria-pressed="${c === state.cat}">${esc(c)}</button>`)
      .join("");

    const pageSlots = (current, total, mobile) => {
      if (total <= (mobile ? 5 : 7)) return Array.from({ length: total }, (_, i) => i + 1);

      const gap = (first, last) => ({ gap: true, first, last });
      if (mobile) {
        const first = Math.max(2, Math.min(current - 1, total - 3));
        const middle = Array.from({ length: 3 }, (_, i) => first + i);
        return [
          1,
          ...(first > 2 ? [gap(2, first - 1)] : []),
          ...middle,
          ...(first + middle.length - 1 < total - 1 ? [gap(first + middle.length, total - 1)] : []),
          total,
        ];
      }
      if (current <= 4) return [1, 2, 3, 4, 5, gap(6, total - 1), total];
      if (current >= total - 3) return [1, gap(2, total - 5), ...Array.from({ length: 5 }, (_, i) => total - 4 + i)];
      return [1, gap(2, current - 2), current - 1, current, current + 1, gap(current + 2, total - 1), total];
    };

    const pageUrl = (page) => {
      const next = new URLSearchParams(location.search);
      if (state.cat === D.CATEGORIES[0]) next.delete("category");
      else next.set("category", state.cat);
      if (state.q) next.set("q", state.q);
      else next.delete("q");
      next.set("page", String(page));
      return `?${next.toString()}`;
    };

    const paginationMarkup = (current, total) => {
      const previous = current > 1
        ? `<a class="tp-pages__btn" href="${esc(pageUrl(current - 1))}" aria-label="${isIndonesian ? "Halaman sebelumnya" : "Previous page"}">${isIndonesian ? "Sebelumnya" : "Previous"}</a>`
        : `<span class="tp-pages__btn" aria-label="${isIndonesian ? "Halaman sebelumnya" : "Previous page"}" aria-disabled="true">${isIndonesian ? "Sebelumnya" : "Previous"}</span>`;
      const next = current < total
        ? `<a class="tp-pages__btn" href="${esc(pageUrl(current + 1))}" aria-label="${isIndonesian ? "Halaman berikutnya" : "Next page"}">${isIndonesian ? "Berikutnya" : "Next"}</a>`
        : `<span class="tp-pages__btn" aria-label="${isIndonesian ? "Halaman berikutnya" : "Next page"}" aria-disabled="true">${isIndonesian ? "Berikutnya" : "Next"}</span>`;
      const mobile = matchMedia("(max-width: 767px)").matches;
      const slots = pageSlots(current, total, mobile);
      const numbers = slots
        .map((slot) => {
          if (typeof slot === "number") {
            return `<a class="tp-pages__btn" href="${esc(pageUrl(slot))}" aria-label="${isIndonesian ? `Halaman ${slot}` : `Page ${slot}`}"${slot === current ? ' aria-current="page"' : ""}>${slot}</a>`;
          }
          const label = isIndonesian
            ? `Tampilkan halaman ${slot.first}–${slot.last}`
            : `Show pages ${slot.first}–${slot.last}`;
          const midpoint = (slot.first + slot.last) / 2;
          const target = mobile
            ? slot.last < current ? Math.ceil(midpoint) : Math.floor(midpoint)
            : slot.first;
          return `<a class="tp-pages__btn tp-pages__gap" href="${esc(pageUrl(target))}" aria-label="${label}">…</a>`;
        })
        .join("");
      return `${previous}${numbers}${next}`;
    };

    const render = () => {
      const q = state.q.trim().toLowerCase();
      const rows = all.filter(
        (t) => t.category === state.cat && t.title.toLowerCase().includes(q)
      );
      const last = Math.ceil(rows.length / PER_PAGE);
      state.page = last ? Math.min(state.page, last) : 1;

      grid.innerHTML = rows.slice((state.page - 1) * PER_PAGE, state.page * PER_PAGE).map(card).join("");
      empty.hidden = rows.length > 0;
      status.textContent = rows.length ? `${rows.length} training${rows.length === 1 ? "" : "s"} found` : "No training found";
      pages.hidden = last <= 1;
      pages.innerHTML = last > 1 ? paginationMarkup(state.page, last) : "";
    };

    /* page links change the page in place (no reload), then stay at the list instead of jumping to the hero */
    const listTop = () => {
      const header = document.querySelector("header, .nav");
      const offset = header ? header.getBoundingClientRect().height : 0;
      const target = tabs.getBoundingClientRect().top + scrollY - offset - 16;
      scrollTo({ top: Math.max(0, target), behavior: "smooth" });
    };
    pages.addEventListener("click", (e) => {
      const link = e.target.closest("a.tp-pages__btn");
      if (!link || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      e.preventDefault();
      const n = Number.parseInt(new URL(link.href).searchParams.get("page"), 10);
      if (!n || n === state.page) return;
      state.page = n;
      history.pushState(null, "", link.getAttribute("href"));
      render();
      listTop();
    });
    addEventListener("popstate", () => {
      const n = Number.parseInt(new URLSearchParams(location.search).get("page"), 10);
      state.page = n > 0 ? n : 1;
      render();
    });

    tabs.addEventListener("click", (e) => {
      const btn = e.target.closest(".ar-tab");
      if (!btn) return;
      state.cat = btn.dataset.cat;
      state.page = 1;
      const next = new URLSearchParams(location.search);
      if (state.cat === D.CATEGORIES[0]) next.delete("category");
      else next.set("category", state.cat);
      next.delete("page");
      const query = next.toString();
      history.replaceState(null, "", `${location.pathname}${query ? `?${query}` : ""}`);
      tabs.querySelectorAll(".ar-tab").forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
      render();
    });

    $("tp-search").addEventListener("input", (e) => {
      state.q = e.target.value;
      state.page = 1;
      const next = new URLSearchParams(location.search);
      if (state.q) next.set("q", state.q);
      else next.delete("q");
      next.delete("page");
      const query = next.toString();
      history.replaceState(null, "", `${location.pathname}${query ? `?${query}` : ""}`);
      render();
    });

    render();

    let mobileLayout = matchMedia("(max-width: 767px)");
    mobileLayout.addEventListener("change", render);
  }

  /* poster click opens a plain full-size overlay (no buttons): click anywhere or press Esc to close */
  function initPosterZoom(img, title) {
    const box = img.closest(".tp-poster");
    if (!box) return;
    box.classList.add("is-zoomable");
    box.tabIndex = 0;
    box.setAttribute("role", "button");
    box.setAttribute("aria-haspopup", "dialog");
    box.setAttribute("aria-label", `${L("View poster", "Lihat poster")}: ${title}`);
    let layer = null;
    const close = () => {
      if (!layer) return;
      document.removeEventListener("keydown", onKey);
      document.documentElement.classList.remove("bk-lock");
      layer.remove();
      layer = null;
      box.focus();
    };
    let big = null;
    let s = 1, x = 0, y = 0; // scale and offset from the centre of the screen
    const MAX = 5;
    const apply = () => {
      // keep the picture covering the screen once it is bigger than it
      const mx = Math.max(0, (big.offsetWidth * s - innerWidth) / 2);
      const my = Math.max(0, (big.offsetHeight * s - innerHeight) / 2);
      x = Math.min(mx, Math.max(-mx, x));
      y = Math.min(my, Math.max(-my, y));
      big.style.setProperty("--s", s);
      big.style.setProperty("--x", `${x}px`);
      big.style.setProperty("--y", `${y}px`);
      layer.classList.toggle("is-zoomed", s > 1.01);
    };
    // zoom to ns keeping the point (px, py), measured from the screen centre, still under the pointer
    const zoomAt = (ns, px, py) => {
      ns = Math.min(MAX, Math.max(1, ns));
      const k = ns / s;
      x = px - (px - x) * k;
      y = py - (py - y) * k;
      s = ns;
      if (s === 1) { x = 0; y = 0; }
      apply();
    };
    const onKey = (e) => {
      if (e.key === "Escape" || e.key === "Tab") { e.preventDefault(); close(); }
      else if (e.key === "+" || e.key === "=") zoomAt(s * 1.4, 0, 0);
      else if (e.key === "-") zoomAt(s / 1.4, 0, 0);
      else if (e.key === "0") zoomAt(1, 0, 0);
    };
    const open = () => {
      if (layer) return;
      layer = document.createElement("div");
      layer.className = "tp-zoom";
      layer.setAttribute("role", "dialog");
      layer.setAttribute("aria-modal", "true");
      layer.setAttribute("aria-label", title);
      big = new Image();
      big.src = img.src;
      big.alt = title;
      big.draggable = false;
      layer.appendChild(big);
      s = 1; x = 0; y = 0;

      const centre = (e) => [e.clientX - innerWidth / 2, e.clientY - innerHeight / 2];
      const pts = new Map();
      let moved = false, startDist = 0, startScale = 1, last = null;
      layer.addEventListener("pointerdown", (e) => {
        pts.set(e.pointerId, [e.clientX, e.clientY]);
        layer.setPointerCapture(e.pointerId);
        moved = false;
        last = [e.clientX, e.clientY];
        if (pts.size === 2) {
          const [a, b] = [...pts.values()];
          startDist = Math.hypot(a[0] - b[0], a[1] - b[1]);
          startScale = s;
        }
        layer.classList.add("is-drag");
      });
      layer.addEventListener("pointermove", (e) => {
        if (!pts.has(e.pointerId)) return;
        pts.set(e.pointerId, [e.clientX, e.clientY]);
        if (pts.size === 2) { // pinch
          const [a, b] = [...pts.values()];
          const d = Math.hypot(a[0] - b[0], a[1] - b[1]);
          zoomAt(startScale * (d / startDist), (a[0] + b[0]) / 2 - innerWidth / 2, (a[1] + b[1]) / 2 - innerHeight / 2);
          moved = true;
        } else if (s > 1 && pts.size === 1) { // pan
          const dx = e.clientX - last[0], dy = e.clientY - last[1];
          if (Math.abs(dx) + Math.abs(dy) > 0) moved = moved || Math.hypot(dx, dy) > 2;
          x += dx; y += dy;
          apply();
        }
        last = [e.clientX, e.clientY];
      });
      const up = (e) => {
        pts.delete(e.pointerId);
        if (!pts.size) layer.classList.remove("is-drag");
      };
      layer.addEventListener("pointerup", up);
      layer.addEventListener("pointercancel", up);
      layer.addEventListener("wheel", (e) => {
        e.preventDefault();
        const [px, py] = centre(e);
        zoomAt(s * Math.exp(-e.deltaY * 0.0025), px, py);
      }, { passive: false });
      layer.addEventListener("click", (e) => {
        if (moved) { moved = false; return; }
        // pointer capture retargets the click to the layer, so test the position instead of e.target
        const r = big.getBoundingClientRect();
        const inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
        if (!inside) return close(); // outside the picture closes
        const [px, py] = centre(e);
        zoomAt(s > 1.01 ? 1 : 2.5, px, py); // click toggles zoom
      });
      document.body.appendChild(layer);
      document.documentElement.classList.add("bk-lock");
      document.addEventListener("keydown", onKey);
      requestAnimationFrame(() => layer && layer.classList.add("is-open"));
    };
    box.addEventListener("click", open);
    box.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } });
  }

  /* ================= DETAIL PAGE ================= */
  if ($("tp-detail")) initDetail();

  /* mouse drag for the swipeable rows (touch scrolls natively) */
  function dragScroll(el) {
    let startX = 0;
    let startScroll = 0;
    let down = false;
    el.addEventListener("pointerdown", (e) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      down = true;
      startX = e.clientX;
      startScroll = el.scrollLeft;
      el.setPointerCapture(e.pointerId);
      el.classList.add("is-dragging");
    });
    el.addEventListener("pointermove", (e) => {
      if (down) el.scrollLeft = startScroll - (e.clientX - startX);
    });
    const stop = () => {
      down = false;
      el.classList.remove("is-dragging");
    };
    ["pointerup", "pointercancel", "lostpointercapture"].forEach((ev) => el.addEventListener(ev, stop));
  }

  /* the blurred right edge hides once the row is scrolled to its end */
  function clipEdge(el) {
    const box = el.parentElement;
    const update = () => box.classList.toggle("at-end", el.scrollLeft + el.clientWidth >= el.scrollWidth - 2);
    el.addEventListener("scroll", update, { passive: true });
    addEventListener("resize", update);
    update();
  }

  async function initDetail() {
    const id = new URLSearchParams(location.search).get("id");
    const t = await D.get(id);
    if (!t) {
      $("tp-page").innerHTML = `<div class="tp-wrap tp-missing"><p>Training tidak ditemukan.</p><a class="wipe-button" href="training.html">Kembali ke training</a></div>`;
      return;
    }

    const heading = t.heading || t.title;
    document.title = `${t.title} | Lenusa.id`;
    $("d-crumb").textContent = t.title;
    $("d-poster").src = t.image;
    $("d-poster").alt = `Poster: ${t.title}`; // the poster carries schedule and facilitator details
    initPosterZoom($("d-poster"), t.title);
    $("d-title").textContent = heading;
    $("d-desc").innerHTML = t.description.map((d) => `<span>${esc(d)}</span>`).join("");

    const options = [
      { key: "offline", label: "Offline Training", price: t.prices.find((p) => p.label.toLowerCase().startsWith("offline")) },
      { key: "online", label: "Online Training", price: t.prices.find((p) => p.label.toLowerCase().startsWith("online")) },
    ].filter((option) => option.price);
    let selectedOption = options.find((option) => option.key === "offline") || options[0];
    /* Apa yang didapatkan: swipeable cards with a blurred right edge; the set changes with Offline / Online */
    const renderBenefits = () => {
      const keys = selectedOption && selectedOption.key === "online" ? t.onlineBenefits : t.benefits;
      $("d-get").innerHTML = keys
        .filter((k) => D.BENEFITS[k])
        .map((k) => `<li><img src="${esc(D.BENEFITS[k].icon)}" alt="" width="22" height="22"><h3>${esc(D.BENEFITS[k].label)}</h3><p>${esc(D.BENEFITS[k].text)}</p></li>`)
        .join("");
      $("d-get").scrollLeft = 0;
      $("d-get").dispatchEvent(new Event("scroll")); // refreshes the blurred edge
    };
    const renderOption = () => {
      renderBenefits();
      $("d-options").innerHTML = options
        .map((option) => `<button type="button" class="tp-option" data-option="${option.key}" aria-pressed="${option === selectedOption}">${option.label}</button>`)
        .join("");
      $("d-prices").innerHTML = selectedOption
        ? `<p class="tp-price"><strong>Rp. ${money(selectedOption.price.amount)}</strong></p>`
        : "";
      $("d-order").href = `https://wa.me/${CONTACT.wa}?text=${encodeURIComponent(`Halo Lenusa, saya ingin mendaftar ${t.category}${selectedOption ? ` (${selectedOption.label}, Rp. ${money(selectedOption.price.amount)})` : ""}: ${heading}. Mohon info jadwal dan prosedur pendaftarannya.`)}`;
    };
    $("d-options").addEventListener("click", (e) => {
      const button = e.target.closest(".tp-option");
      if (!button) return;
      selectedOption = options.find((option) => option.key === button.dataset.option);
      renderOption();
    });
    renderOption();

    /* "N+ peserta" line removed: the same placeholder count was shown for every training.
       Restore it per training once Lenusa confirms real participant numbers (field `reviews`). */

    /* Deskripsi Training */
    $("d-overview").innerHTML = (t.overview || t.description).map((p) => `<p>${esc(p)}</p>`).join("");
    $("d-materials").innerHTML = t.materials.map((m) => `<li>${esc(m)}</li>`).join("");
    $("d-methods").innerHTML = t.methods.map(([k, v]) => `<li><b>${esc(k)}</b> – ${esc(v)}</li>`).join("");
    $("d-audience").textContent = t.audience;

    /* "Feedback Peserta" removed until real, consented reviews exist (the placeholder repeated one
       comment six times under a real company name). The .tp-reviews styles are kept for when it returns. */
    dragScroll($("d-get"));
    clipEdge($("d-get"));

    /* Pelatihan Lain: same category, not this one, max 4 */
    const others = (await D.all()).filter((x) => x.category === t.category && x.id !== t.id).slice(0, 4);
    if (others.length) $("d-other").innerHTML = others.map(card).join("");
    else $("tp-other").hidden = true;

    /* the tab bar scrolls down the page; the tab of the section in view is underlined */
    const dtabs = [...document.querySelectorAll(".tp-dtab")];
    const mark = (hash) => dtabs.forEach((a) => a.setAttribute("aria-current", String(a.getAttribute("href") === hash)));
    dtabs.forEach((a) => a.addEventListener("click", () => mark(a.getAttribute("href"))));
    if ("IntersectionObserver" in window) {
      const spy = new IntersectionObserver(
        (entries) => entries.forEach((e) => e.isIntersecting && mark(`#${e.target.id}`)),
        { rootMargin: "-30% 0px -60% 0px" }
      );
      ["tp-desc-panel", "tp-reviews", "tp-other"].forEach((s) => $(s) && !$(s).hidden && spy.observe($(s)));
    }
  }
})();

/* Article data (swap all() and get() for WordPress REST fetches later) */
/* Article data layer.
   The pages only call ArticleData.all() and ArticleData.get(id), and both return Promises.
   To use WordPress later, replace the bodies of all() and get() with fetch() calls to the REST API
   and map each post to the same fields. Nothing else needs to change.

   The 10 entries below are REAL articles published elsewhere. Each one has a short summary written
   in our own words and a link to the original; the full texts belong to their publishers.
   Fields: category, title, author, source, url, published ("YYYY", "YYYY-MM" or "YYYY-MM-DD",
   leave it out when the source shows no date), excerpt (list card), summary (paragraphs shown on
   the article page), note (optional), figures (optional two-image row), readMinutes (optional).
   Please check each link and title before publishing. */
(() => {
  const CATEGORIES = ["Geotech", "Groundwater", "Dewatering"];

  const ARTICLES = [
    {
      category: "Geotech",
      title: "Slope Stability Monitoring Methods and Technologies for Open-Pit Mining: A Systematic Review",
      author: "Rohan Le Roux, Mohammadali Sepehri, Siavash Khaksar, Iain Murray",
      source: "Mining (MDPI), Vol. 5, Issue 2, Article 32",
      url: "https://doi.org/10.3390/mining5020032",
      published: "2025-05",
      excerpt: "A systematic review of 49 studies that compares remote-sensing, in-situ and emerging slope monitoring methods for open pits on accuracy, coverage, timing, complexity and cost.",
      summary: [
        "Slope failures in open pits damage equipment, stop production and kill people. The authors point to five failures at Western Australian mines between 2018 and 2020, plus two fatalities in Queensland and the Northern Territory. Most slopes move progressively before they collapse, so the main job of any monitoring system is to catch rising displacement rates early.",
        "A Curtin University team ran the review under the PRISMA 2020 guidelines. They searched engineering databases for work published between 2005 and early 2025, screened 615 records and kept 49 studies after a quality check. About three quarters of those studies dealt with remote sensing. The rest covered in-situ instruments.",
        "The remote-sensing group covers satellite InSAR, ground-based radar, terrestrial and UAV-mounted LiDAR, UAV photogrammetry, GNSS and total stations, and thermal imaging. The in-situ group includes time domain reflectometry, extensometers, piezometers, inclinometers and fibre Bragg grating sensors. AI-based crack detection and IoT wireless sensor networks are treated as emerging tools that add to these methods rather than replace them.",
        "Each method is rated on accuracy, spatial coverage, temporal resolution, operational complexity, tolerance of weather and cost. The trade-offs are sharp. In-situ sensors give precise point readings but cover little ground, while satellite radar sees a whole pit yet revisits only every few days or weeks. Ground-based radar and laser scanning sit in between and support near real-time work.",
        "The authors conclude that no single system suits every mine. Deep pits limit GNSS line of sight, heavily fractured rock favours in-situ instruments, and frequent blasting calls for high-frequency methods such as ground-based radar. Their practical advice is to combine methods, for example pairing radar with rugged in-situ sensors and filling the gaps between satellite passes with UAV or ground surveys.",
        "They also name open gaps. Recent research has drifted almost entirely towards remote sensing, cost comparisons across sites are still mostly qualitative, and machine-learning tools lack large labelled datasets.",
      ],
      figures: [
        { src: "assets/images/articles/thumbnails/article-thumb-02.jpg", caption: "Open-pit mine terrain" },
        { src: "assets/images/articles/thumbnails/article-thumb-03.jpg", caption: "Mining equipment at an open-pit mine" },
      ],
    },
    {
      category: "Dewatering",
      title: "A Phased Approach to Mine Dewatering – Updated from IMWA 1993",
      author: "Kym L. Morton",
      source: "IMWA 2024 (West Virginia Mine Drainage Task Force Symposium & 15th IMWA Congress)",
      url: "https://imwa.info/docs/imwa_2024/IMWA2024_Morton_458.pdf",
      published: "2024",
      excerpt: "Updating a 1993 IMWA paper, Morton sets out a three-phase route to mine dewatering and reviews the passive and active methods proven in open pits.",
      summary: [
        "Mines often cut through local and regional water tables, and the inflow can range from a nuisance to a serious hazard. Dry pits mean less risk, less wear on machinery, cheaper earthmoving and more stable slopes. Morton notes that water is often a mine's third-largest cost, yet it rarely gets its own line in detailed financial analysis.",
        "The paper updates work first published in 1993 and proposes three phases. Phase 1 gathers site data and builds a conceptual hydrogeological model, using vibrating wire piezometers, flow gauges and structural mapping. Phase 2 calibrates a numerical model and runs predictive scenarios that report inflows as ranges, not single values, to reflect uncertainty.",
        "Phase 3 turns the model into a design. Drawdown targets are set for each mining sector and schedule, aiming to keep the cone of drawdown a few metres below the working areas. A trial in one area comes before full roll-out. Monitoring then feeds back into the model, and the whole cycle repeats every year.",
        "Passive methods deal with water after excavation. Sump pumping is the most common and the cheapest to set up, but it can pollute water and grow expensive if badly managed, so it should be backed by methods that stop water before it reaches the pit floor. Horizontal drain holes up to about 150 m long drain the slopes. Active methods work ahead of mining: wellpoints in coal mines, pumping boreholes on the perimeter, benches, floor or underground, and ring-shaped dewatering galleries, long favoured at kimberlite mines.",
        "Closely spaced boreholes produce overlapping cones of depression and lower the water table more than a single well. Most sites end up with a mix of methods, and stormwater control goes in first. For operators, the core message is to base dewatering decisions on daily records of water levels and pumped volumes, and to question the conceptual model before changing the design.",
      ],
    },
    {
      category: "Geotech",
      title: "Geotechnical Monitoring of Slope Stability in Open-Pit Mining at PT. Semen Indonesia (Persero) Tbk Tuban Plant",
      author: "Isnaini Fadhilah Prasetyo, Rr Tiara Dyah Ayu",
      source: "Journal of Marine-Earth Science Technology (ITS), Vol. 4, No. 2",
      url: "https://journal.its.ac.id/index.php/jmest/article/download/1018/863/6815",
      published: "2024-01",
      excerpt: "A one-month geotechnical survey of three limestone and clay quarries at Semen Indonesia's Tuban plant, using total station data and the Bishop method to rate slope safety factors.",
      summary: [
        "PT Semen Indonesia's Tuban plant quarries limestone and clay in open pits. Cutting benches changes the balance of forces in the ground, and slopes can fail. Two researchers from the Department of Geomatics Engineering at ITS Surabaya checked whether slopes at three mining permits were stable: Temandang limestone, Tlogowaru clay and Mliwang clay.",
        "Field data came from a SOKKIA total station and tape measurements taken in August 2023. The team processed slope geometry in AutoCAD Civil 3D and ran limit-equilibrium analysis in Slide with the simplified Bishop method. Inputs were bench height, slope angle, bench width, bulk density, cohesion and internal friction angle.",
        "Stability was judged with the Bowles (1984) criterion. A safety factor above 1.5 counts as stable, 1.07 to 1.5 as critical and below 1.07 as unstable. At Temandang, single slopes scored 3.20 and the overall slope 1.98. Tlogowaru reached 2.04 for single slopes but only 1.35 overall, and Mliwang gave 3.32 and 1.36.",
        "Individual benches at all three sites are safe. The overall slopes at the two clay quarries, though, fall in the critical range and need attention. The clay materials also show far lower cohesion than the limestone, at 0.52 and 0.82 kg/cm² against 2.61 kg/cm².",
        "The authors see the results as input for slope stability policy at the plant and as a case for adopting better geotechnical monitoring technology. The analysis rests on one month of data, so it gives a snapshot of slope condition rather than a trend over time.",
      ],
      note: "The link opens a PDF download.",
    },
    {
      category: "Groundwater",
      title: "Groundwater-Level Recovery Following Closure of Open-Pit Mines",
      author: "C. Bozan, I. Wallis, P. G. Cook, S. Dogramaci",
      source: "Hydrogeology Journal, Vol. 30, Issue 6, pp. 1819–1832",
      url: "https://doi.org/10.1007/s10040-022-02508-2",
      published: "2022-07",
      excerpt: "A modelling study of how fast groundwater comes back after open-pit mines close, and how backfilling, pit lakes, evaporation and rapid filling change the outcome.",
      summary: [
        "Many open pits are dug below the water table and kept dry by years of pumping. Once mining stops, the questions are how fast groundwater returns and to what level. The answers decide whether a pit lake forms, what its water quality will be over the long term and how the land can be used after closure.",
        "Bozan and co-authors built a synthetic 3D MODFLOW-NWT model, loosely based on the Hope Downs North iron-ore mine in the Pilbara, Western Australia. A single pit about 2 km by 1 km and 90 m deep was dewatered for 20 years by 20 wells, then left to recover for 100 years. Two aquifer cases were tested, one moderately transmissive and one less so, under a semiarid climate with very high evaporation.",
        "Aquifer transmissivity controls the rate of recovery. In the more transmissive case, levels passed 50% recovery within 10 years and 70% within 20, but the last quarter took more than 80 years. In the less transmissive case, recovery reached only about 60% after 50 years. The drawdown cone also kept widening after pumping stopped, so ecosystems far from the pit can feel the effect long after closure.",
        "The closure option and climate set the final water table. Backfilling the pit with material of similar conductivity to the host rock gave over 70% recovery within a decade. Leaving the void open let evaporation turn the pit into a terminal groundwater sink, with lake levels settling about 15 to 30 m below pre-mining levels in the transmissive case and 50 to 65 m below in the tighter one.",
        "Filling the pit quickly with surplus water speeds recovery, mostly in low-permeability settings; in transmissive aquifers the gain fades fast. For closure planners in dry regions, the message is to treat backfilling as the main decision where it is feasible and to build evaporation into any pit lake forecast. The authors add that synthetic models simplify pit geometry and lake processes, so site-specific studies are still needed.",
      ],
      note: "Access to the full paper depends on the journal's own terms.",
    },
    {
      category: "Dewatering",
      title: "Pump Solutions for Mine Water Management",
      author: "Impeller.net",
      source: "Impeller.net",
      url: "https://impeller.net/magazin/pump-solutions-for-mine-water-management",
      excerpt: "A pump-focused overview of mine water management: where the water comes from, active versus reactive dewatering, and which pump types serve dewatering, process and reclaimed water.",
      summary: [
        "Mines need water for processing, but many working areas lie below the water table, so removing water is a constant task. The article defines mine water as water carrying less than 50 g/L of solids, which separates it from slurry. Dewatering usually keeps running even when a mine works at reduced capacity or shuts down for a while.",
        "Open pits take in rainfall, floodwater and snowmelt. Underground mines deal with underground waterways, ore bodies holding pockets of water and water tables that rise over time with precipitation.",
        "Active dewatering lowers the water table, mainly around open pits, through multi-stage deep-well pumping and well pointing. Reactive, or passive, dewatering removes water that has already reached the workings. In open pits that means pit dewatering, seepage removal and flood relief. Underground it covers face dewatering, stage pumping, shaft-bottom sump drainage, ramp and stope pumping and main mine dewatering.",
        "Pump choice follows the job. Dewatering uses submersible, vertical, end-suction, multistage and volumetric pumps, with materials picked for water chemistry, abrasive solids and solids concentration. Slurry pumps move process water to filters and thickeners, while vertical turbine and end-suction pumps serve intake stations, and several pump types handle reclaimed water from tailings ponds.",
        "The factors that decide a dewatering system are mine type, location and available power, expected inflow, depth, water properties, mine life and budget. Depth determines whether a single lift is enough or staged pumping is needed, and a longer mine life justifies more permanent installations. An accurate estimate of inflow from every source comes first. Recycling water through treatment plants is also becoming more common as water grows scarce and costly.",
      ],
    },
    {
      category: "Groundwater",
      title: "Hydrogeology and Mineral Resource Development",
      author: "Leslie Smith",
      source: "The Groundwater Project",
      url: "https://gw-project.org/books/hydrogeology-and-mineral-resource-development/",
      published: "2021-03",
      excerpt: "Leslie Smith's free 67-page book explains how groundwater shapes mine operations, water supply, waste management and closure, with five worked exercises including open-pit inflow prediction.",
      summary: [
        "Groundwater touches almost every stage of a mining project, from planning and safe operation to environmental management and closure. Most countries regulate mining to limit its effects on groundwater and nearby surface water. This free book from The Groundwater Project, written by Leslie Smith of the University of British Columbia, sets out the hydrogeological principles needed to meet those goals.",
        "The opening chapters cover climatic and geological settings, the main types of mine waste (mill tailings, waste rock and spent heap leach) and how each is managed. A chapter on key concepts then explains dewatering and pressure control, hydrodynamic containment, the hydraulic properties of tailings and waste rock, contaminant loading, groundwater in the site water balance and the use of simulation models.",
        "Later chapters turn to practice: field investigations at mine sites, dewatering and depressurisation of underground workings and open pits, seepage assessment and management for tailings facilities, and seepage from waste rock stockpiles. A closure chapter treats underground mines, open pits, tailings and waste rock facilities and spent heap leach separately.",
        "Five exercises with worked solutions close the book: solute loading, inflow to an open pit, a water balance for a tailings storage facility, hydrodynamic containment, and the effect of rock-mass depressurisation on regional flow. It can be read online or downloaded as a PDF.",
      ],
    },
    {
      category: "Geotech",
      title: "Slope Monitoring in the Spotlight",
      author: "Carly Leonida",
      source: "Engineering & Mining Journal (E&MJ)",
      url: "https://www.e-mj.com/features/slope-monitoring-in-the-spotlight/",
      published: "2019",
      excerpt: "E&MJ looks at why slope stability came under the spotlight after a run of mine landslides, the challenges open-pit operators face, and the monitoring products launched in 2019.",
      summary: [
        "This 2019 feature by E&MJ's European editor opens with a run of deadly landslides and collapses at mines that year in the DRC, Chad and Turkey. It sets tailings dams aside and focuses on open-pit slopes: what operators are up against and what new monitoring tools reached the market.",
        "Meredith Goss of AMC Consultants describes the pressure on engineers to design steep slopes from thin, low-confidence geotechnical data. Hydrogeology is often poorly understood early in design, even though groundwater matters more as pits deepen. Deeper pits also bring higher stress, micro-seismicity and rockfall risk, and experienced geotechnical engineers are hard to hire.",
        "No single technology sees everything. Prism systems struggle to detect rockfalls, and radars may lack the resolution to predict large ones. Vendors present their answers, among them IDS GeoRadar's RockSpot radar for fast rockfalls and its GeoMonitoring Hub software, Maptek's cold-climate Sentry laser scanner, Reutech's MSRIV Esprit radar and Orica Monitor's MonitorIQ platform, which pulls in data from more than 120 sensor types.",
        "IDS GeoRadar says radar monitoring is becoming standard practice at major miners and spreading to smaller operations as costs fall. A Maptek case study from the Kanmantoo copper mine in South Australia shows laser scanning used to watch a wall during remediation after a rockfall of about 6,000 t. Several firms also announced links between monitoring data and Rocscience's Slide3 and RS3 models.",
        "The common thread is integration. Mines want one view of radar, laser, prism, piezometer and drone data, and they want it fed into pit design and mine planning. Monitoring spend has to be justified against geotechnical risk, and where monitoring drives hazard management, real-time data and reliable communication links become essential.",
      ],
    },
    {
      category: "Groundwater",
      title: "Groundwater Management Planning at an East African Gold Mine",
      author: "Jon Hall, James Dodds",
      source: "Mine Water 2004 – Proceedings, IMWA Symposium, Newcastle upon Tyne, Vol. 1, pp. 67–76",
      url: "https://www.imwa.info/docs/imwa_2004/IMWA2004_10_Hall.pdf",
      published: "2004",
      excerpt: "How a structured groundwater management plan, issues register and Aquascape database were built for the Geita Gold Mine in Tanzania, and why the method can travel to other mines.",
      summary: [
        "Geita Gold Mine sits in the Mwanza Region of Tanzania, in the headwaters of the Mtakuja River, which drains to Lake Victoria. Its water supply comes mainly by pipeline from Nungwe Bay rather than from groundwater. Mining at the Nyankanga Pit began in 1998, in deeply weathered greenstone-belt rock that receives about 980 mm of rain a year.",
        "Jon Hall of Aquaterra International and James Dodds of JDIH describe how they built a groundwater management plan as one component of the mine's wider water management plan. The work started from a conceptual model with two aquifers. A shallow, more permeable aquifer lies in alluvium and colluvium; a deeper, less permeable and more saline one lies in saprock and fractured basement, with saprolite acting as an aquitard between them.",
        "The plan is a living document. It holds a register of more than forty issues, from pit sumps and runoff control to monitoring programmes and staff training, each with an action plan, schedule and review. Packer, airlift and head tests gave hydraulic conductivity, and a simple lumped-parameter model calibrated on observed inflows predicted how pit inflows would grow as the pits expanded.",
        "Spreadsheets could not keep up with the data, so the team set up a site database in Aquascape, an Access-based environmental and water management system for mines. A 2003 trial at Nyankanga produced automatic plots of pit inflow and piezometer levels, and planned upgrades included a water balance model for each operation. The studies predicted modest inflows at most pits, with Geita Hill the exception because of water held in old underground workings.",
        "Contaminants from the tailings dam and waste dumps were expected to stay mostly in the shallow aquifer, with travel times of roughly 500 to more than 1,000 days. After closure, Nyankanga is expected to act as a groundwater sink. The authors argue the same approach suits other mines: conceptual model first, a scheduled issues register, central data and trained site staff. At Geita, that training cut consultant visits to once every six to eight months.",
      ],
      note: "The link opens a PDF.",
    },
    {
      category: "Dewatering",
      title: "Mine Dewatering Reduces Risks and Manages Impacts",
      author: "WSP",
      source: "WSP",
      url: "https://www.wsp.com/en-us/projects/mine-dewatering-reduces-risks-and-manages-impacts",
      excerpt: "A WSP project in Nevada where a pit expansion into a carbonate aquifer called for perimeter pumping wells, in-pit wells and horizontal drains to hold water below the pit floor.",
      summary: [
        "This WSP project page covers a copper, gold and molybdenum mine in Nevada that has worked on and off since the late 1800s. Rising demand meant widening and deepening one of its eastern pits over six years. The expansion would cut into a large, highly permeable carbonate aquifer, recharged from the Egan Range, that feeds springs used for local drinking water.",
        "The team first characterised the carbonate aquifer in detail to define its extent, then set the dewatering requirements for the life of the mine. The design goal was to hold groundwater below the pit floor before and throughout mining. The system also had to meet the mine's water-supply demand and the regulations on discharging excess water.",
        "The primary strategy relies on high-capacity vertical pumping wells in permeable zones around the pit perimeter. They lower groundwater levels and release pore pressure in the walls. A secondary strategy depressurises lower-permeability zones on the perimeter and inside the pit, pairing vertical in-pit wells with passive horizontal drains to meet the slope design criteria.",
        "WSP states that the design also limits the effect on drinking-water supplies and on groundwater conditions after closure. The page gives no pumping rates, volumes or drawdown figures, so it describes the approach rather than reporting results.",
      ],
    },
    {
      category: "Dewatering",
      title: "Mine Groundwater Management: More Than Just Dewatering",
      author: "John Waterhouse",
      source: "Pump Industry",
      url: "https://www.pumpindustry.com.au/mine-groundwater-management-more-than-just-dewatering",
      excerpt: "A Golder hydrogeologist explains when mines need dewatering, which methods work, why pit walls need depressurising, and why discharge approvals have to be planned early.",
      summary: [
        "John Waterhouse, a principal hydrogeologist with Golder Associates in Perth, explains when mines below the water table need dewatering. Small inflows through low-permeability walls may need nothing more than the sump already required for stormwater. Larger inflows disrupt haul traffic and blasting: wet clay floors break down under repeated truck passes, and flooded blast holes can misfire or force the use of costly wet-hole explosives.",
        "The options are pumped wells or deep sumps inside the pit, pumped wells outside it, free-flowing drill holes draining to sumps, drainage galleries with fans of drill holes, and pumping from older, deeper underground workings. Most mines combine several. Waterhouse argues the design should come out of investigation, not be fixed at the start.",
        "Depressurising pit walls is a separate task. Water pressure rises by about 98 kPa for every 10 m below the water table, so pits deeper than 100 m can carry pressures in the megapascal range. Lowering that pressure, usually with free-flowing drill holes, can allow steeper and safer slopes, whereas flatter slopes on a large mine can add hundreds of millions of dollars in mining cost. Floor dewatering alone may not drain the walls in layered sedimentary rock or where a permeable orebody sits in tight host rock.",
        "Dewatering produces water that must go somewhere. Much of it can serve processing and dust suppression, but surplus water needs discharge or treatment, and regulators want estimates of rates and quality. Approvals are not automatic: discharge to Western Australian salt lakes is no longer assured, and large releases to creeks in arid-zone national parks may be refused.",
        "The practical advice is to investigate ground and groundwater before the pit opens, plan dewatering early alongside the mine schedule and allow time for approval studies. Mining engineers, geologists, geotechnical engineers and groundwater specialists should work as one team from the start. Problems fixed after they appear cost more and take longer than those planned for.",
      ],
    },
  ];

  const THUMBNAILS = [
    "assets/images/articles/thumbnails/article-thumb-01.jpg",
    "assets/images/articles/thumbnails/article-thumb-02.jpg",
    "assets/images/articles/thumbnails/article-thumb-03.jpg",
    "assets/images/articles/thumbnails/article-thumb-04.jpg",
    "assets/images/articles/thumbnails/article-thumb-05.jpg",
  ];
  const DATA = ARTICLES.map((a, i) => ({
    id: i + 1,
    image: THUMBNAILS[i % THUMBNAILS.length],
    ...a,
  }));

  window.ArticleData = {
    CATEGORIES,
    all: async () => DATA,
    get: async (id) => DATA.find((a) => a.id === Number(id)) || null,
  };
})();

/* Article pages */
(() => {
  const D = window.ArticleData;
  const $ = (id) => document.getElementById(id);
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const heroSlides = [...document.querySelectorAll(".ar-hero__bg--slides div")];
  if (!reduceMotion && heroSlides.length > 1) {
    let activeSlide = 0;
    setInterval(() => {
      heroSlides[activeSlide].classList.remove("is-on");
      activeSlide = (activeSlide + 1) % heroSlides.length;
      heroSlides[activeSlide].classList.add("is-on");
    }, 3000);
  }

  const esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const MONTHS = L(["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"], ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"]);
  /* "2025-05" -> "May 2025", "2019" -> "2019", "2024-03-08" -> "8 March 2024" */
  const fmtDate = (p) => {
    if (!p) return "";
    const [y, m, d] = p.split("-");
    return [d && Number(d), m && MONTHS[Number(m) - 1], y].filter(Boolean).join(" ");
  };

  const detailUrl = (a) => `article-details.html?id=${a.id}`;
  const ARROW = `<svg class="ar-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>`;

  /* "Published: · May 2025", or "Source: · WSP" when the source shows no date */
  const meta = (a) =>
    a.published
      ? `<span>Published:</span><span class="ar-meta__val ar-meta__date">${esc(fmtDate(a.published))}</span>`
      : `<span>Source:</span><span class="ar-meta__val">${esc(a.source)}</span>`;

  /* uses the shared .wipe-button hover (HOVER-BUTTON-SWIPE.md) */
  const button = (a, label) =>
    `<a class="wipe-button ar-btn" href="${detailUrl(a)}">${label}${ARROW}<span class="ar-sr">: ${esc(a.title)}</span></a>`;

  /* list row */
  const row = (a) => `<li class="ar-row">
    <a class="ar-row__img" href="${detailUrl(a)}" tabindex="-1" aria-hidden="true"><img src="${esc(a.image)}" alt="" loading="lazy" draggable="false"></a>
    <div class="ar-row__body">
      <p class="ar-tag">${esc(a.category)}</p>
      <h3 class="ar-item__title">${esc(a.title)}</h3>
      <p class="ar-item__text">${esc(a.excerpt)}</p>
      <p class="ar-meta">${meta(a)}</p>
      <div class="ar-item__foot">${button(a, "View Full Article")}</div>
    </div>
  </li>`;

  /* card for "Relevant Article" */
  const card = (a) => `<li class="ar-card">
    <a class="ar-card__img" href="${detailUrl(a)}" tabindex="-1" aria-hidden="true"><img src="${esc(a.image)}" alt="" loading="lazy" draggable="false"></a>
    <div class="ar-card__body">
      <p class="ar-tag">${esc(a.category)}</p>
      <h3 class="ar-item__title">${esc(a.title)}</h3>
      <p class="ar-item__text">${esc(a.excerpt)}</p>
      <p class="ar-meta">${meta(a)}</p>
      <div class="ar-item__foot">${button(a, "Explore Article")}</div>
    </div>
  </li>`;

  /* ================= LIST PAGE ================= */
  if ($("ar-rows")) initList();

  async function initList() {
    const all = await D.all();
    const PER_PAGE = 5;
    const state = { cat: "All", page: 1 };
    const rowsEl = $("ar-rows");
    const filter = $("ar-filter");
    const pages = $("ar-pages");
    const empty = $("ar-empty");
    const status = $("ar-status");

    const tabs = [{ value: "All", label: "Latest Article" }, ...D.CATEGORIES.map((c) => ({ value: c, label: `${c} Article` }))];
    filter.innerHTML = tabs
      .map((t, i) => `<button type="button" class="ar-tab${i === 0 ? " ar-tab--all" : ""}" data-cat="${esc(t.value)}" aria-pressed="${t.value === state.cat}">${esc(t.label)}</button>`)
      .join("");

    /* 1 2 3 … 9 */
    const pageList = (cur, last) => {
      if (last <= 5) return Array.from({ length: last }, (_, i) => i + 1);
      const keep = new Set([1, last]);
      if (cur <= 3) [2, 3].forEach((n) => keep.add(n));
      else if (cur >= last - 2) [last - 2, last - 1].forEach((n) => keep.add(n));
      else [cur - 1, cur, cur + 1].forEach((n) => keep.add(n));
      const nums = [...keep].sort((a, b) => a - b);
      return nums.flatMap((n, i) => {
        const gap = i ? n - nums[i - 1] : 1;
        return gap > 2 ? ["…", n] : gap === 2 ? [n - 1, n] : [n];
      });
    };

    const render = () => {
      const list = all.filter((a) => state.cat === "All" || a.category === state.cat);
      const last = Math.max(1, Math.ceil(list.length / PER_PAGE));
      state.page = Math.min(state.page, last);

      rowsEl.innerHTML = list.slice((state.page - 1) * PER_PAGE, state.page * PER_PAGE).map(row).join("");
      empty.hidden = list.length > 0;
      status.textContent = list.length ? `${list.length} article${list.length === 1 ? "" : "s"} found` : "No article found";
      /* same pagination as the Training list: Previous, page numbers, Next */
      const id = document.documentElement.lang.toLowerCase().startsWith("id");
      const btn = (page, text, label, on, extra = "") => on
        ? `<button type="button" class="tp-pages__btn" data-page="${page}" aria-label="${label}"${extra}>${text}</button>`
        : `<span class="tp-pages__btn" aria-label="${label}" aria-disabled="true">${text}</span>`;
      pages.hidden = last <= 1;
      pages.innerHTML = last > 1
        ? btn(state.page - 1, id ? "Sebelumnya" : "Previous", id ? "Halaman sebelumnya" : "Previous page", state.page > 1) +
          pageList(state.page, last)
            .map((p) => p === "…"
              ? `<span class="tp-pages__btn tp-pages__gap" aria-hidden="true">…</span>`
              : btn(p, p, id ? `Halaman ${p}` : `Page ${p}`, true, p === state.page ? ' aria-current="page"' : ""))
            .join("") +
          btn(state.page + 1, id ? "Berikutnya" : "Next", id ? "Halaman berikutnya" : "Next page", state.page < last)
        : "";
    };

    filter.addEventListener("click", (e) => {
      const btn = e.target.closest(".ar-tab");
      if (!btn) return;
      state.cat = btn.dataset.cat;
      state.page = 1;
      filter.querySelectorAll(".ar-tab").forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
      render();
    });

    pages.addEventListener("click", (e) => {
      const btn = e.target.closest("button.tp-pages__btn");
      if (!btn) return;
      state.page = Number(btn.dataset.page);
      render();
      $("ar-list").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    });

    render();
  }

  /* ================= DETAIL PAGE ================= */
  if ($("ar-detail")) initDetail();

  async function initDetail() {
    const id = new URLSearchParams(location.search).get("id");
    const a = await D.get(id);
    if (!a) {
      $("ar-page").innerHTML = `<div class="ar-wrap ar-missing"><p>Article not found.</p><a class="wipe-button ar-btn" href="article.html">Back to articles</a></div>`;
      return;
    }

    document.title = `${a.title} | Lenusa.id`;
    $("a-crumb").textContent = a.title;
    $("a-title").textContent = a.title;

    const parts = [fmtDate(a.published), a.readMinutes ? `${a.readMinutes} min read` : ""].filter(Boolean);
    $("a-meta").textContent = parts.length ? parts.join(" - ") : `Source: ${a.source}`;
    $("a-author").textContent = a.author;

    $("a-cover").src = a.image;
    $("a-cover").alt = "";
    $("a-caption").textContent = "Mining site photo";

    const figures = a.figures
      ? `<ul class="ar-figs">${a.figures
          .map((f) => `<li><figure><img src="${esc(f.src)}" alt="" loading="lazy"><figcaption>${esc(f.caption)}</figcaption></figure></li>`)
          .join("")}</ul>`
      : "";
    const wa = `https://wa.me/${CONTACT.wa}?text=${encodeURIComponent(`Hello Lenusa, I would like to discuss: ${a.title}`)}`;

    $("a-body").innerHTML =
      `<h2>Summary</h2>` +
      a.summary.map((p) => `<p>${esc(p)}</p>`).join("") +
      figures +
      `<aside class="ar-source"><h2>Read the original</h2>` +
      `<p>This is a short summary written for Lenusa’s article list. The full text is published by ${esc(a.source)}.</p>` +
      `<p><a class="ar-link" href="${esc(a.url)}" target="_blank" rel="noopener noreferrer">Read the original article<span class="ar-sr"> (opens in a new tab)</span></a></p>` +
      (a.note ? `<p>${esc(a.note)}</p>` : "") +
      `<p><a class="ar-link" href="index.html#contact">Contact Us</a> or <a class="ar-link" href="${wa}" target="_blank" rel="noopener noreferrer">Inquire via WhatsApp</a> if you want to discuss this topic for your operation.</p></aside>`;

    /* Relevant Article: same category, not this one, max 3 */
    const others = (await D.all()).filter((x) => x.category === a.category && x.id !== a.id).slice(0, 3);
    if (others.length) $("a-rel").innerHTML = others.map(card).join("");
    else $("ar-rel").hidden = true;
  }
})();

/* Consulting page */
if (document.querySelector(".cs")) {
  (() => {
    const $ = (s, r = document) => r.querySelector(s);
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* fade-in: hero on load (staggered), sections once when scrolled into view */
    $('.cs').classList.add('cs-ready');
    document.querySelectorAll('.cs-hero .cs-fade').forEach((el, i) => setTimeout(() => el.classList.add('in'), 150 + i * 150));
    const fio = new IntersectionObserver(es => es.forEach(x => {
      if (x.isIntersecting) { x.target.classList.add('in'); fio.unobserve(x.target); }
    }), { threshold: 0.12 });
    document.querySelectorAll('.cs-fade:not(.cs-hero .cs-fade)').forEach(el => fio.observe(el));

    /* hero: crossfade every 3s */
    const slides = [...document.querySelectorAll('.cs-hero__bg div')];
    if (!reduce) {
      let h = 0;
      setInterval(() => {
        slides[h].classList.remove('is-on');
        h = (h + 1) % slides.length;
        slides[h].classList.add('is-on');
      }, 3000);
    }

    /* map: fade in -> dots one by one -> stats count up left to right */
    // [x, y, color] taken from the "after" mockup; converted to % of map.svg below
    const DOTS = [[221,392,'#9cc9bf'],[301,492,'#f3b9cf'],[324,482,'#d9b8a5'],[311,541,'#8a97cf'],[332,578,'#e9a766'],
      [373,597,'#e07a8f'],[348,598,'#b6c28a'],[457,681,'#bfcf86'],[693,478,'#4fb0a5'],[701,502,'#e0705e'],
      [633,545,'#8f8f86'],[651,548,'#c9a94f'],[667,555,'#8fa0d4'],[668,586,'#8dc47a'],[771,588,'#86bfb4'],
      [823,583,'#c9b3a6'],[890,469,'#d9a9d9'],[1181,617,'#7d82a1']];
    const map = $('#csMap');
    const dots = DOTS.map(([x, y, c]) => {
      const d = document.createElement('i');
      d.className = 'cs-dot';
      d.style.cssText = `left:${(0.0176 + (x - 168) / 1112 * 0.9678) * 100}%;top:${(0.0624 + (y - 338) / 445 * 0.8819) * 100}%;background:${c}`;
      map.appendChild(d);
      return d;
    });
    const stats = [...document.querySelectorAll('.cs-stat')];

    function count(el) {
      const to = +el.dataset.to, sfx = el.dataset.sfx || '';
      if (reduce) { el.textContent = to + sfx; return; }
      const t0 = performance.now(), dur = 1400;
      (function tick(t) {
        const p = Math.min((t - t0) / dur, 1);
        el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3))) + sfx;
        if (p < 1) requestAnimationFrame(tick);
      })(t0);
    }
    function runMap() {
      const step = reduce ? 0 : 130, base = reduce ? 0 : 900;
      map.classList.add('on');
      dots.forEach((d, i) => setTimeout(() => d.classList.add('on'), base + i * step));
      const sBase = base + dots.length * step + (reduce ? 0 : 300);
      stats.forEach((s, i) => setTimeout(() => {
        s.classList.add('on');
        count($('b', s));
      }, sBase + i * (reduce ? 0 : 450)));
    }
    new IntersectionObserver((e, o) => {
      if (e[0].isIntersecting) { o.disconnect(); runMap(); }
    }, { threshold: 0.3 }).observe($('#csProj'));

    /* services: hover grows card, click expands it */
    const DATA = [
      { t: 'Geotechnical Mining Services',
        p: 'Our geotechnical services provide comprehensive engineering solutions to ensure slope stability, optimize mine designs, and enhance operational safety. Combining technical expertise with advanced engineering analysis, we offer:',
        l: ['Third-Party Peer Review: Independent evaluation of geotechnical studies and engineering designs to ensure technical accuracy, reliability, and compliance with industry standards.',
          'Back Analysis (Landslide Evaluation): In-depth investigation and analysis of slope failures to identify contributing factors and develop effective mitigation strategies.',
          'Open-Pit & Dump Stability Studies: Comprehensive stability assessments and engineering recommendations to support safe and reliable mining operations.',
          '2D & 3D Slope and Dump Design: Advanced numerical modeling and engineering design to optimize slope configurations, dump layouts, and overall mine planning.',
          'Geotechnical Studies for Pit Optimization: Geotechnical assessments and design recommendations to maximize resource recovery while maintaining slope stability and operational safety.',
          'Underground Mining Geotechnical Assessments: Engineering evaluations of underground ground conditions, excavation stability, and support systems to minimize geotechnical risks.',
          'Tailings Storage Facility Geotechnical Assessments: Comprehensive geotechnical investigations and stability evaluations to support the safe design, construction, and operation of tailings storage facilities.'] },
      { t: 'Hydrological & Hydrogeological Mining Services',
        p: 'Our hydrogeological expertise ensures effective water management and aquifer assessment to support mining sustainability. Services include:',
        l: ['Third-Party Peer Review: Independent assessments of hydrogeological and hydrological studies.',
          'Open-Pit Hydrology & Hydrogeology Studies: Ensuring water flow management and safety in surface mining.',
          'Underground Mining Hydrology & Hydrogeology Studies: Tailored solutions for underground water challenges.',
          'Pumping Tests: Comprehensive analysis of water extraction capabilities.',
          'Aquifer Identification: Locating and analyzing water sources for mining operations.',
          'Groundwater Modeling: Accurate simulation of groundwater behavior for planning and management.',
          'Geoelectric Surveys: Advanced subsurface investigation for water and mineral exploration.'] },
      { t: 'Rock Mass Scanning',
        p: 'Using cutting-edge technology, Lenusa provides accurate and reliable rock mass data to support mining operations. Our services include:',
        l: ['Drone Photogrammetry: High-resolution mapping for precise topographic and rock mass data.',
          '3D Lidar Scanning for Rock Mass: Detailed scans to ensure accurate geotechnical evaluations.',
          '3D Open-Pit Rock Mass Models: Comprehensive models for surface mining optimization.',
          '3D Underground Rock Mass Models: Advanced modeling for underground mining stability and design.'] }
    ];
    /* services: two versions to compare. data-mode a = card grows to full width, b = card opens beside the other two */
    const SV = [['gms', 'gms'], ['hhms', 'hhms'], ['rms', 'rms']];
    const WA = waLink();
    const mq = matchMedia('(max-width:800px)');
    const chev = d => `<svg width="22" height="22" viewBox="0 0 24 24"><path d="${d}" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    document.querySelectorAll('.cs-sv').forEach(root => {
      const A = root.dataset.mode === 'a';
      root.innerHTML = DATA.map((d, i) => {
        const [s, k] = SV[i];
        return `<div class="cs-sc" role="button" tabindex="0" aria-expanded="false" style="--bg:url(assets/images/consulting/services/${s}.jpg)">
          <div class="cs-sc__f"><img src="assets/icons/consulting/${k}-white.svg" alt=""><b class="cs-sc__t">${d.t}</b><span class="cs-more">Click for more information</span></div>
          ${A ? `<button type="button" class="cs-nav cs-nav--l" aria-label="Previous service" ${i === 0 ? 'disabled' : ''}>${chev('m15 5-7 7 7 7')}</button><button type="button" class="cs-nav cs-nav--r" aria-label="Next service" ${i === DATA.length - 1 ? 'disabled' : ''}>${chev('m9 5 7 7-7 7')}</button>` : ''}
          <div class="cs-ov">
            <div class="cs-ov__b"><p>${d.p}</p><ul>${d.l.map(x => `<li>${x}</li>`).join('')}</ul></div>
            <div class="cs-ov__f"><a class="wipe-button" target="_blank" rel="noopener noreferrer" href="${WA}?text=${encodeURIComponent(`Halo Lenusa, saya ingin konsultasi mengenai ${d.t}.`)}">Start Consulting!</a><button type="button" class="cs-x">Close Description</button></div></div>
        </div>`;
      }).join('');
      const cards = [...root.querySelectorAll('.cs-sc')];
      let sel = -1, hov = -1;
      // widths come from flex-grow, so the cards always fill the row (no white gaps while hovering fast)
      function layout() {
        root.classList.toggle('open', sel >= 0);
        cards.forEach((c, i) => { c.classList.toggle('sel', i === sel); c.setAttribute('aria-expanded', i === sel); });
        if (mq.matches) { cards.forEach(c => (c.style.flexGrow = '')); return; }
        const g = sel < 0 ? cards.map((_, i) => (hov < 0 ? 1 : i === hov ? 1.11 : 0.945))
          : A ? cards.map((_, i) => (i === sel ? 1 : 0))      // version 1: selected card takes the whole row
          : cards.map((_, i) => (i === sel ? 54 : 23));        // version 2: cards keep their place, selected one grows to 54%
        cards.forEach((c, i) => (c.style.flexGrow = g[i]));
      }
      const open = i => {
        if (i === sel) return;
        const p = sel;
        sel = i; hov = -1;
        if (A && p >= 0) { // arrows (version 1): plain crossfade between services
          root.classList.add('swap'); cards[p].classList.add('leaving');
          setTimeout(() => { cards[p].classList.remove('leaving'); root.classList.remove('swap'); }, 450);
        }
        layout();
      };
      const close = () => { const p = sel; sel = -1; hov = -1; layout(); if (p >= 0) cards[p].focus(); };
      cards.forEach((c, i) => {
        c.addEventListener('click', e => { if (!e.target.closest('.cs-ov, .cs-nav')) open(i); });
        c.addEventListener('keydown', e => { if (e.target === c && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); open(i); } });
        c.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse' && sel < 0) { hov = i; layout(); } });
        c.addEventListener('pointerleave', () => { if (sel < 0 && hov === i) { hov = -1; layout(); } });
      });
      root.addEventListener('click', e => {
        if (e.target.closest('.cs-x')) close();
        const n = e.target.closest('.cs-nav');
        if (n) open(sel + (n.classList.contains('cs-nav--r') ? 1 : -1));
      });
      root.addEventListener('keydown', e => { if (e.key === 'Escape' && sel >= 0) close(); });
      mq.addEventListener('change', layout);
      layout();
    });

    /* portfolio: cards link to their detail page; row has arrows + mouse drag when it overflows, touch scrolls natively */
    const t = $('#csPf'), prev = $('#csPrev'), next = $('#csNext');
    const upd = () => {
      prev.hidden = next.hidden = t.scrollWidth <= t.clientWidth + 4; // nothing to scroll (e.g. two cards): no arrows
      prev.disabled = t.scrollLeft < 4;
      next.disabled = t.scrollLeft > t.scrollWidth - t.clientWidth - 4;
    };
    const go = n => t.scrollBy({ left: n * t.clientWidth * 0.5, behavior: 'smooth' });
    prev.onclick = () => go(-1);
    next.onclick = () => go(1);
    t.addEventListener('scroll', upd, { passive: true });
    let drag = false, moved = false, x0 = 0, s0 = 0;
    t.addEventListener('pointerdown', e => { if (e.pointerType === 'mouse') { drag = true; moved = false; x0 = e.clientX; s0 = t.scrollLeft; } });
    t.addEventListener('pointermove', e => {
      if (!drag) return;
      const dx = e.clientX - x0;
      if (!moved && Math.abs(dx) > 5) { moved = true; t.classList.add('drag'); t.setPointerCapture(e.pointerId); }
      if (moved) t.scrollLeft = s0 - dx;
    });
    const end = () => { drag = false; t.classList.remove('drag'); setTimeout(() => (moved = false), 0); };
    t.addEventListener('pointerup', end);
    t.addEventListener('pointercancel', end);
    t.addEventListener('click', e => { if (moved) e.preventDefault(); }, true); // a drag is not a click on a card
    upd();
  })();
}

/* Software data. Source: Katalog_Produk_Software_Lenusa.pdf (29 Oct 2026, draft) and the four Waterloo mockups.
   Prices are not shown on cards or detail pages. Later: replace all() and get() with a fetch to the WordPress REST API.
   Product fields: id, vendor, name, tag (one-line subtitle), fn (main function), sum (card text), ver (optional),
   intro, pts (up to 3 hero callouts), secs (detail sections), cap, cta, check (true = still being verified). */
(() => {
  const VENDORS = {
    waterloo: {
      name: "Waterloo Hydrogeologic",
      logo: "assets/logos/vendors/waterloo-hydrogeologic.svg",
      about: "Pengembang software untuk profesional airtanah dengan pengalaman lebih dari 25 tahun. Software-nya dipakai untuk menilai, mengembangkan, dan mengelola sumber daya air dengan teknologi yang hemat biaya.",
    },
    seequent: {
      name: "Seequent",
      logo: "assets/logos/vendors/seequent.svg",
      about: "Perusahaan Bentley Systems dan pengembang software geosains. Solusinya membantu membaca data geosains yang kompleks untuk keputusan yang lebih baik di pertambangan, teknik sipil, pengelolaan lingkungan, panas bumi, dan airtanah.",
    },
  };
  const ICON = "assets/icons/software/icon-placeholder.svg";
  /* placeholder photos: replace with real screenshots per product (field "image") */
  const IMGS = ["assets/images/consulting/services/gms.jpg", "assets/images/shared/fallback/fallback-photo-03.jpg", "assets/images/consulting/portfolio/portfolio-03.jpg", "assets/images/shared/fallback/fallback-photo-04.webp"];

  const B = (h, ...p) => ({ h, p });
  const W = (h, ...p) => ({ h, p, w: 1 }); /* full width, stacked paragraphs */
  const W2 = (h, ...p) => ({ h, p, w: 2 }); /* full width, paragraphs in two columns */
  const S = (h, intro, blocks, o = {}) => ({ h, intro, blocks, ...o });
  const item = (id, vendor, name, tag, fn, sum, o = {}) => ({ id, vendor, name, tag, fn, sum, ...o });
  const MORE = B("Rincian terbaru", "Hubungi Lenusa untuk rincian fitur, versi, dan lisensi terbaru.");

  const ITEMS = [
    /* ---------- Waterloo Hydrogeologic (the four detail pages follow the mockups) ---------- */
    item("aquifertest", "waterloo", "AquiferTest", "Analisis pumping test dan slug test", "Analisis uji pemompaan, slug, dan Lugeon",
      "Analisis, interpretasi, dan visualisasi uji pemompaan, uji slug, dan uji Lugeon (packer). Tersedia edisi Standard dan Pro.", {
      icon: "assets/logos/products/aquifertest.svg",
      ver: "AquiferTest 15.0, dirilis 23 Januari 2026",
      intro: "Analisis, interpretasikan, dan visualisasikan pumping test serta slug test. AquiferTest menyediakan metode untuk berbagai kondisi akuifer dan pengujian.",
      pts: [
        ["Pumping dan slug test", "Analisis pumping, slug, dan Lugeon tests sesuai kondisi akuifer dan pengujian."],
        ["Data water-level", "Impor data lapangan, Level Logger, dan Diver untuk analisis water level."],
        ["Laporan PDF", "Sesuaikan laporan dengan data sumur, grafik analisis, dan peta lokasi."],
      ],
      cap: "Tampilan asli AquiferTest untuk analisis pumping test dan pelaporan.",
      secs: [
        S("Dari pengujian lapangan ke laporan", "Dirancang oleh hydrogeologist untuk hydrogeologist. Hubungkan data instrumen water-level dengan metode analisis sesuai kondisi akuifer dan pengujian, lalu susun laporan otomatis yang dapat disesuaikan.", [
          B("Impor data lapangan dan water-level logger", "Impor data lapangan dalam TXT, XLSX, atau ASCII (.ASC, .TDxt), serta rekaman Level Logger (.LEV) dan Diver (.MON)."),
          B("Pilih metode sesuai kondisi akuifer", "Analisis pumping, slug, dan Lugeon tests dengan solusi untuk confined, unconfined, leaky, dan fractured aquifers.", "Pertimbangkan wellbore storage, horizontal wells, dan single-well analysis, serta prediksi drawdown pada sumur yang direncanakan."),
          W("Laporan analisis otomatis", "Hasilkan laporan profesional dengan logo dan nama perusahaan, detail proyek, data sumur, grafik analisis dan peta lokasi. Sesuaikan template laporan dan ekspor hasil sebagai PDF."),
        ]),
        S("Analisis lanjutan, khusus AquiferTest Pro", "Seluruh kemampuan pada bagian ini hanya tersedia di AquiferTest Pro: type-curve matching, visualisasi kontur dan streamlines, koreksi barometrik dan baseline trend, serta diagnostic plots dan derivative analysis.", [
          B("Automatic type-curve matching", "Cocokkan type curve secara otomatis atau tampilkan curve families untuk visual matching. Pertimbangkan variable pumping rates, aquitard storage, dan boundary effects."),
          B("Contour plots dan color shading", "Tampilkan kontur drawdown dan interferensi sumur dengan color shading di atas peta udara atau citra satelit. Gunakan contour plots dan streamlines untuk menjelaskan hasil."),
          B("Koreksi barometrik dan baseline trend", "Lakukan preprocessing water level untuk mengompensasi tekanan barometrik dan mengoreksi baseline trend sebelum interpretasi aquifer test."),
          B("Diagnostic plots dan derivative analysis", "Identifikasi asumsi model melalui diagnostic plots dan derivative analysis, lalu pilih solusi pumping test yang sesuai."),
        ]),
      ],
      cta: ["Pilih AquiferTest sesuai kebutuhan uji", "Bahas AquiferTest atau edisi Pro, lisensi, pelatihan, dan dukungan teknis bersama Lenusa.", "Bahas AquiferTest"],
    }),
    item("aquachem", "waterloo", "AquaChem", "Analisis kualitas air dan geokimia", "Analisis kualitas air dan geochemical plotting",
      "Analisis dan plotting data kimia air, terintegrasi dengan PHREEQC untuk pemodelan geokimia.", {
      icon: "assets/logos/products/aquachem.svg",
      ver: "AquaChem 15.0, dirilis 30 September 2026",
      intro: "Analisis kualitas air melalui konversi satuan, charge balance, statistik, dan geochemical plots untuk membaca karakteristik kimia setiap sampel.",
      pts: [
        ["Geochemical plots", "Tampilkan lebih dari 20 geochemical plots dan sorot sampel yang sama lintas plot."],
        ["Analisis kualitas air", "Hitung water type, ion balance, TDS, hardness, dan alkalinity dari data sampel."],
        ["PHREEQC", "Jalankan perhitungan geokimia; buka PHREEQCi untuk analisis lanjutan."],
      ],
      cap: "Tampilan asli AquaChem untuk analisis dan geochemical plotting.",
      secs: [
        S("Dari sampel air ke interpretasi geokimia", "AquaChem menggabungkan impor dan ekspor data, lebih dari 20 geochemical plots, perhitungan tipe air dan kimia, laporan pelampauan terhadap beberapa standar, pelaporan otomatis, serta integrasi PHREEQC.", []),
        S("Lihat sampel yang sama di beberapa plot", "Tampilkan beberapa plot secara bersamaan, lalu pilih titik pada satu plot untuk menyorot sampel yang sama pada plot lain dan mengidentifikasi outlier.", [
          B("Geokimia", "Piper, Stiff, Durov, Schoeller, Wilcox, Giggenbach, Meteoric Water Line, Ludwig-Langelier dan Ternary."),
          B("Statistik", "Box and Whisker, Histogram, Probability, Quantile dan Detection Summary."),
          B("Umum", "Scatter, Pie, Stacked Bars, Radial dan Time Series."),
        ], { eyebrow: "Lebih dari 20 geochemical plots", cols: 3 }),
        S("Siapkan, analisis, lalu laporkan data", "", [
          B("Impor data dan QA/QC", "Impor file .txt, .csv, .xls, .xlsx, .mdb dan .accdb dengan sampel dalam baris, kolom, atau satu hasil per baris.", "Ekspor stasiun, hasil, dan plot ke teks, spreadsheet, gambar, dan dokumen Office. Gunakan kueri sederhana hingga kompleks untuk mencari dan mengorganisir data."),
          B("Hitung parameter kualitas air", "Konversi konsentrasi massa, molar, dan ekuivalen. Hitung water type, ion balance, jumlah anion/kation, TDS, hardness, dan alkalinity, dengan fungsi tanggal, exceedance, organic carbon, serta halogen.", "Evaluasi Langelier Saturation, Ryznar Stability, Puckorius Scaling dan Larson-Skold indices; Sodium Absorption Ratio, Magnesium Hazard dan Residual Sodium Carbonate.", "Hitung enthalpy dari suhu atau silika; estimasikan elevasi dan suhu infiltrasi dari Oxygen-18 serta Deuterium."),
          B("Susun laporan otomatis", "Sesuaikan Report Designer untuk laporan otomatis. Sample Reports membandingkan hasil terhadap beberapa standar dan statistik ringkasan, termasuk pelaporan exceedance.", "Buat tabel Station List dan Sample List, atau Sample Result Report untuk sampel aktif."),
          B("R-Console", "Jalankan R scripts dengan library yang tersedia untuk memperluas analisis, visualisasi, dan kategorisasi data kualitas air."),
          W("Jalankan pemodelan PHREEQC", "Kelola database termodinamika proyek dan jalankan perhitungan batch saturation indices serta log activities. Hasil disimpan dalam database proyek.", "Gunakan antarmuka dasar PHREEQC terintegrasi, atau buka sesi PHREEQCi lanjutan dengan sampel terpilih yang sudah dimuat."),
        ]),
      ],
      cta: ["Bahas alur analisis kualitas air Anda", "Diskusikan lisensi AquaChem, integrasi PHREEQC, pelatihan, dan dukungan teknis bersama Lenusa.", "Bahas AquaChem"],
    }),
    item("hydro-geoanalyst", "waterloo", "Hydro GeoAnalyst", "Manajemen data lingkungan", "Manajemen data lingkungan berbasis database",
      "Sistem manajemen data lingkungan berbasis database: analisis, pemetaan, dan visualisasi 2D dan 3D. Tersedia edisi HGA dan HGA+.", {
      icon: "assets/logos/products/hydro-geoanalyst.svg",
      ver: "Hydro GeoAnalyst 14.0 (HGA dan HGA+), dirilis April 2026",
      intro: "Kelola database lingkungan yang dapat disesuaikan, lalu hubungkan interpretasi data, analisis statistik, GIS mapping, grafik, dan visualisasi 2D/3D dalam Hydro GeoAnalyst (HGA).",
      pts: [
        ["Database lingkungan", "Kelola struktur database yang dapat disesuaikan, dengan validasi data sejak impor."],
        ["GIS dan visualisasi", "Interpretasikan data lewat peta, penampang, well profile, dan visualisasi 2D/3D."],
        ["Query Builder", "Susun, simpan, dan jalankan query tanpa menulis sintaks SQL."],
      ],
      cap: "Tampilan asli Hydro GeoAnalyst untuk interpretasi dan visualisasi data lingkungan.",
      secs: [
        S("Satu database untuk tim lingkungan", "HGA terhubung ke SQL Server untuk mengelola, menganalisis, dan berbagi data lingkungan dalam jumlah besar. Tim lingkungan, geoscientist, dan lembaga pemerintah dapat menggunakannya tanpa pengetahuan SQL yang mendalam.", [
          B("Validasi data sejak impor", "Validasi cerdas pada saat impor membantu melindungi kualitas data. Mulai dengan template database lingkungan, profil sumur umum, dan template laporan untuk mempercepat pengumpulan, impor, analisis, dan pelaporan.", "Pertahankan kontrol penuh atas struktur database yang dapat disesuaikan dan berkembang seiring pertumbuhan data Anda."),
          B("Susun query tanpa menulis SQL", "Buat, simpan, dan panggil kembali kueri sederhana hingga kompleks dengan Query Builder tanpa menulis sintaks SQL.", "Seret dan lepas field, gabungkan operator AND, OR, LIKE, dan IS untuk mengambil informasi yang diperlukan."),
          B("Baca data lewat peta dan penampang", "Interpretasikan data Anda dengan Map Manager, Cross Section Editor, Well Profile, Time Series Charts, dan Scene Viewer yang terintegrasi.", "Alat analisis yang dikembangkan oleh Waterloo Hydrogeologic memastikan interoperabilitas dan mempermudah pengadaan serta manajemen lisensi."),
          B("Akses bersama, dari kantor ke lapangan", "Berikan akses aman kepada pengguna jaringan ke database terpusat. Ambil profil sumur, peta, penampang, time series, dan laporan untuk interpretasi bersama.", "Rencanakan kunjungan lapangan dan kumpulkan data elektronik menggunakan perangkat mobile Apple dan Android."),
        ]),
        S("Data lingkungan dan geochemistry, terintegrasi", "Khusus HGA+: fitur geochemistry AquaChem, modul geokimia, dan R console melengkapi manajemen data serta kemampuan perluasan HGA.", [], {
          eyebrow: "Hydro GeoAnalyst Plus",
          bul: ["Manajemen data lingkungan HGA", "Geochemistry AquaChem terintegrasi", "Konsol R untuk analisis lanjutan"],
        }),
      ],
      cta: ["Tentukan kebutuhan database tim Anda", "Bahas pilihan HGA atau HGA+, lisensi, pelatihan, dan dukungan teknis bersama Lenusa.", "Bahas database"],
    }),
    item("visual-modflow-flex", "waterloo", "Visual MODFLOW Flex", "Groundwater flow & transport modeling", "Pemodelan aliran dan transport airtanah",
      "Pemodelan aliran airtanah dan transport, dengan dukungan MODFLOW-6, MODFLOW-USG, MT3D-USGS, MODPATH 7.2, dan particle tracking PRT.", {
      icon: "assets/logos/products/visual-modflow-flex.svg",
      ver: "Visual MODFLOW Flex 12.0, dirilis 24 Juni 2026",
      intro: "Gabungkan groundwater flow, contaminant transport, analisis, kalibrasi, dan visualisasi 3D dalam satu lingkungan pemodelan.",
      pts: [
        ["Pemodelan berbasis GIS", "Impor dan validasi data GIS; tentukan properti model langsung dari data sumber."],
        ["3D FlexViewer", "Periksa heads, pathlines, dan boundary conditions dalam 2D, 3D, atau multi-view."],
        ["MODFLOW-USG / LGR", "Pilih structured atau unstructured grid, lalu gunakan local refinement sesuai kebutuhan model."],
      ],
      cap: "Tampilan asli Visual MODFLOW Flex untuk groundwater modeling dan visualisasi 3D.",
      secs: [
        S("Dari data lapangan ke model air tanah", "Kembangkan model air tanah yang kredibel dalam alur kerja yang menjaga data mentah, interpretasi konseptual, dan skenario numerik tetap terhubung.", [
          B("Perbarui input tanpa memutus alur model", "Perbarui input dan desain grid saat tujuan proyek atau data berubah. Antarmuka berbasis workflow menunjukkan tahap yang sudah selesai dan pekerjaan berikutnya.", "Pemodelan konseptual 3D dan numerik berbasis GIS dalam satu lingkungan mengurangi kebutuhan preprocessing pihak ketiga dan risiko kesalahan transfer data."),
          B("Telusuri model hingga data sumbernya", "Tangani data resolusi tinggi dan sistem air tanah regional. Lihat input serta output bersama data GIS mentah dalam 3D, lalu telusuri input numerik ke borehole dan data konseptual.", "Bandingkan skenario alternatif, grid, dan interpretasi hidrogeologi secara berdampingan."),
        ]),
        S("Periksa model dari beberapa sudut", "", [
          B("Visualisasi 2D, 3D, dan FlexViewer", "Tampilkan objek konseptual, grid numerik, zona properti, boundary conditions, calculated heads, pathlines, dan water table dalam 2D, 3D, atau multi-view FlexViewer.", "Gunakan cut-away, cross-section, animasi dan video 3D, rendering OpenGL, isolines, contours, pathlines, dan shading. Tempatkan peta lokasi atau citra satelit di atas permukaan 3D."),
          B("Bandingkan beberapa model dalam satu proyek", "Bandingkan skenario steady-state dan transient, properti, input, dan grid dalam satu proyek. Buat alternatif secara paralel dan hitung perbedaan head antar run dengan ukuran grid yang sama atau berbeda.", "Gunakan analisis visual dan numerik untuk memilih model yang realistis."),
          B("Impor dan bangun model dari data GIS", "Impor format GIS umum dengan konversi sistem koordinat dan satuan otomatis, validasi, dan pengecekan kesalahan.", "Tetapkan batas model, zona properti, kondisi batas, dan atribut langsung dari data GIS."),
          B("Hubungkan model konseptual dan numerik", "Bangun model konseptual dan numerik dari data mentah. Tentukan geologi serta lapisan dari borehole dan cross-section; interpretasikan properti GIS secara independen dari grid.", "Validasi hasil terhadap data mentah, buat grid dan skenario ganda, dan evaluasi ketidakpastian melalui perbandingan head."),
          W2("Pilih grid sesuai kondisi geologi", "Gunakan structured atau unstructured grid untuk merepresentasikan pinch-out dan diskontinuitas. MODFLOW-USG mendukung akurasi, runtime, dan stabilitas; bandingkan grid alternatif dalam 2D dan 3D.", "Terapkan local refinement atau nested child grid MODFLOW-LGR, dengan refinement horizontal dan vertikal pada area yang membutuhkan detail."),
        ]),
      ],
      cta: ["Bahas kebutuhan model air tanah Anda", "Diskusikan lisensi Visual MODFLOW Flex, pelatihan, dan dukungan teknis bersama Lenusa.", "Bahas pemodelan"],
    }),
    /* ---------- Seequent (only the products Lenusa works with) ---------- */
    /* Sumber: https://www.seequent.com/products-solutions/leapfrog-geo/ ; https://files.seequent.com/PDFs/Release_Notes_LeapfrogGeo_2026.1.3_ProductRelease */
    item("leapfrog-geo", "seequent", "Leapfrog Geo", "Pemodelan geologi 3D", "Pemodelan geologi 3D berbasis implicit modelling",
      "Pemodelan geologi 3D dengan implicit modelling dari data bor, data struktur, peta GIS, dan geofisika. Bisa diperluas dengan Leapfrog Edge untuk estimasi sumber daya.", {
      ver: "Leapfrog Geo 2026.1, dengan rilis poin hingga 2026.1.3",
      intro: "Bangun contact surface geologi langsung dari data, lalu perbarui model setiap kali data bor baru masuk. Leapfrog Geo menyatukan banyak jenis data geosains dalam satu model 3D.",
      pts: [
        ["Implicit modelling", "Surface geologi dibentuk dari drillhole, titik, dan data struktur, lalu diperbarui saat data baru masuk."],
        ["Satu ruang kerja 3D", "Database bor, garis GIS, data struktur, dan peta 2D tampil bersama dalam satu scene."],
        ["Validasi visual", "Periksa model dengan stereonet, histogram, dan scatterplot yang terhubung langsung ke data."],
      ],
      cap: "Tampilan asli Leapfrog Geo untuk pemodelan geologi 3D.",
      secs: [
        S("Model yang ikut berubah saat data bertambah", "Interpretasi geologi jarang selesai sekali jadi. Leapfrog Geo menyusun ulang surface dari data, jadi model tetap mengikuti pemahaman terbaru tim.", [
          B("Data yang bisa dipakai", "Drilling data, structural measurements, peta GIS, block model, serta data geofisika 2D dan 3D masuk ke satu proyek.", "Gabungkan semuanya dalam satu implicit model 3D, bukan potongan model yang terpisah."),
          B("Aturan geologi sebagai kendali", "Atur kronologi surface dan structural trend agar model mengikuti konsep geologi yang Anda pegang.", "Saat data bor baru masuk, contact surface dihitung ulang dengan aturan yang sama."),
          B("Analisis interaktif", "Live stereonet, histogram, dan scatterplot membantu membaca data struktur dan sebaran kadar dalam 3D."),
          B("Kolaborasi tiga tingkat", "Tambahkan catatan, komentar, dan marker di dalam proyek. Lacak versi model lewat Seequent Central, lalu bagikan scene 3D interaktif ke pihak lain."),
        ]),
        S("Pembaruan di versi 2026.1", "Release notes Leapfrog Geo 2026.1 mencatat beberapa penambahan untuk perencanaan bor, model stratigrafi, dan estimasi.", [
          B("Drillhole planning", "Grid planner menyusun pola bor dengan pratinjau langsung, rotasi, dan batas area. Mode Collar & Target menghitung dip dan azimuth dari collar dan target yang ditetapkan di 3D."),
          B("Stratigraphic modelling", "Stratigraphic data explorer memeriksa data input, memvalidasi drillhole, dan menghitung statistik unit serta true thickness. Titik kontrol dibuat otomatis di lokasi pinch-out atau kontak yang hilang."),
          W("Estimasi dengan Leapfrog Edge", "Alur data preparation baru mengumpulkan declustering dan capping dalam satu folder, lengkap dengan alat pembanding skenario. Swath plot kini juga mendukung combined estimator."),
        ]),
      ],
      cta: ["Bahas kebutuhan model geologi Anda", "Diskusikan lisensi Leapfrog Geo, ekstensi Edge, pelatihan, dan dukungan teknis bersama Lenusa.", "Bahas Leapfrog Geo"],
    }),
    /* Sumber: https://www.seequent.com/products-solutions/leapfrog-works/ ; https://www.bentley.com/products/leapfrog-works */
    item("leapfrog-works", "seequent", "Leapfrog Works", "Pemodelan geologi 3D untuk sipil dan lingkungan", "Ground model 3D untuk proyek sipil dan lingkungan",
      "Ground model 3D untuk proyek sipil, lingkungan, dan infrastruktur. Dapat ditambah ekstensi Contaminants, Geophysics, dan Hydrogeology.", {
      ver: "Dokumentasi resmi tersedia untuk Leapfrog Works 2026.1",
      intro: "Susun ground model 3D dari data site investigation dan borehole, lalu tampilkan bersama desain teknik. Leapfrog Works dipakai untuk terowongan, bendungan, fondasi, dan pekerjaan lingkungan.",
      pts: [
        ["Dynamic 3D modelling", "Model diperbarui otomatis saat data borehole, GIS, grid 2D, atau peta baru diimpor."],
        ["Geologi dan desain", "Alignment, volume galian, terowongan, dan fondasi tampil di samping model geologi."],
        ["Tiga ekstensi", "Contaminants, Geophysics, dan Hydrogeology menambah kemampuan sesuai jenis proyek."],
      ],
      cap: "Tampilan asli Leapfrog Works untuk ground model 3D.",
      secs: [
        S("Kondisi bawah permukaan dalam satu model", "Data site investigation sering tersebar di banyak file. Leapfrog Works mengumpulkannya ke satu lingkungan 3D agar masalah terlihat sebelum penggalian dimulai.", [
          B("Model kategori dan numerik", "Bangun model geologi dari borehole, lalu gabungkan domain geologi dengan jenis tanah, rock mass rating, atau konsentrasi kontaminan.", "Uji hipotesis geologi lebih dulu, sebelum keputusan desain dikunci."),
          B("Interpolasi numerik", "Gunakan RBF interpolant untuk variabel kontinu seperti muka air tanah, suhu, atau konsentrasi. Distance function menghitung jarak dari batas geologi, sesar, atau alignment."),
          B("Cross-section yang ikut diperbarui", "Penampang dibuat dari model dan berubah saat model berubah. Penampang lama hasil interpretasi sebelumnya juga bisa diimpor untuk laporan."),
          B("Format data umum", "Data bawah permukaan dalam CSV, AGS, LAS, dan gINT. Desain teknik dalam DWG, DXF, DGN, dan LandXML. GIS dan terrain dalam GDB, SHP, TIFF, DEM, serta citra drone."),
        ]),
        S("Kerja bersama tim dan software lain", "", [
          B("Berbagi hasil", "Ekspor scene 3D, video, dan cross-section yang mudah dipahami klien, kontraktor, dan regulator. Scene bisa diberi anotasi."),
          B("Terhubung ke alat geoteknik", "Seequent Central mengatur versi model dan koordinasi tim. Leapfrog Works juga terhubung dengan OpenGround, GeoStudio, dan PLAXIS."),
          W("Ekstensi sesuai kebutuhan proyek", "Contaminants untuk pemodelan plume dan estimasi massa kontaminan. Geophysics untuk data seismic, GPR, dan magnetotelluric. Hydrogeology untuk menyusun model MODFLOW dan FEFLOW dari model geologi. Semua ekstensi memerlukan lisensi Leapfrog Works."),
        ]),
      ],
      cta: ["Bahas ground model proyek Anda", "Diskusikan lisensi Leapfrog Works, pilihan ekstensi, pelatihan, dan dukungan teknis bersama Lenusa.", "Bahas Leapfrog Works"],
    }),
    /* Sumber: https://www.seequent.com/products-solutions/leapfrog-works/contaminants-extension/ ; https://www.bentley.com/products/leapfrog-works */
    item("leapfrog-works-contaminants", "seequent", "Leapfrog Works: Contaminants", "Ekstensi Leapfrog Works", "Pemodelan plume dan estimasi massa kontaminan",
      "Ekstensi Leapfrog Works untuk memodelkan plume kontaminan dan menghitung massa serta volumenya dengan geostatistik.", {
      intro: "Bawa data kontaminan ke model geologi 3D, lalu estimasi lokasi dan massa kontaminan di zona saturated maupun unsaturated dengan alat geostatistik.",
      pts: [
        ["Plume di dalam model geologi", "Model kontaminasi berdampingan dengan model geologi dalam satu proyek."],
        ["Kriging dan variografi", "Bangun dan validasi variogram secara interaktif di lingkungan 3D."],
        ["Massa dan volume", "Hitung massa kontaminan dan volume tanah terdampak pada ambang konsentrasi tertentu."],
      ],
      cap: "Tampilan asli Leapfrog Works dengan ekstensi Contaminants untuk pemodelan plume.",
      secs: [
        S("Geostatistik untuk data kontaminan", "Impor data sampel air dan tanah, lalu petakan serta pantau plume 3D dan saltwater intrusion dari waktu ke waktu.", [
          B("Metode estimasi standar", "Pilih kriging, nearest neighbour, atau IDW. Variografi dan isosurfacing tersedia di ruang kerja yang sama."),
          B("Kendali variografi", "Susun interpretasi variogram dalam 3D dan validasi hasilnya. Hasil variografi bisa di-query."),
          B("Uji beberapa hipotesis", "Ubah parameter input dan lihat dampaknya pada hasil secara langsung. Varians di dalam model juga ditampilkan."),
          B("Domain geologi yang dinamis", "Gabungkan model plume dengan model geologi, sehingga batas litologi ikut memengaruhi estimasi."),
        ]),
        S("Hasil yang bisa diaudit", "", [
          B("Model ikut data terbaru", "Plume model diperbarui otomatis saat data baru masuk. Cross-section, tampilan 3D, massa kontaminan, dan volume tanah terdampak tetap terhubung untuk pelaporan."),
          B("Estimasi yang bisa dipertanggungjawabkan", "Variogram dan data di balik interpolant terbuka untuk diperiksa. Alat interogasi menunjukkan data mana yang menentukan hasil."),
          W("Perhitungan dengan block model", "Block model dipakai untuk menghitung massa dan volume kontaminan pada beberapa ambang konsentrasi. Hasil ini menjadi dasar perencanaan remediasi."),
        ]),
      ],
      cta: ["Bahas pemodelan kontaminan di lokasi Anda", "Diskusikan lisensi Leapfrog Works dan ekstensi Contaminants, pelatihan, dan dukungan teknis bersama Lenusa.", "Bahas Contaminants"],
    }),
    /* Sumber: https://www.seequent.com/products-solutions/leapfrog-energy/ */
    item("leapfrog-energy", "seequent", "Leapfrog Energy", "Pemodelan geologi 3D untuk energi", "Pemodelan geologi 3D untuk proyek energi",
      "Pemodelan geologi 3D untuk panas bumi, CCUS, angin lepas pantai, dan migas, termasuk perencanaan sumur berarah.", {
      intro: "Bangun model geologi 3D untuk proyek energi bawah permukaan. Leapfrog Energy menggabungkan data sumur, geofisika, dan penampang, lalu membantu merencanakan lintasan sumur.",
      pts: [
        ["Banyak data, satu scene", "Bathymetry, citra satelit, data sumur, grid geofisika 2D/3D, dan cross-section tampil bersama."],
        ["Directional well planning", "Susun dan uji lintasan sumur serta prognosis dalam 3D."],
        ["Empat sektor", "Panas bumi, CCUS, angin lepas pantai, dan migas."],
      ],
      cap: "Tampilan asli Leapfrog Energy untuk pemodelan geologi 3D proyek energi.",
      secs: [
        S("Model geologi untuk keputusan pengeboran", "Proyek energi bergantung pada pemahaman bawah permukaan sebelum sumur dibor. Leapfrog Energy memakai alur kerja berbasis workflow untuk menyusun model itu.", [
          B("Gabungkan data yang tersebar", "Masukkan bathymetry, citra satelit, data sumur, grid geofisika 2D dan 3D, serta penampang ke satu scene."),
          B("Bangun dan perbarui model", "Susun volume dan model geologi, lalu perbarui saat data baru masuk."),
          B("Uji model konseptual", "Bandingkan model 3D dengan data geofisika dan data lama. Model juga bisa dipakai bersama produk Seequent lain."),
          B("Rencanakan sumur berarah", "Susun lintasan dan prognosis sumur dalam 3D untuk menentukan target dan mendukung keputusan saat pengeboran berjalan."),
        ]),
        S("Sektor dan fitur lisensi", "", [
          B("Sektor yang dilayani", "Eksplorasi panas bumi, evaluasi lokasi penyimpanan dan pemanfaatan karbon (CCUS), perencanaan angin lepas pantai dan kondisi tanahnya, serta pemahaman cadangan dan sumber daya migas."),
          B("Isi lisensi", "Advanced geological modelling, well planning, numeric modelling, visualisasi, interoperabilitas industri, flow simulation, dan alat kolaborasi."),
          W("Berbagi hasil", "Bagikan scene dan video, atau terbitkan tampilan privat dan publik lewat Seequent Central untuk audiens teknis maupun non-teknis."),
        ]),
      ],
      cta: ["Bahas model geologi proyek energi Anda", "Diskusikan lisensi Leapfrog Energy, pelatihan, dan dukungan teknis bersama Lenusa.", "Bahas Leapfrog Energy"],
    }),
    /* Sumber: https://www.seequent.com/products-solutions/geostudio-2d/ (detail page: software-pages/geostudio-2d.js) */
    item("geostudio-2d", "seequent", "GeoStudio 2D", "Analisis geoteknik 2D", "Stabilitas lereng, seepage, tegangan, dan dinamik 2D",
      "Analisis geoteknik 2D untuk tanah dan batuan: SLOPE/W, SEEP/W, SIGMA/W, dan QUAKE/W. Tersedia paket GeoStudio 2D, Advanced, dan Ultimate.", {
      cta: ["Bahas analisis geoteknik 2D Anda", "Diskusikan paket GeoStudio 2D, lisensi, pelatihan, dan dukungan teknis bersama Lenusa.", "Bahas GeoStudio 2D"],
    }),
    /* Sumber: https://seequent.com/products-solutions/geostudio-3d/ ; https://www.seequent.com/products-solutions/geostudio-flow/ ; https://www.bentley.com/products/geostudio-flow */
    item("geostudio-3d", "seequent", "GeoStudio 3D", "Analisis geoteknik 3D", "Stabilitas lereng dan seepage 3D",
      "Analisis geoteknik 3D untuk tanah dan batuan: SLOPE3D dan SEEP3D. Tersedia paket GeoStudio 3D dan GeoStudio 3D Advanced.", {
      intro: "Dua lini GeoStudio dalam satu halaman. GeoStudio 3D menganalisis slope stability tiga dimensi. GeoStudio Flow memodelkan aliran air, panas, solute, dan udara pori secara terpisah atau terkopel.",
      pts: [
        ["SLOPE3D", "Slope stability limit equilibrium 3D untuk tanah dan batuan dengan beragam bentuk slip surface."],
        ["SEEP3D", "Groundwater flow 3D saturated/unsaturated, dan pore pressure-nya masuk ke analisis stabilitas."],
        ["Flow 2D dan 3D", "SEEP, TEMP, CTRAN, dan AIR tersedia dalam versi 2D (/W) dan 3D."],
      ],
      cap: "Tampilan asli GeoStudio untuk analisis slope stability 3D dan transfer proses.",
      secs: [
        S("GeoStudio 3D: stabilitas lereng tiga dimensi", "Tersedia paket GeoStudio 3D (SLOPE3D) dan GeoStudio 3D Advanced (SEEP3D dan SLOPE3D).", [
          B("SLOPE3D", "Metode limit equilibrium seperti Morgenstern-Price dan Spencer, pencarian dan optimasi slip surface, bidang lemah dan anisotropic surface, serta analisis probabilistik dan sensitivitas.", "Perkuatan anchor, pile, dan soil nail, beban surcharge dan seismik, serta partial factor analysis."),
          B("SEEP3D di paket Advanced", "Hitung groundwater flow steady-state dan transient, saturated dan unsaturated. Pore pressure dari seepage finite element langsung dipakai dalam stabilitas 3D."),
          W("Terhubung dengan Leapfrog", "Geometri dan material dibagikan dengan Leapfrog lewat alur kerja berbasis cloud. Beberapa analisis, geometri, dan dimensi bisa disimpan dalam satu file proyek."),
        ]),
        S("GeoStudio Flow: aliran, panas, dan massa", "GeoStudio 2D Flow berisi SEEP/W, TEMP/W, CTRAN/W, dan AIR/W. GeoStudio 3D Flow berisi SEEP3D, TEMP3D, CTRAN3D, dan AIR3D.", [
          B("Seepage", "Groundwater flow steady-state dan transient, saturated dan unsaturated. Soil-atmosphere coupling tersedia di versi 2D."),
          B("Heat transfer", "Konduksi hingga surface energy balance dan siklus freeze-thaw. Cocok untuk kasus ground freezing."),
          B("Solute dan gas", "Transport difusi hingga advection-dispersion dengan reaksi orde pertama, termasuk adsorption."),
          B("Udara pori", "Aliran udara di mine waste, cover system, dan media berpori lain, dari satu fase hingga terkopel udara-air."),
          W2("Aplikasi tambang dan sipil", "Bentley mencantumkan tailings storage facility, waste cover, ground freezing, bendungan urugan, dewatering galian dalam, serta infiltrasi hujan dan rapid drawdown.", "Parallel solver, Python API, dan Solver Manager membantu menjalankan banyak analisis. Model geologi dari Leapfrog bisa diimpor."),
        ]),
      ],
      cta: ["Bahas analisis 3D dan aliran Anda", "Diskusikan lisensi GeoStudio 3D atau GeoStudio Flow, pelatihan, dan dukungan teknis bersama Lenusa.", "Bahas GeoStudio"],
    }),
    /* Sumber: https://www.seequent.com/products-solutions/leapfrog-edge/ ; https://help.seequent.com/Geo/2026.1/en-GB/Content/estimation/estimators.htm ; https://help.seequent.com/Geo/2024.1/en-GB/Content/estimation/swath-plots.htm */
    item("leapfrog-edge", "seequent", "Leapfrog Edge", "Estimasi geostatistik", "Estimasi sumber daya di dalam Leapfrog Geo",
      "Ekstensi Leapfrog Geo untuk estimasi sumber daya: variografi 3D, kriging ordinary dan simple, IDW, nearest neighbour, RBF, serta swath plot.", {
      intro: "Leapfrog Edge menambah estimasi geostatistik ke Leapfrog Geo. Interpretasi geologi mengalir langsung ke estimasi, dengan antarmuka yang sama.",
      pts: [
        ["Variografi 3D", "Susun variogram model secara visual dan periksa parameternya di grafik."],
        ["Empat estimator", "Kriging ordinary dan simple, inverse distance, nearest neighbour, dan RBF."],
        ["Parameter report", "Perubahan parameter tercatat otomatis dalam audit log dan bisa diekspor ke Excel."],
      ],
      cap: "Tampilan asli Leapfrog Edge untuk variografi dan estimasi block model.",
      secs: [
        S("Estimasi yang terhubung dengan geologi", "Edge hanya tersedia sebagai ekstensi Leapfrog Geo. Saat interpretasi geologi berubah, domain estimasi ikut diperbarui.", [
          B("Estimator standar", "Inverse distance dengan declustering dan anisotropic distance, nearest neighbour dengan anisotropic search, kriging ordinary dan simple, serta RBF dengan global neighbourhood."),
          B("Search neighbourhood", "Alat interogasi menampilkan pilihan search neighbourhood secara visual, sehingga parameter bisa dicek sebelum dijalankan."),
          B("Block model", "Block model memuat geologi 3D, mendukung sub-blocking dan variable orientation, serta terhubung dengan BlockSync."),
          B("Data preparation", "Sejak versi 2026.1, declustering dan capping dikumpulkan dalam folder data preparation, lengkap dengan alat pembanding skenario."),
        ]),
        S("Validasi dan jejak audit", "", [
          B("Swath plots", "Bandingkan rata-rata nilai sampel dengan rata-rata nilai estimasi pada irisan block model. Bias, over- atau under-estimation, dan smoothing jadi terlihat."),
          B("Parameter report", "Setiap perubahan parameter estimasi tercatat otomatis dalam audit log. Ekspor ke Excel untuk kebutuhan compliance dan peninjauan."),
          W("Visualisasi 2D dan 3D", "Tampilkan structural trend, pola kadar, dan anomali dalam 2D dan 3D di samping model geologi."),
        ]),
      ],
      cta: ["Bahas alur estimasi sumber daya Anda", "Diskusikan lisensi Leapfrog Edge, pelatihan, dan dukungan teknis bersama Lenusa.", "Bahas Leapfrog Edge"],
    }),
    /* Sumber: https://www.seequent.com/products-solutions/imago/ */
    item("imago", "seequent", "Imago", "Katalog gambar inti bor", "Pengambilan, katalog, dan analisis gambar inti bor",
      "Platform cloud untuk mengambil, mengatalogkan, dan menganalisis foto inti bor dan RC chip, dengan AI Image Analysis untuk RQD, warna, dan kedalaman.", {
      intro: "Foto inti bor dipotong, diberi label, dan disinkronkan otomatis setelah diambil di core shed. Tim di kantor dan kontraktor bisa membukanya dari mana saja.",
      pts: [
        ["Capture X", "Kendalikan kamera, lalu labeli, crop, dan simpan foto core secara otomatis."],
        ["AI Image Analysis", "Hitung RQD, analisis warna, depth mapping, AutoCropping, dan linearisation."],
        ["Terhubung ke Leapfrog", "Integrasi dengan Leapfrog, MX Deposit, dan Oasis montaj."],
      ],
      cap: "Tampilan asli Imago untuk katalog dan analisis gambar inti bor.",
      secs: [
        S("Dari core shed ke cloud", "Imago menyimpan foto core secara terpusat. Core tetap terdokumentasi walau fisiknya rusak, terdegradasi, atau hilang.", [
          B("Imago Capture X", "Kendalikan kamera dari Capture X. Foto langsung diberi label, dipotong, dan disimpan."),
          B("Add-on Chip Shot dan Mobile Capture X", "Chip Shot memotret RC chip pada chip tray 2 sampai 5 kompartemen. Mobile Capture X mengambil foto geosains di lapangan dengan smartphone."),
          B("QC terhadap log dan assay", "Cek kesalahan atau anomali pada data assay dan logging dengan membandingkannya ke foto, tanpa memanggil ulang sampel core."),
          B("Akses bersama", "Satukan pustaka gambar, bagikan data ke stakeholder, dan beri akses jarak jauh ke kontraktor eksternal."),
        ]),
        S("Analisis dan integrasi", "", [
          B("AI Image Analysis", "Machine learning khusus geosains menghitung RQD, mencatat warna secara konsisten, memetakan kedalaman, memotong core box otomatis, dan melakukan linearisation. Penilaian jadi lebih seragam antar logger."),
          B("Imago Connect", "Toolkit konektivitas untuk alur ekspor, interoperabilitas antarprogram, otomasi, dan operasi batch. Akses API tersedia di semua paket."),
          W("Pilihan paket", "Paket Standard, Enterprise, dan Junior berlangganan 12 bulan, dengan kapasitas penyimpanan berbeda. Paket Junior khusus untuk perusahaan yang belum berproduksi atau lisensi akademik. Setiap lokasi tambang tambahan memerlukan langganan Imago tersendiri."),
        ]),
      ],
      cta: ["Bahas dokumentasi inti bor Anda", "Diskusikan langganan Imago, add-on, pelatihan, dan dukungan teknis bersama Lenusa.", "Bahas Imago"],
    }),
    /* Sumber: https://www.seequent.com/products-solutions/mx-deposit/ (detail page: software-pages/mx-deposit.js) */
    item("mx-deposit", "seequent", "MX Deposit", "Manajemen data lubang bor", "Logging core dan manajemen data lubang bor",
      "Database cloud untuk mencatat, mengelola, dan membagikan data lubang bor dan sampel titik, dengan logging online dan offline, validasi bawaan, serta QAQC assay.", {
      cta: ["Bahas pengelolaan data lubang bor Anda", "Diskusikan paket MX Deposit, lisensi, pelatihan, dan dukungan teknis bersama Lenusa.", "Bahas MX Deposit"],
    }),
  ];

  const seequentProductLogo = (name) => {
    if (/^Leapfrog\b/i.test(name)) return "assets/logos/products/leapfrog.svg";
    if (/^GeoStudio\b/i.test(name)) return "assets/logos/products/geostudio.svg";
    if (/^Imago$/i.test(name)) return "assets/logos/products/imago.svg";
    if (/^MX Deposit$/i.test(name)) return "assets/logos/products/mx-deposit.svg";
    return null;
  };
  /* card photos: assets/images/software/cards/<product id>.webp */
  const CARD_IMGS = {
    "aquifertest": "assets/images/software/cards/aquifertest.webp",
    "aquachem": "assets/images/software/cards/aquachem.webp",
    "hydro-geoanalyst": "assets/images/software/cards/hydro-geoanalyst.webp",
    "visual-modflow-flex": "assets/images/software/cards/visual-modflow-flex.webp",
    "leapfrog-geo": "assets/images/software/cards/leapfrog-geo.webp",
    "leapfrog-works": "assets/images/software/cards/leapfrog-works.webp",
    "leapfrog-works-contaminants": "assets/images/software/cards/leapfrog-works-contaminants.webp",
    "leapfrog-energy": "assets/images/software/cards/leapfrog-energy.webp",
    "geostudio-2d": "assets/images/software/cards/geostudio-2d.webp",
    "geostudio-3d": "assets/images/software/cards/geostudio-3d.webp",
    "leapfrog-edge": "assets/images/software/cards/leapfrog-edge.webp",
    "imago": "assets/images/software/cards/imago.webp",
    "mx-deposit": "assets/images/software/cards/mx-deposit.webp",
  };
  const cardImage = (id, i) =>
    CARD_IMGS[id] || IMGS[i % IMGS.length];
  const DATA = ITEMS.map((p, i) => ({
    icon: ICON,
    image: cardImage(p.id, i),
    ...(p.vendor === "seequent" && seequentProductLogo(p.name)
      ? { icon: seequentProductLogo(p.name), hasProductLogo: true }
      : {}),
    ...p,
  }));

  window.SoftwareData = {
    VENDORS,
    MORE,
    all: async () => DATA,
    get: async (id) => DATA.find((p) => p.id === id) || null,
  };
})();

/* Software list page (software.html): one carousel per vendor, tabs scroll to them, search filters by name */
(() => {
  const D = window.SoftwareData;
  const root = document.getElementById("sw-lists");
  if (!D || !root) return;
  const tabs = document.getElementById("sw-tabs");
  const search = document.getElementById("sw-search");
  const empty = document.getElementById("sw-empty");
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const card = (p) => `
    <li class="sw-card">
      <div class="sw-card__body">
        <h3 class="sw-card__name"><img${p.hasProductLogo ? ' class="sw-card__product-logo"' : ""} src="${p.icon}" alt="" width="24" height="24">${esc(p.name)}</h3>
        <p class="sw-card__sum">${esc(p.sum)}</p>
        <dl class="sw-dl">
          <div><dt>Fungsi utama</dt><dd>${esc(p.fn)}</dd></div>
          ${p.ver ? `<div><dt>Versi dan rilis</dt><dd>${esc(p.ver)}</dd></div>` : ""}
        </dl>
        <a class="sw-more" href="software-details.html?id=${p.id}">Selengkapnya<span class="ar-sr"> tentang ${esc(p.name)}</span></a>
      </div>
      <a class="sw-card__visual" href="software-details.html?id=${encodeURIComponent(p.id)}" aria-label="Lihat detail ${esc(p.name)}">
        <img class="sw-card__img" src="${p.image}" alt="" loading="lazy">
      </a>
    </li>`;

  /* one vendor at a time: the tab decides which vendor's software is listed (Waterloo first) */
  const section = (key, items) => `
    <section id="sw-${key}" class="sw-vsec" aria-labelledby="sw-${key}-t">
      <div class="sw-vh"><h2 id="sw-${key}-t">${esc(D.VENDORS[key].name)}</h2></div>
      <ul class="sw-track" aria-label="Software ${esc(D.VENDORS[key].name)}">${items.map(card).join("")}</ul>
    </section>`;

  let all = [];
  const fromHash = location.hash.slice(1).replace(/^sw-/, "");
  let active = D.VENDORS[fromHash] ? fromHash : "waterloo"; /* links from the detail page: software.html#sw-seequent */
  const setTabs = (shown) => tabs.querySelectorAll(".sw-tab").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.target === `sw-${shown}`)));

  /* no search: the active vendor tab. With a search: matches from every vendor, grouped by vendor, so a product is never "not found" just because it sits in the other tab */
  function render(q) {
    const words = q.trim().toLowerCase();
    if (!words) {
      const items = all.filter((p) => p.vendor === active);
      root.innerHTML = items.length ? section(active, items) : "";
      empty.hidden = items.length > 0;
      setTabs(active);
      return;
    }
    const hits = all.filter((p) => `${p.name} ${p.tag}`.toLowerCase().includes(words));
    const keys = Object.keys(D.VENDORS).filter((k) => hits.some((p) => p.vendor === k));
    root.innerHTML = keys.map((k) => section(k, hits.filter((p) => p.vendor === k))).join("");
    empty.hidden = hits.length > 0;
    setTabs(keys.includes(active) ? active : keys[0] || active);
  }

  D.all().then((items) => { all = items; render(""); });
  search.addEventListener("input", () => render(search.value));

  tabs.addEventListener("click", (e) => {
    const btn = e.target.closest(".sw-tab");
    if (!btn) return;
    active = btn.dataset.target.replace(/^sw-/, "");
    /* simpan tab di URL (tanpa menambah riwayat), supaya tombol Back dari halaman detail kembali ke tab yang sama */
    history.replaceState(null, "", `${location.pathname}${location.search}#sw-${active}`);
    render(search.value);
  });
})();

/* Software detail page (software-details.html?id=...): one template for every product */
(() => {
  const D = window.SoftwareData;
  const page = document.getElementById("sw-detail");
  if (!D || !page) return;
  const esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const ask = (p) =>
    `https://wa.me/${CONTACT.wa}?text=${encodeURIComponent(`Halo Lenusa, saya ingin bertanya tentang ${p.name}.`)}`;

  const block = (b) => `
    <div class="sw-blk${b.w ? " sw-blk--w" : ""}">
      <h3>${esc(b.h)}</h3>
      ${b.w === 2 ? `<div class="sw-blk__cols">${b.p.map((t) => `<p>${esc(t)}</p>`).join("")}</div>` : b.p.map((t) => `<p>${esc(t)}</p>`).join("")}
    </div>`;

  const sec = (s) => `
    <section class="sw-sec">
      ${s.eyebrow ? `<p class="sw-eyebrow">${esc(s.eyebrow)}</p>` : ""}
      <h2>${esc(s.h)}</h2>
      ${s.intro ? `<p class="sw-sec__p">${esc(s.intro)}</p>` : ""}
      ${s.blocks.length ? `<div class="sw-blocks${s.cols === 3 ? " sw-blocks--3" : ""}">${s.blocks.map(block).join("")}</div>` : ""}
      ${s.bul ? `<ul class="sw-bul">${s.bul.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>` : ""}
    </section>`;

  /* Vendor product pages rebuilt from the vendor sites. Waterloo data: software-waterloo.js (loaded by the page).
     Seequent data: software-pages/<id>.js, loaded only for the product being opened (see PAGE_FILES).
     Breadcrumb on top and the Lenusa CTA at the end stay; every sales button goes to Lenusa on WhatsApp. */
  const WH = window.WaterlooPages ? window.WaterlooPages(L) : {};
  const PAGE_FILES = ["leapfrog-geo", "leapfrog-works", "leapfrog-works-contaminants", "leapfrog-energy", "geostudio-2d", "geostudio-3d", "leapfrog-edge", "imago", "mx-deposit"];
  const loadPage = (id) => new Promise((done) => {
    if (!PAGE_FILES.includes(id)) return done();
    const s = document.createElement("script");
    s.src = `software-pages/${id}.js`;
    s.onload = s.onerror = done;
    document.head.append(s);
  });
  /* small HTML helpers handed to the page data files */
  const H = {
    ul: (...x) => `<ul>${x.map((i) => `<li>${i}</li>`).join("")}</ul>`,
    p: (...x) => x.map((s) => `<p>${s}</p>`).join(""),
    h3: (s) => `<h3>${s}</h3>`,
    h4: (s) => `<h4>${s}</h4>`,
    a: (href, text) => `<a href="${href}" target="_blank" rel="noopener noreferrer">${text}</a>`,
  };
  const pageData = (id) => WH[id] || (window.SoftwarePages && window.SoftwarePages[id] ? window.SoftwarePages[id](L, H) : null);
  const waMsg = (p, kind) => {
    const msg = {
      buy: L(`Hello Lenusa, I would like to ask about ${p.name}.`, `Halo Lenusa, saya ingin bertanya tentang ${p.name}.`),
      trial: L(`Hello Lenusa, I would like to try ${p.name} (trial).`, `Halo Lenusa, saya ingin mencoba ${p.name} (trial).`),
      support: L(`Hello Lenusa, I need technical support for ${p.name}.`, `Halo Lenusa, saya butuh dukungan teknis untuk ${p.name}.`),
      sales: L(`Hello Lenusa, I would like to discuss ${p.name}.`, `Halo Lenusa, saya ingin berdiskusi tentang ${p.name}.`),
    }[kind] || L(`Hello Lenusa, I would like to ask about ${p.name}.`, `Halo Lenusa, saya ingin bertanya tentang ${p.name}.`);
    return `https://wa.me/${CONTACT.wa}?text=${encodeURIComponent(msg)}`;
  };
  const ext = (href) => `href="${href}" target="_blank" rel="noopener noreferrer"`;
  /* button list: [target, label]; target "wa:<kind>" opens WhatsApp, anything else is an outside link */
  const btns = (p, list) => list && list.length
    ? `<div class="wh-links">${list.map(([to, label]) => `<a class="wipe-button" ${ext(to.startsWith("wa:") ? waMsg(p, to.slice(3)) : to)}>${label}</a>`).join("")}</div>`
    : "";
  const head = (b) => `${b.eyebrow ? `<p class="sq-eyebrow">${b.eyebrow}</p>` : ""}${b.h ? `<h2 class="wh-h2">${b.h}</h2>` : ""}${b.intro ? `<div class="sq-intro wh-rich">${b.intro}</div>` : ""}`;
  const tick = `<span class="wh-tick" role="img" aria-label="${L("Included", "Tersedia")}"></span>`;
  const whAcc = (items) => `<div class="wh-acc">${items.map(([h, body]) => `
    <details class="wh-acc__item"><summary><h3>${h}</h3><span aria-hidden="true"></span></summary><div class="wh-acc__body wh-rich">${body}</div></details>`).join("")}</div>`;
  const whBlock = (p, b, i) => {
    switch (b.t) {
      case "intro": return `<section class="wh-intro"><h2>${b.h}</h2>${b.body}</section>`;
      case "h": return `<h2 class="wh-h2 wh-sec">${b.h}</h2>`;
      case "new": return `
        <section class="wh-sec">
          <div class="wh-new">
            <div class="wh-new__icon"><img src="${b.icon}" alt="" width="96" height="96"></div>
            <div class="wh-new__text wh-rich"><h2>${b.h}</h2>${b.body || ""}</div>
          </div>
          ${whAcc(b.items)}
        </section>`;
      case "acc": return `<section class="wh-sec">${whAcc(b.items)}</section>`;
      case "why": return `
        <section class="wh-sec">
          <h2 class="wh-h2">${b.h}</h2>
          <div class="wh-split"><img src="${b.img}" alt="${b.alt || ""}" loading="lazy"><div class="wh-rich">${b.body}</div></div>
        </section>`;
      case "feat": return `
        <section class="wh-feat${i % 2 ? " wh-feat--rev" : ""}">
          <img class="wh-feat__img" src="${b.img}" alt="${b.alt || ""}" loading="lazy">
          <div class="wh-rich">${b.body}${b.links ? `<div class="wh-links">${b.links.map(([href, label]) => `<a class="wipe-button" ${ext(href)}>${label}</a>`).join("")}</div>` : ""}</div>
        </section>`;
      case "apps": return `
        <section class="wh-apps" style="--bg: url('${b.bg}')">
          <h2>${b.h}</h2>
          <ul>${b.items.map((x) => `<li>${x}</li>`).join("")}</ul>
        </section>`;
      case "cta": return ""; /* banner "Get Started" dihapus; CTA cukup di bagian Lenusa di bawah */
      /* ---- Seequent template ---- */
      case "hero": return `
        <header class="sq-hero">
          <div class="sq-hero__text">
            <h1>${b.h1}</h1>
            <div class="wh-rich">${b.body}</div>
            ${btns(p, [["wa:buy", L(`Ask about ${esc(p.name)}`, `Tanya tentang ${esc(p.name)}`)], ...(b.links || [])])}
          </div>
          <div class="sq-hero__media">
            ${(b.tabs ? b.tabs.map((x, k) => `<img src="${x[2]}" alt="" class="${k ? "" : "is-on"}"${k ? ' loading="lazy"' : ""}>`) : [`<img src="${b.img}" alt="" class="is-on">`]).join("")}
          </div>
          ${b.tabs ? `<div class="sq-tabs">${b.tabs.map(([h, t], k) => `
            <button type="button" class="sq-tab${k ? "" : " is-on"}" aria-pressed="${!k}"><span class="sq-tab__bar"><span></span></span><h3>${h}</h3><p>${t}</p></button>`).join("")}</div>` : ""}
        </header>`;
      case "cards": return `
        <section class="wh-sec">
          ${head(b)}
          <div class="sq-grid sq-grid--${b.cols || 3}">${b.items.map((c) => `
            <article class="sq-card${c.img ? " sq-card--img" : ""}">
              ${c.img ? `<img src="${c.img}" alt="" loading="lazy">` : ""}
              <div class="sq-card__body wh-rich">
                ${c.h ? `<h3>${c.h}</h3>` : ""}${c.body || ""}
                ${c.href ? `<a class="sq-more" ${ext(c.href)}>${c.more || L("Learn more", "Selengkapnya")}</a>` : ""}
                ${btns(p, c.links)}
              </div>
            </article>`).join("")}
          </div>
          ${btns(p, b.links)}
        </section>`;
      case "split": return `
        <section class="wh-feat sq-split${b.rev ? " wh-feat--rev" : ""}">
          <img class="wh-feat__img" src="${b.img}" alt="${b.alt || ""}" loading="lazy">
          <div class="wh-rich">${b.eyebrow ? `<p class="sq-eyebrow">${b.eyebrow}</p>` : ""}${b.h ? `<h2>${b.h}</h2>` : ""}${b.body || ""}${btns(p, b.links)}</div>
        </section>`;
      case "band": return ""; /* banner CTA ("Product success", "Speak with our experts", dll.) dihapus; CTA cukup di bagian Lenusa di bawah */
      case "video": return `
        <section class="wh-sec">
          ${head(b)}
          <div class="sq-video"><button type="button" class="sq-video__play" data-uuid="${b.uuid}" aria-label="${L("Play video", "Putar video")}"><img src="${b.thumb}" alt="" loading="lazy"><span aria-hidden="true"></span></button></div>
        </section>`;
      case "text": return `<section class="wh-sec">${head(b)}${b.body ? `<div class="wh-rich sq-text">${b.body}</div>` : ""}${btns(p, b.links)}</section>`;
      case "faq": return `<section class="wh-sec">${head(b)}${whAcc(b.items)}${btns(p, b.links)}</section>`;
      case "table": return `
        <section class="wh-sec">
          ${head(b)}
          <div class="wh-table-wrap"><table class="wh-table sq-table">
            <thead><tr>${b.cols.map((c, k) => `<th scope="col">${k ? c : `<span${c ? "" : ' class="ar-sr"'}>${c || L("Feature", "Fitur")}</span>`}</th>`).join("")}</tr></thead>
            <tbody>${b.rows.map((r) => typeof r === "string"
              ? `<tr class="wh-table__group"><th colspan="${b.cols.length}" scope="rowgroup">${r}</th></tr>`
              : `<tr><th scope="row">${r[0]}</th>${r.slice(1).map((c) => `<td>${c === 1 ? tick : c === 0 ? "" : c}</td>`).join("")}</tr>`).join("")}</tbody>
          </table></div>
        </section>`;
    }
    return "";
  };
  const whView = (p, w) => {
    let n = 0; /* feature rows alternate image left / right */
    return `
      ${w.hero ? `<header class="wh-hero" style="--bg: url('${w.hero}')">
        <h1>${esc(p.name)}</h1>
        <div class="wh-hero__btns">
          <a class="wipe-button" ${ext(waMsg(p, "buy"))}>${L(`Ask about ${esc(p.name)}`, `Tanya tentang ${esc(p.name)}`)}</a>
        </div>
      </header>` : ""}
      ${w.blocks.map((b) => whBlock(p, b, b.t === "feat" ? n++ : 0)).join("")}`;
  };
  /* behaviour for the rebuilt pages: hero tabs that rotate the screenshot, click-to-play videos */
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const initPage = (root) => {
    root.querySelectorAll(".sq-hero").forEach((hero) => {
      const tabs = [...hero.querySelectorAll(".sq-tab")];
      const imgs = [...hero.querySelectorAll(".sq-hero__media img")];
      if (!tabs.length) return;
      let cur = 0, timer;
      const show = (k) => {
        cur = k;
        tabs.forEach((t, i) => { t.classList.toggle("is-on", i === k); t.setAttribute("aria-pressed", String(i === k)); });
        imgs.forEach((im, i) => im.classList.toggle("is-on", i === k));
      };
      hero.classList.toggle("is-auto", !reduceMotion);
      if (!reduceMotion) timer = setInterval(() => show((cur + 1) % tabs.length), 6000);
      tabs.forEach((t, i) => t.addEventListener("click", () => { clearInterval(timer); hero.classList.remove("is-auto"); show(i); }));
    });
    root.querySelectorAll(".sq-video__play").forEach((b) => b.addEventListener("click", () => {
      const f = document.createElement("iframe");
      f.src = `https://play.vidyard.com/${b.dataset.uuid}?autoplay=1`;
      f.title = L("Product video", "Video produk");
      f.allow = "autoplay; fullscreen";
      f.allowFullscreen = true;
      b.replaceWith(f);
    }));
  };

  /* halaman produk resmi vendor, dipakai untuk bagian "Sumber informasi" di akhir halaman */
  const SQURL = "https://www.seequent.com/products-solutions";
  const WHURL = "https://www.waterloohydrogeologic.com/products";
  const SOURCE = {
    "visual-modflow-flex": `${WHURL}/visual-modflow-flex/`,
    "hydro-geoanalyst": `${WHURL}/hydro-geoanalyst/`,
    "aquachem": `${WHURL}/aquachem/`,
    "aquifertest": `${WHURL}/aquifertest/`,
    "leapfrog-geo": `${SQURL}/leapfrog-geo/`,
    "leapfrog-works": `${SQURL}/leapfrog-works/`,
    "leapfrog-works-contaminants": `${SQURL}/leapfrog-works/contaminants-extension/`,
    "leapfrog-energy": `${SQURL}/leapfrog-energy/`,
    "leapfrog-edge": `${SQURL}/leapfrog-edge/`,
    "geostudio-2d": `${SQURL}/geostudio-2d/`,
    "geostudio-3d": `${SQURL}/geostudio-3d/`,
    "imago": `${SQURL}/imago/`,
    "mx-deposit": `${SQURL}/mx-deposit/`,
  };

  /* teks CTA penutup versi Inggris (versi Indonesia ada di data produk: p.cta) */
  const CTA_EN = {
    "aquifertest": ["Choose AquiferTest for your testing needs", "Talk to Lenusa about AquiferTest or the Pro edition, licensing, training, and technical support.", "Discuss AquiferTest"],
    "aquachem": ["Discuss your water quality analysis workflow", "Talk to Lenusa about AquaChem licensing, PHREEQC integration, training, and technical support.", "Discuss AquaChem"],
    "hydro-geoanalyst": ["Define your team's database needs", "Talk to Lenusa about HGA or HGA+, licensing, training, and technical support.", "Discuss the database"],
    "visual-modflow-flex": ["Discuss your groundwater modelling needs", "Talk to Lenusa about Visual MODFLOW Flex licensing, training, and technical support.", "Discuss modelling"],
    "leapfrog-geo": ["Discuss your geological modelling needs", "Talk to Lenusa about Leapfrog Geo licensing, the Edge extension, training, and technical support.", "Discuss Leapfrog Geo"],
    "leapfrog-works": ["Discuss your project's ground model", "Talk to Lenusa about Leapfrog Works licensing, extension options, training, and technical support.", "Discuss Leapfrog Works"],
    "leapfrog-works-contaminants": ["Discuss contaminant modelling at your site", "Talk to Lenusa about Leapfrog Works and the Contaminants extension, training, and technical support.", "Discuss Contaminants"],
    "leapfrog-energy": ["Discuss the geological model of your energy project", "Talk to Lenusa about Leapfrog Energy licensing, training, and technical support.", "Discuss Leapfrog Energy"],
    "geostudio-2d": ["Discuss your 2D geotechnical analysis", "Talk to Lenusa about GeoStudio 2D plans, licensing, training, and technical support.", "Discuss GeoStudio 2D"],
    "geostudio-3d": ["Discuss your 3D and flow analysis", "Talk to Lenusa about GeoStudio 3D or GeoStudio Flow licensing, training, and technical support.", "Discuss GeoStudio"],
    "leapfrog-edge": ["Discuss your resource estimation workflow", "Talk to Lenusa about Leapfrog Edge licensing, training, and technical support.", "Discuss Leapfrog Edge"],
    "imago": ["Discuss your drill core documentation", "Talk to Lenusa about Imago subscriptions, add-ons, training, and technical support.", "Discuss Imago"],
    "mx-deposit": ["Discuss your drillhole data management", "Talk to Lenusa about MX Deposit plans, licensing, training, and technical support.", "Discuss MX Deposit"],
  };

  const view = (p) => {
    const v = D.VENDORS[p.vendor];
    const secs = p.secs || [{ h: "Informasi produk", intro: "", blocks: [D.MORE] }];
    const cta = (LANG === "en" && CTA_EN[p.id]) || p.cta || [`Bahas ${p.name} bersama Lenusa`, `Diskusikan ${p.name}, versi, dan lisensinya bersama Lenusa.`, p.name.length <= 20 ? `Bahas ${p.name}` : "Bahas produk ini"];
    const pts = p.pts || [];
    document.title = `${p.name} | Lenusa.id`;
    /* tombol WhatsApp melayang: pesan khusus produk yang sedang dibuka */
    window.__waProduct = p.name;
    const fab = document.querySelector(".floating-whatsapp");
    if (fab) fab.href = waLink(pillarChat());
    return `
      <nav class="sw-crumb" aria-label="Breadcrumb">
        <a href="software.html">Software</a><span aria-hidden="true">/</span>
        <a href="software.html#sw-${p.vendor}">${esc(v.name)}</a><span aria-hidden="true">/</span>
        <strong aria-current="page">${esc(p.name)}</strong>
      </nav>
      ${pageData(p.id) ? whView(p, pageData(p.id)) : `
      <header class="sw-dh">
        <div class="sw-dh__content">
          <div class="sw-dh__title">
            <img class="sw-dh__icon" src="${p.icon}" alt="" width="44" height="44">
            <h1>${esc(p.name)}</h1>
          </div>
          <p class="sw-lead">${esc(p.intro)}</p>
        </div>
        <img class="sw-dh__vendor" src="${v.logo}" alt="${esc(v.name)}">
      </header>
      <section class="sw-hero${pts.length ? "" : " sw-hero--solo"}" aria-label="Gambaran ${esc(p.name)}">
        ${pts.length ? `<ul class="sw-points">${pts.map(([h, t]) => `<li class="sw-point"><h2>${esc(h)}</h2><p>${esc(t)}</p></li>`).join("")}</ul>` : ""}
        <figure class="sw-shot">
          <div class="sw-screen"><img src="${p.image}" alt=""></div>
          <span class="sw-stand" aria-hidden="true"></span>
          <figcaption>${esc(p.cap || `Tampilan ${p.name}.`)}</figcaption>
        </figure>
      </section>
      ${secs.map(sec).join("")}`}
      ${SOURCE[p.id] ? `
      <aside class="ar-source sw-credit" aria-labelledby="sw-credit-t">
        <h2 id="sw-credit-t">${L("Source", "Sumber informasi")}</h2>
        <p>${L(`This page summarises product information from ${esc(v.name)}. The product name, logo, and original materials belong to ${esc(v.name)}.`, `Halaman ini merangkum informasi produk dari ${esc(v.name)}. Nama produk, logo, dan materi aslinya adalah milik ${esc(v.name)}.`)}</p>
        <p><a class="ar-link" href="${SOURCE[p.id]}" target="_blank" rel="noopener noreferrer">${L("View the original product page", "Baca halaman produk aslinya")}<span class="ar-sr"> ${L("(opens in a new tab)", "(terbuka di tab baru)")}</span></a></p>
      </aside>` : ""}
      <section class="sw-dcta" aria-labelledby="sw-cta-t">
        <div><h2 id="sw-cta-t">${esc(cta[0])}</h2><p>${esc(cta[1])}</p></div>
        <a class="wipe-button" href="${ask(p)}" target="_blank" rel="noopener noreferrer">${esc(cta[2])}</a>
      </section>`;
  };

  const id = new URLSearchParams(location.search).get("id");
  Promise.all([D.get(id), loadPage(id)]).then(([p]) => {
    page.innerHTML = p
      ? view(p)
      : `<div class="sw-missing"><h1>Software tidak ditemukan</h1><p>Produk yang Anda cari tidak ada atau sudah dipindahkan.</p><a class="wipe-button" href="software.html">Lihat semua software</a></div>`;
    initPage(page);
  });
})();


/* Event calendars: category tabs, quarter, month grids with training days, paged training cards.
   Cards link to the Training detail page; the Training page lists the same programmes (see TrainingData). */
(() => {
  const D = window.EventData;
  if (!D) return;
  const MONTHS = L(["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"], ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"]);
  const SHORT = L(["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"]);
  const WEEK = L(["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"], ["SEN", "SEL", "RAB", "KAM", "JUM", "SAB", "MIN"]);
  const PER_PAGE = 4;
  const esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const range = (s) => (s[1] ? `${s[1]}${s[2] !== s[1] ? ` - ${s[2]}` : ""} ${MONTHS[s[0] - 1]}` : L("Date to be announced", "Tanggal menyusul"));
  const pad = (n) => String(n).padStart(2, "0");
  const image = (e) => e.image || ["assets/images/consulting/portfolio/portfolio-03.jpg", "assets/images/consulting/services/gms.jpg", "assets/images/shared/fallback/fallback-photo-03.jpg", "assets/images/shared/fallback/fallback-photo-04.webp"][(e.id - 1) % 4]; /* same picture the Training page uses */

  document.querySelectorAll(".cal").forEach((root) => {
  const selectors = {
    "cal-cats": '[data-cal="cats"]',
    "cal-q": '[data-cal="quarter"]',
    "cal-clear": '[data-cal="clear"]',
    "cal-sub": '[data-cal="sub"]',
    "cal-status": '[data-cal="status"]',
    "cal-list": '[data-cal="list"]',
    "cal-pager": '[data-cal="pager"]',
    "cal-prev": '[data-cal="pager"] button:first-child',
    "cal-next": '[data-cal="pager"] button:last-child',
    "cal-months": '[data-cal="months"]',
  };
  const $ = (id) => root.querySelector(selectors[id]);
  const list = $("cal-list");
  if (!list) return;

  const state = { cat: D.CATEGORIES[0].id, q: 1, day: null, page: 1 };
  let all = [];

  const months = () => [0, 1, 2].map((i) => (state.q - 1) * 3 + i + 1);
  const inCat = () => all.filter((e) => e.cat === state.cat);
  const onDay = (e, m, d) => e.sessions.some((s) => s[0] === m && d >= s[1] && d <= s[2]);

  function renderMonths(items) {
    $("cal-months").innerHTML = months()
      .map((m) => {
        const offset = (new Date(D.YEAR, m - 1, 1).getDay() + 6) % 7;
        const total = new Date(D.YEAR, m, 0).getDate();
        const cells = Array.from({ length: offset }, () => "<span></span>");
        for (let d = 1; d <= total; d++) {
          const starts = items.some((e) => e.sessions.some((s) => s[0] === m && s[1] === d));
          const busy = items.some((e) => onDay(e, m, d));
          const picked = state.day && state.day[0] === m && state.day[1] === d;
          cells.push(
            busy
              ? `<button type="button" class="cal-day${starts ? " is-start" : ""}${picked ? " is-picked" : ""}" data-m="${m}" data-d="${d}" aria-pressed="${!!picked}" aria-label="${d} ${MONTHS[m - 1]}, ${L("training scheduled", "ada pelatihan")}">${pad(d)}</button>`
              : `<span class="cal-day">${pad(d)}</span>`
          );
        }
        return `<div class="cal-month"><h3>${MONTHS[m - 1]}</h3><div class="cal-grid">${WEEK.map((w) => `<span class="cal-wd">${w}</span>`).join("")}${cells.join("")}</div></div>`;
      })
      .join("");
  }

  const card = (e, ms) => {
    const chips = e.sessions
      .filter((s) => ms.includes(s[0]))
      .map((s) => {
        const hit = state.day && onDay({ sessions: [s] }, state.day[0], state.day[1]);
        return `<li class="cal-chip${hit ? " is-hit" : ""}" title="${esc(range(s))}"><b>${s[1] ? s[1] : "–"}</b><span>${SHORT[s[0] - 1]}</span></li>`;
      })
      .join("");
    return `<li><a class="cal-card" href="training-details.html?id=${e.id}" aria-label="${esc(e.title)}">
      <img src="${image(e)}" alt="" loading="lazy" draggable="false">
      <span class="cal-card__body">
        <span class="cal-card__title">${esc(e.title)}</span>
        <span class="cal-card__label">Training Date:</span>
        <ul class="cal-card__dates">${chips}</ul>
        <span class="cal-card__more">${L("More Training", "Pelatihan Lainnya")}</span>
      </span>
    </a></li>`;
  };

  function render() {
    const cat = D.CATEGORIES.find((c) => c.id === state.cat);
    $("cal-sub").textContent = cat.name;
    const ms = months();
    const items = inCat();
    renderMonths(items);

    let rows = items.filter((e) => e.sessions.some((s) => ms.includes(s[0])));
    if (state.day) rows = rows.filter((e) => onDay(e, state.day[0], state.day[1]));
    const last = Math.max(1, Math.ceil(rows.length / PER_PAGE));
    state.page = Math.min(state.page, last);
    const from = (state.page - 1) * PER_PAGE;

    $("cal-clear").hidden = !state.day;
    $("cal-prev").disabled = state.page <= 1;
    $("cal-next").disabled = state.page >= last;
    $("cal-pager").hidden = rows.length <= PER_PAGE;
    $("cal-status").textContent = rows.length ? L(`${rows.length} trainings, page ${state.page} of ${last}`, `${rows.length} pelatihan, halaman ${state.page} dari ${last}`) : L("No training", "Tidak ada pelatihan");

    if (!rows.length) {
      list.innerHTML = `<li class="cal-empty">${
        state.cat === "inhouse"
          ? L(`In-house schedules are arranged to match client requests. <a href="https://wa.me/${CONTACT.wa}" target="_blank" rel="noopener noreferrer">Contact Lenusa</a> to plan one.`, `Jadwal in-house disesuaikan dengan permintaan klien. <a href="https://wa.me/${CONTACT.wa}" target="_blank" rel="noopener noreferrer">Hubungi Lenusa</a> untuk merencanakannya.`)
          : L("No training for this selection.", "Tidak ada pelatihan pada pilihan ini.")
      }</li>`;
      return;
    }
    list.innerHTML = rows.slice(from, from + PER_PAGE).map((e) => card(e, ms)).join("");
  }

  $("cal-cats").addEventListener("click", (e) => {
    const b = e.target.closest(".cal-cat");
    if (!b) return;
    Object.assign(state, { cat: b.dataset.cat, day: null, page: 1 });
    $("cal-cats").querySelectorAll(".cal-cat").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    render();
  });
  $("cal-q").addEventListener("change", (e) => {
    Object.assign(state, { q: Number(e.target.value), day: null, page: 1 });
    render();
  });
  $("cal-months").addEventListener("click", (e) => {
    const b = e.target.closest(".cal-day[data-m]");
    if (!b) return;
    const day = [Number(b.dataset.m), Number(b.dataset.d)];
    state.day = state.day && state.day[0] === day[0] && state.day[1] === day[1] ? null : day;
    state.page = 1;
    const row = $("cal-months");
    const left = row.scrollLeft; /* render() rebuilds the months: keep the swipe position on mobile */
    render();
    row.style.scrollBehavior = "auto";
    row.scrollLeft = left;
    if (state.day && matchMedia("(max-width: 1000px)").matches) {
      list.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
    }
  });
  $("cal-clear").addEventListener("click", () => { state.day = null; state.page = 1; render(); });
  $("cal-prev").addEventListener("click", () => { state.page--; render(); });
  $("cal-next").addEventListener("click", () => { state.page++; render(); });

  D.all().then((items) => { all = items; render(); });
  });
})();

/* Booklet overlay (home). The three booklet cards are buttons; a click opens a dialog with the Canva embed on the
   left and the name, description, Download and Ask-a-question actions on the right. Close = X, Esc or the dark backdrop. */
(() => {
  const cards = [...document.querySelectorAll(".book-open")];
  if (!cards.length) return;
  const WA = waLink();
  const books = cards.map((b) => ({ name: b.dataset.name, desc: b.dataset.desc, view: b.dataset.view, download: b.dataset.download }));
  const esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const root = document.createElement("div");
  root.className = "bk";
  root.hidden = true;
  root.innerHTML = `
    <div class="bk__backdrop" data-close></div>
    <div class="bk__dialog" role="dialog" aria-modal="true" aria-labelledby="bk-title">
      <button type="button" class="bk__close" data-close aria-label="Close">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>
      </button>
      <div class="bk__embed"><iframe title="" allowfullscreen allow="fullscreen"></iframe></div>
      <div class="bk__info">
        <h3 id="bk-title" class="bk__title"></h3>
        <p class="bk__desc"></p>
        <div class="bk__actions">
          <a class="wipe-button bk__download" target="_blank" rel="noopener noreferrer">Download Booklet</a>
          <a class="wipe-button wipe-button--secondary bk__ask" target="_blank" rel="noopener noreferrer">Ask a question!</a>
        </div>
        <div class="bk__other">
          <p>Other Book:</p>
          <ul class="bk__thumbs"></ul>
        </div>
      </div>
    </div>`;
  document.body.appendChild(root);

  const q = (s) => root.querySelector(s);
  const frame = q(".bk__embed iframe");
  const closeBtn = q(".bk__close");
  let current = 0;
  let opener = null;

  function show(i) {
    current = i;
    const b = books[i];
    frame.title = b.name;
    frame.src = `${b.view}?embed`;
    q(".bk__title").textContent = b.name;
    q(".bk__desc").textContent = b.desc;
    q(".bk__download").href = b.download;
    q(".bk__ask").href = `${WA}?text=${encodeURIComponent(L(`Hello Lenusa, I have a question about ${b.name}`, `Halo Lenusa, saya ingin bertanya tentang ${b.name}`))}`;
    q(".bk__thumbs").innerHTML = books
      .map((o, n) => (n === i ? "" : `<li><button type="button" class="bk__thumb" data-i="${n}" aria-label="${esc(o.name)}"><iframe tabindex="-1" aria-hidden="true" loading="lazy" src="${esc(o.view)}?embed" title=""></iframe></button></li>`))
      .join("");
  }

  /* everything outside the dialog is made inert while it is open, so Tab cannot leave it
     (the cross-origin Canva iframe would otherwise hand focus back to the page behind) */
  let inerted = [];
  const setBackgroundInert = (on) => {
    if (on) {
      inerted = [...document.body.children].filter((el) => el !== root && !el.inert);
      inerted.forEach((el) => (el.inert = true));
    } else {
      inerted.forEach((el) => (el.inert = false));
      inerted = [];
    }
  };

  function open(i, from) {
    opener = from;
    show(i);
    root.hidden = false;
    setBackgroundInert(true);
    document.documentElement.classList.add("bk-lock");
    requestAnimationFrame(() => {
      root.classList.add("is-open");
      closeBtn.focus();
    });
  }

  function close() {
    if (root.hidden) return;
    root.classList.remove("is-open");
    document.documentElement.classList.remove("bk-lock");
    const done = () => {
      root.hidden = true;
      frame.src = "about:blank";
      setBackgroundInert(false);
      opener?.focus();
    };
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) done();
    else setTimeout(done, 250);
  }

  cards.forEach((b, i) => b.addEventListener("click", () => open(i, b)));
  root.addEventListener("click", (e) => {
    if (e.target.closest("[data-close]")) return close();
    const t = e.target.closest(".bk__thumb");
    if (t) show(Number(t.dataset.i));
  });
  document.addEventListener("keydown", (e) => {
    if (root.hidden) return;
    if (e.key === "Escape") return close();
    if (e.key !== "Tab") return;
    const f = [...root.querySelectorAll('button, a[href], iframe:not([tabindex="-1"])')].filter((x) => !x.closest("[hidden]") && x.tabIndex !== -1);
    if (!f.length) return;
    const first = f[0];
    const last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
})();

/* ---------- Groundwater: Our Service Process (scroll-driven timeline) ----------
   Markup: section.sp > .sp__stage > h2, .sp__diagram (svg wave + .sp__vline + ol.sp__list), button.sp__reset.

   SCROLL PROGRESS. Desktop: the section is 520svh tall and .sp__stage is sticky, so
     p = (scrollY - sectionTop) / (sectionHeight - viewportHeight)
   runs from 0 (stage just pinned) to 1 (stage about to be released). Mobile/tablet (under 900px): nothing is
   pinned. A "tip" sits at 80% of the viewport height; the share of the vertical line the tip has passed is the
   line's draw value d, and p is found by running the anchor table below backwards.

   DRAWING THE LINE. Desktop: the SVG path gets stroke-dasharray = its length, and stroke-dashoffset =
   length * (1 - draw) hides the undrawn part. The gradient uses userSpaceOnUse, so colours stay put while the line grows.
   Vertical: .sp__vline is clipped from the bottom with --draw.

   REVEAL THRESHOLDS. Each milestone has an anchor p value (P_MILESTONE). The anchor table maps p to the drawn share
   of the line, and its entry for milestone i is the length of line that ends exactly under marker i (found by a search on
   the path), so the line reaches a marker at the same moment its p threshold is crossed. Around that value:
   marker appears just before, circle fades and scales in around it, text fades in right after.

   REVERSE SCROLLING. p is recomputed from the scroll position on every frame, so scrolling up retracts the line and
   hides milestones in reverse order. Once p reaches the end (the finished state) it is locked: scrolling up no longer
   reverses anything. The "Discuss Your Groundwater Needs" CTA (a.sp__cta) appears at that point.

   PERFORMANCE. No layout reads while scrolling (offsets are cached by measure() on load and resize), one
   requestAnimationFrame per scroll burst, CSS variables written only when their value changed, and the scroll
   listener exists only while the section is within one viewport of the screen (IntersectionObserver). */
(() => {
  const root = document.querySelector(".sp");
  if (!root) return;

  // reduced motion: show the finished state, nothing is pinned or animated
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
    root.classList.add("is-static");
    const staticCta = root.querySelector(".sp__cta");
    if (staticCta) staticCta.hidden = false;
    return;
  }

  const diagram = root.querySelector(".sp__diagram");
  const path = root.querySelector(".sp__path");
  const vline = root.querySelector(".sp__vline");
  const items = [...root.querySelectorAll(".sp-ms")];
  const cta = root.querySelector(".sp__cta");
  const narrow = matchMedia("(max-width: 899px)");

  const GRADIENT = [[0x47, 0xa1, 0x99], [0x8b, 0xb3, 0x7e], [0xcc, 0xc4, 0x63]]; // same colours as the SVG gradient
  const X_FROM = 11, X_TO = 1249;                  // x range of the wave inside the 1260 x 490 canvas
  const P_START = 0.02;                            // line starts to draw
  const P_MILESTONE = [0.07, 0.25, 0.43, 0.61, 0.79]; // p at which the line reaches marker 1..5
  const P_END = 0.88;                              // line complete
  const P_DONE = 0.9;                              // finished state: lock
  const TIP = 0.8;                                 // vertical layout: the line is drawn up to 80% of the viewport height

  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const seg = (p, a, b) => clamp((p - a) / (b - a));
  const easeOut = (t) => 1 - Math.pow(1 - t, 3);
  const colourAt = (t) => {
    const k = clamp(t) * (GRADIENT.length - 1);
    const i = Math.min(Math.floor(k), GRADIENT.length - 2);
    const f = k - i;
    return "rgb(" + GRADIENT[i].map((c, j) => Math.round(c + (GRADIENT[i + 1][j] - c) * f)).join(",") + ")";
  };
  // piecewise-linear lookup in a table of [x, y] points sorted by x (from = 0 maps x -> y, from = 1 maps y -> x)
  const lookup = (v, pts, from) => {
    const a = from, b = 1 - from;
    if (v <= pts[0][a]) return pts[0][b];
    for (let i = 1; i < pts.length; i++) {
      if (v <= pts[i][a]) {
        const span = pts[i][a] - pts[i - 1][a] || 1;
        return pts[i - 1][b] + ((v - pts[i - 1][a]) / span) * (pts[i][b] - pts[i - 1][b]);
      }
    }
    return pts[pts.length - 1][b];
  };

  let vertical = narrow.matches;
  let pathLen = 1, sectionTop = 0, total = 1, vTop = 0, vHeight = 1;
  let table = [[P_START, 0], [P_END, 1]];          // [p, draw] anchors, rebuilt by measure()
  let done = false, ticking = false, listening = false;

  // write a CSS variable only when its value changed
  const put = (el, name, value) => {
    const text = value.toFixed(3);
    const cache = el._sp || (el._sp = {});
    if (cache[name] === text) return;
    cache[name] = text;
    el.style.setProperty(name, text);
  };

  // length along the wave at which the line is under x (the wave only ever moves right, so a search works)
  const lengthAtX = (x) => {
    let lo = 0, hi = pathLen;
    for (let i = 0; i < 28; i++) {
      const mid = (lo + hi) / 2;
      if (path.getPointAtLength(mid).x < x) lo = mid; else hi = mid;
    }
    return hi;
  };

  // cache everything that needs layout; runs on load and resize only
  const measure = () => {
    vertical = narrow.matches;
    sectionTop = root.getBoundingClientRect().top + scrollY;
    if (!vertical) {
      pathLen = path.getTotalLength();
      path.style.strokeDasharray = pathLen;
      total = 4.2 * innerHeight;                 // 520svh section minus one screen; fixed so it does not depend on the released state
      table = [[P_START, 0]];
      items.forEach((li, i) => {
        const x = Number(li.dataset.x);
        table.push([P_MILESTONE[i], lengthAtX(x) / pathLen]);
        li.style.setProperty("--mk", colourAt((x - X_FROM) / (X_TO - X_FROM)));
      });
      table.push([P_END, 1]);
      vline.style.height = "";
    } else {
      const markers = items.map((li) => {
        const r = li.querySelector(".sp-marker").getBoundingClientRect();
        return r.top + r.height / 2 + scrollY;      // centre is not affected by the marker's own scale
      });
      vTop = diagram.getBoundingClientRect().top + scrollY;
      vHeight = markers[markers.length - 1] - vTop + 40;
      vline.style.height = vHeight + "px";
      table = [[P_START, 0]];
      items.forEach((li, i) => {
        const f = (markers[i] - vTop) / vHeight;
        table.push([P_MILESTONE[i], f]);
        li.style.setProperty("--mk", colourAt(f));
      });
      table.push([P_END, 1]);
    }
  };

  const render = (p, enter) => {
    put(root, "--hin", easeOut(enter));
    const draw = lookup(p, table, 0);
    if (vertical) {
      vline.style.setProperty("--draw", draw.toFixed(4));
    } else {
      path.style.strokeDashoffset = pathLen * (1 - draw);
      path.style.opacity = draw > 0.0005 ? 1 : 0;   // a zero-length dash would still paint the round cap
    }
    items.forEach((li, i) => {
      const a = P_MILESTONE[i];
      put(li, "--m", easeOut(seg(p, a - 0.05, a - 0.015))); // marker, as the line arrives
      put(li, "--c", easeOut(seg(p, a - 0.04, a + 0.04)));  // circle: fade + scale
      put(li, "--t", easeOut(seg(p, a, a + 0.06)));         // heading and description, right after
    });
  };

  const update = () => {
    ticking = false;
    const vh = innerHeight;
    let p, finished;
    if (!vertical) {
      p = clamp((scrollY - sectionTop) / total);
      finished = p >= P_DONE;
    } else {
      const d = clamp((scrollY + vh * TIP - vTop) / vHeight);
      p = lookup(d, table, 1);
      finished = d >= 0.999;
    }
    if (finished) done = true;
    const enter = clamp((scrollY + vh * 0.9 - sectionTop) / (vh * 0.45)); // heading fades in as the section enters
    render(done ? 1 : p, done ? 1 : enter);
    if (cta.hidden === done) cta.hidden = !done;   // the CTA appears once the animation is finished
    if (done) release();
  };

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  };
  const listen = (on) => {
    if (on === listening) return;
    listening = on;
    if (on) { addEventListener("scroll", onScroll, { passive: true }); update(); }
    else removeEventListener("scroll", onScroll);
  };
  const remeasure = () => { measure(); update(); };

  // finished: drop the pinned run so the page scrolls freely. The stage keeps its place on screen
  // (its top is at the section top once the pin is gone), so the scroll position is corrected by the same amount.
  const release = () => {
    if (vertical || root.classList.contains("is-released")) return;
    const stageTop = root.querySelector(".sp__stage").getBoundingClientRect().top;
    root.classList.add("is-released");
    scrollTo({ top: sectionTop - stageTop, behavior: "instant" });
  };

  const io = new IntersectionObserver((entries) => listen(entries[0].isIntersecting), { rootMargin: "100% 0px" });
  io.observe(root);
  const ro = "ResizeObserver" in window ? new ResizeObserver(() => remeasure()) : null;
  if (ro) ro.observe(document.body);              // layout above the section changed (fonts, images)
  addEventListener("resize", remeasure, { passive: true });
  addEventListener("load", remeasure);
  addEventListener("pagehide", () => {
    io.disconnect();
    if (ro) ro.disconnect();
    removeEventListener("scroll", onScroll);
    removeEventListener("resize", remeasure);
    removeEventListener("load", remeasure);
  });

  measure();
  update();
})();

/* Portfolio detail page (portfolio-details.html?id=...): one template for every project.
   Source: Company Profile (Canva) pages 27-32. Later: replace PF with a fetch to the WordPress REST API. */
(() => {
  const root = document.getElementById("pf-detail");
  if (!root) return;
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const IMG = "assets/images/consulting/portfolio/";
  const PF = {
    "kpuc-ipd14": {
      title: "Comprehensive Geotechnical and Hydrogeological Solutions for Mining Challenges",
      over: "Project Overview: Geotechnical Risk Assessment for IPD-14 Disposal Area",
      cover: IMG + "portfolio-03.jpg",
      intro: [
        "The IPD-14 disposal area, part of PT Kayan Putra Utama Coal (KPUC)'s mining site, faced significant geotechnical challenges, including repeated land movements in 2019 and 2020. These movements threatened operational safety and the surrounding residential areas, posing risks such as property damage and environmental hazards. The identified causes included excessive pore water pressure, high groundwater saturation, and poor compaction of disposed materials.",
        "Without immediate mitigation, these issues risked disrupting mining operations, increasing operational costs, and affecting community trust due to potential safety hazards in nearby residential zones.",
      ],
      split: {
        img: IMG + "portfolio-01.jpg", cap: "", /* stock photo: no "documentation" caption until the real project photo is in */
        lead: "Lenusa partnered with KPUC to conduct a thorough investigation and mitigation plan for the IPD-14 area. Our multidisciplinary approach included:",
        groups: [["Comprehensive Data Collection:", [
          "Geotechnical drilling at 14 points, including full coring and open-hole methods.",
          "Laboratory testing for soil and rock strength properties.",
          "Photogrammetry to capture detailed topographical data.",
          "Geophysical surveys (resistivity and microseismic) to analyze subsurface conditions."]]],
      },
      groups: [
        ["Detailed Risk Assessment and Zoning:", [
          "Developed a qualitative risk matrix to classify zones based on hazard levels.",
          "Provided tailored recommendations for each zone, addressing site-specific challenges."]],
        ["Innovative Engineering Solutions:", [
          "Surface and subsurface drainage systems to control water saturation.",
          "Vegetation programs for enhanced water absorption and soil stabilization.",
          "Geometric reshaping of slopes for improved stability.",
          "Installation of monitoring wells and submersible pumps to manage pore water pressure."]],
      ],
      figs: [[IMG + "portfolio-02.jpg", ""], ["assets/images/about/bg-1.jpg", "Documentation of Activities with Lenusa"]],
      after: ["The implemented solutions successfully stabilized the IPD-14 disposal area, reducing groundwater saturation and pore water pressure. Monitoring reports indicated improved safety and operational reliability, with clear reductions in land movement risks."],
    },
    "ckp-underground": {
      title: "Hydrology & Hydrogeology Study for Underground Mining – PT Cikondang Kancana Prima (CKP)",
      over: "Project Overview: Hydrogeological Risk Assessment for Underground Mining at PT. CKP's site",
      cover: IMG + "portfolio-01.jpg",
      intro: [
        "PT Cikondang Kancana Prima (CKP), an underground mining company, faced significant challenges in water resource management at its operational site. Without a thorough understanding of hydrology and hydrogeology conditions, the mine was at risk of flooding, excessive groundwater pressure, and inefficient dewatering systems. Additionally, compliance with environmental regulations required precise mapping of water flow and its potential impacts on mining operations.",
      ],
      split: {
        img: IMG + "portfolio-02.jpg", cap: "",
        lead: "Without a comprehensive study, CKP was exposed to:",
        groups: [["The Risks", [
          "Operational Disruptions caused by uncontrolled water inflow into underground tunnels.",
          "Structural Damage due to excessive groundwater pressure.",
          "Inefficient Dewatering System planning, leading to higher operational costs.",
          "Non-Compliance with Environmental Regulations, which could result in penalties or operational halts."]]],
      },
      groups: [], figs: [], after: [],
    },
  };
  /* New projects: add an entry above (same fields) and a matching <a class="cs-rc"> card in consulting.html. */

  const list = ([h, items]) => `<h3>${esc(h)}</h3><ul>${items.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>`;
  const pfId = new URLSearchParams(location.search).get("id");
  const p = pfId && Object.hasOwn(PF, pfId) ? PF[pfId] : null; // ignore inherited keys like "constructor"
  if (!p) {
    document.getElementById("pf-page").innerHTML = `<div class="ar-wrap ar-missing"><p>Portfolio not found.</p><a class="wipe-button ar-btn" href="consulting.html#portfolio">Back to portfolio</a></div>`;
    return;
  }
  document.title = `${p.title} | Lenusa.id`;
  document.getElementById("p-crumb").textContent = p.title;
  document.getElementById("p-title").textContent = p.title;
  document.getElementById("p-over").textContent = p.over;
  const cover = document.getElementById("p-cover");
  cover.src = p.cover; cover.alt = "";

  document.getElementById("p-body").innerHTML =
    `<h2>Our Project Portfolio: ${esc(p.title)}</h2>` +
    p.intro.map((t) => `<p>${esc(t)}</p>`).join("") +
    `<div class="pfd__split"><figure><img src="${esc(p.split.img)}" alt="" loading="lazy">${p.split.cap ? `<figcaption>${esc(p.split.cap)}</figcaption>` : ""}</figure>` +
    `<div><p>${esc(p.split.lead)}</p>${p.split.groups.map(list).join("")}</div></div>` +
    p.groups.map(list).join("") +
    (p.figs.length ? `<ul class="ar-figs">${p.figs.map(([src, cap]) => `<li><figure><img src="${esc(src)}" alt="" loading="lazy">${cap ? `<figcaption>${esc(cap)}</figcaption>` : ""}</figure></li>`).join("")}</ul>` : "") +
    p.after.map((t) => `<p>${esc(t)}</p>`).join("");
})();
