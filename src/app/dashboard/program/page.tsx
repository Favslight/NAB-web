'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Check, Award, Calendar, Clock, Users, Lock, BookOpen, Video, FileText, PlayCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import Link from 'next/link';

const curriculum = [
  {
    week: 'Weeks 1-2',
    title: 'Ideation & Problem Discovery',
    topics: ['Market research', 'Problem validation', 'AI opportunity mapping', 'Team formation'],
  },
  {
    week: 'Weeks 3-4',
    title: 'Building Your MVP',
    topics: ['AI model selection', 'Rapid prototyping', 'User testing', 'Iterative development'],
  },
  {
    week: 'Weeks 5-6',
    title: 'Go-to-Market Strategy',
    topics: ['Marketing fundamentals', 'User acquisition', 'Pricing strategy', 'Growth hacking'],
  },
  {
    week: 'Weeks 7-8',
    title: 'Demo Day & Fundraising',
    topics: ['Pitch preparation', 'Investor meetings', 'Term sheets', 'Post-program support'],
  },
];

const benefits = [
  'Weekend classes (no conflict with day job)',
  'Expert mentorship from industry leaders',
  '₦250,000 early bird slots available',
  'Networking with investors',
  'Office space in Lagos/Abuja',
  'Legal and incorporation support',
  'Cloud credits ($5,000+)',
  'Lifetime NAB membership included',
];

const courses = [
  { id: 1, title: 'AI Fundamentals for Founders', duration: '2 hours', type: 'video', locked: true },
  { id: 2, title: 'Market Research Techniques', duration: '1.5 hours', type: 'video', locked: true },
  { id: 3, title: 'Building Your First AI Model', duration: '3 hours', type: 'video', locked: true },
  { id: 4, title: 'Product Roadmap Template', duration: '30 min', type: 'document', locked: true },
  { id: 5, title: 'Investor Pitch Deck Guide', duration: '45 min', type: 'document', locked: true },
  { id: 6, title: 'Go-to-Market Playbook', duration: '1 hour', type: 'video', locked: true },
];

