const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, index: true },
    client: { type: String, required: true },
    category: { type: String, required: true, index: true },
    summary: { type: String, required: true },
    description: { type: String, required: true },
    metrics: { type: String },
    techStack: [{ type: String }],
    image: { type: String },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Project', projectSchema);
