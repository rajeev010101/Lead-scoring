import express from 'express';
import multer from 'multer';
import { uploadLeads, listLeads } from '../controllers/leads.controller.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('file'), uploadLeads);
router.get('/', listLeads);

export default router;
