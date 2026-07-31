import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AppTabs from './AppTabs';
import StoryDetailScreen from '../screens/StoryDetailScreen';
import ComicsDetailScreen from '../screens/ComicsDetailScreen';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Tabs"
        component={AppTabs}
        options={{ headerShown: false }}
      />

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
    </Stack.Navigator>
  );
}