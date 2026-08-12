import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AppTabs from './AppTabs';
import StoryDetailScreen from '../screens/StoryDetailScreen';
import ComicsDetailScreen from '../screens/ComicsDetailScreen';
import FamilyDetailScreen from '../screens/FamilyDetailScreen';
import AdminStoriesScreen from '../screens/admin/AdminStoriesScreen';
import AdminComicsScreen from '../screens/admin/AdminComicsScreen';
import AdminFamilyScreen from '../screens/admin/AdminFamilyScreen';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Tabs" component={AppTabs} options={{ headerShown: false }} />

      <Stack.Screen
        name="StoryDetail"
        component={StoryDetailScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ComicsDetail"
        component={ComicsDetailScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="FamilyDetail"
        component={FamilyDetailScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AdminStories"
        component={AdminStoriesScreen}
        options={{ title: 'Masallar Yönetimi' }}
      />
      <Stack.Screen
        name="AdminComics"
        component={AdminComicsScreen}
        options={{ title: 'Çizgi Romanlar Yönetimi' }}
      />
      <Stack.Screen
        name="AdminFamily"
        component={AdminFamilyScreen}
        options={{ title: 'Aile Yönetimi' }}
      />
    </Stack.Navigator>
  );
}
