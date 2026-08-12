import { db } from './client';
import { createFamilyTables } from './family';
import { createStoriesTable } from './stories';
import { createComicsTables } from './comics';
import { seedInitialContent } from './seed';

export * from './family';
export * from './stories';
export * from './comics';

const tableHasColumn = async (table: string, column: string) => {
  const rows = await db.getAllAsync<{ name: string }>(
    `PRAGMA table_info(${table});`,
  );

  return rows.some(row => row.name === column);
};

const runSchemaSelfHeal = async () => {
  // Backfill older installs where these tables existed before created_at
  // was introduced. CREATE TABLE IF NOT EXISTS does not alter old schemas.
  if (!(await tableHasColumn('stories', 'created_at'))) {
    await db.execAsync(
      'ALTER TABLE stories ADD COLUMN created_at INTEGER NOT NULL DEFAULT 0;',
    );
  }

  if (!(await tableHasColumn('comics', 'created_at'))) {
    await db.execAsync(
      'ALTER TABLE comics ADD COLUMN created_at INTEGER NOT NULL DEFAULT 0;',
    );
  }
};

const resetDatabase = async () => {
  await db.execAsync(`
    DROP TABLE IF EXISTS comic_pages;
    DROP TABLE IF EXISTS comics;
    DROP TABLE IF EXISTS stories;
    DROP TABLE IF EXISTS family_photos;
    DROP TABLE IF EXISTS family_members;
  `);
};

const setupDatabase = async () => {
  // Needed for comic_pages' ON DELETE CASCADE to actually take effect.
  await db.execAsync('PRAGMA foreign_keys = ON;');

  await createFamilyTables();
  await createStoriesTable();
  await createComicsTables();
  await runSchemaSelfHeal();

  await seedInitialContent();
};

const isCreatedAtSchemaError = (error: unknown) => {
  if (!(error instanceof Error)) {
    return false;
  }

  return error.message.includes('no such column: created_at');
};

export const initializeDatabase = async () => {
  try {
    await setupDatabase();
  } catch (error) {
    if (!isCreatedAtSchemaError(error)) {
      throw error;
    }

    // Last-resort recovery for broken legacy schemas on device.
    // Safe here because this app's local DB can be re-seeded.
    await resetDatabase();
    await setupDatabase();
  }
};
