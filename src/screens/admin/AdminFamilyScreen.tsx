import { useState } from 'react';
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import {
  addFamilyMember,
  deleteFamilyMemberById,
  deletePhotoById,
  getFamilyMembers,
  getPhotosByMember,
  addPhotoToMember,
  updateFamilyMember,
} from '../../db';
import { copyExternalUriToStorage, deleteStoredFile } from '../../utils/assetStorage';
import { PinGate } from '../../auth/PinGate';
import { useFocusAsyncData } from '../../hooks/useFocusAsyncData';

type Member = { id: string; name: string; emoji: string };
type Photo = { id: number; member_id: string; photo_url: string };

function AdminFamilyContent() {
  const { data: members, reload: loadMembers } = useFocusAsyncData<Member[]>(
    getFamilyMembers,
    [],
  );
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('');

  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);

  const loadPhotos = async (memberId: string) => {
    try {
      const data = await getPhotosByMember(memberId);
      setPhotos(data);
    } catch (error) {
      console.error('Error loading photos:', error);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setName('');
    setEmoji('');
  };

  const startEdit = (member: Member) => {
    setEditingId(member.id);
    setName(member.name);
    setEmoji(member.emoji);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Hata', 'İsim gerekli');
      return;
    }

    try {
      if (editingId) {
        await updateFamilyMember(editingId, {
          name: name.trim(),
          emoji: emoji || '🙂',
        });
      } else {
        const id = `${name.trim().toLocaleLowerCase('tr-TR').replaceAll(' ', '-')}-${Date.now()}`;

        await addFamilyMember(id, name.trim(), emoji || '🙂');
      }

      resetForm();
      await loadMembers();
    } catch (error) {
      console.error(error);
      Alert.alert('Hata', 'Kaydedilemedi');
    }
  };

  const handleDeleteMember = (member: Member) => {
    Alert.alert('Emin misin?', `${member.name} silinecek, bu işlem geri alınamaz.`, [
      { text: 'Vazgeç', style: 'cancel' },
      {
        text: 'Sil',
        style: 'destructive',
        onPress: async () => {
          try {
            const memberPhotos = await getPhotosByMember(member.id);
            memberPhotos.forEach(photo => deleteStoredFile(photo.photo_url));

            await deleteFamilyMemberById(member.id);

            if (selectedMemberId === member.id) {
              setSelectedMemberId(null);
              setPhotos([]);
            }
            if (editingId === member.id) {
              resetForm();
            }

            await loadMembers();
          } catch (error) {
            console.error(error);
            Alert.alert('Hata', 'Silinemedi');
          }
        },
      },
    ]);
  };

  const selectMemberForPhotos = async (memberId: string) => {
    setSelectedMemberId(memberId);
    await loadPhotos(memberId);
  };

  const handlePickPhoto = async () => {
    if (!selectedMemberId) {
      Alert.alert('Hata', 'Önce bir kişi seç');
      return;
    }

    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    });

    if (result.canceled) {
      return;
    }

    try {
      const storedPath = await copyExternalUriToStorage(
        result.assets[0].uri,
        `family/${selectedMemberId}`,
        `photo-${Date.now()}.jpg`,
      );

      await addPhotoToMember(selectedMemberId, storedPath);
      await loadPhotos(selectedMemberId);
    } catch (error) {
      console.error(error);
      Alert.alert('Hata', 'Fotoğraf kaydedilemedi');
    }
  };

  const handleDeletePhoto = (photo: Photo) => {
    Alert.alert('Fotoğrafı sil?', undefined, [
      { text: 'Vazgeç', style: 'cancel' },
      {
        text: 'Sil',
        style: 'destructive',
        onPress: async () => {
          try {
            deleteStoredFile(photo.photo_url);
            await deletePhotoById(photo.id);

            if (selectedMemberId) {
              await loadPhotos(selectedMemberId);
            }
          } catch (error) {
            console.error(error);
            Alert.alert('Hata', 'Silinemedi');
          }
        },
      },
    ]);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.sectionTitle}>
        {editingId ? 'Kişiyi Düzenle' : 'Yeni Kişi Ekle'}
      </Text>

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

      <View style={styles.row}>
        <Pressable style={styles.primaryButton} onPress={handleSave}>
          <Text style={styles.primaryButtonText}>
            {editingId ? 'Güncelle' : 'Kaydet'}
          </Text>
        </Pressable>

        {editingId && (
          <Pressable style={styles.secondaryButton} onPress={resetForm}>
            <Text style={styles.secondaryButtonText}>İptal</Text>
          </Pressable>
        )}
      </View>

      <Text style={styles.sectionTitle}>Aile Üyeleri</Text>

      {members.map(member => (
        <View key={member.id} style={styles.memberRow}>
          <Pressable
            style={styles.memberInfo}
            onPress={() => selectMemberForPhotos(member.id)}
          >
            <Text style={styles.memberEmoji}>{member.emoji}</Text>
            <Text
              style={[
                styles.memberName,
                selectedMemberId === member.id && styles.memberNameSelected,
              ]}
            >
              {member.name}
            </Text>
          </Pressable>

          <Pressable onPress={() => startEdit(member)} style={styles.iconButton}>
            <Text>✏️</Text>
          </Pressable>

          <Pressable onPress={() => handleDeleteMember(member)} style={styles.iconButton}>
            <Text>🗑️</Text>
          </Pressable>
        </View>
      ))}

      {selectedMemberId && (
        <>
          <Text style={styles.sectionTitle}>
            {members.find(m => m.id === selectedMemberId)?.name} — Fotoğraflar
          </Text>

          <Pressable style={styles.secondaryButton} onPress={handlePickPhoto}>
            <Text style={styles.secondaryButtonText}>Galeriden Fotoğraf Ekle</Text>
          </Pressable>

          <View style={styles.photoGrid}>
            {photos.map(photo => (
              <Pressable
                key={photo.id}
                style={styles.photoThumbWrapper}
                onLongPress={() => handleDeletePhoto(photo)}
              >
                <Image source={{ uri: photo.photo_url }} style={styles.photoThumb} />
              </Pressable>
            ))}
          </View>

          {photos.length === 0 && (
            <Text style={styles.hint}>
              Henüz fotoğraf yok. Silmek için fotoğrafa uzun bas.
            </Text>
          )}
        </>
      )}
    </ScrollView>
  );
}

export default function AdminFamilyScreen() {
  return (
    <PinGate title="Aile Yönetimi">
      <AdminFamilyContent />
    </PinGate>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#eee',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  secondaryButtonText: {
    color: '#333',
    fontWeight: '600',
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  memberInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  memberEmoji: {
    fontSize: 22,
  },
  memberName: {
    fontSize: 16,
  },
  memberNameSelected: {
    fontWeight: '700',
    color: '#007AFF',
  },
  iconButton: {
    padding: 8,
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  photoThumbWrapper: {
    width: 80,
    height: 80,
    borderRadius: 8,
    overflow: 'hidden',
  },
  photoThumb: {
    width: '100%',
    height: '100%',
  },
  hint: {
    color: '#888',
    fontSize: 13,
  },
});
