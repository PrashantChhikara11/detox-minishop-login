import { Pressable, StyleSheet, Text, View } from 'react-native';

type Props = {
  userName: string;
  onLogout: () => void;
};

export function HomeScreen({ userName, onLogout }: Props) {
  return (
    <View style={styles.container} testID="home-screen">
      <Text style={styles.title} testID="home-welcome-text">
        Welcome, {userName}!
      </Text>
      <Text style={styles.subtitle}>You are logged in to MiniShop.</Text>

      <Pressable
        testID="logout-button"
        style={styles.button}
        onPress={onLogout}
        accessibilityRole="button"
      >
        <Text style={styles.buttonText}>Logout</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#f5f6fa',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1e272e',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#636e72',
    marginBottom: 32,
  },
  button: {
    borderWidth: 1,
    borderColor: '#0984e3',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 32,
  },
  buttonText: {
    color: '#0984e3',
    fontSize: 16,
    fontWeight: '600',
  },
});
