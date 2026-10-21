import { button, html, mount, onTap } from '../dom';
import { prepareCards, shareCards } from '../share';

export interface Action { label: string; cls?: string; onClick: () => void }

/**
 * One or more cards plus actions. Pass `filenames` (one per card) to add a share button under
 * each card, plus one that shares them all; pass null for the per-phase results, which are view-only.
 */
export function renderResult(root: HTMLElement, cards: HTMLElement[], filenames: string[] | null, actions: Action[], heading = ''): void {
  const screen = mount(root, html(`
    <section class="screen result">
      ${heading ? `<p class="eyebrow">${heading}</p>` : ''}
      <div class="cards"></div>
      <div class="actions"></div>
    </section>`));
  const bar = screen.querySelector('.actions')!;
  const prepared = filenames ? prepareCards(cards) : null;
  prepared?.catch(() => {}); // shareCards retries and reports; don't leave an unhandled rejection

  const shareButton = (label: string, cls: string, els: HTMLElement[], names: string[], blobs: Promise<Blob[]>) => {
    const b = button(label, cls);
    onTap(b, async () => {
      // Leaving mid-export would clone a detached card and pop a share sheet on the next screen.
      screen.querySelectorAll('button').forEach(x => (x.disabled = true));
      b.textContent = 'กำลังสร้างรูป...';
      await shareCards(els, names, blobs);
      screen.querySelectorAll('button').forEach(x => (x.disabled = false));
      b.textContent = label;
    });
    return b;
  };

  // Cards stay 360×640 for a pixel-exact export; only their wrappers scale to fit narrow phones.
  const scale = String(Math.min(1, (Math.min(window.innerWidth, 480) - 32) / 360));
  cards.forEach((card, i) => {
    const col = document.createElement('div');
    col.className = 'card-col';
    const wrap = document.createElement('div');
    wrap.className = 'card-wrap';
    wrap.style.setProperty('--s', scale);
    const scaler = document.createElement('div');
    scaler.className = 'card-scale';
    scaler.append(card);
    wrap.append(scaler);
    col.append(wrap);
    if (filenames && prepared) {
      const one = prepared.then(b => [b[i]]);
      one.catch(() => {});
      col.append(shareButton(cards.length > 1 ? '📸 แชร์ใบนี้' : '📸 แชร์ / บันทึกรูป', 'btn primary', [card], [filenames[i]], one));
    }
    screen.querySelector('.cards')!.append(col);
  });
  if (filenames && prepared && cards.length > 1) {
    bar.append(shareButton(`📸 แชร์ทั้ง ${cards.length} ใบ`, 'btn', cards, filenames, prepared));
  }
  for (const a of actions) {
    const b = button(a.label, a.cls ?? 'btn');
    onTap(b, a.onClick);
    bar.append(b);
  }
}
