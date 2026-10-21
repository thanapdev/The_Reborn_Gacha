// @vitest-environment jsdom
import { renderDeathCard, renderRoleCard } from './card';
import { deaths } from './data/deaths';
import { roles } from './data/roles';
import { applyChoice, newState } from './engine';

const mage = roles.find(r => r.id === 'mage')!;
const chicken = roles.find(r => r.id === 'chicken')!;
const wet = deaths.find(d => d.id === 'wetfloor')!;

test('role card shows identity, tier frame, 5 stat bars, jokes and cause of death', () => {
  const s = applyChoice(newState(), { label: '', delta: { wisdom: 6, chaos: 2 } });
  const el = renderRoleCard(mage, s, wet);
  expect(el.classList).toContain('card');
  expect(el.classList).toContain('tier-B');
  expect(el.textContent).toContain('YOUR DESTINY');
  expect(el.textContent).toContain('จอมเวท');
  expect(el.textContent).toContain('THE GREAT MAGE');
  expect(el.querySelectorAll('.bar')).toHaveLength(5);
  expect(el.querySelector('img')).not.toBeNull();
  mage.desc.forEach(line => expect(el.textContent).toContain(line));
  expect(el.textContent).toContain(wet.cause);
});

test('chicken card uses SECRET frame and fixed LUCK 999', () => {
  const el = renderRoleCard(chicken, newState(), wet);
  expect(el.classList).toContain('tier-SECRET');
  expect(el.textContent).toContain('999');
});

test('death card shows YOU DIED, title, rank and quip', () => {
  const el = renderDeathCard(wet);
  expect(el.classList).toContain('rank-C');
  expect(el.textContent).toContain('YOU DIED');
  expect(el.textContent).toContain(wet.title);
  expect(el.textContent).toContain(wet.quip);
  expect(el.querySelector('img')).not.toBeNull();
});
