'use client';

import { useEffect, useMemo, useState } from 'react';

import { Search, Plus, MessageCircle, Heart, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { getInitials } from '@/lib/utils';
import { communityApi } from '@/lib/api';

type CommunityPost = {
  id: string;
  title: string;
  content: string;
  post_type?: string;
  tags?: string[];
  like_count?: number;
  comments_count?: number;
  created_at?: string;
  author_name?: string;
  author_avatar?: string;
};

const categories = ['All', 'Announcements', 'Ideas', 'Help', 'Showcase', 'General'];

export default function CommunityPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [posts, setPosts] = useState<CommunityPost[]>([]);

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
              content: p.content,
              post_type: p.post_type,
              tags: p.tags,
              like_count: p.like_count ?? p.likes_count,
              comments_count: p.comments_count,
              created_at: p.created_at,
              author_name: p.author_name,
              author_avatar: p.author_avatar,
            }))
          );
        }
      } catch {
        // ignore, show empty state
      }
    };

    loadPosts();
  }, []);

  const filteredPosts = useMemo(
    () =>
      posts.filter((post) => {
        const categoryMatch =
          activeCategory === 'All' ||
          post.post_type?.toLowerCase?.() === activeCategory.toLowerCase();
        const q = searchQuery.toLowerCase();
        const text =
          `${post.title ?? ''} ${post.content ?? ''}`.toLowerCase();
        return categoryMatch && text.includes(q);
      }),
    [posts, activeCategory, searchQuery]
  );

  return (
    <ProtectedRoute>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold font-display text-white mb-2">
              Community Forum
            </h1>
            <p className="text-text">
              Connect, share, and grow with fellow AI builders
            </p>
          </div>
          <Button className="btn-neon">
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
          <div className="flex gap-2 overflow-x-auto pb-2">
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
                    {post.post_type && (
                      <Badge variant="outline" className="text-cyan border-cyan/30">
                        {post.post_type}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {post.title}
                  </h3>
                  <p className="text-text mb-4">
                    {post.content}
                  </p>
                  <div className="flex items-center gap-6 text-sm text-text">
                    <button className="flex items-center gap-2 hover:text-emerald transition-colors">
                      <Heart size={18} />
                      {post.like_count ?? 0}
                    </button>
                    <button className="flex items-center gap-2 hover:text-cyan transition-colors">
                      <MessageCircle size={18} />
                      {post.comments_count ?? 0}
                    </button>
                    <button className="flex items-center gap-2 hover:text-gold transition-colors">
                      <Share2 size={18} />
                      Share
                    </button>
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
