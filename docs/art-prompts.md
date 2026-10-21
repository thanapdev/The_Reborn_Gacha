# Art Prompts — รูปที่ต้องใช้ในเกม

## สรุป: ต้องใช้ 20 รูป (+ ไม่บังคับ 2 รูป)

| กลุ่ม | จำนวน | ใช้ที่ไหน |
|---|---|---|
| Role | 13 | การ์ดผลลัพธ์, หน้า Collection, การ์ดลอยหน้าแรก (ผู้กล้า, ไก่) |
| การตาย | 7 | การ์ดมรณบัตร |
| ไม่บังคับ: เทพธิดา | 1 | ฉากเทพธิดา (ตอนนี้ไม่มีรูป) |
| ไม่บังคับ: OG image | 1 | รูปตัวอย่างเวลาแชร์ลิงก์ใน LINE/FB |

## Requirement ทุกรูป (Role + การตาย)

- **ขนาดที่เจน:** สี่เหลี่ยมจัตุรัส 1:1 อย่างน้อย **1024×1024** (ระบบจะย่อเหลือ 600×600 เอง)
- **การครอป:** รูปจะแสดงใน**วงกลม** ตัวละครต้องอยู่กลาง ส่วนสำคัญอยู่ใน 75% ตรงกลาง มุมทั้ง 4 จะถูกตัดทิ้ง
- **พื้นหลัง:** สีเรียบสีเดียว ไม่มีฉาก (เดี๋ยวตัดออก/ใส่สีพื้นของการ์ดเอง)
- **ห้ามมีตัวหนังสือในรูป** (AI เขียนผิดบ่อย ข้อความอยู่ในการ์ดอยู่แล้ว)
- **สไตล์:** สติกเกอร์การ์ตูนแบน เส้นขอบดำหนา สีน้อย ตลก ใช้สีธีม น้ำเงิน #0038FF + เขียวมะนาว #CCFF00
- **ไฟล์ที่ส่งกลับมา:** PNG ตั้งชื่อตาม `id` ในตาราง เช่น `hero.png` (เดี๋ยวแปลงเป็น WebP ให้)

## วิธีเจนให้เป็นชุดเดียวกัน

1. เจน **chicken** ก่อน จนได้รูปที่ชอบ
2. แนบรูปไก่เป็นรูปตัวอย่างทุกครั้ง และเติมท้าย prompt ว่า `Match the exact art style of the attached image.`
3. ใช้ STYLE ด้านล่างนำหน้าทุก prompt ไม่แก้

### STYLE (ก๊อปไปนำหน้าทุก prompt)

```
Flat cartoon sticker illustration, thick uniform black outlines, bold simple shapes, minimal shading, limited palette of electric blue #0038FF, lime green #CCFF00, white, black and warm skin tones, cute chibi proportions with big head, funny exaggerated expression, single character centered with generous padding, plain solid light gray background, no text, no letters, no frame, square 1:1.
```

---

## Role (13)

| id | ชื่อ | Tier | มุก |
|---|---|---|---|
| villager | ชาวบ้าน | F | มีบ้านกับไก่ 3 ตัว ชีวิตดี |
| farmer | ชาวนา | F | ปลูกพืชเร็ว 2 เท่า แค่นั้น |
| merchant | พ่อค้า | D | ส่วนลด 3% |
| alchemist | นักปรุงยา | D | ยาระเบิด 10% |
| adventurer | นักผจญภัย | C | Lv.1 ดาบไม้ ฆ่าสไลม์ได้ 0 |
| thief | โจร | C | หายตัวได้แค่ตอนไม่มีใครมอง |
| mage | จอมเวท | B | ยิง Fireball ได้ เปิดขวดน้ำไม่ออก |
| elf | เอลฟ์พเนจร | B | อายุ 237 หลงทางตลอด |
| dragonTamer | ผู้ฝึกมังกร | A | คุมมังกรได้ แต่กลัวมังกร |
| hero | ผู้กล้า | S | ของครบ เงินเดือน 0 |
| king | ราชา | S | ทุกคนมาขอให้แก้ปัญหา |
| demonLord | จอมมาร | S | Introvert ไม่อยากออกจากปราสาท |
| chicken | ไก่ | SECRET | เกิดเป็นไก่ มี Plot Armor |

### chicken (เจนตัวนี้ก่อน)
```
[STYLE] A smug white chicken wearing a tiny golden crown, standing proudly with chest out, small golden sparkles around it, one freshly laid egg beside its feet, looks like the unlikely main character of the story.
```

### villager
```
[STYLE] A plain, happy medieval villager in simple brown tunic, sitting relaxed in front of a tiny cozy cottage, three small white chickens around their feet, completely content smile, peaceful vibe.
```

### farmer
```
[STYLE] A cheerful farmer in a straw hat holding a hoe, a giant oversized carrot sprouting from the ground next to them, proud but slightly underwhelmed expression, as if this is their ultimate skill.
```

### merchant
```
[STYLE] A sly smiling merchant with a big backpack full of goods, holding up a small sign showing a percent symbol, rubbing hands together, coins floating around, a little lime green price tag.
```

