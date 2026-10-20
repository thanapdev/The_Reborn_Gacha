# ชาติหน้าขอเป็นตัวเอก — The Reborn Gacha

> **ถ้าคุณตายแล้วได้ไปเกิดใหม่ในโลกแฟนตาซี คุณจะกลายเป็นอะไร?**

เว็บมินิเกมแนว isekai comedy ภาษาไทย ตอบคำถามสั้น ๆ แล้วรู้ว่าคุณตายยังไง และจะได้เกิดใหม่เป็นอะไร จบแล้วได้การ์ดผลลัพธ์ไปแชร์ลงสตอรี่ได้
หน้าตาเป็นเกม fantasy จริงจัง แต่เนื้อหาไม่จริงจังเลย

## วิธีเล่น

1. **ชีวิตปัจจุบัน:** ตอบคำถาม 5 ข้อ เช่น ตื่นสาย 40 นาทีจะทำอะไร หรือเจอสิ่งมีชีวิตในตู้เย็น
2. **คุณตาย:** ระบบเลือกการตาย 1 ใน 7 แบบตามคำตอบ เช่น ลื่นป้ายระวังพื้นลื่น หรือแย่งหมูชิ้นสุดท้าย
3. **พบเทพธิดา:** เจ้าหน้าที่ฝ่าย Reincarnation ที่ทำงานมา 2,347 ปีจนหมดไฟ ถามคำถามตามขั้นตอนอีก 7 ข้อ
4. **เกิดใหม่:** ได้ role 1 ใน 13 แบบ ตั้งแต่ชาวบ้านไปจนถึงจอมมาร (และมีผลลับอีก 1 แบบ 🐔)
5. **หน้าสรุป:** แสดงการ์ดการตายกับการ์ดชาติใหม่ กดแชร์ครั้งเดียวได้รูปทั้ง 2 ใบ ขนาด 1080×1920 พอดีสตอรี่ IG/FB

มี Destiny Collection เก็บว่าเคยได้ role ไหนแล้ว ไว้เล่นซ้ำเพื่อปลดล็อกให้ครบ

## ฟีเจอร์

- การตาย 7 แบบ และ role 13 แบบ พร้อมภาพประกอบ SVG วาดเองทุกแบบ
- Hidden stats 8 ตัว (Courage, Wisdom, Kindness, Ambition, Chaos, Luck, Greed, Laziness) ใช้คำนวณผลลัพธ์ และแสดงเป็น stat bar บนการ์ด
- ระบบสมดุลผลลัพธ์: มี test สุ่มเล่น 10,000 รอบ บังคับให้ทุกผลลัพธ์มีโอกาสออกใกล้เคียงกัน
- แชร์ผ่าน Web Share API บนมือถือ ถ้าเครื่องไม่รองรับจะดาวน์โหลดไฟล์แทน
- ออกแบบสำหรับมือถือเป็นหลัก รองรับ `prefers-reduced-motion` และใช้งานได้แม้เบราว์เซอร์ปิด localStorage
- ไม่มี backend เป็น static site ล้วน

## Tech stack

- [Vite](https://vitejs.dev/) + TypeScript (vanilla ไม่มี framework)
- [html-to-image](https://github.com/bubkoo/html-to-image) สำหรับแปลงการ์ดเป็น PNG
- [Vitest](https://vitest.dev/) + jsdom สำหรับ test
- ฟอนต์ Google Fonts: Mitr และ Sarabun

## รันในเครื่อง

ต้องมี Node.js 20 ขึ้นไป

```bash
npm install
npm run dev       # เปิด dev server
npm test          # รัน test
npm run build     # build เป็น static site ใน dist/
npm run preview   # เปิดดูผลจาก build
```

## Deploy

เป็น static site จึง deploy ฟรีได้ทั้ง Vercel, Cloudflare Pages และ Netlify
ตั้งค่า Build Command เป็น `npm run build` และ Output Directory เป็น `dist`
ตอนนี้ deploy อยู่บน Vercel และ deploy ใหม่อัตโนมัติทุกครั้งที่ push ขึ้น `main`

## โครงโปรเจกต์

```
src/
  engine.ts          # ตรรกะคำนวณการตาย/role (pure functions)
  data/              # คำถาม การตาย role และบทของเทพธิดา
  art/               # ภาพประกอบ SVG
  card.ts            # การ์ดผลลัพธ์
  share.ts           # export PNG และแชร์
  screens/           # หน้าจอแต่ละหน้า
  main.ts            # flow ของเกม
docs/superpowers/    # spec และแผนการพัฒนา
iseki_fantasy_game_plan.md   # แผนเนื้อหาและมุกต้นฉบับ
report.md            # บันทึกสถานะล่าสุด การตัดสินใจ และปัญหาที่ยังค้าง
```

## เอกสารเพิ่มเติม

- [`iseki_fantasy_game_plan.md`](iseki_fantasy_game_plan.md): ไอเดียตั้งต้น เนื้อหา และมุกทั้งหมด
- [`report.md`](report.md): สถานะล่าสุด การตัดสินใจสำคัญพร้อมเหตุผล ปัญหาที่รู้แล้ว และ changelog
