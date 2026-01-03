import { create } from 'zustand';
import { SetType } from '../types';

interface TemplateExercise {
  id: string;
  exerciseId: string;
  name: string;
  sets: {
    id: string;
    weight: string;
    reps: string;
    type: SetType;
  }[];
}

interface TemplateState {
  id?: string;
  name: string;
  exercises: TemplateExercise[];
}

interface TemplateStore {
  activeTemplate: TemplateState | null;
  startNewTemplate: () => void;
  editTemplate: (template: TemplateState) => void;
  setName: (name: string) => void;
  addExercise: (exerciseId: string, name: string) => void;
  removeExercise: (id: string) => void;
  addSet: (exerciseId: string) => void;
  removeSet: (exerciseId: string, setId: string) => void;
  updateSet: (exerciseId: string, setId: string, data: Partial<TemplateExercise['sets'][0]>) => void;
  clearTemplate: () => void;
}

export const useTemplateStore = create<TemplateStore>((set) => ({
  activeTemplate: null,

  startNewTemplate: () => set({
    activeTemplate: {
      name: 'New Template',
      exercises: []
    }
  }),

  editTemplate: (template) => set({ activeTemplate: template }),

  setName: (name) => set((state) => ({
    activeTemplate: state.activeTemplate ? { ...state.activeTemplate, name } : null
  })),

  addExercise: (exerciseId, name) => set((state) => {
    if (!state.activeTemplate) return state;
    const newExercise = {
      id: Math.random().toString(36).substr(2, 9),
      exerciseId,
      name,
      sets: [{
        id: Math.random().toString(36).substr(2, 9),
        weight: '',
        reps: '',
        type: 'normal' as SetType,
      }]
    };
    return {
      activeTemplate: {
        ...state.activeTemplate,
        exercises: [...state.activeTemplate.exercises, newExercise]
      }
    };
  }),

  removeExercise: (id) => set((state) => {
    if (!state.activeTemplate) return state;
    return {
      activeTemplate: {
        ...state.activeTemplate,
        exercises: state.activeTemplate.exercises.filter(e => e.id !== id)
      }
    };
  }),

  addSet: (exerciseId) => set((state) => {
    if (!state.activeTemplate) return state;
    const exercises = state.activeTemplate.exercises.map(ex => {
      if (ex.id === exerciseId) {
        const lastSet = ex.sets[ex.sets.length - 1];
        return {
          ...ex,
          sets: [...ex.sets, {
            id: Math.random().toString(36).substr(2, 9),
            weight: lastSet?.weight || '',
            reps: lastSet?.reps || '',
            type: 'normal' as SetType,
          }]
        };
      }
      return ex;
    });
    return { activeTemplate: { ...state.activeTemplate, exercises } };
  }),

  removeSet: (exerciseId, setId) => set((state) => {
    if (!state.activeTemplate) return state;
    const exercises = state.activeTemplate.exercises.map(ex => {
      if (ex.id === exerciseId) {
        return {
          ...ex,
          sets: ex.sets.filter(s => s.id !== setId)
        };
      }
      return ex;
    });
    return { activeTemplate: { ...state.activeTemplate, exercises } };
  }),

  updateSet: (exerciseId, setId, data) => set((state) => {
    if (!state.activeTemplate) return state;
    const exercises = state.activeTemplate.exercises.map(ex => {
      if (ex.id === exerciseId) {
        return {
          ...ex,
          sets: ex.sets.map(s => s.id === setId ? { ...s, ...data } : s)
        };
      }
      return ex;
    });
    return { activeTemplate: { ...state.activeTemplate, exercises } };
  }),

  clearTemplate: () => set({ activeTemplate: null }),
}));
