import { html } from '../dom';
import { hasSeenNotice, markNoticeSeen } from '../storage';

/** First-visit disclaimer. Sits on top of whatever screen is showing until dismissed. */
export function showNotice(): void {
  if (hasSeenNotice()) return;
  const overlay = html(`
    <div class="notice" role="dialog" aria-modal="true" aria-labelledby="notice-title">
      <div class="notice-box">
        <p class="eyebrow">ก่อนเริ่ม</p>
        <h2 id="notice-title">อ่านนิดนึงนะ</h2>
        <p>เกมนี้ทำขึ้นเพื่อ<b>ความบันเทิง</b>เท่านั้น เป็นงานอดิเรกส่วนตัว <b>ไม่มีการแสวงหาผลกำไร</b></p>
        <p>ตัวละครและเหตุการณ์ทั้งหมดเป็นเรื่องแต่ง ผลลัพธ์สุ่มเพื่อความฮา อย่าคิดจริงจัง</p>
        <p class="muted">ไม่มีการเก็บข้อมูลส่วนตัว ผลการเล่นบันทึกไว้ในเครื่องคุณเท่านั้น</p>
        <button type="button" class="btn primary">เข้าใจแล้ว</button>
      </div>
    </div>`);
  const ok = overlay.querySelector('button')!;
  ok.addEventListener('click', () => { markNoticeSeen(); overlay.remove(); });
  document.body.append(overlay);
  ok.focus();
}
