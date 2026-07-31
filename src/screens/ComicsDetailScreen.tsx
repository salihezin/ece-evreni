import { Image, Pressable, StyleSheet, View, Text } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import { comics as comicsData } from '../data/comics';
import { useLayoutEffect, useState } from 'react';
import { useWindowDimensions } from 'react-native';

type ComicsDetailRouteProp = RouteProp<
  RootStackParamList,
  'ComicsDetail'
>;

export default function ComicsDetailScreen() {
  const { width, height } = useWindowDimensions();

  const route = useRoute<ComicsDetailRouteProp>();
  const navigation = useNavigation();

  const { comicId } = route.params;

  const comics = comicsData.find(
    comics => comics.id === comicId
  );

  const [currentPage, setCurrentPage] = useState(0);
  const [isFinished, setIsFinished] = useState(false);


  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  if (!comics) {
    return null;
  }

  const goPrevious = () => {
    setCurrentPage(page => Math.max(0, page - 1));
  };

  const goNext = () => {
    if (currentPage >= comics.pages.length - 1) {
      setIsFinished(true);
      return;
    }

    setCurrentPage(page => page + 1);
  };

  if (isFinished) {
    return (
      <Pressable
        style={styles.finishedContainer}
        onPress={() => {
          setCurrentPage(0);
          setIsFinished(false);
        }}
      >
        <>
          <Text style={styles.finishedEmoji}>📖✨</Text>

          <Text style={styles.finishedTitle}>
            Bu masal da burada bitmişşşş...
          </Text>

          <Text style={styles.finishedText}>
            Ama merak etme 😊
          </Text>

          <Text style={styles.finishedText}>
            Tekrar okumak için ekrana dokunabilirsin.
          </Text>
        </>
      </Pressable>
    );
  }

  return (
    <View style={styles.container}>
      <Image
        source={comics.pages[currentPage].image}
        style={{
          width,
          height,
        }}
        resizeMode="contain"
      />

      <Pressable
        style={styles.leftZone}
        onPress={goPrevious}
      />

      <Pressable
        style={styles.rightZone}
        onPress={goNext}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },

  leftZone: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '50%',
  },

  rightZone: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: '50%',
  },

  finishedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#FFF8E7',
  },

  finishedEmoji: {
    fontSize: 72,
    marginBottom: 24,
  },

  finishedTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
  },

  finishedText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 8,
  },
});