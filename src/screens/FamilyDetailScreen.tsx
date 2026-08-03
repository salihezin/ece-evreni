import { useEffect, useLayoutEffect, useState } from 'react';
import { Alert } from 'react-native';
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
import {
  getFamilyMemberById,
  getPhotosByMember,
  deletePhotosByMemberId,
} from '../db';

type FamilyDetailRouteProp = RouteProp<
  RootStackParamList,
  'FamilyDetail'
>;

type FamilyMember = {
  id: string;
  name: string;
  emoji: string;
};

type FamilyPhoto = {
  id: number;
  member_id: string;
  photo_url: string;
};

export default function FamilyDetailScreen() {
  const route = useRoute<FamilyDetailRouteProp>();
  const navigation = useNavigation();

  const handleDeletePhoto = async () => {
    Alert.alert(
      'Fotoğrafı Sil',
      'Bu fotoğrafı silmek istediğinizden emin misiniz?',
      [
        {
          text: 'İptal',
          style: 'cancel',
        },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: async () => {
            try {
              await deletePhotosByMemberId(familyMemberId);
              setPhotos([]);
              setCurrentPhoto(0);
            } catch (error) {
              console.error(error);
            }
          },
        },
      ],
    );
  };

  const { familyMemberId } = route.params;

  const [member, setMember] =
    useState<FamilyMember | null>(null);

  const [photos, setPhotos] =
    useState<FamilyPhoto[]>([]);

  const [currentPhoto, setCurrentPhoto] =
    useState(0);

  useEffect(() => {
    const loadData = async () => {
      try {
        const memberData =
          await getFamilyMemberById(
            familyMemberId,
          );

        const photosData =
          await getPhotosByMember(
            familyMemberId,
          );

        setMember(memberData);
        setPhotos(photosData);
      } catch (error) {
        console.error(error);
      }
    };

    loadData();
  }, [familyMemberId]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: member
        ? `${member.emoji} ${member.name}`
        : 'Aile',
    });
  }, [navigation, member]);

  if (!member) {
    return (
      <View style={styles.center}>
        <Text>Yükleniyor...</Text>
      </View>
    );
  }

  if (photos.length === 0) {
    return (
      <View style={styles.center}>
        <Text>
          {member.emoji} {member.name}
        </Text>
        <Text>
          Henüz fotoğraf eklenmemiş.
        </Text>
      </View>
    );
  }

  return (
    <>
      <Pressable
        style={{ flex: 1 }}
        onPress={() => {
          if (
            currentPhoto <
            photos.length - 1
          ) {
            setCurrentPhoto(
              p => p + 1,
            );
          } else {
            setCurrentPhoto(0);
          }
        }}
        onLongPress={handleDeletePhoto}
        delayLongPress={3000}
      >
        <Image
          source={{
            uri: photos[currentPhoto]
              .photo_url,
          }}
          style={styles.image}
          resizeMode="contain"
        />
      </Pressable>

      <View style={styles.dots}>
        {photos.map((_, index) => (
          <Text
            key={index}
            style={{
              fontSize: 20,
              opacity:
                currentPhoto === index
                  ? 1
                  : 0.3,
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
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  image: {
    flex: 1,
    width: '100%',
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 12,
  },
});