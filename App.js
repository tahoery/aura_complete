import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { Provider as PaperProvider } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

// Import screens
import ChatScreen from './src/screens/ChatScreen';
import CameraScreen from './src/screens/CameraScreen';
import VoiceScreen from './src/screens/VoiceScreen';
import LocationScreen from './src/screens/LocationScreen';
import SettingsScreen from './src/screens/SettingsScreen';

// Theme configuration
const theme = {
  colors: {
    primary: '#6200EE',
    accent: '#03DAC6',
    background: '#FFFFFF',
    surface: '#FFFFFF',
    text: '#000000',
    placeholder: '#666666',
  },
};

const Tab = createBottomTabNavigator();

function TabIcon({ name, color, size }) {
  return <Ionicons name={name} size={size} color={color} />;
}

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <StatusBar style="auto" />
        <Tab.Navigator
          initialRouteName="Chat"
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === 'Chat') {
                iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
              } else if (route.name === 'Camera') {
                iconName = focused ? 'camera' : 'camera-outline';
              } else if (route.name === 'Voice') {
                iconName = focused ? 'mic' : 'mic-outline';
              } else if (route.name === 'Location') {
                iconName = focused ? 'location' : 'location-outline';
              } else if (route.name === 'Settings') {
                iconName = focused ? 'settings' : 'settings-outline';
              }

              return <TabIcon name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: theme.colors.primary,
            tabBarInactiveTintColor: 'gray',
            headerStyle: {
              backgroundColor: theme.colors.primary,
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          })}
        >
          <Tab.Screen 
            name="Chat" 
            component={ChatScreen} 
            options={{ title: 'AURA Assistant' }}
          />
          <Tab.Screen 
            name="Camera" 
            component={CameraScreen} 
            options={{ title: 'Document Scanner' }}
          />
          <Tab.Screen 
            name="Voice" 
            component={VoiceScreen} 
            options={{ title: 'Voice Commands' }}
          />
          <Tab.Screen 
            name="Location" 
            component={LocationScreen} 
            options={{ title: 'Location AI' }}
          />
          <Tab.Screen 
            name="Settings" 
            component={SettingsScreen} 
            options={{ title: 'Settings' }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
