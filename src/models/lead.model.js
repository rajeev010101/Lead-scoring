import mongoose from 'mongoose';

const LeadSchema = new mongoose.Schema({
  name: { type: String, default: '' },
  role: { type: String, default: '' },
  company: { type: String, default: '' },
  industry: { type: String, default: '' },
  location: { type: String, default: '' },
  linkedin_bio: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Lead || mongoose.model('Lead', LeadSchema);
