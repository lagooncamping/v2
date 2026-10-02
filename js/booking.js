// =========================================================
// หน้าจองที่พัก (ใช้ร่วมกันทั้ง booking.html และ en/booking.html)
// - ข้อมูลบ้าน/ราคา อยู่ใน js/data.js
// - ถ้าใส่ API_URL: อ่านวันว่างและบันทึกการจองลง Google Sheets
// - โหมดทดลอง: เว้น API_URL ว่าง หรือเปิดหน้าด้วย ?demo=1 → ไม่ส่งข้อมูลไปที่ชีตจริงเลย
// - เลือกบ้านไว้ล่วงหน้าได้ด้วย ?house=studio (ใช้จากปุ่ม "จองหลังนี้" ในหน้าที่พัก)
// =========================================================

// ลิงก์ Web App จาก Google Apps Script (ดูวิธีได้ในไฟล์ SETUP-GOOGLE-SHEETS.md)
const LIVE_API_URL = 'https://script.google.com/macros/s/AKfycbyCUEb3YTKm6_LoUal5cvBmZZR_-fhcYULSRiH2WDNnSgPOlHGDjqgYY8-Y7ID8rUvWVg/exec';

const params = new URLSearchParams(location.search);
const API_URL = params.has('demo') ? '' : LIVE_API_URL;
const D = window.LAGOON;
const HOUSES = D.houses;
const LANG = document.documentElement.lang === 'en' ? 'en' : 'th';
const ROOT = document.body.dataset.root || '';
const PHONE = D.phones[0];
const PROMPTPAY = D.promptpay.replace(/\D/g, '');

