import { FlatList, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { EmptyScreen } from '../components/EmptyScreen';
import { stories } from '../data/stories';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StoryCard } from '../components/StoryCard';

type StoriesScreenNavigationProp =
  NativeStackNavigationProp<RootStackParamList, 'Tabs'>;

export default function StoriesScreen() {
  const navigation = useNavigation<StoriesScreenNavigationProp>();
  return (
    <FlatList
      data={stories}
      contentContainerStyle={{
        paddingVertical: 32,
        paddingHorizontal: 16,
      }}
      renderItem={({ item }) => (
        <StoryCard
          title={item.title}
          cover={item.cover}
          onPress={() =>
            navigation.navigate('StoryDetail', {
              storyId: item.id,
            })
          }
        />
      )}
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