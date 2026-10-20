# ชาติหน้าขอเป็นตัวเอก Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Static web game: answer 5 life questions → death card, answer 7 goddess questions → role card, both exportable to 1080×1920 PNG and shareable to IG/FB Story.

**Architecture:** Pure data files (questions/deaths/roles/dialogue) feed a pure `engine.ts` (stat accumulation + best-profile match + chicken rule). A tiny screen state machine in `main.ts` renders DOM screens; `card.ts` renders the shared card layout; `share.ts` rasterizes it with `html-to-image` and hands it to Web Share or a download.

**Tech Stack:** Vite, vanilla TypeScript, `html-to-image`, `vitest`. Fonts: Google Fonts `Mitr` + `Sarabun`.

**Spec:** `docs/superpowers/specs/2026-10-20-isekai-gacha-design.md`

## Global Constraints

- No backend, no UI framework, no audio. Only runtime dependency: `html-to-image`.
- All copy is Thai, taken from `iseki_fantasy_game_plan.md` sections §3, §6, §7, §8, §10, §11; English only for `nameEn` and fixed UI words ("YOUR DESTINY", "YOU DIED").
- Stats: `courage wisdom kindness ambition chaos luck greed laziness`, all start at 0.
- Added ranks: food = B, pigeon = C, wetfloor = C.
- Card on screen is 9:16; export is exactly 1080×1920 PNG.
- Art is inline SVG strings, `viewBox="0 0 200 200"`, no external images.
- localStorage keys: `isekai.collection.v1` (string[] of role ids), `isekai.played.v1` ("1"). Every access wrapped in try/catch.
- Tap targets ≥ 48px tall; text contrast ≥ 4.5:1; honor `prefers-reduced-motion`.
- Project is not a git repo; skip commit steps unless the user runs `git init`.

## Review Focus

- Share cancelled by user (`AbortError`) → no toast, nothing breaks. Test in Task 4.
- localStorage throws (Safari private mode) → game still plays, collection shows all locked. Test in Task 4.
- Thai fonts not yet loaded when exporting → PNG must use Mitr/Sarabun, not fallback. Covered by `await document.fonts.ready` in Task 4 + manual check in Task 6.
- Double-tapping a choice button → must advance only one question. Test in Task 5.
- All stats ≤ 0 (e.g. only negative deltas) → `cardStats` must not divide by zero or show NaN. Test in Task 1.

---

### Task 1: Scaffold + engine

**Files:**
- Create: `package.json`, `tsconfig.json`, `index.html`, `src/types.ts`, `src/engine.ts`, `src/engine.test.ts`

**Interfaces:**
- Produces (`src/types.ts`):
  ```ts
  export type Stat = 'courage'|'wisdom'|'kindness'|'ambition'|'chaos'|'luck'|'greed'|'laziness';
  export const STATS: Stat[];
  export type Stats = Record<Stat, number>;
  export interface Choice { label: string; delta: Partial<Stats>; silly?: boolean; tag?: string; reaction?: string[] }
  export interface Question { id: string; prompt: string; choices: Choice[] }
  export interface Outcome { id: string; profile: Partial<Stats>; tagBonus?: Record<string, number> }
  export interface Death extends Outcome { title: string; rank: 'S'|'A'|'B'|'C'|'D'|'F'; script: string[]; quip: string; cause: string; deathBonus: Partial<Stats> }
  export type Tier = 'F'|'D'|'C'|'B'|'A'|'S'|'SECRET';
  export interface Role extends Outcome { name: string; nameEn: string; tier: Tier; stars: number; desc: string[] }
  export interface GameState { stats: Stats; silly: number; tags: string[] }
  export interface CardStat { label: string; value: number; display: string }
  ```
- Produces (`src/engine.ts`):
  - `newState(): GameState`
  - `applyChoice(s: GameState, c: Choice): GameState` — returns new object, does not mutate
  - `pickBest<T extends Outcome>(s: GameState, outcomes: T[], rng: () => number): T`
  - `pickDeath(s: GameState, deaths: Death[], rng): { death: Death; state: GameState }` — state has `deathBonus` applied
  - `CHICKEN_CHAOS: number` (start 12), `CHICKEN_SILLY = 6`
  - `isChicken(s: GameState): boolean`
  - `pickRole(s: GameState, roles: Role[], rng): Role` — `roles` includes `chicken`; chicken never chosen by `pickBest`
  - `cardStats(s: GameState, role: Role): CardStat[]` — 5 entries

- [ ] **Step 1: Scaffold** — `npm create vite@latest . -- --template vanilla-ts`, delete demo files, `npm i html-to-image`, `npm i -D vitest`, add script `"test": "vitest run"`.

- [ ] **Step 2: Write failing tests in `src/engine.test.ts`**

