// @vitest-environment jsdom
import { GRACE_MS } from './dom';
import { renderResult } from './screens/result';

vi.mock('./share', () => ({
  prepareCard: vi.fn(() => Promise.resolve(new Blob())),
  shareCard: vi.fn(() => new Promise<void>(() => {})), // never settles: export in progress
}));

test('other actions are disabled while the image is being shared', () => {
  vi.useFakeTimers();
  const root = document.createElement('div');
  const leave = vi.fn();
  renderResult(root, document.createElement('article'), 'a.png', [{ label: 'ไปต่อ', onClick: leave }]);
  vi.advanceTimersByTime(GRACE_MS + 1);
  const [share, next] = root.querySelectorAll<HTMLButtonElement>('.actions button');
  share.click();
  expect(next.disabled).toBe(true);
  next.click();
  expect(leave).not.toHaveBeenCalled();
  vi.useRealTimers();
});
