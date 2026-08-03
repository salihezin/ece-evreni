import { useCallback, useState } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FlatList, Pressable, StyleSheet, Image, Text, View, ActivityIndicator } from 'react-native';
import { getComics } from '../db';
import type { Comic } from '../types/comics';
import { EmptyScreen } from '../components/EmptyScreen';

type ComicsScreenNavigationProp =
  NativeStackNavigationProp<RootStackParamList, 'Tabs'>;

export default function ComicsScreen() {
  const navigation = useNavigation<ComicsScreenNavigationProp>();
  const [comics, setComics] = useState<Omit<Comic, 'pages'>[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const load = async () => {
        try {
          const data = await getComics();
          if (isActive) {
            setComics(data);
          }
        } catch (error) {
          console.error('Error loading comics:', error);
        } finally {
          if (isActive) {
            setIsLoading(false);
          }
        }
      };

      load();

      return () => {
        isActive = false;
      };
    }, []),
  );

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (comics.length === 0) {
    return (
      <EmptyScreen
        emoji="📕"
        title="Henüz çizgi roman yok"
        subtitle="Yakında yeni çizgi romanlar eklenecek."
      />
    );
  }

  return (
    <FlatList
      data={comics}
      keyExtractor={item => item.id}
      contentContainerStyle={styles.contentContainer}
      renderItem={({ item }) => (
        <Pressable
          style={styles.card}
          onPress={() => {
            navigation.navigate('ComicsDetail', { comicId: item.id });
          }}
        >
          <Image
            source={{ uri: item.cover }}
            style={styles.image}
            resizeMode="contain"
          />

          <Text style={styles.title}>
            {item.title}
          </Text>
        </Pressable>
      )}
    />

  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    paddingVertical: 32,
    paddingHorizontal: 16,
  },
  card: {
    marginBottom: 8,
    borderRadius: 16,
    padding: 8,
    marginHorizontal: 8,
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
