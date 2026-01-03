import { useState } from 'react';
import { View, Text, Alert, TouchableOpacity } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Screen } from '../../components/ui/Screen';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { account, databases, APPWRITE_CONFIG, tablesDB } from '../../lib/appwrite';
import { ID } from 'appwrite';
import { useAuth } from '../../context/AuthContext';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { checkSession } = useAuth();
  const router = useRouter();

  const handleSignup = async () => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      // 1. Create User Account
      const user = await account.create(ID.unique(), email, password, name);
      
      // 2. Create Session
      await account.createEmailPasswordSession(email, password);
      
      // 3. Create User Profile in Database
      await tablesDB.createRow({
        databaseId: APPWRITE_CONFIG.databaseId,
        tableId: APPWRITE_CONFIG.collections.profiles,
        rowId: ID.unique(),
        data: {
          user_id: user.$id,
          default_unit: 'kg',
          timer_duration_sec: 120
        }
      });

      await checkSession();
      router.replace('/');
    } catch (error: any) {
      Alert.alert('Signup Failed', error.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Screen className="justify-center">
      <View className="mb-8">
        <Text className="text-3xl font-bold text-white mb-2">Create Account</Text>
        <Text className="text-subtext text-lg">Join WerkPro today</Text>
      </View>

      <Input
        label="Name"
        placeholder="Enter your name"
        value={name}
        onChangeText={setName}
      />

      <Input
        label="Email"
        placeholder="your@email.com"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <Input
        label="Password"
        placeholder="••••••••"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Button
        title="Sign Up"
        onPress={handleSignup}
        isLoading={isLoading}
        className="mt-4"
      />

      <View className="flex-row justify-center mt-6">
        <Text className="text-subtext">Already have an account? </Text>
        <Link href="/(auth)/login" asChild>
          <TouchableOpacity>
            <Text className="text-primary font-bold">Login</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </Screen>
  );
}
