import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { View, Text, FlatList, Image, StyleSheet, Pressable } from 'react-native';
import { stories } from '../data/stories';

type StoriesScreenNavigationProp =
  NativeStackNavigationProp<RootStackParamList, 'Tabs'>;

const StoryTitleAndDescription = ({ title, description }: { title: string; description: string }) => (
  <View style={styles.textContainer}>
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.description}>{description}</Text>
  </View>
);

const StoryImage = ({ cover }: { cover: any }) => (
  <Image source={cover} style={styles.image} resizeMode="contain" />
);

export default function StoriesScreen() {
  const navigation = useNavigation<StoriesScreenNavigationProp>();
  return (
    <>
      <FlatList
        data={stories}
        contentContainerStyle={{ paddingVertical: 32, paddingHorizontal: 16 }}
        renderItem={({ item, index }) => (
          <Pressable
            onPress={() => navigation.navigate('StoryDetail', { storyId: item.id })}>
            <View style={index % 2 === 0 ? styles.cardEven : styles.cardOdd}>
              {index % 2 === 0 ? (
                <View style={styles.containerCard}>
                  <StoryTitleAndDescription title={item.title} description={item.description} />
                  <StoryImage cover={item.cover} />
                </View>
              ) : (
                <View style={styles.containerCard}>
                  <StoryImage cover={item.cover} />
                  <StoryTitleAndDescription title={item.title} description={item.description} />
                </View>
              )}
            </View>
          </Pressable>
        )}
      />
    </>
  );
}

const styles = StyleSheet.create({
  containerCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardEven: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  cardOdd: {
    flexDirection: 'row-reverse',
    marginBottom: 16,
  },
  textContainer: {
    flex: 1,
    padding: 16,
  },
  image: {
    width: '30%',
    height: 150,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
  },
});
