import { View, Text, TouchableOpacity } from 'react-native';
import { Trash2 } from 'lucide-react-native';
import { cn } from '../../lib/utils';
import { Colors } from '../../constants/Colors';
import { SetType } from '../../types';

interface TemplateSetRowProps {
  index: number;
  weight: string;
  reps: string;
  type: SetType;
  onFocusWeight: () => void;
  onFocusReps: () => void;
  onRemoveSet: () => void;
  isFocusedWeight?: boolean;
  isFocusedReps?: boolean;
}

export function TemplateSetRow({
  index,
  weight,
  reps,
  type,
  onFocusWeight,
  onFocusReps,
  onRemoveSet,
  isFocusedWeight,
  isFocusedReps
}: TemplateSetRowProps) {
  return (
    <View className="flex-row items-center py-2 px-4 rounded-lg mb-1">
      {/* Set Number */}
      <View className="w-10">
        <Text className="text-base font-bold text-white">
          {index + 1}
        </Text>
      </View>

      {/* Set Type Indicator (Simplified for now) */}
      <View className="flex-1">
        <Text className="text-subtext text-xs uppercase">{type}</Text>
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

      {/* Remove Button */}
      <TouchableOpacity 
        onPress={onRemoveSet}
        className="w-10 h-10 rounded items-center justify-center bg-card"
      >
        <Trash2 size={20} color={Colors.error} />
      </TouchableOpacity>
    </View>
  );
}
