import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useWorkoutStore } from '../store/workoutStore';

export function useStartWorkout() {
  const router = useRouter();
  const { activeWorkout, cancelWorkout } = useWorkoutStore();

  const startEmptyWorkout = () => {
    if (activeWorkout) {
      Alert.alert(
        'Workout in Progress',
        'You already have an active workout. Would you like to discard it and start a new one, or resume the current one?',
        [
          { text: 'Resume', onPress: () => router.push(`/workout/${activeWorkout.id}`) },
          { 
            text: 'Discard & Start New', 
            onPress: () => {
              cancelWorkout();
              router.push('/workout/new');
            },
            style: 'destructive'
          },
          { text: 'Cancel', style: 'cancel' }
        ]
      );
    } else {
      router.push('/workout/new');
    }
  };

  const startTemplate = (templateId: string) => {
    if (activeWorkout) {
      Alert.alert(
        'Workout in Progress',
        'You already have an active workout. Would you like to discard it and start a new one, or resume the current one?',
        [
          { text: 'Resume', onPress: () => router.push(`/workout/${activeWorkout.id}`) },
          { 
            text: 'Discard & Start New', 
            onPress: () => {
              cancelWorkout();
              router.push(`/workout/${templateId}`);
            },
            style: 'destructive'
          },
          { text: 'Cancel', style: 'cancel' }
        ]
      );
    } else {
      router.push(`/workout/${templateId}`);
    }
  };

  return { startEmptyWorkout, startTemplate };
}
