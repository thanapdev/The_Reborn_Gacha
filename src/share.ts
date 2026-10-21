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
 * Renders cards to PNG. Call it when the screen opens, not inside the tap:
 * iOS only lets navigator.share() run shortly after the tap, and the first render is slow.
 * Each card's first render is thrown away because Safari draws it before the embedded fonts decode.
 */
export async function prepareCards(els: HTMLElement[]): Promise<Blob[]> {
  await document.fonts.ready;
  // A card image that hasn't loaded yet would be missing from the export.
  await Promise.all(els.flatMap(el => [...el.querySelectorAll('img')].map(i => i.decode().catch(() => {}))));
  const blobs: Blob[] = [];
  for (const el of els) {
    await toBlob(el, { pixelRatio: PIXEL_RATIO });
    const blob = await toBlob(el, { pixelRatio: PIXEL_RATIO });
    if (!blob) throw new Error('empty image');
    blobs.push(blob);
  }
  return blobs;
}

export async function shareCards(els: HTMLElement[], filenames: string[], prepared?: Promise<Blob[]>): Promise<void> {
  const fail = () => toast('บันทึกรูปไม่สำเร็จ ลองแคปหน้าจอแทนนะ');
  let blobs: Blob[];
  try {
    blobs = await (prepared?.catch(() => prepareCards(els)) ?? prepareCards(els));
  } catch {
    return fail();
  }
  const downloadAll = () => blobs.forEach((b, i) => download(b, filenames[i]));
  const files = blobs.map((b, i) => new File([b], filenames[i], { type: 'image/png' }));
  if (!navigator.canShare?.({ files })) return downloadAll();
  try {
    await navigator.share({ files, title: 'ชาติหน้าขอเป็นตัวเอก', text: 'ชาติก่อนตายแบบนี้ ชาติใหม่ได้เกิดเป็นแบบนี้ 😭 มาดูของแกบ้าง' });
  } catch (e) {
    if (e instanceof DOMException && e.name === 'AbortError') return;
    // iOS refuses share() when the tap is "too old"; saving the files still gets the images out.
    if (e instanceof DOMException && e.name === 'NotAllowedError') return downloadAll();
    fail();
  }
}
