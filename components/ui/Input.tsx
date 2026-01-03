import { View, Text, TextInput, TextInputProps } from 'react-native';
import { cn } from '../../lib/utils';
import { Colors } from '../../constants/Colors';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerClassName?: string;
}

export function Input({ 
  label, 
  error, 
  className, 
  containerClassName, 
  ...props 
}: InputProps) {
  return (
    <View className={cn('w-full mb-4', containerClassName)}>
      {label && (
        <Text className="text-subtext mb-2 text-sm font-medium">
          {label}
        </Text>
      )}
      <View
        className={cn(
          'h-14 w-full flex-row items-center rounded-xl border px-4 bg-card',
          error ? 'border-error' : 'border-border focus:border-primary'
        )}
      >
        <TextInput
          className={cn('flex-1 text-white text-base', className)}
          placeholderTextColor="#6B7280"
          {...props}
        />
      </View>
      {error && (
        <Text className="text-error mt-1 text-xs">
          {error}
        </Text>
      )}
    </View>
  );
}
