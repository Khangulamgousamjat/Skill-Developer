import api from '../api/axios';

export const callGemini = async (prompt) => {
  const delays = [1000, 2000, 4000, 8000, 16000];
  for (let i = 0; i <= 5; i++) {
    try {
      const response = await api.post('/ai/ask', { prompt });
      if (response.data.success) {
        return response.data.data.text || "No insights generated.";
      }
      throw new Error('API Error');
    } catch (error) {
      if (i === 5) return "Failed to connect to AI Mentor. Please try again later.";
      await new Promise(res => setTimeout(res, delays[i]));
    }
  }
};
