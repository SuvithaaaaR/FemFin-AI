import apiClient from "./api";

// Auth Service - handles all authentication related API calls
const authService = {
  // Register new user
  register: async (userData) => {
    const response = await apiClient.post("/auth/register", userData);
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Login user
  login: async (credentials) => {
    const response = await apiClient.post("/auth/login", credentials);
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Logout user
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  // Get current user from localStorage
  getCurrentUser: () => {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  },

  // Get current user from API
  getMe: async () => {
    const response = await apiClient.get("/auth/me");
    return response.data;
  },

  // Update user details
  updateDetails: async (userData) => {
    const response = await apiClient.put("/auth/updatedetails", userData);
    if (response.data.data) {
      localStorage.setItem("user", JSON.stringify(response.data.data));
    }
    return response.data;
  },

  // Update password
  updatePassword: async (passwordData) => {
    const response = await apiClient.put("/auth/updatepassword", passwordData);
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
    }
    return response.data;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem("token");
  },

  // Get token
  getToken: () => {
    return localStorage.getItem("token");
  },
};

export default authService;
