import mongoose from 'mongoose';

const ResultSchema = new mongoose.Schema({
  lead: { type: mongoose.Schema.Types.ObjectId, ref: 'Lead', required: true },
  offer: { type: mongoose.Schema.Types.ObjectId, ref: 'Offer', required: true },
  intent: { type: String, enum: ['High', 'Medium', 'Low'], required: true },
  score: { type: Number, required: true },
  reasoning: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Result || mongoose.model('Result', ResultSchema);
