import { deaths } from '../data/deaths';
import { roles } from '../data/roles';
import { deathArt } from './deaths';
import { roleArt } from './roles';

const files = Object.keys(import.meta.glob('../../public/art/*.webp'));

const check = (id: string, tag: string | undefined) => {
  expect(tag).toContain(`/art/${id}.webp`);
  expect(files).toContain(`../../public/art/${id}.webp`);
};

test.each(roles.map(r => r.id))('role art: %s', id => check(id, roleArt[id]));
test.each(deaths.map(d => d.id))('death art: %s', id => check(id, deathArt[id]));
