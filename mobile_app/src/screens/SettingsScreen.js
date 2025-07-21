import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { 
  Button, 
  Card, 
  Title, 
  Paragraph, 
  Switch, 
  TextInput,
  List,
  Divider,
  Avatar
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SettingsScreen() {
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    voiceResponses: true,
    locationTracking: true,
    autoSave: true,
    highQualityCamera: true,
    offlineMode: false,
  });

  const [aiConfig, setAiConfig] = useState({
    apiKey: '',
    model: 'gpt-3.5-turbo',
    temperature: 0.7,
    maxTokens: 1000,
  });

  const [userProfile, setUserProfile] = useState({
    name: 'User',
    email: '',
    preferences: '',
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedSettings = await AsyncStorage.getItem('@aura_settings');
      const savedAiConfig = await AsyncStorage.getItem('@aura_ai_config');
      const savedProfile = await AsyncStorage.getItem('@aura_user_profile');
      
      if (savedSettings) setSettings(JSON.parse(savedSettings));
      if (savedAiConfig) setAiConfig(JSON.parse(savedAiConfig));
      if (savedProfile) setUserProfile(JSON.parse(savedProfile));
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  const saveSettings = async () => {
    try {
      await AsyncStorage.setItem('@aura_settings', JSON.stringify(settings));
      await AsyncStorage.setItem('@aura_ai_config', JSON.stringify(aiConfig));
      await AsyncStorage.setItem('@aura_user_profile', JSON.stringify(userProfile));
      
      Alert.alert('Success', 'Settings saved successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to save settings');
    }
  };

  const resetSettings = () => {
    Alert.alert(
      'Reset Settings',
      'Are you sure you want to reset all settings to default?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reset', 
          style: 'destructive',
          onPress: () => {
            setSettings({
              notifications: true,
              darkMode: false,
              voiceResponses: true,
              locationTracking: true,
              autoSave: true,
              highQualityCamera: true,
              offlineMode: false,
            });
            setAiConfig({
              apiKey: '',
              model: 'gpt-3.5-turbo',
              temperature: 0.7,
              maxTokens: 1000,
            });
            setUserProfile({
              name: 'User',
              email: '',
              preferences: '',
            });
          }
        }
      ]
    );
  };

  const clearData = () => {
    Alert.alert(
      'Clear All Data',
      'This will delete all conversations, automations, and cached data. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear', 
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.multiRemove([
                '@aura_conversations',
                '@aura_automations',
                '@aura_cache'
              ]);
              Alert.alert('Success', 'All data cleared successfully!');
            } catch (error) {
              Alert.alert('Error', 'Failed to clear data');
            }
          }
        }
      ]
    );
  };

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const updateAiConfig = (key, value) => {
    setAiConfig(prev => ({ ...prev, [key]: value }));
  };

  const updateProfile = (key, value) => {
    setUserProfile(prev => ({ ...prev, [key]: value }));
  };

  const availableModels = [
    'gpt-3.5-turbo',
    'gpt-4',
    'claude-3-sonnet',
    'gemini-pro'
  ];

  return (
    <LinearGradient
      colors={['#6200EE', '#3700B3', '#FFFFFF']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* User Profile */}
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.profileHeader}>
              <Avatar.Icon size={64} icon="account" />
              <View style={styles.profileInfo}>
                <Title>User Profile</Title>
                <Paragraph>Customize your AURA experience</Paragraph>
              </View>
            </View>
            
            <TextInput
              label="Name"
              value={userProfile.name}
              onChangeText={(value) => updateProfile('name', value)}
              mode="outlined"
              style={styles.input}
            />
            
            <TextInput
              label="Email"
              value={userProfile.email}
              onChangeText={(value) => updateProfile('email', value)}
              mode="outlined"
              keyboardType="email-address"
              style={styles.input}
            />
            
            <TextInput
              label="Preferences & Context"
              value={userProfile.preferences}
              onChangeText={(value) => updateProfile('preferences', value)}
              mode="outlined"
              multiline
              numberOfLines={3}
              placeholder="Tell AURA about your preferences, work, interests, etc."
              style={styles.input}
            />
          </Card.Content>
        </Card>

        {/* AI Configuration */}
        <Card style={styles.card}>
          <Card.Content>
            <Title>AI Configuration</Title>
            
            <TextInput
              label="AI API Key"
              value={aiConfig.apiKey}
              onChangeText={(value) => updateAiConfig('apiKey', value)}
              mode="outlined"
              secureTextEntry
              placeholder="Enter your AI service API key"
              style={styles.input}
            />
            
            <View style={styles.pickerContainer}>
              <Paragraph>AI Model</Paragraph>
              {availableModels.map((model) => (
                <List.Item
                  key={model}
                  title={model}
                  left={() => (
                    <List.Icon icon={aiConfig.model === model ? "radiobox-marked" : "radiobox-blank"} />
                  )}
                  onPress={() => updateAiConfig('model', model)}
                />
              ))}
            </View>
            
            <TextInput
              label={`Creativity Level (${aiConfig.temperature})`}
              value={aiConfig.temperature.toString()}
              onChangeText={(value) => updateAiConfig('temperature', parseFloat(value) || 0.7)}
              mode="outlined"
              keyboardType="decimal-pad"
              placeholder="0.0 (conservative) to 1.0 (creative)"
              style={styles.input}
            />
            
            <TextInput
              label="Max Response Length"
              value={aiConfig.maxTokens.toString()}
              onChangeText={(value) => updateAiConfig('maxTokens', parseInt(value) || 1000)}
              mode="outlined"
              keyboardType="numeric"
              style={styles.input}
            />
          </Card.Content>
        </Card>

        {/* App Settings */}
        <Card style={styles.card}>
          <Card.Content>
            <Title>App Settings</Title>
            
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Paragraph style={styles.settingTitle}>Notifications</Paragraph>
                <Paragraph style={styles.settingDescription}>Get alerts and reminders</Paragraph>
              </View>
              <Switch 
                value={settings.notifications} 
                onValueChange={(value) => updateSetting('notifications', value)} 
              />
            </View>
            
            <Divider style={styles.divider} />
            
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Paragraph style={styles.settingTitle}>Dark Mode</Paragraph>
                <Paragraph style={styles.settingDescription}>Use dark theme</Paragraph>
              </View>
              <Switch 
                value={settings.darkMode} 
                onValueChange={(value) => updateSetting('darkMode', value)} 
              />
            </View>
            
            <Divider style={styles.divider} />
            
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Paragraph style={styles.settingTitle}>Voice Responses</Paragraph>
                <Paragraph style={styles.settingDescription}>Speak AI responses aloud</Paragraph>
              </View>
              <Switch 
                value={settings.voiceResponses} 
                onValueChange={(value) => updateSetting('voiceResponses', value)} 
              />
            </View>
            
            <Divider style={styles.divider} />
            
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Paragraph style={styles.settingTitle}>Location Tracking</Paragraph>
                <Paragraph style={styles.settingDescription}>Enable location-based features</Paragraph>
              </View>
              <Switch 
                value={settings.locationTracking} 
                onValueChange={(value) => updateSetting('locationTracking', value)} 
              />
            </View>
            
            <Divider style={styles.divider} />
            
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Paragraph style={styles.settingTitle}>Auto-save Conversations</Paragraph>
                <Paragraph style={styles.settingDescription}>Automatically save chat history</Paragraph>
              </View>
              <Switch 
                value={settings.autoSave} 
                onValueChange={(value) => updateSetting('autoSave', value)} 
              />
            </View>
            
            <Divider style={styles.divider} />
            
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Paragraph style={styles.settingTitle}>High Quality Camera</Paragraph>
                <Paragraph style={styles.settingDescription}>Use highest camera resolution</Paragraph>
              </View>
              <Switch 
                value={settings.highQualityCamera} 
                onValueChange={(value) => updateSetting('highQualityCamera', value)} 
              />
            </View>
            
            <Divider style={styles.divider} />
            
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Paragraph style={styles.settingTitle}>Offline Mode</Paragraph>
                <Paragraph style={styles.settingDescription}>Use cached responses when offline</Paragraph>
              </View>
              <Switch 
                value={settings.offlineMode} 
                onValueChange={(value) => updateSetting('offlineMode', value)} 
              />
            </View>
          </Card.Content>
        </Card>

        {/* About */}
        <Card style={styles.card}>
          <Card.Content>
            <Title>About AURA</Title>
            <Paragraph style={styles.aboutText}>
              AURA AI Assistant v1.0.0{'\n'}
              Your intelligent companion for chat, voice commands, document scanning, and location-based automation.
            </Paragraph>
            
            <View style={styles.aboutLinks}>
              <Button mode="outlined" style={styles.linkButton}>
                Privacy Policy
              </Button>
              <Button mode="outlined" style={styles.linkButton}>
                Terms of Service
              </Button>
              <Button mode="outlined" style={styles.linkButton}>
                Help & Support
              </Button>
            </View>
          </Card.Content>
        </Card>

        {/* Action Buttons */}
        <Card style={styles.card}>
          <Card.Content>
            <Button 
              mode="contained" 
              onPress={saveSettings}
              style={styles.actionButton}
              icon="content-save"
            >
              Save Settings
            </Button>
            
            <Button 
              mode="outlined" 
              onPress={resetSettings}
              style={styles.actionButton}
              icon="refresh"
            >
              Reset to Defaults
            </Button>
            
            <Button 
              mode="outlined" 
              onPress={clearData}
              style={[styles.actionButton, styles.dangerButton]}
              icon="delete-forever"
              buttonColor="#FF5722"
              textColor="white"
            >
              Clear All Data
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  card: {
    marginBottom: 15,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileInfo: {
    marginLeft: 15,
  },
  input: {
    marginBottom: 10,
  },
  pickerContainer: {
    marginVertical: 10,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  settingDescription: {
    fontSize: 14,
    color: '#666',
  },
  divider: {
    marginVertical: 8,
  },
  aboutText: {
    lineHeight: 22,
    marginBottom: 15,
  },
  aboutLinks: {
    gap: 10,
  },
  linkButton: {
    marginBottom: 5,
  },
  actionButton: {
    marginBottom: 10,
  },
  dangerButton: {
    borderColor: '#FF5722',
  },
});
