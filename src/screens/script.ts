import { button, html, mount, onTap, reducedMotion } from '../dom';

export interface ScriptProps {
  lines: string[];
  scene?: string;      // extra class: 'death' | 'heaven' | 'reaction'
  finale?: string;     // big closing text, e.g. "YOU DIED"
  next?: string;       // label of the continue button
  skippable?: boolean;
}

const LINE_MS = 900;

/** Plays lines one by one. Tap anywhere to reveal the next line sooner. */
export function renderScript(root: HTMLElement, p: ScriptProps, onDone: () => void): void {
  const screen = mount(root, html(`
    <section class="screen script ${p.scene ?? ''}">
      <div class="lines" aria-live="polite"></div>
      <div class="finale" hidden></div>
      <p class="tap-hint" aria-hidden="true">แตะเพื่อเร่ง</p>
      <div class="actions"></div>
    </section>`));
  const lines = screen.querySelector('.lines')!;
  const finale = screen.querySelector<HTMLElement>('.finale')!;
  const actions = screen.querySelector('.actions')!;
  let shown = 0;
  let timer = 0;
  let finished = false;

  const finish = () => {
    if (finished) return;
    finished = true;
    clearTimeout(timer);
    while (shown < p.lines.length) reveal();
    if (p.finale) { finale.textContent = p.finale; finale.hidden = false; }
    skip?.remove();
    screen.querySelector('.tap-hint')?.remove();
    const next = button(p.next ?? 'ไปต่อ →', 'btn primary');
    next.addEventListener('click', e => e.stopPropagation());
    onTap(next, onDone);
    actions.append(next);
    next.focus({ preventScroll: true });
  };

  const reveal = () => {
    const el = document.createElement('p');
    el.className = 'line';
    el.textContent = p.lines[shown++];
    lines.append(el);
  };

  const step = () => {
    if (finished) return;
    clearTimeout(timer);
    if (shown < p.lines.length) reveal();
    if (shown >= p.lines.length) finish();
    else timer = window.setTimeout(step, LINE_MS);
  };

  const skip = p.skippable ? button('ข้าม ⏭', 'btn ghost skip') : null;
  if (skip) {
    skip.addEventListener('click', e => { e.stopPropagation(); finish(); });
    actions.append(skip);
  }
  screen.addEventListener('click', step);
  if (reducedMotion()) finish();
  else step();
}
