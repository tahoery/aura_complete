import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { GiftedChat, Bubble, InputToolbar, Send } from 'react-native-gifted-chat';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Speech from 'expo-speech';
import AIService from '../services/AIService';

export default function ChatScreen() {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  import { sendToCline } from '../services/ClineService';
  useEffect(() => {
    // Initialize with welcome message
    setMessages([
      {
    const [input, setInput] = useState('');
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);
        _id: 1,
        text: "Hi! I'm AURA, your AI assistant. I can help you with questions, tasks, and much more. How can I assist you today?",
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'AURA',
          avatar: 'https://ui-avatars.com/api/?name=AURA&background=6200EE&color=fff&size=128',
        },
      },
    ]);
  }, []);

  const onSend = useCallback(async (newMessages = []) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages));
    
    const userMessage = newMessages[0].text;
    setIsTyping(true);

    try {
      const aiResponse = await AIService.processMessage(userMessage);
      
      const aiMessage = {
        _id: Math.round(Math.random() * 1000000),
        text: aiResponse,
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'AURA',
          avatar: 'https://ui-avatars.com/api/?name=AURA&background=6200EE&color=fff&size=128',
        },
      };

      setMessages(previousMessages => GiftedChat.append(previousMessages, [aiMessage]));
      setIsTyping(false);
      
      // Optional: Speak the response
      // Speech.speak(aiResponse, { language: 'en' });
      
    } catch (error) {
      setIsTyping(false);
      Alert.alert('Error', 'Failed to get AI response. Please try again.');
    }
  }, []);

  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
    const handleSend = async () => {
      setLoading(true);
      try {
        const res = await sendToCline(input);
        setResponse(JSON.stringify(res));
      } catch (e) {
        setResponse('Error: ' + e.message);
      }
      setLoading(false);
    };
          right: {
            backgroundColor: '#6200EE',
          },
          left: {
            backgroundColor: '#f0f0f0',
          },
        }}
        textStyle={{
          right: {
            color: '#fff',
          },
          left: {
            color: '#000',
          },
        }}
      />
    );
  };

  const renderInputToolbar = (props) => {
    return (
      <InputToolbar
        {...props}
        containerStyle={styles.inputToolbar}
        primaryStyle={styles.inputPrimary}
      />
    );
  };

  const renderSend = (props) => {
    return (
      <Send {...props}>
        <View style={styles.sendButton}>
          <Ionicons name="send" size={24} color="#6200EE" />
        </View>
      </Send>
    );
  };

  return (
    <LinearGradient
      colors={['#6200EE', '#3700B3', '#FFFFFF']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      <GiftedChat
        messages={messages}
        onSend={onSend}
        user={{
          _id: 1,
        }}
        renderBubble={renderBubble}
        renderInputToolbar={renderInputToolbar}
        renderSend={renderSend}
        isTyping={isTyping}
        placeholder="Type your message..."
        alwaysShowSend
        scrollToBottom
        showUserAvatar={false}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
        <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Chat with Cline AI</Text>
        <TextInput
          style={{ borderWidth: 1, borderColor: '#ccc', padding: 8, marginVertical: 12, width: '100%' }}
          placeholder="Type your request..."
          value={input}
          onChangeText={setInput}
        />
        <Button title={loading ? 'Sending...' : 'Send to Cline'} onPress={handleSend} disabled={loading || !input} />
        <Text style={{ marginTop: 20 }}>Response:</Text>
        <Text selectable style={{ marginTop: 4 }}>{response}</Text>
    flex: 1,
  },
  inputToolbar: {
    borderTopWidth: 1,
    borderTopColor: '#e8e8e8',
    backgroundColor: 'white',
    borderRadius: 25,
    marginHorizontal: 10,
    marginVertical: 5,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  inputPrimary: {
    alignItems: 'center',
  },
  sendButton: {
    marginRight: 10,
    marginBottom: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
