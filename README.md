# ชาติหน้าขอเป็นตัวเอก — The Reborn Gacha

ถ้าคุณตายแล้วได้ไปเกิดใหม่ในโลกแฟนตาซี คุณจะกลายเป็นอะไร?

เล่นได้ที่ [the-reborn-gacha.vercel.app](https://the-reborn-gacha.vercel.app/)

มินิเกมแนว isekai สายฮา ภาษาไทย เล่นบนเว็บ ตอบคำถามสั้น ๆ แล้วเกมจะบอกว่าคุณตายยังไง และได้ไปเกิดใหม่เป็นอะไร เล่นจบได้การ์ดผลลัพธ์ไปลงสตอรี่ หน้าตาเป็นสติกเกอร์สีน้ำเงินกับเขียวมะนาว ส่วนเนื้อหาไม่จริงจังสักข้อ

## วิธีเล่น

1. ชีวิตปัจจุบัน: ตอบคำถาม 5 ข้อ เช่น ตื่นสาย 40 นาทีแล้วจะทำอะไร หรือเจอสิ่งมีชีวิตในตู้เย็นจะทำยังไง
2. คุณตาย: เกมเลือกวิธีตายให้ 1 ใน 7 แบบตามคำตอบ เช่น ลื่นล้มเพราะป้ายระวังพื้นลื่น หรือตายตอนแย่งหมูชิ้นสุดท้าย
3. พบเทพธิดา: เจ้าหน้าที่ฝ่าย Reincarnation ที่ทำงานมา 2,347 ปีจนหมดไฟ จะถามตามขั้นตอนอีก 7 ข้อ
4. เกิดใหม่: ได้ role 1 ใน 13 แบบ มีตั้งแต่ชาวบ้านไปจนถึงจอมมาร และมีผลลับซ่อนอยู่อีก 1 แบบ 🐔
5. หน้าสรุป: เห็นการ์ดการตายกับการ์ดชาติใหม่ แชร์ทีละใบหรือแชร์ทั้งสองใบก็ได้ รูปมีขนาด 1080×1920 พอดีสตอรี่ IG และ Facebook

role ที่เคยได้จะถูกเก็บไว้ใน Destiny Collection เล่นซ้ำไปเรื่อย ๆ จนปลดล็อกครบได้

## ฟีเจอร์

- การตาย 7 แบบและ role 13 แบบ แต่ละแบบมีภาพสติกเกอร์ของตัวเอง
- มีค่าสถานะซ่อน 8 ตัว คือ Courage, Wisdom, Kindness, Ambition, Chaos, Luck, Greed และ Laziness เกมใช้ค่าเหล่านี้คำนวณผลลัพธ์ และแสดงเป็นแถบ stat บนการ์ด
- ผลลัพธ์แต่ละแบบมีโอกาสออกใกล้เคียงกัน มี test สุ่มเล่น 10,000 รอบคอยเช็กเรื่องนี้
- บนมือถือแชร์ผ่าน Web Share API ได้เลย ถ้าเครื่องไม่รองรับจะดาวน์โหลดเป็นไฟล์รูปแทน
- ออกแบบให้มือถือก่อน บนจอคอมก็เล่นได้โดยไม่ต้องเลื่อนหน้า รองรับ `prefers-reduced-motion` และยังเล่นได้แม้เบราว์เซอร์ปิด localStorage
- เป็น static site ล้วน ไม่มี backend

## Tech stack

- [Vite](https://vitejs.dev/) + TypeScript แบบ vanilla ไม่ใช้ framework
- [html-to-image](https://github.com/bubkoo/html-to-image) แปลงการ์ดเป็น PNG
- [Vitest](https://vitest.dev/) + jsdom สำหรับ test
- ฟอนต์ Mitr และ Sarabun จาก Google Fonts

## รันในเครื่อง

ต้องใช้ Node.js 20 ขึ้นไป

```bash
npm install
npm run dev       # เปิด dev server
npm test          # รัน test
npm run build     # build เป็น static site ใน dist/
npm run preview   # เปิดดูผลจาก build
```

## Deploy

โปรเจกต์นี้เป็น static site จึงขึ้น Vercel, Cloudflare Pages หรือ Netlify ได้ฟรี ตั้ง Build Command เป็น `npm run build` และ Output Directory เป็น `dist`

ตอนนี้เว็บอยู่บน Vercel ทุกครั้งที่ push ขึ้น `main` จะ deploy ใหม่ให้อัตโนมัติ

## โครงโปรเจกต์

```
src/
  engine.ts          # ตรรกะคำนวณการตาย/role (pure functions)
  data/              # คำถาม การตาย role และบทของเทพธิดา
  art/               # จับคู่ id กับไฟล์ภาพใน public/art/
  card.ts            # การ์ดผลลัพธ์
  share.ts           # export PNG และแชร์
  screens/           # หน้าจอแต่ละหน้า
  main.ts            # flow ของเกม
public/art/          # ภาพสติกเกอร์ WebP
docs/superpowers/    # spec และแผนการพัฒนา
docs/art-prompts.md  # prompt ที่ใช้สร้างภาพสติกเกอร์
iseki_fantasy_game_plan.md   # แผนเนื้อหาและมุกต้นฉบับ
report.md            # บันทึกสถานะล่าสุด การตัดสินใจ และปัญหาที่ยังค้าง
```

## เอกสารเพิ่มเติม

- [`iseki_fantasy_game_plan.md`](iseki_fantasy_game_plan.md): ไอเดียตั้งต้น เนื้อหา และมุกทั้งหมด
- [`report.md`](report.md): สถานะล่าสุด การตัดสินใจสำคัญพร้อมเหตุผล ปัญหาที่รู้แล้ว และ changelog
