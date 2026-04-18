import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import searchRouter from './src/routes/search.js';
import authRouter from './src/routes/auth.js';
import { connectMongo } from './src/db/mongoose.js';
import vendorAIConfigRouter from './src/routes/vendorAIConfig.js';
import offersRouter from './src/routes/offers.js';
import chatHistoryRouter from './src/routes/chatHistory.js';
import vendorRegistrationRouter from './src/routes/vendorRegistration.js';
import vendorRatingRouter from './src/routes/vendorRating.js';

dotenv.config();

const app = express();

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

const FRONTEND_URL = requireEnv('FRONTEND_URL');
const AI_BASE_URL = requireEnv('AI_BASE_URL');

// Validate AI_BASE_URL format
if (!AI_BASE_URL.startsWith('http://') && !AI_BASE_URL.startsWith('https://')) {
  throw new Error('AI_BASE_URL must be a valid HTTP/HTTPS URL');
}

app.use(cors({ origin: FRONTEND_URL, credentials: false }));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({ windowMs: 60 * 1000, max: 120 });
app.use(limiter);

app.get('/', (req, res) => {
  res.send('Hyperlocal Marketplace Backend');
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    services: {
      ai: AI_BASE_URL,
      frontend: FRONTEND_URL
    }
  });
});

app.use('/api', searchRouter);
app.use('/api/auth', authRouter);
app.use('/api/vendor-registration', vendorRegistrationRouter);
app.use('/api/vendor-ai-config', vendorAIConfigRouter);
app.use('/api/offers', offersRouter);
app.use('/api/chat-history', chatHistoryRouter);
app.use('/api/vendors', vendorRatingRouter);

const PORT = requireEnv('PORT');
const MONGODB_URI = requireEnv('MONGODB_URI');

async function start() {
  try {
    await connectMongo(MONGODB_URI);
    app.listen(PORT, () => {
      console.log(`Backend running on http://localhost:${PORT}`);
      console.log(`AI Service URL: ${AI_BASE_URL}`);
      console.log(`Frontend URL: ${FRONTEND_URL}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

start();

export default app;


