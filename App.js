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
import { StripeProvider } from '@stripe/stripe-react-native';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function ToggleThemeButton() {
  const { mode, toggle } = useThemeContext();
  const { colors } = useTheme();
  return (
    <TouchableOpacity onPress={toggle} style={{ paddingHorizontal: 12 }}>
      <Ionicons name={mode === 'dark' ? 'sunny' : 'moon'} size={22} color={colors.primary} />
    </TouchableOpacity>
  );
}

function AuthedStack() {
  const { colors } = useTheme();
  return (
    <Stack.Navigator
      screenOptions={{
        headerTintColor: colors.primary,
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
  const { colors } = useTheme();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerTintColor: colors.primary,
        tabBarActiveTintColor: colors.primary,
        headerRight: () => <ToggleThemeButton />,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Browse') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'Cart') iconName = focused ? 'cart' : 'cart-outline';
          else if (route.name === 'Orders') iconName = focused ? 'clipboard' : 'clipboard-outline';
          else if (route.name === 'Support') iconName = focused ? 'headset' : 'headset-outline';
          else if (route.name === 'Profile') iconName = focused ? 'person' : 'person-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
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
  const { colors } = useTheme();
  return (
    <Stack.Navigator
      screenOptions={{
        headerTintColor: colors.primary,
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
  const { colors } = useTheme();
  
  useEffect(() => {
    if (!loading) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [loading]);
  
  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ marginTop: 12, color: colors.textSecondary }}>Loading...</Text>
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
  
  const STRIPE_KEY = process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || '';

  return (
    <StripeProvider 
      publishableKey={STRIPE_KEY}
      merchantIdentifier="merchant.com.waterdelivery" // optional, for Apple Pay
    >
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <ThemedContainer />
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </StripeProvider>
  );
}

