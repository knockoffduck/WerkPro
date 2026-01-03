import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Screen } from '../../components/ui/Screen';
import { Button } from '../../components/ui/Button';
import { useWorkoutStore } from '../../store/workoutStore';
import { useAuth } from '../../context/AuthContext';
import { SetRow } from '../../components/active-workout/SetRow';
import { CustomNumberPad } from '../../components/keyboard/CustomNumberPad';
import { RestTimer } from '../../components/active-workout/RestTimer';
import { PlateCalculator } from '../../components/active-workout/PlateCalculator';
import { SwipeableExerciseHeader } from '../../components/active-workout/SwipeableExerciseHeader';
import { useWorkoutTimer } from '../../hooks/useWorkoutTimer';
import { Plus, X, ChevronDown, Clock, Calculator } from 'lucide-react-native';
import { Template } from '../../types';
import { Colors } from '../../constants/Colors';
import { databases, APPWRITE_CONFIG, tablesDB } from '../../lib/appwrite';

export default function WorkoutScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { 
    activeWorkout, 
    startWorkout, 
    addExercise, 
    addSet, 
    updateSet, 
    completeSet, 
    finishWorkout,
    cancelWorkout,
    removeExercise
  } = useWorkoutStore();
  const { user } = useAuth();
  const duration = useWorkoutTimer(activeWorkout?.startTime || null);

  const [focusedInput, setFocusedInput] = useState<{ exerciseId: string; setId: string; field: 'weight' | 'reps' } | null>(null);
  const [showRestTimer, setShowRestTimer] = useState(false);
  const [plateCalcWeight, setPlateCalcWeight] = useState<number | null>(null);

  useEffect(() => {
    const initializeWorkout = async () => {
      if (!activeWorkout && id === 'new') {
        startWorkout(Math.random().toString(36).substr(2, 9), 'Empty Workout');
      } else if (!activeWorkout && id && id !== 'new') {
        try {
          const template = await databases.getDocument(
            APPWRITE_CONFIG.databaseId,
            APPWRITE_CONFIG.collections.templates,
            id
          ) as unknown as Template;

          let initialExercises = [];
          if (template.data) {
            try {
              initialExercises = JSON.parse(template.data);
            } catch (e) {
              console.error('Failed to parse template data:', e);
            }
          }

          startWorkout(id, template.name || 'Template Workout', initialExercises);
        } catch (error) {
          console.error('Failed to load template:', error);
          // Fallback to empty if it fails
          startWorkout(id, 'Template Workout');
        }
      }
    };

    initializeWorkout();
  }, [id]);

  const handleKeyPress = (key: string) => {
    if (!focusedInput) return;
    const { exerciseId, setId, field } = focusedInput;
    const exercise = activeWorkout?.exercises.find(e => e.id === exerciseId);
    if (!exercise) return;
    const set = exercise.sets.find(s => s.id === setId);
    if (!set) return;

    const currentValue = set[field] || '';
    if (key === '.' && currentValue.includes('.')) return;
    
    updateSet(exerciseId, setId, { [field]: currentValue + key });
  };

  const handleDelete = () => {
    if (!focusedInput) return;
    const { exerciseId, setId, field } = focusedInput;
    const exercise = activeWorkout?.exercises.find(e => e.id === exerciseId);
    if (!exercise) return;
    const set = exercise.sets.find(s => s.id === setId);
    if (!set) return;

    const currentValue = set[field] || '';
    updateSet(exerciseId, setId, { [field]: currentValue.slice(0, -1) });
  };

  const handleNext = () => {
    if (!focusedInput) return;
    const { exerciseId, setId, field } = focusedInput;
    const exercise = activeWorkout?.exercises.find(e => e.id === exerciseId);
    if (!exercise) return;
    const setIndex = exercise.sets.findIndex(s => s.id === setId);

    if (field === 'weight') {
      setFocusedInput({ exerciseId, setId, field: 'reps' });
    } else {
      // If it's the last set, move to next exercise or stay
      if (setIndex < exercise.sets.length - 1) {
        setFocusedInput({ 
          exerciseId, 
          setId: exercise.sets[setIndex + 1].id, 
          field: 'weight' 
        });
      } else {
        setFocusedInput(null);
      }
    }
  };

  const handleCompleteSet = (exerciseId: string, setId: string) => {
    completeSet(exerciseId, setId);
    const exercise = activeWorkout?.exercises.find(e => e.id === exerciseId);
    const set = exercise?.sets.find(s => s.id === setId);
    
    if (!set?.completed) {
      setShowRestTimer(true);
      // Automatically hide timer after a bit if needed, but PRD says "starts Rest Timer"
    }
  };

  const handleRemoveExercise = (exerciseId: string) => {
    Alert.alert(
      'Remove Exercise',
      'Are you sure you want to remove this exercise from the workout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', onPress: () => removeExercise(exerciseId), style: 'destructive' }
      ]
    );
  };

  const handleFinish = async () => {
    if (!activeWorkout || activeWorkout.exercises.length === 0) {
      Alert.alert('Empty Workout', 'Add some exercises before finishing.');
      return;
    }

    if (!user) {
      Alert.alert('Error', 'You must be logged in to save a workout.');
      return;
    }

    Alert.alert('Finish Workout', 'Are you sure you want to save this session?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Finish', onPress: async () => {
        try {
          // 1. Create Workout Document
          const workoutDoc = await tablesDB.createRow({
            databaseId: APPWRITE_CONFIG.databaseId,
            tableId: APPWRITE_CONFIG.collections.workouts,
            rowId: 'unique()',
            data: {
              user_id: user?.$id,
              name: activeWorkout.name,
              start_time: new Date(activeWorkout.startTime).toISOString(),
              end_time: new Date().toISOString(),
              volume_kg: activeWorkout.exercises.reduce((acc, ex) => 
                acc + ex.sets.reduce((sAcc, s) => sAcc + (parseFloat(s.weight) * parseInt(s.reps) || 0), 0), 0
              ),
              template_id: id !== 'new' ? id : null,
            }
          });

          // 2. Create Workout Exercises and Sets
          for (let exIndex = 0; exIndex < activeWorkout.exercises.length; exIndex++) {
            const exercise = activeWorkout.exercises[exIndex];
            
            // Create Workout Exercise Instance
            const workoutExerciseDoc = await tablesDB.createRow({
              databaseId: APPWRITE_CONFIG.databaseId,
              tableId: APPWRITE_CONFIG.collections.workoutExercises,
              rowId: 'unique()',
              data: {
                workout_id: workoutDoc.$id,
                exercise_id: exercise.exerciseId,
                order: exIndex,
              }
            });

            // Create Sets for this Exercise Instance
            for (let i = 0; i < exercise.sets.length; i++) {
              const set = exercise.sets[i];
              await tablesDB.createRow({
                databaseId: APPWRITE_CONFIG.databaseId,
                tableId: APPWRITE_CONFIG.collections.workoutSets,
                rowId: 'unique()',
                data: {
                  workout_id: workoutDoc.$id,
                  workout_exercise_id: workoutExerciseDoc.$id, // Link to specific instance
                  exercise_id: exercise.exerciseId, // Redundant but kept for schema compatibility/validation
                  set_order: i,
                  weight: parseFloat(set.weight) || 0,
                  reps: parseInt(set.reps) || 0,
                  type: set.type,
                  completed: set.completed,
                  rest_timer_duration: set.rest_timer_duration || 0, // Save rest timer (default 0 if not tracked)
                }
              });
            }
          }


          finishWorkout();
          router.replace('/(tabs)/history');
        } catch (error: any) {
          Alert.alert('Error', 'Failed to save workout: ' + error.message);
        }
      }}
    ]);
  };
  
  const handleDiscard = () => {
    Alert.alert(
      'Discard Workout',
      'Are you sure you want to discard this workout? All progress will be lost.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Discard', 
          onPress: () => {
            cancelWorkout();
            router.replace('/(tabs)/start-workout');
          }, 
          style: 'destructive' 
        }
      ]
    );
  };

  const dismissGesture = Gesture.Pan()
    .runOnJS(true)
    .onEnd((event) => {
      if (event.velocityY > 500 || event.translationY > 100) {
        router.back();
      }
    });

  if (!activeWorkout) return null;

  return (
    <Screen className="px-0">
      <GestureDetector gesture={dismissGesture}>
        <View className="pt-2 pb-4 px-4 border-b border-border bg-black">
          <View className="w-10 h-1.5 bg-zinc-800 rounded-full self-center mb-2" />
          <View className="flex-row justify-between items-center">
            <View>
              <Text className="text-white text-xl font-bold">{activeWorkout.name}</Text>
              <View className="flex-row items-center">
                <Clock size={14} color={Colors.subtext} />
                <Text className="text-subtext text-xs ml-1">{duration}</Text>
              </View>
            </View>
            <Button 
              title="Finish" 
              onPress={handleFinish} 
              className="h-10 w-20 rounded-lg"
            />
          </View>
        </View>
      </GestureDetector>

      <ScrollView 
        className="flex-1 px-4" 
        contentContainerStyle={{ 
          paddingTop: 16,
          paddingBottom: focusedInput ? 0 : 40 
        }}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="always"
      >
        {activeWorkout.exercises.map((exercise) => (
          <View key={exercise.id} className="mb-6">
            <SwipeableExerciseHeader 
              exerciseName={exercise.name} 
              onAddSet={() => addSet(exercise.id)}
              onDelete={() => handleRemoveExercise(exercise.id)}
            />

            <View className="flex-row px-4 mb-2">
              <Text className="w-10 text-subtext text-xs font-bold uppercase">Set</Text>
              <Text className="flex-1 text-subtext text-xs font-bold uppercase">Previous</Text>
              <TouchableOpacity 
                className="w-20 flex-row items-center justify-center"
                onPress={() => {
                  const firstSet = exercise.sets[0];
                  if (firstSet && firstSet.weight) setPlateCalcWeight(parseFloat(firstSet.weight));
                }}
              >
                <Text className="text-subtext text-xs font-bold uppercase mr-1">kg</Text>
                <Calculator size={12} color={Colors.subtext} />
              </TouchableOpacity>
              <Text className="w-20 text-subtext text-xs font-bold uppercase text-center">Reps</Text>
              <View className="w-10" />
            </View>

            {exercise.sets.map((set, index) => (
              <SetRow
                key={set.id}
                index={index}
                weight={set.weight}
                reps={set.reps}
                type={set.type}
                completed={set.completed}
                onFocusWeight={() => setFocusedInput({ exerciseId: exercise.id, setId: set.id, field: 'weight' })}
                onFocusReps={() => setFocusedInput({ exerciseId: exercise.id, setId: set.id, field: 'reps' })}
                onToggleComplete={() => handleCompleteSet(exercise.id, set.id)}
                isFocusedWeight={focusedInput?.setId === set.id && focusedInput?.field === 'weight'}
                isFocusedReps={focusedInput?.setId === set.id && focusedInput?.field === 'reps'}
              />
            ))}
          </View>
        ))}

        <Button 
          title="Add Exercise" 
          variant="secondary" 
          onPress={() => router.push('/workout/select-exercise')}
          className="mt-4 mb-4"
        />

        <Button 
          title="Debug: Log State" 
          variant="outline" 
          onPress={() => console.log(JSON.stringify(activeWorkout, null, 2))}
          className="mb-4 opacity-50"
        />

        <Button 
          title="Discard Workout" 
          variant="danger-outline" 
          onPress={handleDiscard}
          className="mb-10"
        />
      </ScrollView>

      {showRestTimer && (
        <View className="absolute top-20 self-center z-50">
          <RestTimer duration={120} onFinished={() => setShowRestTimer(false)} />
        </View>
      )}

      {focusedInput && (
        <CustomNumberPad
          onPress={handleKeyPress}
          onDelete={handleDelete}
          onNext={handleNext}
          onHide={() => setFocusedInput(null)}
        />
      )}

      <PlateCalculator 
        isVisible={!!plateCalcWeight} 
        onClose={() => setPlateCalcWeight(null)} 
        targetWeight={plateCalcWeight || 0} 
      />
    </Screen>
  );
}
