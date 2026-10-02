// =========================================================
// เมนูด้านบน + ท้ายเว็บ + ปุ่มติดต่อลอย (ใช้ร่วมกันทุกหน้า แก้ที่นี่ที่เดียว)
// แต่ละหน้าบอกข้อมูลผ่าน <body data-page="..." data-root="...">
//   data-page : หน้านี้คือหน้าไหน (home, rooms, gallery, stay, contact, booking)
//   data-root : ทางกลับไปโฟลเดอร์หลัก ("" สำหรับหน้าไทย, "../" สำหรับหน้าอังกฤษใน en/)
// =========================================================
(() => {
  const D = window.LAGOON;
  const lang = document.documentElement.lang === 'en' ? 'en' : 'th';
  const page = document.body.dataset.page || '';
  const root = document.body.dataset.root || '';

  // ข้อความเมนู/ท้ายเว็บ 2 ภาษา
  const T = {
    th: {
      menu: 'เมนูหลัก',
      pages: { rooms: 'ที่พัก & ราคา', gallery: 'บรรยากาศ', stay: 'ข้อมูลเข้าพัก & FAQ', contact: 'ติดต่อ & เดินทาง' },
      book: 'จองที่พัก',
      switchTo: 'EN', switchLabel: 'Switch to English',
      tagline: 'ลานกางเต็นท์และบ้านพักริมทะเลสาบ',
      open: 'เปิดให้บริการทุกวัน',
      openMap: 'เปิดใน Google Maps →',
      contactH: 'ติดต่อจอง', followH: 'ติดตาม', menuH: 'เมนู',
      slogan: 'ธรรมชาติ + เพื่อน = ความสุข',
      call: 'โทร', chat: 'LINE',
    },
    en: {
      menu: 'Main menu',
      pages: { rooms: 'Stay & Rates', gallery: 'Gallery', stay: 'Good to Know', contact: 'Contact & Directions' },
      book: 'Book now',
      switchTo: 'ไทย', switchLabel: 'เปลี่ยนเป็นภาษาไทย',
      tagline: 'Lakeside camping & cabins',
      open: 'Open every day',
      openMap: 'Open in Google Maps →',
      contactH: 'Bookings', followH: 'Follow us', menuH: 'Menu',
      slogan: 'Nature + friends = happiness',
      call: 'Call', chat: 'LINE',
    },
  }[lang];

  const FILES = { home: 'index.html', rooms: 'rooms.html', gallery: 'gallery.html', stay: 'stay.html', contact: 'contact.html', booking: 'booking.html' };
  const here = (lang === 'en' ? root + 'en/' : root);           // โฟลเดอร์ของภาษานี้
  const other = (lang === 'en' ? root : root + 'en/');           // โฟลเดอร์ของอีกภาษา
  const link = (key) => here + FILES[key];
  const current = (key) => (key === page ? ' aria-current="page"' : '');
  const tel = (p) => 'tel:+66' + p.replace(/\D/g, '').slice(1);
  const lineUrl = 'https://line.me/R/ti/p/' + D.line;

  // ---------- เมนูด้านบน ----------
  const nav = document.createElement('nav');
  nav.className = 'nav' + (page === 'home' ? ' nav-over' : '');
  nav.setAttribute('aria-label', T.menu);
  nav.innerHTML = `
    <div class="wrap">
      <a class="brand" href="${link('home')}"${current('home')}>The Lagoon</a>
      <ul>
        ${['rooms', 'gallery', 'stay', 'contact'].map((k) => `<li><a href="${link(k)}"${current(k)}>${T.pages[k]}</a></li>`).join('')}
      </ul>
      <div class="nav-end">
        <a class="lang" href="${other + (FILES[page] || 'index.html') + location.search}" hreflang="${lang === 'en' ? 'th' : 'en'}" lang="${lang === 'en' ? 'th' : 'en'}" aria-label="${T.switchLabel}">${T.switchTo}</a>
        <a class="btn btn-primary btn-small" href="${link('booking')}"${current('booking')}>${T.book}</a>
      </div>
    </div>`;
  document.body.prepend(nav);

  // ---------- ท้ายเว็บ ----------
  const footer = document.createElement('footer');
  footer.className = 'site-footer';
  footer.innerHTML = `
    <div class="wrap footer-grid">
      <div class="footer-brand">
        <a class="brand" href="${link('home')}">The Lagoon</a>
        <p>${T.tagline}</p>
        <p>${D.address[lang]}<br>${T.open}</p>
        <a class="footer-map" href="${D.mapUrl}" target="_blank" rel="noopener">${T.openMap}</a>
      </div>
      <div>
        <h2>${T.contactH}</h2>
        <ul>
          ${D.phones.map((p) => `<li><a href="${tel(p)}">${p}</a></li>`).join('')}
          <li><a href="${lineUrl}" target="_blank" rel="noopener">LINE ${D.line}</a></li>
          <li><a href="mailto:${D.email}">${D.email}</a></li>
        </ul>
      </div>
      <div>
        <h2>${T.followH}</h2>
        <ul>
          <li><a href="${D.facebook}" target="_blank" rel="noopener">Facebook</a></li>
          <li><a href="${D.instagram}" target="_blank" rel="noopener">Instagram</a></li>
          <li><a href="${D.tiktok}" target="_blank" rel="noopener">TikTok</a></li>
        </ul>
      </div>
      <div>
        <h2>${T.menuH}</h2>
        <ul>
          ${['rooms', 'gallery', 'stay', 'contact'].map((k) => `<li><a href="${link(k)}">${T.pages[k]}</a></li>`).join('')}
          <li><a href="${link('booking')}">${T.book}</a></li>
        </ul>
      </div>
    </div>
    <div class="wrap footer-bottom">
      <span>© The Lagoon Camping Resort · ${lang === 'en' ? 'Na Yai Am, Chanthaburi' : 'นายายอาม จันทบุรี'}</span>
      <span class="slogan">${T.slogan}</span>
    </div>`;
  document.body.append(footer);

  // ---------- ปุ่มติดต่อลอย (มือถือ) — ไม่โชว์ในหน้าจอง เพราะมีแถบสรุปการจองอยู่แล้ว ----------
  if (page !== 'booking') {
    const fab = document.createElement('div');
    fab.className = 'fab';
    fab.innerHTML = `
      <a href="${tel(D.phones[0])}" aria-label="${T.call} ${D.phones[0]}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/></svg>
        <span>${T.call}</span></a>
      <a class="fab-line" href="${lineUrl}" target="_blank" rel="noopener" aria-label="LINE ${D.line}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 4C7 4 3 7.2 3 11.2c0 3.6 3.2 6.6 7.5 7.1L10 21l4.2-2.9c4-.8 6.8-3.6 6.8-6.9C21 7.2 17 4 12 4z"/></svg>
        <span>${T.chat}</span></a>`;
    document.body.append(fab);
  }

  // ---------- เมนูตอนเลื่อนหน้า ----------
  // หน้าแรก: เมนูโปร่งใสบนรูปปก เลื่อนลงแล้วเป็นสีเขียว
  // มือถือ: เลื่อนลง = ซ่อนเมนู / เลื่อนขึ้น = เมนูกลับมา
  const mobile = window.matchMedia('(max-width: 720px)');
  let lastY = window.scrollY;
  let ticking = false;
  function update() {
    const y = window.scrollY;
    const goingDown = y > lastY + 4;
    const goingUp = y < lastY - 4;
    nav.classList.toggle('is-solid', y > 40);
    if (!mobile.matches || y < 120 || goingUp) nav.classList.remove('is-hidden');
    else if (goingDown) nav.classList.add('is-hidden');
    if (goingDown || goingUp) lastY = y;
    ticking = false;
  }
  update();
  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, { passive: true });
  nav.addEventListener('focusin', () => nav.classList.remove('is-hidden'));

  // ---------- ปุ่ม "คัดลอก" ----------
  const copied = lang === 'en' ? 'Copied' : 'คัดลอกแล้ว';
  document.addEventListener('click', async (e) => {
    const button = e.target.closest('.copy');
    if (!button) return;
    const label = button.textContent;
    try {
      await navigator.clipboard.writeText(button.dataset.copy);
      button.textContent = copied;
      setTimeout(() => { button.textContent = label; }, 1600);
    } catch (err) {
      // เบราว์เซอร์ไม่ให้คัดลอก → ไฮไลต์ข้อความแทน ให้กด Ctrl+C เอง
      const range = document.createRange();
      range.selectNodeContents(button.previousElementSibling);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    }
  });

  // ---------- ลิงก์แบบ #ส่วน (เช่น rooms.html#houses) ----------
  // เมนูและการ์ดบ้านถูกสร้างหลังเบราว์เซอร์เลื่อนหน้าไปแล้ว → เลื่อนให้ใหม่ตอนโหลดเสร็จ
  if (location.hash && page !== 'booking') {
    window.addEventListener('load', () => {
      const target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
      if (target) target.scrollIntoView({ behavior: 'instant', block: 'start' });
    });
  }

  // ---------- ช่องที่ใส่ข้อมูลจาก data.js อัตโนมัติ ----------
  // <span data-fill="price:studio"> → ราคาบ้าน · <span data-fill="camping"> → ราคาลานเต็นท์
  const num = (n) => n.toLocaleString('en-US');
  const minHouse = Math.min(...D.houses.map((h) => h.price));
  document.querySelectorAll('[data-fill]').forEach((el) => {
    const [key, arg] = el.dataset.fill.split(':');
    if (key === 'price') el.textContent = num(D.houses.find((h) => h.id === arg).price);
    if (key === 'from') el.textContent = num(minHouse);
    if (key === 'camping') el.textContent = num(D.camping.perPerson);
    if (key === 'rent') el.textContent = D.camping.rentTent;
    if (key === 'checkin') el.textContent = D.checkin;
    if (key === 'checkout') el.textContent = D.checkout;
  });
})();
