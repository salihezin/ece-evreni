import { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { addFamilyMember, getFamilyMembers } from '../db/database';
import { ScrollView } from 'react-native';
import { Text } from 'react-native';
import { addPhotoToMember } from '../db/database';

export default function AdminScreen() {
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('');
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [members, setMembers] = useState<Array<{ id: string; name: string; emoji: string; }>>([]);

  const pickImage = async () => {
    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      return;
    }

    const result =
      await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 0.8,
      });

    if (!result.canceled) {
      setPhotoUrl(result.assets[0].uri);
    }
  };

  useEffect(() => {
    const fetchFamilyMembers = async () => {
      try {
        const members: Array<{ id: string; name: string; emoji: string; }> = await getFamilyMembers();
        setMembers(members);
      } catch (error) {
        console.error('Error fetching family members:', error);
      }
    };

    fetchFamilyMembers();
  }, []);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Hata', 'İsim gerekli');
      return;
    }

    const id = name
      .toLocaleLowerCase('tr-TR')
      .replaceAll(' ', '-');

    try {
      await addFamilyMember(
        id,
        name.trim(),
        emoji || '🙂',
      );

      Alert.alert('Başarılı', 'Kişi eklendi');

      setName('');
      setEmoji('');
    } catch (error) {
      Alert.alert('Hata', 'Kayıt eklenemedi');
      console.error(error);
    }
  };

  const handlePhotoSave = async () => {
    if (!selectedMemberId) {
      Alert.alert('Hata', 'Kişi seç');
      return;
    }

    if (!photoUrl) {
      Alert.alert('Hata', 'Fotoğraf seç');
      return;
    }

    try {
      await addPhotoToMember(
        selectedMemberId,
        photoUrl,
      );

      Alert.alert(
        'Başarılı',
        'Fotoğraf eklendi',
      );

      setPhotoUrl('');
    } catch (error) {
      console.error(error);

      Alert.alert(
        'Hata',
        'Fotoğraf kaydedilemedi',
      );
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput
        placeholder="İsim"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />

      <TextInput
        placeholder="Emoji"
        value={emoji}
        onChangeText={setEmoji}
        style={styles.input}
      />

      <Button
        title="Kişi Kaydet"
        onPress={handleSave}
      />

      <View style={{ height: 32 }} />

      <Text>Fotoğraf Ekle</Text>

      {members.map(member => (
        <Button
          key={member.id}
          title={
            selectedMemberId === member.id
              ? `✓ ${member.name}`
              : member.name
          }
          onPress={() =>
            setSelectedMemberId(member.id)
          }
        />
      ))}

      <Button
        title="Galeriden Seç"
        onPress={pickImage}
      />

      {!!photoUrl && (
        <Text numberOfLines={1}>
          {photoUrl}
        </Text>
      )}

      <Button
        title="Fotoğrafı Kaydet"
        onPress={handlePhotoSave}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    gap: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
  },
});