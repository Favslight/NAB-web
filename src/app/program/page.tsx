import { Calendar, Clock, Users, Award, Check } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import Navbar from '@/components/layout/Navbar';
import { StaggerReveal } from '@/components/ui/stagger-reveal';
import { ApplyButton } from '@/components/apply-button';

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

export default function ProgramPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero */}
      <section className="relative pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 md:pb-20 overflow-hidden">
        <div className="section-glow" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <StaggerReveal className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-cyan/10 border border-cyan/20 text-cyan mb-4 sm:mb-6">
              <Award size={14} className="sm:w-4 sm:h-4" />
              <span className="text-xs sm:text-sm font-medium">Flagship Program</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-display text-white mb-4 sm:mb-6">
              60-Day AI Builders Program
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-text mb-6 sm:mb-8 px-1">
              From idea to funded startup in 60 days. 
              Join Nigeria&apos;s most intense AI founder program.
            </p>
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-6 sm:mb-8">
              <div className="flex items-center gap-2 text-text">
                <Calendar size={18} className="text-emerald" />
                <span>8 Weeks</span>
              </div>
              <div className="flex items-center gap-2 text-text">
                <Clock size={18} className="text-cyan" />
                <span>Weekend Classes</span>
              </div>
              <div className="flex items-center gap-2 text-text">
                <Users size={18} className="text-gold" />
                <span>50 Founders per Cohort</span>
              </div>
            </div>
            <ApplyButton 
              size="lg" 
              className="btn-neon-cyan w-full sm:w-auto px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg min-h-[44px]"
            >
              Apply Now - ₦250,000
            </ApplyButton>
          </StaggerReveal>
        </div>
      </section>

      {/* Curriculum */}
      <section className="relative py-12 sm:py-16 md:py-20 bg-midnight-light/30 overflow-hidden">
        <div className="section-glow-horizontal" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <StaggerReveal className="text-center mb-10 sm:mb-16">
            <p className="label-accent mb-2">Curriculum</p>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-white mb-3 sm:mb-4">
              Program Curriculum
            </h2>
            <p className="text-text text-sm sm:text-base">A proven roadmap from idea to funding</p>
          </StaggerReveal>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {curriculum.map((phase, index) => (
              <div
                key={index}
                
                
                
                
                className="glass rounded-xl p-4 sm:p-6 card-hover"
              >
                <div className="text-cyan text-xs sm:text-sm font-medium mb-2">{phase.week}</div>
                <h3 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4">{phase.title}</h3>
                <ul className="space-y-1.5 sm:space-y-2">
                  {phase.topics.map((topic, i) => (
                    <li key={i} className="text-text text-sm flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald mt-2 shrink-0" />
                      {topic}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold font-display text-white mb-4 sm:mb-6">
                What You Get
              </h2>
              <ul className="space-y-3 sm:space-y-4">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-emerald/20 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3 sm:w-4 sm:h-4 text-emerald" />
                    </div>
                    <span className="text-text text-sm sm:text-base">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <Card className="glass-strong border-2 border-cyan/30">
                <CardContent className="p-4 sm:p-6 md:p-8">
                  <div className="text-center mb-6 sm:mb-8">
                    <div className="text-xs sm:text-sm text-text mb-2">Program Fee</div>
                    <div className="text-4xl sm:text-5xl font-bold text-cyan mb-2">₦250,000</div>
                    <div className="text-text">Early bird pricing</div>
                    <div className="text-gold text-sm mt-2">Regular price: ₦350,000</div>
                  </div>
                  
                  <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                    <div className="glass rounded-lg p-3 sm:p-4">
                      <div className="text-sm text-text mb-1">Next Cohort</div>
                      <div className="text-white font-semibold">July 2026</div>
                    </div>
                    <div className="glass rounded-lg p-4">
                      <div className="text-sm text-text mb-1">Application Deadline</div>
                      <div className="text-white font-semibold">May 15 - June 25</div>
                    </div>
                  </div>
                  
                  <ApplyButton 
                    size="lg" 
                    className="w-full btn-neon-cyan py-5 sm:py-6 min-h-[44px]"
                  >
                    Apply Now
                  </ApplyButton>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 sm:py-12 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-text text-xs sm:text-sm">
          © 2026 AIBUILDERS.NG. All rights reserved.
        </div>
      </footer>
    </main>
  );
}
