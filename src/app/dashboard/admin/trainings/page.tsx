'use client';

import { useEffect, useState } from 'react';
import { BookOpen, Plus, Upload, Image, Video, Edit2, Eye, EyeOff, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { trainingApi } from '@/lib/api';
import { toast } from 'sonner';

interface Training {
  id: string;
  title: string;
  description?: string;
  category?: string;
  access_level: string;
  is_published: boolean;
  thumbnail_url?: string;
  created_at: string;
  lessons_count?: number;
}

export default function AdminTrainingsPage() {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [total, setTotal] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    access_level: 'guest',
    duration_minutes: 30,
  });

  useEffect(() => {
    loadTrainings();
  }, [page]);

  const loadTrainings = async () => {
    setLoading(true);
    try {
      const res = await trainingApi.getAll({ page, limit });
      if (res.success && res.data) {
        setTrainings(res.data || []);
        setTotal(res.meta?.total || res.data?.length || 0);
      }
    } catch (error: any) {
      toast.error('Failed to load trainings: ' + (error.message || 'Unknown error'));
      console.error('Load trainings error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error('Training title is required');
      return;
    }

    setSubmitting(true);
    try {
      const res = await trainingApi.create({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        access_level: formData.access_level,
        duration_minutes: formData.duration_minutes,
      });
      
      if (res.success) {
        toast.success('Training created successfully');
        setShowForm(false);
        setFormData({ title: '', description: '', category: '', access_level: 'guest', duration_minutes: 30 });
        loadTrainings(); // Refresh the list
      } else {
        toast.error('Failed to create training');
      }
    } catch (error: any) {
      toast.error('Failed to create training: ' + (error.message || 'Unknown error'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleThumbnailUpload = async (trainingId: string, file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const res = await fetch(`/api/trainings/${trainingId}/thumbnail`, {
        method: 'POST',
        body: formData,
      });
      
      if (res.ok) {
        toast.success('Thumbnail uploaded successfully');
        loadTrainings();
      } else {
        throw new Error('Upload failed');
      }
    } catch (error: any) {
      toast.error('Failed to upload thumbnail: ' + (error.message || 'Unknown error'));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this training?')) return;
    
    try {
      const res = await trainingApi.delete(id);
      if (res.success) {
        toast.success('Training deleted successfully');
        loadTrainings();
      } else {
        toast.error('Failed to delete training');
      }
    } catch (error: any) {
      toast.error('Failed to delete training: ' + (error.message || 'Unknown error'));
    }
  };

  const handleTogglePublish = async (training: Training) => {
    try {
      const res = await trainingApi.update(training.id, {
        is_published: !training.is_published,
      });
      if (res.success) {
        toast.success(training.is_published ? 'Training unpublished' : 'Training published');
        loadTrainings();
      } else {
        toast.error('Failed to update training');
      }
    } catch (error: any) {
      toast.error('Failed to update training: ' + (error.message || 'Unknown error'));
    }
  };

  const getAccessLevelColor = (level: string) => {
    switch (level) {
      case 'guest':
        return 'bg-gray/20 text-gray border-gray/30';
      case 'member':
        return 'bg-emerald/20 text-emerald border-emerald/30';
      case 'premium_builder':
        return 'bg-gold/20 text-gold border-gold/30';
      default:
        return 'bg-cyan/20 text-cyan border-cyan/30';
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <ProtectedRoute>
      <div className="responsive-page">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan/20">
              <BookOpen className="text-cyan" size={24} />
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl font-bold font-display text-white">Training Management</h1>
              <p className="text-text text-sm">Create and manage learning content</p>
            </div>
          </div>
          <Button onClick={() => setShowForm(!showForm)} className="btn-neon w-full sm:w-auto">
            <Plus size={18} className="mr-2" />
            {showForm ? 'Cancel' : 'New Training'}
          </Button>
        </div>

        {/* Create Training Form */}
        {showForm && (
          <Card className="glass border-cyan/20">
            <CardHeader>
              <CardTitle className="text-white">Create New Training</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Training Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Introduction to AI/ML"
                    className="bg-midnight-light border-border"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of this training"
                    className="bg-midnight-light border-border min-h-[100px]"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      placeholder="e.g., AI Fundamentals"
                      className="bg-midnight-light border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="access_level">Access Level</Label>
                    <select
                      id="access_level"
                      value={formData.access_level}
                      onChange={(e) => setFormData({ ...formData, access_level: e.target.value })}
                      className="w-full h-10 px-3 rounded-md border border-border bg-midnight-light text-white focus:outline-none focus:ring-2 focus:ring-emerald"
                    >
                      <option value="guest">Guest (Free)</option>
                      <option value="member">Member Only</option>
                      <option value="premium_builder">Premium Builder</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration (minutes)</Label>
                    <Input
                      id="duration"
                      type="number"
                      min={1}
                      value={formData.duration_minutes}
                      onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) || 30 })}
                      placeholder="e.g., 30"
                      className="bg-midnight-light border-border"
                    />
                  </div>
                </div>
                <div className="flex flex-col justify-end gap-2 sm:flex-row">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowForm(false)}
                    className="w-full border-border sm:w-auto"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="btn-neon w-full sm:w-auto" disabled={submitting}>
                    {submitting ? 'Creating...' : 'Create Training'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Trainings List */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="text-white">All Trainings ({total})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-text">Loading trainings...</div>
            ) : trainings.length === 0 ? (
              <div className="text-center py-8 text-text">
                <BookOpen className="mx-auto mb-4 text-text/50" size={48} />
                <p>No trainings found</p>
                <p className="text-sm mt-1">Click &quot;New Training&quot; to create your first training</p>
              </div>
            ) : (
              <div className="space-y-4">
                {trainings.map((training) => (
                  <div
                    key={training.id}
                    className="flex min-w-0 flex-col justify-between gap-4 rounded-lg border border-border bg-midnight-light/50 p-3 sm:p-4 md:flex-row md:items-center"
                  >
                    <div className="flex min-w-0 items-start gap-3 sm:gap-4">
                      <div className="w-16 h-16 rounded-lg bg-midnight flex items-center justify-center shrink-0 overflow-hidden">
                        {training.thumbnail_url ? (
                          <img
                            src={training.thumbnail_url}
                            alt={training.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Image className="text-text/50" size={24} />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="mb-1 flex flex-wrap items-center gap-2">
                          <h3 className="text-white font-medium">{training.title}</h3>
                          <Badge
                            variant="outline"
                            className={training.is_published ? 'bg-emerald/20 text-emerald' : 'bg-rose/20 text-rose'}
                          >
                            {training.is_published ? (
                              <><Eye size={12} className="mr-1" /> Published</>
                            ) : (
                              <><EyeOff size={12} className="mr-1" /> Draft</>
                            )}
                          </Badge>
                        </div>
                        <p className="text-text text-sm line-clamp-2">{training.description || 'No description'}</p>
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <Badge variant="outline" className={getAccessLevelColor(training.access_level)}>
                            {training.access_level}
                          </Badge>
                          {training.category && (
                            <Badge variant="outline" className="text-cyan border-cyan/30">
                              {training.category}
                            </Badge>
                          )}
                          <span className="text-text text-xs">
                            {training.lessons_count || 0} lessons
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-2 min-[420px]:grid-cols-3 md:flex md:flex-wrap md:items-center">
                      <label className="inline-flex h-8 cursor-pointer items-center justify-center rounded-md border border-border bg-background px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-midnight-light hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleThumbnailUpload(training.id, file);
                          }}
                        />
                        <Image size={14} className="mr-1" />
                        Thumbnail
                      </label>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="border-border h-8"
                        onClick={() => handleTogglePublish(training)}
                      >
                        {training.is_published ? (
                          <><EyeOff size={14} className="mr-1" /> Unpublish</>
                        ) : (
                          <><Eye size={14} className="mr-1" /> Publish</>
                        )}
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="border-border h-8 border-rose/50 text-rose hover:bg-rose/10"
                        onClick={() => handleDelete(training.id)}
                      >
                        <Trash2 size={14} className="mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-text text-sm">
                      Showing {(page - 1) * limit + 1} - {Math.min(page * limit, total)} of {total}
                    </p>
                    <div className="flex flex-wrap items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(page - 1)}
                        disabled={page === 1}
                        className="border-border"
                      >
                        <ChevronLeft size={16} />
                      </Button>
                      <span className="text-text text-sm px-2">
                        Page {page} of {totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(page + 1)}
                        disabled={page === totalPages}
                        className="border-border"
                      >
                        <ChevronRight size={16} />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="glass border-cyan/20">
          <CardContent className="p-4">
            <p className="text-text text-sm">
              <span className="text-cyan font-medium">Note:</span> Use this page to manage training content. 
              You can create new trainings, upload thumbnails, and set access levels. 
              Video uploads for lessons are handled per-lesson.
            </p>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  );
}
