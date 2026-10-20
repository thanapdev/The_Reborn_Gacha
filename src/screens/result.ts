import { button, html, mount, onTap } from '../dom';
import { prepareCard, shareCard } from '../share';

export interface Action { label: string; cls?: string; onClick: () => void }

/** Card + share button + extra actions. Used for both the death card and the role card. */
export function renderResult(root: HTMLElement, card: HTMLElement, filename: string, actions: Action[], heading = ''): void {
  const screen = mount(root, html(`
    <section class="screen result">
      ${heading ? `<p class="eyebrow">${heading}</p>` : ''}
      <div class="card-wrap"></div>
      <div class="actions"></div>
    </section>`));
  // Card stays 360×640 for a pixel-exact export; only its wrapper scales to fit narrow phones.
  const wrap = screen.querySelector<HTMLElement>('.card-wrap')!;
  const scaler = document.createElement('div');
  scaler.className = 'card-scale';
  scaler.append(card);
  wrap.append(scaler);
  wrap.style.setProperty('--s', String(Math.min(1, (Math.min(window.innerWidth, 480) - 32) / 360)));
  const prepared = prepareCard(card);
  prepared.catch(() => {}); // shareCard retries and reports; don't leave an unhandled rejection
  const share = button('📸 แชร์ / บันทึกรูป', 'btn primary');
  const bar = screen.querySelector('.actions')!;
  onTap(share, async () => {
    // Leaving mid-export would clone a detached card and pop a share sheet on the next screen.
    bar.querySelectorAll('button').forEach(b => (b.disabled = true));
    share.textContent = 'กำลังสร้างรูป...';
    await shareCard(card, filename, prepared);
    bar.querySelectorAll('button').forEach(b => (b.disabled = false));
    share.textContent = '📸 แชร์ / บันทึกรูป';
  });
  bar.append(share);
  for (const a of actions) {
    const b = button(a.label, a.cls ?? 'btn');
    onTap(b, a.onClick);
    bar.append(b);
  }
}
