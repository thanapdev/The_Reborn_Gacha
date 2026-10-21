// Sticker art lives in public/art/<id>.webp (600×600, transparent). Sources: pic/ → see report.md.
export const artImg = (id: string) => `<img src="/art/${id}.webp" alt="" width="600" height="600">`;
