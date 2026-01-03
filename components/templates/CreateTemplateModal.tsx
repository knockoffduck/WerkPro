import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView, Alert, Pressable, Keyboard, TextInput } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { X, Plus, ChevronDown, Calculator } from 'lucide-react-native';
import { Button } from '../ui/Button';
import { Colors } from '../../constants/Colors';
import { useTemplateStore } from '../../store/templateStore';
import { TemplateSetRow } from './TemplateSetRow';
import { CustomNumberPad } from '../keyboard/CustomNumberPad';
import { SwipeableExerciseHeader } from '../active-workout/SwipeableExerciseHeader';
import { databases, APPWRITE_CONFIG, tablesDB } from '../../lib/appwrite';
import { useAuth } from '../../context/AuthContext';

interface CreateTemplateModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateTemplateModal({ isVisible, onClose, onSuccess }: CreateTemplateModalProps) {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const { 
    activeTemplate, 
    setName, 
    addSet, 
    removeSet, 
    updateSet, 
    removeExercise ,
    clearTemplate,
    addExercise
  } = useTemplateStore();

  const [focusedInput, setFocusedInput] = useState<{ exerciseId: string; setId: string; field: 'weight' | 'reps' } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // For simplified exercise selection within this modal
  const [isAddingExercise, setIsAddingExercise] = useState(false);
  const [exercises, setExercises] = useState<any[]>([]);

  useEffect(() => {
    if (isVisible) {
      fetchExercises();
    }
  }, [isVisible]);

  const fetchExercises = async () => {
    try {
      const response = await databases.listDocuments(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.collections.exercises,
      );
      setExercises(response.documents);
    } catch (error) {
      console.error('Failed to fetch exercises:', error);
    }
  };

  const handleKeyPress = (key: string) => {
    if (!focusedInput) return;
    const { exerciseId, setId, field } = focusedInput;
    const exercise = activeTemplate?.exercises.find(e => e.id === exerciseId);
    if (!exercise) return;
    const set = exercise.sets.find(s => s.id === setId);
    if (!set) return;

    const currentValue = (set as any)[field] || '';
    if (key === '.' && currentValue.includes('.')) return;
    
    updateSet(exerciseId, setId, { [field]: currentValue + key });
  };

  const handleDeleteLetter = () => {
    if (!focusedInput) return;
    const { exerciseId, setId, field } = focusedInput;
    const exercise = activeTemplate?.exercises.find(e => e.id === exerciseId);
    if (!exercise) return;
    const set = exercise.sets.find(s => s.id === setId);
    if (!set) return;

    const currentValue = (set as any)[field] || '';
    updateSet(exerciseId, setId, { [field]: currentValue.slice(0, -1) });
  };

