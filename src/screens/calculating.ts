import { html, mount, reducedMotion } from '../dom';

export function renderCalculating(root: HTMLElement, onDone: () => void): void {
  mount(root, html(`
    <section class="screen calculating">
      <div class="circle" aria-hidden="true"></div>
      <h2>Calculating Destiny...</h2>
      <p class="muted">เทพธิดากำลังกรอกแบบฟอร์ม 3 ฉบับ</p>
      <div class="progress-track"><span class="progress-fill grow"></span></div>
    </section>`));
  setTimeout(onDone, reducedMotion() ? 300 : 2500);
}
