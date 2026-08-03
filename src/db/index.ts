import { db } from './client';
import { createFamilyTables } from './family';
import { createStoriesTable } from './stories';
import { createComicsTables } from './comics';
import { seedInitialContent } from './seed';

export * from './family';
export * from './stories';
export * from './comics';

export const initializeDatabase = async () => {
  // Needed for comic_pages' ON DELETE CASCADE to actually take effect.
  await db.execAsync('PRAGMA foreign_keys = ON;');

  await createFamilyTables();
  await createStoriesTable();
  await createComicsTables();

  await seedInitialContent();
};
