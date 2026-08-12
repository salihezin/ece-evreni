import {
  Image,
  Pressable,
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
} from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import { getStoryById } from '../db';
import type { Story } from '../types/story';
import { useCallback, useState } from 'react';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { EmptyScreen } from '../components/EmptyScreen';
import { useFocusAsyncData } from '../hooks/useFocusAsyncData';

type StoryDetailRouteProp = RouteProp<RootStackParamList, 'StoryDetail'>;

export default function StoryDetailScreen() {
  const route = useRoute<StoryDetailRouteProp>();
  const { storyId } = route.params;

  const loadStory = useCallback(() => getStoryById(storyId), [storyId]);
  const { data: story, isLoading } = useFocusAsyncData<Story | null>(loadStory, null);

  const [isPlaying, setIsPlaying] = useState(false);

  // Called unconditionally (with a null source while loading) so the
  // number of hooks stays constant across renders — required by the
  // rules of hooks now that `story` arrives asynchronously.
  const player = useAudioPlayer(story?.audio ?? null);
  const status = useAudioPlayerStatus(player);

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

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!story) {
    return (
      <EmptyScreen
        emoji="📖"
        title="Masal bulunamadı"
        subtitle="Bu masal artık mevcut değil."
      />
    );
  }

  return (
    <View style={styles.container}>
      <Image source={{ uri: story.cover }} style={styles.cover} resizeMode="contain" />

      <Text style={styles.title}>{story.title}</Text>

      <Pressable style={styles.playButton} onPress={handlePlayPause}>
        <Text style={styles.playButtonText}>
          {status.didJustFinish
            ? '▶️ Tekrar Oynat'
            : isPlaying
              ? '⏸️ Duraklat'
              : '▶️ Dinle'}
        </Text>
        <Text style={styles.timeText}>
          {formatTime(status.currentTime)} / {formatTime(status.duration)}
        </Text>

        <View style={styles.progressBarBackground}>
          <View
            style={[
              styles.progressBarFill,
              {
                width: `${
                  status.duration > 0 ? (status.currentTime / status.duration) * 100 : 0
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
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

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
