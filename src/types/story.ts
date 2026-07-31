import { ImageSourcePropType } from "react-native";

export type StoryPage = {
  text?: string;
  image: ImageSourcePropType;
};

export type Story = {
  id: string;
  title: string;
  cover: ImageSourcePropType;
  pages: StoryPage[];
};