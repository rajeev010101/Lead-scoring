import Offer from '../models/Offer.Model.js';
import Lead from '../models/lead.model.js';
import Result from '../models/Result.model.js';
import { calculateRuleScore } from '../services/ruleEngine.service.js';
import { getAIIntent } from '../services/aiEngine.service.js';
import { Parser } from 'json2csv';

/**
 * Run scoring for all leads using the single saved Offer.
 * Saves results in DB (Result collection) and returns a summary.
 */
export const runScoring = async (req, res, next) => {
  try {
    const offer = await Offer.findOne();
    if (!offer) return res.status(400).json({ error: 'Offer not found. POST /offer first.' });

    const leads = await Lead.find();
    if (!leads.length) return res.status(400).json({ error: 'No leads found. Upload CSV first.' });

    // Remove previous results for this offer to avoid duplicates (optional)
    await Result.deleteMany({ offer: offer._id });

    const results = [];
    for (const lead of leads) {
      // Rule layer score
      const ruleScore = calculateRuleScore(lead, offer);

      // AI layer
      const { intent, aiPoints, reasoning } = await getAIIntent(lead, offer);

      const total = ruleScore + aiPoints;
      const resultDoc = new Result({
        lead: lead._id,
        offer: offer._id,
        intent,
        score: total,
        reasoning
      });
      await resultDoc.save();

      results.push({
        name: lead.name,
        role: lead.role,
        company: lead.company,
        industry: lead.industry,
        intent,
        score: total,
        reasoning
      });
    }

    res.json({ message: 'Scoring completed', resultsCount: results.length, results });
  } catch (err) {
    next(err);
  }
};

export const getResults = async (req, res, next) => {
  try {
    const docs = await Result.find().populate('lead').populate('offer').sort({ createdAt: -1 });
    const output = docs.map(d => ({
      name: d.lead?.name || '',
      role: d.lead?.role || '',
      company: d.lead?.company || '',
      industry: d.lead?.industry || '',
      intent: d.intent,
      score: d.score,
      reasoning: d.reasoning
    }));
    res.json(output);
  } catch (err) {
    next(err);
  }
};

export const exportResultsCsv = async (req, res, next) => {
  try {
    const docs = await Result.find().populate('lead').populate('offer').sort({ createdAt: -1 });
    const records = docs.map(d => ({
      name: d.lead?.name || '',
      role: d.lead?.role || '',
      company: d.lead?.company || '',
      industry: d.lead?.industry || '',
      intent: d.intent,
      score: d.score,
      reasoning: d.reasoning
    }));

    const fields = ['name','role','company','industry','intent','score','reasoning'];
    const parser = new Parser({ fields });
    const csv = parser.parse(records);

    res.header('Content-Type', 'text/csv');
    res.attachment('results.csv');
    res.send(csv);
  } catch (err) {
    next(err);
  }
};
