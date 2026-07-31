import { FlatList, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { EmptyScreen } from '../components/EmptyScreen';
import { stories } from '../data/stories';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type StoriesScreenNavigationProp =
  NativeStackNavigationProp<RootStackParamList, 'Tabs'>;

export default function StoriesScreen() {
  const navigation = useNavigation<StoriesScreenNavigationProp>();
  return (
    <FlatList
      style={styles.container}
      data={stories}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.card}
          onPress={() => {
            navigation.navigate('StoryDetail', { storyId: item.id });
          }}
        >
          <Text>{item.title}</Text>
        </TouchableOpacity>
      )}
      ListEmptyComponent={
        <EmptyScreen
          emoji="📖"
          title="Masallar"
          subtitle="Ece'nin özel hikayeleri burada olacak."
        />
      }
    />
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  container: {
    flex: 1,
    padding: 16,
  },
});