// Markup here only ever comes from our own data files, so innerHTML is safe.
export function html(markup: string): HTMLElement {
  const t = document.createElement('template');
  t.innerHTML = markup.trim();
  return t.content.firstElementChild as HTMLElement;
}

// The 2nd tap of a double-tap lands on the screen that replaced the 1st one.
// Ignore taps for a moment after a screen appears so it can't answer for the player.
export const GRACE_MS = 350;

export function mount(root: HTMLElement, el: HTMLElement): HTMLElement {
  el.dataset.mountedAt = String(Date.now());
  root.replaceChildren(el);
  root.scrollTop = 0;
  window.scrollTo?.(0, 0);
  return el;
}

export const reducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

export function onTap(el: HTMLElement, fn: (e: MouseEvent) => void): void {
  el.addEventListener('click', e => {
    const at = Number(el.closest<HTMLElement>('[data-mounted-at]')?.dataset.mountedAt ?? 0);
    if (Date.now() - at < GRACE_MS) return;
    fn(e);
  });
}

export const button = (label: string, cls = 'btn') => {
  const b = document.createElement('button');
  b.type = 'button';
  b.className = cls;
  b.textContent = label;
  return b;
};
