// หน้าที่พัก & ราคา: สร้างการ์ดบ้านจาก js/data.js (ไม่ต้องแก้ไฟล์นี้ แก้ข้อมูลที่ data.js)
(() => {
  const D = window.LAGOON;
  const lang = document.documentElement.lang === 'en' ? 'en' : 'th';
  const root = document.body.dataset.root || '';
  const T = {
    th: { guests: (n) => `${n} ท่าน`, units: (n) => `มี ${n} หลัง`, night: 'บาท / คืน', book: 'จองหลังนี้', alt: (name) => `รูปตัวอย่าง: ${name}` },
    en: { guests: (n) => `${n} guests`, units: (n) => `${n} cabins available`, night: 'THB / night', book: 'Book this cabin', alt: (name) => `Sample photo: ${name}` },
  }[lang];

  // Lagoon 1–3 เป็นแบบเดียวกัน → รวมเป็นการ์ดเดียว
  const groups = [];
  D.houses.forEach((h) => {
    const g = groups.find((x) => x.group === h.group);
    if (g) g.count += 1;
    else groups.push({ ...h, count: 1 });
  });

  document.querySelector('#rooms').innerHTML = groups.map((h) => `
    <article class="room" id="${h.group}">
      <img class="zoom" src="${root}img/${h.photos[0]}" alt="${T.alt(h.count > 1 ? 'Lagoon' : h.name)}" loading="lazy">
      <div class="room-body">
        <h3>${h.count > 1 ? 'Lagoon' : h.name}</h3>
        <ul class="meta">
          <li>${T.guests(h.guests)}</li>
          <li>${h.type[lang]}</li>
        </ul>
        ${h.count > 1 ? `<p class="count">${T.units(h.count)}</p>` : ''}
        <p class="price">
          <span class="baht">${h.price.toLocaleString('en-US')}<small>${T.night}</small></span>
          <a class="btn btn-primary btn-small" href="booking.html?house=${h.id}">${T.book}</a>
        </p>
      </div>
    </article>`).join('');
})();