// ---------- ข้อความ 2 ภาษา ----------
const T = {
  th: {
    locale: 'th-TH',
    pickDates: 'เลือกวันเข้าพักก่อน แล้วติ๊กเลือกบ้านที่ว่าง',
    badDates: 'วันเช็กเอาต์ต้องหลังวันเช็กอิน',
    loading: 'กำลังเช็กวันว่าง…',
    loadError: `เช็กวันว่างไม่สำเร็จ กรุณารีเฟรชหน้า หรือโทรจอง ${PHONE}`,
    nights: (n) => `${n} คืน`,
    guests: (n) => `${n} ท่าน`,
    perNight: 'บาท/คืน',
    baht: (n) => `${n} บาท`,
    booked: 'ถูกจองแล้ว', free: 'ว่าง', selected: 'เลือกแล้ว',
    pick: 'เลือกบ้านหลังนี้',
    sample: 'รูปตัวอย่าง',
    slidesLabel: (name) => `รูป ${name} ปัดซ้ายขวาเพื่อดูรูปถัดไป`,
    prev: 'รูปก่อนหน้า', next: 'รูปถัดไป',
    total: (n, t) => `${n} คืน · รวม ${t} บาท`,
    sumHouse: 'บ้าน', sumIn: 'เช็กอิน', sumOut: 'เช็กเอาต์', sumTotal: 'รวม',
    inTime: (d) => `${d} (ตั้งแต่ ${D.checkin})`, outTime: (d) => `${d} (ก่อน ${D.checkout})`,
    capacity: (n) => `บ้านที่เลือกรองรับได้ ${n} ท่าน`,
    sending: 'กำลังส่ง…', confirm: 'ยืนยันการจอง',
    justBooked: (names) => `ขออภัย ${names} เพิ่งถูกจองไปในวันที่เลือก กรุณาเลือกบ้านหรือวันใหม่`,
    sendFail: `ส่งการจองไม่สำเร็จ กรุณาลองใหม่อีกครั้ง หรือโทรจอง ${PHONE}`,
    at: (d, t) => `${d} เวลา ${t} น.`,
    lines: { house: 'บ้าน', in: 'เช็กอิน', out: 'เช็กเอาต์', total: 'ยอดรวม', name: 'ชื่อ', phone: 'เบอร์', note: 'หมายเหตุ' },
    payFull: 'ยอดชำระเต็มจำนวน', payDeposit: 'ยอดมัดจำ 50%',
    lineHead: 'ส่งสลิปการจอง The Lagoon 🏕️', lineId: 'รหัสการจอง', lineAttach: '(แนบรูปสลิปโอนเงินในแชตนี้)',
    demoId: '(โหมดทดลอง)',
    rest: (n) => `${n} บาท — ชำระวันเช็กอิน (เงินสดหรือโอนหน้าเคาน์เตอร์)`,
    refundFull: (n) => `ชำระเต็มจำนวน: หากยกเลิกหรือไม่มาเข้าพัก รับเงินคืน 50% ของยอดจอง (${n} บาท) แอดมินจะโอนคืนให้`,
    refundDeposit: 'มัดจำ 50%: หากยกเลิกหรือไม่มาเข้าพัก ไม่คืนเงินมัดจำ',
    qrFail: (n) => `โหลด QR ไม่สำเร็จ — โอนเข้าพร้อมเพย์ ${D.promptpay} ยอด ${n} บาท`,
  },
  en: {
    locale: 'en-GB',
    pickDates: 'Choose your dates first, then tick an available cabin',
    badDates: 'Check-out must be after check-in',
    loading: 'Checking availability…',
    loadError: `Couldn't load availability. Please refresh, or call us at ${PHONE}`,
    nights: (n) => `${n} night${n > 1 ? 's' : ''}`,
    guests: (n) => `${n} guests`,
    perNight: 'THB/night',
    baht: (n) => `${n} THB`,
    booked: 'Booked', free: 'Available', selected: 'selected',
    pick: 'Select this cabin',
    sample: 'Sample photo',
    slidesLabel: (name) => `${name} photos — swipe left or right`,
    prev: 'Previous photo', next: 'Next photo',
    total: (n, t) => `${n} night${n > 1 ? 's' : ''} · total ${t} THB`,
    sumHouse: 'Cabin', sumIn: 'Check-in', sumOut: 'Check-out', sumTotal: 'Total',
    inTime: (d) => `${d} (from ${D.checkin})`, outTime: (d) => `${d} (by ${D.checkout})`,
    capacity: (n) => `Your selected cabins sleep up to ${n} guests`,
    sending: 'Sending…', confirm: 'Confirm booking',
    justBooked: (names) => `Sorry, ${names} was just booked for those dates. Please choose another cabin or date.`,
    sendFail: `Couldn't send your booking. Please try again, or call us at ${PHONE}`,
    at: (d, t) => `${d} at ${t}`,
    lines: { house: 'Cabin', in: 'Check-in', out: 'Check-out', total: 'Total', name: 'Name', phone: 'Phone', note: 'Note' },
    payFull: 'Full payment', payDeposit: '50% deposit',
    lineHead: 'Payment slip — The Lagoon booking 🏕️', lineId: 'Booking ID', lineAttach: '(please attach your transfer slip in this chat)',
    demoId: '(demo mode)',
    rest: (n) => `${n} THB — pay on check-in day (cash or transfer at the counter)`,
    refundFull: (n) => `Full payment: if you cancel or don't show up, you get 50% of the booking back (${n} THB), refunded by our admin.`,
    refundDeposit: '50% deposit: if you cancel or don\'t show up, the deposit is not refunded.',
    qrFail: (n) => `Couldn't load the QR code — please transfer ${n} THB to PromptPay ${D.promptpay}`,
  },
}[LANG];

