const mongoose = require('mongoose');

const blogPostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, index: true },
    summary: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, default: 'Growth IT Engineering Team' },
    category: { type: String, required: true, index: true },
    tags: [{ type: String }],
    coverImage: { type: String },
    status: { type: String, enum: ['draft', 'published', 'archived'], default: 'published', index: true },
    publishedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('BlogPost', blogPostSchema);
