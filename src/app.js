import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

import offerRoutes from './routes/offer.routes.js';
import leadsRoutes from './routes/leads.routes.js';
import scoreRoutes from './routes/score.routes.js';
import resultsRoutes from './routes/results.routes.js';
import errorHandler from './middlewares/errorHandler.js';

dotenv.config();

// Connect MongoDB
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/offer', offerRoutes);
app.use('/leads', leadsRoutes);
app.use('/score', scoreRoutes);
app.use('/results', resultsRoutes);

// Health check route
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Root route for Render
app.get('/', (req, res) => {
  res.send(`
    <h2>🚀 Lead Scoring Backend</h2>
    <p>Welcome! The API is running successfully.</p>
    <p>Available routes:</p>
    <ul>
      <li>/health</li>
      <li>/offer</li>
      <li>/leads</li>
      <li>/score</li>
      <li>/results</li>
    </ul>
  `);
});

// Error handler (should be last)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

export default app;
