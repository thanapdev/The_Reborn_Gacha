import { deaths } from '../data/deaths';
import { artImg } from './img';

export const deathArt: Record<string, string> = Object.fromEntries(deaths.map(d => [d.id, artImg(d.id)]));
