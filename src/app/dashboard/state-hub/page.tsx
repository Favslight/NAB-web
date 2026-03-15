'use client';

import { useState } from 'react';

import { MapPin, Users, Calendar, MessageSquare, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

const stateHubs = [
  { state: 'Lagos', members: 1250, lead: 'Adebayo O.', nextEvent: 'March 20, 2025', location: 'Yaba Tech Hub' },
  { state: 'Abuja', members: 890, lead: 'Fatima B.', nextEvent: 'March 22, 2025', location: 'TechZone Central' },
  { state: 'Kano', members: 650, lead: 'Ibrahim M.', nextEvent: 'March 25, 2025', location: 'Startup Kano' },
  { state: 'Port Harcourt', members: 520, lead: 'Chioma O.', nextEvent: 'March 28, 2025', location: 'Tech Creek' },
  { state: 'Enugu', members: 480, lead: 'Emeka N.', nextEvent: 'April 2, 2025', location: 'Tech Hub Enugu' },
];

const recentDiscussions = [
  { title: 'Lagos AI Hackathon - Team Formation', author: 'John D.', replies: 24, time: '2 hours ago' },
  { title: 'Abuja Members Meetup Photos', author: 'Sarah K.', replies: 18, time: '5 hours ago' },
  { title: 'Looking for co-founder in Kano', author: 'Ahmed M.', replies: 12, time: '1 day ago' },
];

export default function StateHubPage() {
  const { user } = useAuth();
  const userState = user?.state || 'Lagos';
  const myHub = stateHubs.find(h => h.state === userState) || stateHubs[0];

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
        <div
          
          
        >
          <Card className="glass-strong border-2 border-emerald/30">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-full bg-emerald/20">
                  <MapPin className="text-emerald" size={24} />
                </div>
                <div>
                  <CardTitle className="text-white text-2xl">{myHub.state} Hub</CardTitle>
                  <p className="text-text">Your local NAB community</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="glass rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-emerald">{myHub.members.toLocaleString()}</div>
                  <div className="text-sm text-text">Members</div>
                </div>
                <div className="glass rounded-lg p-4 text-center">
                  <div className="text-lg font-bold text-cyan">{myHub.lead}</div>
                  <div className="text-sm text-text">State Lead</div>
                </div>
                <div className="glass rounded-lg p-4 text-center">
                  <div className="text-lg font-bold text-gold">{myHub.nextEvent}</div>
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
              {stateHubs.map((hub, index) => (
                <div
                  key={hub.state}
                  
                  
                  
                >
                  <Card className={`glass card-hover ${hub.state === userState ? 'border-emerald/30' : ''}`}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-bold text-white">{hub.state}</h3>
                        {hub.state === userState && (
                          <Badge className="bg-emerald/20 text-emerald">Your Hub</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-text mb-3">
                        <span className="flex items-center gap-1">
                          <Users size={14} />
                          {hub.members.toLocaleString()}
                        </span>
                        <span>Lead: {hub.lead}</span>
                      </div>
                      <Button variant="ghost" size="sm" className="text-emerald w-full">
                        View Hub
                        <ArrowRight className="ml-1" size={14} />
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Discussions */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4">Recent Discussions</h2>
            <Card className="glass">
              <CardContent className="p-4 space-y-4">
                {recentDiscussions.map((discussion, index) => (
                  <div
                    key={index}
                    className="p-3 glass rounded-lg hover:bg-midnight-light/50 cursor-pointer transition-colors"
                  >
                    <h4 className="font-medium text-white text-sm mb-1">{discussion.title}</h4>
                    <div className="flex items-center gap-3 text-xs text-text">
                      <span>{discussion.author}</span>
                      <span>{discussion.replies} replies</span>
                      <span>{discussion.time}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