```ts
const fixed = () => 0.5; // multiplier = 1.0
test('applyChoice adds delta, counts silly, keeps tag, no mutation', () => {
  const s0 = newState();
  const s1 = applyChoice(s0, { label: 'x', delta: { chaos: 5 }, silly: true, tag: 'chicken' });
  expect(s1.stats.chaos).toBe(5); expect(s1.silly).toBe(1); expect(s1.tags).toEqual(['chicken']);
  expect(s0.stats.chaos).toBe(0);
});
test('pickBest picks highest profile·stats', () => {
  const s = applyChoice(newState(), { label: '', delta: { wisdom: 5 } });
  expect(pickBest(s, [{ id: 'a', profile: { courage: 1 } }, { id: 'b', profile: { wisdom: 1 } }], fixed).id).toBe('b');
});
test('tagBonus adds to score when tag present', () => {
  const s = { ...newState(), tags: ['dragon'] };
  expect(pickBest(s, [{ id: 'a', profile: {} }, { id: 'b', profile: {}, tagBonus: { dragon: 3 } }], fixed).id).toBe('b');
});
test('pickDeath applies deathBonus', () => { /* one death with deathBonus {chaos:5} → state.stats.chaos === 5 */ });
test('chicken requires tag', () => {
  const s = { ...newState(), silly: 12, stats: { ...newState().stats, chaos: 99 } };
  expect(isChicken(s)).toBe(false);
  expect(isChicken({ ...s, tags: ['chicken'] })).toBe(true);
});
test('chicken via silly count', () => { /* tags ['chicken'], silly 6, chaos 0 → true; silly 5 → false */ });
test('pickRole never returns chicken without rule', () => { /* roles [chicken(profile chaos 100), mage] + high chaos, no tag → mage */ });
test('cardStats: 5 entries, 0..100, no NaN when all stats ≤ 0', () => {
  const cs = cardStats(newState(), { id: 'mage' } as Role);
  expect(cs).toHaveLength(5); cs.forEach(c => { expect(Number.isFinite(c.value)).toBe(true); expect(c.value).toBeGreaterThanOrEqual(0); });
});
test('cardStats chicken is fixed', () => { /* labels HP STR INT MAGIC LUCK, display '3','1','0','0','999' */ });
```

- [ ] **Step 3: Run `npm test`** — expect FAIL (module not found).

- [ ] **Step 4: Implement `src/types.ts` and `src/engine.ts`.**
  - `pickBest` score: `Σ profile[s]·stats[s] · (0.9 + 0.2·rng()) + Σ tagBonus[t] for t in tags`; skip outcomes with `id === 'chicken'`.
  - `cardStats` (non-chicken): top 5 stats by value; `value = round(100 · max(v,0) / max(maxStat, 1))`, floor at 5 so bars are visible; labels are uppercase stat names; `display = String(value)`.

- [ ] **Step 5: Run `npm test`** — expect PASS.

---

### Task 2: Content + balance simulation

**Files:**
- Create: `src/data/questions.ts`, `src/data/deaths.ts`, `src/data/roles.ts`, `src/data/goddess.ts`, `src/data/content.test.ts`

**Interfaces:**
- Consumes: types + engine from Task 1.
- Produces: `lifeQuestions: Question[]` (5), `goddessQuestions: Question[]` (7), `deaths: Death[]` (7, ids `peaceful sleep food pigeon wetfloor drinking chain`), `roles: Role[]` (13, ids `villager farmer merchant alchemist adventurer thief mage elf dragonTamer hero king demonLord chicken`), `goddessIntro: string[]`.

- [ ] **Step 1: Write failing tests in `src/data/content.test.ts`**
  - counts: 5 / 7 / 7 / 13; goddess Q7 has 6 choices, others 4.
  - every choice has non-empty `delta`; ids unique.
  - goddess Q3 chicken choice has `tag: 'chicken'` and a non-empty `reaction` (`["แน่ใจนะ?", "...โอเค"]`); dragon choice has `tag: 'dragon'`.
  - every death has non-empty `script`, `quip`, `cause`; every role has non-empty `desc`.
  - `simulation`: 10,000 runs with `Math.random`, uniformly random choice per question, `pickDeath` then `pickRole`. Assert each death and each non-chicken role share in `[0.02, 0.20]`, chicken in `[0.005, 0.05]`.

- [ ] **Step 2: Run `npm test`** — FAIL.

- [ ] **Step 3: Write the data.** Copy prompts/choices/scripts/descriptions from `iseki_fantasy_game_plan.md`. Start profiles from spec §4 tables. Mark every option D (and Q7 options D/F) of the plan as `silly: true`. Use plan examples as anchors: cat help → kindness +2; eat creature → chaos +5; sleep more → laziness +3; add 20 baht → chaos +2, kindness +1. Write extra comedy lines where the plan says only "เกิดเหตุไม่คาดคิด" (food, drinking) — keep them absurd but harmless. `deathBonus` small (≤ 3 per stat), e.g. chain → chaos +3. `stars`: F=1, D=2, C=3, B=4, A=4, S=5, SECRET=5. `cause` is a one-line Thai summary for the role card, e.g. `"ลื่นป้ายระวังพื้นลื่น"`.

- [ ] **Step 4: Run `npm test`; tune deltas/profiles/`CHICKEN_CHAOS` until the simulation passes.** Change numbers only, not the engine.

---

### Task 3: Art

**Files:**
- Create: `src/art/roles.ts`, `src/art/deaths.ts`, `src/art/art.test.ts`

