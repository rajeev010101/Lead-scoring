import Offer from '../models/Offer.Model.js';
import Lead from '../models/lead.model.js';
import Result from '../models/Result.model.js';
import { calculateRuleScore } from '../services/ruleEngine.service.js';
import { getAILeadScore } from '../services/aiEngine.service.js';
import { Parser } from 'json2csv';

/**
 * Run scoring for all leads using the single saved Offer.
 * Combines rule-based score + AI reasoning score.
 * Saves results in DB and returns a summary.
 */
export const runScoring = async (req, res, next) => {
  try {
    const offer = await Offer.findOne();
    if (!offer)
      return res.status(400).json({ error: 'Offer not found. Please POST /offer first.' });

    const leads = await Lead.find().limit(5);
    if (!leads.length)
      return res.status(400).json({ error: 'No leads found. Please upload leads CSV first.' });

    // Optional: Remove previous results to avoid duplicates
    await Result.deleteMany({ offer: offer._id });

    const results = [];

    for (const lead of leads) {
      // Step 1: Rule-based layer
      const ruleScore = calculateRuleScore(lead, offer);

      console.log(`Scoring lead: ${lead.name}`);

      // Step 2: AI-based layer (using Groq / OpenAI)
      const aiResponse = await getAILeadScore(lead, offer);

      console.log(`AI done for lead ${lead._id}`);

      // Parse AI response
      let intent = 'Medium';
      let aiPoints = 50;
      let reasoning = '';

      if (typeof aiResponse === 'string') {
        reasoning = aiResponse;
      } else if (typeof aiResponse === 'object') {
        intent = aiResponse.intent || 'Medium';
        aiPoints = aiResponse.score || 50;
        reasoning = aiResponse.reasoning || 'AI reasoning unavailable';
      }

      // Final score
      const total = Math.min(ruleScore + aiPoints, 100);

      // Save result in DB
      const resultDoc = new Result({
        lead: lead._id,
        offer: offer._id,
        intent,
        score: total,
        reasoning,
      });
      await resultDoc.save();

      // Add to results array for response
      results.push({
        name: lead.name,
        role: lead.role,
        company: lead.company,
        industry: lead.industry,
        intent,
        score: total,
        reasoning,
      });
    }

    res.json({
      message: '✅ Scoring completed successfully.',
      resultsCount: results.length,
      results,
    });
  } catch (err) {
    console.error('Error during scoring:', err.message);
    next(err);
  }
};

/**
 * Fetch all results from DB.
 */
export const getResults = async (req, res, next) => {
  try {
    const docs = await Result.find()
      .populate('lead')
      .populate('offer')
      .sort({ createdAt: -1 });

    const output = docs.map((d) => ({
      name: d.lead?.name || '',
      role: d.lead?.role || '',
      company: d.lead?.company || '',
      industry: d.lead?.industry || '',
      intent: d.intent,
      score: d.score,
      reasoning: d.reasoning,
    }));

    res.json(output);
  } catch (err) {
    next(err);
  }
};

/**
 * Export results as CSV
 */
export const exportResultsCsv = async (req, res, next) => {
  try {
    const docs = await Result.find()
      .populate('lead')
      .populate('offer')
      .sort({ createdAt: -1 });

    const records = docs.map((d) => ({
      name: d.lead?.name || '',
      role: d.lead?.role || '',
      company: d.lead?.company || '',
      industry: d.lead?.industry || '',
      intent: d.intent,
      score: d.score,
      reasoning: d.reasoning,
    }));

    const fields = ['name', 'role', 'company', 'industry', 'intent', 'score', 'reasoning'];
    const parser = new Parser({ fields });
    const csv = parser.parse(records);

    res.header('Content-Type', 'text/csv');
    res.attachment('results.csv');
    res.send(csv);
  } catch (err) {
    next(err);
  }
};
