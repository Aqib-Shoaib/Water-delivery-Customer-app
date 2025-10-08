import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from './src/screens/Home';
import Browse from './src/screens/Browse';
import Orders from './src/screens/Orders';
import Login from './src/screens/Login';
import SignUp from './src/screens/SignUp';
import ForgotPassword from './src/screens/ForgotPassword';
import Otp from './src/screens/Otp';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { CartProvider } from './src/context/CartContext';
import Cart from './src/screens/Cart';
import Checkout from './src/screens/Checkout';
import Deals from './src/screens/Deals';
import About from './src/screens/About';
import Profile from './src/screens/Profile';
import OrderDetails from './src/screens/OrderDetails';
import Support from './src/screens/Support';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function AuthedStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#ffffff' },
        headerTintColor: '#dc2626',
      }}
    >
      <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
      <Stack.Screen name="OrderDetails" component={OrderDetails} options={{ title: 'Order Details' }} />
      <Stack.Screen name="SupportDetails" component={require('./src/screens/SupportDetails').default} options={{ title: 'Support Ticket' }} />
      <Stack.Screen name="Checkout" component={Checkout} />
    </Stack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#ffffff' },
        headerTintColor: '#dc2626',
        tabBarActiveTintColor: '#dc2626',
      }}
    >
      <Tab.Screen name="Browse" component={Browse} />
      <Tab.Screen name="Cart" component={Cart} />
      <Tab.Screen name="Orders" component={Orders} />
      <Tab.Screen name="Support" component={Support} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
}

function UnauthedStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#ffffff' },
        headerTintColor: '#dc2626',
      }}
    >
      <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
      <Stack.Screen name="SignUp" component={SignUp} options={{ title: 'Create Account' }} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={{ title: 'Forgot Password' }} />
      <Stack.Screen name="Otp" component={Otp} options={{ title: 'Reset Password' }} />
    </Stack.Navigator>
  );
}

const RedTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#dc2626',
    background: DefaultTheme.colors.background,
    card: DefaultTheme.colors.card,
    text: DefaultTheme.colors.text,
    border: DefaultTheme.colors.border,
    notification: '#dc2626',
  },
};

export default function App() {
  const { isAuthed, loading } = useAuth();
  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffff' }}>
        <ActivityIndicator size="large" color="#dc2626" />
        <Text style={{ marginTop: 12, color: '#6b7280' }}>Loading...</Text>
      </View>
    );
  }
  return isAuthed ? <AuthedStack /> : <UnauthedStack />;
}

export default function App() {
  const RedTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: '#dc2626',
      background: DefaultTheme.colors.background,
      card: DefaultTheme.colors.card,
      text: DefaultTheme.colors.text,
      border: DefaultTheme.colors.border,
      notification: '#dc2626',
    },
  };
  return (
    <AuthProvider>
      <CartProvider>
        <NavigationContainer theme={RedTheme}>
          <RootNavigator />
        </NavigationContainer>
      </CartProvider>
    </AuthProvider>
  );
}

