export type Story = {
  id: string;
  title: string;
  description: string;
  fullStory: string;
  /** file:// URI pointing to persistent storage, not a require() asset. */
  cover: string;
  /** file:// URI pointing to persistent storage, not a require() asset. */
  audio: string;
};
