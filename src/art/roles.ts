import { C, person, sparkle, svg, sweat } from './kit';

const worried = (x: number, y: number) =>
  `<path d="M${x - 12} ${y - 6} l7 3 M${x + 12} ${y - 6} l-7 3" stroke-width="3"/>` +
  `<circle cx="${x - 8}" cy="${y + 2}" r="2.5" fill="${C.navy}" stroke="none"/><circle cx="${x + 8}" cy="${y + 2}" r="2.5" fill="${C.navy}" stroke="none"/>` +
  `<path d="M${x - 6} ${y + 13} Q${x} ${y + 8} ${x + 6} ${y + 13}" fill="none" stroke-width="3"/>`;

const smallChicken = (x: number, y: number, s = 1) => `
  <g transform="translate(${x} ${y}) scale(${s})" stroke-width="${4 / s}">
    <ellipse cx="0" cy="0" rx="16" ry="13" fill="${C.white}"/>
    <circle cx="10" cy="-12" r="8" fill="${C.white}"/>
    <path d="M7 -20 q2 -7 5 -1 q3 -6 5 1 Z" fill="${C.red}"/>
    <path d="M17 -13 l7 2 l-7 3 Z" fill="${C.gold}"/>
    <circle cx="12" cy="-13" r="1.6" fill="${C.navy}" stroke="none"/>
    <path d="M-12 -2 q8 8 14 0" fill="none"/>
    <path d="M-4 13 v7 M4 13 v7"/>
  </g>`;

const castle = (fill = C.dark) => `
  <path d="M30 170 V95 h14 v-12 h12 v12 h12 v-12 h12 v12 h40 v-12 h12 v12 h12 v-12 h12 v12 h14 V170 Z" fill="${fill}"/>
  <path d="M88 170 v-30 a12 12 0 0 1 24 0 v30" fill="${C.navy}"/>`;

