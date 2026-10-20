import { button, html, mount, onTap } from '../dom';

export function renderLanding(root: HTMLElement, onStart: () => void, onCollection: () => void): void {
  const screen = mount(root, html(`
    <section class="screen landing">
      <div class="moon" aria-hidden="true"></div>
      <p class="eyebrow">Isekai Reincarnation Office</p>
      <h1 class="title">ชาติหน้า<br>ขอเป็นตัวเอก</h1>
      <p class="tagline">ถ้าคุณได้เกิดใหม่ในโลกแฟนตาซี<br><strong>คุณจะเป็นอะไร?</strong></p>
      <div class="intro">
        <p>ชีวิตเดิมของคุณกำลังจะจบลง</p>
        <p>แต่ไม่ต้องห่วง...</p>
        <p class="punch">มันอาจไม่ได้จบดีนัก</p>
      </div>
      <div class="actions"></div>
    </section>`));
  const start = button('เริ่มต้นชีวิตใหม่', 'btn primary big');
  const col = button('📜 Destiny Collection', 'btn ghost');
  onTap(start, onStart);
  onTap(col, onCollection);
  screen.querySelector('.actions')!.append(start, col);
}
