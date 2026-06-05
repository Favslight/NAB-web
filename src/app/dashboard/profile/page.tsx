'use client';

import { useState } from 'react';

import { User, Camera, Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { getInitials } from '@/lib/utils';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    state: user?.state || '',
    profession: user?.profession || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await updateUser(formData);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="mx-auto w-full max-w-3xl overflow-x-hidden">
        <h1 className="mb-6 text-2xl font-bold font-display text-white sm:mb-8 sm:text-3xl">
          My Profile
        </h1>

        <div
          
          
        >
          <Card className="glass">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <User className="text-emerald" size={20} />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="mb-6 flex flex-col items-center gap-4 text-center sm:flex-row sm:gap-6 sm:text-left">
                  <div className="relative">
                    <Avatar className="w-24 h-24 border-4 border-emerald/30">
                      <AvatarImage src={user?.avatar_url} />
                      <AvatarFallback className="bg-emerald/20 text-emerald text-2xl">
                        {user?.full_name ? getInitials(user.full_name) : '??'}
                      </AvatarFallback>
                    </Avatar>
                    <button
                      type="button"
                      className="absolute bottom-0 right-0 p-2 rounded-full bg-emerald text-midnight hover:bg-emerald-light"
                    >
                      <Camera size={16} />
                    </button>
                  </div>
                  <div className="min-w-0">
                    <div className="text-lg font-semibold text-white">
                      {user?.full_name || 'Loading...'}
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-2 text-text sm:justify-start">
                      {user?.id_no || ''}
                      {user?.membership_status === 'active' && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald/20 text-emerald uppercase tracking-wider">
                          Active Member
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Full Name</Label>
                    <Input
                      id="full_name"
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      className="bg-midnight-light border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="bg-midnight-light border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="bg-midnight-light border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="bg-midnight-light border-border"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="profession">Profession</Label>
                    <Input
                      id="profession"
                      value={formData.profession}
                      onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                      className="bg-midnight-light border-border"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="btn-neon w-full sm:w-auto"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 animate-spin" size={18} />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2" size={18} />
                      Save Changes
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}
