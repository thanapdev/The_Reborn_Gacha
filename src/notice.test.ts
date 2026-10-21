// @vitest-environment jsdom
import { showNotice } from './screens/notice';

afterEach(() => { document.body.innerHTML = ''; localStorage.clear(); });

test('notice shows on first visit and stays gone after "เข้าใจแล้ว"', () => {
  showNotice();
  const box = document.querySelector('.notice')!;
  expect(box.textContent).toContain('ไม่มีการแสวงหาผลกำไร');
  box.querySelector('button')!.click();
  expect(document.querySelector('.notice')).toBeNull();
  showNotice();
  expect(document.querySelector('.notice')).toBeNull();
});