### alchemist
```
[STYLE] A nervous alchemist in goggles and a lab coat holding a bubbling flask, the flask is clearly about to explode with a small cartoon blast cloud, hair slightly singed, forced confident smile.
```

### adventurer
```
[STYLE] A level 1 novice adventurer holding a wooden practice sword, wearing oversized dented armor, sweating nervously, a tiny cute blue slime in front of them looking unbothered.
```

### thief
```
[STYLE] A sneaky thief in a dark hooded cloak, body half transparent and fading out like invisibility, tiptoeing, caught in a spotlight, awkward guilty expression.
```

### mage
```
[STYLE] A great mage with a tall pointy wizard hat and long beard, a big lime green fireball floating above one hand, the other hand struggling to twist open a water bottle, red-faced and straining.
```

### elf
```
[STYLE] A beautiful elegant elf with long hair and pointed ears, holding a map upside down, looking confused, question marks floating above head, a signpost pointing in three directions.
```

### dragonTamer
```
[STYLE] A dragon tamer holding a leash attached to a big friendly blue dragon, the tamer is trembling with fear and sweat drops, the dragon looks happy and wants to play.
```

### hero
```
[STYLE] A brave hero holding a glowing legendary sword high, shining armor and a flowing cape, heroic pose, but holding an empty coin purse in the other hand with a sad sweat drop.
```

### king
```
[STYLE] A tired king on a throne wearing a big crown, buried under a tall pile of paper petitions and scrolls, dark eye bags, exhausted blank stare.
```

### demonLord
```
[STYLE] A demon lord with horns and a dramatic dark cape, wrapped in a cozy blanket, sitting on a beanbag holding a game controller, does not want to go outside, glowing lime eyes.
```

---

## การตาย (7)

ใช้ STYLE เดิม แต่เปลี่ยนท้ายให้หม่นลงนิด: ต่อท้าย prompt ด้วย
`Darker mood, deep navy and muted red accents instead of lime, still funny not scary, no blood, no gore.`

| id | ชื่อ | มุก |
|---|---|---|
| peaceful | Peaceful Death | หลับสงบท่ามกลางลูกหลาน |
| sleep | Sleep Death | กด snooze ครั้งสุดท้าย |
| food | Food Death | แย่งหมูชิ้นสุดท้ายแล้วกลืนทั้งชิ้น |
| pigeon | Death by Pigeon | หลบขี้นกพิราบแล้วเดินชนเสา |
| wetfloor | Critical Failure | เดินผ่านป้ายระวังพื้นลื่น |
| drinking | Drinking Accident | สำลักน้ำเปล่าเพราะมุกเพื่อน |
| chain | Chain Reaction | โดมิโนเริ่มจากถุงเท้าข้างเดียว |

### peaceful
```
[STYLE] A very old person sleeping peacefully in a cozy bed with a gentle smile, a small glowing halo floating above their head, calm and wholesome.
```

### sleep
```
[STYLE] A person deep asleep in bed hugging a pillow, hand on top of a ringing alarm clock pressing snooze, little Zzz bubbles, a faint ghost-like soul gently floating out of the body.
```

### food
```
[STYLE] A person at a Korean BBQ grill with chopsticks, cheeks puffed and eyes bulging after swallowing a huge piece of grilled pork whole, other chopsticks reaching for the same empty grill.
```

### pigeon
```
[STYLE] A person who just walked face first into a street lamp post, dizzy stars circling their head, a smug pigeon perched on top of the post looking down at them.
```

### wetfloor
```
[STYLE] A person slipping comically mid-air with legs flying up, a yellow wet floor caution cone right beside them (cone has only a simple slipping-figure icon, no words), water splash on the floor.
```

### drinking
```
[STYLE] A person choking and spraying water out of their mouth while laughing, holding a glass of water, tears in eyes, a friend's hand doing a thumbs up from the edge of the frame.
```

### chain
```
[STYLE] A Rube Goldberg chain reaction: a single sock on the floor, a person tripping on it, knocking over a line of falling dominoes, ending with a small flower pot falling, playful motion lines.
```

---

## ไม่บังคับ

### goddess (ฉากเทพธิดา) — 1:1, 1024×1024, พื้นหลังสีเรียบ
```
[STYLE] A burnt-out goddess office worker in a white robe with a halo and small wings, sitting at a desk with a tall stack of paperwork and a coffee mug, dark eye bags, holding a queue number ticket, deadpan tired face. Light pastel blue background.
```

### og-image (รูปตัวอย่างลิงก์) — 1200×630 แนวนอน ให้ทำทีหลังเมื่อได้รูปครบ
ไม่ต้องเจน — ประกอบจากรูปที่ได้ (ไก่ + ผู้กล้า + ชื่อเกม) บนพื้นน้ำเงินธีมได้เลย

## ส่งรูปกลับมา

วางไฟล์ PNG ทั้งหมดไว้ที่ `public/art/` (ชื่อไฟล์ = id) แล้วบอก — จะย่อเป็น 600×600 WebP, ใส่แทน SVG และแก้ให้การแชร์รอรูปโหลดก่อน
