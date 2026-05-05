import api from './axios.js';

const chatEndpoints = ['/api/chat', '/api/chat/send', '/api/chat/message', '/api/chatbot', '/api/chatbot/chat'];
const historyEndpoints = ['/api/chat/history', '/api/chats/history', '/api/chatbot/history'];

async function tryEndpoints(endpoints, request) {
  let lastError;
  for (const endpoint of endpoints) {
    try {
      return await request(endpoint);
    } catch (error) {
      lastError = error;
      if (error.response?.status !== 404) throw error;
    }
  }
  throw lastError;
}

export function sendChatMessage(message, messages) {
  return tryEndpoints(chatEndpoints, (endpoint) =>
    api.post(endpoint, {
      message,
      prompt: message,
      messages,
    }),
  );
}

export function getChatHistory() {
  return tryEndpoints(historyEndpoints, (endpoint) => api.get(endpoint));
}