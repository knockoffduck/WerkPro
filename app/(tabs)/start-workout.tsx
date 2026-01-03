import { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Plus, Play, MoreHorizontal } from 'lucide-react-native';
import { Screen } from '../../components/ui/Screen';
import { Button } from '../../components/ui/Button';
import { databases, APPWRITE_CONFIG } from '../../lib/appwrite';
import { Query } from 'appwrite';
import { Template } from '../../types';
import { Colors } from '../../constants/Colors';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'expo-router';
import { useWorkoutStore } from '../../store/workoutStore';
import { useStartWorkout } from '../../hooks/useStartWorkout';
import { CreateTemplateModal } from '../../components/templates/CreateTemplateModal';
import { useTemplateStore } from '../../store/templateStore';

export default function StartWorkout() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isTemplateModalVisible, setIsTemplateModalVisible] = useState(false);
  const { user } = useAuth();
  const router = useRouter();
  const { startEmptyWorkout, startTemplate } = useStartWorkout();
  const { startNewTemplate, editTemplate } = useTemplateStore();

  const fetchTemplates = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const response = await databases.listDocuments(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.collections.templates,
        [
          Query.equal('user_id', user.$id),
          Query.orderDesc('$createdAt'),
        ]
      );
      setTemplates(response.documents as unknown as Template[]);
    } catch (error) {
      console.error('Failed to fetch templates:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, [user]);

  const handleCreateTemplate = () => {
    startNewTemplate();
    setIsTemplateModalVisible(true);
  };

  const handleEditTemplate = (template: Template) => {
    let exercises = [];
    if (template.data) {
      try {
        exercises = JSON.parse(template.data);
      } catch (e) {
        console.error('Failed to parse template data:', e);
      }
    }
    
    editTemplate({
      id: template.$id,
      name: template.name,
      exercises
    });
    setIsTemplateModalVisible(true);
  };

  const handleDeleteTemplate = (templateId: string) => {
    Alert.alert(
      'Delete Template',
      'Are you sure you want to delete this template? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          onPress: async () => {
            try {
              await databases.deleteDocument(
                APPWRITE_CONFIG.databaseId,
                APPWRITE_CONFIG.collections.templates,
                templateId
              );
              fetchTemplates();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete template');
            }
          }, 
          style: 'destructive' 
        }
      ]
    );
  };

  const renderTemplateItem = ({ item }: { item: Template }) => (
    <TouchableOpacity 
      className="bg-card mb-4 p-5 rounded-2xl border border-border"
      activeOpacity={0.7}
      onPress={() => startTemplate(item.$id)}
    >
      <View className="flex-row justify-between items-start mb-2">
        <Text className="text-white text-xl font-bold">{item.name}</Text>
        <TouchableOpacity 
          onPress={() => {
            Alert.alert(
              item.name,
              'Choose an action',
              [
                { text: 'Edit', onPress: () => handleEditTemplate(item) },
                { text: 'Delete', onPress: () => handleDeleteTemplate(item.$id), style: 'destructive' },
                { text: 'Cancel', style: 'cancel' }
              ]
            );
          }}
          className="p-2 -mr-2"
        >
          <MoreHorizontal size={20} color={Colors.subtext} />
        </TouchableOpacity>
      </View>
      <Text className="text-subtext mb-4">
        Last performed: Never
      </Text>
      <View className="flex-row items-center">
        <Play size={16} color={Colors.primary} fill={Colors.primary} />
        <Text className="text-primary font-semibold ml-2">Start Template</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <Screen scrollable>
      <View className="mb-8">
        <Text className="text-3xl font-bold text-white mb-2">Start Workout</Text>
        <Text className="text-subtext text-lg">Choose a template or start fresh</Text>
      </View>

      <View className="space-y-4 mb-8">
        <Button 
          title="Quick Start Empty Workout" 
          onPress={startEmptyWorkout}
        />
        <Button 
          title="Create New Template" 
          variant="secondary"
          onPress={handleCreateTemplate}
          className="mt-4"
        />
      </View>

      <Text className="text-white text-xl font-bold mb-4">My Templates</Text>

      {isLoading ? (
        <ActivityIndicator color={Colors.primary} size="large" className="mt-8" />
      ) : (
        <FlatList
          data={templates}
          keyExtractor={(item) => item.$id}
          renderItem={renderTemplateItem}
          scrollEnabled={false} // Container is scrollable
          ListEmptyComponent={
            <View className="bg-card p-8 rounded-2xl border border-dashed border-subtext/30 items-center">
              <Text className="text-subtext text-center">
                You haven't created any templates yet.
              </Text>
            </View>
          }
        />
      )}

      <CreateTemplateModal
        isVisible={isTemplateModalVisible}
        onClose={() => setIsTemplateModalVisible(false)}
        onSuccess={() => {
          fetchTemplates();
          setIsTemplateModalVisible(false);
        }}
      />
    </Screen>
  );
}
