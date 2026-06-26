import { http } from './client';

export const authApi = {
  register: (d)  => http.post('/auth/register', d),
  login:    (d)  => http.post('/auth/login',    d),
  me:       ()   => http.get('/auth/me'),
};

export const taskApi = {
  getAll:            ()        => http.get('/tasks'),
  getById:           (id)      => http.get(`/tasks/${id}`),
  create:            (d)       => http.post('/tasks', d),
  update:            (id, d)   => http.put(`/tasks/${id}`, d),
  delete:            (id)      => http.delete(`/tasks/${id}`),
  complete:          (id, at)  => http.patch(`/tasks/${id}/complete`, { actualTime: at }),
  prioritized:       ()        => http.get('/tasks/prioritized'),
  quadrants:         ()        => http.get('/tasks/quadrants'),
  previewAi:         (d)       => http.post('/tasks/preview-ai', d),
  checkFeasibility:  (d)       => http.post('/tasks/check-feasibility', d),
};

export const scheduleApi = {
  generate:   (d)       => http.post('/schedule/generate',   d),
  regenerate: (d)       => http.post('/schedule/regenerate', d),
  today:      ()        => http.get('/schedule/today'),
  week:       (s, e)    => http.get(`/schedule/week?startDate=${s}&endDate=${e}`),
  stats:      ()        => http.get('/schedule/stats'),
};

export const availabilityApi = {
  getAll:     ()        => http.get('/availability'),
  create:     (d)       => http.post('/availability', d),
  bulkReplace:(slots)   => http.put('/availability/bulk', { slots }),
  update:     (id, d)   => http.put(`/availability/${id}`, d),
  delete:     (id)      => http.delete(`/availability/${id}`),
};

export const analyticsApi = {
  insights: () => http.get('/analytics/insights'),
};