export const roleArt: Record<string, string> = {
  villager: svg(`
    <path d="M30 120 L70 85 L110 120 Z" fill="${C.red}"/>
    <rect x="38" y="120" width="64" height="44" fill="${C.brown}"/>
    <rect x="62" y="138" width="16" height="26" fill="${C.navy}"/>
    ${person(140, 92, C.green)}
    ${smallChicken(60, 178, 0.7)}${smallChicken(100, 180, 0.7)}${smallChicken(170, 178, 0.7)}`),

  farmer: svg(`
    <rect x="20" y="150" width="160" height="30" rx="6" fill="${C.brown}"/>
    <path d="M40 150 v-30 M40 128 l-8 -8 M40 128 l8 -8 M160 150 v-30 M160 128 l-8 -8 M160 128 l8 -8" stroke="${C.green}" stroke-width="5"/>
    ${person(100, 80, C.blue, { hair: `<path d="M68 72 Q100 30 132 72 Z" fill="${C.gold}"/>` })}
    <path d="M128 120 l30 -50 M150 72 q14 -4 18 8" fill="none" stroke="${C.grey}" stroke-width="5"/>`),

  merchant: svg(`
    <rect x="25" y="130" width="150" height="40" fill="${C.brown}"/>
    <path d="M25 130 L45 100 H155 L175 130 Z" fill="${C.red}"/>
    ${person(100, 70, C.purple)}
    <circle cx="150" cy="150" r="22" fill="${C.gold}"/>
    <text x="150" y="157" text-anchor="middle" font-size="20" font-weight="900" fill="${C.navy}" stroke="none" font-family="sans-serif">-3%</text>`),

  alchemist: svg(`
    ${person(80, 70, C.green)}
    <path d="M120 100 v20 l-18 40 h56 l-18 -40 v-20 Z" fill="${C.purple}"/>
    <path d="M110 70 l-10 -16 M135 64 l4 -20 M156 76 l14 -12 M128 82 l0 -4" stroke="${C.gold}" stroke-width="5"/>
    <circle cx="130" cy="80" r="14" fill="${C.gold}" stroke="${C.red}"/>
    <text x="130" y="86" text-anchor="middle" font-size="16" font-weight="900" fill="${C.red}" stroke="none" font-family="sans-serif">!</text>`),

  adventurer: svg(`
    ${person(90, 76, C.blue)}
    <path d="M118 140 L150 60" stroke="${C.brown}" stroke-width="8"/>
    <path d="M112 128 l18 8" stroke="${C.brown}" stroke-width="6"/>
    <ellipse cx="160" cy="168" rx="20" ry="13" fill="${C.green}"/>
    <circle cx="154" cy="165" r="2.5" fill="${C.navy}" stroke="none"/><circle cx="166" cy="165" r="2.5" fill="${C.navy}" stroke="none"/>
    <text x="50" y="40" font-size="18" font-weight="900" fill="${C.gold}" stroke="none" font-family="sans-serif">LV.1</text>`),

  thief: svg(`
    <g opacity="0.45">${person(100, 76, C.dark)}</g>
    <rect x="76" y="68" width="48" height="12" rx="4" fill="${C.navy}" opacity="0.6"/>
    <path d="M130 130 q20 -10 30 10 q-10 20 -30 10 Z" fill="${C.brown}"/>
    <text x="146" y="148" text-anchor="middle" font-size="14" font-weight="900" fill="${C.gold}" stroke="none" font-family="sans-serif">$</text>
    <path d="M40 60 h20 M30 80 h16 M150 50 h20" stroke="${C.grey}" stroke-width="3" opacity="0.6"/>`),

  mage: svg(`
    ${person(90, 86, C.purple, { hair: `<path d="M62 74 L90 14 L118 74 Z" fill="${C.purple}"/>`, face: worried(90, 86) })}
    <rect x="128" y="112" width="22" height="44" rx="6" fill="${C.blue}" opacity="0.8"/>
    <rect x="132" y="102" width="14" height="12" fill="${C.white}"/>
    ${sweat(124, 72)}
    <circle cx="40" cy="60" r="14" fill="${C.red}" stroke="${C.gold}"/>`),

  elf: svg(`
    ${person(100, 80, C.green, { hair: `<path d="M76 70 l-16 -12 l10 18 M124 70 l16 -12 l-10 18" fill="${C.skin}"/><path d="M78 70 Q100 40 122 70" fill="${C.gold}"/>` })}
    <text x="150" y="60" font-size="40" font-weight="900" fill="${C.gold}" stroke="none" font-family="sans-serif">?</text>
    <text x="34" y="70" font-size="28" font-weight="900" fill="${C.gold}" stroke="none" font-family="sans-serif">?</text>
    <rect x="128" y="120" width="44" height="30" rx="3" fill="${C.white}" transform="rotate(15 150 135)"/>
    <path d="M136 130 l10 6 l8 -8 l10 6" fill="none" stroke="${C.red}" stroke-width="3" transform="rotate(15 150 135)"/>`),

  dragonTamer: svg(`
    <path d="M100 40 q60 0 70 60 q-10 40 -50 40 l10 30 l-30 -20 q-40 -10 -40 -60 q0 -50 40 -50 Z" fill="${C.red}"/>
    <circle cx="130" cy="80" r="6" fill="${C.gold}"/>
    <path d="M150 104 l14 4 M150 114 l12 8" stroke-width="3"/>
    ${person(60, 120, C.blue, { face: worried(60, 120) })}
    ${sweat(84, 104)}${sweat(36, 104)}`),

  hero: svg(`
    ${person(100, 82, C.blue, { hair: `<path d="M76 72 Q100 46 124 72 L120 62 L110 70 L100 58 L90 70 L80 62 Z" fill="${C.gold}"/>` })}
    <path d="M140 150 L160 40" stroke="${C.white}" stroke-width="8"/>
    <path d="M132 130 l22 8" stroke="${C.gold}" stroke-width="6"/>
    ${sparkle(160, 36, 10)}
    <rect x="30" y="140" width="40" height="28" rx="4" fill="${C.white}"/>
    <text x="50" y="160" text-anchor="middle" font-size="13" font-weight="900" fill="${C.red}" stroke="none" font-family="sans-serif">0 G</text>`),

  king: svg(`
    ${castle()}
    ${person(100, 60, C.red, { hair: `<path d="M80 44 l4 -18 l8 10 l8 -14 l8 14 l8 -10 l4 18 Z" fill="${C.gold}"/>`, face: worried(100, 60) })}
    <path d="M40 150 l8 -6 M54 160 l6 -8 M150 150 l-8 -6 M140 162 l-6 -8" stroke="${C.white}" stroke-width="3"/>
    <text x="40" y="140" font-size="16" fill="${C.white}" stroke="none" font-family="sans-serif">!?</text>
    <text x="146" y="140" font-size="16" fill="${C.white}" stroke="none" font-family="sans-serif">!!</text>`),

  demonLord: svg(`
    ${castle('#3b1d4a')}
    ${person(100, 66, C.navy, { hair: `<path d="M80 50 l-10 -22 l18 14 M120 50 l10 -22 l-18 14" fill="${C.purple}"/>` })}
    <rect x="80" y="104" width="40" height="30" rx="12" fill="${C.white}"/>
    <path d="M60 30 h12 l-12 12 h12 M140 24 h8 l-8 8 h8" stroke="${C.gold}" stroke-width="3" fill="none"/>`, '#2a1238'),

  chicken: svg(`
    ${smallChicken(100, 118, 3)}
    <path d="M110 56 l6 -18 l10 12 l10 -14 l8 14 l10 -10 l2 18 Z" fill="${C.gold}"/>
    ${sparkle(40, 50)}${sparkle(162, 150)}${sparkle(48, 160, 6)}
    <ellipse cx="60" cy="168" rx="10" ry="13" fill="${C.white}"/>`),
};
