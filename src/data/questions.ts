import { baseline } from '../engine';
import type { Question } from '../types';

export const lifeQuestions: Question[] = [
  {
    id: 'life-monday',
    prompt: 'เช้าวันจันทร์\nคุณตื่นสาย 40 นาที',
    choices: [
      { label: 'รีบอาบน้ำ', delta: { wisdom: 1, kindness: 1 } },
      { label: 'แปรงฟันแล้วออกเลย', delta: { courage: 1, ambition: 1 } },
      { label: 'ใส่เสื้อผ้าแล้วออก', delta: { courage: 1, chaos: 1 } },
      { label: 'นอนต่อ เพราะไหน ๆ ก็สายแล้ว', delta: { laziness: 3 }, silly: true },
    ],
  },
  {
    id: 'life-fridge',
    prompt: 'คุณเปิดตู้เย็น\nมีไข่ 1 ฟอง ซอสพริก น้ำเปล่า\nและสิ่งมีชีวิตบางอย่าง',
    choices: [
      { label: 'ทำไข่เจียว', delta: { wisdom: 2 } },
      { label: 'ปิดตู้เย็นแล้วสั่งอาหาร', delta: { greed: 1, laziness: 2 } },
      { label: 'ตรวจสอบสิ่งมีชีวิต', delta: { courage: 2, wisdom: 1 } },
      { label: 'กินสิ่งมีชีวิต', delta: { chaos: 5, courage: 1 }, silly: true },
    ],
  },
  {
    id: 'life-money',
    prompt: 'คุณเจอเงิน 100 บาทบนพื้น',
    choices: [
      { label: 'เอาไปคืน', delta: { kindness: 2, wisdom: 1 } },
      { label: 'เก็บไว้', delta: { greed: 3 } },
      { label: 'ยืนรอเจ้าของ', delta: { laziness: 1, wisdom: 1 } },
      { label: 'วางเงินเพิ่มอีก 20 บาทแล้วเดินออกมา', delta: { chaos: 2, kindness: 1 }, silly: true },
    ],
  },
  {
    id: 'life-battery',
    prompt: 'โทรศัพท์แบตเหลือ 1%',
    choices: [
      { label: 'ชาร์จ', delta: { wisdom: 1, luck: 1 } },
      { label: 'เอา Power Bank', delta: { wisdom: 1, ambition: 1 } },
      { label: 'ปิดเครื่อง', delta: { laziness: 1, wisdom: 1 } },
      { label: 'เปิด TikTok ต่อ', delta: { chaos: 2, laziness: 1 }, silly: true },
    ],
  },
  {
    id: 'life-cat',
    prompt: 'คุณเจอแมว',
    choices: [
      { label: 'ลูบหัว', delta: { kindness: 2 } },
      { label: 'ถ่ายรูป', delta: { ambition: 1, luck: 1 } },
      { label: 'ซื้ออาหารให้', delta: { kindness: 1, luck: 1 } },
      { label: 'เดินหนี เพราะนี่อาจเป็นกับดัก', delta: { chaos: 2, wisdom: -1 }, silly: true },
    ],
  },
];

export const goddessQuestions: Question[] = [
  {
    id: 'g-item',
    prompt: 'เทพธิดายื่นกล่องให้\n“เลือกสิ่งหนึ่งที่จะติดตัวไปต่างโลก”',
    choices: [
      { label: '🗡️ ดาบในตำนาน', delta: { courage: 2, ambition: 1 } },
      { label: '🔮 ลูกแก้วโบราณ', delta: { wisdom: 2 } },
      { label: '🥔 มันฝรั่ง', delta: { luck: 2, laziness: 1 } },
      { label: '🧾 ใบเสร็จ 7-11', delta: { greed: 2, chaos: 2 }, silly: true },
    ],
  },
  {
    id: 'g-dragon',
    prompt: 'มังกรยักษ์โผล่มา\n“ข้าจะกินเจ้า”',
    choices: [
      { label: 'สู้', delta: { courage: 3 } },
      { label: 'หนี', delta: { luck: 1, wisdom: 1 } },
      { label: 'คุยดี ๆ', delta: { kindness: 2, wisdom: 1 } },
      { label: 'ถามว่า “กินแล้วอิ่มไหม?”', delta: { chaos: 3, luck: 1 }, silly: true },
    ],
  },
  {
    id: 'g-companion',
    prompt: 'เลือกเพื่อนร่วมทาง',
    choices: [
      { label: '🐺 หมาป่า', delta: { courage: 1, ambition: 1 } },
      { label: '🐉 มังกร', delta: { ambition: 2, chaos: 1 }, tag: 'dragon' },
      { label: '🦅 อินทรี', delta: { wisdom: 1, luck: 1 } },
      { label: '🐔 ไก่', delta: { chaos: 3, luck: 2 }, silly: true, tag: 'chicken', reaction: ['แน่ใจนะ?', '...โอเค'] },
    ],
  },
  {
    id: 'g-robber',
    prompt: 'โจรกระโดดออกมา\n“ส่งเงินมา!”',
    choices: [
      { label: 'สู้', delta: { courage: 3 } },
      { label: 'หนี', delta: { luck: 1, laziness: 1 } },
      { label: 'ให้เงิน', delta: { kindness: 2, greed: -1 } },
      { label: 'ขอเงินโจร 100 บาท', delta: { greed: 3, chaos: 2 }, silly: true },
    ],
  },
  {
    id: 'g-sword',
    prompt: 'คุณพบดาบศักดิ์สิทธิ์ปักอยู่ในหิน\nดาบพูดได้: “จงดึงข้าออกจากหิน!”',
    choices: [
      { label: 'ดึง', delta: { courage: 2, ambition: 2 } },
      { label: 'ตรวจสอบก่อน', delta: { wisdom: 2 } },
      { label: 'ขาย', delta: { greed: 3 } },
      { label: 'เอาหินกลับบ้าน', delta: { chaos: 3, laziness: 1 }, silly: true },
    ],
  },
  {
    id: 'g-blessing',
    prompt: '“ฉันจะให้พรคุณหนึ่งข้อ\nเลือกเร็ว ๆ คิวยาว”',
    choices: [
      { label: 'พลัง', delta: { ambition: 2, courage: 1 } },
      { label: 'เวทมนตร์', delta: { wisdom: 3 } },
      { label: 'โชค', delta: { luck: 3 } },
      { label: 'ทุกคนต้องเข้าใจภาษาที่คุณพูด', delta: { chaos: 2, wisdom: 1 }, silly: true },
    ],
  },
  {
    id: 'g-fear',
    prompt: '“คำถามสุดท้าย\nสิ่งที่คุณกลัวที่สุดคืออะไร?”',
    choices: [
      { label: 'ความตาย', delta: { wisdom: 1, courage: -1 } },
      { label: 'ความล้มเหลว', delta: { ambition: 3 } },
      { label: 'การอยู่คนเดียว', delta: { kindness: 2 } },
      { label: 'แมลงสาบ', delta: { chaos: 2, courage: -1 }, silly: true },
      { label: 'ไม่มีเงิน', delta: { greed: 3 } },
      { label: 'แม่โทรมาแล้วไม่ได้รับ', delta: { kindness: 1, chaos: 2 }, silly: true },
    ],
  },
];

// Average-player stats used to score deaths (after Stage 1) and roles (after Stage 2).
export const lifeBase = baseline(lifeQuestions);
export const fullBase = baseline([...lifeQuestions, ...goddessQuestions]);
