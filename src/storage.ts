// localStorage can throw (Safari private mode, blocked site data). The game must keep working without it.
const COLLECTION = 'isekai.collection.v1';
const PLAYED = 'isekai.played.v1';

function read(key: string): string | null {
  try { return localStorage.getItem(key); } catch { return null; }
}

function write(key: string, value: string): void {
  try { localStorage.setItem(key, value); } catch { /* not persisted, that's fine */ }
}

export function getCollection(): string[] {
  try {
    const v = JSON.parse(read(COLLECTION) ?? '[]');
    return Array.isArray(v) ? v.filter(x => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

export function addToCollection(id: string): void {
  const ids = getCollection();
  if (!ids.includes(id)) write(COLLECTION, JSON.stringify([...ids, id]));
}

export const hasPlayed = () => read(PLAYED) === '1';
export const markPlayed = () => write(PLAYED, '1');
