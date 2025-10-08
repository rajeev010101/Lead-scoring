import express from 'express';
import { getAllResults, exportResults, deleteAllResults } from '../controllers/results.controller.js';

const router = express.Router();

// GET all scored leads (paginated)
router.get('/', getAllResults);

// Export as CSV
router.get('/export', exportResults);

// Delete all (admin)
router.delete('/', deleteAllResults);

export default router;
