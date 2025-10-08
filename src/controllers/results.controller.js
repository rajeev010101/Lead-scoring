import Result from '../models/Result.model.js';
import { Parser } from 'json2csv';

/**
 * @desc Get all scored leads (results)
 * @route GET /results
 * @access Public
 */
export const getAllResults = async (req, res, next) => {
  try {
    // Optional query params for pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Optional filters
    const { intent } = req.query;
    const query = intent ? { intent } : {};

    // Fetch results with lead and offer data
    const results = await Result.find(query)
      .populate('lead', 'name role company industry location linkedin_bio')
      .populate('offer', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Result.countDocuments(query);

    res.json({
      success: true,
      count: results.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      results,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc Export results to CSV
 * @route GET /results/export
 * @access Public
 */
export const exportResults = async (req, res, next) => {
  try {
    const results = await Result.find()
      .populate('lead', 'name role company industry location linkedin_bio')
      .populate('offer', 'name')
      .sort({ createdAt: -1 });

    const formattedResults = results.map((r) => ({
      name: r.lead?.name || '',
      role: r.lead?.role || '',
      company: r.lead?.company || '',
      industry: r.lead?.industry || '',
      location: r.lead?.location || '',
      linkedin_bio: r.lead?.linkedin_bio || '',
      offer: r.offer?.name || '',
      intent: r.intent,
      score: r.score,
      reasoning: r.reasoning,
      createdAt: r.createdAt,
    }));

    const fields = [
      'name',
      'role',
      'company',
      'industry',
      'location',
      'linkedin_bio',
      'offer',
      'intent',
      'score',
      'reasoning',
      'createdAt',
    ];

    const parser = new Parser({ fields });
    const csv = parser.parse(formattedResults);

    res.header('Content-Type', 'text/csv');
    res.attachment('lead_scoring_results.csv');
    res.send(csv);
  } catch (err) {
    next(err);
  }
};

/**
 * @desc Delete all results (admin cleanup utility)
 * @route DELETE /results
 * @access Private
 */
export const deleteAllResults = async (req, res, next) => {
  try {
    const deleted = await Result.deleteMany({});
    res.json({
      success: true,
      message: `Deleted ${deleted.deletedCount} results.`,
    });
  } catch (err) {
    next(err);
  }
};
