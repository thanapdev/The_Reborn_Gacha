import { toBlob } from 'html-to-image';

export const PIXEL_RATIO = 3; // 360×640 card → 1080×1920 story image

export function toast(text: string): void {
  const el = document.createElement('div');
  el.className = 'toast';
  el.setAttribute('role', 'status');
  el.textContent = text;
  document.body.append(el);
  setTimeout(() => el.remove(), 3500);
}

function download(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Renders the card to PNG. Call it when the result screen opens, not inside the tap:
 * iOS only lets navigator.share() run shortly after the tap, and the first render is slow.
 * The first render is thrown away because Safari draws it before the embedded fonts decode.
 */
export async function prepareCard(el: HTMLElement): Promise<Blob> {
  await document.fonts.ready;
  await toBlob(el, { pixelRatio: PIXEL_RATIO });
  const blob = await toBlob(el, { pixelRatio: PIXEL_RATIO });
  if (!blob) throw new Error('empty image');
  return blob;
}

export async function shareCard(el: HTMLElement, filename: string, prepared?: Promise<Blob>): Promise<void> {
  const fail = () => toast('บันทึกรูปไม่สำเร็จ ลองแคปหน้าจอแทนนะ');
  let blob: Blob;
  try {
    blob = await (prepared?.catch(() => prepareCard(el)) ?? prepareCard(el));
  } catch {
    return fail();
  }
  const file = new File([blob], filename, { type: 'image/png' });
  if (!navigator.canShare?.({ files: [file] })) return download(blob, filename);
  try {
    await navigator.share({ files: [file], title: 'ชาติหน้าขอเป็นตัวเอก', text: 'ชาติหน้าฉันได้เกิดเป็นแบบนี้ 😭 มาดูของแกบ้าง' });
  } catch (e) {
    if (e instanceof DOMException && e.name === 'AbortError') return;
    // iOS refuses share() when the tap is "too old"; saving the file still gets the image out.
    if (e instanceof DOMException && e.name === 'NotAllowedError') return download(blob, filename);
    fail();
  }
}
