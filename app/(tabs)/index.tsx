import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Screen } from '../../components/ui/Screen';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { databases, APPWRITE_CONFIG } from '../../lib/appwrite';
import { Query } from 'appwrite';
import { Colors } from '../../constants/Colors';
import { Trophy, Activity, Calendar, LogOut } from 'lucide-react-native';
import { useStartWorkout } from '../../hooks/useStartWorkout';

export default function Home() {
  const { user, logout } = useAuth();
  const { startEmptyWorkout } = useStartWorkout();
  const [stats, setStats] = useState({
    totalWorkouts: 0,
    totalVolume: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchStats = async () => {
    if (!user) return;
    try {
      const response = await databases.listDocuments(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.collections.workouts,
        [Query.equal('user_id', user.$id)]
      );
      
      const totalVolume = response.documents.reduce((acc, doc: any) => acc + (doc.volume_kg || 0), 0);
      setStats({
        totalWorkouts: response.total,
        totalVolume,
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [user]);

  return (
    <Screen scrollable>
      <View className="flex-row justify-between items-center mb-8">
        <View>
          <Text className="text-subtext text-lg">Welcome back,</Text>
          <Text className="text-3xl font-bold text-white">{user?.name}</Text>
        </View>
        <TouchableOpacity 
          onPress={logout}
          className="bg-card p-3 rounded-full border border-border"
        >
          <LogOut size={20} color={Colors.error} />
        </TouchableOpacity>
      </View>

      <View className="flex-row space-x-4 mb-8">
        <View className="flex-1 bg-card p-4 rounded-2xl border border-border">
          <Activity size={24} color={Colors.primary} className="mb-2" />
          <Text className="text-white text-2xl font-bold">{stats.totalWorkouts}</Text>
          <Text className="text-subtext text-xs uppercase font-bold">Workouts</Text>
        </View>
        <View className="flex-1 bg-card p-4 rounded-2xl border border-border">
          <Trophy size={24} color="#FFD700" className="mb-2" />
          <Text className="text-white text-2xl font-bold">{stats.totalVolume.toLocaleString()} kg</Text>
          <Text className="text-subtext text-xs uppercase font-bold">Total Volume</Text>
        </View>
      </View>

      <Text className="text-white text-xl font-bold mb-4">Quick Actions</Text>
      <View className="space-y-4">
        <Button 
          title="Log a Workout" 
          onPress={startEmptyWorkout}
          className="mb-4"
        />
        <Button 
          title="Body Measurements" 
          variant="secondary"
        />
      </View>

      {/* Placeholder for Analytics Chart in next iteration */}
      <View className="mt-8 bg-card p-6 rounded-2xl border border-border border-dashed items-center">
        <Calendar size={32} color={Colors.subtext} className="mb-2" />
        <Text className="text-subtext text-center">
          Chart data will appear here after more workouts.
        </Text>
      </View>
    </Screen>
  );
}
