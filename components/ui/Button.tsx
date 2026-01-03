import { Text, TouchableOpacity, TouchableOpacityProps, ActivityIndicator } from 'react-native';
import { cn } from '../../lib/utils';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'danger-outline';
  isLoading?: boolean;
}

export function Button({ 
  title, 
  variant = 'primary', 
  isLoading, 
  className, 
  disabled, 
  ...props 
}: ButtonProps) {
  const variants = {
    primary: 'bg-primary',
    secondary: 'bg-card',
    outline: 'border border-primary bg-transparent',
    ghost: 'bg-transparent',
    danger: 'bg-error',
    'danger-outline': 'border border-error bg-transparent',
  };

  const textColors = {
    primary: 'text-white',
    secondary: 'text-white',
    outline: 'text-primary',
    ghost: 'text-primary',
    danger: 'text-white',
    'danger-outline': 'text-error',
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      disabled={disabled || isLoading}
      className={cn(
        'h-14 w-full items-center justify-center rounded-xl px-4 flex-row',
        variants[variant],
        (disabled || isLoading) && 'opacity-50',
        className
      )}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator color="white" />
      ) : (
        <Text className={cn('text-lg font-semibold', textColors[variant])}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}
