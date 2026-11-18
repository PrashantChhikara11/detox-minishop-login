/**
 * MiniShop: a small sample app built to practise Detox E2E testing.
 * Navigation is plain React state (no navigation library) to keep native deps minimal.
 *
 * @format
 */

import { useState } from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { HomeScreen } from './src/screens/HomeScreen';
import { LoginScreen } from './src/screens/LoginScreen';

function App() {
  const [userName, setUserName] = useState<string | null>(null);

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.container}>
        {userName ? (
          <HomeScreen userName={userName} onLogout={() => setUserName(null)} />
        ) : (
          <LoginScreen onLoginSuccess={setUserName} />
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
  },
});

export default App;
