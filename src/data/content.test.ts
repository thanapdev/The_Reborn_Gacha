import { applyChoice, newState, pickDeath, pickRole } from '../engine';
import { deaths } from './deaths';
import { goddessIntro } from './goddess';
import { fullBase, goddessQuestions, lifeBase, lifeQuestions } from './questions';
import { roles } from './roles';

test('content counts', () => {
  expect(lifeQuestions).toHaveLength(5);
  expect(goddessQuestions).toHaveLength(7);
  expect(deaths).toHaveLength(7);
  expect(roles).toHaveLength(13);
  expect(goddessIntro.length).toBeGreaterThan(0);
});

test('choice counts: goddess Q7 has 6, others 4', () => {
  [...lifeQuestions, ...goddessQuestions.slice(0, 6)].forEach(q => expect(q.choices).toHaveLength(4));
  expect(goddessQuestions[6].choices).toHaveLength(6);
});

test('every choice has a non-empty delta', () => {
  for (const q of [...lifeQuestions, ...goddessQuestions])
    for (const c of q.choices) expect(Object.keys(c.delta).length, `${q.id}: ${c.label}`).toBeGreaterThan(0);
});

test('ids are unique and match spec', () => {
  expect(deaths.map(d => d.id)).toEqual(['peaceful', 'sleep', 'food', 'pigeon', 'wetfloor', 'drinking', 'chain']);
  expect(roles.map(r => r.id)).toEqual([
    'villager', 'farmer', 'merchant', 'alchemist', 'adventurer', 'thief', 'mage', 'elf',
    'dragonTamer', 'hero', 'king', 'demonLord', 'chicken',
  ]);
  const qids = [...lifeQuestions, ...goddessQuestions].map(q => q.id);
  expect(new Set(qids).size).toBe(qids.length);
});

test('companion question tags chicken (with reaction) and dragon', () => {
  const choices = goddessQuestions[2].choices;
  const chicken = choices.find(c => c.tag === 'chicken');
  expect(chicken?.reaction).toEqual(['แน่ใจนะ?', '...โอเค']);
  expect(choices.some(c => c.tag === 'dragon')).toBe(true);
});

test('every death and role has text', () => {
  for (const d of deaths) {
    expect(d.script.length).toBeGreaterThan(0);
    expect(d.quip).not.toBe('');
    expect(d.cause).not.toBe('');
  }
  for (const r of roles) expect(r.desc.length).toBeGreaterThan(0);
});

test('simulation: outcome distribution is balanced', () => {
  const N = 10_000;
  const deathCount: Record<string, number> = {};
  const roleCount: Record<string, number> = {};
  const pick = <T>(xs: T[]) => xs[Math.floor(Math.random() * xs.length)];
  for (let i = 0; i < N; i++) {
    let s = newState();
    for (const q of lifeQuestions) s = applyChoice(s, pick(q.choices));
    const r1 = pickDeath(s, deaths, Math.random, lifeBase);
    s = r1.state;
    for (const q of goddessQuestions) s = applyChoice(s, pick(q.choices));
    const role = pickRole(s, roles, Math.random, fullBase);
    deathCount[r1.death.id] = (deathCount[r1.death.id] ?? 0) + 1;
    roleCount[role.id] = (roleCount[role.id] ?? 0) + 1;
  }
  const share = (n = 0) => n / N;
  const report = JSON.stringify({ deathCount, roleCount });
  for (const d of deaths) {
    expect(share(deathCount[d.id]), `death ${d.id} ${report}`).toBeGreaterThanOrEqual(0.02);
    expect(share(deathCount[d.id]), `death ${d.id} ${report}`).toBeLessThanOrEqual(0.2);
  }
  for (const r of roles.filter(r => r.id !== 'chicken')) {
    expect(share(roleCount[r.id]), `role ${r.id} ${report}`).toBeGreaterThanOrEqual(0.02);
    expect(share(roleCount[r.id]), `role ${r.id} ${report}`).toBeLessThanOrEqual(0.2);
  }
  expect(share(roleCount.chicken), `chicken ${report}`).toBeGreaterThanOrEqual(0.005);
  expect(share(roleCount.chicken), `chicken ${report}`).toBeLessThanOrEqual(0.05);
});
