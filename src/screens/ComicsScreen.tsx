import { comics } from '../data/comics';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FlatList, Pressable, StyleSheet, Image, Text } from 'react-native';

type ComicsScreenNavigationProp =
  NativeStackNavigationProp<RootStackParamList, 'Tabs'>;

export default function ComicsScreen() {
  const navigation = useNavigation<ComicsScreenNavigationProp>();
  return (
    <FlatList
      data={comics}
      contentContainerStyle={styles.contentContainer}
      renderItem={({ item }) => (
        <Pressable
          style={styles.card}
          onPress={() => {
            navigation.navigate('ComicsDetail', { comicId: item.id });
          }}
        >
          <Image
            source={item.cover}
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