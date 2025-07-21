import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Animated } from 'react-native';
import { Button, Card, Title, Paragraph, Switch } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';
import AIService from '../services/AIService';

export default function VoiceScreen() {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [recording, setRecording] = useState(null);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [hasAudioPermission, setHasAudioPermission] = useState(null);
  const pulseAnim = new Animated.Value(1);

  useEffect(() => {
    requestAudioPermissions();
  }, []);

  useEffect(() => {
    if (isListening) {
      startPulseAnimation();
    } else {
      stopPulseAnimation();
    }
  }, [isListening]);

  const requestAudioPermissions = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      setHasAudioPermission(permission.status === 'granted');
      
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to get audio permissions');
    }
  };

  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.3,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const stopPulseAnimation = () => {
    pulseAnim.stopAnimation();
    Animated.timing(pulseAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const startListening = async () => {
    if (!hasAudioPermission) {
      Alert.alert('Permission Required', 'Please grant microphone permission to use voice features');
      return;
    }

    try {
      setIsListening(true);
      setTranscript('Listening...');
      setResponse('');

      // Start recording
      const { recording } = await Audio.Recording.createAsync({
        android: {
          extension: '.m4a',
          outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
          audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
          sampleRate: 44100,
          numberOfChannels: 2,
          bitRate: 128000,
        },
        ios: {
          extension: '.m4a',
          outputFormat: Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_MPEG4AAC,
          audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_MAX,
          sampleRate: 44100,
          numberOfChannels: 2,
          bitRate: 128000,
          linearPCMBitDepth: 16,
          linearPCMIsBigEndian: false,
          linearPCMIsFloat: false,
        },
      });

      setRecording(recording);
      await recording.startAsync();
    } catch (error) {
      Alert.alert('Error', 'Failed to start recording');
      setIsListening(false);
    }
  };

  const stopListening = async () => {
    if (!recording) return;

    try {
      setIsListening(false);
      setIsProcessing(true);
      
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      
      // Process the audio with AI service
      const transcription = await AIService.transcribeAudio(uri);
      setTranscript(transcription);
      
      // Get AI response
      const aiResponse = await AIService.processVoiceCommand(transcription);
      setResponse(aiResponse);
      
      // Speak the response if auto-speak is enabled
      if (autoSpeak && aiResponse) {
        await Speech.speak(aiResponse, {
          language: 'en',
          pitch: 1.0,
          rate: 0.9,
        });
      }
      
      setRecording(null);
    } catch (error) {
      Alert.alert('Error', 'Failed to process voice command');
    }
    
    setIsProcessing(false);
  };

  const speakResponse = () => {
    if (response) {
      Speech.speak(response, {
        language: 'en',
        pitch: 1.0,
        rate: 0.9,
      });
    }
  };

  const clearResults = () => {
    setTranscript('');
    setResponse('');
  };

  const quickCommands = [
    { title: 'What\'s the weather?', command: 'What\'s the weather today?' },
    { title: 'Set a reminder', command: 'Set a reminder for tomorrow at 9 AM' },
    { title: 'Tell me a joke', command: 'Tell me a funny joke' },
    { title: 'What time is it?', command: 'What time is it right now?' },
  ];

  const handleQuickCommand = async (command) => {
    setTranscript(command);
    setIsProcessing(true);
    
    try {
      const aiResponse = await AIService.processVoiceCommand(command);
      setResponse(aiResponse);
      
      if (autoSpeak && aiResponse) {
        await Speech.speak(aiResponse, {
          language: 'en',
          pitch: 1.0,
          rate: 0.9,
        });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to process command');
    }
    
    setIsProcessing(false);
  };

  if (hasAudioPermission === null) {
    return (
      <View style={styles.container}>
        <Text>Requesting microphone permissions...</Text>
      </View>
    );
  }

  if (hasAudioPermission === false) {
    return (
      <View style={styles.container}>
        <Card style={styles.permissionCard}>
          <Card.Content>
            <Title>Microphone Permission Required</Title>
            <Paragraph>Please grant microphone access to use voice features.</Paragraph>
            <Button mode="contained" onPress={requestAudioPermissions} style={styles.permissionButton}>
              Grant Permission
            </Button>
          </Card.Content>
        </Card>
      </View>
    );
  }

  return (
    <LinearGradient
      colors={['#6200EE', '#3700B3', '#FFFFFF']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      <View style={styles.content}>
        {/* Voice Controls */}
        <View style={styles.voiceSection}>
          <Animated.View style={[styles.microphoneContainer, { transform: [{ scale: pulseAnim }] }]}>
            <TouchableOpacity
              style={[styles.microphoneButton, isListening && styles.listeningButton]}
              onPress={isListening ? stopListening : startListening}
              disabled={isProcessing}
            >
              <Ionicons 
                name={isListening ? 'stop' : 'mic'} 
                size={60} 
                color={isListening ? '#fff' : '#6200EE'} 
              />
            </TouchableOpacity>
          </Animated.View>
          
          <Text style={styles.statusText}>
            {isListening ? 'Listening...' : isProcessing ? 'Processing...' : 'Tap to speak'}
          </Text>
        </View>

        {/* Settings */}
        <Card style={styles.settingsCard}>
          <Card.Content>
            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Auto-speak responses</Text>
              <Switch value={autoSpeak} onValueChange={setAutoSpeak} />
            </View>
          </Card.Content>
        </Card>

        {/* Results */}
        {transcript && (
          <Card style={styles.resultCard}>
            <Card.Content>
              <Title>You said:</Title>
              <Paragraph style={styles.transcript}>{transcript}</Paragraph>
            </Card.Content>
          </Card>
        )}

        {response && (
          <Card style={styles.resultCard}>
            <Card.Content>
              <View style={styles.responseHeader}>
                <Title>AURA:</Title>
                <TouchableOpacity onPress={speakResponse} style={styles.speakButton}>
                  <Ionicons name="volume-high" size={24} color="#6200EE" />
                </TouchableOpacity>
              </View>
              <Paragraph style={styles.response}>{response}</Paragraph>
            </Card.Content>
          </Card>
        )}

        {/* Quick Commands */}
        <Card style={styles.quickCommandsCard}>
          <Card.Content>
            <Title>Quick Commands</Title>
            <View style={styles.commandsGrid}>
              {quickCommands.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.commandButton}
                  onPress={() => handleQuickCommand(item.command)}
                  disabled={isListening || isProcessing}
                >
                  <Text style={styles.commandButtonText}>{item.title}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </Card.Content>
        </Card>

        {/* Clear Button */}
        {(transcript || response) && (
          <Button 
            mode="outlined" 
            onPress={clearResults}
            style={styles.clearButton}
            icon="delete"
          >
            Clear Results
          </Button>
        )}
      </View>
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
  voiceSection: {
    alignItems: 'center',
    marginVertical: 30,
  },
  microphoneContainer: {
    marginBottom: 20,
  },
  microphoneButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  listeningButton: {
    backgroundColor: '#FF5722',
  },
  statusText: {
    fontSize: 18,
    fontWeight: '500',
    color: 'white',
    textAlign: 'center',
  },
  settingsCard: {
    marginBottom: 15,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: 16,
  },
  resultCard: {
    marginBottom: 10,
  },
  transcript: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#666',
  },
  responseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  speakButton: {
    padding: 5,
  },
  response: {
    fontSize: 16,
    lineHeight: 24,
  },
  quickCommandsCard: {
    marginTop: 10,
  },
  commandsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  commandButton: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 8,
    width: '48%',
    marginBottom: 10,
    alignItems: 'center',
  },
  commandButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6200EE',
    textAlign: 'center',
  },
  clearButton: {
    marginTop: 20,
  },
  permissionCard: {
    margin: 20,
  },
  permissionButton: {
    marginTop: 15,
  },
});
