import { Image, Pressable, StyleSheet, View, Text } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import { stories } from '../data/stories';

type StoryDetailRouteProp = RouteProp<
  RootStackParamList,
  'StoryDetail'
>;

export default function StoryDetailScreen() {
  const route = useRoute<StoryDetailRouteProp>();
  const navigation = useNavigation();

  const { storyId } = route.params;

  const story = stories.find(
    story => story.id === storyId
  );

  if (!story) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Image
        source={story.cover}
        style={styles.cover}
        resizeMode="contain"
      />

      <Text style={styles.title}>
        {story.title}
      </Text>

      <Pressable style={styles.playButton}>
        <Text style={styles.playButtonText}>
          ▶️ Dinle
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },

  cover: {
    width: '100%',
    height: 350,
    marginBottom: 24,
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 32,
  },

  playButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 24,
  },

  playButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
});