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
  
  register: (data: {
    full_name: string;
    email: string;
    phone?: string;
    state_id: string;
    profession?: string;
    password: string;
    referral_code?: string;
  }) =>
    apiClient.post<{ user: import('@/types').User; token: string }>('/api/auth/register', data),
  
  logout: () => apiClient.post('/api/auth/logout'),
  
  me: () => apiClient.get<import('@/types').User>('/api/auth/me'),
  
  updateProfile: (data: {
    full_name?: string;
    phone?: string;
    profession?: string;
    avatar_url?: string | null;
  }) =>
    apiClient.put<import('@/types').User>('/api/users/profile', data),
  
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    apiClient.post('/api/auth/change-password', data),

  guestLogin: (data: { full_name: string; state_id: string }) =>
    apiClient.post<{
      user: import('@/types').User;
      token: string;
      isGuest: boolean;
    }>('/api/auth/guest-login', data),

  verifyEmail: (token: string) =>
    apiClient.post<null>('/api/auth/verify-email', { token }),

  forgotPassword: (email: string) =>
    apiClient.post<null>('/api/auth/forgot-password', { email }),

  resetPassword: (token: string, password: string) =>
    apiClient.post<null>('/api/auth/reset-password', { token, password }),
};

// Membership / Payments API
export const membershipApi = {
  // POST /api/payments/initiate
  initiatePayment: (data: {
    membership_type: 'basic' | 'premium' | 'lifetime';
    referral_code?: string;
  }) =>
    apiClient.post<{
      authorization_url: string;
      reference: string;
      access_code: string;
    }>('/api/payments/initiate', data),

  // GET /api/payments/verify/:reference
  verifyPayment: (reference: string) =>
    apiClient.get<{
      status: string;
      amount: number;
      paid_at: string;
      channel: string;
    }>(`/api/payments/verify/${reference}`),

  // GET /api/payments/history
  getHistory: () =>
    apiClient.get<import('@/types').PaymentTransaction[]>('/api/payments/history'),

  // Existing membership status endpoint (if exposed separately)
  getStatus: () => apiClient.get<import('@/types').MembershipStatus>('/api/membership/status'),
};

// Referral API
export const referralApi = {
  // GET /api/referrals/me - current user's referral dashboard
  getMe: () =>
    apiClient.get<{
      referral_code: string;
      referral_link: string;
      stats: {
        clicked: number;
        signed_up: number;
        paid: number;
        rewarded: number;
        total_rewards: number;
      };
      referrals: any[];
    }>('/api/referrals/me'),

  // GET /api/referrals/leaderboard - top referrers
  getLeaderboard: (limit?: number) =>
    apiClient.get<any[]>('/api/referrals/leaderboard', limit ? { limit } : undefined),

  // POST /api/referrals/track-click - track referral link clicks (public)
  trackClick: (data: {
    referral_code: string;
    ip_address?: string;
    user_agent?: string;
  }) => apiClient.post<null>('/api/referrals/track-click', data),

  // GET /api/referrals/admin/stats - aggregate stats for super admins
  getAdminStats: () => apiClient.get<any>('/api/referrals/admin/stats'),
};

// User API (admin and profile helpers)
export const userApi = {
  // GET /api/users - admin list with filters
  getAll: (params?: {
    page?: number;
    limit?: number;
    state_id?: string;
    role?: 'guest' | 'member' | 'premium_builder' | 'state_admin' | 'super_admin';
  }) => apiClient.get<any>('/api/users', params),

  // GET /api/users/profile - current user profile (+membership, referral stats)
  getProfile: () => apiClient.get<any>('/api/users/profile'),

  // PUT /api/users/profile - update current user profile
  updateProfile: (data: {
    full_name?: string;
    phone?: string;
    profession?: string;
    avatar_url?: string | null;
  }) => apiClient.put<any>('/api/users/profile', data),

  // GET /api/users/:id - fetch user by id
  getById: (id: string) => apiClient.get<any>(`/api/users/${id}`),

  // GET /api/users/states - states with user counts
  getStates: () => stateHubApi.getStates(),

  // GET /api/users/state-hubs - all hubs
  getStateHubs: () => stateHubApi.getAll(),

  // GET /api/users/state-hubs/:slug - hub by slug
  getStateHubBySlug: (slug: string) => stateHubApi.getBySlug(slug),
};

