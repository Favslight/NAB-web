'use client';

import { useState } from 'react';

import { Upload, Globe, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { productApi } from '@/lib/api';
import toast from 'react-hot-toast';

const categories = ['Healthcare', 'Education', 'Agriculture', 'Finance', 'Transportation', 'Energy', 'Other'];

export default function ProductSubmissionPage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    website: '',
    github: '',
    images: [] as string[],
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error('Product name is required');
      return;
    }
    setSubmitting(true);
    try {
      const res = await productApi.create({
        name: formData.title.trim(),
        description: formData.description.trim() || undefined,
        category: formData.category || undefined,
        website_url: formData.website.trim() || undefined,
        demo_url: formData.github.trim() || undefined,
      });
      if (res.success) {
        toast.success('Product submitted for review');
        setFormData({ title: '', description: '', category: '', website: '', github: '', images: [] });
      } else {
        throw new Error((res as any).error ?? 'Submit failed');
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Submit failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="mx-auto w-full max-w-3xl overflow-x-hidden">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl font-bold font-display text-white mb-2 sm:text-3xl">
            Submit Your Product
          </h1>
          <p className="text-text">
            Showcase your AI product to the NAB community and potential investors
          </p>
        </div>

        <div
          
          
        >
          <Card className="glass">
            <CardContent className="p-4 sm:p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Product Name</Label>
                  <Input
                    id="title"
                    placeholder="e.g., MediAI Nigeria"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="bg-midnight-light border-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe what your product does and the problem it solves..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="bg-midnight-light border-border min-h-[120px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Category</Label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setFormData({ ...formData, category: cat })}
                        className={`px-4 py-2 rounded-full text-sm transition-colors ${
                          formData.category === cat
                            ? 'bg-emerald/20 text-emerald border border-emerald/30'
                            : 'bg-midnight-light text-text hover:bg-midnight-light/80'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="website" className="flex items-center gap-2">
                      <Globe size={16} />
                      Website URL
                    </Label>
                    <Input
                      id="website"
                      placeholder="https://..."
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      className="bg-midnight-light border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="github" className="flex items-center gap-2">
                      <Github size={16} />
                      GitHub URL (Optional)
                    </Label>
                    <Input
                      id="github"
                      placeholder="https://github.com/..."
                      value={formData.github}
                      onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                      className="bg-midnight-light border-border"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Product Images</Label>
                  <div className="cursor-pointer rounded-lg border-2 border-dashed border-border p-4 text-center transition-colors hover:border-emerald/50 sm:p-8">
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 rounded-full bg-midnight-light flex items-center justify-center mb-4">
                        <Upload className="text-emerald" size={24} />
                      </div>
                      <p className="text-white font-medium mb-1">Upload product screenshots</p>
                      <p className="text-text text-sm">Drag and drop or click to upload</p>
                      <p className="text-text/60 text-xs mt-2">PNG, JPG up to 5MB each</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:gap-4">
                  <Button type="submit" className="btn-neon w-full sm:flex-1" disabled={submitting}>
                    {submitting ? 'Submitting...' : 'Submit Product'}
                  </Button>
                  <Button type="button" variant="outline" className="w-full border-border sm:w-auto" disabled={submitting}>
                    Save as Draft
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Guidelines */}
        <Card className="glass mt-6">
          <CardHeader>
            <CardTitle className="text-white text-lg">Submission Guidelines</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-text text-sm">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald mt-2 shrink-0" />
                Products must be built by Nigerian developers or have significant Nigerian involvement
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald mt-2 shrink-0" />
                Include clear description of the problem being solved
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald mt-2 shrink-0" />
                At least one screenshot or demo image is required
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald mt-2 shrink-0" />
                Submissions are reviewed within 48 hours
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  );
}
