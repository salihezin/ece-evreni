import { db, tableHasColumn } from './client';
import type { Comic, ComicPage } from '../types/comics';

type ComicRow = {
  id: string;
  title: string;
  cover_path: string;
  created_at: number;
};

type ComicPageRow = {
  id: number;
  comic_id: string;
  page_order: number;
  text: string | null;
  image_path: string;
};

const mapPageRow = (row: ComicPageRow): ComicPage => ({
  id: row.id,
  text: row.text,
  image: row.image_path,
});

const CREATE_COMICS_SQL = `
  CREATE TABLE IF NOT EXISTS comics (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    cover_path TEXT NOT NULL,
    created_at INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS comic_pages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    comic_id TEXT NOT NULL,
    page_order INTEGER NOT NULL,
    text TEXT,
    image_path TEXT NOT NULL,
    FOREIGN KEY (comic_id) REFERENCES comics(id) ON DELETE CASCADE
  );
`;

export const createComicsTables = async () => {
  await db.execAsync(CREATE_COMICS_SQL);

  // Same self-healing as stories: drop and recreate if a pre-existing
  // table doesn't match the current schema. Safe — comic content is
  // always reseeded from bundled assets on first run.
  const comicsOk = await tableHasColumn('comics', 'created_at');
  const pagesOk = await tableHasColumn('comic_pages', 'page_order');

  if (!comicsOk || !pagesOk) {
    await db.execAsync('DROP TABLE IF EXISTS comic_pages;');
    await db.execAsync('DROP TABLE IF EXISTS comics;');
    await db.execAsync(CREATE_COMICS_SQL);
  }
};

export const getComics = async (): Promise<Omit<Comic, 'pages'>[]> => {
  const rows = await db.getAllAsync<ComicRow>(
    'SELECT * FROM comics ORDER BY created_at ASC',
  );

  return rows.map(row => ({
    id: row.id,
    title: row.title,
    cover: row.cover_path,
  }));
};

const getComicRowById = async (id: string): Promise<ComicRow | null> => {
  return await db.getFirstAsync<ComicRow>('SELECT * FROM comics WHERE id = ?', [id]);
};

export const getComicPageRows = async (comicId: string): Promise<ComicPageRow[]> => {
  return await db.getAllAsync<ComicPageRow>(
    'SELECT * FROM comic_pages WHERE comic_id = ? ORDER BY page_order ASC',
    [comicId],
  );
};

export const getComicWithPages = async (id: string): Promise<Comic | null> => {
  const row = await getComicRowById(id);

  if (!row) {
    return null;
  }

  const pageRows = await getComicPageRows(id);

  return {
    id: row.id,
    title: row.title,
    cover: row.cover_path,
    pages: pageRows.map(mapPageRow),
  };
};

export const addComic = async (comic: {
  id: string;
  title: string;
  coverPath: string;
}) => {
  await db.runAsync(
    `
    INSERT INTO comics (id, title, cover_path, created_at)
    VALUES (?, ?, ?, ?)
    `,
    [comic.id, comic.title, comic.coverPath, Date.now()],
  );
};

export const addComicPage = async (page: {
  comicId: string;
  pageOrder: number;
  text?: string;
  imagePath: string;
}) => {
  await db.runAsync(
    `
    INSERT INTO comic_pages (comic_id, page_order, text, image_path)
    VALUES (?, ?, ?, ?)
    `,
    [page.comicId, page.pageOrder, page.text ?? null, page.imagePath],
  );
};

// Partial update for a comic's own fields (title/cover). Page content is
// managed separately via addComicPage/updateComicPage/deleteComicPage.
export const updateComic = async (
  id: string,
  fields: Partial<{ title: string; coverPath: string }>,
) => {
  const columns: Record<keyof typeof fields, string> = {
    title: 'title',
    coverPath: 'cover_path',
  };

  const entries = Object.entries(fields).filter(([, value]) => value !== undefined);

  if (entries.length === 0) {
    return;
  }

  const setClause = entries
    .map(([key]) => `${columns[key as keyof typeof fields]} = ?`)
    .join(', ');

  const values = entries.map(([, value]) => value);

  await db.runAsync(`UPDATE comics SET ${setClause} WHERE id = ?`, [...values, id]);
};

export const updateComicPage = async (
  pageId: number,
  fields: Partial<{ text: string | null; imagePath: string }>,
) => {
  const columns: Record<keyof typeof fields, string> = {
    text: 'text',
    imagePath: 'image_path',
  };

  const entries = Object.entries(fields).filter(([, value]) => value !== undefined);

  if (entries.length === 0) {
    return;
  }

  const setClause = entries
    .map(([key]) => `${columns[key as keyof typeof fields]} = ?`)
    .join(', ');

  const values = entries.map(([, value]) => value);

  await db.runAsync(`UPDATE comic_pages SET ${setClause} WHERE id = ?`, [
    ...values,
    pageId,
  ]);
};

export const deleteComicPage = async (pageId: number) => {
  await db.runAsync('DELETE FROM comic_pages WHERE id = ?', [pageId]);
};

// Reassigns page_order for a comic's pages to match the given order of
// page ids. Used by the Admin page-reordering UI (Phase 2).
export const reorderComicPages = async (comicId: string, orderedPageIds: number[]) => {
  await db.withTransactionAsync(async () => {
    for (let index = 0; index < orderedPageIds.length; index++) {
      await db.runAsync(
        'UPDATE comic_pages SET page_order = ? WHERE id = ? AND comic_id = ?',
        [index, orderedPageIds[index], comicId],
      );
    }
  });
};

// Deletes the comic row. comic_pages rows are removed automatically via
// ON DELETE CASCADE (foreign keys are enabled in initializeDatabase).
// Image files on disk are NOT deleted here — the caller should fetch
// getComicWithPages(id) first and clean up files via deleteStoredFile.
export const deleteComic = async (id: string) => {
  await db.runAsync('DELETE FROM comics WHERE id = ?', [id]);
};
