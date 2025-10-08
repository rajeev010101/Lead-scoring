import mongoose from 'mongoose';

const OfferSchema = new mongoose.Schema({
  name: { type: String, required: true },
  value_props: { type: [String], default: [] },
  ideal_use_cases: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now },
});

// ✅ Prevent OverwriteModelError on hot reloads or ESM re-imports
export default mongoose.models.Offer || mongoose.model('Offer', OfferSchema);
