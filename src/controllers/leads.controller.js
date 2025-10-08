import fs from 'fs';
import csv from 'csv-parser';
import path from 'path';
import Lead from '../models/lead.model.js';
import { parseCsvToObjects } from '../utils/csvHelper.js';

/**
 * Upload CSV and store leads in DB
 * Expected CSV columns: name,role,company,industry,location,linkedin_bio
 * form field name: file
 */
export const uploadLeads = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'CSV file required (field name: file)' });

    const filepath = req.file.path;
    const leads = await parseCsvToObjects(filepath);

    // Bulk insert leads into DB
    const insertedLeads = await Lead.insertMany(leads.map(l => ({
      name: l.name || '',
      role: l.role || '',
      company: l.company || '',
      industry: l.industry || '',
      location: l.location || '',
      linkedin_bio: l.linkedin_bio || ''
    })));

    // cleanup uploaded file
    try { fs.unlinkSync(filepath); } catch (e) { /* ignore */ }

    res.json({ message: 'Leads uploaded', count: insertedLeads.length });
  } catch (err) {
    next(err);
  }
};

export const listLeads = async (req, res, next) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    res.json(leads);
  } catch (err) {
    next(err);
  }
};