// ---------- QR พร้อมเพย์ (มาตรฐาน EMVCo ที่ธนาคารไทยใช้) ----------
const tlv = (id, value) => id + String(value.length).padStart(2, '0') + value;
function crc16(str) {
  let crc = 0xffff;
  for (let i = 0; i < str.length; i++) {
    crc ^= str.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) crc = (crc & 0x8000 ? (crc << 1) ^ 0x1021 : crc << 1) & 0xffff;
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}
function promptPayPayload(phone, amount) {
  const target = '0066' + phone.replace(/\D/g, '').slice(1); // 0909365562 → 0066909365562
  const body = tlv('00', '01') + tlv('01', '12')
    + tlv('29', tlv('00', 'A000000677010111') + tlv('01', target))
    + tlv('53', '764') + tlv('54', amount.toFixed(2)) + tlv('58', 'TH') + '6304';
  return body + crc16(body);
}

// ---------- วันที่ ----------
const pad = (n) => String(n).padStart(2, '0');
const toISO = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const addDays = (iso, n) => { const d = new Date(iso + 'T00:00:00'); d.setDate(d.getDate() + n); return toISO(d); };
const nightsBetween = (a, b) => Math.round((new Date(b + 'T00:00:00') - new Date(a + 'T00:00:00')) / 86400000);
const fmtDate = (iso) => new Date(iso + 'T00:00:00').toLocaleDateString(T.locale, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
const baht = (n) => n.toLocaleString('en-US');
const today = toISO(new Date());

// การจองที่มีอยู่แล้ว (from = วันเช็กอิน, to = วันเช็กเอาต์)
// โหมดทดลองใช้ตัวอย่างนี้ ถ้าต่อ Google Sheets แล้วจะโหลดของจริงมาแทน
let BOOKINGS = API_URL ? [] : [
  { house: 'lagoon-2', from: today, to: addDays(today, 2) },
  { house: 'family-1', from: addDays(today, 5), to: addDays(today, 7) },
];
const isBooked = (id, from, to) => BOOKINGS.some((b) => b.house === id && b.from < to && b.to > from);

// ---------- สถานะของหน้า ----------
const state = { checkin: '', checkout: '', selected: new Set(), loading: false, loadError: false };
const $ = (sel) => document.querySelector(sel);
const checkinEl = $('#checkin');
const checkoutEl = $('#checkout');
const housesEl = $('#houses');

const hasDates = () => state.checkin && state.checkout && state.checkout > state.checkin;
const nights = () => (hasDates() ? nightsBetween(state.checkin, state.checkout) : 0);
const selectedHouses = () => HOUSES.filter((h) => state.selected.has(h.id));
const total = () => selectedHouses().reduce((sum, h) => sum + h.price, 0) * nights();

// ---------- สร้างการ์ดบ้าน ----------
housesEl.innerHTML = HOUSES.map((h) => `
  <article class="house" id="house-${h.id}" data-house="${h.id}">
    <div class="slides" tabindex="0" aria-label="${T.slidesLabel(h.name)}">
      ${h.photos.map((p) => `<img src="${ROOT}img/${p}" alt="${T.sample}: ${h.name}" loading="lazy">`).join('')}
    </div>
    <div class="slide-nav">
      <button type="button" data-step="-1" aria-label="${T.prev}">‹</button>
      <span class="dots">${h.photos.map((_, i) => `<i class="${i === 0 ? 'on' : ''}"></i>`).join('')}</span>
      <button type="button" data-step="1" aria-label="${T.next}">›</button>
    </div>
    <div class="house-head"><h3>${h.name}</h3><span class="status"></span></div>
    <p class="house-type">${h.type[LANG]} · ${T.guests(h.guests)}</p>
    <p class="house-price"><b>${baht(h.price)}</b> ${T.perNight}</p>
    <label class="pick"><input type="checkbox" value="${h.id}"><span>${T.pick}</span></label>
  </article>`).join('');

housesEl.querySelectorAll('.house').forEach((card) => {
  const slides = card.querySelector('.slides');
  const dots = card.querySelectorAll('.dots i');
  card.querySelectorAll('[data-step]').forEach((btn) => {
    btn.addEventListener('click', () => slides.scrollBy({ left: slides.clientWidth * Number(btn.dataset.step), behavior: 'smooth' }));
  });
  slides.addEventListener('scroll', () => {
    const i = Math.round(slides.scrollLeft / slides.clientWidth);
    dots.forEach((d, j) => d.classList.toggle('on', i === j));
  }, { passive: true });
});

// ---------- อัปเดตหน้าจอทุกครั้งที่เปลี่ยนวัน/เลือกบ้าน ----------
function render() {
  const dated = hasDates() && !state.loading && !state.loadError;

  HOUSES.forEach((h) => {
    const booked = dated && isBooked(h.id, state.checkin, state.checkout);
    if (booked) state.selected.delete(h.id);
    const picked = state.selected.has(h.id);

    const card = $(`#house-${h.id}`);
    card.classList.toggle('is-booked', booked);
    card.querySelector('.status').textContent = !dated ? '' : booked ? T.booked : T.free;
    const box = card.querySelector('input');
    box.checked = picked;
    box.disabled = !dated || booked;

    const marker = document.querySelector(`.m[data-house="${h.id}"]`);
    marker.classList.toggle('is-booked', booked);
    marker.classList.toggle('is-selected', picked);
    marker.setAttribute('aria-label', `${h.name}${booked ? ' — ' + T.booked : picked ? ' — ' + T.selected : ''}`);
  });

  $('#nights').innerHTML = state.loading ? T.loading
    : state.loadError ? T.loadError
    : dated ? `${fmtDate(state.checkin)} – ${fmtDate(state.checkout)} · <b>${T.nights(nights())}</b>`
    : (state.checkin && state.checkout ? T.badDates : T.pickDates);

  const count = state.selected.size;
  $('#bar').hidden = !count || $('#step-pick').hidden;
  if (count) {
    $('#bar-text').innerHTML = `${selectedHouses().map((h) => h.name).join(', ')}<br><b>${T.total(nights(), baht(total()))}</b>`;
  }
}

// ---------- เลือกวัน ----------
checkinEl.min = today;
checkoutEl.min = addDays(today, 1);
checkinEl.addEventListener('change', () => {
  state.checkin = checkinEl.value;
  if (state.checkin) {
    checkoutEl.min = addDays(state.checkin, 1);
    // ยังไม่เลือกวันออก หรือวันออกอยู่ก่อนวันเข้า → ตั้งเป็นอีก 1 คืน
    if (!state.checkout || state.checkout <= state.checkin) {
      state.checkout = checkoutEl.value = addDays(state.checkin, 1);
    }
  }
  render();
});
checkoutEl.addEventListener('change', () => { state.checkout = checkoutEl.value; render(); });

// ---------- ติ๊กเลือกบ้าน ----------
housesEl.addEventListener('change', (e) => {
  if (e.target.type !== 'checkbox') return;
  e.target.checked ? state.selected.add(e.target.value) : state.selected.delete(e.target.value);
  render();
});

// ---------- กดบ้านบนแผนผัง → เลื่อนไปที่การ์ดบ้านหลังนั้น ----------
function focusHouse(id) {
  const card = $(`#house-${id}`);
  if (!card) return;
  card.scrollIntoView({ behavior: 'smooth', block: 'start' });
  card.classList.add('flash');
  setTimeout(() => card.classList.remove('flash'), 1200);
}
document.querySelectorAll('.m').forEach((marker) => {
  marker.addEventListener('click', () => focusHouse(marker.dataset.house));
  marker.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); focusHouse(marker.dataset.house); } });
});

