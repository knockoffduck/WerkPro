import { Tabs } from 'expo-router';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { LayoutDashboard, History, Play, Dumbbell, User } from 'lucide-react-native';
import { ActiveWorkoutMiniHeader } from '../../components/active-workout/ActiveWorkoutMiniHeader';

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const TAB_BAR_HEIGHT = 50;
  const TOTAL_TAB_HEIGHT = TAB_BAR_HEIGHT + Math.max(insets.bottom, 16);

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors.primary,
          tabBarInactiveTintColor: Colors.subtext,
          tabBarStyle: {
            backgroundColor: Colors.background,
            borderTopColor: Colors.border,
            height: TOTAL_TAB_HEIGHT,
            paddingBottom: Math.max(insets.bottom, 8),
          },
          headerStyle: {
            backgroundColor: Colors.background,
          },
          headerTitleStyle: {
            color: Colors.text,
            fontWeight: 'bold',
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color }) => <LayoutDashboard size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="history"
          options={{
            title: 'History',
            tabBarIcon: ({ color }) => <History size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="start-workout"
          options={{
            title: 'Log',
            tabBarIcon: ({ color }) => <Play size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="exercises"
          options={{
            title: 'Exercises',
            tabBarIcon: ({ color }) => <Dumbbell size={24} color={color} />,
          }}
        />
      </Tabs>
      <View style={{ position: 'absolute', bottom: TOTAL_TAB_HEIGHT, left: 0, right: 0 }}>
        <ActiveWorkoutMiniHeader />
      </View>
    </View>
  );
}
