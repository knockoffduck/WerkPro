import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Delete, ChevronRight, Keyboard as KeyboardIcon } from 'lucide-react-native';
import Animated, { SlideInDown, SlideOutDown } from 'react-native-reanimated';
import { Colors } from '../../constants/Colors';
import { cn } from '../../lib/utils';

interface NumberPadProps {
  onPress: (key: string) => void;
  onDelete: () => void;
  onNext: () => void;
  onHide: () => void;
  className?: string;
}

export function CustomNumberPad({ onPress, onDelete, onNext, onHide, className }: NumberPadProps) {
  const insets = useSafeAreaInsets();
  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0'];

  return (
    <Animated.View 
      entering={SlideInDown}
      exiting={SlideOutDown}
      className={cn('bg-[#121212] p-2 border-t border-border', className)}
      style={{ paddingBottom: Math.max(insets.bottom, 16) }}
    >
      <View className="flex-row flex-wrap justify-between">
        {keys.map((key) => (
          <TouchableOpacity
            key={key}
            onPress={() => onPress(key)}
            activeOpacity={0.6}
            style={{ width: '31%', height: 60 }}
            className="bg-card items-center justify-center rounded-lg mb-2"
          >
            <Text className="text-white text-2xl font-semibold">{key}</Text>
          </TouchableOpacity>
        ))}

        {/* Delete Key */}
        <TouchableOpacity
          onPress={onDelete}
          activeOpacity={0.6}
          style={{ width: '31%', height: 60 }}
          className="bg-card items-center justify-center rounded-lg mb-2"
        >
          <Delete size={24} color="white" />
        </TouchableOpacity>

        {/* Special Action Keys */}
        <TouchableOpacity
          onPress={onHide}
          activeOpacity={0.6}
          style={{ width: '48%', height: 60 }}
          className="bg-[#2C2C2E] items-center justify-center rounded-lg"
        >
          <KeyboardIcon size={24} color="#A1A1AA" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onNext}
          activeOpacity={0.6}
          style={{ width: '48%', height: 60 }}
          className="bg-primary items-center justify-center rounded-lg"
        >
          <View className="flex-row items-center">
            <Text className="text-white text-lg font-bold mr-2">NEXT</Text>
            <ChevronRight size={20} color="white" />
          </View>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}
