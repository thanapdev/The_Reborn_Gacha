import { STATS } from './types';
import type { CardStat, Choice, Death, GameState, Outcome, Question, Role, Stats } from './types';

export const CHICKEN_CHAOS = 16;
export const CHICKEN_SILLY = 7;

export function newState(): GameState {
  const stats = Object.fromEntries(STATS.map(s => [s, 0])) as Stats;
  return { stats, silly: 0, tags: [] };
}

function addStats(stats: Stats, delta: Partial<Stats>): Stats {
  const out = { ...stats };
  for (const s of STATS) out[s] += delta[s] ?? 0;
  return out;
}

export function applyChoice(s: GameState, c: Choice): GameState {
  return {
    stats: addStats(s.stats, c.delta),
    silly: s.silly + (c.silly ? 1 : 0),
    tags: c.tag ? [...s.tags, c.tag] : [...s.tags],
  };
}

export interface Baseline { mean: Stats; sd: Stats }

// Expected stats of a player who answers every question uniformly at random.
// Scoring against this keeps roles balanced no matter how generous the deltas are.
export function baseline(questions: Question[]): Baseline {
  const mean = newState().stats;
  const sd = newState().stats;
  for (const st of STATS) {
    let variance = 0;
    for (const q of questions) {
      const vals = q.choices.map(c => c.delta[st] ?? 0);
      const m = vals.reduce((a, b) => a + b, 0) / vals.length;
      mean[st] += m;
      variance += vals.reduce((a, v) => a + (v - m) ** 2, 0) / vals.length;
    }
    sd[st] = Math.max(Math.sqrt(variance), 1);
  }
  return { mean, sd };
}

export const NOISE = 0.4;

export function pickBest<T extends Outcome>(s: GameState, outcomes: T[], rng: () => number, base?: Baseline): T {
  let best = outcomes[0];
  let bestScore = -Infinity;
  for (const o of outcomes) {
    if (o.id === 'chicken') continue;
    let score = 0;
    let norm = 0;
    for (const st of STATS) {
      const w = o.profile[st] ?? 0;
      const v = base ? (s.stats[st] - base.mean[st]) / (base.sd[st] || 1) : s.stats[st];
      score += w * v;
      norm += w * w;
    }
    if (base) score = score / Math.sqrt(norm || 1) + (rng() - 0.5) * NOISE;
    else score *= 0.9 + 0.2 * rng();
    for (const t of s.tags) score += o.tagBonus?.[t] ?? 0;
    if (score > bestScore) { best = o; bestScore = score; }
  }
  return best;
}

export function pickDeath(s: GameState, deaths: Death[], rng: () => number, base?: Baseline): { death: Death; state: GameState } {
  const death = pickBest(s, deaths, rng, base);
  return { death, state: { ...s, stats: addStats(s.stats, death.deathBonus) } };
}

export function isChicken(s: GameState): boolean {
  return s.tags.includes('chicken') && (s.stats.chaos >= CHICKEN_CHAOS || s.silly >= CHICKEN_SILLY);
}

export function pickRole(s: GameState, roles: Role[], rng: () => number, base?: Baseline): Role {
  if (isChicken(s)) return roles.find(r => r.id === 'chicken')!;
  return pickBest(s, roles, rng, base);
}

export function cardStats(s: GameState, role: Role): CardStat[] {
  if (role.id === 'chicken') {
    return [['HP', 3], ['STR', 1], ['INT', 0], ['MAGIC', 0], ['LUCK', 999]]
      .map(([label, v]) => ({ label: label as string, value: Math.min(v as number, 100), display: String(v) }));
  }
  const top = [...STATS].sort((a, b) => s.stats[b] - s.stats[a]).slice(0, 5);
  const max = Math.max(s.stats[top[0]], 1);
  return top.map(st => {
    const value = Math.max(5, Math.round((100 * Math.max(s.stats[st], 0)) / max));
    return { label: st.toUpperCase(), value, display: String(value) };
  });
}
