import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Activity, AlertTriangle, ListTodo, TerminalSquare } from 'lucide-react-native';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import InputScreen from '../screens/InputScreen';
import DetectionScreen from '../screens/DetectionScreen';
import ActionPlanScreen from '../screens/ActionPlanScreen';
import LogsScreen from '../screens/LogsScreen';
import { theme } from '../lib/theme';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: Platform.OS === 'ios' ? 30 : 18,
          left: 16,
          right: 16,
          height: 64,
          borderRadius: 20,
          backgroundColor: 'rgba(5, 5, 15, 0.88)',
          borderWidth: 1,
          borderColor: theme.colors.border,
          borderTopWidth: 1,
          borderTopColor: theme.colors.border,
          shadowColor: theme.colors.primary,
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.25,
          shadowRadius: 15,
          elevation: 10,
          paddingBottom: 0,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.dim,
        tabBarLabelStyle: {
          fontFamily: theme.fonts.semibold,
          fontSize: 10,
          marginBottom: 8,
        },
        tabBarIconStyle: {
          marginTop: 6,
        }
      }}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={InputScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <Activity color={color} size={size} />
        }}
      />
      <Tab.Screen 
        name="Detection" 
        component={DetectionScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <AlertTriangle color={color} size={size} />
        }}
      />
      <Tab.Screen 
        name="Actions" 
        component={ActionPlanScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <ListTodo color={color} size={size} />
        }}
      />
      <Tab.Screen 
        name="Logs" 
        component={LogsScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <TerminalSquare color={color} size={size} />
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    checkToken();
  }, []);

  const checkToken = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      setIsAuthenticated(!!token);
    } catch (e) {
      setIsAuthenticated(false);
    }
  };

  if (isAuthenticated === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#05050f' }}>
        <ActivityIndicator size="large" color="#00f0ff" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <>
            <Stack.Screen 
              name="Login" 
              component={LoginScreen} 
              initialParams={{ onLogin: () => setIsAuthenticated(true) }}
            />
            <Stack.Screen 
              name="Register" 
              component={RegisterScreen} 
              initialParams={{ onLogin: () => setIsAuthenticated(true) }}
            />
          </>
        ) : (
          <Stack.Screen name="MainTabs" component={MainTabs} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
