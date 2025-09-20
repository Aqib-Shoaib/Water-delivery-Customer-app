import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './src/screens/Home';
import Browse from './src/screens/Browse';
import Orders from './src/screens/Orders';
import Login from './src/screens/Login';
import { AuthProvider, useAuth } from './src/context/AuthContext';

const Stack = createNativeStackNavigator();

function AuthedStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Browse" component={Browse} />
      <Stack.Screen name="Orders" component={Orders} />
    </Stack.Navigator>
  );
}

function UnauthedStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

function RootNavigator() {
  const { isAuthed, loading } = useAuth();
  if (loading) return null; // could render splash
  return isAuthed ? <AuthedStack /> : <UnauthedStack />;
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}
