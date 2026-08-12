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
import * as DocumentPicker from 'expo-document-picker';
import {
  addStory,
  deleteStory,
  getStories,
  getStoryRowById,
  updateStory,
} from '../../db';
import type { Story } from '../../types/story';
import { copyExternalUriToStorage, deleteStoredFile } from '../../utils/assetStorage';
import { PinGate } from '../../auth/PinGate';
import { useFocusAsyncData } from '../../hooks/useFocusAsyncData';

const emptyForm = {
  title: '',
  description: '',
  fullStory: '',
  coverUri: '',
  audioUri: '',
};

function AdminStoriesContent() {
  const { data: stories, reload: loadStories } = useFocusAsyncData<Story[]>(
    getStories,
    [],
  );
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const startEdit = (story: Story) => {
    setEditingId(story.id);
    setForm({
      title: story.title,
      description: story.description,
      fullStory: story.fullStory,
      coverUri: story.cover,
      audioUri: story.audio,
    });
  };

  const pickCover = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    });

    if (!result.canceled) {
      setForm(prev => ({ ...prev, coverUri: result.assets[0].uri }));
    }
  };

  const pickAudio = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: 'audio/*',
      copyToCacheDirectory: true,
    });

    if (!result.canceled) {
      setForm(prev => ({ ...prev, audioUri: result.assets[0].uri }));
    }
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.description.trim() || !form.fullStory.trim()) {
      Alert.alert('Hata', 'Başlık, açıklama ve metin gerekli');
      return;
    }

    if (!form.coverUri || !form.audioUri) {
      Alert.alert('Hata', 'Kapak görseli ve ses dosyası gerekli');
      return;
    }

    try {
      const id = editingId ?? `story-${Date.now()}`;

      // Only re-copy media if the picker returned a new (non-persisted) uri —
      // editing a story without changing its cover/audio keeps the existing
      // stored file instead of duplicating it.
      const coverPath = form.coverUri.includes('/media/stories/')
        ? form.coverUri
        : await copyExternalUriToStorage(form.coverUri, 'stories', `${id}-cover.jpg`);

      const audioPath = form.audioUri.includes('/media/stories/')
        ? form.audioUri
        : await copyExternalUriToStorage(form.audioUri, 'stories', `${id}-audio.mp3`);

      if (editingId) {
        await updateStory(editingId, {
          title: form.title.trim(),
          description: form.description.trim(),
          fullStory: form.fullStory.trim(),
          coverPath,
          audioPath,
        });
      } else {
        await addStory({
          id,
          title: form.title.trim(),
          description: form.description.trim(),
          fullStory: form.fullStory.trim(),
          coverPath,
          audioPath,
        });
      }

      resetForm();
      await loadStories();
    } catch (error) {
      console.error(error);
      Alert.alert('Hata', 'Kaydedilemedi');
    }
  };

  const handleDelete = (story: Story) => {
    Alert.alert('Emin misin?', `"${story.title}" silinecek.`, [
      { text: 'Vazgeç', style: 'cancel' },
      {
        text: 'Sil',
        style: 'destructive',
        onPress: async () => {
          try {
            const row = await getStoryRowById(story.id);
            if (row) {
              deleteStoredFile(row.cover_path);
              deleteStoredFile(row.audio_path);
            }

            await deleteStory(story.id);

            if (editingId === story.id) {
              resetForm();
            }

            await loadStories();
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
        {editingId ? 'Masalı Düzenle' : 'Yeni Masal Ekle'}
      </Text>

      <TextInput
        placeholder="Başlık"
        value={form.title}
        onChangeText={text => setForm(prev => ({ ...prev, title: text }))}
        style={styles.input}
      />

      <TextInput
        placeholder="Kısa açıklama"
        value={form.description}
        onChangeText={text => setForm(prev => ({ ...prev, description: text }))}
        style={styles.input}
        multiline
      />

      <TextInput
        placeholder="Masalın tam metni"
        value={form.fullStory}
        onChangeText={text => setForm(prev => ({ ...prev, fullStory: text }))}
        style={[styles.input, styles.multiline]}
        multiline
      />

      <Pressable style={styles.secondaryButton} onPress={pickCover}>
        <Text style={styles.secondaryButtonText}>Kapak Görseli Seç</Text>
      </Pressable>

      {!!form.coverUri && (
        <Image
          source={{ uri: form.coverUri }}
          style={styles.coverPreview}
          resizeMode="contain"
        />
      )}

      <Pressable style={styles.secondaryButton} onPress={pickAudio}>
        <Text style={styles.secondaryButtonText}>Ses Dosyası Seç</Text>
      </Pressable>

      {!!form.audioUri && (
        <Text style={styles.hint} numberOfLines={1}>
          🎵 {form.audioUri.split('/').pop()}
        </Text>
      )}

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

      <Text style={styles.sectionTitle}>Masallar</Text>

      {stories.map(story => (
        <View key={story.id} style={styles.listRow}>
          <Image source={{ uri: story.cover }} style={styles.listThumb} />

          <Text style={styles.listTitle} numberOfLines={2}>
            {story.title}
          </Text>

          <Pressable onPress={() => startEdit(story)} style={styles.iconButton}>
            <Text>✏️</Text>
          </Pressable>

          <Pressable onPress={() => handleDelete(story)} style={styles.iconButton}>
            <Text>🗑️</Text>
          </Pressable>
        </View>
      ))}
    </ScrollView>
  );
}

export default function AdminStoriesScreen() {
  return (
    <PinGate title="Masallar Yönetimi">
      <AdminStoriesContent />
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
  multiline: {
    minHeight: 100,
    textAlignVertical: 'top',
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
    alignSelf: 'flex-start',
  },
  secondaryButtonText: {
    color: '#333',
    fontWeight: '600',
  },
  coverPreview: {
    width: '100%',
    height: 160,
  },
  hint: {
    color: '#888',
    fontSize: 13,
  },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  listThumb: {
    width: 44,
    height: 44,
    borderRadius: 6,
  },
  listTitle: {
    flex: 1,
    fontSize: 15,
  },
  iconButton: {
    padding: 8,
  },
});
