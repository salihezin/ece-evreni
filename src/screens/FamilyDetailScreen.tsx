import { useLayoutEffect, useState } from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';

import { RootStackParamList } from '../types/navigation';
import { eceFamilyMembers as familyMembers } from '../data/family/ece';

type FamilyDetailRouteProp = RouteProp<
  RootStackParamList,
  'FamilyDetail'
>;

export default function FamilyDetailScreen() {
  const route = useRoute<FamilyDetailRouteProp>();
  const navigation = useNavigation();

  const { familyMemberId } = route.params;

  const member = familyMembers.find(
    item => item.id === familyMemberId
  );

  const [currentPhoto, setCurrentPhoto] = useState(0);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: member?.name ?? 'Aile',
    });
  }, [navigation, member]);

  if (!member) {
    return (
      <View style={styles.center}>
        <Text>Kişi bulunamadı.</Text>
      </View>
    );
  }

  return (
    <>
      <Pressable
        style={{ flex: 1 }}
        onPress={() => {
          if (currentPhoto < member.photos.length - 1) {
            setCurrentPhoto(p => p + 1);
          } else {
            setCurrentPhoto(0);
          }
        }}
      >
        <Image
          source={member.photos[currentPhoto]}
          style={styles.image}
          resizeMode="contain"
        />
      </Pressable>
      <View style={styles.dots}>
        {member.photos.map((_, index) => (
          <Text
            key={index}
            style={{
              fontSize: 20,
              opacity: currentPhoto === index ? 1 : 0.3,
            }}
          >
            ●
          </Text>
        ))}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    flex: 1,
    width: '100%',
  },
  counter: {
    textAlign: 'center',
    fontSize: 18,
    marginVertical: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    fontSize: 18,
    color: '#007AFF',
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 12,
  },
});