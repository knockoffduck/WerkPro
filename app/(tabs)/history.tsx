import { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Calendar, ChevronRight, Clock, Box } from 'lucide-react-native';
import { Screen } from '../../components/ui/Screen';
import { databases, APPWRITE_CONFIG } from '../../lib/appwrite';
import { Query } from 'appwrite';
import { Workout } from '../../types';
import { Colors } from '../../constants/Colors';
import { useAuth } from '../../context/AuthContext';
import { format } from 'date-fns';

export default function History() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  const fetchHistory = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const response = await databases.listDocuments(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.collections.workouts,
        [
          Query.equal('user_id', user.$id),
          Query.orderDesc('start_time'),
          Query.limit(50),
        ]
      );
      setWorkouts(response.documents as unknown as Workout[]);
    } catch (error) {
      console.error('Failed to fetch history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [user]);

  const renderWorkoutItem = ({ item }: { item: Workout }) => (
    <TouchableOpacity 
      className="bg-card mb-4 p-4 rounded-2xl border border-border"
      activeOpacity={0.7}
    >
      <View className="flex-row justify-between items-start mb-2">
        <Text className="text-white text-lg font-bold">
          {item.name || 'Workout'}
        </Text>
        <Text className="text-subtext text-sm">
          {item.start_time ? format(new Date(item.start_time), 'MMM d, h:mm a') : ''}
        </Text>
      </View>

      <View className="flex-row items-center space-x-4">
        <View className="flex-row items-center mr-4">
          <Clock size={14} color={Colors.subtext} />
          <Text className="text-subtext text-xs ml-1">45m</Text>
        </View>
        <View className="flex-row items-center">
          <Box size={14} color={Colors.subtext} />
          <Text className="text-subtext text-xs ml-1">{item.volume_kg} kg</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <Screen>
      <View className="mb-6">
        <Text className="text-3xl font-bold text-white mb-2">History</Text>
        <Text className="text-subtext text-lg">Your past achievements</Text>
      </View>

      {isLoading ? (
        <ActivityIndicator color={Colors.primary} size="large" className="mt-8" />
      ) : (
        <FlatList
          data={workouts}
          keyExtractor={(item) => item.$id}
          renderItem={renderWorkoutItem}
          ListEmptyComponent={
            <View className="mt-20 items-center">
              <Calendar size={48} color={Colors.subtext} className="mb-4" />
              <Text className="text-subtext text-center text-lg">
                No workouts logged yet.
              </Text>
            </View>
          }
        />
      )}
    </Screen>
  );
}
