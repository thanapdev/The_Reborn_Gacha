// Shared palette and tiny drawing helpers for the 200×200 card illustrations.
// No ids/gradients: several SVGs can sit on one page (collection grid) without clashing.
export const C = {
  navy: '#0b0f2a',
  disc: '#1a2150',
  gold: '#e8c26a',
  skin: '#f2c9a0',
  red: '#e05252',
  green: '#5fb36b',
  purple: '#8b5cf6',
  blue: '#4f8fe6',
  white: '#f5f1e6',
  grey: '#8a8fa8',
  brown: '#8b5a2b',
  dark: '#2a2f4a',
};

export const svg = (body: string, bg = C.disc) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" role="img">` +
  `<circle cx="100" cy="100" r="96" fill="${bg}"/>` +
  `<g stroke="${C.navy}" stroke-width="4" stroke-linejoin="round" stroke-linecap="round">${body}</g></svg>`;

/** Simple chibi figure: head centered at (x, y), torso below it. */
export const person = (x: number, y: number, body: string, opts: { face?: string; hair?: string } = {}) => `
  <path d="M${x - 24} ${y + 70} Q${x - 24} ${y + 24} ${x} ${y + 24} Q${x + 24} ${y + 24} ${x + 24} ${y + 70} Z" fill="${body}"/>
  <circle cx="${x}" cy="${y}" r="22" fill="${C.skin}"/>
  ${opts.hair ?? ''}
  ${opts.face ?? `<circle cx="${x - 8}" cy="${y}" r="2.5" fill="${C.navy}" stroke="none"/><circle cx="${x + 8}" cy="${y}" r="2.5" fill="${C.navy}" stroke="none"/><path d="M${x - 6} ${y + 9} Q${x} ${y + 13} ${x + 6} ${y + 9}" fill="none" stroke-width="3"/>`}
`;

export const sweat = (x: number, y: number) =>
  `<path d="M${x} ${y} q-6 10 0 14 q6 -4 0 -14 Z" fill="${C.blue}" stroke-width="2.5"/>`;

export const sparkle = (x: number, y: number, s = 8) =>
  `<path d="M${x} ${y - s} L${x + s / 3} ${y - s / 3} L${x + s} ${y} L${x + s / 3} ${y + s / 3} L${x} ${y + s} L${x - s / 3} ${y + s / 3} L${x - s} ${y} L${x - s / 3} ${y - s / 3} Z" fill="${C.gold}" stroke="none"/>`;
