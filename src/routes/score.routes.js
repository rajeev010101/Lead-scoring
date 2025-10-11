import express from 'express';
import { runScoring, getResults, exportResultsCsv } from '../controllers/score.controller.js';

const router = express.Router();

router.post('/', runScoring);
router.get('/results', getResults);
router.get('/export', exportResultsCsv);

export default router;
