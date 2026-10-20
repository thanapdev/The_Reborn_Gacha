import { roleArt } from '../art/roles';
import { button, html, mount, onTap } from '../dom';
import { roles } from '../data/roles';
import { getCollection } from '../storage';

export function renderCollection(root: HTMLElement, onBack: () => void): void {
  const got = new Set(getCollection());
  const cells = roles.map(r => got.has(r.id)
    ? `<li class="slot tier-${r.tier}"><div class="slot-art">${roleArt[r.id]}</div><span>${r.name}</span><small>${r.tier}</small></li>`
    : `<li class="slot locked"><div class="slot-art">?</div><span>??? — Locked</span><small>${r.tier === 'SECRET' ? '???' : r.tier}</small></li>`,
  ).join('');
  const screen = mount(root, html(`
    <section class="screen collection">
      <p class="eyebrow">Destiny Collection</p>
      <h2>ปลดล็อกแล้ว ${got.size} / ${roles.length}</h2>
      <ul class="grid">${cells}</ul>
      <div class="actions"></div>
    </section>`));
  const back = button('← กลับ', 'btn');
  onTap(back, onBack);
  screen.querySelector('.actions')!.append(back);
}