// Training API
export const trainingApi = {
  // GET /api/trainings
  getAll: (params?: { page?: number; limit?: number; category?: string }) =>
    apiClient.get<any>('/api/trainings', params),

  // GET /api/trainings/:id
  getById: (id: string) => apiClient.get<any>(`/api/trainings/${id}`),

  // POST /api/trainings/:id/progress
  updateProgress: (
    trainingId: string,
    data: { lesson_id?: string; progress_percent?: number; completed?: boolean }
  ) => apiClient.post<any>(`/api/trainings/${trainingId}/progress`, data),

  // GET /api/trainings/categories
  getCategories: () => apiClient.get<string[]>('/api/trainings/categories'),
};

// Community API
export const communityApi = {
  // GET /api/community/posts
  getPosts: (params?: {
    page?: number;
    limit?: number;
    state_hub_id?: string;
    post_type?: 'discussion' | 'question' | 'showcase' | 'event' | 'job';
  }) => apiClient.get<any>('/api/community/posts', params),

  // GET /api/community/posts/:id
  getPostById: (id: string) => apiClient.get<any>(`/api/community/posts/${id}`),

  // POST /api/community/posts
  createPost: (data: {
    title: string;
    content: string;
    post_type?: 'discussion' | 'question' | 'showcase' | 'event' | 'job';
    hub_id?: string;
    tags?: string[];
    media_urls?: string[];
  }) => apiClient.post<any>('/api/community/posts', data),

  // POST /api/community/posts/:id/comments
  addComment: (
    postId: string,
    data: { content: string; parent_comment_id?: string }
  ) => apiClient.post<any>(`/api/community/posts/${postId}/comments`, data),

  // POST /api/community/posts/:id/react
  reactToPost: (postId: string) =>
    apiClient.post<null>(`/api/community/posts/${postId}/react`),
};

// Product API
export const productApi = {
  // GET /api/products
  getAll: (params?: {
    page?: number;
    limit?: number;
    category?: string;
    status?: 'pending_review' | 'approved' | 'published';
  }) => apiClient.get<any>('/api/products', params),

  // GET /api/products/:slug
  getBySlug: (slug: string) => apiClient.get<any>(`/api/products/${slug}`),

  // POST /api/products
  create: (data: {
    name: string;
    description?: string;
    category?: string;
    website_url?: string;
    demo_url?: string;
  }) => apiClient.post<any>('/api/products', data),

  // PUT /api/products/:id
  update: (
    id: string,
    data: {
      name?: string;
      description?: string;
      category?: string;
      website_url?: string | null;
      demo_url?: string | null;
    }
  ) => apiClient.put<any>(`/api/products/${id}`, data),
};

// State / State Hub API (user-scoped)
export const stateHubApi = {
  // States with user counts
  getStates: () => apiClient.get<any[]>('/api/users/states'),

  // All state hubs
  getAll: () => apiClient.get<any[]>('/api/users/state-hubs'),

  // Current user's hub (derived from user's state_id)
  getMyHub: () => apiClient.get<any>('/api/users/my-hub'),

  // Single hub by slug
  getBySlug: (slug: string) =>
    apiClient.get<any>(`/api/users/state-hubs/${slug}`),
};

// Notifications API
export const notificationApi = {
  // GET /api/notifications
  getAll: (params?: { page?: number; limit?: number; unread_only?: boolean }) =>
    apiClient.get<any>('/api/notifications', {
      page: params?.page,
      limit: params?.limit,
      unread_only: params?.unread_only ?? false,
    }),

  // GET /api/notifications/unread-count
  getUnreadCount: () =>
    apiClient.get<{ count: number }>('/api/notifications/unread-count'),

  // POST /api/notifications/:id/read
  markAsRead: (id: string) =>
    apiClient.post<null>(`/api/notifications/${id}/read`),

  // POST /api/notifications/read-all
  markAllAsRead: () => apiClient.post<null>('/api/notifications/read-all'),

  // DELETE /api/notifications/:id
  delete: (id: string) => apiClient.delete(`/api/notifications/${id}`),
};

