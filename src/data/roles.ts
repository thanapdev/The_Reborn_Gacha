import type { Role } from '../types';

export const roles: Role[] = [
  {
    id: 'villager', name: 'ชาวบ้าน', nameEn: 'THE VILLAGER', tier: 'F', stars: 1,
    profile: { laziness: 1, ambition: -1, courage: -0.5 },
    desc: ['ไม่มีพลังพิเศษ ไม่มีดาบ ไม่มีเวทมนตร์', 'แต่คุณมีบ้าน และมีไก่ 3 ตัว', 'ชีวิตดีมาก'],
  },
  {
    id: 'farmer', name: 'ชาวนา', nameEn: 'THE FARMER', tier: 'F', stars: 1,
    profile: { kindness: 1, laziness: 0.5, ambition: -1 },
    desc: ['คุณปลูกพืชได้เร็วเป็น 2 เท่า', '...แค่นั้น', 'Ultimate Skill: Farming'],
  },
  {
    id: 'merchant', name: 'พ่อค้า', nameEn: 'THE 3% MERCHANT', tier: 'D', stars: 2,
    profile: { greed: 2, wisdom: 0.5 },
    desc: ['ไม่มีพลังต่อสู้', 'แต่ซื้อของถูกกว่าคนอื่น 3%', '“ไม่มีใครฆ่าคนที่ให้ส่วนลด 3%”'],
  },
  {
    id: 'alchemist', name: 'นักปรุงยา', nameEn: 'THE ALCHEMIST', tier: 'D', stars: 2,
    profile: { wisdom: 1, chaos: 1.5 },
    desc: ['คุณทำ Potion ได้', 'แต่ทุกครั้งมีโอกาส 10% ที่จะระเบิด', '“มันเป็นฟีเจอร์”'],
  },
  {
    id: 'adventurer', name: 'นักผจญภัย', nameEn: 'THE LV.1 ADVENTURER', tier: 'C', stars: 3,
    profile: { courage: 1.5, luck: 0.5 },
    desc: ['Level 1 · ดาบไม้ · เงิน 3 Gold', 'Quest: ฆ่าสไลม์ 3 ตัว', 'ตอนนี้ฆ่าได้ 0 ตัว'],
  },
  {
    id: 'thief', name: 'โจร', nameEn: 'THE THIEF', tier: 'C', stars: 3,
    profile: { greed: 1.5, chaos: 1, kindness: -1 },
    desc: ['คุณหายตัวได้', 'แต่เฉพาะตอนที่ไม่มีใครมอง', 'ซึ่งจริง ๆ ก็ไม่ได้ช่วยอะไร'],
  },
  {
    id: 'mage', name: 'จอมเวท', nameEn: 'THE GREAT MAGE', tier: 'B', stars: 4,
    profile: { wisdom: 2, courage: -0.5 },
    desc: ['Magic 98/100 · Physical 2/100', 'คุณยิง Fireball ได้', 'แต่เปิดขวดน้ำไม่ออก'],
  },
  {
    id: 'elf', name: 'เอลฟ์พเนจร', nameEn: 'THE WANDERING ELF', tier: 'B', stars: 4,
    profile: { wisdom: 1, kindness: 1, luck: -1 },
    desc: ['อายุ 237 ปี หน้าตาดี ฉลาด เก่ง', 'แต่...', 'หลงทางตลอด'],
  },
  {
    id: 'dragonTamer', name: 'ผู้ฝึกมังกร', nameEn: 'THE DRAGON TAMER', tier: 'A', stars: 4,
    profile: { luck: 1, chaos: 1, courage: -1 }, tagBonus: { dragon: 1 },
    desc: ['คุณควบคุมมังกรได้', 'ปัญหาเดียวคือ', 'คุณกลัวมังกร'],
  },
  {
    id: 'hero', name: 'ผู้กล้า', nameEn: 'THE HERO', tier: 'S', stars: 5,
    profile: { courage: 2, kindness: 1 },
    desc: ['ได้ดาบศักดิ์สิทธิ์ เกราะในตำนาน และพรจากเทพ', 'ภารกิจ: ปราบจอมมาร', 'เงินเดือน: 0 Gold'],
  },
  {
    id: 'king', name: 'ราชา', nameEn: 'THE KING', tier: 'S', stars: 5,
    profile: { ambition: 2, wisdom: 0.5 },
    desc: ['ได้ปราสาท กองทัพ อำนาจ และประชาชนหลายแสนคน', 'แต่...', 'ทุกคนมาขอให้คุณแก้ปัญหา'],
  },
  {
    id: 'demonLord', name: 'จอมมาร', nameEn: 'THE DEMON LORD', tier: 'S', stars: 5,
    profile: { ambition: 1.5, chaos: 1, kindness: -1, laziness: 1 },
    desc: ['ศัตรูตัวสุดท้ายของโลก ทั้งอาณาจักรกลัวคุณ', 'แต่คุณมี Passive: Introvert', 'คุณไม่อยากออกจากปราสาท'],
  },
  {
    id: 'chicken', name: 'ไก่', nameEn: 'YOU ARE A CHICKEN', tier: 'SECRET', stars: 5,
    profile: {},
    desc: [
      'Unique Skill: 🥚 Lay Egg · Passive: Plot Armor',
      'ไม่มีใครรู้ว่าทำไมคุณเกิดเป็นไก่ เทพธิดาก็ไม่รู้',
      'แต่ดูเหมือนคุณจะรอดจนถึงตอนจบ',
    ],
  },
];
