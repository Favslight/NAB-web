'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Image, Video, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { communityApi } from '@/lib/api';
import { toast } from 'sonner';

const categories = [
  { value: 'discussion', label: 'Discussion', color: 'bg-cyan/20 text-cyan' },
  { value: 'question', label: 'Question', color: 'bg-emerald/20 text-emerald' },
  { value: 'showcase', label: 'Showcase', color: 'bg-gold/20 text-gold' },
  { value: 'event', label: 'Event', color: 'bg-purple/20 text-purple' },
  { value: 'job', label: 'Job', color: 'bg-rose/20 text-rose' },
];

export default function NewPostPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [category, setCategory] = useState('discussion');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');

    if (type === 'image' && !isImage) {
      toast.error('Please select an image file');
      return;
    }
    if (type === 'video' && !isVideo) {
      toast.error('Please select a video file');
      return;
    }

    setMediaFiles([...mediaFiles, file]);
    toast.success(`${type} added successfully`);
  };

  const handleRemoveMedia = (indexToRemove: number) => {
    setMediaFiles(mediaFiles.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async () => {
    if (!title.trim() || !body.trim()) {
      toast.error('Please fill in title and content');
      return;
    }

    setIsSubmitting(true);
    try {
      // Build FormData for multipart upload
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('content', body.trim());
      formData.append('post_type', category);

      // Append media files
      mediaFiles.forEach((file) => {
        formData.append('files', file);
      });

      const response = await communityApi.createPost(formData);

      if (response.success) {
        toast.success('Post created successfully');
        router.push('/dashboard/community');
      } else {
        toast.error(response.error || 'Failed to create post');
      }
    } catch (error) {
      toast.error('Failed to create post');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-2xl font-bold font-display text-white">Create New Post</h1>
        </div>

        <Card className="glass">
          <CardHeader>
            <CardTitle className="text-white">Post Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm text-text">Category</label>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => setCategory(cat.value)}
                    className={`px-4 py-2 rounded-full text-sm transition-colors ${
                      category === cat.value
                        ? cat.color + ' border border-current'
                        : 'bg-midnight-light text-text hover:bg-midnight-light/80'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-text">Title</label>
              <Input
                placeholder="What's on your mind?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-midnight-light border-border text-white"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-text">Body</label>
              <Textarea
                placeholder="Share your thoughts, questions, or ideas..."
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="bg-midnight-light border-border text-white min-h-[200px]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-text">Tags</label>
              <div className="flex gap-2">
                <Input
                  placeholder="Add a tag and press Enter"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  className="bg-midnight-light border-border text-white"
                />
                <Button type="button" variant="outline" onClick={handleAddTag}>
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="cursor-pointer hover:bg-rose/20"
                    onClick={() => handleRemoveTag(tag)}
                  >
                    {tag} <X size={12} className="ml-1" />
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-text">Media</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 px-4 py-2 rounded-lg bg-midnight-light text-text cursor-pointer hover:bg-midnight-light/80 transition-colors">
                  <Image size={18} />
                  <span>Add Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileSelect(e, 'image')}
                    className="hidden"
                  />
                </label>
                <label className="flex items-center gap-2 px-4 py-2 rounded-lg bg-midnight-light text-text cursor-pointer hover:bg-midnight-light/80 transition-colors">
                  <Video size={18} />
                  <span>Add Video</span>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => handleFileSelect(e, 'video')}
                    className="hidden"
                  />
                </label>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {mediaFiles.map((file, index) => (
                  <div key={index} className="relative group">
                    {file.type.startsWith('video/') ? (
                      <video src={URL.createObjectURL(file)} className="w-32 h-32 object-cover rounded-lg" />
                    ) : (
                      <img src={URL.createObjectURL(file)} alt="" className="w-32 h-32 object-cover rounded-lg" />
                    )}
                    <button
                      onClick={() => handleRemoveMedia(index)}
                      className="absolute -top-2 -right-2 p-1 bg-rose rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-4 pt-4 border-t border-border">
              <Button variant="outline" className="flex-1" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button
                className="flex-1 btn-neon"
                onClick={handleSubmit}
                disabled={isSubmitting || !title.trim() || !body.trim()}
              >
                {isSubmitting ? 'Publishing...' : 'Publish Post'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  );
}