  const handleNext = () => {
    if (!focusedInput) return;
    const { exerciseId, setId, field } = focusedInput;
    const exercise = activeTemplate?.exercises.find(e => e.id === exerciseId);
    if (!exercise) return;
    const setIndex = exercise.sets.findIndex(s => s.id === setId);

    if (field === 'weight') {
      setFocusedInput({ exerciseId, setId, field: 'reps' });
    } else {
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

  const handleSave = async () => {
    if (!activeTemplate || activeTemplate.exercises.length === 0) {
      Alert.alert('Error', 'Add at least one exercise to the template.');
      return;
    }

    if (!user) return;

    setIsSubmitting(true);
    try {
      if (activeTemplate.id) {
        // Update Template Document
        await databases.updateDocument(
          APPWRITE_CONFIG.databaseId,
          APPWRITE_CONFIG.collections.templates,
          activeTemplate.id,
          {
            name: activeTemplate.name,
            data: JSON.stringify(activeTemplate.exercises),
          }
        );
      } else {
        // Create Template Document
        await tablesDB.createRow({
          databaseId: APPWRITE_CONFIG.databaseId,
          tableId: APPWRITE_CONFIG.collections.templates,
          rowId: 'unique()',
          data: {
            user_id: user.$id,
            name: activeTemplate.name,
            data: JSON.stringify(activeTemplate.exercises),
          }
        });
      }

      onSuccess();
      onClose();
      clearTemplate();
    } catch (error: any) {
      Alert.alert('Error', 'Failed to save template: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!activeTemplate) return null;

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black" style={{ paddingTop: insets.top }}>
        <View className="px-4 py-4 flex-row justify-between items-center border-b border-border">
          <TouchableOpacity onPress={onClose} className="p-2">
            <X size={24} color={Colors.primary} />
          </TouchableOpacity>
          <TextInput
            className="flex-1 text-white text-xl font-bold mx-4 text-center"
            value={activeTemplate.name}
            onChangeText={setName}
            placeholder="Template Name"
            placeholderTextColor={Colors.subtext}
          />
          <Button 
            title="Save" 
            onPress={handleSave} 
            isLoading={isSubmitting}
            className="h-10 w-20 rounded-lg"
          />
        </View>

        <ScrollView 
          className="flex-1 px-4" 
          contentContainerStyle={{ 
            paddingTop: 16,
            paddingBottom: focusedInput ? 0 : 40 
          }}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="always"
        >
          {activeTemplate.exercises.map((exercise) => (
            <View key={exercise.id} className="mb-6">
              <SwipeableExerciseHeader 
                exerciseName={exercise.name} 
                onAddSet={() => addSet(exercise.id)}
                onDelete={() => removeExercise(exercise.id)}
              />

              <View className="flex-row px-4 mb-2">
                <Text className="w-10 text-subtext text-xs font-bold uppercase">Set</Text>
                <Text className="flex-1 text-subtext text-xs font-bold uppercase">Type</Text>
                <Text className="w-20 text-subtext text-xs font-bold uppercase text-center">kg</Text>
                <Text className="w-20 text-subtext text-xs font-bold uppercase text-center">Reps</Text>
                <View className="w-10" />
              </View>

              {exercise.sets.map((set, index) => (
                <TemplateSetRow
                  key={set.id}
                  index={index}
                  weight={set.weight}
                  reps={set.reps}
                  type={set.type}
                  onFocusWeight={() => setFocusedInput({ exerciseId: exercise.id, setId: set.id, field: 'weight' })}
                  onFocusReps={() => setFocusedInput({ exerciseId: exercise.id, setId: set.id, field: 'reps' })}
                  onRemoveSet={() => removeSet(exercise.id, set.id)}
                  isFocusedWeight={focusedInput?.setId === set.id && focusedInput?.field === 'weight'}
                  isFocusedReps={focusedInput?.setId === set.id && focusedInput?.field === 'reps'}
                />
              ))}
            </View>
          ))}

          <Button 
            title="Add Exercise" 
            variant="secondary" 
            onPress={() => setIsAddingExercise(true)}
            className="mt-4 mb-10"
          />
        </ScrollView>

        {focusedInput && (
          <CustomNumberPad
            onPress={handleKeyPress}
            onDelete={handleDeleteLetter}
            onNext={handleNext}
            onHide={() => setFocusedInput(null)}
          />
        )}

        {/* Simplified Exercise Picker Modal */}
        <Modal visible={isAddingExercise} animationType="slide" transparent={true}>
          <View className="flex-1 justify-end bg-black/50">
            <TouchableOpacity className="flex-1" onPress={() => setIsAddingExercise(false)} />
            <View 
              className="bg-card rounded-t-3xl p-6 h-[70%]"
              style={{ paddingBottom: Math.max(insets.bottom, 16) }}
            >
              <Text className="text-white text-xl font-bold mb-4">Select Exercise</Text>
              <ScrollView>
                {exercises.map((ex) => (
                  <TouchableOpacity 
                    key={ex.$id} 
                    className="py-4 border-b border-border"
                    onPress={() => {
                      addExercise(ex.$id, ex.name);
                      setIsAddingExercise(false);
                    }}
                  >
                    <Text className="text-white text-lg">{ex.name}</Text>
                    <Text className="text-subtext text-sm">{ex.target_body_part} • {ex.category}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <Button title="Close" variant="outline" onPress={() => setIsAddingExercise(false)} className="mt-4" />
            </View>
          </View>
        </Modal>
      </View>
    </Modal>
  );
}
