import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';
import { ApiResponse } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = Cookies.get('auth_token');
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError<ApiResponse<unknown>>) => {
        if (error.response?.status === 401) {
          Cookies.remove('auth_token');
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
        }
        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string, params?: Record<string, unknown>): Promise<ApiResponse<T>> {
    const response = await this.client.get<ApiResponse<T>>(url, { params });
    return response.data;
  }

  async post<T>(url: string, data?: unknown): Promise<ApiResponse<T>> {
    const response = await this.client.post<ApiResponse<T>>(url, data);
    return response.data;
  }

  async put<T>(url: string, data?: unknown): Promise<ApiResponse<T>> {
    const response = await this.client.put<ApiResponse<T>>(url, data);
    return response.data;
  }

  async patch<T>(url: string, data?: unknown): Promise<ApiResponse<T>> {
    const response = await this.client.patch<ApiResponse<T>>(url, data);
    return response.data;
  }

  async delete<T>(url: string): Promise<ApiResponse<T>> {
    const response = await this.client.delete<ApiResponse<T>>(url);
    return response.data;
  }

  // Upload file with multipart/form-data
  async upload<T>(url: string, formData: FormData): Promise<ApiResponse<T>> {
    const response = await this.client.post<ApiResponse<T>>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
}

export const apiClient = new ApiClient();

// Auth API
export const authApi = {
  login: (credentials: { email?: string; id_no?: string; password: string }) =>
    apiClient.post<{ user: import('@/types').User; token: string }>('/api/auth/login', credentials),
  
  register: (data: import('@/types').RegisterData) =>
    apiClient.post<{ user: import('@/types').User; token: string }>('/api/auth/register', data),
  
  logout: () => apiClient.post('/api/auth/logout'),
  
  me: () => apiClient.get<import('@/types').User>('/api/users/me'),
  
  updateProfile: (data: Partial<import('@/types').User>) =>
    apiClient.put<import('@/types').User>('/api/users/me', data),
  
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    apiClient.post('/api/auth/change-password', data),
};

// Membership API
export const membershipApi = {
  initiatePayment: () =>
    apiClient.post<{ authorization_url: string; reference: string }>('/api/payments/initiate-membership'),
  
  verifyPayment: (reference: string) =>
    apiClient.get<{ status: string; transaction: import('@/types').PaymentTransaction }>(`/api/payments/verify/${reference}`),
  
  getStatus: () => apiClient.get<import('@/types').MembershipStatus>('/api/membership/status'),
};

// Referral API
export const referralApi = {
  getStats: () => apiClient.get<import('@/types').ReferralStats>('/api/referrals/me'),
  
  getReferrals: (params?: { status?: string; page?: number; limit?: number }) =>
    apiClient.get<{ referrals: import('@/types').Referral[]; total: number }>('/api/referrals', params),
  
  getLeaderboard: () =>
    apiClient.get<{ user: import('@/types').User; referral_count: number; rewards: number }[]>('/api/referrals/leaderboard'),
};

// Training API
export const trainingApi = {
  getAll: (params?: { category?: string; level?: string; is_premium?: boolean }) =>
    apiClient.get<import('@/types').Training[]>('/api/trainings', params),
  
  getById: (id: string) => apiClient.get<import('@/types').Training>(`/api/trainings/${id}`),
  
  getProgress: () => apiClient.get<import('@/types').TrainingProgress[]>('/api/trainings/progress'),
  
  updateProgress: (trainingId: string, progress: number) =>
    apiClient.post(`/api/trainings/${trainingId}/progress`, { progress }),
};

// Community API
export const communityApi = {
  getPosts: (params?: { category?: string; page?: number; limit?: number }) =>
    apiClient.get<{ posts: import('@/types').CommunityPost[]; total: number }>('/api/community/posts', params),
  
  getPostById: (id: string) => apiClient.get<import('@/types').CommunityPost>(`/api/community/posts/${id}`),
  
  createPost: (data: { title: string; content: string; category: string; tags?: string[] }) =>
    apiClient.post<import('@/types').CommunityPost>('/api/community/posts', data),
  
  updatePost: (id: string, data: Partial<import('@/types').CommunityPost>) =>
    apiClient.put<import('@/types').CommunityPost>(`/api/community/posts/${id}`, data),
  
  deletePost: (id: string) => apiClient.delete(`/api/community/posts/${id}`),
  
  likePost: (id: string) => apiClient.post(`/api/community/posts/${id}/like`),
  
  getComments: (postId: string) =>
    apiClient.get<import('@/types').Comment[]>(`/api/community/posts/${postId}/comments`),
  
  createComment: (postId: string, content: string) =>
    apiClient.post<import('@/types').Comment>(`/api/community/posts/${postId}/comments`, { content }),
};

// Product API
export const productApi = {
  getAll: (params?: { industry?: string; state?: string; featured?: boolean }) =>
    apiClient.get<{ products: import('@/types').Product[]; total: number }>('/api/products', params),
  
  getById: (id: string) => apiClient.get<import('@/types').Product>(`/api/products/${id}`),
  
  create: (data: FormData) => apiClient.upload<import('@/types').Product>('/api/products', data),
  
  update: (id: string, data: FormData) =>
    apiClient.upload<import('@/types').Product>(`/api/products/${id}`, data),
  
  delete: (id: string) => apiClient.delete(`/api/products/${id}`),
  
  like: (id: string) => apiClient.post(`/api/products/${id}/like`),
};

// State Hub API
export const stateHubApi = {
  getAll: () => apiClient.get<import('@/types').StateHub[]>('/api/state-hubs'),
  
  getById: (id: string) => apiClient.get<import('@/types').StateHub>(`/api/state-hubs/${id}`),
  
  getMembers: (id: string) => apiClient.get<import('@/types').User[]>(`/api/state-hubs/${id}/members`),
  
  getAnnouncements: (id: string) =>
    apiClient.get<import('@/types').Announcement[]>(`/api/state-hubs/${id}/announcements`),
};

// Notifications API
export const notificationApi = {
  getAll: (params?: { is_read?: boolean; page?: number; limit?: number }) =>
    apiClient.get<{ notifications: import('@/types').Notification[]; total: number; unread_count: number }>('/api/notifications', params),
  
  markAsRead: (id: string) => apiClient.patch(`/api/notifications/${id}/read`),
  
  markAllAsRead: () => apiClient.patch('/api/notifications/read-all'),
  
  delete: (id: string) => apiClient.delete(`/api/notifications/${id}`),
};

// Program API
export const programApi = {
  apply: (data: { program_name: string; application_data?: Record<string, unknown> }) =>
    apiClient.post<import('@/types').ProgramApplication>('/api/programs/apply', data),
  
  getApplications: () => apiClient.get<import('@/types').ProgramApplication[]>('/api/programs/applications'),
  
  initiatePayment: (applicationId: string) =>
    apiClient.post<{ authorization_url: string; reference: string }>(`/api/programs/${applicationId}/pay`),
};

// Cloudinary upload
export const uploadToCloudinary = async (file: File, folder: string): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', folder);

  const response = await apiClient.upload<{ url: string }>('/api/upload', formData);
  
  if (!response.success || !response.data) {
    throw new Error(response.error || 'Upload failed');
  }
  
  return response.data.url;
};

export default apiClient;
