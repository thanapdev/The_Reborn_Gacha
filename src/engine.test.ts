import { CHICKEN_SILLY, applyChoice, baseline, cardStats, isChicken, newState, pickBest, pickDeath, pickRole } from './engine';
import type { Death, Role } from './types';

const fixed = () => 0.5; // multiplier = 1.0

const role = (id: string, profile: Role['profile'] = {}): Role =>
  ({ id, profile, name: id, nameEn: id, tier: 'C', stars: 3, desc: ['x'] });

test('applyChoice adds delta, counts silly, keeps tag, no mutation', () => {
  const s0 = newState();
  const s1 = applyChoice(s0, { label: 'x', delta: { chaos: 5 }, silly: true, tag: 'chicken' });
  expect(s1.stats.chaos).toBe(5);
  expect(s1.silly).toBe(1);
  expect(s1.tags).toEqual(['chicken']);
  expect(s0.stats.chaos).toBe(0);
  expect(s0.tags).toEqual([]);
});

test('pickBest picks highest profile·stats', () => {
  const s = applyChoice(newState(), { label: '', delta: { wisdom: 5 } });
  expect(pickBest(s, [{ id: 'a', profile: { courage: 1 } }, { id: 'b', profile: { wisdom: 1 } }], fixed).id).toBe('b');
});

test('tagBonus adds to score when tag present', () => {
  const s = { ...newState(), tags: ['dragon'] };
  expect(pickBest(s, [{ id: 'a', profile: {} }, { id: 'b', profile: {}, tagBonus: { dragon: 3 } }], fixed).id).toBe('b');
});

test('pickDeath applies deathBonus', () => {
  const death: Death = {
    id: 'chain', profile: { chaos: 1 }, title: 't', rank: 'F', script: ['a'], quip: 'q', cause: 'c',
    deathBonus: { chaos: 5 },
  };
  const { death: d, state } = pickDeath(newState(), [death], fixed);
  expect(d.id).toBe('chain');
  expect(state.stats.chaos).toBe(5);
});

test('chicken requires tag', () => {
  const s = { ...newState(), silly: 12, stats: { ...newState().stats, chaos: 99 } };
  expect(isChicken(s)).toBe(false);
  expect(isChicken({ ...s, tags: ['chicken'] })).toBe(true);
});

test('chicken via silly count', () => {
  expect(isChicken({ ...newState(), tags: ['chicken'], silly: CHICKEN_SILLY })).toBe(true);
  expect(isChicken({ ...newState(), tags: ['chicken'], silly: CHICKEN_SILLY - 1 })).toBe(false);
});

test('pickRole never returns chicken without rule', () => {
  const s = applyChoice(newState(), { label: '', delta: { chaos: 50 } });
  expect(pickRole(s, [role('chicken', { chaos: 100 }), role('mage', { wisdom: 1 })], fixed).id).toBe('mage');
});

test('pickRole returns chicken when rule holds', () => {
  const s = { ...newState(), tags: ['chicken'], silly: CHICKEN_SILLY };
  expect(pickRole(s, [role('chicken'), role('mage', { wisdom: 1 })], fixed).id).toBe('chicken');
});

test('cardStats: 5 entries, 0..100, no NaN when all stats ≤ 0', () => {
  const s = applyChoice(newState(), { label: '', delta: { chaos: -3 } });
  const cs = cardStats(s, role('mage'));
  expect(cs).toHaveLength(5);
  cs.forEach(c => {
    expect(Number.isFinite(c.value)).toBe(true);
    expect(c.value).toBeGreaterThanOrEqual(0);
    expect(c.value).toBeLessThanOrEqual(100);
  });
});

test('cardStats scales top stat to 100', () => {
  const s = applyChoice(newState(), { label: '', delta: { wisdom: 8, courage: 4 } });
  const cs = cardStats(s, role('mage'));
  expect(cs[0]).toEqual({ label: 'WISDOM', value: 100, display: '100' });
  expect(cs[1].label).toBe('COURAGE');
  expect(cs[1].value).toBe(50);
});

test('cardStats chicken is fixed', () => {
  const cs = cardStats(newState(), role('chicken'));
  expect(cs.map(c => c.label)).toEqual(['HP', 'STR', 'INT', 'MAGIC', 'LUCK']);
  expect(cs.map(c => c.display)).toEqual(['3', '1', '0', '0', '999']);
});

test('baseline: mean and sd of uniform random answers', () => {
  const q = { id: 'q', prompt: '', choices: [
    { label: 'a', delta: { chaos: 2 } }, { label: 'b', delta: { chaos: 0, wisdom: 1 } },
  ] };
  const b = baseline([q, q]);
  expect(b.mean.chaos).toBe(2);       // 2 questions × mean 1
  expect(b.sd.chaos).toBeCloseTo(Math.sqrt(2)); // var 1 per question
  expect(b.sd.luck).toBe(1);          // zero variance floors at 1
});

test('pickBest with baseline compares stats relative to the average player', () => {
  // wisdom is always high for everyone, so a small chaos lead should win
  const base = { mean: { ...newState().stats, wisdom: 10 }, sd: { ...newState().stats, wisdom: 1, chaos: 1 } } as const;
  const s = applyChoice(newState(), { label: '', delta: { wisdom: 10, chaos: 2 } });
  const out = [{ id: 'mage', profile: { wisdom: 1 } }, { id: 'alch', profile: { chaos: 1 } }];
  expect(pickBest(s, out, fixed, base as never).id).toBe('alch');
});
