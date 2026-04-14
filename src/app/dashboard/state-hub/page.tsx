'use client';

import { useEffect, useState } from 'react';

import { MapPin, Users, Calendar, MessageSquare, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { userApi, communityApi, stateHubApi } from '@/lib/api';

type StateHub = {
  id: string;
  slug?: string;
  name?: string;
  state_name?: string;
  member_count?: number;
  coordinator_name?: string;
  next_event_date?: string;
};

type HubDiscussion = {
  id: string;
  title: string;
  author_name?: string;
  comments_count?: number;
  created_at?: string;
};

export default function StateHubPage() {
  const [hubs, setHubs] = useState<StateHub[]>([]);
  const [myHub, setMyHub] = useState<StateHub | null>(null);
  const [discussions, setDiscussions] = useState<HubDiscussion[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [hubsRes, myHubRes] = await Promise.all([
          userApi.getStateHubs(),
          stateHubApi.getMyHub(),
        ]);

        if (hubsRes.success && hubsRes.data) {
          setHubs(hubsRes.data as StateHub[]);
        }

        if (myHubRes.success && myHubRes.data) {
          setMyHub(myHubRes.data as StateHub);
        }
      } catch {
        // soft-fail, keep UI
      }
    };

    load();
  }, []);

  useEffect(() => {
    const loadDiscussions = async () => {
      if (!myHub?.id) return;
      try {
        const res = await communityApi.getPosts({
          page: 1,
          limit: 5,
          state_hub_id: myHub.id,
        });
        if (res.success && res.data) {
          const items = (res.data.items || res.data.posts || res.data) as any[];
          setDiscussions(
            items.map((p) => ({
              id: p.id,
              title: p.title,
              author_name: p.author_name,
              comments_count: p.comments_count ?? p.comment_count,
              created_at: p.created_at,
            }))
          );
        }
      } catch {
        // ignore
      }
    };

    loadDiscussions();
  }, [myHub]);

  const userStateLabel = myHub?.state_name || myHub?.name || 'Your State';

  const memberCount = myHub?.member_count ?? 0;
  const coordinator = myHub?.coordinator_name ?? 'State Coordinator';
  const nextEvent =
    myHub?.next_event_date &&
    !Number.isNaN(Date.parse(myHub.next_event_date))
      ? new Date(myHub.next_event_date).toLocaleDateString()
      : 'TBA';

  return (
    <ProtectedRoute>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold font-display text-white mb-2">
            State Hub
          </h1>
          <p className="text-text">
            Connect with AI builders in your state
          </p>
        </div>

        {/* My State Hub */}
        <div>
          <Card className="glass-strong border-2 border-emerald/30">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-full bg-emerald/20">
                  <MapPin className="text-emerald" size={24} />
                </div>
                <div>
                  <CardTitle className="text-white text-2xl">
                    {userStateLabel} Hub
                  </CardTitle>
                  <p className="text-text">Your local NAB community</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="glass rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-emerald">
                    {memberCount.toLocaleString()}
                  </div>
                  <div className="text-sm text-text">Members</div>
                </div>
                <div className="glass rounded-lg p-4 text-center">
                  <div className="text-lg font-bold text-cyan">
                    {coordinator}
                  </div>
                  <div className="text-sm text-text">State Lead</div>
                </div>
                <div className="glass rounded-lg p-4 text-center">
                  <div className="text-lg font-bold text-gold">
                    {nextEvent}
                  </div>
                  <div className="text-sm text-text">Next Event</div>
                </div>
              </div>
              <div className="flex gap-3">
                <Button className="btn-neon flex-1">
                  <Calendar className="mr-2" size={18} />
                  View Events
                </Button>
                <Button variant="outline" className="flex-1 border-border">
                  <MessageSquare className="mr-2" size={18} />
                  Join Discussion
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* All State Hubs */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold text-white mb-4">All State Hubs</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {hubs.length === 0 ? (
                <p className="text-sm text-text">
                  State hubs will appear here once configured by the admin.
                </p>
              ) : (
                hubs.map((hub) => {
                  const hubStateLabel = hub.state_name || hub.name || 'Hub';
                  const isUserHub = !!myHub?.id && hub.id === myHub.id;

                  return (
                    <Card
                      key={hub.id}
                      className={`glass card-hover ${
                        isUserHub ? 'border-emerald/30' : ''
                      }`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-bold text-white">{hubStateLabel}</h3>
                          {isUserHub && (
                            <Badge className="bg-emerald/20 text-emerald">
                              Your Hub
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-text mb-3">
                          <span className="flex items-center gap-1">
                            <Users size={14} />
                            {(hub.member_count ?? 0).toLocaleString()}
                          </span>
                          {hub.coordinator_name && (
                            <span>Lead: {hub.coordinator_name}</span>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-emerald w-full"
                        >
                          View Hub
                          <ArrowRight className="ml-1" size={14} />
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </div>

          {/* Recent Discussions */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4">Recent Discussions</h2>
            <Card className="glass">
              <CardContent className="p-4 space-y-4">
                {discussions.length === 0 ? (
                  <p className="text-sm text-text">
                    When members start conversations in your state hub, they&apos;ll
                    show up here.
                  </p>
                ) : (
                  discussions.map((discussion) => (
                    <div
                      key={discussion.id}
                      className="p-3 glass rounded-lg hover:bg-midnight-light/50 cursor-pointer transition-colors"
                    >
                      <h4 className="font-medium text-white text-sm mb-1">
                        {discussion.title}
                      </h4>
                      <div className="flex items-center gap-3 text-xs text-text">
                        {discussion.author_name && <span>{discussion.author_name}</span>}
                        {typeof discussion.comments_count === 'number' && (
                          <span>{discussion.comments_count} replies</span>
                        )}
                        {discussion.created_at && (
                          <span>
                            {new Date(discussion.created_at).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
