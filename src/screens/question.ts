import { button, html, mount, onTap } from '../dom';
import type { Choice, Question } from '../types';

interface Props { question: Question; index: number; total: number; speaker?: string }

export function renderQuestion(root: HTMLElement, p: Props, onDone: (c: Choice) => void): void {
  const screen = mount(root, html(`
    <section class="screen question">
      <div class="progress" aria-label="ความคืบหน้า">
        <span class="progress-text">${p.index + 1} / ${p.total}</span>
        <span class="progress-track"><span class="progress-fill" style="width:${((p.index + 1) / p.total) * 100}%"></span></span>
      </div>
      ${p.speaker ? `<div class="speaker">${p.speaker}</div>` : ''}
      <h2 class="prompt"></h2>
      <div class="choices"></div>
    </section>`));
  screen.querySelector('.prompt')!.textContent = p.question.prompt;
  const list = screen.querySelector('.choices')!;
  let picked = false;
  for (const c of p.question.choices) {
    const b = button(c.label, 'choice');
    onTap(b, () => {
      if (picked) return;
      picked = true;
      b.classList.add('picked');
      list.querySelectorAll('button').forEach(x => (x.disabled = true));
      onDone(c);
    });
    list.append(b);
  }
}
