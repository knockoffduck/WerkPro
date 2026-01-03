import { View, Text, TouchableOpacity } from 'react-native';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import Reanimated, { useAnimatedStyle, useSharedValue, interpolate, Extrapolation, SharedValue } from 'react-native-reanimated';
import { Trash2, Plus } from 'lucide-react-native';
import { Colors } from '../../constants/Colors';

interface SwipeableExerciseHeaderProps {
  exerciseName: string;
  onAddSet: () => void;
  onDelete: () => void;
}

export function SwipeableExerciseHeader({ exerciseName, onAddSet, onDelete }: SwipeableExerciseHeaderProps) {
  const renderRightActions = (progress: SharedValue<number>, dragX: SharedValue<number>) => {
    const style = useAnimatedStyle(() => {
      const scale = interpolate(
        dragX.value,
        [-100, 0],
        [1, 0],
        Extrapolation.CLAMP
      );
      return {
        transform: [{ scale }],
      };
    });

    return (
      <TouchableOpacity 
        onPress={onDelete}
        className="bg-error justify-center items-center w-20 mb-4 rounded-r-xl"
        activeOpacity={0.8}
      >
        <Reanimated.View style={style}>
          <Trash2 size={24} color="white" />
        </Reanimated.View>
      </TouchableOpacity>
    );
  };

  return (
    <ReanimatedSwipeable 
      renderRightActions={renderRightActions}
      overshootRight={false}
    >
      <View className="flex-row justify-between items-center mb-4 bg-background pl-4 pr-4 py-2">
        <Text className="text-primary text-xl font-bold flex-1">{exerciseName}</Text>
        <TouchableOpacity onPress={onAddSet} className="bg-card p-2 rounded-full border border-border">
          <Plus size={20} color={Colors.primary} />
        </TouchableOpacity>
      </View>
    </ReanimatedSwipeable>
  );
}