export default function DashboardProgramPage() {
  const router = useRouter();
  const [hasApplied, setHasApplied] = useState(false);
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    state: '',
    experience: '',
    idea: '',
    motivation: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    toast.success('Application submitted successfully!');
    setHasApplied(true);
    setIsSubmitting(false);
  };

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
    else handleSubmit();
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="responsive-page">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">60-Day AI Builders Program</h1>
          <p className="text-text">From idea to funded startup in 60 days</p>
        </div>
      </div>

      {/* Program Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="glass">
          <CardContent className="p-4 flex items-center gap-3">
            <Calendar className="w-5 h-5 text-emerald" />
            <div>
              <div className="text-sm text-text">Duration</div>
              <div className="text-white font-medium">8 Weeks</div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardContent className="p-4 flex items-center gap-3">
            <Clock className="w-5 h-5 text-cyan" />
            <div>
              <div className="text-sm text-text">Schedule</div>
              <div className="text-white font-medium">Weekend Classes</div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardContent className="p-4 flex items-center gap-3">
            <Users className="w-5 h-5 text-gold" />
            <div>
              <div className="text-sm text-text">Cohort Size</div>
              <div className="text-white font-medium">50 Founders</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Application Form or Success State */}
      {!hasApplied ? (
        <Card className="glass">
          <CardHeader>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle className="text-white">Apply for the Program</CardTitle>
              <div className="flex items-center gap-2">
                {[1, 2, 3].map((s) => (
                  <div
                    key={s}
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-medium ${
                      s === step
                        ? 'bg-emerald text-white'
                        : s < step
                        ? 'bg-emerald/20 text-emerald'
                        : 'bg-midnight-light text-text'
                    }`}
                  >
                    {s < step ? <Check className="w-4 h-4" /> : s}
                  </div>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {step === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      className="glass"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                      className="glass"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Enter your phone number"
                      className="glass"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      placeholder="Enter your state"
                      className="glass"
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="experience">AI/Technical Experience</Label>
                  <Textarea
                    id="experience"
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    placeholder="Describe your technical background and AI experience"
                    className="glass min-h-[120px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="idea">Your AI Idea</Label>
                  <Textarea
                    id="idea"
                    name="idea"
                    value={formData.idea}
                    onChange={handleInputChange}
                    placeholder="Describe the AI product or solution you want to build"
                    className="glass min-h-[120px]"
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="motivation">Why do you want to join?</Label>
                  <Textarea
                    id="motivation"
                    name="motivation"
                    value={formData.motivation}
                    onChange={handleInputChange}
                    placeholder="Tell us about your motivation and what you hope to achieve"
                    className="glass min-h-[150px]"
                  />
                </div>
                
                <div className="glass rounded-lg p-4 space-y-3">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <span className="text-text">Program Fee</span>
                    <span className="text-2xl font-bold text-cyan">₦250,000</span>
                  </div>
                  <div className="text-sm text-gold">Early bird pricing (Regular: ₦350,000)</div>
                  <div className="text-xs text-text/60">
                    Payment will be processed after application review
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="grid grid-cols-1 gap-3 pt-4 sm:grid-cols-2">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={step === 1}
                className="w-full border-emerald/50 text-emerald hover:bg-emerald/10"
              >
                Previous
              </Button>
              <Button
                onClick={nextStep}
                disabled={isSubmitting}
                className="btn-neon-cyan w-full"
              >
                {isSubmitting ? (
                  'Submitting...'
                ) : step === 3 ? (
                  <>
                    Submit Application
                    <Check className="ml-2 w-4 h-4" />
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="glass border-emerald/30">
          <CardContent className="p-6">
            <div className="flex min-w-0 items-start gap-3 text-emerald">
              <Check className="w-6 h-6" />
              <div className="min-w-0">
                <div className="font-semibold">Application Submitted</div>
                <div className="text-sm text-text">We&apos;ll review your application and get back to you soon.</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Program Benefits */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-white">What You Get</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald/20 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-emerald" />
                </div>
                <span className="text-text text-sm">{benefit}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Curriculum Preview */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-cyan" />
            Program Curriculum
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {curriculum.map((phase, index) => (
              <div key={index} className="glass rounded-lg p-4">
                <div className="text-cyan text-xs font-medium mb-2">{phase.week}</div>
                <h3 className="text-white font-medium text-sm mb-3">{phase.title}</h3>
                <ul className="space-y-1">
                  {phase.topics.map((topic, i) => (
                    <li key={i} className="text-text text-xs flex items-start gap-1.5">
                      <div className="w-1 h-1 rounded-full bg-emerald mt-1.5 shrink-0" />
                      {topic}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Locked Courses Section */}
      <Card className="glass">
        <CardHeader>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald" />
              Program Courses
            </CardTitle>
            <Badge variant="outline" className="border-gold/50 text-gold">
              <Lock className="w-3 h-3 mr-1" />
              Locked
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map((course) => (
              <div
                key={course.id}
                className="glass rounded-lg p-4 relative overflow-hidden group cursor-not-allowed"
              >
                {/* Lock overlay */}
                <div className="absolute inset-0 bg-midnight/60 backdrop-blur-[1px] flex items-center justify-center z-10">
                  <div className="text-center">
                    <Lock className="w-8 h-8 text-text/50 mx-auto mb-2" />
                    <span className="text-text/60 text-sm">Locked</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald/10 flex items-center justify-center shrink-0">
                    {course.type === 'video' ? (
                      <PlayCircle className="w-5 h-5 text-emerald" />
                    ) : (
                      <FileText className="w-5 h-5 text-emerald" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-medium text-sm mb-1">{course.title}</h3>
                    <div className="flex items-center gap-2 text-text/60 text-xs">
                      <Video className="w-3 h-3" />
                      <span>{course.duration}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 text-center">
            <p className="text-text text-sm mb-4">
              Courses will be unlocked once your application is approved and payment is confirmed.
            </p>
            <Link href="/dashboard/membership">
              <Button variant="outline" className="border-emerald/50 text-emerald hover:bg-emerald/10">
                Go to Membership
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
