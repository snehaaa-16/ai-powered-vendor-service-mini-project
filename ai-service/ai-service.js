import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import geminiConnection from './config/gemini.js';
import searchEngine from './services/searchEngine.js';
import geminiSearchService from './services/geminiSearchService.js';
import searchRoutes from './routes/searchRoutes.js';
import chatRoutes from './routes/chatRoutes.js';

dotenv.config();
const app = express();

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

// Validate required environment variables
const MONGODB_URI = requireEnv('MONGODB_URI');
const GEMINI_API_KEY = requireEnv('GEMINI_API_KEY');

app.use(cors());
app.use(express.json());

// Initialize database connection and wait before starting dependent services
let dbConnected = false;
connectDB().then(() => { dbConnected = true; }).catch(() => { dbConnected = false; });

// Initialize Gemini connection
const model = geminiConnection.initialize();

// Initialize search engine after database connection
async function initializeServices() {
  try {
    console.log('🔄 Initializing services...');
    
    // Initialize Gemini Search Service
    console.log('🔄 Initializing Gemini Search Service...');
    await geminiSearchService.initialize();
    
    // Initialize Search Engine
    console.log('🔄 Initializing Search Engine...');
    await searchEngine.initialize();
    
    console.log('✅ All services initialized successfully');
  } catch (error) {
    console.error('❌ Service initialization failed:', error);
    // Don't exit the process, but log the error
  }
}

// Initialize services after a short delay, and retry until DB is connected
async function waitForDbAndInit(retries = 10, backoffMs = 500) {
  if (dbConnected) {
    await initializeServices();
    return;
  }
  if (retries <= 0) {
    console.error('❌ Database not connected in time. Skipping service initialization for now.');
    return;
  }
  setTimeout(() => waitForDbAndInit(retries - 1, Math.min(backoffMs * 2, 5000)), backoffMs);
}

setTimeout(() => waitForDbAndInit(), 500);

app.get('/', (req, res) => {
  res.send('AI Service - Search Engine');
});

app.get('/health', async (req, res) => {
  const geminiStatus = geminiConnection.getStatus();
  const searchEngineStatus = await searchEngine.getStatus();
  const geminiSearchStatus = geminiSearchService.getStatus();
  
  res.json({ 
    status: 'OK', 
    message: 'AI Service is running',
    timestamp: new Date().toISOString(),
    gemini: geminiStatus,
    searchEngine: searchEngineStatus,
    geminiSearch: geminiSearchStatus,
    services: {
      mongodb: 'connected',
      gemini: geminiStatus.isInitialized ? 'connected' : 'disconnected',
      searchEngine: searchEngineStatus.isInitialized ? 'initialized' : 'not_initialized',
      geminiSearch: geminiSearchStatus.isAvailable ? 'available' : 'unavailable'
    }
  });
});

app.use('/api', searchRoutes);
app.use('/api/chat', chatRoutes);

const PORT = process.env.AI_PORT || 3002;

app.listen(PORT, () => {
  console.log(`🤖 AI Service running on port ${PORT}`);
  console.log(`🔍 Search Engine API available at http://localhost:${PORT}/api`);
  console.log(`📊 Health check available at http://localhost:${PORT}/health`);
});

export default app; 