import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Activity, AlertTriangle, ListTodo, TerminalSquare } from 'lucide-react-native';

import LoginScreen from '../screens/LoginScreen';
import InputScreen from '../screens/InputScreen';
import DetectionScreen from '../screens/DetectionScreen';
import ActionPlanScreen from '../screens/ActionPlanScreen';
import LogsScreen from '../screens/LogsScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#020208', borderBottomWidth: 1, borderBottomColor: '#1a2235' },
        headerTintColor: '#00f0ff',
        headerTitleStyle: { fontWeight: 'bold', letterSpacing: 2 },
        tabBarStyle: { backgroundColor: '#020208', borderTopWidth: 1, borderTopColor: '#1a2235', paddingBottom: 5 },
        tabBarActiveTintColor: '#00f0ff',
        tabBarInactiveTintColor: '#7a8baa',
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
          <Stack.Screen 
            name="Login" 
            component={LoginScreen} 
            initialParams={{ onLogin: () => setIsAuthenticated(true) }}
          />
        ) : (
          <Stack.Screen name="MainTabs" component={MainTabs} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
