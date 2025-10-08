import mongoose from 'mongoose';

const OfferSchema = new mongoose.Schema({
  name: { type: String, required: true },
  value_props: { type: [String], default: [] },
  ideal_use_cases: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now }
});

const Offer = mongoose.model('Offer', OfferSchema);
export default Offer;
