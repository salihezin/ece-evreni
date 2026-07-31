import { ImageSourcePropType } from "react-native";

export type Story = {
  id: string;
  title: string;
  description: string;
  fullStory: string;
  cover: ImageSourcePropType;
  audio: string;
};