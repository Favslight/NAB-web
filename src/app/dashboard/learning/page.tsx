'use client';

import { useState } from 'react';

import { BookOpen, Play, Check, Lock, Clock, Award, FileText, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

const courses = [
  {
    id: 1,
    title: 'AI Fundamentals for Nigerians',
    description: 'Learn the basics of AI and how it applies to Nigerian industries',
    modules: 4,
    completed: 3,
    duration: '4 weeks',
    level: 'Beginner',
    thumbnail: '/api/placeholder/300/180',
  },
  {
    id: 2,
    title: 'Building AI Products',
    description: 'From ideation to deployment - build your first AI product',
    modules: 6,
    completed: 0,
    duration: '8 weeks',
    level: 'Intermediate',
    thumbnail: '/api/placeholder/300/180',
  },
  {
    id: 3,
    title: 'Machine Learning with Python',
    description: 'Hands-on ML training using Python and popular frameworks',
    modules: 8,
    completed: 0,
    duration: '10 weeks',
    level: 'Advanced',
    thumbnail: '/api/placeholder/300/180',
  },
];

const currentModules = [
  { id: 1, title: 'Introduction to AI', duration: '45 min', completed: true, type: 'video' },
  { id: 2, title: 'AI in Nigerian Context', duration: '30 min', completed: true, type: 'video' },
  { id: 3, title: 'Machine Learning Basics', duration: '60 min', completed: true, type: 'reading' },
  { id: 4, title: 'Practical AI Applications', duration: '90 min', completed: false, type: 'video' },
];

export default function LearningPage() {
  const [activeTab, setActiveTab] = useState('courses');

  return (
    <ProtectedRoute>
      <div className="responsive-page">
        <div>
          <h1 className="text-3xl font-bold font-display text-white mb-2">
            Learning Center
          </h1>
          <p className="text-text">
            Expand your AI knowledge with expert-curated courses
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-midnight-light border border-border">
            <TabsTrigger value="courses" className="data-[state=active]:bg-emerald/20 data-[state=active]:text-emerald">
              My Courses
            </TabsTrigger>
            <TabsTrigger value="modules" className="data-[state=active]:bg-emerald/20 data-[state=active]:text-emerald">
              Current Module
            </TabsTrigger>
            <TabsTrigger value="certificates" className="data-[state=active]:bg-emerald/20 data-[state=active]:text-emerald">
              Certificates
            </TabsTrigger>
          </TabsList>

          <TabsContent value="courses" className="mt-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course, index) => (
                <div
                  key={course.id}
                  
                  
                  
                >
                  <Card className="glass card-hover overflow-hidden">
                    <div className="h-40 bg-midnight-light relative">
                      <div className="absolute inset-0 flex items-center justify-center text-text/30">
                        <BookOpen size={48} />
                      </div>
                      <Badge className="absolute top-3 right-3 bg-midnight/80">
                        {course.level}
                      </Badge>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-bold text-white mb-2">{course.title}</h3>
                      <p className="text-sm text-text mb-4">{course.description}</p>
                      <div className="flex items-center gap-4 text-sm text-text mb-4">
                        <span className="flex items-center gap-1">
                          <FileText size={14} />
                          {course.modules} modules
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={14} />
                          {course.duration}
                        </span>
                      </div>
                      <Progress value={(course.completed / course.modules) * 100} className="mb-2" />
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-text">
                          {course.completed}/{course.modules} completed
                        </span>
                        <Button size="sm" className="btn-neon">
                          {course.completed > 0 ? 'Continue' : 'Start'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="modules" className="mt-6">
            <Card className="glass">
              <CardHeader>
                <CardTitle className="text-white">AI Fundamentals - Module 4</CardTitle>
                <Progress value={75} className="mt-2" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {currentModules.map((module, index) => (
                    <div
                      key={module.id}
                      className={`flex items-center gap-4 p-4 rounded-lg ${
                        module.completed ? 'glass' : 'glass opacity-75'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        module.completed ? 'bg-emerald/20 text-emerald' : 'bg-midnight-light text-text'
                      }`}>
                        {module.completed ? <Check size={20} /> : <Play size={20} />}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-white">{module.title}</div>
                        <div className="text-sm text-text flex items-center gap-2">
                          {module.type === 'video' ? <Video size={14} /> : <FileText size={14} />}
                          {module.duration}
                        </div>
                      </div>
                      <Button
                        variant={module.completed ? 'ghost' : 'outline'}
                        size="sm"
                        className={module.completed ? 'text-emerald' : ''}
                      >
                        {module.completed ? 'Completed' : 'Start'}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="certificates" className="mt-6">
            <div className="text-center py-12">
              <Award className="mx-auto text-gold mb-4" size={64} />
              <h3 className="text-xl font-bold text-white mb-2">No Certificates Yet</h3>
              <p className="text-text mb-6">Complete courses to earn your certificates</p>
              <Button className="btn-neon" onClick={() => setActiveTab('courses')}>
                Browse Courses
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRoute>
  );
}
