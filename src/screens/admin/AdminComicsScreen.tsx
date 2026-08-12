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
  addComic,
  addComicPage,
  deleteComic,
  deleteComicPage,
  getComicWithPages,
  getComics,
  reorderComicPages,
} from '../../db';
import type { Comic, ComicPage } from '../../types/comics';
import { copyExternalUriToStorage, deleteStoredFile } from '../../utils/assetStorage';
import { PinGate } from '../../auth/PinGate';
import { useFocusAsyncData } from '../../hooks/useFocusAsyncData';

function AdminComicsContent() {
  const { data: comics, reload: loadComics } = useFocusAsyncData<Omit<Comic, 'pages'>[]>(
    getComics,
    [],
  );
  const [selectedComic, setSelectedComic] = useState<Comic | null>(null);

  const [title, setTitle] = useState('');
  const [coverUri, setCoverUri] = useState('');

  const [pageImageUri, setPageImageUri] = useState('');
  const [pageText, setPageText] = useState('');

  const refreshSelectedComic = async (id: string) => {
    const data = await getComicWithPages(id);
    setSelectedComic(data);
  };

  const pickCover = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    });

    if (!result.canceled) {
      setCoverUri(result.assets[0].uri);
    }
  };

  const handleCreateComic = async () => {
    if (!title.trim() || !coverUri) {
      Alert.alert('Hata', 'Başlık ve kapak görseli gerekli');
      return;
    }

    try {
      const id = `comic-${Date.now()}`;
      const coverPath = await copyExternalUriToStorage(
        coverUri,
        'comics',
        `${id}-cover.jpg`,
      );

      await addComic({ id, title: title.trim(), coverPath });

      setTitle('');
      setCoverUri('');

      await loadComics();
      await refreshSelectedComic(id);
    } catch (error) {
      console.error(error);
      Alert.alert('Hata', 'Çizgi roman oluşturulamadı');
    }
  };

  const handleDeleteComic = (comic: Omit<Comic, 'pages'>) => {
    Alert.alert('Emin misin?', `"${comic.title}" ve tüm sayfaları silinecek.`, [
      { text: 'Vazgeç', style: 'cancel' },
      {
        text: 'Sil',
        style: 'destructive',
        onPress: async () => {
          try {
            const full = await getComicWithPages(comic.id);
            if (full) {
              deleteStoredFile(full.cover);
              full.pages.forEach(page => deleteStoredFile(page.image));
            }

            await deleteComic(comic.id);

            if (selectedComic?.id === comic.id) {
              setSelectedComic(null);
            }

            await loadComics();
          } catch (error) {
            console.error(error);
            Alert.alert('Hata', 'Silinemedi');
          }
        },
      },
    ]);
  };

  const pickPageImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    });

    if (!result.canceled) {
      setPageImageUri(result.assets[0].uri);
    }
  };

  const handleAddPage = async () => {
    if (!selectedComic) return;

    if (!pageImageUri) {
      Alert.alert('Hata', 'Sayfa görseli gerekli');
      return;
    }

    try {
      const nextOrder = selectedComic.pages.length;
      const imagePath = await copyExternalUriToStorage(
        pageImageUri,
        'comics',
        `${selectedComic.id}-page-${Date.now()}.jpg`,
      );

      await addComicPage({
        comicId: selectedComic.id,
        pageOrder: nextOrder,
        text: pageText.trim() || undefined,
        imagePath,
      });

      setPageImageUri('');
      setPageText('');

      await refreshSelectedComic(selectedComic.id);
    } catch (error) {
      console.error(error);
      Alert.alert('Hata', 'Sayfa eklenemedi');
    }
  };

  const handleDeletePage = (page: ComicPage) => {
    if (!selectedComic) return;

    Alert.alert('Bu sayfayı sil?', undefined, [
      { text: 'Vazgeç', style: 'cancel' },
      {
        text: 'Sil',
        style: 'destructive',
        onPress: async () => {
          try {
            deleteStoredFile(page.image);
            await deleteComicPage(page.id);
            await refreshSelectedComic(selectedComic.id);
          } catch (error) {
            console.error(error);
            Alert.alert('Hata', 'Silinemedi');
          }
        },
      },
    ]);
  };

  const movePage = async (index: number, direction: -1 | 1) => {
    if (!selectedComic) return;

    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= selectedComic.pages.length) return;

    const reordered = [...selectedComic.pages];
    [reordered[index], reordered[targetIndex]] = [
      reordered[targetIndex],
      reordered[index],
    ];

    try {
      await reorderComicPages(
        selectedComic.id,
        reordered.map(page => page.id),
      );
      await refreshSelectedComic(selectedComic.id);
    } catch (error) {
      console.error(error);
      Alert.alert('Hata', 'Sıralanamadı');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.sectionTitle}>Yeni Çizgi Roman</Text>

      <TextInput
        placeholder="Başlık"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />

      <Pressable style={styles.secondaryButton} onPress={pickCover}>
        <Text style={styles.secondaryButtonText}>Kapak Görseli Seç</Text>
      </Pressable>

      {!!coverUri && (
        <Image
          source={{ uri: coverUri }}
          style={styles.coverPreview}
          resizeMode="contain"
        />
      )}

      <Pressable style={styles.primaryButton} onPress={handleCreateComic}>
        <Text style={styles.primaryButtonText}>Oluştur</Text>
      </Pressable>

      <Text style={styles.sectionTitle}>Çizgi Romanlar</Text>

      {comics.map(comic => (
        <View key={comic.id} style={styles.listRow}>
          <Pressable
            style={styles.listRowInfo}
            onPress={() => refreshSelectedComic(comic.id)}
          >
            <Image source={{ uri: comic.cover }} style={styles.listThumb} />
            <Text
              style={[
                styles.listTitle,
                selectedComic?.id === comic.id && styles.listTitleSelected,
              ]}
              numberOfLines={2}
            >
              {comic.title}
            </Text>
          </Pressable>

          <Pressable onPress={() => handleDeleteComic(comic)} style={styles.iconButton}>
            <Text>🗑️</Text>
          </Pressable>
        </View>
      ))}

      {selectedComic && (
        <>
          <Text style={styles.sectionTitle}>
            &quot;{selectedComic.title}&quot; — Sayfalar
          </Text>

          {selectedComic.pages.map((page, index) => (
            <View key={page.id} style={styles.pageRow}>
              <Image source={{ uri: page.image }} style={styles.listThumb} />

              <Text style={styles.pageText} numberOfLines={2}>
                {page.text || '(metinsiz)'}
              </Text>

              <Pressable
                onPress={() => movePage(index, -1)}
                style={styles.iconButton}
                disabled={index === 0}
              >
                <Text style={{ opacity: index === 0 ? 0.3 : 1 }}>⬆️</Text>
              </Pressable>

              <Pressable
                onPress={() => movePage(index, 1)}
                style={styles.iconButton}
                disabled={index === selectedComic.pages.length - 1}
              >
                <Text
                  style={{
                    opacity: index === selectedComic.pages.length - 1 ? 0.3 : 1,
                  }}
                >
                  ⬇️
                </Text>
              </Pressable>

              <Pressable onPress={() => handleDeletePage(page)} style={styles.iconButton}>
                <Text>🗑️</Text>
              </Pressable>
            </View>
          ))}

          <Text style={styles.subheading}>Yeni Sayfa Ekle</Text>

          <Pressable style={styles.secondaryButton} onPress={pickPageImage}>
            <Text style={styles.secondaryButtonText}>Sayfa Görseli Seç</Text>
          </Pressable>

          {!!pageImageUri && (
            <Image
              source={{ uri: pageImageUri }}
              style={styles.coverPreview}
              resizeMode="contain"
            />
          )}

          <TextInput
            placeholder="Sayfa metni (opsiyonel)"
            value={pageText}
            onChangeText={setPageText}
            style={styles.input}
          />

          <Pressable style={styles.primaryButton} onPress={handleAddPage}>
            <Text style={styles.primaryButtonText}>Sayfayı Ekle</Text>
          </Pressable>
        </>
      )}
    </ScrollView>
  );
}

export default function AdminComicsScreen() {
  return (
    <PinGate title="Çizgi Romanlar Yönetimi">
      <AdminComicsContent />
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
  subheading: {
    fontSize: 15,
    fontWeight: '600',
    marginTop: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
  },
  primaryButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: 'flex-start',
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
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  listRowInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
  listTitleSelected: {
    fontWeight: '700',
    color: '#007AFF',
  },
  iconButton: {
    padding: 8,
  },
  pageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
  },
  pageText: {
    flex: 1,
    fontSize: 13,
    color: '#555',
  },
});
