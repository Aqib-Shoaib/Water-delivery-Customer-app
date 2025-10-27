import { View, ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import { useEffect } from 'react';
import { NavigationContainer, useTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
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
import Profile from './src/screens/Profile';
import OrderDetails from './src/screens/OrderDetails';
import Support from './src/screens/Support';
import { ThemeProvider, useThemeContext } from './src/context/ThemeContext';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as SplashScreen from 'expo-splash-screen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function ToggleThemeButton() {
  const { mode, toggle } = useThemeContext();
  const { colors, dark } = useTheme();
  return (
    <TouchableOpacity onPress={toggle} style={{ paddingHorizontal: 12 }}>
      <Ionicons name={mode === 'dark' ? 'sunny' : 'moon'} size={22} color={colors.primary} />
    </TouchableOpacity>
  );
}

function AuthedStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTintColor: '#dc2626',
        headerRight: () => <ToggleThemeButton />,
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
        headerTintColor: '#dc2626',
        tabBarActiveTintColor: '#dc2626',
        headerRight: () => <ToggleThemeButton />,
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
        headerTintColor: '#dc2626',
        headerRight: () => <ToggleThemeButton />,
      }}
    >
      <Stack.Screen name="Login" component={Login} options={{ title: 'Login', headerShown: true }} />
      <Stack.Screen name="SignUp" component={SignUp} options={{ title: 'Create Account' }} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={{ title: 'Forgot Password' }} />
      <Stack.Screen name="Otp" component={Otp} options={{ title: 'Reset Password' }} />
    </Stack.Navigator>
  );
}

function RootNavigator() {
  const { isAuthed, loading } = useAuth();
  useEffect(() => {
    if (!loading) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [loading]);
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
  const ThemedContainer = () => {
    const { theme } = useThemeContext();
    return (
      <NavigationContainer theme={theme}>
        <RootNavigator />
      </NavigationContainer>
    );
  };
  useEffect(() => {
    SplashScreen.preventAutoHideAsync().catch(() => {});
  }, []);
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <ThemedContainer />
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

