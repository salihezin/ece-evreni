import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './src/navigation/RootNavigator';
import { initializeDatabase } from './src/db';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

export default function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    initializeDatabase()
      .then(() => setIsReady(true))
      .catch(error => {
        console.error('Database initialization failed:', error);
        // Still let the app render — screens fall back to empty states
        // rather than getting stuck on a spinner forever.
        setIsReady(true);
      });
  }, []);

  if (!isReady) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
}
