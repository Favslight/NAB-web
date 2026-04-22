export interface User {
  id: string;
  id_no: string;
  full_name: string;
  email: string;
  phone?: string;
  state?: string;
  profession?: string;
  avatar_url?: string;
  is_member: boolean;
  membership_status: 'inactive' | 'pending' | 'active' | 'expired';
  membership_expires_at?: string;
  referral_code: string;
  referred_by?: string;
  role: 'guest' | 'member' | 'premium_builder' | 'state_admin' | 'super_admin';
  created_at: string;
  updated_at: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isGuest: boolean;
}

export interface LoginCredentials {
  email?: string;
  id_no?: string;
  password: string;
}

export interface RegisterData {
  full_name: string;
  email: string;
  phone: string;
  state: string;
  profession: string;
  password: string;
  referral_code?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface MembershipPlan {
  id: string;
  name: string;
  price: number;
  duration_months: number;
  features: string[];
}

export interface Referral {
  id: string;
  referrer_id: string;
  referred_id: string;
  referred_user: User;
  status: 'pending' | 'converted' | 'rewarded';
  reward_amount: number;
  created_at: string;
}

export interface ReferralStats {
  total_referrals: number;
  converted_referrals: number;
  pending_referrals: number;
  total_rewards: number;
  referral_code: string;
  referral_link: string;
}

export interface Training {
  id: string;
  title: string;
  description: string;
  thumbnail_url?: string;
  video_url?: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration_minutes: number;
  is_premium: boolean;
  created_at: string;
  updated_at: string;
}

export interface TrainingProgress {
  training_id: string;
  user_id: string;
  progress_percent: number;
  completed: boolean;
  last_watched_at: string;
}

export interface CommunityPost {
  id: string;
  user_id: string;
  user: User;
  category: 'announcements' | 'ideas' | 'discussions' | 'collaboration';
  title: string;
  content: string;
  tags: string[];
  likes_count: number;
  comments_count: number;
  is_pinned: boolean;
  created_at: string;
  updated_at: string;
}

export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  user: User;
  content: string;
  likes_count: number;
  created_at: string;
}

export interface Product {
  id: string;
  user_id: string;
  user: User;
  title: string;
  description: string;
  category: string;
  industry: string;
  state: string;
  demo_link?: string;
  github_link?: string;
  images: string[];
  video_url?: string;
  is_featured: boolean;
  status: 'pending' | 'approved' | 'rejected';
  likes_count: number;
  created_at: string;
  updated_at: string;
}

export interface StateHub {
  id: string;
  name: string;
  state_code: string;
  description: string;
  coordinator_id?: string;
  coordinator?: User;
  member_count: number;
  cover_image?: string;
  created_at: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  type: 'general' | 'training' | 'event' | 'program';
  priority: 'low' | 'medium' | 'high';
  is_global: boolean;
  state_hub_id?: string;
  created_at: string;
  expires_at?: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: 'membership' | 'referral' | 'training' | 'program' | 'community' | 'product';
  title: string;
  message: string;
  is_read: boolean;
  action_url?: string;
  created_at: string;
}

export interface ProgramApplication {
  id: string;
  user_id: string;
  user: User;
  program_name: string;
  status: 'pending' | 'reviewing' | 'accepted' | 'rejected' | 'enrolled';
  payment_status: 'pending' | 'paid' | 'waived';
  application_data: Record<string, unknown>;
  reviewed_by?: string;
  reviewed_at?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface PaymentTransaction {
  id: string;
  user_id: string;
  type: 'membership' | 'program' | 'product';
  reference: string;
  amount: number;
  currency: string;
  status: 'pending' | 'success' | 'failed';
  gateway: string;
  metadata?: Record<string, unknown>;
  created_at: string;
}

export type UserRole = 'guest' | 'member' | 'premium_builder' | 'state_admin' | 'super_admin';
export type MembershipStatus = 'inactive' | 'pending' | 'active' | 'expired';
export type PostCategory = 'announcements' | 'ideas' | 'discussions' | 'collaboration';
export type NotificationType = 'membership' | 'referral' | 'training' | 'program' | 'community' | 'product';
