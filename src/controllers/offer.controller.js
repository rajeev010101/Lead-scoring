import Offer from '../models/Offer.Model.js';

/**
 * Save or update a single Offer.
 * We keep only one active offer for simplicity. If multiple offers are required
 * adapt this to accept an id.
 */
export const createOffer = async (req, res, next) => {
  try {
    const payload = req.body;
    // Upsert behavior: replace existing single offer or create new
    let offer = await Offer.findOne();
    if (!offer) {
      offer = new Offer(payload);
    } else {
      offer.name = payload.name;
      offer.value_props = payload.value_props;
      offer.ideal_use_cases = payload.ideal_use_cases;
    }
    await offer.save();
    res.json({ message: 'Offer saved', offer });
  } catch (err) {
    next(err);
  }
};

export const getOffer = async (req, res, next) => {
  try {
    const offer = await Offer.findOne();
    if (!offer) return res.status(404).json({ error: 'Offer not found' });
    res.json(offer);
  } catch (err) {
    next(err);
  }
};
