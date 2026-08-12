import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import StoriesScreen from '../screens/StoriesScreen';
import ComicsScreen from '../screens/ComicsScreen';
import FamilyScreen from '../screens/FamilyScreen';

const Tab = createBottomTabNavigator();

export default function AppTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Masallar" component={StoriesScreen} />
      <Tab.Screen name="Çizgi Romanlar" component={ComicsScreen} />
      <Tab.Screen name="Aile" component={FamilyScreen} />
    </Tab.Navigator>
  );
}