// ---------- สลับขั้นตอน (ปุ่มย้อนกลับของเบราว์เซอร์ใช้ได้) ----------
const STEPS = ['pick', 'details', 'done'];
const baseUrl = location.pathname + location.search;
function go(step, push = true) {
  STEPS.forEach((s) => { $(`#step-${s}`).hidden = s !== step; });
  $('#bar').hidden = step !== 'pick' || !state.selected.size;
  if (push) history.pushState({ step }, '', step === 'pick' ? baseUrl : `${baseUrl}#${step}`);
  window.scrollTo(0, 0);
}
window.addEventListener('popstate', (e) => {
  const step = e.state?.step || 'pick';
  go(step === 'details' && !state.selected.size ? 'pick' : step, false);
});
history.replaceState({ step: 'pick' }, '', baseUrl);

$('#to-details').addEventListener('click', () => {
  if (!state.selected.size || !hasDates()) return;
  const capacity = selectedHouses().reduce((sum, h) => sum + h.guests, 0);
  $('#summary').innerHTML = `
    <dt>${T.sumHouse}</dt><dd>${selectedHouses().map((h) => h.name).join(', ')}</dd>
    <dt>${T.sumIn}</dt><dd>${T.inTime(fmtDate(state.checkin))}</dd>
    <dt>${T.sumOut}</dt><dd>${T.outTime(fmtDate(state.checkout))}</dd>
    <dt>${T.sumTotal}</dt><dd>${T.nights(nights())} · ${T.baht(baht(total()))}</dd>`;
  $('#capacity').textContent = T.capacity(capacity);
  document.querySelector('[data-amount="deposit"]').textContent = T.baht(baht(Math.ceil(total() * D.depositRate)));
  document.querySelector('[data-amount="full"]').textContent = T.baht(baht(total()));
  go('details');
});
document.querySelector('[data-back]').addEventListener('click', () => history.back());

