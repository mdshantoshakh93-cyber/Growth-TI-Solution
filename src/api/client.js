/**
 * Growth IT Solution Admin API Client
 * Wraps REST requests with credentials: 'include' for secure cookie sessions
 */

const BASE_URL = '/api';

export async function fetchApi(endpoint, options = {}) {
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  const config = {
    method: options.method || 'GET',
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    credentials: 'include',
  };

  if (options.body) {
    config.body = JSON.stringify(options.body);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, config);
  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data.error || 'An error occurred during API request.');
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

// Auth API methods
export const authApi = {
  login: (credentials) => fetchApi('/auth/login', { method: 'POST', body: credentials }),
  logout: () => fetchApi('/auth/logout', { method: 'POST' }),
  getMe: () => fetchApi('/auth/me'),
  changePassword: (data) => fetchApi('/auth/change-password', { method: 'POST', body: data }),
};

// Admin Resources API methods
export const adminApi = {
  getStats: () => fetchApi('/admin/stats'),
  getActivityLogs: () => fetchApi('/admin/activity-logs'),
  getSettings: () => fetchApi('/admin/settings'),
  updateSettings: (data) => fetchApi('/admin/settings', { method: 'POST', body: data }),
  
  // Generic Collection Methods
  getCollection: (name) => fetchApi(`/admin/${name}`),
  createItem: (name, item) => fetchApi(`/admin/${name}`, { method: 'POST', body: item }),
  updateItem: (name, id, item) => fetchApi(`/admin/${name}/${id}`, { method: 'PUT', body: item }),
  deleteItem: (name, id) => fetchApi(`/admin/${name}/${id}`, { method: 'DELETE' }),

  // Media Library Methods
  uploadMedia: (fileData, fileName, mimeType) => fetchApi('/admin/media/upload', { method: 'POST', body: { fileData, fileName, mimeType } }),
  checkMediaReferences: (id) => fetchApi(`/admin/media/${id}/references`),
  renameMedia: (id, fileName) => fetchApi(`/admin/media/${id}/rename`, { method: 'PUT', body: { file_name: fileName } }),
};
