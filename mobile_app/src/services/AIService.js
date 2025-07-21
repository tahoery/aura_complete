import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

class AIService {
  constructor() {
    this.baseURL = 'https://api.openai.com/v1';
    this.apiKey = null;
    this.model = 'gpt-3.5-turbo';
    this.temperature = 0.7;
    this.maxTokens = 1000;
    
    this.loadConfig();
  }

  async loadConfig() {
    try {
      const savedConfig = await AsyncStorage.getItem('@aura_ai_config');
      if (savedConfig) {
        const config = JSON.parse(savedConfig);
        this.apiKey = config.apiKey;
        this.model = config.model || 'gpt-3.5-turbo';
        this.temperature = config.temperature || 0.7;
        this.maxTokens = config.maxTokens || 1000;
      }
    } catch (error) {
      console.error('Failed to load AI config:', error);
    }
  }

  async makeRequest(messages, systemPrompt = null) {
    if (!this.apiKey) {
      throw new Error('AI API key not configured. Please set it in Settings.');
    }

    const requestMessages = systemPrompt 
      ? [{ role: 'system', content: systemPrompt }, ...messages]
      : messages;

    try {
      const response = await axios.post(
        `${this.baseURL}/chat/completions`,
        {
          model: this.model,
          messages: requestMessages,
          temperature: this.temperature,
          max_tokens: this.maxTokens,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('AI API Error:', error);
      
      if (error.response?.status === 401) {
        throw new Error('Invalid API key. Please check your configuration.');
      } else if (error.response?.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.');
      } else if (!navigator.onLine) {
        // Fallback to cached responses when offline
        return this.getOfflineResponse(messages[messages.length - 1].content);
      }
      
      throw new Error('Failed to get AI response. Please try again.');
    }
  }

  async processMessage(userMessage) {
    const messages = [
      {
        role: 'user',
        content: userMessage
      }
    ];

    const systemPrompt = `You are AURA, a helpful and intelligent AI assistant. You are integrated into a mobile app that provides chat, voice commands, document scanning, and location-based automation features. 

    Be conversational, helpful, and concise in your responses. If the user asks about features of the AURA app, explain how they can use the different tabs: Chat for conversations, Camera for document scanning, Voice for voice commands, Location for location-based automation, and Settings for configuration.

    Current context: This is a chat conversation in the AURA mobile app.`;

    return await this.makeRequest(messages, systemPrompt);
  }

  async processVoiceCommand(transcript) {
    const messages = [
      {
        role: 'user',
        content: transcript
      }
    ];

    const systemPrompt = `You are AURA, an AI assistant processing voice commands. The user spoke: "${transcript}"

    Respond as if you're having a natural voice conversation. Be concise and actionable. If the user asks you to perform actions like setting reminders, taking notes, or checking information, acknowledge the request and provide helpful guidance or simulated responses.

    For common voice commands:
    - Time/Date questions: Provide current information
    - Weather: Give general weather guidance (actual weather integration requires API setup)
    - Reminders: Acknowledge and suggest using the location automation features
    - Questions: Answer helpfully and concisely
    - Device control: Explain how to set up location-based automations

    Keep responses brief and natural for voice interaction.`;

    return await this.makeRequest(messages, systemPrompt);
  }

  async analyzeDocument(base64Image) {
    if (!base64Image) {
      throw new Error('No image data provided');
    }

    // For document analysis, we'd typically use vision models
    // For now, we'll simulate document analysis with a text response
    const messages = [
      {
        role: 'user',
        content: 'I have scanned a document. Please analyze it and extract key information.'
      }
    ];

    const systemPrompt = `You are AURA's document analysis system. A user has scanned a document using the camera. Since you cannot see the actual image in this simulation, provide a helpful response about document analysis capabilities.

    Explain what kinds of information you can typically extract from documents:
    - Text content (OCR)
    - Document type identification
    - Key data points (dates, numbers, names)
    - Structure and formatting analysis
    - Action items or important highlights

    Suggest that for full document analysis, they should ensure good lighting and that the document is clearly visible in the frame.`;

    try {
      return await this.makeRequest(messages, systemPrompt);
    } catch (error) {
      return "I can analyze documents for text content, key information, and structure. Please ensure the document is well-lit and clearly visible for best results. Full AI vision capabilities require proper API configuration.";
    }
  }

  async transcribeAudio(audioUri) {
    // Audio transcription would typically use services like Whisper API
    // For now, we'll return a placeholder that indicates the audio was processed
    
    try {
      // In a real implementation, you would send the audio file to a transcription service
      // const formData = new FormData();
      // formData.append('file', {
      //   uri: audioUri,
      //   type: 'audio/m4a',
      //   name: 'recording.m4a'
      // });
      // formData.append('model', 'whisper-1');
      
      // For demo purposes, return a placeholder
      return "I heard your voice command. Audio transcription requires proper API configuration.";
    } catch (error) {
      console.error('Transcription error:', error);
      throw new Error('Failed to transcribe audio');
    }
  }

  async getLocationInsights(locationData) {
    const { latitude, longitude, address } = locationData;
    
    const messages = [
      {
        role: 'user',
        content: `I'm currently at location: ${address || `${latitude}, ${longitude}`}. Give me insights about this location.`
      }
    ];

    const systemPrompt = `You are AURA's location analysis system. The user is asking for insights about their current location: ${address || `coordinates ${latitude}, ${longitude}`}.

    Provide helpful insights about this location such as:
    - General area information
    - Typical activities or points of interest nearby
    - Suggestions for automation opportunities
    - Time-based recommendations (if it's a home/work location)
    - Safety or convenience tips

    Be helpful and location-aware in your response.`;

    try {
      return await this.makeRequest(messages, systemPrompt);
    } catch (error) {
      return "Location insights help you understand your surroundings better. I can provide suggestions for automation and activities based on where you are.";
    }
  }

  async getNearbyPOIs(locationData) {
    // In a real implementation, this would query a places API
    // For demo purposes, return some common POI categories
    const commonPOIs = [
      'Restaurant', 'Coffee Shop', 'Gas Station', 'Grocery Store', 
      'Bank', 'Pharmacy', 'Hospital', 'School', 'Park'
    ];
    
    // Return a subset randomly for variety
    return commonPOIs.slice(0, Math.floor(Math.random() * 5) + 3);
  }

  async getLocationBasedSuggestions(locationData) {
    const { latitude, longitude, address, currentTime } = locationData;
    
    const messages = [
      {
        role: 'user',
        content: `I'm at ${address || `${latitude}, ${longitude}`} and it's ${currentTime}:00. What suggestions do you have?`
      }
    ];

    const systemPrompt = `You are AURA providing location and time-based suggestions. The user is at ${address || `coordinates ${latitude}, ${longitude}`} at ${currentTime}:00.

    Provide personalized suggestions based on:
    - Time of day (morning routines, lunch, evening activities)
    - Location context (home, work, shopping area, etc.)
    - Automation opportunities
    - Productivity or lifestyle recommendations
    - Nearby activities or services

    Keep suggestions practical and actionable.`;

    return await this.makeRequest(messages, systemPrompt);
  }

  async getOfflineResponse(userMessage) {
    // Fallback responses for offline mode
    const offlineResponses = [
      "I'm currently offline, but I'm here to help when you're connected again.",
      "No internet connection detected. Your message has been noted and I'll respond when back online.",
      "Offline mode: I can still help with basic guidance. Full AI features require an internet connection.",
      "Connection unavailable. Consider checking your network settings in the Settings tab."
    ];
    
    return offlineResponses[Math.floor(Math.random() * offlineResponses.length)];
  }

  // Utility methods
  async saveConversation(conversation) {
    try {
      const existingConversations = await AsyncStorage.getItem('@aura_conversations');
      const conversations = existingConversations ? JSON.parse(existingConversations) : [];
      
      const newConversation = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        messages: conversation
      };
      
      conversations.unshift(newConversation);
      
      // Keep only the last 50 conversations to manage storage
      const trimmedConversations = conversations.slice(0, 50);
      
      await AsyncStorage.setItem('@aura_conversations', JSON.stringify(trimmedConversations));
    } catch (error) {
      console.error('Failed to save conversation:', error);
    }
  }

  async getConversationHistory() {
    try {
      const conversations = await AsyncStorage.getItem('@aura_conversations');
      return conversations ? JSON.parse(conversations) : [];
    } catch (error) {
      console.error('Failed to load conversation history:', error);
      return [];
    }
  }

  async clearConversationHistory() {
    try {
      await AsyncStorage.removeItem('@aura_conversations');
    } catch (error) {
      console.error('Failed to clear conversation history:', error);
    }
  }
}

// Export a singleton instance
export default new AIService();
