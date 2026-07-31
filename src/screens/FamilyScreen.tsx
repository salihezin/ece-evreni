import { View, Text, FlatList, Image, StyleSheet } from 'react-native';
import { familyMembers } from '../data/family';

export default function FamilyScreen() {
  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: '#f0f0f0' }}>
      <FlatList
        data={familyMembers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          console.log('Rendering family member:', item);
          return (
            <View style={styles.card}>
              <Image
                source={item.photos[0]}
                style={styles.image}
                resizeMode='stretch' />
              <Text style={styles.name}>
                {item.emoji} {item.name}
              </Text>
            </View>
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