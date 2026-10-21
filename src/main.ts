import './style.css';
import { renderDeathCard, renderRoleCard } from './card';
import { deaths } from './data/deaths';
import { goddessIntro } from './data/goddess';
import { fullBase, goddessQuestions, lifeBase, lifeQuestions } from './data/questions';
import { roles } from './data/roles';
import { applyChoice, newState, pickDeath, pickRole } from './engine';
import { renderCalculating } from './screens/calculating';
import { renderCollection } from './screens/collection';
import { renderLanding } from './screens/landing';
import { showNotice } from './screens/notice';
import { renderQuestion } from './screens/question';
import { renderResult } from './screens/result';
import { renderScript, type ScriptProps } from './screens/script';
import { addToCollection, hasPlayed, markPlayed } from './storage';
import type { Death, GameState, Question } from './types';

const root = document.getElementById('app')!;
const setScene = (scene: 'night' | 'death' | 'heaven') => { document.body.dataset.scene = scene; };

const play = (lines: string[], opts: Omit<ScriptProps, 'lines'> = {}) =>
  new Promise<void>(res => renderScript(root, { lines, skippable: hasPlayed(), ...opts }, res));

async function ask(qs: Question[], s: GameState, speaker?: string): Promise<GameState> {
  for (const [i, q] of qs.entries()) {
    const choice = await new Promise<Question['choices'][number]>(res =>
      renderQuestion(root, { question: q, index: i, total: qs.length, speaker }, res));
    s = applyChoice(s, choice);
    if (choice.reaction) {
      // "แน่ใจนะ?" → [Yes] → "...โอเค"
      await play(choice.reaction.slice(0, -1), { scene: 'reaction', next: 'Yes' });
      await play(choice.reaction.slice(-1), { scene: 'reaction' });
    }
  }
  return s;
}

function landing() {
  setScene('night');
  renderLanding(root, run, () => collection());
}

function collection() {
  setScene('night');
  renderCollection(root, landing);
}

async function run() {
  // Stage 1: current life → death
  setScene('night');
  let s = await ask(lifeQuestions, newState());
  await play(['ทุกอย่างกำลังจะเปลี่ยนไป', 'แต่ก่อนอื่น...', 'คุณต้องตายก่อน']);
  const picked = pickDeath(s, deaths, Math.random, lifeBase);
  const death: Death = picked.death;
  s = picked.state;
  setScene('death');
  await play(death.script, { scene: 'death', finale: 'YOU DIED', next: 'ดูใบมรณบัตร →' });
  await new Promise<void>(res => renderResult(root, [renderDeathCard(death)], null,
    [{ label: 'ไปพบเทพธิดา →', cls: 'btn primary', onClick: res }], 'ใบมรณบัตรของคุณ'));

  // Stage 2: goddess → rebirth
  setScene('heaven');
  await play(goddessIntro, { scene: 'heaven', next: 'รับบัตรคิว →' });
  s = await ask(goddessQuestions, s, '👼 เทพธิดา (หมดไฟ)');
  setScene('night');
  await new Promise<void>(res => renderCalculating(root, res));
  const role = pickRole(s, roles, Math.random, fullBase);
  addToCollection(role.id);
  markPlayed();
  await new Promise<void>(res => renderResult(root, [renderRoleCard(role, s, death)], null,
    [{ label: 'ดูใบสรุปชะตา →', cls: 'btn primary', onClick: res }],
    role.id === 'chicken' ? '???' : `Congratulations. You are ${role.nameEn.replace(/^THE /, 'the ').toLowerCase()}.`));

  // Summary: both cards, the only place to share
  renderResult(root, [renderDeathCard(death), renderRoleCard(role, s, death)],
    [`death-${death.id}.png`, `destiny-${role.id}.png`], [
      { label: '🔄 เกิดใหม่อีกครั้ง', onClick: run },
      { label: '📜 Collection', cls: 'btn ghost', onClick: collection },
    ], 'ใบสรุปชะตาของคุณ');
}

landing();
showNotice();
