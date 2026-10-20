import { deathArt } from './art/deaths';
import { roleArt } from './art/roles';
import { cardStats } from './engine';
import { html as el } from './dom';
import type { Death, GameState, Role } from './types';

const stars = (n: number) => '★'.repeat(n) + '☆'.repeat(5 - n);
const footer = () => `<div class="card-footer">ชาติหน้าขอเป็นตัวเอก · ${location.host || 'isekai'}</div>`;

export function renderRoleCard(role: Role, s: GameState, death: Death): HTMLElement {
  const bars = cardStats(s, role)
    .map(c => `<div class="bar"><span class="bar-label">${c.label}</span>` +
      `<span class="bar-track"><span class="bar-fill" style="width:${c.value}%"></span></span>` +
      `<span class="bar-value">${c.display}</span></div>`)
    .join('');
  return el(`
    <article class="card tier-${role.tier}">
      <div class="card-kicker">YOUR DESTINY</div>
      <div class="card-art">${roleArt[role.id]}</div>
      <h2 class="card-title">${role.name}</h2>
      <div class="card-sub">${role.nameEn}</div>
      <div class="card-tier"><span class="tier-badge">${role.tier}</span><span class="card-stars">${stars(role.stars)}</span></div>
      <div class="bars">${bars}</div>
      <div class="card-desc">${role.desc.map(l => `<p>${l}</p>`).join('')}</div>
      <div class="card-cause">สาเหตุการตายชาติก่อน: ${death.cause}</div>
      ${footer()}
    </article>`);
}

export function renderDeathCard(death: Death): HTMLElement {
  return el(`
    <article class="card death rank-${death.rank}">
      <div class="card-kicker died">YOU DIED</div>
      <div class="card-art">${deathArt[death.id]}</div>
      <h2 class="card-title">${death.title}</h2>
      <div class="card-sub">สาเหตุ: ${death.cause}</div>
      <div class="card-tier"><span class="tier-badge">${death.rank}</span><span class="rank-label">Death Rank</span></div>
      <div class="card-desc"><p>“${death.quip}”</p></div>
      ${footer()}
    </article>`);
}
