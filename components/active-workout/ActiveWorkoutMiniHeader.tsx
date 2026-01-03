import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Play, Clock } from 'lucide-react-native';
import { useWorkoutStore } from '../../store/workoutStore';
import { useWorkoutTimer } from '../../hooks/useWorkoutTimer';
import { Colors } from '../../constants/Colors';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

export function ActiveWorkoutMiniHeader() {
  const router = useRouter();
  const activeWorkout = useWorkoutStore((state) => state.activeWorkout);
  const duration = useWorkoutTimer(activeWorkout?.startTime || null);

  if (!activeWorkout) return null;

  const handlePress = () => {
    router.push(`/workout/${activeWorkout.id}`);
  };

  const swipeGesture = Gesture.Pan()
    .runOnJS(true)
    .onEnd((event) => {
      // If swipe up (negative velocity and sufficient distance)
      if (event.velocityY < -500 || event.translationY < -50) {
        handlePress();
      }
    });

  return (
    <GestureDetector gesture={swipeGesture}>
      <Animated.View 
        entering={FadeInDown} 
        exiting={FadeOutDown}
        className="px-4 py-3 bg-card border-t border-border flex-row items-center justify-between"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 3.84,
          elevation: 5,
        }}
      >
        <TouchableOpacity 
          onPress={handlePress}
          className="flex-1 flex-row items-center"
          activeOpacity={0.7}
        >
          <View className="w-8 h-8 rounded-full bg-primary/20 items-center justify-center mr-3">
            <Play size={16} color={Colors.primary} fill={Colors.primary} />
          </View>
          <View className="flex-1">
            <Text className="text-white font-semibold text-sm" numberOfLines={1}>
              {activeWorkout.name}
            </Text>
            <View className="flex-row items-center">
              <Clock size={12} color={Colors.subtext} />
              <Text className="text-subtext text-xs ml-1 font-medium">
                {duration}
              </Text>
            </View>
          </View>
          <View className="items-end">
            <Text className="text-primary font-bold text-xs">RESUME</Text>
            <View className="h-1 w-8 bg-zinc-700 rounded-full mt-1" />
          </View>
        </TouchableOpacity>
      </Animated.View>
    </GestureDetector>
  );
}
