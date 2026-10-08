const mongoose = require('mongoose');

const jobApplicationSchema = new mongoose.Schema(
  {
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true, index: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    phone: { type: String },
    resumeUrl: { type: String, required: true },
    coverLetter: { type: String },
    status: { type: String, enum: ['pending', 'reviewed', 'shortlisted', 'rejected'], default: 'pending', index: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('JobApplication', jobApplicationSchema);
