const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('ecoconnect_token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const handleResponse = async (res) => {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const errorMsg = data.message || `Request failed with status ${res.status}`;
    const error = new Error(errorMsg);
    error.status = res.status;
    error.data = data;
    throw error;
  }
  return data;
};

export const api = {
  // System Health & Storage Status
  getHealth: async () => {
    const res = await fetch(`${API_BASE}/health`);
    return handleResponse(res);
  },

  // Auth
  register: async (userData) => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return handleResponse(res);
  },

  login: async (credentials) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    return handleResponse(res);
  },

  getMe: async () => {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  updateProfile: async (profileData) => {
    const res = await fetch(`${API_BASE}/auth/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(profileData),
    });
    return handleResponse(res);
  },

  // Items (Donations)
  getItems: async (params = {}) => {
    const query = new URLSearchParams();
    if (params.category && params.category !== 'All') query.append('category', params.category);
    if (params.condition && params.condition !== 'All') query.append('condition', params.condition);
    if (params.status && params.status !== 'All') query.append('status', params.status);
    if (params.search) query.append('search', params.search);
    if (params.donor) query.append('donor', params.donor);
    if (params.recipient) query.append('recipient', params.recipient);

    const qs = query.toString() ? `?${query.toString()}` : '';
    const res = await fetch(`${API_BASE}/items${qs}`);
    return handleResponse(res);
  },

  getItemById: async (id) => {
    const res = await fetch(`${API_BASE}/items/${id}`);
    return handleResponse(res);
  },

  createItem: async (itemData) => {
    const res = await fetch(`${API_BASE}/items`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(itemData),
    });
    return handleResponse(res);
  },

  updateItem: async (id, itemData) => {
    const res = await fetch(`${API_BASE}/items/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(itemData),
    });
    return handleResponse(res);
  },

  deleteItem: async (id) => {
    const res = await fetch(`${API_BASE}/items/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  requestItem: async (id, message) => {
    const res = await fetch(`${API_BASE}/items/${id}/request`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ message }),
    });
    return handleResponse(res);
  },

  getMyRequests: async () => {
    const res = await fetch(`${API_BASE}/items/requests/my`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  respondToRequest: async (requestId, status) => {
    const res = await fetch(`${API_BASE}/items/requests/${requestId}/respond`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    });
    return handleResponse(res);
  },

  // Community Requests
  getCommunityRequests: async (params = {}) => {
    const query = new URLSearchParams();
    if (params.category && params.category !== 'All') query.append('category', params.category);
    if (params.status && params.status !== 'All') query.append('status', params.status);
    if (params.search) query.append('search', params.search);
    if (params.requester) query.append('requester', params.requester);

    const qs = query.toString() ? `?${query.toString()}` : '';
    const res = await fetch(`${API_BASE}/community-requests${qs}`);
    return handleResponse(res);
  },

  getCommunityRequestById: async (id) => {
    const res = await fetch(`${API_BASE}/community-requests/${id}`);
    return handleResponse(res);
  },

  createCommunityRequest: async (data) => {
    const res = await fetch(`${API_BASE}/community-requests`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  offerHelp: async (id, message) => {
    const res = await fetch(`${API_BASE}/community-requests/${id}/offer`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ message }),
    });
    return handleResponse(res);
  },

  updateCommunityRequestStatus: async (id, status) => {
    const res = await fetch(`${API_BASE}/community-requests/${id}/status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    });
    return handleResponse(res);
  },

  deleteCommunityRequest: async (id) => {
    const res = await fetch(`${API_BASE}/community-requests/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  // Recycling Map
  getRecyclingCentres: async (params = {}) => {
    const query = new URLSearchParams();
    if (params.area) query.append('area', params.area);
    if (params.material) query.append('material', params.material);

    const qs = query.toString() ? `?${query.toString()}` : '';
    const res = await fetch(`${API_BASE}/recycling${qs}`);
    return handleResponse(res);
  },

  // Environmental Impact
  getImpactStats: async () => {
    const res = await fetch(`${API_BASE}/impact`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  // Reports
  createReport: async (reportData) => {
    const res = await fetch(`${API_BASE}/reports`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(reportData),
    });
    return handleResponse(res);
  },

  // Admin
  getAdminOverview: async () => {
    const res = await fetch(`${API_BASE}/admin/overview`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  getAdminUsers: async () => {
    const res = await fetch(`${API_BASE}/admin/users`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  getAdminReports: async (status) => {
    const qs = status ? `?status=${status}` : '';
    const res = await fetch(`${API_BASE}/admin/reports${qs}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  resolveAdminReport: async (id, data) => {
    const res = await fetch(`${API_BASE}/admin/reports/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  adminDeleteItem: async (id) => {
    const res = await fetch(`${API_BASE}/admin/items/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },
};
