'use client';

import { useState } from 'react';
import { Layers, Plus, Calendar, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { adminApi } from '@/lib/api';
import { toast } from 'sonner';

export default function AdminCohortsPage() {
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    start_date: '',
    end_date: '',
    capacity: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Cohort name is required');
      return;
    }

    setSubmitting(true);
    try {
      const res = await adminApi.createCohort({
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        start_date: formData.start_date || undefined,
        end_date: formData.end_date || undefined,
        capacity: formData.capacity ? parseInt(formData.capacity) : undefined,
      });
      if (res.success) {
        toast.success('Cohort created successfully');
        setFormData({ name: '', description: '', start_date: '', end_date: '', capacity: '' });
        setShowForm(false);
      }
    } catch {
      toast.error('Failed to create cohort');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan/20">
              <Layers className="text-cyan" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold font-display text-white">Cohorts</h1>
              <p className="text-text text-sm">Manage AI program cohorts</p>
            </div>
          </div>
          <Button onClick={() => setShowForm(!showForm)} className="btn-neon">
            <Plus size={18} className="mr-2" />
            {showForm ? 'Cancel' : 'New Cohort'}
          </Button>
        </div>

        {/* Create Cohort Form */}
        {showForm && (
          <Card className="glass border-cyan/20">
            <CardHeader>
              <CardTitle className="text-white">Create New Cohort</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Cohort Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., AI Builders Cohort 2024"
                      className="bg-midnight-light border-border"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="capacity">Capacity</Label>
                    <Input
                      id="capacity"
                      type="number"
                      value={formData.capacity}
                      onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                      placeholder="Number of students"
                      className="bg-midnight-light border-border"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of this cohort"
                    className="bg-midnight-light border-border"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start_date">Start Date</Label>
                    <Input
                      id="start_date"
                      type="date"
                      value={formData.start_date}
                      onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                      className="bg-midnight-light border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end_date">End Date</Label>
                    <Input
                      id="end_date"
                      type="date"
                      value={formData.end_date}
                      onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                      className="bg-midnight-light border-border"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowForm(false)}
                    className="border-border"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="btn-neon" disabled={submitting}>
                    {submitting ? 'Creating...' : 'Create Cohort'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Cohorts List Placeholder */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="text-white">Active Cohorts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-text">
              <Layers className="mx-auto mb-4 text-text/50" size={48} />
              <p>No cohorts created yet</p>
              <p className="text-sm mt-1">Click &quot;New Cohort&quot; to create your first cohort</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  );
}
