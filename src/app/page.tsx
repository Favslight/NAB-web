import Link from 'next/link';
import { ArrowRight, Sparkles, Users, BookOpen, MapPin, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/layout/Navbar';

export default function Home() {
  return (
    <main className="min-h-screen bg-midnight">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 pattern-overlay opacity-30" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan/10 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald/10 border border-emerald/20 text-emerald mb-8">
              <Sparkles size={16} />
              <span className="text-sm font-medium">The Future of Nigerian AI</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-display text-white mb-6 leading-tight">
              Nigeria Needs<br />
              <span className="text-gradient">AI Builders.</span><br />
              Become One.
            </h1>
            
            <p className="text-lg md:text-xl text-text max-w-2xl mx-auto mb-10">
              Join the Nigerian AI Builders movement. Build the future with AI. 
              Get trained, connected, and funded.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button size="lg" className="btn-neon px-8 py-6 text-lg">
                  Become a NAB Member
                  <ArrowRight className="ml-2" size={20} />
                </Button>
              </Link>
              <Link href="/program">
                <Button size="lg" variant="outline" className="border-emerald/50 text-emerald hover:bg-emerald/10 px-8 py-6 text-lg">
                  Explore AI Builders Program
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* What is NAB Section */}
      <section className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold font-display text-white mb-6">
                What is <span className="text-emerald">NAB</span>?
              </h2>
              <p className="text-text text-lg mb-6">
                The Nigerian AI Builders (NAB) is a movement of innovators, developers, 
                and entrepreneurs building AI solutions for Nigeria&apos;s biggest challenges.
              </p>
              <p className="text-text text-lg mb-8">
                We believe that Nigerians are uniquely positioned to build AI that understands 
                our context, speaks our languages, and solves our problems.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-emerald">
                  <Users size={20} />
                  <span>2,000+ Members</span>
                </div>
                <div className="flex items-center gap-2 text-cyan">
                  <MapPin size={20} />
                  <span>37 State Hubs</span>
                </div>
              </div>
            </div>
            <div className="glass rounded-2xl p-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-6 rounded-xl bg-midnight-light/50">
                  <div className="text-4xl font-bold text-emerald mb-2">500+</div>
                  <div className="text-text">AI Products Built</div>
                </div>
                <div className="text-center p-6 rounded-xl bg-midnight-light/50">
                  <div className="text-4xl font-bold text-cyan mb-2">50+</div>
                  <div className="text-text">Startups Funded</div>
                </div>
                <div className="text-center p-6 rounded-xl bg-midnight-light/50">
                  <div className="text-4xl font-bold text-gold mb-2">₦50M+</div>
                  <div className="text-text">In Referral Rewards</div>
                </div>
                <div className="text-center p-6 rounded-xl bg-midnight-light/50">
                  <div className="text-4xl font-bold text-emerald mb-2">100+</div>
                  <div className="text-text">Free Training Sessions</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How NAB Works */}
      <section className="py-20 lg:py-32 bg-midnight-light/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-display text-white mb-4">
              How NAB Works
            </h2>
            <p className="text-text text-lg">Three simple steps to join the movement</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Join the Community',
                description: 'Pay ₦25,000 membership fee and get instant access to the NAB community.',
                icon: Users,
              },
              {
                step: '02',
                title: 'Learn & Build',
                description: 'Access free AI trainings, connect with mentors, and start building.',
                icon: BookOpen,
              },
              {
                step: '03',
                title: 'Earn & Scale',
                description: 'Refer friends to earn rewards. Apply for the 60-Day AI Builders Program.',
                icon: Zap,
              },
            ].map((item, index) => (
              <div
                key={index}
                className="glass rounded-2xl p-8 card-hover"
              >
                <div className="text-5xl font-bold text-emerald/20 mb-4">{item.step}</div>
                <item.icon className="w-10 h-10 text-emerald mb-4" />
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-text">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Membership Section */}
      <section className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass rounded-3xl p-8 md:p-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald/5 rounded-full blur-3xl" />
            <div className="relative grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold font-display text-white mb-6">
                  Become a NAB Member
                </h2>
                <p className="text-text text-lg mb-8">
                  Join for ₦25,000 and unlock lifetime access to Nigeria&apos;s premier AI community.
                </p>
                <ul className="space-y-4 mb-8">
                  {[
                    'Free AI training sessions',
                    'Access to state hubs nationwide',
                    'Referral rewards program',
                    'Community of 2,000+ builders',
                    'Early access to the AI Builders Program',
                  ].map((benefit, index) => (
                    <li key={index} className="flex items-center gap-3 text-text">
                      <div className="w-5 h-5 rounded-full bg-emerald/20 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-emerald" />
                      </div>
                      {benefit}
                    </li>
                  ))}
                </ul>
                <Link href="/membership">
                  <Button size="lg" className="btn-neon">
                    Learn More About Membership
                    <ArrowRight className="ml-2" size={20} />
                  </Button>
                </Link>
              </div>
              <div className="relative">
                <div className="glass-strong rounded-2xl p-8 border-2 border-emerald/30">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-emerald mb-2">₦25,000</div>
                    <div className="text-text mb-6">One-time membership fee</div>
                    <Link href="/signup">
                      <Button size="lg" className="w-full btn-neon py-6">
                        Join NAB Now
                      </Button>
                    </Link>
                    <p className="text-sm text-text/60 mt-4">
                      7-day money-back guarantee
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Builders Program */}
      <section className="py-20 lg:py-32 bg-midnight-light/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-display text-white mb-4">
              60-Day AI Builders Program
            </h2>
            <p className="text-text text-lg max-w-2xl mx-auto">
              Our flagship program takes you from idea to funded startup in 60 days.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              { week: 'Weeks 1-2', title: 'Ideation & Validation', desc: 'Find your AI opportunity' },
              { week: 'Weeks 3-4', title: 'Build MVP', desc: 'Create your first AI product' },
              { week: 'Weeks 5-6', title: 'Go-to-Market', desc: 'Launch and get first users' },
              { week: 'Weeks 7-8', title: 'Demo Day', desc: 'Pitch to investors for funding' },
            ].map((phase, index) => (
              <div
                key={index}
                className="glass rounded-xl p-6 card-hover"
              >
                <div className="text-emerald text-sm font-medium mb-2">{phase.week}</div>
                <h3 className="text-lg font-bold text-white mb-2">{phase.title}</h3>
                <p className="text-text text-sm">{phase.desc}</p>
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <Link href="/program">
              <Button size="lg" className="btn-neon-cyan">
                Apply for the Program
                <ArrowRight className="ml-2" size={20} />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* State Hubs */}
      <section className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-display text-white mb-4">
              State Hubs Across Nigeria
            </h2>
            <p className="text-text text-lg">
              Find your local NAB community in your state
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {['Lagos', 'Abuja', 'Kano', 'Jos', 'Ibadan', 'Enugu', 'Port Harcourt', 'Kaduna', 'Sokoto', 'Maiduguri', 'Abeokuta', 'Calabar'].map((state, index) => (
              <div
                key={state}
                className="glass rounded-lg p-4 text-center card-hover cursor-pointer"
              >
                <div className="text-emerald text-sm font-medium">NAB</div>
                <div className="text-white font-semibold">{state}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founder Vision */}
      <section className="py-20 lg:py-32 bg-midnight-light/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold font-display text-white mb-8">
              The Vision
            </h2>
            <blockquote className="text-2xl md:text-3xl text-text font-light italic mb-8">
              &ldquo;In the next 10 years, Nigeria will produce AI builders who will solve problems 
              not just for Africa, but for the entire world. NAB is the movement that will make 
              that happen.&rdquo;
            </blockquote>
            <div className="flex items-center justify-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald to-cyan" />
              <div className="text-left">
                <div className="text-white font-semibold">Founder, NAB</div>
                <div className="text-text text-sm">Nigerian AI Builders Movement</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 lg:py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold font-display text-white mb-6">
              Ready to Build the Future?
            </h2>
            <p className="text-text text-xl mb-10 max-w-2xl mx-auto">
              Join 2,000+ Nigerian AI builders who are creating the future of technology in Africa.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button size="lg" className="btn-neon px-8 py-6 text-lg">
                  Join NAB Now
                  <ArrowRight className="ml-2" size={20} />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="border-emerald/50 text-emerald hover:bg-emerald/10 px-8 py-6 text-lg">
                  Member Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="text-2xl font-bold font-display text-gradient mb-4">
                AIBUILDERS.NG
              </div>
              <p className="text-text text-sm">
                The official platform for the Nigerian AI Builders movement.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-text text-sm">
                <li><Link href="/membership" className="hover:text-emerald">Membership</Link></li>
                <li><Link href="/program" className="hover:text-emerald">AI Builders Program</Link></li>
                <li><Link href="/products" className="hover:text-emerald">Products</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Community</h4>
              <ul className="space-y-2 text-text text-sm">
                <li><Link href="/login" className="hover:text-emerald">Member Login</Link></li>
                <li><Link href="/signup" className="hover:text-emerald">Join NAB</Link></li>
                <li><Link href="/dashboard" className="hover:text-emerald">Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Contact</h4>
              <p className="text-text text-sm">
                hello@aibuilders.ng<br />
                Lagos, Nigeria
              </p>
            </div>
          </div>
          <div className="pt-8 border-t border-border text-center text-text text-sm">
            © 2025 AIBUILDERS.NG. All rights reserved. NAB - Nigerian AI Builders.
          </div>
        </div>
      </footer>
    </main>
  );
}
