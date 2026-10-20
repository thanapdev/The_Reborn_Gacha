// @vitest-environment jsdom
import { toBlob } from 'html-to-image';
import { prepareCard, shareCard } from './share';

vi.mock('html-to-image', () => ({ toBlob: vi.fn(async () => new Blob(['png'], { type: 'image/png' })) }));

const nav = navigator as unknown as Record<string, unknown>;

beforeAll(() => {
  Object.defineProperty(document, 'fonts', { value: { ready: Promise.resolve() }, configurable: true });
  URL.createObjectURL = vi.fn(() => 'blob:x');
  URL.revokeObjectURL = vi.fn();
});

afterEach(() => {
  delete nav.canShare;
  delete nav.share;
  document.body.innerHTML = '';
  vi.restoreAllMocks();
  vi.mocked(toBlob).mockClear();
});

test('uses Web Share with the PNG file when supported', async () => {
  const share = vi.fn(async () => {});
  nav.canShare = () => true;
  nav.share = share;
  await shareCard(document.createElement('div'), 'my-destiny.png');
  const arg = (share.mock.calls[0] as unknown as [ShareData])[0];
  expect(arg.files?.[0].name).toBe('my-destiny.png');
  expect(arg.files?.[0].type).toBe('image/png');
});

test('user cancelling the share sheet is silent', async () => {
  nav.canShare = () => true;
  nav.share = vi.fn(async () => { throw new DOMException('cancel', 'AbortError'); });
  await expect(shareCard(document.createElement('div'), 'a.png')).resolves.toBeUndefined();
  expect(document.querySelector('.toast')).toBeNull();
});

test('falls back to download when Web Share is unavailable', async () => {
  const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
  await shareCard(document.createElement('div'), 'a.png');
  expect(click).toHaveBeenCalledTimes(1);
  expect((click.mock.contexts[0] as HTMLAnchorElement).download).toBe('a.png');
});

test('other failures show a toast', async () => {
  nav.canShare = () => true;
  nav.share = vi.fn(async () => { throw new Error('boom'); });
  await shareCard(document.createElement('div'), 'a.png');
  expect(document.querySelector('.toast')?.textContent).toBe('บันทึกรูปไม่สำเร็จ ลองแคปหน้าจอแทนนะ');
});

test('prepareCard renders twice (Safari font warm-up) without cacheBust', async () => {
  await prepareCard(document.createElement('div'));
  expect(toBlob).toHaveBeenCalledTimes(2);
  vi.mocked(toBlob).mock.calls.forEach(([, opts]) => expect(opts?.cacheBust).toBeFalsy());
});

test('shareCard uses the prepared image instead of rendering inside the tap', async () => {
  const share = vi.fn(async () => {});
  nav.canShare = () => true;
  nav.share = share;
  const prepared = Promise.resolve(new Blob(['png'], { type: 'image/png' }));
  await shareCard(document.createElement('div'), 'a.png', prepared);
  expect(toBlob).not.toHaveBeenCalled();
  expect(share).toHaveBeenCalledTimes(1);
});

test('NotAllowedError (share outside user gesture, iOS) falls back to download', async () => {
  const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
  nav.canShare = () => true;
  nav.share = vi.fn(async () => { throw new DOMException('gesture', 'NotAllowedError'); });
  await shareCard(document.createElement('div'), 'a.png');
  expect(click).toHaveBeenCalledTimes(1);
  expect(document.querySelector('.toast')).toBeNull();
});
