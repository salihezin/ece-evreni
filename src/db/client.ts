import * as SQLite from 'expo-sqlite';

export const db = SQLite.openDatabaseSync('ece-evreni.db');

// Returns true if `table` currently has a column named `column`. Used to
// self-heal tables left over from an earlier/different schema version —
// relevant while the schema is still actively evolving during development.
export const tableHasColumn = async (
  table: string,
  column: string,
): Promise<boolean> => {
  const rows = await db.getAllAsync<{ name: string }>(
    `PRAGMA table_info(${table});`,
  );

  return rows.some(row => row.name === column);
};