import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActiveWorkoutState, SetType } from '../types';

interface WorkoutStore {
  activeWorkout: ActiveWorkoutState | null;
  startWorkout: (id: string, name: string, exercises?: ActiveWorkoutState['exercises']) => void;
  addExercise: (exerciseId: string, name: string) => void;
  removeExercise: (exerciseId: string) => void;
  addSet: (exerciseId: string) => void;
  updateSet: (exerciseId: string, setId: string, data: Partial<ActiveWorkoutState['exercises'][0]['sets'][0]>) => void;
  completeSet: (exerciseId: string, setId: string) => void;
  finishWorkout: () => void;
  cancelWorkout: () => void;
}

export const useWorkoutStore = create<WorkoutStore>()(
  persist(
    (set) => ({
      activeWorkout: null,

      startWorkout: (id, name, exercises = []) => set({
        activeWorkout: {
          id,
          name,
          startTime: new Date(),
          exercises
        }
      }),

      addExercise: (exerciseId, name) => set((state) => {
        if (!state.activeWorkout) return state;
        const newExercise = {
          id: Math.random().toString(36).substr(2, 9),
          exerciseId,
          name,
            sets: [{
            id: Math.random().toString(36).substr(2, 9),
            weight: '',
            reps: '',
            type: 'normal' as SetType,
            completed: false,
            rest_timer_duration: undefined
          }]
        };
        return {
          activeWorkout: {
            ...state.activeWorkout,
            exercises: [...state.activeWorkout.exercises, newExercise]
          }
        };
      }),

      removeExercise: (id) => set((state) => {
        if (!state.activeWorkout) return state;
        return {
          activeWorkout: {
            ...state.activeWorkout,
            exercises: state.activeWorkout.exercises.filter(e => e.id !== id)
          }
        };
      }),

      addSet: (exerciseId) => set((state) => {
        if (!state.activeWorkout) return state;
        const exercises = state.activeWorkout.exercises.map(ex => {
          if (ex.id === exerciseId) {
            const lastSet = ex.sets[ex.sets.length - 1];
            return {
              ...ex,
              sets: [...ex.sets, {
                id: Math.random().toString(36).substr(2, 9),
                weight: lastSet?.weight || '',
                reps: lastSet?.reps || '',
                type: 'normal' as SetType,
                completed: false,
                rest_timer_duration: undefined
              }]
            };
          }
          return ex;
        });
        return { activeWorkout: { ...state.activeWorkout, exercises } };
      }),

      updateSet: (exerciseId, setId, data) => set((state) => {
        if (!state.activeWorkout) return state;
        const exercises = state.activeWorkout.exercises.map(ex => {
          if (ex.id === exerciseId) {
            return {
              ...ex,
              sets: ex.sets.map(s => s.id === setId ? { ...s, ...data } : s)
            };
          }
          return ex;
        });
        return { activeWorkout: { ...state.activeWorkout, exercises } };
      }),

      completeSet: (exerciseId, setId) => set((state) => {
        if (!state.activeWorkout) return state;
        const exercises = state.activeWorkout.exercises.map(ex => {
          if (ex.id === exerciseId) {
            return {
              ...ex,
              sets: ex.sets.map(s => s.id === setId ? { ...s, completed: !s.completed } : s)
            };
          }
          return ex;
        });
        return { activeWorkout: { ...state.activeWorkout, exercises } };
      }),

      finishWorkout: () => set({ activeWorkout: null }),
      cancelWorkout: () => set({ activeWorkout: null }),
    }),
    {
      name: 'workout-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
