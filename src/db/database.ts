import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('ece-evreni.db');

export const initializeDatabase = async () => {
    await db.execAsync(`
    CREATE TABLE IF NOT EXISTS family_members (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      emoji TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS family_photos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      member_id TEXT NOT NULL,
      photo_url TEXT NOT NULL
    );
  `);
};

export const addFamilyMember = async (
    id: string,
    name: string,
    emoji: string,
) => {
    await db.runAsync(
        'INSERT INTO family_members (id, name, emoji) VALUES (?, ?, ?)',
        [id, name, emoji],
    );
};

export const getFamilyMembers = async (): Promise<Array<{ id: string; name: string; emoji: string; }>> => {
    return await db.getAllAsync(
        'SELECT * FROM family_members',
    );
};

export const addPhotoToMember = async (
    memberId: string,
    photoUrl: string,
) => {
    await db.runAsync(
        `
    INSERT INTO family_photos
    (member_id, photo_url)
    VALUES (?, ?)
    `,
        [memberId, photoUrl],
    );
};

export const getPhotosByMember = async (
    memberId: string,
) => {
    return await db.getAllAsync<{
        id: number;
        member_id: string;
        photo_url: string;
    }>(
        `
    SELECT *
    FROM family_photos
    WHERE member_id = ?
    ORDER BY id DESC
    `,
        [memberId],
    );
};

export const getFamilyMemberById = async (
  id: string,
) => {
  return await db.getFirstAsync<{
    id: string;
    name: string;
    emoji: string;
  }>(
    `
      SELECT *
      FROM family_members
      WHERE id = ?
    `,
    [id],
  );
};

export default db;