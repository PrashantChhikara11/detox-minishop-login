import { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { login } from '../auth';

type Props = {
  onLoginSuccess: (name: string) => void;
};

export function LoginScreen({ onLoginSuccess }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError(null);
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (result.ok) {
      onLoginSuccess(result.name);
    } else {
      setError(result.error);
    }
  };

  return (
    <View style={styles.container} testID="login-screen">
      <Text style={styles.title} testID="login-title">
        MiniShop
      </Text>
      <Text style={styles.subtitle}>Sign in to continue</Text>

      <TextInput
        testID="login-email-input"
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
      />
      <TextInput
        testID="login-password-input"
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        returnKeyType="done"
        onSubmitEditing={handleLogin}
      />

      {error ? (
        <Text style={styles.error} testID="login-error">
          {error}
        </Text>
      ) : null}

      <Pressable
        testID="login-button"
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
        onPress={handleLogin}
        disabled={loading}
        accessibilityRole="button"
      >
        {loading ? (
          <ActivityIndicator color="#fff" testID="login-loading" />
        ) : (
          <Text style={styles.buttonText}>Login</Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#f5f6fa',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
    color: '#1e272e',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#636e72',
    marginBottom: 32,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#dcdde1',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 12,
    color: '#1e272e',
  },
  error: {
    color: '#d63031',
    marginBottom: 12,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#0984e3',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
