import { Text, ScrollView, StyleSheet, Image, View, Dimensions, Pressable } from 'react-native';

import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import { stories } from '../data/stories';
import { useLayoutEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useWindowDimensions } from 'react-native';

type StoryDetailRouteProp = RouteProp<
  RootStackParamList,
  'StoryDetail'
>;



export default function StoryDetailScreen() {
  const { width, height } = useWindowDimensions();
  const route = useRoute<StoryDetailRouteProp>();
  const navigation = useNavigation();

  const { storyId } = route.params;

  const story = stories.find(
    story => story.id === storyId
  );

  const [currentPage, setCurrentPage] = useState(0);
  const isLandscape = width > height;

  useLayoutEffect(() => {
    navigation.setOptions({
      title: story?.title ?? 'Masal',
    });
  }, [navigation, story]);

  if (!story) {
    return (
      <View style={styles.container}>
        <Text>Masal bulunamadı.</Text>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        isLandscape && styles.landscapeContainer,
      ]}
    >
      <Pressable
        style={isLandscape ? styles.imageContainerLandscape : undefined}
        onPress={() => {
          if (currentPage < story.pages.length - 1) {
            setCurrentPage(p => p + 1);
          }
        }}
      >
        <Image
          source={story.pages[currentPage].image}
          style={{
            width: isLandscape ? width * 0.7 : width - 48,
            height: isLandscape ? height - 100 : height / 2,
          }}
          resizeMode="contain"
        />
      </Pressable>

      <View
        style={
          isLandscape
            ? styles.buttonColumn
            : styles.buttonRow
        }
      >
        {currentPage > 0 && (
          <Pressable
            style={styles.button}
            onPress={() => setCurrentPage(p => p - 1)}
          >
            <Text style={styles.buttonText}>← Önceki</Text>
          </Pressable>
        )}

        {currentPage < story.pages.length - 1 && (
          <Pressable
            style={styles.button}
            onPress={() => setCurrentPage(p => p + 1)}
          >
            <Text style={styles.buttonText}>Sonraki →</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },

  landscapeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  imageContainerLandscape: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  buttonColumn: {
    width: 180,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
  },

  button: {
    padding: 8,
  },

  buttonText: {
    fontSize: 18,
    color: '#007AFF',
  },
});

