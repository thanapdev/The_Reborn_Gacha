import { roles } from '../data/roles';
import { artImg } from './img';

export const roleArt: Record<string, string> = Object.fromEntries(roles.map(r => [r.id, artImg(r.id)]));
