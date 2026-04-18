import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

class GeminiConnection {
  constructor() {
    this.genAI = null;
    this.model = null;
    this.isInitialized = false;
  }

  initialize() {
    if (this.isInitialized) {
      console.log('✅ Gemini AI already initialized');
      return this.model;
    }

    try {
      this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      this.model = this.genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      
      this.isInitialized = true;
      console.log('✅ Gemini AI initialized');
      return this.model;
    } catch (error) {
      console.error('❌ Gemini AI initialization error:', error);
      process.exit(1);
    }
  }

  async generateText(prompt) {
    if (!this.isInitialized) {
      throw new Error('Gemini AI not initialized');
    }

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('❌ Gemini AI generation error:', error);
      throw error;
    }
  }

  async chat(history, message) {
    if (!this.isInitialized) {
      throw new Error('Gemini AI not initialized');
    }

    try {
      const chat = this.model.startChat({
        history: history
      });
      
      const result = await chat.sendMessage(message);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('❌ Gemini AI chat error:', error);
      throw error;
    }
  }

  getModel() {
    return this.model;
  }

  getStatus() {
    return {
      isInitialized: this.isInitialized,
      model: this.model ? 'gemini-2.5-flash' : null
    };
  }
}

    
const geminiConnection = new GeminiConnection();

export default geminiConnection; 