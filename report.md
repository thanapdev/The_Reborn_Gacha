# Project Report — ชาติหน้าขอเป็นตัวเอก (The Reborn Gacha)

> ไฟล์นี้คือบันทึกส่งต่องาน เปิดแชทใหม่แล้วสั่ง "อ่าน report.md แล้วทำต่อ" ได้เลย
> อัปเดตไฟล์นี้ทุกครั้งที่มีการเปลี่ยนแปลงสำคัญ (ส่วน "Changelog" ด้านล่าง)

อัปเดตล่าสุด: 2026-10-21

---

## 1. ภาพรวม

เว็บมินิเกม isekai comedy ภาษาไทย ตอบ choice สองช่วงแล้วได้การ์ดผลลัพธ์ไปแชร์

```
Popup แจ้งเตือนครั้งแรก (เพื่อความบันเทิง ไม่แสวงหากำไร)
 → Landing
 → Stage 1: คำถามชีวิตปัจจุบัน 5 ข้อ → ฉากตาย → การ์ดการตาย (ดูอย่างเดียว)
 → Stage 2: เทพธิดาหมดไฟ → คำถาม 7 ข้อ → Calculating → การ์ด role (ดูอย่างเดียว)
 → หน้าสรุป: การ์ด 2 ใบ (desktop วางข้างกัน) + ปุ่มแชร์ใต้การ์ดแต่ละใบ + ปุ่ม "แชร์ทั้ง 2 ใบ"
 → Collection (localStorage)
```

