'use client';

import { useEffect, useState } from 'react';
import { ArrowLeft, MapPin, Users, MessageSquare, Calendar, Activity } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { communityApi, stateHubApi } from '@/lib/api';

type StateHub = {
  id: string;
  name?: string;
  state_name?: string;
  member_count?: number;
  coordinator_name?: string;
};

type StateActivity = {
  id: string;
  state_name: string;
  activity_type: 'post' | 'event' | 'member_joined';
  title: string;
  description?: string;
  author_name?: string;
  created_at: string;
};

export default function StateActivitiesPage() {
  const [stateHubs, setStateHubs] = useState<StateHub[]>([]);
  const [activities, setActivities] = useState<StateActivity[]>([]);
  const [myHub, setMyHub] = useState<StateHub | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load all state hubs and my hub in parallel
        const [hubsRes, myHubRes] = await Promise.all([
          stateHubApi.getAll(),
          stateHubApi.getMyHub(),
        ]);

        if (hubsRes.success && hubsRes.data) {
          setStateHubs(hubsRes.data as StateHub[]);
        }

        if (myHubRes.success && myHubRes.data) {
          setMyHub(myHubRes.data as StateHub);
        }

        // Load activities from all states (using community posts as activities)
        const postsRes = await communityApi.getPosts({
          page: 1,
          limit: 20,
        });

        if (postsRes.success && postsRes.data) {
          const items = (postsRes.data.items || postsRes.data.posts || postsRes.data) as any[];
          const mappedActivities: StateActivity[] = items.map((post) => ({
            id: post.id,
            state_name: post.state_hub_name || post.state_name || 'General',
            activity_type: 'post',
            title: post.title,
            description: post.content?.substring(0, 100) + '...',
            author_name: post.author_name,
            created_at: post.created_at,
          }));
          setActivities(mappedActivities);
        }
      } catch (error) {
        console.error('Failed to load activities:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const myStateName = myHub?.state_name || myHub?.name;

  return (
    <ProtectedRoute>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/dashboard/state-hub">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold font-display text-white mb-2">
              State Activities
            </h1>
            <p className="text-text">
              See what AI builders across Nigeria are doing
            </p>
          </div>
        </div>

        {/* My State Hub Card */}
        {myHub && (
          <Card className="glass border-emerald/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald" />
                Your State: {myStateName}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 text-text">
                  <Users className="w-4 h-4 text-emerald" />
                  <span>{myHub.member_count || 0} members</span>
                </div>
                {myHub.coordinator_name && (
                  <div className="text-text">
                    Lead: <span className="text-white">{myHub.coordinator_name}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* All State Hubs Overview */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4">All State Hubs</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stateHubs.length === 0 ? (
              <p className="text-sm text-text">No state hubs available yet.</p>
            ) : (
              stateHubs.map((hub) => {
                const isMyHub = myHub?.id === hub.id;
                return (
                  <Card 
                    key={hub.id} 
                    className={`glass ${isMyHub ? 'border-emerald/30' : ''}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-bold text-white">
                          {hub.state_name || hub.name}
                        </h3>
                        {isMyHub && (
                          <Badge className="bg-emerald/20 text-emerald">Your Hub</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-text">
                        <span className="flex items-center gap-1">
                          <Users size={14} />
                          {hub.member_count || 0} members
                        </span>
                      </div>
                      {hub.coordinator_name && (
                        <p className="text-sm text-text mt-2">
                          Lead: {hub.coordinator_name}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </div>

        {/* Recent Activities Feed */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan" />
            Recent Activities
          </h2>
          <Card className="glass">
            <CardContent className="p-4">
              {loading ? (
                <p className="text-text text-center py-8">Loading activities...</p>
              ) : activities.length === 0 ? (
                <p className="text-text text-center py-8">
                  No activities yet. Be the first to start a discussion!
                </p>
              ) : (
                <div className="space-y-4">
                  {activities.map((activity) => (
                    <Link
                      key={activity.id}
                      href={`/dashboard/community?post=${activity.id}`}
                      className="block"
                    >
                      <div className="p-4 glass rounded-lg hover:bg-midnight-light/50 transition-colors">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="border-cyan/50 text-cyan">
                              <MapPin className="w-3 h-3 mr-1" />
                              {activity.state_name}
                            </Badge>
                            <Badge variant="outline" className="border-emerald/50 text-emerald">
                              <MessageSquare className="w-3 h-3 mr-1" />
                              Post
                            </Badge>
                          </div>
                          <span className="text-xs text-text">
                            {new Date(activity.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <h3 className="font-medium text-white mb-1">
                          {activity.title}
                        </h3>
                        {activity.description && (
                          <p className="text-sm text-text line-clamp-2">
                            {activity.description}
                          </p>
                        )}
                        {activity.author_name && (
                          <p className="text-xs text-text mt-2">
                            by {activity.author_name}
                          </p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Back Button */}
        <div className="flex justify-center">
          <Link href="/dashboard/state-hub">
            <Button variant="outline" className="border-emerald/50 text-emerald hover:bg-emerald/10">
              <ArrowLeft className="mr-2 w-4 h-4" />
              Back to My State Hub
            </Button>
          </Link>
        </div>
      </div>
    </ProtectedRoute>
  );
}
