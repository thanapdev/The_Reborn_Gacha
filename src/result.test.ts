// @vitest-environment jsdom
import { GRACE_MS } from './dom';
import { renderResult } from './screens/result';
import { prepareCards, shareCards } from './share';

vi.mock('./share', () => ({
  prepareCards: vi.fn(() => Promise.resolve([])),
  shareCards: vi.fn(() => new Promise<void>(() => {})), // never settles: export in progress
}));

beforeEach(() => { vi.useFakeTimers(); vi.mocked(prepareCards).mockClear(); });
afterEach(() => { vi.useRealTimers(); });

const card = () => document.createElement('article');

test('phase result has no share button and does not render images', () => {
  const root = document.createElement('div');
  renderResult(root, [card()], null, [{ label: 'ไปต่อ', onClick: () => {} }]);
  expect(root.querySelectorAll('.actions button')).toHaveLength(1);
  expect(root.textContent).not.toContain('แชร์');
  expect(prepareCards).not.toHaveBeenCalled();
});

test('summary: a share button under each card plus one that shares both', () => {
  const root = document.createElement('div');
  const cards = [card(), card()];
  renderResult(root, cards, ['death.png', 'destiny.png'], []);
  expect(root.querySelectorAll('.card-wrap article')).toHaveLength(2);
  const perCard = [...root.querySelectorAll<HTMLButtonElement>('.card-col button')];
  expect(perCard).toHaveLength(2);
  const all = [...root.querySelectorAll<HTMLButtonElement>('.actions button')].find(b => b.textContent!.includes('แชร์'))!;
  expect(prepareCards).toHaveBeenCalledTimes(1);
  vi.advanceTimersByTime(GRACE_MS + 1);
  perCard[1].click();
  expect(shareCards).toHaveBeenLastCalledWith([cards[1]], ['destiny.png'], expect.any(Promise));
  perCard[1].disabled = all.disabled = false; // first share never settles in this mock
  all.click();
  expect(shareCards).toHaveBeenLastCalledWith(cards, ['death.png', 'destiny.png'], expect.any(Promise));
});

test('other actions are disabled while the image is being shared', () => {
  const root = document.createElement('div');
  const leave = vi.fn();
  renderResult(root, [card()], ['a.png'], [{ label: 'ไปต่อ', onClick: leave }]);
  vi.advanceTimersByTime(GRACE_MS + 1);
  const [share, next] = root.querySelectorAll<HTMLButtonElement>('.result button');
  share.click();
  expect(next.disabled).toBe(true);
  next.click();
  expect(leave).not.toHaveBeenCalled();
});
