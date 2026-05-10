import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  Users,
  BookOpen,
  MapPin,
  Zap,
  Cpu,
  Brain,
  Network,
  CircuitBoard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { StaggerReveal } from "@/components/ui/stagger-reveal";
import { JoinButton } from "@/components/join-button";

export default function Home() {
  return (
    <main className="min-h-screen w-full max-w-full bg-background overflow-x-hidden relative">
      <Navbar />

      {/* Hero Section */}
      <ScrollReveal
        data-section="hero"
        variant="up"
        animateOnMount
        className="relative w-full pt-24 sm:pt-28 md:pt-32 pb-16 sm:pb-20 lg:pt-44 lg:pb-32 overflow-hidden"
        y={36}
      >
        <div className="absolute inset-0 pattern-overlay opacity-30" />
        
        {/* AI-themed glow effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald/5 rounded-full blur-3xl" />
        
        {/* Circuit-like decorative lines */}
        <svg className="absolute top-20 left-10 w-32 h-32 text-emerald/20" viewBox="0 0 100 100">
          <path d="M10,50 L40,50 L40,20 L70,20" fill="none" stroke="currentColor" strokeWidth="1" />
          <circle cx="10" cy="50" r="3" fill="currentColor" />
          <circle cx="70" cy="20" r="3" fill="currentColor" />
        </svg>
        <svg className="absolute bottom-20 right-10 w-40 h-40 text-cyan/20" viewBox="0 0 100 100">
          <path d="M90,50 L60,50 L60,80 L30,80" fill="none" stroke="currentColor" strokeWidth="1" />
          <circle cx="90" cy="50" r="3" fill="currentColor" />
          <circle cx="30" cy="80" r="3" fill="currentColor" />
        </svg>

        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <StaggerReveal className="text-center w-full" amount={0.15}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-emerald/10 border border-emerald/20 text-emerald mb-6 sm:mb-8 backdrop-blur-sm relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              <Brain size={14} className="sm:w-4 sm:h-4 animate-pulse" />
              <span className="text-xs sm:text-sm font-medium">
                The Future of Nigerian AI
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold font-display text-white mb-4 sm:mb-6 leading-tight px-1">
              <span className="relative">
                Nigeria Needs
                <CircuitBoard className="absolute -right-8 -top-4 w-6 h-6 text-emerald/40 hidden lg:block" />
              </span>
              <br />
              <span className="text-gradient relative inline-block">
                AI Builders.
                <Network className="absolute -left-10 top-1/2 -translate-y-1/2 w-6 h-6 text-cyan/40 hidden lg:block" />
              </span>
              <br />
              Become One.
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-text max-w-2xl mx-auto mb-8 sm:mb-10 px-1">
              Join the Nigerian AI Builders movement. Build the future with AI.
              Get trained, connected, and funded.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-2">
              <Link href="/signup" className="w-full sm:w-auto">
                <Button size="lg" className="btn-neon w-full sm:w-auto px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg min-h-[44px]">
                  Become a NAB Member
                  <ArrowRight className="ml-2" size={20} />
                </Button>
              </Link>
              <Link href="/program" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-emerald/50 text-emerald hover:bg-emerald/10 px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg min-h-[44px]"
                >
                  Explore AI Builders Program
                </Button>
              </Link>
            </div>
          </StaggerReveal>
        </div>
      </ScrollReveal>

      {/* What is NAB Section */}
      <ScrollReveal
        data-section="what-is-nab"
        variant="right"
        className="w-full py-12 sm:py-16 md:py-20 lg:py-32 relative"
        delay={0.06}
      >
        {/* AI nodes decoration */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-emerald/10 to-transparent rounded-full blur-2xl" />
        
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Cpu className="w-5 h-5 text-emerald" />
                <span className="text-emerald text-sm font-medium tracking-wider uppercase">Neural Network</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-display text-white mb-4 sm:mb-6">
                What is <span className="text-emerald">NAB</span>?
              </h2>
              <p className="text-text text-base sm:text-lg mb-4 sm:mb-6">
                The Nigerian AI Builders (NAB) is a movement of innovators,
                developers, and entrepreneurs building AI solutions for
                Nigeria&apos;s biggest challenges.
              </p>
              <p className="text-text text-base sm:text-lg mb-6 sm:mb-8">
                We believe that Nigerians are uniquely positioned to build AI
                that understands our context, speaks our languages, and solves
                our problems.
              </p>
              <div className="flex flex-wrap gap-3 sm:gap-4">
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
            <div className="glass rounded-2xl p-4 sm:p-6 lg:p-8 relative overflow-hidden">
              {/* AI stats decoration */}
              <div className="absolute -top-10 -right-10 w-20 h-20 bg-emerald/10 rounded-full blur-xl" />
              <div className="absolute -bottom-10 -left-10 w-20 h-20 bg-cyan/10 rounded-full blur-xl" />
              
              <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
                <div className="text-center p-3 sm:p-4 lg:p-6 rounded-lg sm:rounded-xl bg-midnight-light/50 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <Brain className="w-5 h-5 text-emerald/50 mx-auto mb-2" />
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-emerald mb-1 sm:mb-2 relative z-10">500+</div>
                  <div className="text-text text-xs sm:text-sm relative z-10">AI Products Built</div>
                </div>
                <div className="text-center p-3 sm:p-4 lg:p-6 rounded-lg sm:rounded-xl bg-midnight-light/50 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <Network className="w-5 h-5 text-cyan/50 mx-auto mb-2" />
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-cyan mb-1 sm:mb-2 relative z-10">50+</div>
                  <div className="text-text text-xs sm:text-sm relative z-10">Startups Funded</div>
                </div>
                <div className="text-center p-3 sm:p-4 lg:p-6 rounded-lg sm:rounded-xl bg-midnight-light/50 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-gold/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <Zap className="w-5 h-5 text-gold/50 mx-auto mb-2" />
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gold mb-1 sm:mb-2 relative z-10">₦50M+</div>
                  <div className="text-text text-xs sm:text-sm relative z-10">In Referral Rewards</div>
                </div>
                <div className="text-center p-3 sm:p-4 lg:p-6 rounded-lg sm:rounded-xl bg-midnight-light/50 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <BookOpen className="w-5 h-5 text-emerald/50 mx-auto mb-2" />
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-emerald mb-1 sm:mb-2 relative z-10">100+</div>
                  <div className="text-text text-xs sm:text-sm relative z-10">Free Training Sessions</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* How NAB Works */}
      <ScrollReveal
        data-section="how-it-works"
        variant="left"
        className="relative w-full py-12 sm:py-16 md:py-20 lg:py-32 bg-midnight-light/30 overflow-hidden"
        delay={0.05}
      >
        <div className="section-glow-horizontal" />
        
        {/* Neural connection lines decoration */}
        <svg className="absolute top-10 left-1/4 w-64 h-16 text-cyan/10 hidden lg:block" viewBox="0 0 200 50">
          <path d="M0,25 Q50,5 100,25 T200,25" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4,4">
            <animate attributeName="stroke-dashoffset" from="0" to="8" dur="1s" repeatCount="indefinite" />
          </path>
          <circle cx="0" cy="25" r="4" fill="currentColor" className="animate-pulse" />
          <circle cx="100" cy="25" r="4" fill="currentColor" className="animate-pulse" style={{ animationDelay: '0.5s' }} />
          <circle cx="200" cy="25" r="4" fill="currentColor" className="animate-pulse" style={{ animationDelay: '1s' }} />
        </svg>
        <svg className="absolute bottom-10 right-1/4 w-64 h-16 text-emerald/10 hidden lg:block" viewBox="0 0 200 50">
          <path d="M200,25 Q150,45 100,25 T0,25" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4,4">
            <animate attributeName="stroke-dashoffset" from="0" to="8" dur="1s" repeatCount="indefinite" />
          </path>
          <circle cx="200" cy="25" r="4" fill="currentColor" className="animate-pulse" />
          <circle cx="100" cy="25" r="4" fill="currentColor" className="animate-pulse" style={{ animationDelay: '0.5s' }} />
          <circle cx="0" cy="25" r="4" fill="currentColor" className="animate-pulse" style={{ animationDelay: '1s' }} />
        </svg>
        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <StaggerReveal className="text-center mb-10 sm:mb-16 w-full">
            <p className="label-accent mb-2">How it works</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-display text-white mb-3 sm:mb-4">
              How NAB Works
            </h2>
            <p className="text-text text-base sm:text-lg">
              Three simple steps to join the movement
            </p>
          </StaggerReveal>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {[
              {
                step: "01",
                title: "Join the Community",
                description:
                  "Pay ₦30,000 membership fee and get instant access to the NAB community.",
                icon: Users,
              },
              {
                step: "02",
                title: "Learn & Build",
                description:
                  "Access free AI trainings, connect with mentors, and start building.",
                icon: BookOpen,
              },
              {
                step: "03",
                title: "Earn & Scale",
                description:
                  "Refer friends to earn rewards. Apply for the 60-Day AI Builders Program.",
                icon: Zap,
              },
            ].map((item, index) => (
              <div key={index} className="glass rounded-2xl p-4 sm:p-6 md:p-8 card-hover relative overflow-hidden group">
                {/* Connection node effect */}
                <div className="absolute top-4 right-4 w-2 h-2 bg-emerald/50 rounded-full animate-pulse" style={{ animationDelay: `${index * 0.3}s` }} />
                <div className="absolute bottom-4 left-4 w-1.5 h-1.5 bg-cyan/50 rounded-full animate-pulse" style={{ animationDelay: `${index * 0.3 + 0.15}s` }} />
                
                <div className="text-4xl sm:text-5xl font-bold text-emerald/20 mb-3 sm:mb-4">{item.step}</div>
                <div className="relative">
                  <item.icon className="w-8 h-8 sm:w-10 sm:h-10 text-emerald mb-3 sm:mb-4 relative z-10" />
                  <div className="absolute top-0 left-0 w-8 h-8 sm:w-10 sm:h-10 bg-emerald/20 blur-xl rounded-full" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">{item.title}</h3>
                <p className="text-text text-sm sm:text-base">{item.description}</p>
                
                {/* Hover glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-emerald/5 via-cyan/5 to-emerald/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            ))}
          </div>
        </div>
      </ScrollReveal>

      {/* Membership Section */}
      <ScrollReveal
        data-section="membership"
        variant="scale"
        className="py-12 sm:py-16 md:py-20 lg:py-32 w-full"
        delay={0.05}
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 lg:p-12 xl:p-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald/5 rounded-full blur-3xl" />
            <div className="relative grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-display text-white mb-4 sm:mb-6">
                  Become a NAB Member
                </h2>
                <p className="text-text text-base sm:text-lg mb-6 sm:mb-8">
                  Join for ₦30,000 and unlock lifetime access to Nigeria&apos;s
                  premier AI community.
                </p>
                <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                  {[
                    "Free AI training sessions",
                    "Access to state hubs nationwide",
                    "Referral rewards program",
                    "Community of 2,000+ builders",
                    "Early access to the AI Builders Program",
                  ].map((benefit, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-3 text-text text-sm sm:text-base"
                    >
                      <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-emerald/20 flex items-center justify-center shrink-0">
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald" />
                      </div>
                      {benefit}
                    </li>
                  ))}
                </ul>
                <Link href="/membership" className="inline-block">
                  <Button size="lg" className="btn-neon text-sm sm:text-base px-4 sm:px-6 py-5 min-h-[44px]">
                    Learn More About Membership
                    <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" size={20} />
                  </Button>
                </Link>
              </div>
              <div className="relative">
                <div className="glass-strong rounded-2xl p-4 sm:p-6 md:p-8 border-2 border-emerald/30">
                  <div className="text-center">
                    <div className="text-4xl sm:text-5xl font-bold text-emerald mb-2">
                      ₦30,000
                    </div>
                    <div className="text-text text-sm sm:text-base mb-4 sm:mb-6">
                      One-time membership fee
                    </div>
                    <JoinButton 
                      size="lg" 
                      className="w-full btn-neon py-5 sm:py-6 min-h-[44px]"
                    >
                      Join NAB Now
                    </JoinButton>
                    <p className="text-sm text-text/60 mt-4">
                      non-refundable
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* AI Builders Program */}
      <ScrollReveal
        data-section="program"
        variant="down"
        className="relative w-full py-12 sm:py-16 md:py-20 lg:py-32 bg-midnight-light/30 overflow-hidden"
        delay={0.05}
      >
        <div className="section-glow-right" />
        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <StaggerReveal className="text-center mb-10 sm:mb-16 w-full">
            <p className="label-accent mb-2">Program</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-display text-white mb-3 sm:mb-4">
              60-Day AI Builders Program
            </h2>
            <p className="text-text text-base sm:text-lg max-w-2xl mx-auto">
              Our flagship program takes you from idea to funded startup in 60
              days.
            </p>
          </StaggerReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
            {[
              {
                week: "Weeks 1-2",
                title: "Ideation & Validation",
                desc: "Find your AI opportunity",
              },
              {
                week: "Weeks 3-4",
                title: "Build MVP",
                desc: "Create your first AI product",
              },
              {
                week: "Weeks 5-6",
                title: "Go-to-Market",
                desc: "Launch and get first users",
              },
              {
                week: "Weeks 7-8",
                title: "Demo Day",
                desc: "Pitch to investors for funding",
              },
            ].map((phase, index) => (
              <div key={index} className="glass rounded-xl p-4 sm:p-6 card-hover relative overflow-hidden group">
                {/* AI node indicators */}
                <div className="absolute top-2 right-2 flex gap-1">
                  <div className="w-1.5 h-1.5 bg-emerald/40 rounded-full animate-pulse" style={{ animationDelay: `${index * 0.2}s` }} />
                  <div className="w-1 h-1 bg-cyan/40 rounded-full animate-pulse" style={{ animationDelay: `${index * 0.2 + 0.1}s` }} />
                </div>
                
                {/* Progress connector line */}
                {index < 3 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-px bg-gradient-to-r from-emerald/30 to-cyan/30" />
                )}
                
                <div className="text-emerald text-xs sm:text-sm font-medium mb-2">{phase.week}</div>
                <h3 className="text-base sm:text-lg font-bold text-white mb-2">{phase.title}</h3>
                <p className="text-text text-xs sm:text-sm">{phase.desc}</p>
                
                {/* Hover glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald/5 to-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            ))}
          </div>

          <StaggerReveal className="text-center">
            <Link href="/program" className="inline-block">
              <Button size="lg" className="btn-neon-cyan px-6 sm:px-8 py-5 sm:py-6 min-h-[44px] text-sm sm:text-base">
                Apply for the Program
                <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" size={20} />
              </Button>
            </Link>
          </StaggerReveal>
        </div>
      </ScrollReveal>

      {/* State Hubs */}
      <ScrollReveal
        data-section="state-hubs"
        variant="left"
        className="py-12 sm:py-16 md:py-20 lg:py-32 w-full"
        delay={0.05}
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <StaggerReveal className="text-center mb-10 sm:mb-16 w-full">
            <p className="label-accent mb-2">Community</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-display text-white mb-3 sm:mb-4">
              State Hubs Across Nigeria
            </h2>
            <p className="text-text text-base sm:text-lg">
              Find your local NAB community in your state
            </p>
          </StaggerReveal>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3 md:gap-4">
            {[
              "Lagos",
              "Abuja",
              "Kano",
              "Jos",
              "Ibadan",
              "Enugu",
              "Port Harcourt",
              "Kaduna",
              "Sokoto",
              "Maiduguri",
              "Abeokuta",
              "Calabar",
            ].map((state) => (
              <div
                key={state}
                className="glass rounded-lg p-3 sm:p-4 text-center card-hover cursor-pointer min-h-[60px] flex flex-col justify-center relative overflow-hidden group"
              >
                {/* AI node effect */}
                <div className="absolute top-2 right-2 w-1 h-1 bg-emerald/40 rounded-full animate-pulse" />
                
                <div className="text-emerald text-xs font-medium">NAB</div>
                <div className="text-white font-semibold text-sm sm:text-base truncate" title={state}>{state}</div>
                
                {/* Hover glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            ))}
          </div>
        </div>
      </ScrollReveal>

      {/* Vision Section - Enhanced with AI feel */}
      <ScrollReveal
        data-section="vision"
        variant="fade"
        className="relative w-full py-12 sm:py-16 md:py-20 lg:py-32 bg-midnight-light/30 overflow-hidden"
        amount={0.15}
      >
        <div className="section-glow-horizontal" />
        
        {/* Neural decoration */}
        <div className="absolute top-10 left-10 w-40 h-40 border border-emerald/10 rounded-full hidden lg:block" />
        <div className="absolute bottom-10 right-10 w-60 h-60 border border-cyan/10 rounded-full hidden lg:block" />
        <div className="absolute top-1/2 left-1/4 w-2 h-2 bg-emerald/50 rounded-full animate-pulse hidden lg:block" />
        <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-cyan/50 rounded-full animate-pulse hidden lg:block" style={{ animationDelay: '0.5s' }} />
        
        <div className="relative w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <StaggerReveal className="text-center w-full">
            <p className="label-accent mb-2">Vision</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-display text-white mb-6 sm:mb-8">
              The Vision
            </h2>
            <blockquote className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-text font-light italic mb-6 sm:mb-8 px-2 relative">
              <Brain className="absolute -left-4 -top-4 w-8 h-8 text-emerald/20 hidden lg:block" />
              <Network className="absolute -right-4 -bottom-4 w-8 h-8 text-cyan/20 hidden lg:block" />
              &ldquo;In the next 10 years, Nigeria will produce AI builders who
              will solve problems not just for Africa, but for the entire world.
              NAB is the movement that will make that happen.&rdquo;
            </blockquote>
            <div className="flex items-center justify-center gap-3 sm:gap-4 flex-wrap">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-emerald to-cyan shrink-0" />
              <div className="text-left">
                <div className="text-white font-semibold text-sm sm:text-base">Founder, NAB</div>
                <div className="text-text text-xs sm:text-sm">
                  Nigerian AI Builders Movement
                </div>
              </div>
            </div>
          </StaggerReveal>
        </div>
      </ScrollReveal>

      {/* Final CTA */}
      <ScrollReveal
        data-section="cta"
        variant="up"
        className="relative w-full py-12 sm:py-16 md:py-20 lg:py-32 overflow-hidden"
        delay={0.08}
      >
        <div className="section-glow" />
        <div className="relative w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <StaggerReveal className="text-center w-full">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold font-display text-white mb-4 sm:mb-6">
              Ready to Build the Future?
            </h2>
            <p className="text-text text-base sm:text-lg md:text-xl mb-8 sm:mb-10 max-w-2xl mx-auto">
              Join 2,000+ Nigerian AI builders who are creating the future of
              technology in Africa.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Link href="/signup" className="w-full sm:w-auto">
                <Button size="lg" className="btn-neon w-full sm:w-auto px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg min-h-[44px]">
                  Join NAB Now
                  <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" size={20} />
                </Button>
              </Link>
              <Link href="/login" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-emerald/50 text-emerald hover:bg-emerald/10 px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg min-h-[44px]"
                >
                  Member Login
                </Button>
              </Link>
            </div>
          </StaggerReveal>
        </div>
      </ScrollReveal>

      {/* Footer */}
      <footer className="py-8 sm:py-12 border-t border-border w-full relative">
        {/* Neural net footer decoration */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald/30 to-transparent" />
        
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
            <div>
              <div className="flex items-center gap-2 text-xl sm:text-2xl font-bold font-display text-gradient mb-3 sm:mb-4">
                <CircuitBoard className="w-6 h-6" />
                AIBUILDERS.NG
              </div>
              <p className="text-text text-xs sm:text-sm">
                The official platform for the Nigerian AI Builders movement.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Platform</h4>
              <ul className="space-y-1.5 sm:space-y-2 text-text text-xs sm:text-sm">
                <li>
                  <Link href="/membership" className="hover:text-emerald">
                    Membership
                  </Link>
                </li>
                <li>
                  <Link href="/program" className="hover:text-emerald">
                    AI Builders Program
                  </Link>
                </li>
                <li>
                  <Link href="/products" className="hover:text-emerald">
                    Products
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Community</h4>
              <ul className="space-y-1.5 sm:space-y-2 text-text text-xs sm:text-sm">
                <li>
                  <Link href="/login" className="hover:text-emerald">
                    Member Login
                  </Link>
                </li>
                <li>
                  <Link href="/signup" className="hover:text-emerald">
                    Join NAB
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="hover:text-emerald">
                    Dashboard
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Contact</h4>
              <p className="text-text text-xs sm:text-sm">
                hello@aibuilders.ng
                <br />
                Lagos, Nigeria
              </p>
            </div>
          </div>
          <div className="pt-6 sm:pt-8 border-t border-border text-center text-text text-xs sm:text-sm px-2">
            © 2026 AIBUILDERS.NG. All rights reserved. NAB - Nigerian AI
            Builders.
          </div>
        </div>
      </footer>
    </main>
  );
}
