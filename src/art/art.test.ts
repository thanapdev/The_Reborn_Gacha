import { deaths } from '../data/deaths';
import { roles } from '../data/roles';
import { deathArt } from './deaths';
import { roleArt } from './roles';

const check = (svg: string | undefined) => {
  expect(svg).toBeDefined();
  expect(svg!.trimStart().startsWith('<svg')).toBe(true);
  expect(svg).toContain('viewBox="0 0 200 200"');
  expect(svg).not.toContain('href="http');
};

test.each(roles.map(r => r.id))('role art: %s', id => check(roleArt[id]));
test.each(deaths.map(d => d.id))('death art: %s', id => check(deathArt[id]));
