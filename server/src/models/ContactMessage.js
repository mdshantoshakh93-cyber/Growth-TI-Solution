const mongoose = require('mongoose');

const contactMessageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, index: true },
    subject: { type: String, default: 'General Inquiry' },
    company: { type: String, default: '' },
    message: { type: String, required: true },
    status: { type: String, enum: ['unread', 'read', 'replied'], default: 'unread', index: true },
    ipAddress: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ContactMessage', contactMessageSchema);
