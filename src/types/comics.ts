export type ComicPage = {
  id: number;
  text?: string | null;
  /** file:// URI pointing to persistent storage, not a require() asset. */
  image: string;
};

export type Comic = {
  id: string;
  title: string;
  /** file:// URI pointing to persistent storage, not a require() asset. */
  cover: string;
  pages: ComicPage[];
};
