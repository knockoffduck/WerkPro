import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView, Alert, Pressable, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X } from 'lucide-react-native';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Colors } from '../../constants/Colors';
import { databases, APPWRITE_CONFIG, tablesDB } from '../../lib/appwrite';
import { useAuth } from '../../context/AuthContext';

interface CreateExerciseModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSuccess: (exercise: any) => void;
}

const BODYPARTS = [
  'Arms', 'Back', 'Cardio', 'Chest', 'Core', 
  'Full Body', 'Legs', 'Olympic', 'Other', 'Shoulders'
];

const CATEGORIES = [
  'Barbell', 'Dumbbell', 'Machine', 'Cable', 
  'Weighted Bodyweight', 'Assisted Bodyweight', 
  'Reps Only', 'Cardio', 'Duration'
];

export function CreateExerciseModal({ isVisible, onClose, onSuccess }: CreateExerciseModalProps) {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [selectedBodypart, setSelectedBodypart] = useState('Other');
  const [selectedCategory, setSelectedCategory] = useState('Machine');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter an exercise name.');
      return;
    }

    if (!user) {
      Alert.alert('Error', 'You must be logged in to create an exercise.');
      return;
    }

    setIsSubmitting(true);
    try {
      const exercise = await tablesDB.createRow({
        databaseId: APPWRITE_CONFIG.databaseId,
        tableId: APPWRITE_CONFIG.collections.exercises,
        rowId: 'unique()',
        data: {
          name: name.trim(),
          target_body_part: selectedBodypart,
          category: selectedCategory,
          user_id: user.$id,
        },
      });

      onSuccess(exercise);
      setName('');
      setSelectedBodypart('Other');
      setSelectedCategory('Machine');
      onClose();
    } catch (error: any) {
      Alert.alert('Error', 'Failed to create exercise: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <SafeAreaView className="flex-1 justify-end bg-black/50" edges={['bottom']}>
        <TouchableOpacity 
          className="flex-1" 
          activeOpacity={1} 
          onPress={onClose} 
        />
        <View className="bg-card rounded-t-3xl p-6 border-t border-border shadow-2xl">
          <Pressable onPress={Keyboard.dismiss} accessible={false}>
            <View className="flex-row justify-between items-center mb-6">
            <Text className="text-white text-2xl font-bold">New Exercise</Text>
            <TouchableOpacity onPress={onClose} className="p-2">
              <X size={24} color={Colors.subtext} />
            </TouchableOpacity>
          </View>

          <ScrollView 
            showsVerticalScrollIndicator={false} 
            className="max-h-[80vh]"
            keyboardDismissMode="on-drag"
            keyboardShouldPersistTaps="handled"
          >
            <View className="mb-6">
              <Text className="text-subtext text-xs font-bold uppercase mb-2 ml-1">Name</Text>
              <Input
                placeholder="e.g. Incline Bench Press"
                value={name}
                onChangeText={setName}
                autoFocus
              />
            </View>

            <View className="mb-6">
              <Text className="text-subtext text-xs font-bold uppercase mb-2 ml-1">Bodypart</Text>
              <View className="flex-row flex-wrap gap-2">
                {BODYPARTS.map((bp) => (
                  <TouchableOpacity
                    key={bp}
                    onPress={() => setSelectedBodypart(bp)}
                    className={`px-4 py-2 rounded-full border ${
                      selectedBodypart === bp 
                        ? 'bg-primary border-primary' 
                        : 'bg-background border-border'
                    }`}
                  >
                    <Text className={`text-sm font-medium ${
                      selectedBodypart === bp ? 'text-white' : 'text-subtext'
                    }`}>
                      {bp}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View className="mb-8">
              <Text className="text-subtext text-xs font-bold uppercase mb-2 ml-1">Category</Text>
              <View className="flex-row flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    onPress={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-full border ${
                      selectedCategory === cat 
                        ? 'bg-primary border-primary' 
                        : 'bg-background border-border'
                    }`}
                  >
                    <Text className={`text-sm font-medium ${
                      selectedCategory === cat ? 'text-white' : 'text-subtext'
                    }`}>
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <Button
              title="Create Exercise"
              onPress={handleCreate}
              isLoading={isSubmitting}
              className="mb-10"
            />
          </ScrollView>
          </Pressable>
        </View>
      </SafeAreaView>
    </Modal>
  );
}
