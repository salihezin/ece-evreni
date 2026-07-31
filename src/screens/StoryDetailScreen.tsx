import { Image, Pressable, StyleSheet, View, Text } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import { stories } from '../data/stories';
import { useState } from 'react';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';

type StoryDetailRouteProp = RouteProp<
  RootStackParamList,
  'StoryDetail'
>;

export default function StoryDetailScreen() {
  const route = useRoute<StoryDetailRouteProp>();

  const [isPlaying, setIsPlaying] = useState(false);

  const { storyId } = route.params;

  const story = stories.find(
    story => story.id === storyId
  );

  if (!story) {
    return null;
  }

  const player = useAudioPlayer(story.audio);
  const status = useAudioPlayerStatus(player);
  const progress =
    status.duration > 0
      ? status.currentTime / status.duration
      : 0;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);

    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      player.pause();
    } else {
      player.play();
    }

    setIsPlaying(!isPlaying);
  };

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

      <Pressable
        style={styles.playButton}
        onPress={handlePlayPause}
      >
        <Text style={styles.playButtonText}>
          {status.didJustFinish ? '▶️ Tekrar Oynat' : isPlaying ? '⏸️ Duraklat' : '▶️ Dinle'}
        </Text>
        <Text style={styles.timeText}>
          {formatTime(status.currentTime)} / {formatTime(status.duration)}
        </Text>

        <View style={styles.progressBarBackground}>
          <View
            style={[
              styles.progressBarFill,
              {
                width: `${status.duration > 0
                    ? (status.currentTime / status.duration) * 100
                    : 0
                  }%`,
              },
            ]}
          />
        </View>
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
  progressBarBackground: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
    marginTop: 12,
  },

  progressBarFill: {
    height: '100%',
    backgroundColor: '#007AFF',
  },

  timeText: {
    color: 'white',
    fontSize: 16,
    marginTop: 8,
    textAlign: 'center',
  },
});