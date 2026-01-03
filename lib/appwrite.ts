import { Client, Account, Databases, TablesDB } from 'appwrite';

export const APPWRITE_CONFIG = {
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!,
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!,
  databaseId: '6957f22d0020b7ce54e4',
  collections: {
    profiles: 'profiles',
    exercises: 'exercises',
    templates: 'templates',
    workouts: 'workouts',
    workoutExercises: 'workout_exercises',
    workoutSets: 'workout_sets'
  }
};

export const client = new Client()
    .setProject(APPWRITE_CONFIG.projectId)
    .setEndpoint(APPWRITE_CONFIG.endpoint);

export const account = new Account(client);
export const databases = new Databases(client);
export const tablesDB = new TablesDB(client);
