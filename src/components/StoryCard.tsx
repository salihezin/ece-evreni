import { Image, Pressable, StyleSheet, Text } from 'react-native';

type Props = {
  title: string;
  cover: any;
  onPress: () => void;
};

export function StoryCard({
  title,
  cover,
  onPress,
}: Props) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <Image
        source={cover}
        style={styles.image}
        resizeMode="cover"
      />

      <Text style={styles.title}>
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 220,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    padding: 12,
  },
});