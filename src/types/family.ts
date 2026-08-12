import type { ImageSourcePropType } from 'react-native';

export type FamilyMember = {
  id: string;
  name: string;
  emoji: string;
  photos: ImageSourcePropType[];
};
