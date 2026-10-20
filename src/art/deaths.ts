import { C, person, svg } from './kit';

const deadFace = (x: number, y: number) =>
  `<path d="M${x - 12} ${y - 4} l8 8 M${x - 4} ${y - 4} l-8 8 M${x + 4} ${y - 4} l8 8 M${x + 12} ${y - 4} l-8 8" stroke-width="3"/>` +
  `<path d="M${x - 6} ${y + 12} h12" stroke-width="3"/>`;

const sleepyFace = (x: number, y: number) =>
  `<path d="M${x - 12} ${y} q4 4 8 0 M${x + 4} ${y} q4 4 8 0" fill="none" stroke-width="3"/>`;

const zzz = `<text x="140" y="60" font-size="28" font-weight="900" fill="${C.white}" stroke="none" font-family="sans-serif">Z</text>
  <text x="160" y="40" font-size="20" font-weight="900" fill="${C.white}" stroke="none" font-family="sans-serif">z</text>`;

export const deathArt: Record<string, string> = {
  peaceful: svg(`
    <rect x="30" y="120" width="140" height="30" rx="8" fill="${C.white}"/>
    <rect x="30" y="150" width="10" height="24" fill="${C.brown}"/><rect x="160" y="150" width="10" height="24" fill="${C.brown}"/>
    <circle cx="60" cy="110" r="20" fill="${C.skin}"/>
    ${sleepyFace(60, 110)}
    <path d="M44 96 q16 -14 32 0" fill="${C.grey}"/>
    <rect x="80" y="104" width="86" height="22" rx="8" fill="${C.blue}"/>
    <ellipse cx="100" cy="40" rx="22" ry="6" fill="none" stroke="${C.gold}" stroke-width="4"/>`),

  sleep: svg(`
    <rect x="30" y="120" width="140" height="30" rx="8" fill="${C.white}"/>
    <circle cx="60" cy="110" r="20" fill="${C.skin}"/>
    ${sleepyFace(60, 110)}
    <rect x="80" y="104" width="86" height="22" rx="8" fill="${C.purple}"/>
    <circle cx="130" cy="78" r="18" fill="${C.red}"/>
    <path d="M130 66 v12 l8 6" stroke-width="3" fill="none"/>
    <text x="100" y="186" text-anchor="middle" font-size="16" font-weight="900" fill="${C.gold}" stroke="none" font-family="sans-serif">+5 min</text>
    ${zzz}`),

  food: svg(`
    <ellipse cx="100" cy="150" rx="70" ry="18" fill="${C.grey}"/>
    <path d="M40 140 q60 -40 120 0" fill="${C.dark}"/>
    <rect x="86" y="118" width="28" height="10" rx="3" fill="${C.red}"/>
    <path d="M60 40 l40 72 M76 36 l30 74" stroke="${C.brown}" stroke-width="5"/>
    <text x="40" y="80" font-size="22" font-weight="900" fill="${C.gold}" stroke="none" font-family="sans-serif">!</text>
    <text x="150" y="80" font-size="22" font-weight="900" fill="${C.gold}" stroke="none" font-family="sans-serif">!</text>`),

  pigeon: svg(`
    <rect x="130" y="30" width="14" height="150" fill="${C.grey}"/>
    ${person(100, 100, C.blue, { face: deadFace(100, 100) })}
    <path d="M112 88 l10 -6 M112 96 l12 0" stroke="${C.gold}" stroke-width="3"/>
    <g transform="translate(56 46)">
      <ellipse cx="0" cy="0" rx="18" ry="10" fill="${C.grey}"/>
      <path d="M-4 -4 q-12 -18 -20 -6" fill="${C.grey}"/>
      <circle cx="14" cy="-4" r="6" fill="${C.grey}"/>
      <path d="M20 -4 l6 2 l-6 2" fill="${C.gold}" stroke-width="2"/>
    </g>
    <path d="M56 62 q-3 8 0 12 q3 -4 0 -12 Z" fill="${C.white}" stroke-width="2.5"/>`),

  wetfloor: svg(`
    <path d="M40 160 L60 70 L80 160 Z" fill="${C.gold}"/>
    <text x="60" y="130" text-anchor="middle" font-size="26" font-weight="900" fill="${C.navy}" stroke="none" font-family="sans-serif">!</text>
    <ellipse cx="130" cy="170" rx="50" ry="8" fill="${C.blue}" opacity="0.6" stroke="none"/>
    <g transform="rotate(-70 130 120)">${person(130, 110, C.red, { face: deadFace(130, 110) })}</g>
    <path d="M150 70 q10 -12 20 0" fill="none" stroke="${C.white}" stroke-width="3"/>`),

  drinking: svg(`
    ${person(90, 80, C.green, { face: `<circle cx="82" cy="80" r="4" fill="${C.white}"/><circle cx="98" cy="80" r="4" fill="${C.white}"/><circle cx="90" cy="94" r="5" fill="${C.navy}"/>` })}
    <rect x="124" y="90" width="22" height="40" rx="4" fill="${C.blue}" opacity="0.7"/>
    <path d="M100 96 q10 0 14 -6 M106 104 q8 2 12 -2" fill="none" stroke="${C.blue}" stroke-width="3"/>
    <text x="150" y="60" font-size="26" font-weight="900" fill="${C.white}" stroke="none" font-family="sans-serif">...</text>`),

  chain: svg(`
    <path d="M24 170 h152" stroke-width="4"/>
    <path d="M30 168 q8 -10 18 0 Z" fill="${C.white}"/>
    <rect x="60" y="120" width="40" height="8" fill="${C.brown}" transform="rotate(25 80 124)"/>
    <rect x="66" y="128" width="6" height="34" fill="${C.brown}" transform="rotate(25 80 124)"/>
    <circle cx="120" cy="150" r="10" fill="${C.red}"/>
    <rect x="132" y="130" width="14" height="22" fill="${C.gold}" transform="rotate(-30 140 140)"/>
    <rect x="160" y="40" width="16" height="130" fill="${C.grey}"/>
    <g transform="rotate(-20 120 70)">${person(130, 70, C.purple, { face: deadFace(130, 70) })}</g>
    <path d="M40 150 q30 -40 60 -10 q20 -60 50 -70" fill="none" stroke="${C.gold}" stroke-width="3" stroke-dasharray="6 6"/>`),
};
