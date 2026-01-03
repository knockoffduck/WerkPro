import { View, ViewProps, SafeAreaView, StatusBar, ScrollView, Pressable, Keyboard } from 'react-native';
import { cn } from '../../lib/utils';

interface ScreenProps extends ViewProps {
  scrollable?: boolean;
}

export function Screen({ children, className, scrollable = false, ...props }: ScreenProps) {
  const Container = scrollable ? ScrollView : View;

  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <Pressable 
        onPress={Keyboard.dismiss} 
        className="flex-1" 
        accessible={false}
      >
        <Container 
          className={cn('flex-1 px-4 pt-4', className)} 
          {...(scrollable ? { 
            contentContainerStyle: { paddingBottom: 20 },
            keyboardDismissMode: 'on-drag',
            keyboardShouldPersistTaps: 'handled'
          } : {})}
          {...props}
        >
          {children}
        </Container>
      </Pressable>
    </SafeAreaView>
  );
}
