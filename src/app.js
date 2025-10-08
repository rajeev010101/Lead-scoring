import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import offerRoutes from './routes/offer.routes.js';
import leadsRoutes from './routes/leads.routes.js';
import scoreRoutes from './routes/score.routes.js';
import errorHandler from './middlewares/errorHandler.js';

dotenv.config();

// Connect DB
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/offer', offerRoutes);
app.use('/leads', leadsRoutes);
app.use('/', scoreRoutes);

// health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// error handler (should be last)
app.use(errorHandler);

// start
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
