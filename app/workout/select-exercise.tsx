import { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Pressable, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Plus, X } from 'lucide-react-native';
import { Screen } from '../../components/ui/Screen';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { databases, APPWRITE_CONFIG } from '../../lib/appwrite';
import { Query } from 'appwrite';
import { Exercise } from '../../types';
import { Colors } from '../../constants/Colors';
import { seedExercises } from '../../lib/seeds';

import { useWorkoutStore } from '../../store/workoutStore';
import { useRouter } from 'expo-router';
import { CreateExerciseModal } from '../../components/exercises/CreateExerciseModal';

export default function SelectExerciseModal() {
  const [allExercises, setAllExercises] = useState<Exercise[]>([]);
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSeeding, setIsSeeding] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { activeWorkout, addExercise } = useWorkoutStore();
  const router = useRouter();

  const handleSeed = async () => {
    setIsSeeding(true);
    const result = await seedExercises();
    if (result.success) {
      await fetchExercises();
    }
    setIsSeeding(false);
  };

  const fetchExercises = async () => {
    setIsLoading(true);
    try {
      const response = await databases.listDocuments(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.collections.exercises,
        [
          Query.orderAsc('name'),
          Query.limit(500),
        ]
      );
      const docs = response.documents as unknown as Exercise[];
      setAllExercises(docs);
      setFilteredExercises(docs);
    } catch (error) {
      console.error('Failed to fetch exercises:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExercises();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredExercises(allExercises);
    } else {
      const lowerQuery = searchQuery.toLowerCase();
      const normalizedQuery = lowerQuery.replace(/\s+/g, '');
      
      const filtered = allExercises.filter(ex => {
        const name = ex.name.toLowerCase();
        const target = ex.target_body_part?.toLowerCase() || '';
        const category = ex.category?.toLowerCase() || '';
        
        // Match original and normalized (ignoring spaces)
        return (
          name.includes(lowerQuery) || 
          name.replace(/\s+/g, '').includes(normalizedQuery) ||
          target.includes(lowerQuery) ||
          target.replace(/\s+/g, '').includes(normalizedQuery) ||
          category.includes(lowerQuery) ||
          category.replace(/\s+/g, '').includes(normalizedQuery)
        );
      });
      setFilteredExercises(filtered);
    }
  }, [searchQuery, allExercises]);

  const handleExercisePress = (exercise: Exercise) => {
    if (activeWorkout) {
      addExercise(exercise.$id, exercise.name);
      router.back();
    }
  };

  const renderExerciseItem = ({ item }: { item: Exercise }) => (
    <TouchableOpacity 
      className="bg-card mb-3 p-4 rounded-xl flex-row justify-between items-center border border-border"
      activeOpacity={0.7}
      onPress={() => handleExercisePress(item)}
    >
      <View>
        <Text className="text-white text-lg font-semibold">{item.name}</Text>
        <Text className="text-subtext text-sm">
          {item.target_body_part || 'Full Body'} • {item.category || 'Other'}
        </Text>
      </View>
      <Plus size={20} color={Colors.primary} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 justify-center items-center px-4 bg-black/60">
      <TouchableOpacity 
        className="absolute inset-0" 
        activeOpacity={1} 
        onPress={() => router.back()} 
      />
      
      <View className="w-full h-[80%] bg-card rounded-3xl overflow-hidden border border-border shadow-2xl">
        <Pressable onPress={Keyboard.dismiss} accessible={false} className="flex-1">
          <View className="px-4 py-4 border-b border-border bg-background flex-row items-center gap-3">
          <TouchableOpacity 
            onPress={() => setIsModalVisible(true)}
            className="p-1"
          >
            <Plus size={24} color={Colors.primary} />
          </TouchableOpacity>
          <View className="flex-1 relative">
            <View className="absolute left-3 top-3 z-10">
              <Search size={18} color={Colors.subtext} />
            </View>
            <Input
              placeholder="Search exercises..."
              className="pl-10 h-10 py-0"
              containerClassName="mb-0"
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
            />
          </View>
          <TouchableOpacity onPress={() => router.back()} className="p-1">
            <X size={24} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        {isLoading && allExercises.length === 0 ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator color={Colors.primary} size="large" />
          </View>
        ) : (
          <FlatList
            data={filteredExercises}
            keyExtractor={(item) => item.$id}
            renderItem={renderExerciseItem}
            contentContainerStyle={{ padding: 16 }}
            keyboardDismissMode="on-drag"
            keyboardShouldPersistTaps="handled"
            ListEmptyComponent={
              <View className="flex-1 justify-center items-center mt-10 px-6">
                <Text className="text-subtext text-center text-lg mb-6">
                  {searchQuery ? 'No exercises found.' : 'Your exercise library is empty.'}
                </Text>
                {!searchQuery && (
                  <Button 
                    title={isSeeding ? "Seeding..." : "Seed Default Exercises"} 
                    onPress={handleSeed}
                    isLoading={isSeeding}
                    className="w-full"
                  />
                )}
              </View>
            }
          />
        )}
        </Pressable>
      </View>

      <CreateExerciseModal 
        isVisible={isModalVisible} 
        onClose={() => setIsModalVisible(false)}
        onSuccess={(newExercise: Exercise) => {
          setAllExercises(prev => [newExercise, ...prev]);
          // Automatically select it if we want, or just let them find it at the top
          handleExercisePress(newExercise);
        }}
      />
    </SafeAreaView>
  );
}
