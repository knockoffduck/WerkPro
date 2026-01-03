import { useState } from 'react';
import { View, Text, Alert, TouchableOpacity } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Screen } from '../../components/ui/Screen';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { account } from '../../lib/appwrite';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { checkSession } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      await account.createEmailPasswordSession(email, password);
      await checkSession();
      router.replace('/');
    } catch (error: any) {
      Alert.alert('Login Failed', error.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Screen className="justify-center">
      <View className="mb-8">
        <Text className="text-3xl font-bold text-white mb-2">Welcome Back</Text>
        <Text className="text-subtext text-lg">Log in to track your progress</Text>
      </View>

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
        title="Login"
        onPress={handleLogin}
        isLoading={isLoading}
        className="mt-4"
      />

      <View className="flex-row justify-center mt-6">
        <Text className="text-subtext">Don't have an account? </Text>
        <Link href="/(auth)/signup" asChild>
          <TouchableOpacity>
            <Text className="text-primary font-bold">Sign Up</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </Screen>
  );
}
