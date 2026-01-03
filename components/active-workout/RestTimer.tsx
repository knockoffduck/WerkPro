import { View, Text } from 'react-native';
import { Timer } from 'lucide-react-native';
import { Colors } from '../../constants/Colors';
import { useState, useEffect } from 'react';

interface RestTimerProps {
  duration: number; // in seconds
  onFinished?: () => void;
}

export function RestTimer({ duration, onFinished }: RestTimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (timeLeft <= 0) {
      onFinished?.();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <View className="bg-primary px-4 py-2 rounded-full flex-row items-center border border-white/20">
      <Timer size={16} color="white" className="mr-2" />
      <Text className="text-white font-bold text-base">
        Rest: {minutes}:{seconds.toString().padStart(2, '0')}
      </Text>
    </View>
  );
}
