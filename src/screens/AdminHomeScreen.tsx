import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { PinGate } from '../auth/PinGate';
import { RootStackParamList } from '../types/navigation';

const SECTIONS: {
  emoji: string;
  label: string;
  route: keyof Pick<RootStackParamList, 'AdminStories' | 'AdminComics' | 'AdminFamily'>;
}[] = [
  { emoji: '📚', label: 'Masallar', route: 'AdminStories' },
  { emoji: '📕', label: 'Çizgi Romanlar', route: 'AdminComics' },
  { emoji: '👨‍👩‍👧', label: 'Aile', route: 'AdminFamily' },
];

function AdminHomeContent() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Yönetim</Text>
      <Text style={styles.subtitle}>Ne düzenlemek istersin?</Text>

      {SECTIONS.map(section => (
        <Pressable
          key={section.route}
          style={styles.card}
          onPress={() => navigation.navigate(section.route)}
        >
          <Text style={styles.cardEmoji}>{section.emoji}</Text>
          <Text style={styles.cardLabel}>{section.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

export default function AdminHomeScreen() {
  return (
    <PinGate>
      <AdminHomeContent />
    </PinGate>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 16,
  },
  subtitle: {
    fontSize: 15,
    color: '#888',
    marginBottom: 24,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    marginBottom: 12,
  },
  cardEmoji: {
    fontSize: 28,
  },
  cardLabel: {
    fontSize: 18,
    fontWeight: '600',
  },
});
