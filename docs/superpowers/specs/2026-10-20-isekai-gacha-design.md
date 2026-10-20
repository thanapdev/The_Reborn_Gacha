# ชาติหน้าขอเป็นตัวเอก — Design Spec

วันที่: 2026-10-20
แหล่งเนื้อหา: `iseki_fantasy_game_plan.md` (บท คำถาม การตาย role ใช้ตามไฟล์นี้)

## 1. เป้าหมาย

เว็บมินิเกมแนว isekai comedy เล่นจบใน 3–7 นาที ตอบ choice สองช่วง แล้วได้การ์ดผลลัพธ์ที่บันทึกเป็น PNG และแชร์ลง IG/FB Story ได้

เกณฑ์ความสำเร็จ:
- เล่นจบได้บนมือถือ (เป้าหลัก 360–430px) และ desktop
- ได้การ์ด 2 ใบ: การ์ดการตาย (จบ Stage 1) และการ์ด role (จบ Stage 2)
- ปุ่มแชร์บนมือถือเปิด share sheet พร้อมไฟล์ PNG 1080×1920; ถ้าไม่รองรับ ดาวน์โหลดไฟล์แทน
- simulation สุ่มคำตอบ 10,000 รอบ: ทุกการตายและทุก role (ยกเว้นไก่) ออก 2–20%; ไก่ออก 0.5–5%
- โทน: UI/visual จริงจังแบบ dark fantasy, เนื้อหาปั่น

นอก scope: backend, บัญชีผู้ใช้, เสียง/เพลง, ลิงก์ preview (OG image) ราย role, หลายภาษา

## 2. Stack

- Vite + vanilla TypeScript, ไม่มี UI framework
- dependency runtime เดียว: `html-to-image` (แปลงการ์ดเป็น PNG)
- dev: `vitest`
- output เป็น static site deploy บน Vercel/Netlify/GitHub Pages ได้
- ฟอนต์ Google Fonts: หัวข้อ `Mitr`, เนื้อหา `Sarabun`

## 3. Flow หน้าจอ

```
Landing
 → Life Q1..Q5          (Stage 1)
 → Death Scene          (บทพิมพ์ทีละบรรทัด, แตะเพื่อข้าม)
 → Death Card           [แชร์] [ไปต่อ]
 → Goddess Intro        (dialogue เทพธิดาหมดไฟ)
 → Goddess Q1..Q7       (Stage 2)
 → Calculating Destiny  (~2.5 วินาที)
 → Role Card            [แชร์] [เกิดใหม่อีกครั้ง] [Collection]
 → Collection
```

- Landing: title, tagline, ปุ่ม "เริ่มต้นชีวิตใหม่", ลิงก์ Collection
- หน้าคำถาม: progress (เช่น 2/5), โจทย์, ปุ่มตัวเลือก 4 ปุ่ม (Goddess Q7 มี 6 ปุ่ม)
- บาง choice มี "reaction" ของเทพธิดาแสดงก่อนไปข้อต่อ เช่น เลือกไก่ → "แน่ใจนะ?" [Yes] → "...โอเค"
- ตั้งแต่รอบที่ 2 (flag ใน localStorage) dialogue/บทการตายมีปุ่ม "ข้าม"
- state ทั้งหมดอยู่ใน memory; รีเฟรชกลางเกม = เริ่มใหม่

## 4. Hidden Stats และ Engine

Stats 8 ตัว เริ่มที่ 0: `courage wisdom kindness ambition chaos luck greed laziness`

ข้อมูลเป็น data ล้วน:

```ts
type Stat = 'courage'|'wisdom'|'kindness'|'ambition'|'chaos'|'luck'|'greed'|'laziness';
type Stats = Record<Stat, number>;
interface Choice { label: string; delta: Partial<Stats>; silly?: boolean; tag?: string; reaction?: string[] }
interface Question { id: string; prompt: string; choices: Choice[] }
interface Outcome { id: string; profile: Partial<Stats>; /* + เนื้อหา */ }
```

- `silly: true` = ตัวเลือกกวน (นับเพื่อเงื่อนไขไก่)
- `tag` = flag พิเศษ เช่น `'chicken'` (เลือกไก่เป็น companion), `'dragon'`

ฟังก์ชันใน `engine.ts` (pure, รับ `rng` เป็นพารามิเตอร์เพื่อเทสต์ได้):

