// @vitest-environment jsdom
import { toBlob } from 'html-to-image';
import { prepareCards, shareCards } from './share';

vi.mock('html-to-image', () => ({ toBlob: vi.fn(async () => new Blob(['png'], { type: 'image/png' })) }));

const nav = navigator as unknown as Record<string, unknown>;
const two = () => [document.createElement('div'), document.createElement('div')];

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

test('shares both cards as PNG files in one Web Share call', async () => {
  const share = vi.fn(async () => {});
  nav.canShare = () => true;
  nav.share = share;
  await shareCards(two(), ['death.png', 'destiny.png']);
  expect(share).toHaveBeenCalledTimes(1);
  const arg = (share.mock.calls[0] as unknown as [ShareData])[0];
  expect(arg.files?.map(f => f.name)).toEqual(['death.png', 'destiny.png']);
  arg.files?.forEach(f => expect(f.type).toBe('image/png'));
});

test('user cancelling the share sheet is silent', async () => {
  nav.canShare = () => true;
  nav.share = vi.fn(async () => { throw new DOMException('cancel', 'AbortError'); });
  await expect(shareCards(two(), ['a.png', 'b.png'])).resolves.toBeUndefined();
  expect(document.querySelector('.toast')).toBeNull();
});

test('falls back to downloading every card when Web Share is unavailable', async () => {
  const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
  await shareCards(two(), ['a.png', 'b.png']);
  expect(click.mock.contexts.map(a => (a as HTMLAnchorElement).download)).toEqual(['a.png', 'b.png']);
});

test('other failures show a toast', async () => {
  nav.canShare = () => true;
  nav.share = vi.fn(async () => { throw new Error('boom'); });
  await shareCards(two(), ['a.png', 'b.png']);
  expect(document.querySelector('.toast')?.textContent).toBe('บันทึกรูปไม่สำเร็จ ลองแคปหน้าจอแทนนะ');
});

test('prepareCards renders each card twice (Safari font warm-up) without cacheBust', async () => {
  const blobs = await prepareCards(two());
  expect(blobs).toHaveLength(2);
  expect(toBlob).toHaveBeenCalledTimes(4);
  vi.mocked(toBlob).mock.calls.forEach(([, opts]) => expect(opts?.cacheBust).toBeFalsy());
});

test('shareCards uses the prepared images instead of rendering inside the tap', async () => {
  const share = vi.fn(async () => {});
  nav.canShare = () => true;
  nav.share = share;
  const prepared = Promise.resolve([new Blob(['a']), new Blob(['b'])]);
  await shareCards(two(), ['a.png', 'b.png'], prepared);
  expect(toBlob).not.toHaveBeenCalled();
  expect(share).toHaveBeenCalledTimes(1);
});

test('NotAllowedError (share outside user gesture, iOS) falls back to download', async () => {
  const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
  nav.canShare = () => true;
  nav.share = vi.fn(async () => { throw new DOMException('gesture', 'NotAllowedError'); });
  await shareCards(two(), ['a.png', 'b.png']);
  expect(click).toHaveBeenCalledTimes(2);
  expect(document.querySelector('.toast')).toBeNull();
});
