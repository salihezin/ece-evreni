import { View, Text, FlatList, Image, StyleSheet, Pressable } from 'react-native';
import { eceFamilyMembers as familyMembers } from '../data/family/ece';
import { RootStackParamList } from '../types/navigation';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

export default function FamilyScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: '#f0f0f0' }}>
      <FlatList
        data={familyMembers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          return (
            <Pressable
              style={styles.card}
              onPress={() =>
                navigation.navigate('FamilyDetail', {
                  familyMemberId: item.id,
                })
              }
            >
              <View style={styles.card}>
                <Image
                  source={item.photos[0]}
                  style={styles.image}
                  resizeMode='stretch' />
                <Text style={styles.name}>
                  {item.emoji} {item.name}
                </Text>
              </View>
            </Pressable>

          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 12,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 220,
  },
  name: {
    fontSize: 22,
    padding: 16,
    textAlign: 'center',
    fontWeight: '600',
  },
});