- `applyChoice(state, choice)` → บวก delta, นับ silly, เก็บ tags
- `pickBest(stats, outcomes, rng)` → score = Σ profile[s] × stats[s] × (0.9 + 0.2·rng()); คืน outcome score สูงสุด
- `pickDeath(state, rng)` = `pickBest` บน 7 การตาย; จากนั้นบวก `deathBonus` ของการตายนั้นเข้า stats
- `isChicken(state)` = tags มี `'chicken'` และ (chaos ≥ เกณฑ์ หรือ silly ≥ 6) — ค่าเกณฑ์ปรับจาก simulation
- `pickRole(state, rng)` = ถ้า `isChicken` → ไก่; ไม่งั้น `pickBest` บน 12 role
- `cardStats(state)` → 5 stat ที่สูงสุด สเกลเป็น 0–100 สำหรับ stat bar (ไก่ใช้ค่าตายตัว HP 3 / STR 1 / INT 0 / MAGIC 0 / LUCK 999)

profile อนุญาตค่าติดลบ ตั้งต้นตามตารางนี้ แล้วปรับตัวเลขจนผ่านเกณฑ์ simulation:

| การตาย | Rank | profile ตั้งต้น |
|---|---|---|
| peaceful | S | kindness +1, wisdom +1, luck +1, chaos −1 |
| sleep | A | laziness +2 |
| food | B | greed +1.5, chaos +0.5 |
| pigeon | C | chaos +1, luck −1 |
| wetfloor | C | courage +1, wisdom −1 |
| drinking | D | luck −1.5, laziness +0.5 |
| chain | F | chaos +2 |

| Role | Tier | profile ตั้งต้น |
|---|---|---|
| villager ชาวบ้าน | F | laziness +1, ambition −1, courage −0.5 |
| farmer ชาวนา | F | kindness +1, laziness +0.5, ambition −1 |
| merchant พ่อค้า | D | greed +2, wisdom +0.5 |
| alchemist นักปรุงยา | D | wisdom +1, chaos +1.5 |
| adventurer นักผจญภัย | C | courage +1.5, luck +0.5 |
| thief โจร | C | greed +1.5, chaos +1, kindness −1 |
| mage จอมเวท | B | wisdom +2, courage −0.5 |
| elf เอลฟ์พเนจร | B | wisdom +1, kindness +1, luck −1 |
| dragonTamer | A | luck +1, chaos +1, courage −1 (+ bonus ถ้ามี tag `dragon`) |
| hero ผู้กล้า | S | courage +2, kindness +1 |
| king ราชา | S | ambition +2, wisdom +0.5 |
| demonLord จอมมาร | S | ambition +1.5, chaos +1, kindness −1, laziness +1 |
| chicken ไก่ | SECRET | กฎ `isChicken` เท่านั้น |

stat delta ของแต่ละ choice กำหนดในแผนลงมือ อิงตัวอย่างในไฟล์แผน (ช่วยแมว → kindness +2, กินสิ่งมีชีวิต → chaos +5 ฯลฯ)

## 5. เนื้อหา

- คำถาม Stage 1: 5 ข้อตาม §3 ของไฟล์แผน
- คำถาม Stage 2: 7 ข้อตาม §8 ของไฟล์แผน
- การตาย 7 แบบตาม §6: แต่ละแบบมี `title`, `rank`, `script: string[]` (บรรทัดที่พิมพ์ทีละบรรทัด), `quip` (บรรทัดเด็ดสำหรับการ์ด), `art`
- เติม rank ที่ไฟล์แผนไม่ได้ระบุ: food = B, pigeon = C, wetfloor = C
- role 13 แบบตาม §10–11: `name`, `nameEn` (เช่น "THE GREAT MAGE"), `tier`, `desc` (คำบรรยายฮา), `art`
- dialogue เทพธิดาตาม §7

## 6. การ์ด

ขนาดบนจอคือ 9:16 (ความกว้างสูงสุด ~400px) และ export ด้วย `pixelRatio` ให้ได้ 1080×1920

