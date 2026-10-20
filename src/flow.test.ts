// @vitest-environment jsdom
import { lifeQuestions } from './data/questions';
import { GRACE_MS } from './dom';
import { renderQuestion } from './screens/question';

beforeEach(() => { vi.useFakeTimers(); });
afterEach(() => { vi.useRealTimers(); });

const render = (index: number, done: (c: unknown) => void, root = document.createElement('div')) => {
  renderQuestion(root, { question: lifeQuestions[index], index, total: 5 }, done);
  return root;
};

test('double-tapping a choice advances only once', () => {
  const done = vi.fn();
  const root = render(0, done);
  vi.advanceTimersByTime(GRACE_MS + 1);
  const buttons = root.querySelectorAll<HTMLButtonElement>('button.choice');
  expect(buttons).toHaveLength(4);
  buttons[0].click();
  buttons[0].click();
  buttons[1].click();
  expect(done).toHaveBeenCalledTimes(1);
  expect(done).toHaveBeenCalledWith(lifeQuestions[0].choices[0]);
});

test('second tap of a double-tap does not answer the next question', () => {
  const root = document.createElement('div');
  const q2 = vi.fn();
  render(0, () => render(1, q2, root), root);
  vi.advanceTimersByTime(GRACE_MS + 1);
  root.querySelector<HTMLButtonElement>('button.choice')!.click(); // answers Q1, mounts Q2
  vi.advanceTimersByTime(150);                                      // human double-tap gap
  root.querySelector<HTMLButtonElement>('button.choice')!.click(); // lands on Q2
  expect(q2).not.toHaveBeenCalled();
  vi.advanceTimersByTime(GRACE_MS);
  root.querySelector<HTMLButtonElement>('button.choice')!.click();
  expect(q2).toHaveBeenCalledTimes(1);
});

test('question screen shows progress and prompt', () => {
  const root = render(1, () => {});
  expect(root.textContent).toContain('2 / 5');
  expect(root.textContent).toContain('คุณเปิดตู้เย็น');
});
