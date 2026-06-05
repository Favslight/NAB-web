'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import { Search, Plus, MessageCircle, Heart, Share2, Eye, EyeOff, Star, Trash2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { getInitials } from '@/lib/utils';
import { communityApi, moderationApi } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

type CommunityPost = {
  id: string;
  title: string;
  body: string;
  category?: string;
  tags?: string[];
  like_count?: number;
  comments_count?: number;
  created_at?: string;
  author_name?: string;
  author_avatar?: string;
  is_hidden?: boolean;
  is_featured?: boolean;
  author_state_id?: string;
};

const categories = ['All', 'Announcements', 'Ideas', 'Help', 'Showcase', 'General'];

export default function CommunityPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [posts, setPosts] = useState<CommunityPost[]>([]);

  const isAdmin = user?.role === 'state_admin' || user?.role === 'super_admin';
  const isSuperAdmin = user?.role === 'super_admin';

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const res = await communityApi.getPosts({ page: 1, limit: 20 });
        if (res.success && res.data) {
          const items = (res.data.items || res.data.posts || res.data) as any[];
          setPosts(
            items.map((p) => ({
              id: p.id,
              title: p.title,
              body: p.body,
              category: p.category,
              tags: p.tags,
              like_count: p.like_count ?? p.likes_count,
              comments_count: p.comments_count,
              created_at: p.created_at,
              author_name: p.author_name,
              author_avatar: p.author_avatar,
              is_hidden: p.is_hidden,
              is_featured: p.is_featured,
              author_state_id: p.author_state_id,
            }))
          );
        }
      } catch {
        // ignore, show empty state
      }
    };

    loadPosts();
  }, []);

  const handleLike = async (postId: string) => {
    try {
      const res = await communityApi.reactToPost(postId);
      if (res.success) {
        // Update local state to reflect like/unlike
        setPosts(posts.map(p => {
          if (p.id !== postId) return p;
          const currentLikes = p.like_count ?? 0;
          return {
            ...p,
            like_count: res.message?.includes('removed') ? Math.max(0, currentLikes - 1) : currentLikes + 1
          };
        }));
        toast.success(res.message || 'Reaction updated');
      }
    } catch (error: any) {
      toast.error('Failed to like post: ' + (error.message || 'Unknown error'));
    }
  };

  const handleCommentClick = (postId: string) => {
    router.push(`/dashboard/community/post/${postId}`);
  };

  const handleModerate = async (postId: string, action: 'hide' | 'feature' | 'unfeature' | 'mark_spam' | 'delete') => {
    if (action === 'delete' && !confirm('Are you sure you want to delete this post?')) return;
    
    try {
      const res = await moderationApi.moderatePost(postId, { action });
      if (res.success) {
        toast.success(`Post ${action}d successfully`);
        // Update local state
        setPosts(posts.map(p => {
          if (p.id !== postId) return p;
          if (action === 'delete') return null as any;
          if (action === 'hide' || action === 'mark_spam') return { ...p, is_hidden: true };
          if (action === 'feature') return { ...p, is_featured: true };
          if (action === 'unfeature') return { ...p, is_featured: false };
          return p;
        }).filter(Boolean));
      }
    } catch (error: any) {
      toast.error('Failed to moderate post: ' + (error.message || 'Unknown error'));
    }
  };

  const canModerate = (post: CommunityPost) => {
    if (!isAdmin) return false;
    // Super admins can moderate any post
    if (isSuperAdmin) return true;
    // State admins can only moderate posts from their state
    return post.author_state_id === user?.state;
  };

  const filteredPosts = useMemo(
    () =>
      posts
        .filter((post) => {
          // Non-admins can't see hidden posts
          if (post.is_hidden && !isAdmin) return false;
          const categoryMatch =
            activeCategory === 'All' ||
            post.category?.toLowerCase?.() === activeCategory.toLowerCase();
          const q = searchQuery.toLowerCase();
          const text = `${post.title ?? ''} ${post.body ?? ''}`.toLowerCase();
          return categoryMatch && text.includes(q);
        })
        .sort((a, b) => {
          // Featured posts first, then by date
          if (a.is_featured && !b.is_featured) return -1;
          if (!a.is_featured && b.is_featured) return 1;
          return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
        }),
    [posts, activeCategory, searchQuery, isAdmin]
  );

  return (
    <ProtectedRoute>
      <div className="responsive-page">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold font-display text-white mb-2">
              Community Forum
            </h1>
            <p className="text-text">
              Connect, share, and grow with fellow AI builders
            </p>
          </div>
          <Button className="btn-neon" onClick={() => router.push('/dashboard/community/new')}>
            <Plus className="mr-2" size={18} />
            New Post
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text/60" size={18} />
            <Input
              placeholder="Search discussions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-midnight-light border-border"
            />
          </div>
          <div className="-mx-3 flex gap-2 overflow-x-auto px-3 pb-2 sm:mx-0 sm:px-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
                  activeCategory === cat
                    ? 'bg-emerald/20 text-emerald border border-emerald/30'
                    : 'bg-midnight-light text-text hover:bg-midnight-light/80'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {filteredPosts.length === 0 ? (
            <p className="text-sm text-text">
              No discussions yet. Be the first to start a conversation!
            </p>
          ) : (
            filteredPosts.map((post) => (
              <Card key={post.id} className="glass card-hover">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10 border border-emerald/30">
                        <AvatarImage src={post.author_avatar} />
                        <AvatarFallback className="bg-emerald/20 text-emerald">
                          {getInitials(post.author_name || 'User')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-white">
                          {post.author_name || 'Community Member'}
                        </div>
                        {post.created_at && (
                          <div className="text-sm text-text">
                            {new Date(post.created_at).toLocaleString()}
                          </div>
                        )}
                      </div>
                    </div>
                    {post.category && (
                      <Badge variant="outline" className="text-cyan border-cyan/30">
                        {post.category}
                      </Badge>
                    )}
                    {isAdmin && (
                      <div className="flex gap-1">
                        {post.is_hidden && (
                          <Badge variant="outline" className="text-rose border-rose/30 bg-rose/10">
                            Hidden
                          </Badge>
                        )}
                        {post.is_featured && (
                          <Badge variant="outline" className="text-gold border-gold/30 bg-gold/10">
                            Featured
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {post.title}
                  </h3>
                  <p className="text-text mb-4">
                    {post.body}
                  </p>
                  <div className="flex items-center gap-6 text-sm text-text flex-wrap">
                    <button 
                      onClick={() => handleLike(post.id)}
                      className="flex items-center gap-2 hover:text-emerald transition-colors"
                    >
                      <Heart size={18} />
                      {post.like_count ?? 0}
                    </button>
                    <button 
                      onClick={() => handleCommentClick(post.id)}
                      className="flex items-center gap-2 hover:text-cyan transition-colors"
                    >
                      <MessageCircle size={18} />
                      {post.comments_count ?? 0}
                    </button>
                    <button className="flex items-center gap-2 hover:text-gold transition-colors">
                      <Share2 size={18} />
                      Share
                    </button>
                    {/* Moderation controls for admins */}
                    {canModerate(post) && (
                      <div className="flex items-center gap-2 ml-auto border-l border-border pl-4">
                        {post.is_hidden ? (
                          <button
                            onClick={() => handleModerate(post.id, 'hide')}
                            className="flex items-center gap-1 text-emerald hover:text-emerald/80 transition-colors"
                            title="Unhide post"
                          >
                            <Eye size={16} />
                            Unhide
                          </button>
                        ) : (
                          <button
                            onClick={() => handleModerate(post.id, 'hide')}
                            className="flex items-center gap-1 text-rose hover:text-rose/80 transition-colors"
                            title="Hide post"
                          >
                            <EyeOff size={16} />
                            Hide
                          </button>
                        )}
                        {post.is_featured ? (
                          <button
                            onClick={() => handleModerate(post.id, 'unfeature')}
                            className="flex items-center gap-1 text-gold hover:text-gold/80 transition-colors"
                            title="Unfeature post"
                          >
                            <Star size={16} />
                            Unfeature
                          </button>
                        ) : (
                          <button
                            onClick={() => handleModerate(post.id, 'feature')}
                            className="flex items-center gap-1 text-gold hover:text-gold/80 transition-colors"
                            title="Feature post"
                          >
                            <Star size={16} />
                            Feature
                          </button>
                        )}
                        <button
                          onClick={() => handleModerate(post.id, 'mark_spam')}
                          className="flex items-center gap-1 text-text hover:text-gold transition-colors"
                          title="Mark as spam"
                        >
                          <AlertTriangle size={16} />
                          Spam
                        </button>
                        <button
                          onClick={() => handleModerate(post.id, 'delete')}
                          className="flex items-center gap-1 text-rose hover:text-rose/80 transition-colors"
                          title="Delete post"
                        >
                          <Trash2 size={16} />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