**Interfaces:**
- Produces: `roleArt: Record<string, string>`, `deathArt: Record<string, string>` — full `<svg viewBox="0 0 200 200" ...>` strings keyed by outcome id.

- [ ] **Step 1: Failing test** — every id in `roles`/`deaths` has art starting with `<svg` and containing `viewBox="0 0 200 200"`; no string contains `href="http`.
- [ ] **Step 2: Draw 20 SVGs.** Flat, bold shapes, one shared palette (navy `#0b0f2a`, gold `#e8c26a`, plus 3–4 accents). Each tells its joke visually (mage holding unopened bottle, demon lord hugging pillow in castle, chicken with tiny crown of plot armor, pigeon over a lamp post, sock + domino chain, etc.).
- [ ] **Step 3: `npm test`** — PASS.

---

### Task 4: Card, share, storage

**Files:**
- Create: `src/card.ts`, `src/share.ts`, `src/storage.ts`, `src/storage.test.ts`, `src/share.test.ts`

**Interfaces:**
- Produces:
  - `renderRoleCard(role: Role, s: GameState, death: Death): HTMLElement`
  - `renderDeathCard(death: Death): HTMLElement`
  - `shareCard(el: HTMLElement, filename: string): Promise<void>`
  - `getCollection(): string[]`, `addToCollection(id: string): void`, `hasPlayed(): boolean`, `markPlayed(): void`

- [ ] **Step 1: Failing tests (vitest, `environment: 'jsdom'` for these files; `npm i -D jsdom`)**
  - storage: with `localStorage.getItem` throwing → `getCollection()` returns `[]`, `addToCollection` does not throw; normal path dedupes ids.
  - share: mock `html-to-image.toBlob`; when `navigator.canShare` returns true and `navigator.share` rejects with `DOMException('', 'AbortError')` → resolves, no toast element added; when `canShare` undefined → an `<a download>` is clicked.
- [ ] **Step 2: `npm test`** — FAIL.
- [ ] **Step 3: Implement.**
  - Card layout per spec §6. Root class `card tier-<tier>` (death card uses `rank-<rank>`). Card element width fixed at 360px, height 640px; export with `pixelRatio: 3` → 1080×1920.
  - `shareCard`: `await document.fonts.ready`, `toBlob(el, { pixelRatio: 3, cacheBust: true })`, then share/download/toast per spec §8. Toast text: `บันทึกรูปไม่สำเร็จ ลองแคปหน้าจอแทนนะ`.
  - Footer URL = `location.host`.
- [ ] **Step 4: `npm test`** — PASS.

---

### Task 5: Screens + flow + style

**Files:**
- Create: `src/main.ts`, `src/screens/landing.ts`, `src/screens/question.ts`, `src/screens/script.ts`, `src/screens/result.ts`, `src/screens/calculating.ts`, `src/screens/collection.ts`, `src/style.css`, `src/flow.test.ts`
- Modify: `index.html` (Google Fonts link, `<div id="app">`)

**Interfaces:**
- Consumes: everything above.
- Each screen: `(root: HTMLElement, props, onDone: (result) => void) => void`. `script.ts` plays `string[]` line by line (~700ms/line, tap = next line, "ข้าม" button when `hasPlayed()`); used for death script and goddess intro and choice reactions.
- `main.ts` holds `GameState`, current `death`, and runs the flow in spec §3; on role result calls `addToCollection(role.id)` and `markPlayed()`.

- [ ] **Step 1: Failing test `src/flow.test.ts` (jsdom)** — render question screen with a 4-choice question; dispatch two rapid clicks on choice A → `onDone` called once.
- [ ] **Step 2: `npm test`** — FAIL.
- [ ] **Step 3: Implement screens.** Question screen disables all buttons on first click. Calculating screen shows "Calculating Destiny..." with progress for 2.5s (0.3s under reduced motion). Result screen: card + buttons `📸 แชร์ / บันทึกรูป`, `🔄 เกิดใหม่อีกครั้ง`, `📜 Collection` (death result: `📸` and `ไปต่อ →`). Collection grid: 13 slots, locked = `??? — Locked`.
- [ ] **Step 4: Style.** Use ui-ux-pro-max for the dark-fantasy pass: navy/gold palette, CSS star field (disabled under `prefers-reduced-motion`), RPG-plaque buttons ≥ 48px, tier frames (F/D bronze-grey, C/B silver-blue, A purple, S gold, SECRET animated rainbow), "YOU DIED" red, fade-to-white into goddess.
- [ ] **Step 5: `npm test`** — PASS.

---

### Task 6: Verify

- [ ] **Step 1:** `npm test && npm run build` — all pass, build succeeds with no TS errors.
- [ ] **Step 2:** `npm run dev`, play a full run at 375px width: every screen reachable, both cards render, Collection updates after a run, second run shows "ข้าม".
- [ ] **Step 3:** Export a role card: file is 1080×1920 (`sips -g pixelWidth -g pixelHeight my-destiny.png`), Thai renders in Mitr/Sarabun, SVG art present.
- [ ] **Step 4:** Force chicken (pick ไก่ + all silly answers) → SECRET card with fixed stats.