การ์ด role (บนลงล่าง): "YOUR DESTINY" → SVG illustration → ชื่อไทย + ชื่ออังกฤษ → Tier badge + ดาว rarity → stat bars 5 อัน → คำบรรยายฮา → การตายที่ผ่านมา (บรรทัดเล็ก เช่น "สาเหตุการตาย: ลื่นป้ายระวังพื้นลื่น") → URL เว็บ

การ์ดการตาย: "YOU DIED" → SVG → death title → Death Rank → quip → URL เว็บ

กรอบการ์ดเปลี่ยนตาม tier/rank: F/D เทา-บรอนซ์, C/B เงิน-น้ำเงิน, A ม่วง, S ทอง, SECRET รุ้ง (gradient เคลื่อนไหวบนจอ; PNG เป็นภาพนิ่ง)

## 7. Art

- SVG inline วาดเองแบบเรียบง่ายสไตล์ flat/ไอคอนใหญ่ 20 ชิ้น (13 role + 7 การตาย) เก็บเป็น string ใน `src/art/`
- ใช้ palette เดียวกันทั้งเกม, viewBox 200×200, ไม่มีรูปภายนอก (เพื่อให้ export PNG ไม่ติด CORS)

## 8. แชร์

`share.ts`:
1. `await document.fonts.ready` แล้ว `toBlob(cardEl, { pixelRatio, cacheBust })`
2. สร้าง `File([blob], 'my-destiny.png', { type: 'image/png' })`
3. ถ้า `navigator.canShare?.({ files: [file] })` → `navigator.share({ files, title, text })`
4. ไม่งั้น → ดาวน์โหลดผ่าน `<a download>`
5. error (ผู้ใช้กดยกเลิก = `AbortError`) → เงียบ; error อื่น → toast "บันทึกรูปไม่สำเร็จ ลองแคปหน้าจอแทนนะ"

## 9. Collection

localStorage key `isekai.collection.v1` = array ของ role id ที่เคยได้ และ `isekai.played.v1` = flag ข้าม dialogue
หน้าแสดงตาราง 13 ช่อง: ที่ปลดล็อกแสดง art + ชื่อ, ที่ยังไม่ปลดล็อกแสดง "??? — Locked" (ไก่แสดงเป็น "???" เสมอจนกว่าจะได้)
อ่าน/เขียน localStorage ครอบด้วย try/catch; ถ้าใช้ไม่ได้ เกมยังเล่นได้ แค่ไม่จำ

## 10. Visual

dark fantasy: พื้นน้ำเงินกรมเข้ม (#0b0f2a โดยประมาณ) + ทอง, ดาว/particle ด้วย CSS, ปุ่มสไตล์ป้ายเกม RPG
transition ระหว่างหน้าแบบ fade; ฉากตายจบด้วยตัวอักษร "YOU DIED" สีแดง; เข้าฉากเทพธิดา fade เป็นขาว
เคารพ `prefers-reduced-motion` (ปิด particle/animation ยาว)
ปุ่มตัวเลือกสูงอย่างน้อย 48px, contrast ข้อความ ≥ 4.5:1

## 11. โครงไฟล์

```
index.html
src/
  main.ts            # state machine: screen ปัจจุบัน + GameState
  engine.ts          # pure logic (§4)
  engine.test.ts     # unit tests + simulation 10k
  data/questions.ts
  data/deaths.ts
  data/roles.ts
  data/goddess.ts    # dialogue
  art/roles.ts
  art/deaths.ts
  screens/*.ts       # landing, question, deathScene, card, goddess, calculating, collection
  card.ts            # render การ์ด (ใช้ทั้ง death และ role)
  share.ts
  storage.ts
  style.css
```

## 12. Testing

- `engine.test.ts`:
  - `applyChoice` บวก delta/นับ silly/เก็บ tag ถูก
  - `pickBest` กับ rng คงที่ ได้ผลที่คาด
  - ไก่ออกเมื่อเข้าเงื่อนไข และไม่ออกเมื่อไม่มี tag `chicken`
  - simulation 10,000 รอบ เช็กการกระจายตามเกณฑ์ §1
  - ทุกคำถามมี choice ที่ delta ไม่ว่าง; ทุก outcome มี art และเนื้อหาครบ
- ตรวจด้วยมือในเบราว์เซอร์: เล่นจบ 1 รอบ, export PNG ได้ขนาด 1080×1920 และฟอนต์ไทยถูกต้อง, ดูที่ความกว้าง 375px
