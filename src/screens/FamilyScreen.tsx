import { View, Text, FlatList, Image, StyleSheet, Pressable } from 'react-native';
import { RootStackParamList } from '../types/navigation';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { getFamilyMembers, getPhotosByMember } from '../db/database';

export default function FamilyScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [members, setMembers] = useState<Array<{ id: string; name: string; emoji: string; photos: Array<{ photo_url: string }> }>>([]);

  const fetchFamilyMembers = async () => {
    const members = await getFamilyMembers();

    const membersWithPhotos = await Promise.all(
      members.map(async member => ({
        ...member,
        photos: await getPhotosByMember(member.id),
      })),
    );

    setMembers(membersWithPhotos);
  };

  useEffect(() => {
    fetchFamilyMembers();
  }, []);

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: '#f0f0f0' }}>
      <Pressable
        onLongPress={() => navigation.navigate('Admin')}
        delayLongPress={3000}
      >
        <Text
          style={{
            fontSize: 28,
            textAlign: 'center',
            marginVertical: 16,
          }}
        >
          👨‍👩‍👧
        </Text>
      </Pressable>
      <FlatList
        data={members}
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
                  source={item.photos && item.photos[0] && item.photos[0].photo_url ? { uri: item.photos[0].photo_url } : require('../../assets/images/family/liya-ece1.jpg')}
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