// Program API
export const programApi = {
  // GET /api/program/cohorts
  getCohorts: (params?: {
    page?: number;
    limit?: number;
    status?: 'draft' | 'open' | 'in_progress' | 'closed' | 'completed';
  }) => apiClient.get<any>('/api/program/cohorts', params),

  // GET /api/program/cohorts/:id
  getCohortById: (id: string) =>
    apiClient.get<any>(`/api/program/cohorts/${id}`),

  // POST /api/program/apply
  apply: (data: {
    cohort_id: string;
    experience_level?: 'beginner' | 'intermediate' | 'advanced';
    motivation?: string;
    portfolio_url?: string;
    github_url?: string;
    resume_url?: string;
  }) => apiClient.post<any>('/api/program/apply', data),

  // GET /api/program/applications/me
  getMyApplications: () =>
    apiClient.get<any>('/api/program/applications/me'),

  // GET /api/program/enrollments/me
  getMyEnrollments: () =>
    apiClient.get<any>('/api/program/enrollments/me'),
};

// Admin API
export const adminApi = {
  // Admin dashboard stats
  getDashboard: () =>
    apiClient.get<{
      users: { total: number; members: number };
      pending: { products: number; applications: number };
      content: { posts: number };
      revenue: { total: number; recent_transactions: number };
      isStateAdmin: boolean;
      stateId: string;
    }>('/api/admin/dashboard'),

  // Users list (admin view)
  getUsers: (params: { page?: number; limit?: number }) =>
    apiClient.get<any>('/api/admin/users', params),

  // Update user role (super admin only)
  updateUserRole: (id: string, role: 'guest' | 'member' | 'premium_builder' | 'state_admin') =>
    apiClient.put(`/api/admin/users/${id}/role`, { role }),

  // Update user status (state admin)
  updateUserStatus: (
    id: string,
    status:
      | 'pending_verification'
      | 'verified'
      | 'membership_inactive'
      | 'membership_active'
      | 'suspended'
  ) => apiClient.put(`/api/admin/users/${id}/status`, { status }),

  // Program applications
  getApplications: (params: { page?: number; limit?: number }) =>
    apiClient.get<any>('/api/admin/applications', params),

  reviewApplication: (
    id: string,
    data: { status: 'accepted' | 'rejected' | 'waitlisted'; notes?: string }
  ) => apiClient.post<null>(`/api/admin/applications/${id}/review`, data),

  // Cohorts
  createCohort: (data: {
    name: string;
    description?: string;
    start_date?: string;
    end_date?: string;
    capacity?: number;
    application_opens_at?: string;
    application_closes_at?: string;
  }) => apiClient.post<any>('/api/admin/cohorts', data),

  // Audit logs (super admin)
  getAuditLogs: (params: { page?: number; limit?: number }) =>
    apiClient.get<any>('/api/admin/audit-logs', params),

  // System settings
  getSettings: () => apiClient.get<any[]>('/api/admin/settings'),

  updateSetting: (key: string, value: string) =>
    apiClient.put<any>(`/api/admin/settings/${encodeURIComponent(key)}`, { value }),
};

// Moderation API
export const moderationApi = {
  // POST /api/moderation/posts/:id/action
  moderatePost: (
    postId: string,
    data: {
      action: 'hide' | 'feature' | 'unfeature' | 'mark_spam' | 'delete';
      reason?: string;
    }
  ) => apiClient.post<null>(`/api/moderation/posts/${postId}/action`, data),

  // POST /api/moderation/comments/:id/hide
  hideComment: (commentId: string) =>
    apiClient.post<null>(`/api/moderation/comments/${commentId}/hide`),

  // GET /api/moderation/logs
  getLogs: (params?: { page?: number; limit?: number }) =>
    apiClient.get<any>('/api/moderation/logs', params),
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
