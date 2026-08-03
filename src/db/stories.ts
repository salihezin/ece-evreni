import { db } from './client';
import type { Story } from '../types/story';

type StoryRow = {
  id: string;
  title: string;
  description: string;
  full_story: string;
  cover_path: string;
  audio_path: string;
  created_at: number;
};

const mapRow = (row: StoryRow): Story => ({
  id: row.id,
  title: row.title,
  description: row.description,
  fullStory: row.full_story,
  cover: row.cover_path,
  audio: row.audio_path,
});

export const createStoriesTable = async () => {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS stories (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      full_story TEXT NOT NULL,
      cover_path TEXT NOT NULL,
      audio_path TEXT NOT NULL,
      created_at INTEGER NOT NULL
    );
  `);
};

export const getStories = async (): Promise<Story[]> => {
  const rows = await db.getAllAsync<StoryRow>(
    'SELECT * FROM stories ORDER BY created_at ASC',
  );

  return rows.map(mapRow);
};

export const getStoryById = async (id: string): Promise<Story | null> => {
  const row = await db.getFirstAsync<StoryRow>(
    'SELECT * FROM stories WHERE id = ?',
    [id],
  );

  return row ? mapRow(row) : null;
};

// Also returns the raw cover_path/audio_path — used when deleting a story
// so the caller can remove the associated media files from disk.
export const getStoryRowById = async (
  id: string,
): Promise<StoryRow | null> => {
  return await db.getFirstAsync<StoryRow>(
    'SELECT * FROM stories WHERE id = ?',
    [id],
  );
};

export const addStory = async (story: {
  id: string;
  title: string;
  description: string;
  fullStory: string;
  coverPath: string;
  audioPath: string;
}) => {
  await db.runAsync(
    `
    INSERT INTO stories
    (id, title, description, full_story, cover_path, audio_path, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
    [
      story.id,
      story.title,
      story.description,
      story.fullStory,
      story.coverPath,
      story.audioPath,
      Date.now(),
    ],
  );
};

// Partial update — only provided fields are changed. Used by the Admin
// "edit story" flow (Phase 2). Does not touch previously stored media
// files; the caller is responsible for deleting any files it replaces.
export const updateStory = async (
  id: string,
  fields: Partial<{
    title: string;
    description: string;
    fullStory: string;
    coverPath: string;
    audioPath: string;
  }>,
) => {
  const columns: Record<keyof typeof fields, string> = {
    title: 'title',
    description: 'description',
    fullStory: 'full_story',
    coverPath: 'cover_path',
    audioPath: 'audio_path',
  };

  const entries = Object.entries(fields).filter(
    ([, value]) => value !== undefined,
  );

  if (entries.length === 0) {
    return;
  }

  const setClause = entries
    .map(([key]) => `${columns[key as keyof typeof fields]} = ?`)
    .join(', ');

  const values = entries.map(([, value]) => value);

  await db.runAsync(`UPDATE stories SET ${setClause} WHERE id = ?`, [
    ...values,
    id,
  ]);
};

// Deletes the DB row only. The caller should read cover_path/audio_path
// beforehand (via getStoryRowById) and remove those files separately
// via deleteStoredFile, so this module stays focused on persistence.
export const deleteStory = async (id: string) => {
  await db.runAsync('DELETE FROM stories WHERE id = ?', [id]);
};
