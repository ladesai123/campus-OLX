const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('campus_olx_token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Network error' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }
  return response.json();
};

// API client class
export class CampusOLXAPI {
  // Authentication
  static async register(userData) {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    const data = await handleResponse(response);
    
    if (data.token) {
      localStorage.setItem('campus_olx_token', data.token);
    }
    
    return data;
  }

  static async login(credentials) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    const data = await handleResponse(response);
    
    if (data.token) {
      localStorage.setItem('campus_olx_token', data.token);
    }
    
    return data;
  }

  static async googleAuth(credentials) {
    const response = await fetch(`${API_BASE_URL}/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    const data = await handleResponse(response);
    
    if (data.token) {
      localStorage.setItem('campus_olx_token', data.token);
    }
    
    return data;
  }

  static async verifyToken() {
    const response = await fetch(`${API_BASE_URL}/auth/verify`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }

  static logout() {
    localStorage.removeItem('campus_olx_token');
    return Promise.resolve({ message: 'Logged out successfully' });
  }

  // Items
  static async getItems(filters = {}) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value);
      }
    });
    
    const url = `${API_BASE_URL}/items${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await fetch(url, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }

  static async getItem(id) {
    const response = await fetch(`${API_BASE_URL}/items/${id}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }

  static async createItem(formData) {
    const token = localStorage.getItem('campus_olx_token');
    const response = await fetch(`${API_BASE_URL}/items`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` })
        // Don't set Content-Type for FormData
      },
      body: formData
    });
    return handleResponse(response);
  }

  static async updateItem(id, updates) {
    const response = await fetch(`${API_BASE_URL}/items/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates)
    });
    return handleResponse(response);
  }

  static async deleteItem(id) {
    const response = await fetch(`${API_BASE_URL}/items/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }

  static async markItemSold(id) {
    const response = await fetch(`${API_BASE_URL}/items/${id}/mark-sold`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }

  static async getUserItems() {
    const response = await fetch(`${API_BASE_URL}/items/user/my-items`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }

  // Users
  static async getProfile() {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }

  static async updateProfile(updates) {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates)
    });
    return handleResponse(response);
  }

  static async getUser(id) {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }

  // Chats
  static async getChats() {
    const response = await fetch(`${API_BASE_URL}/chats`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }

  static async getChat(id) {
    const response = await fetch(`${API_BASE_URL}/chats/${id}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }

  static async createChat(itemId, sellerId) {
    const response = await fetch(`${API_BASE_URL}/chats`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ itemId, sellerId })
    });
    return handleResponse(response);
  }

  static async sendMessage(chatId, content) {
    const response = await fetch(`${API_BASE_URL}/chats/${chatId}/messages`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ content })
    });
    return handleResponse(response);
  }

  // Admin
  static async getAdminStats() {
    const response = await fetch(`${API_BASE_URL}/admin/stats`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }

  static async getPendingItems() {
    const response = await fetch(`${API_BASE_URL}/admin/items/pending`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }

  static async approveItem(id, message = '') {
    const response = await fetch(`${API_BASE_URL}/admin/items/${id}/approve`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ message })
    });
    return handleResponse(response);
  }

  static async rejectItem(id, message) {
    const response = await fetch(`${API_BASE_URL}/admin/items/${id}/reject`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ message })
    });
    return handleResponse(response);
  }

  static async getAllUsers() {
    const response = await fetch(`${API_BASE_URL}/admin/users`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }

  static async verifyUser(id) {
    const response = await fetch(`${API_BASE_URL}/admin/users/${id}/verify`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }
}

export default CampusOLXAPI;