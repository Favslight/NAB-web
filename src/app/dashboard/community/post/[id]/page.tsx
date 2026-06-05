'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Heart, MessageCircle, Share2, Send } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { getInitials } from '@/lib/utils';
import { communityApi } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

type Comment = {
  id: string;
  content: string;
  author_name: string;
  author_avatar?: string;
  created_at: string;
  parent_comment_id?: string | null;
};

type Post = {
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
  author_state_id?: string;
  media_urls?: string[];
};

export default function PostDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const postId = params.id as string;

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadPost = async () => {
      try {
        const res = await communityApi.getPostById(postId);
        if (res.success && res.data) {
          const postData = res.data.post || res.data;
          setPost(postData as Post);
          setComments(res.data.comments || []);
        }
      } catch (error: any) {
        toast.error('Failed to load post: ' + (error.message || 'Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [postId]);

  const handleLike = async () => {
    try {
      const res = await communityApi.reactToPost(postId);
      if (res.success && post) {
        const currentLikes = post.like_count ?? 0;
        setPost({
          ...post,
          like_count: res.message?.includes('removed') 
            ? Math.max(0, currentLikes - 1) 
            : currentLikes + 1
        });
        toast.success(res.message || 'Reaction updated');
      }
    } catch (error: any) {
      toast.error('Failed to like post: ' + (error.message || 'Unknown error'));
    }
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim()) {
      toast.error('Please enter a comment');
      return;
    }

    setSubmitting(true);
    try {
      const res = await communityApi.addComment(postId, { content: newComment });
      if (res.success && res.data) {
        setComments([...comments, res.data as Comment]);
        setNewComment('');
        if (post) {
          setPost({ ...post, comments_count: (post.comments_count ?? 0) + 1 });
        }
        toast.success('Comment added successfully');
      }
    } catch (error: any) {
      toast.error('Failed to add comment: ' + (error.message || 'Unknown error'));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="flex items-center justify-center py-12">
          <p className="text-text">Loading...</p>
        </div>
      </ProtectedRoute>
    );
  }

  if (!post) {
    return (
      <ProtectedRoute>
        <div className="text-center py-12">
          <p className="text-text mb-4">Post not found</p>
          <Link href="/dashboard/community">
            <Button variant="outline" className="border-emerald/50 text-emerald">
              <ArrowLeft className="mr-2" size={18} />
              Back to Community
            </Button>
          </Link>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="mx-auto w-full max-w-4xl space-y-6 overflow-x-hidden">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/dashboard/community">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold font-display text-white">Post Details</h1>
        </div>

        {/* Post Card */}
        <Card className="glass">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="w-12 h-12 border border-emerald/30">
                  <AvatarImage src={post.author_avatar} />
                  <AvatarFallback className="bg-emerald/20 text-emerald text-lg">
                    {getInitials(post.author_name || 'User')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium text-white text-lg">
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
            </div>
          </CardHeader>
          <CardContent>
            <h2 className="text-xl font-semibold text-white mb-4">
              {post.title}
            </h2>
            <p className="text-text mb-6 whitespace-pre-wrap">
              {post.body}
            </p>

            {/* Media */}
            {post.media_urls && post.media_urls.length > 0 && (
              <div className="grid grid-cols-2 gap-4 mb-6">
                {post.media_urls.map((url, i) => (
                  <div key={i} className="rounded-lg overflow-hidden bg-midnight-light">
                    {url.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                      <img src={url} alt="" className="w-full h-48 object-cover" />
                    ) : (
                      <video src={url} className="w-full h-48 object-cover" controls />
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-6 text-sm text-text pt-4 border-t border-border">
              <button 
                onClick={handleLike}
                className="flex items-center gap-2 hover:text-emerald transition-colors"
              >
                <Heart size={20} />
                {post.like_count ?? 0} likes
              </button>
              <button className="flex items-center gap-2 hover:text-cyan transition-colors">
                <MessageCircle size={20} />
                {post.comments_count ?? 0} comments
              </button>
              <button className="flex items-center gap-2 hover:text-gold transition-colors ml-auto">
                <Share2 size={20} />
                Share
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Comments Section */}
        <Card className="glass">
          <CardHeader>
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-cyan" />
              Comments ({comments.length})
            </h3>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Comment Form */}
            <div className="space-y-3">
              <Textarea
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="glass min-h-[100px]"
              />
              <div className="flex justify-end">
                <Button 
                  onClick={handleSubmitComment} 
                  disabled={submitting || !newComment.trim()}
                  className="btn-neon-cyan"
                >
                  {submitting ? 'Posting...' : (
                    <>
                      <Send className="mr-2" size={18} />
                      Post Comment
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Comments List */}
            <div className="space-y-4">
              {comments.length === 0 ? (
                <p className="text-text text-center py-8">
                  No comments yet. Be the first to share your thoughts!
                </p>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3 p-4 glass rounded-lg">
                    <Avatar className="w-10 h-10 border border-emerald/30 shrink-0">
                      <AvatarImage src={comment.author_avatar} />
                      <AvatarFallback className="bg-emerald/20 text-emerald text-sm">
                        {getInitials(comment.author_name || 'User')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-white">
                          {comment.author_name || 'Anonymous'}
                        </span>
                        <span className="text-xs text-text">
                          {new Date(comment.created_at).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-text text-sm whitespace-pre-wrap">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  );
}
