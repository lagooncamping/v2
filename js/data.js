// =========================================================
// ข้อมูลธุรกิจทั้งหมดของเว็บ (แก้ที่นี่ที่เดียว เปลี่ยนทั้งเว็บ ทั้งภาษาไทยและอังกฤษ)
// ⚠️ ถ้าแก้ราคาบ้าน ต้องแก้ใน google-apps-script/Code.gs ด้วย (ระบบจองคำนวณยอดจากที่นั่น)
// =========================================================
window.LAGOON = {
  phones: ['081-930-4969', '065-935-2431', '095-948-0250'],
  line: '@477nvamb',
  email: 'lagooncampingresort@gmail.com',
  promptpay: '090-936-5562',
  mapUrl: 'https://goo.gl/maps/8mGhpGAEaRzAJNGq6',
  facebook: 'https://www.facebook.com/TheLagoonCampingResort',
  instagram: 'https://www.instagram.com/thelagooncampingresort',
  tiktok: 'https://www.tiktok.com/@lagooncampingreso',
  address: {
    th: 'ต.ช้างข้าม อ.นายายอาม จ.จันทบุรี',
    en: 'Chang Kham, Na Yai Am, Chanthaburi, Thailand',
  },

  // เวลา
  checkin: '11:00',
  checkout: '12:00',
  quiet: '22:00',

  // ลานกางเต็นท์
  camping: {
    perPerson: 200,          // นำเต็นท์มาเอง บาท/ท่าน
    rentTent: '1,000–1,200', // เต็นท์เช่า บาท (พร้อมเครื่องนอน 2 ชุด + พัดลม)
  },

  // บ้านพัก — id ต้องตรงกับ Code.gs และแผนผังในหน้าจอง
  // features = รายละเอียดห้อง (โชว์ในหน้าที่พักและหน้าจอง) ยืนยันจากเว็บเดิม 2 ต.ค. 2026
  // TODO: รูปตอนนี้เป็นรูปตัวอย่าง ยังไม่ใช่รูปจริงของแต่ละหลัง
  houses: [
    {
      id: 'lagoon-1', group: 'lagoon', name: 'Lagoon 1', guests: 2, price: 1500,
      type: { th: 'บ้านหลังเล็ก', en: 'Small cabin' },
      features: [
        { th: '1 เตียงใหญ่', en: '1 double bed' },
        { th: 'ห้องน้ำในตัว', en: 'Private bathroom' },
      ],
      photos: ['houses.jpg', 'house-orchid.jpg', 'lake-view.jpg'],
    },
    {
      id: 'lagoon-2', group: 'lagoon', name: 'Lagoon 2', guests: 2, price: 1500,
      type: { th: 'บ้านหลังเล็ก', en: 'Small cabin' },
      features: [
        { th: '1 เตียงใหญ่', en: '1 double bed' },
        { th: 'ห้องน้ำในตัว', en: 'Private bathroom' },
      ],
      photos: ['house-orchid.jpg', 'houses.jpg', 'lake-view.jpg'],
    },
    {
      id: 'lagoon-3', group: 'lagoon', name: 'Lagoon 3', guests: 2, price: 1500,
      type: { th: 'บ้านหลังเล็ก', en: 'Small cabin' },
      features: [
        { th: '1 เตียงใหญ่', en: '1 double bed' },
        { th: 'ห้องน้ำในตัว', en: 'Private bathroom' },
      ],
      photos: ['houses.jpg', 'lake-view.jpg'],
    },
    {
      id: 'studio', group: 'studio', name: 'Lagoon Studio', guests: 2, price: 1500,
      type: { th: 'บ้านหลังใหม่ สไตล์โมเดิร์น', en: 'New modern-style cabin' },
      features: [
        { th: '1 เตียงใหญ่', en: '1 double bed' },
        { th: 'ห้องน้ำในตัว', en: 'Private bathroom' },
      ],
      photos: ['house-orchid.jpg', 'sunset.jpg'],
    },
    {
      id: 'family-1', group: 'family-1', name: 'Lagoon Family 1', guests: 4, price: 2500,
      type: { th: 'บ้านหลังกลาง', en: 'Medium cabin' },
      features: [
        { th: '1 ห้องนอน 2 เตียง', en: '1 bedroom with 2 beds' },
        { th: 'ห้องน้ำในตัว', en: 'Private bathroom' },
      ],
      photos: ['houses.jpg', 'kayak.jpg', 'sunset.jpg'],
    },
    {
      id: 'family-2', group: 'family-2', name: 'Lagoon Family 2', guests: 4, price: 3000,
      type: { th: 'บ้านหลังใหญ่', en: 'Large cabin' },
      features: [
        { th: '2 ห้องนอน (ห้องละ 1 เตียงใหญ่)', en: '2 bedrooms (1 double bed each)' },
        { th: '2 ห้องน้ำในตัว', en: '2 private bathrooms' },
        { th: 'มีครัว', en: 'Kitchen' },
      ],
      photos: ['house-orchid.jpg', 'lake-view.jpg', 'night.jpg'],
    },
  ],

  // เงื่อนไขการชำระ (ต้องตรงกับ Code.gs)
  depositRate: 0.5,
  holdHours: 6,
};
