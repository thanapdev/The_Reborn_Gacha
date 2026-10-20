import { button, html, mount, onTap } from '../dom';
import { prepareCards, shareCards } from '../share';

export interface Action { label: string; cls?: string; onClick: () => void }

/**
 * One or more cards plus actions. Pass `filenames` (one per card) to add a share button;
 * pass null for the per-phase results, which are view-only.
 */
export function renderResult(root: HTMLElement, cards: HTMLElement[], filenames: string[] | null, actions: Action[], heading = ''): void {
  const screen = mount(root, html(`
    <section class="screen result">
      ${heading ? `<p class="eyebrow">${heading}</p>` : ''}
      <div class="cards"></div>
      <div class="share-bar"></div>
      <div class="actions"></div>
    </section>`));
  // Cards stay 360×640 for a pixel-exact export; only their wrappers scale to fit narrow phones.
  const scale = String(Math.min(1, (Math.min(window.innerWidth, 480) - 32) / 360));
  for (const card of cards) {
    const wrap = document.createElement('div');
    wrap.className = 'card-wrap';
    wrap.style.setProperty('--s', scale);
    const scaler = document.createElement('div');
    scaler.className = 'card-scale';
    scaler.append(card);
    wrap.append(scaler);
    screen.querySelector('.cards')!.append(wrap);
  }
  const bar = screen.querySelector('.actions')!;
  if (filenames) {
    const prepared = prepareCards(cards);
    prepared.catch(() => {}); // shareCards retries and reports; don't leave an unhandled rejection
    const label = cards.length > 1 ? '📸 แชร์ / บันทึกรูปทั้ง 2 ใบ' : '📸 แชร์ / บันทึกรูป';
    const share = button(label, 'btn primary');
    onTap(share, async () => {
      // Leaving mid-export would clone a detached card and pop a share sheet on the next screen.
      screen.querySelectorAll('button').forEach(b => (b.disabled = true));
      share.textContent = 'กำลังสร้างรูป...';
      await shareCards(cards, filenames, prepared);
      screen.querySelectorAll('button').forEach(b => (b.disabled = false));
      share.textContent = label;
    });
    screen.querySelector('.share-bar')!.append(share);
  }
  for (const a of actions) {
    const b = button(a.label, a.cls ?? 'btn');
    onTap(b, a.onClick);
    bar.append(b);
  }
}
