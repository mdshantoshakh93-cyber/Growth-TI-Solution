const mongoose = require('mongoose');

const navItemSchema = new mongoose.Schema({
  label: { type: String, required: true },
  url: { type: String, required: true },
  target: { type: String, default: '_self' },
  order: { type: Number, default: 0 },
});

const navigationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    location: { type: String, enum: ['header', 'footer', 'sidebar'], required: true, index: true },
    items: [navItemSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Navigation', navigationSchema);
