import { ImageSourcePropType } from "react-native";

export type ComicPage = {
  text?: string;
  image: ImageSourcePropType;
};

export type Comic = {
    id: string;
    title: string;
    cover: ImageSourcePropType;
    pages: ComicPage[];
}