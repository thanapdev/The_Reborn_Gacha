export type Stat = 'courage' | 'wisdom' | 'kindness' | 'ambition' | 'chaos' | 'luck' | 'greed' | 'laziness';
export const STATS: Stat[] = ['courage', 'wisdom', 'kindness', 'ambition', 'chaos', 'luck', 'greed', 'laziness'];
export type Stats = Record<Stat, number>;

export interface Choice {
  label: string;
  delta: Partial<Stats>;
  silly?: boolean;
  tag?: string;
  reaction?: string[];
}
export interface Question { id: string; prompt: string; choices: Choice[] }

export interface Outcome { id: string; profile: Partial<Stats>; tagBonus?: Record<string, number> }

export interface Death extends Outcome {
  title: string;
  rank: 'S' | 'A' | 'B' | 'C' | 'D' | 'F';
  script: string[];
  quip: string;
  cause: string;
  deathBonus: Partial<Stats>;
}

export type Tier = 'F' | 'D' | 'C' | 'B' | 'A' | 'S' | 'SECRET';
export interface Role extends Outcome { name: string; nameEn: string; tier: Tier; stars: number; desc: string[] }

export interface GameState { stats: Stats; silly: number; tags: string[] }
export interface CardStat { label: string; value: number; display: string }
