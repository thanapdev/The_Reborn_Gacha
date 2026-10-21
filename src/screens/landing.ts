import { roleArt } from '../art/roles';
import { button, html, mount, onTap } from '../dom';

const squiggle = (d: string) =>
  `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
const arrowSwoop = squiggle('<path d="M10,90 C 10,40 40,20 60,50 C 70,65 80,75 95,70" /><path d="M80,55 L95,70 L85,85" />');
const arrowLoop = squiggle('<path d="M90,10 C 80,60 60,80 40,60 C 20,40 40,20 60,30 C 80,40 70,70 50,80" /><path d="M65,75 L50,80 L55,65" />');
const arrowFlick = `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="9" stroke-linecap="round" stroke-linejoin="round">
  <path d="M20,80 Q 40,20 80,40" /><path d="M60,20 L80,40 L50,60" /></svg>`;

export function renderLanding(root: HTMLElement, onStart: () => void, onCollection: () => void): void {
  const screen = mount(root, html(`
    <section class="screen landing">
      <div class="topbar">
        <div class="logo" aria-label="Reborn Gacha"><span class="logo-a">REBORN</span><span class="logo-b">GACHA</span></div>
      </div>
      <div class="hero">
        <h1 class="headline" aria-label="ชาติหน้าขอเป็นตัวเอก">
          <span class="l l1" aria-hidden="true">#ชาติหน้า</span>
          <span class="l l2" aria-hidden="true">ขอเป็น</span>
          <span class="l l3" aria-hidden="true">ตัวเอก</span>
        </h1>
        <div class="float float-a" aria-hidden="true">
          <div class="glass"><div class="avatar">${roleArt.hero}</div><b>ผู้กล้า</b><small>Tier S</small></div>
        </div>
        <div class="float float-b" aria-hidden="true">
          <div class="glass"><div class="avatar">${roleArt.chicken}</div><b>???</b><small>Tier SECRET</small></div>
        </div>
        <div class="squiggle squiggle-a" aria-hidden="true">${arrowSwoop}</div>
        <div class="squiggle squiggle-b" aria-hidden="true">${arrowLoop}</div>
      </div>
      <p class="tagline">ถ้าคุณได้เกิดใหม่ในโลกแฟนตาซี<br><strong>คุณจะเป็นอะไร?</strong></p>
      <div class="actions"></div>
      <p class="credit">ทำเล่น ๆ โดย <a href="https://github.com/thanapdev" target="_blank" rel="noopener">GitHub @thanapdev</a></p>
    </section>`));

  const badge = html(`
    <button type="button" class="badge" aria-label="เริ่มต้นชีวิตใหม่">
      <svg class="badge-ring" viewBox="0 0 100 100" aria-hidden="true">
        <path id="badge-ring" d="M 50,50 m -36,0 a 36,36 0 1,1 72,0 a 36,36 0 1,1 -72,0" fill="none" />
        <text><textPath href="#badge-ring">REBORN NOW • เกิดใหม่เลย • REBORN NOW • </textPath></text>
      </svg>
      <span class="badge-core" aria-hidden="true">${arrowFlick}</span>
    </button>`);
  const start = button('เริ่มต้นชีวิตใหม่', 'btn primary big');
  const col = button('📜 Collection', 'btn');
  onTap(badge, onStart);
  onTap(start, onStart);
  onTap(col, onCollection);
  screen.querySelector('.hero')!.append(badge);
  screen.querySelector('.topbar')!.append(col);
  screen.querySelector('.actions')!.append(start);
}
