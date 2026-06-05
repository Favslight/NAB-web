'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, Search, Edit2, Trash2, LayoutGrid, Check, X, 
  AlertCircle, Star, Eye, EyeOff, Loader2 
} from 'lucide-react';
import { toolsApi } from '@/lib/api';
import { AiTool, PlanTier } from '@/types';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import toast from 'react-hot-toast';
import PlanBadge from '@/components/tools/PlanBadge';

export default function AdminToolsPage() {
  const [tools, setTools] = useState<AiTool[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTool, setCurrentTool] = useState<Partial<AiTool> | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchTools = async () => {
    setLoading(true);
    try {
      const res = await toolsApi.admin.getTools();
      if (res.success) {
        setTools(res.data.items || res.data || []);
      }
    } catch (err) {
      toast.error('Failed to fetch tools');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTools();
  }, []);

  const filteredTools = tools.filter(t => 
    t.name.toLowerCase().includes(search.toLowerCase()) || 
    t.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreateOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTool?.name || !currentTool?.slug || !currentTool?.required_plan) {
      toast.error('Missing required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      let res;
      if (currentTool.id) {
        res = await toolsApi.admin.updateTool(currentTool.id, currentTool);
      } else {
        res = await toolsApi.admin.createTool(currentTool as any);
      }

      if (res.success) {
        toast.success(currentTool.id ? 'Tool updated' : 'Tool created');
        setIsModalOpen(false);
        fetchTools();
      } else {
        toast.error(res.error || 'Action failed');
      }
    } catch (err) {
      toast.error('An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this tool?')) return;
    try {
      const res = await toolsApi.admin.deleteTool(id);
      if (res.success) {
        toast.success('Tool deleted');
        fetchTools();
      }
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  return (
    <ProtectedRoute requireSuperAdmin>
      <div className="responsive-page">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="min-w-0">
            <h1 className="text-3xl font-bold font-display text-white">Manage <span className="text-gradient">AI Tools</span></h1>
            <p className="text-muted-foreground">Configure tools, plans, and accessibility for builders.</p>
          </div>
          <Button onClick={() => { setCurrentTool({ required_plan: 'ai_explorer', active: true, featured: false }); setIsModalOpen(true); }} className="btn-neon w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" /> Add New Tool
          </Button>
        </div>

        <Card className="bg-card/50 border-border backdrop-blur-sm">
          <CardHeader className="pb-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search tools by name or category..." 
                className="pl-9 bg-background/50 border-border"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
            ) : filteredTools.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground">No tools found.</div>
            ) : (
              <div className="responsive-table">
                <table className="w-full min-w-[760px] text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border text-muted-foreground text-sm">
                      <th className="py-4 px-4 font-medium">Tool</th>
                      <th className="py-4 px-4 font-medium">Category</th>
                      <th className="py-4 px-4 font-medium">Required Plan</th>
                      <th className="py-4 px-4 font-medium">Status</th>
                      <th className="py-4 px-4 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredTools.map((tool) => (
                      <tr key={tool.id} className="hover:bg-white/5 transition-colors group">
                        <td className="py-4 px-4">
                          <div className="flex min-w-0 items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center border border-border">
                              <LayoutGrid className="w-5 h-5 text-muted-foreground" />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 font-semibold text-white safe-text">
                                {tool.name}
                                {tool.featured && <Star className="w-3 h-3 text-gold fill-gold" />}
                              </div>
                              <div className="text-xs text-muted-foreground safe-text">/{tool.slug}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <Badge variant="outline" className="bg-muted/50 border-border text-muted-foreground">
                            {tool.category}
                          </Badge>
                        </td>
                        <td className="py-4 px-4">
                          <PlanBadge plan={tool.required_plan} size="sm" />
                        </td>
                        <td className="py-4 px-4">
                          {tool.active ? (
                            <Badge className="bg-emerald/10 text-emerald border-emerald/20">Active</Badge>
                          ) : (
                            <Badge className="bg-muted text-muted-foreground">Inactive</Badge>
                          )}
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="flex justify-end gap-2 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
                            <Button variant="ghost" size="icon" onClick={() => { setCurrentTool(tool); setIsModalOpen(true); }}>
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => handleDelete(tool.id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Create/Edit Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-lg max-h-[calc(100vh-2rem)] overflow-y-auto rounded-xl border border-border bg-card shadow-2xl">
              <div className="flex items-center justify-between gap-3 border-b border-border p-4 sm:p-6">
                <h2 className="text-xl font-bold text-white">{currentTool?.id ? 'Edit' : 'Create'} AI Tool</h2>
                <button onClick={() => setIsModalOpen(false)}><X className="w-5 h-5 text-muted-foreground hover:text-white" /></button>
              </div>
              <form onSubmit={handleCreateOrUpdate} className="p-4 sm:p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Tool Name*</label>
                    <Input value={currentTool?.name || ''} onChange={(e) => setCurrentTool({...currentTool, name: e.target.value})} placeholder="e.g. AI Videos" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Slug*</label>
                    <Input value={currentTool?.slug || ''} onChange={(e) => setCurrentTool({...currentTool, slug: e.target.value})} placeholder="e.g. ai-videos" required disabled={!!currentTool?.id} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <Input value={currentTool?.description || ''} onChange={(e) => setCurrentTool({...currentTool, description: e.target.value})} placeholder="Short description of the tool" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Category</label>
                    <Input value={currentTool?.category || ''} onChange={(e) => setCurrentTool({...currentTool, category: e.target.value})} placeholder="e.g. Video & Film" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Required Plan*</label>
                    <select 
                      className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={currentTool?.required_plan || 'ai_explorer'}
                      onChange={(e) => setCurrentTool({...currentTool, required_plan: e.target.value as any})}
                    >
                      <option value="ai_explorer">AI Explorer</option>
                      <option value="ai_builder">AI Builder</option>
                      <option value="ai_product_founder">AI Product Founder</option>
                    </select>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 py-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={currentTool?.featured || false} onChange={(e) => setCurrentTool({...currentTool, featured: e.target.checked})} />
                    <span className="text-sm">Featured Tool</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={currentTool?.active ?? true} onChange={(e) => setCurrentTool({...currentTool, active: e.target.checked})} />
                    <span className="text-sm">Active & Visible</span>
                  </label>
                </div>
                <div className="pt-4 flex flex-col sm:flex-row gap-3">
                  <Button type="button" variant="ghost" className="flex-1" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                  <Button type="submit" className="flex-1 btn-neon" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    {currentTool?.id ? 'Update Tool' : 'Create Tool'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
