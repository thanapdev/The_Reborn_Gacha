// @vitest-environment jsdom
import { addToCollection, getCollection, hasPlayed, markPlayed } from './storage';

afterEach(() => {
  vi.restoreAllMocks();
  localStorage.clear();
});

test('collection dedupes ids', () => {
  addToCollection('mage');
  addToCollection('mage');
  addToCollection('hero');
  expect(getCollection()).toEqual(['mage', 'hero']);
});

test('played flag round-trips', () => {
  expect(hasPlayed()).toBe(false);
  markPlayed();
  expect(hasPlayed()).toBe(true);
});

test('storage that throws (private mode) does not break the game', () => {
  vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('denied'); });
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('denied'); });
  expect(getCollection()).toEqual([]);
  expect(() => addToCollection('mage')).not.toThrow();
  expect(hasPlayed()).toBe(false);
  expect(() => markPlayed()).not.toThrow();
});

test('corrupted collection value is ignored', () => {
  localStorage.setItem('isekai.collection.v1', '{oops');
  expect(getCollection()).toEqual([]);
});
