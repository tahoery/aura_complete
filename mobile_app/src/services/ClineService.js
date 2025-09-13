// ClineService.js
// Template for integrating Cline AI (Claude) into your React Native app
// Replace the placeholder URL and API key with your actual Cline/Claude endpoint and credentials

import axios from 'axios';

const CLINE_API_URL = 'https://api.cline.ai/v1/endpoint'; // TODO: Replace with real endpoint
const CLINE_API_KEY = 'YOUR_CLINE_API_KEY'; // TODO: Replace with your API key

export async function sendToCline(prompt) {
  try {
    const response = await axios.post(
      CLINE_API_URL,
      { prompt },
      {
        headers: {
          'Authorization': `Bearer ${CLINE_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Cline API error:', error);
    throw error;
  }
}
