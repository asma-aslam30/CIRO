import React, { useState, useEffect } from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import { useFonts, Outfit_400Regular, Outfit_600SemiBold, Outfit_700Bold } from '@expo-google-fonts/outfit';
import { View, ActivityIndicator } from 'react-native';

export default function App() {
  const [fontsLoaded] = useFonts({
    Outfit_400Regular,
    Outfit_600SemiBold,
    Outfit_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, backgroundColor: '#05050f', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#00f0ff" />
      </View>
    );
  }

  return <AppNavigator />;
}
