const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    department: { type: String, required: true, index: true },
    location: { type: String, default: 'Remote' },
    type: { type: String, enum: ['Full-Time', 'Part-Time', 'Contract'], default: 'Full-Time' },
    description: { type: String, required: true },
    requirements: [{ type: String }],
    status: { type: String, enum: ['open', 'closed'], default: 'open', index: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Job', jobSchema);