// ---------- ยืนยันการจอง ----------
$('#details-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const errorEl = $('#form-error');
  errorEl.textContent = '';
  if (!form.reportValidity()) return;
  const data = Object.fromEntries(new FormData(form));
  const houses = selectedHouses();
  if (!houses.length) { go('pick'); return; }

  // ยอดและเวลาชำระ: ถ้าต่อ Google Sheets จะใช้ตัวเลขที่ Google คำนวณ (ด้านล่าง)
  const payType = data.payType === 'full' ? 'full' : 'deposit';
  let id = '';
  let bookingTotal = total();
  let amountDue = payType === 'full' ? bookingTotal : Math.ceil(bookingTotal * D.depositRate);
  const dueAt = new Date(Date.now() + D.holdHours * 3600000);
  let deadline = `${toISO(dueAt)} ${pad(dueAt.getHours())}:${pad(dueAt.getMinutes())}`;
  if (API_URL) {
    const btn = form.querySelector('[type=submit]');
    btn.disabled = true;
    btn.textContent = T.sending;
    try {
      // ส่งแบบ text/plain เพื่อให้ Google Apps Script รับได้โดยไม่ติด CORS
      const res = await fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify({
          houses: houses.map((h) => h.id),
          checkin: state.checkin,
          checkout: state.checkout,
          guests: Number(data.guests),
          name: data.name.trim(),
          phone: data.phone.trim(),
          // ลูกค้าจองจากหน้าภาษาอังกฤษ → ใส่ป้าย [EN] ให้แอดมินรู้ว่าควรตอบเป็นภาษาอังกฤษ
          note: (LANG === 'en' ? '[EN] ' : '') + data.note.trim(),
          payType,
          website: data.website, // ช่องลับกันบอท
        }),
      });
      const out = await res.json();
      if (out.error === 'booked') {
        const names = HOUSES.filter((h) => out.houses.includes(h.id)).map((h) => h.name).join(', ');
        alert(T.justBooked(names));
        out.houses.forEach((h) => state.selected.delete(h));
        await loadBookings();
        go('pick');
        return;
      }
      if (!out.ok) throw new Error(out.error);
      id = out.id;
      if (out.due) ({ total: bookingTotal, due: amountDue, deadline } = out);
    } catch (err) {
      errorEl.textContent = T.sendFail;
      return;
    } finally {
      btn.disabled = false;
      btn.textContent = T.confirm;
    }
  }

  const [dueDate, dueTime] = deadline.split(' ');
  const L = T.lines;
  const summary = [
    `${L.house}: ${houses.map((h) => h.name).join(', ')}`,
    `${L.in}: ${fmtDate(state.checkin)}`,
    `${L.out}: ${fmtDate(state.checkout)}`,
    `${T.nights(nights())} · ${T.guests(data.guests)}`,
    `${L.total}: ${T.baht(baht(bookingTotal))}`,
    `${L.name}: ${data.name.trim()}`,
    `${L.phone}: ${data.phone.trim()}`,
    data.note.trim() ? `${L.note}: ${data.note.trim()}` : '',
  ].filter(Boolean).join('\n');
  const payLabel = payType === 'full' ? T.payFull : T.payDeposit;
  // ข้อความที่ลูกค้าส่งเข้าแชต LINE พร้อมแนบสลิป
  const message = [
    T.lineHead,
    id ? `${T.lineId}: ${id}` : null,
    `${payLabel}: ${T.baht(baht(amountDue))}`,
    T.lineAttach,
    '',
    summary,
  ].filter((line) => line !== null).join('\n');

  // จำไว้ในหน้านี้ด้วย ให้บ้านขึ้นว่า "ถูกจองแล้ว" ทันที
  houses.forEach((h) => BOOKINGS.push({ house: h.id, from: state.checkin, to: state.checkout }));

  // หน้าชำระเงิน
  $('#pay-id').textContent = id || T.demoId;
  $('#pay-due-label').textContent = payLabel;
  $('#pay-due').textContent = T.baht(baht(amountDue));
  $('#pay-rest').textContent = T.rest(baht(bookingTotal - amountDue));
  document.querySelectorAll('.pay-rest-row').forEach((el) => { el.hidden = payType === 'full'; });
  $('#pay-deadline').textContent = T.at(fmtDate(dueDate), dueTime);
  $('#pay-refund').textContent = payType === 'full' ? T.refundFull(baht(Math.floor(bookingTotal / 2))) : T.refundDeposit;
  const qrBox = $('#pay-qr');
  if (window.qrcode) {
    const qr = qrcode(0, 'M');
    qr.addData(promptPayPayload(PROMPTPAY, amountDue));
    qr.make();
    qrBox.innerHTML = qr.createSvgTag({ cellSize: 6, margin: 2, scalable: true });
  } else {
    qrBox.textContent = T.qrFail(baht(amountDue));
  }
  $('#done-text').textContent = (id ? `${T.lineId}: ${id}\n` : '') + summary;
  $('#line-link').href = `https://line.me/R/oaMessage/${encodeURIComponent(D.line)}/?${encodeURIComponent(message)}`;

  state.selected.clear();
  form.reset();
  render();
  go('done');
});

// ---------- โหลดวันว่างจาก Google Sheets ----------
async function loadBookings() {
  if (!API_URL) return;
  state.loading = true;
  render();
  try {
    const out = await (await fetch(API_URL)).json();
    if (!out.ok) throw new Error(out.error);
    BOOKINGS = out.bookings;
    state.loadError = false;
  } catch (err) {
    state.loadError = true;
  }
  state.loading = false;
  render();
}

// มาจากปุ่ม "จองหลังนี้" (?house=...) → เลื่อนไปที่บ้านหลังนั้นหลังเลือกวัน
const wanted = params.get('house');
if (wanted && HOUSES.some((h) => h.id === wanted)) {
  $(`#house-${wanted}`).classList.add('wanted');
  checkinEl.addEventListener('change', () => {
    const box = $(`#house-${wanted} input`);
    if (!box.disabled && !state.selected.size) { state.selected.add(wanted); render(); }
  }, { once: true });
}

document.querySelector('.demo-note').hidden = Boolean(API_URL);
render();
loadBookings();
