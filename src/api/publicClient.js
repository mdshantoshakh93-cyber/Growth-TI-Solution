/**
 * Growth IT Solution Public API Client
 * Communicates with backend endpoints to load dynamic site content.
 */

const BASE_URL = '/api';

async function fetchPublic(endpoint, options = {}) {
  const config = {
    method: options.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  if (options.body) {
    config.body = JSON.stringify(options.body);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'API Request Failed');
  }

  return data;
}

export const publicApi = {
  getSiteSettings: () => fetchPublic('/public/site-settings'),
  getNavigation: () => fetchPublic('/public/navigation'),
  getServices: () => fetchPublic('/services'),
  getPortfolio: (category) => fetchPublic(`/portfolio${category ? `?category=${encodeURIComponent(category)}` : ''}`),
  getBlogs: () => fetchPublic('/blogs'),
  getTestimonials: () => fetchPublic('/testimonials'),
  getPricing: () => fetchPublic('/pricing'),
  getFaqs: () => fetchPublic('/faqs'),
  getTeam: () => fetchPublic('/team'),
  getCareers: () => fetchPublic('/careers'),
  getStats: () => fetchPublic('/stats'),
  submitContact: (formData) => fetchPublic('/contact', { method: 'POST', body: formData }),
  submitNewsletter: (email) => fetchPublic('/subscribe', { method: 'POST', body: { email } }),
};