- การตาย 7 แบบ, role 13 แบบ (รวมไก่ลับ SECRET)
- โทน: ธีม **Bold Blue** (น้ำเงิน #0038ff + เขียวมะนาว #ccff00, กริด, ตัวหนังสือเงา 3D, ปุ่ม pill เงาแข็ง) แต่เนื้อหาปั่น
- เนื้อหาต้นทางทั้งหมด: `iseki_fantasy_game_plan.md`

## 2. ลิงก์และที่อยู่

| อะไร | ที่ไหน |
|---|---|
| GitHub | `git@github.com:thanapdev/The_Reborn_Gacha.git` (branch `main`) |
| Hosting | Vercel แผน Hobby (ฟรี, ห้ามใช้เชิงพาณิชย์) — โปรเจกต์ `the-reborn-gacha` |
| Deploy | อัตโนมัติทุกครั้งที่ push ขึ้น `main` |
| ปิดเว็บชั่วคราว | Vercel → Project → Settings → General → **Pause Project** (กด Resume เพื่อเปิดคืน) |
| Spec | `docs/superpowers/specs/2026-10-20-isekai-gacha-design.md` |
| Plan | `docs/superpowers/plans/2026-10-20-isekai-gacha.md` |
| Ledger การทำงาน (ไม่อยู่ใน git) | `.superpowers/sdd/2026-10-20-isekai-gacha/progress.md` |

## 3. วิธีรัน

Node ติดตั้งผ่าน nvm (v24.22.0) — เครื่องนี้ไม่มี Homebrew
ถ้า shell หา `node` ไม่เจอ ให้โหลด nvm ก่อน:

```bash
export NVM_DIR="$HOME/.nvm" && . "$NVM_DIR/nvm.sh"
npm install
npm run dev      # dev server
npm test         # vitest (60 tests)
npm run build    # tsc + vite build → dist/
npx vite preview --port 4173
```

## 4. Stack และโครงไฟล์

Vite + vanilla TypeScript, ไม่มี framework, runtime dependency เดียวคือ `html-to-image`, test ด้วย `vitest` + `jsdom`
ฟอนต์ Google Fonts: `Mitr` (หัวข้อ) + `Sarabun` (เนื้อหา)

```
src/
  types.ts            # Stat, Choice, Question, Death, Role, GameState
  engine.ts           # pure logic: applyChoice, baseline, pickBest, pickDeath, isChicken, pickRole, cardStats
  data/questions.ts   # คำถาม + stat delta + lifeBase/fullBase
  data/deaths.ts      # 7 การตาย (profile, script, quip, cause, deathBonus)
  data/roles.ts       # 13 role (profile, tier, desc)
  data/goddess.ts     # บทเปิดของเทพธิดา
  art/kit.ts          # palette + helper วาด SVG
  art/roles.ts, art/deaths.ts   # SVG 20 ชิ้น (viewBox 200×200, ไม่มี id/gradient)
  card.ts             # renderRoleCard, renderDeathCard (การ์ด 360×640 คงที่)
  share.ts            # prepareCards (render ล่วงหน้า 2 รอบ), shareCards (Web Share / download)
  storage.ts          # collection + played flag + notice flag, try/catch ทุกจุด
  dom.ts              # html(), mount(), onTap() (grace 350ms กัน double-tap), button()
  screens/            # notice (popup ครั้งแรก), landing, question, script, calculating, result, collection
  main.ts             # flow ทั้งเกม
  style.css           # ธีม Bold Blue ทั้งหมด (สี/ตัวแปรอยู่ที่ :root, ฉากเปลี่ยนด้วย body[data-scene])
```

## 5. การตัดสินใจสำคัญ (อย่าเปลี่ยนโดยไม่เข้าใจเหตุผล)

- **การคิดคะแนน:** ใช้ z-score เทียบกับ "ผู้เล่นที่ตอบสุ่ม" (`baseline()`) + normalize profile + noise ±0.2 แทน dot product ดิบตาม spec เดิม เพราะแบบดิบจูนให้สมดุลไม่ได้
- **ความสมดุล:** test simulation 10,000 รอบ บังคับให้การตาย/role แต่ละแบบออก 2–20% และไก่ 0.5–5% — แก้ตัวเลขใน `data/` หรือ `engine.ts` แล้วต้องรัน `npm test` ให้ผ่าน
- **เงื่อนไขไก่:** ต้องเลือกไก่เป็น companion และ (Chaos ≥ 16 หรือตอบกวน ≥ 7 ครั้ง) — `CHICKEN_CHAOS`, `CHICKEN_SILLY` ใน `engine.ts`
- **การ์ด:** DOM ขนาดคงที่ 360×640, export ด้วย `pixelRatio: 3` → 1080×1920; บนจอเล็กย่อด้วย wrapper `.card-scale` เท่านั้น ห้ามย่อตัวการ์ดเอง
- **แชร์:** render PNG ล่วงหน้าตอนเปิดหน้าสรุป (iOS จำกัดเวลาระหว่างแตะกับ `navigator.share`) และ render 2 รอบต่อการ์ด (Safari วาดรอบแรกก่อนฟอนต์พร้อม); ห้ามใส่ `cacheBust`
- **แชร์ 2 รูปแยกกัน** ไม่รวมเป็นรูปเดียว เพื่อให้แต่ละรูปเป็น 9:16 ลงสตอรี่ได้
- **ปุ่มแชร์อยู่แค่หน้าสรุปตอนจบ** (ผู้ใช้ขอ) การ์ดตอนจบแต่ละ phase ดูอย่างเดียว ในหน้าสรุปมีปุ่มแชร์ใต้การ์ดแต่ละใบ + ปุ่มแชร์ทั้ง 2 ใบ (ยังเป็น 2 รูปแยก ไม่รวมเป็นรูปเดียว ตามเหตุผลข้อบน) ทุกปุ่มใช้ PNG ชุดเดียวที่ render ไว้ล่วงหน้า
- **Popup ครั้งแรก:** เป็น div overlay ธรรมดา (ไม่ใช้ `<dialog>` เพราะ jsdom ใน test ไม่รองรับ `showModal`) จำว่าเห็นแล้วด้วย key `isekai.notice.v1` ถ้า localStorage ใช้ไม่ได้จะขึ้นทุกครั้ง ซึ่งยอมรับได้
- **Desktop หน้าสรุป:** ขยาย `#app` เป็น 800px ด้วย `:has()` เฉพาะตอนมีการ์ด 2 ใบ หน้าอื่นยังกว้าง 480px
- **กัน double-tap:** ทุกหน้าจอไม่รับการแตะ 350ms แรกหลัง mount (`onTap` ใน `dom.ts`) — ปุ่มใหม่ต้องใช้ `onTap` ไม่ใช่ `addEventListener('click')`
- **ธีม Bold Blue (2026-10-21):** ดัดแปลงจากคอมโพเนนต์ React+Tailwind ที่ผู้ใช้ส่งมา แต่เขียนเป็น CSS ล้วน ไม่ได้ลง React/Tailwind/shadcn/motion — อย่าเพิ่ม stack พวกนี้เพื่อ "ทำให้ตรงต้นฉบับ" ฉาก: night = น้ำเงิน+กริด, death = กรมท่าเข้ม #070b24 + แสงแดงกลางจอ (เดิมเป็นดำล้วน ผู้ใช้บอกไม่สวย), heaven = ฟ้าอ่อน #e9eeff + กริดน้ำเงิน ตัวหนังสือน้ำเงินเข้ม (เดิมขาวล้วน) (`--bg` เปลี่ยนตาม `data-scene`); การ์ดแชร์ก็ใช้ธีมนี้ (พื้นน้ำเงินมีกริด, การ์ดตายพื้นกรมท่า+แสงแดง, สีกรอบรูปตาม tier)
- Google Fonts `<link>` ต้องมี `crossorigin="anonymous"` ไม่งั้น html-to-image ฝังฟอนต์ไม่ได้

## 6. สถานะปัจจุบัน

- ✅ test 61/61 ผ่าน, build ผ่าน
- ✅ ธีม Bold Blue: เล่นจบทั้งเกมใน headless Chrome ที่ 390px ดูทุกหน้าแล้ว — ⚠️ ยังไม่ได้ลองสร้าง PNG จริงหลังเปลี่ยนธีม
- ✅ ทดสอบใน headless Chrome: เล่นจบทั้งเส้นทางปกติและเส้นทางไก่ ไม่มี console error, PNG 1080×1920, ฟอนต์ไทยถูก
- ✅ deploy บน Vercel แล้ว (push ธีม Bold Blue 2026-10-21)
- ⚠️ **ยังไม่ได้ทดสอบบนมือถือจริง** (iPhone / Android) โดยเฉพาะ:
  - แชร์ 2 รูปพร้อมกันเข้า IG/FB Story ได้ไหม (ถ้าไม่ได้ → เปลี่ยนเป็นแชร์ทีละใบ)
  - ฟอนต์ใน PNG บน iOS Safari
  - share sheet เด้งไหม หรือ fallback เป็นดาวน์โหลด

## 7. ปัญหาที่รู้แล้วแต่ยังไม่แก้ (Minor, เลื่อนไว้)

1. หมุนจอแล้วขนาดการ์ดไม่คำนวณใหม่ (`screens/result.ts` คิด scale ครั้งเดียว)
2. ส่ง `text` พร้อม `files` ใน `navigator.share` อาจทำให้บางแอปบน iOS รับไม่ดี
3. แตะรัว ๆ ในฉากตาย อาจข้าม "YOU DIED" ไปก่อนได้เห็น
4. เปลี่ยนหน้าแล้ว focus ไม่ย้ายตาม (screen reader)
5. `min-height: 100dvh` ไม่มี fallback `100vh` สำหรับ iOS < 15.4
6. Chrome/Edge บน desktop เปิด share dialog ของระบบแทนการดาวน์โหลด
7. เกณฑ์ตอบกวนของไก่เป็น 7 (spec เขียน 6) — ตั้งใจ เพื่อให้ผ่าน simulation

## 8. ไอเดียที่ยังไม่ได้ทำ (นอก scope เดิม)

- เสียง / เพลง epic
- OG image แยกตาม role (ลิงก์แชร์ขึ้นรูปการ์ดใน LINE/FB)
- หน้า "ปิดให้บริการ" แบบมีมุก (ทางเลือกแทน Pause Project)
- โดเมนของตัวเอง

## 9. Changelog

| วันที่ | commit | สิ่งที่เปลี่ยน |
|---|---|---|
| 2026-10-20 | `18a7aad` | เวอร์ชันแรก: เกมครบ 2 stage, 7 การตาย, 13 role, การ์ด + แชร์, Collection; แก้ตามรีวิว (double-tap, iOS share, ฟอนต์ Safari, cacheBust, ออกจากหน้าระหว่างสร้างรูป) |
| 2026-10-20 | `b2e5255` | ย้ายปุ่มแชร์ไปหน้าสรุปตอนจบ แชร์การ์ด 2 ใบพร้อมกัน; การ์ดแต่ละ phase ดูอย่างเดียว |
| 2026-10-20 | `77473b1` | เพิ่ม `report.md` (ไฟล์นี้) + `CLAUDE.md` ที่สั่งให้ทุกแชทอ่าน report.md ก่อน และอัปเดตทุกครั้งที่มีการเปลี่ยนแปลง |
| 2026-10-20 | (commit นี้) | เขียน `README.md` อธิบายโปรเจกต์ วิธีเล่น ฟีเจอร์ stack วิธีรัน และ deploy |
| 2026-10-21 | (commit นี้) | เปลี่ยนธีมหลักทั้งเกมเป็น Bold Blue (ทุกหน้า + การ์ดแชร์), Landing ใหม่ (หัวข้อซ้อน 3 บรรทัด, การ์ดกระจกลอย, badge หมุนกดเริ่มได้, กล่องอธิบาย 3 ขั้น); ลบหน้าทดลอง `theme-preview.html` ที่ทำก่อนหน้า |
| 2026-10-21 | (commit นี้) | ปรับสีฉากตาย→เทพธิดาให้เข้าธีม (กรมท่า+แดง / ฟ้าอ่อน+น้ำเงิน); UX: ตัวเลือกคำถามย้ายลงล่างจอ (นิ้วโป้งถึง), บทพูดจัดกลางจอ, ฉากเทพธิดาบทพูดอยู่ในกล่อง, เพิ่มคำใบ้ "แตะเพื่อเร่ง" ระหว่างเล่นบท |
| 2026-10-21 | (commit นี้) | Popup แจ้งเตือนครั้งแรก; Landing ตัดกล่อง 3 ขั้นออก ใส่ credit GitHub @thanapdev, จัด hero กลางจอ ปุ่มเริ่มอยู่ล่าง; หน้าสรุป: desktop วางการ์ดข้างกัน, ปุ่มแชร์ใต้การ์ดแต่ละใบ + ปุ่มแชร์ทั้ง 2 ใบ |
| 2026-10-21 | (commit นี้) | แก้ตัวหนังสือ "แน่ใจนะ?" ในฉากเทพธิดาที่อ่านไม่ออก (ตัวกรมท่าบนเงากรมท่า) → ตัวน้ำเงินเงาขาวบาง |
