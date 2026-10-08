const mongoose = require('mongoose');

const siteSettingsSchema = new mongoose.Schema(
  {
    siteName: { type: String, default: 'Growth IT Solution' },
    tagline: { type: String, default: 'Enterprise Cloud & AI Solutions Engine' },
    contactEmail: { type: String, default: 'contact@growthitsolution.com' },
    phone: { type: String, default: '+1 (800) 555-GROWTH' },
    address: { type: String, default: 'Enterprise Tower, Silicon Tech District, Suite 400' },
    socialLinks: {
      github: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      twitter: { type: String, default: '' },
    },
    analyticsId: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('SiteSettings', siteSettingsSchema);
