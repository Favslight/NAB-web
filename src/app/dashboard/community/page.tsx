'use client';

import { useState } from 'react';

import { Search, Plus, MessageCircle, Heart, Share2, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { getInitials } from '@/lib/utils';

const categories = ['All', 'Announcements', 'Ideas', 'Help', 'Showcase', 'General'];

const posts = [
  {
    id: 1,
    title: 'NAB Lagos Meetup - March 2025',
    content: 'Join us for our monthly meetup at the Tech Hub in Yaba. We\'ll be discussing AI trends and networking.',
    author: { name: 'NAB Admin', avatar: '' },
    category: 'Announcements',
    likes: 45,
    comments: 12,
    time: '2 hours ago',
    pinned: true,
  },
  {
    id: 2,
    title: 'Looking for co-founder for healthtech AI project',
    content: 'I\'m building an AI-powered diagnostic tool for rural healthcare. Looking for a technical co-founder with ML experience.',
    author: { name: 'Sarah Johnson', avatar: '' },
    category: 'Ideas',
    likes: 23,
    comments: 8,
    time: '5 hours ago',
    pinned: false,
  },
  {
    id: 3,
    title: 'How to deploy AI models on AWS?',
    content: 'I\'m struggling with deploying my first ML model. Any tutorials or resources would be helpful!',
    author: { name: 'Michael Chen', avatar: '' },
    category: 'Help',
    likes: 15,
    comments: 6,
    time: '1 day ago',
    pinned: false,
  },
];

export default function CommunityPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredPosts = posts.filter(post => 
    (activeCategory === 'All' || post.category === activeCategory) &&
    (post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
     post.content.toLowerCase().includes(searchQuery.toLowerCase()))
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
          {filteredPosts.map((post, index) => (
            <div
              key={post.id}
              
              
              
            >
              <Card className={`glass card-hover ${post.pinned ? 'border-gold/30' : ''}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10 border border-emerald/30">
                        <AvatarImage src={post.author.avatar} />
                        <AvatarFallback className="bg-emerald/20 text-emerald">
                          {getInitials(post.author.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-white">{post.author.name}</div>
                        <div className="text-sm text-text">{post.time}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {post.pinned && (
                        <Badge className="bg-gold/20 text-gold border-gold/30">
                          Pinned
                        </Badge>
                      )}
                      <Badge variant="outline" className="text-cyan border-cyan/30">
                        {post.category}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <h3 className="text-lg font-semibold text-white mb-2">{post.title}</h3>
                  <p className="text-text mb-4">{post.content}</p>
                  <div className="flex items-center gap-6 text-sm text-text">
                    <button className="flex items-center gap-2 hover:text-emerald transition-colors">
                      <Heart size={18} />
                      {post.likes}
                    </button>
                    <button className="flex items-center gap-2 hover:text-cyan transition-colors">
                      <MessageCircle size={18} />
                      {post.comments}
                    </button>
                    <button className="flex items-center gap-2 hover:text-gold transition-colors">
                      <Share2 size={18} />
                      Share
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </ProtectedRoute>
  );
}
