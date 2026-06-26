import { storage } from '../utils/storage';

const BASE_URL = import.meta.env.VITE_API_URL || '/api';

class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

const request = async (method, endpoint, data = null) => {
  const token = storage.get('auth_token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const config = { method, headers };
  if (data && method !== 'GET') config.body = JSON.stringify(data);

  const response = await fetch(`${BASE_URL}${endpoint}`, config);

  let json;
  try { json = await response.json(); } catch { json = {}; }

  if (!response.ok) {
    throw new ApiError(json.message || 'Request failed', response.status);
  }
  return json;
};

export const http = {
  get:    (url)       => request('GET',    url),
  post:   (url, data) => request('POST',   url, data),
  put:    (url, data) => request('PUT',    url, data),
  patch:  (url, data) => request('PATCH',  url, data),
  delete: (url)       => request('DELETE', url),
};
