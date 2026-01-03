import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { Check } from 'lucide-react-native';
import { cn } from '../../lib/utils';
import { Colors } from '../../constants/Colors';
import { SetType } from '../../types';

interface SetRowProps {
  index: number;
  weight: string;
  reps: string;
  type: SetType;
  completed: boolean;
  previous?: string;
  onFocusWeight: () => void;
  onFocusReps: () => void;
  onToggleComplete: () => void;
  isFocusedWeight?: boolean;
  isFocusedReps?: boolean;
}

export function SetRow({
  index,
  weight,
  reps,
  type,
  completed,
  previous,
  onFocusWeight,
  onFocusReps,
  onToggleComplete,
  isFocusedWeight,
  isFocusedReps
}: SetRowProps) {
  return (
    <View 
      className={cn(
        'flex-row items-center py-2 px-4 rounded-lg mb-1',
        completed ? 'bg-success/10' : ''
      )}
    >
      {/* Set Number */}
      <View className="w-10">
        <Text className={cn('text-base font-bold', completed ? 'text-success' : 'text-white')}>
          {index + 1}
        </Text>
      </View>

      {/* Previous */}
      <View className="flex-1">
        <Text className="text-subtext text-xs">{previous || '—'}</Text>
      </View>

      {/* Weight Input */}
      <TouchableOpacity 
        onPress={onFocusWeight}
        className={cn(
          'w-20 h-10 bg-card rounded items-center justify-center mr-2 border',
          isFocusedWeight ? 'border-primary' : 'border-transparent'
        )}
      >
        <Text className={cn('text-lg', weight ? 'text-white' : 'text-subtext')}>
          {weight || '0'}
        </Text>
      </TouchableOpacity>

      {/* Reps Input */}
      <TouchableOpacity 
        onPress={onFocusReps}
        className={cn(
          'w-20 h-10 bg-card rounded items-center justify-center mr-4 border',
          isFocusedReps ? 'border-primary' : 'border-transparent'
        )}
      >
        <Text className={cn('text-lg', reps ? 'text-white' : 'text-subtext')}>
          {reps || '0'}
        </Text>
      </TouchableOpacity>

      {/* Check Button */}
      <TouchableOpacity 
        onPress={onToggleComplete}
        className={cn(
          'w-10 h-10 rounded items-center justify-center',
          completed ? 'bg-success' : 'bg-card'
        )}
      >
        <Check size={24} color={completed ? 'white' : '#A1A1AA'} />
      </TouchableOpacity>
    </View>
  );
}
