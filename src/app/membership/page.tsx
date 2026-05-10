import Link from "next/link";

import { ArrowRight, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/layout/Navbar";
import { StaggerReveal } from "@/components/ui/stagger-reveal";

const benefits = [
  "Free AI training sessions every weekend",
  "Access to 37 state hubs across Nigeria",
  "Referral rewards - earn ₦5,000 per referral",
  "Community of 2,000+ AI builders",
  "Early access to AI Builders Program",
  "Product showcase featuring",
  "Priority support from NAB team",
  "Members-only Discord server",
  "Exclusive job opportunities",
  "Investor introductions",
];

export default function MembershipPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 md:pb-20 overflow-hidden">
        <div className="section-glow" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <StaggerReveal className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-emerald/10 border border-emerald/20 text-emerald mb-4 sm:mb-6">
              <Sparkles size={14} className="sm:w-4 sm:h-4" />
              <span className="text-xs sm:text-sm font-medium">Join the Movement</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-display text-white mb-4 sm:mb-6">
              Become a NAB Member
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-text px-1">
              Join Nigeria&apos;s premier AI community for ₦30,000 and unlock
              lifetime access to training, community, and opportunities.
            </p>
          </StaggerReveal>
        </div>
      </section>

      {/* Pricing Card */}
      <section className="pb-12 sm:pb-16 md:pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-start">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-display text-white mb-4 sm:mb-6">
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
              <Card className="glass-strong border-2 border-emerald/30 card-hover">
                <CardContent className="p-4 sm:p-6 md:p-8">
                  <div className="text-center mb-6 sm:mb-8">
                    <div className="text-xs sm:text-sm text-text mb-2">Membership Fee</div>
                    <div className="text-4xl sm:text-5xl md:text-6xl font-bold text-emerald mb-2">
                      ₦30,000
                    </div>
                    <div className="text-text text-sm sm:text-base">
                      One-time payment • Lifetime access
                    </div>
                  </div>

                  <Link href="/signup">
                    <Button
                      size="lg"
                      className="w-full btn-neon py-5 sm:py-6 text-base sm:text-lg mb-4 min-h-[44px]"
                    >
                      Join NAB Now
                      <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" size={20} />
                    </Button>
                  </Link>

                  <div className="text-center space-y-2 text-sm text-text/60">
                    <p>non-refundable</p>
                    <p>Secure payment powered by Paystack</p>
                  </div>
                </CardContent>
              </Card>

              <div className="mt-4 sm:mt-6 glass rounded-xl p-4 sm:p-6">
                <h3 className="font-semibold text-white mb-2 text-sm sm:text-base">
                  Referral Bonus
                </h3>
                <p className="text-text text-xs sm:text-sm mb-3 sm:mb-4">
                  Refer friends and earn ₦5,000 for each person who joins. Your
                  referral code is automatically generated when you sign up.
                </p>
                <div className="text-emerald text-sm font-medium">
                  No limit on referral earnings!
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 sm:py-16 md:py-20 bg-midnight-light/30">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-white text-center mb-8 sm:mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4 sm:space-y-6">
            {[
              {
                q: "What is the NAB membership?",
                a: "NAB membership gives you access to Nigeria's largest AI builder community, including free training, state hubs, referral rewards, and exclusive opportunities.",
              },
              {
                q: "Is the membership fee one-time or recurring?",
                a: "The ₦30,000 membership fee is a one-time payment that gives you lifetime access to the community and all member benefits.",
              },
              {
                q: "How do referral rewards work?",
                a: "When someone joins using your referral code, you earn ₦5,000. There's no limit to how many people you can refer.",
              },
              {
                q: "What is the AI Builders Program?",
                a: "It's an intensive 60-day program that takes you from idea to funded startup. Members get early access and discounted application fees.",
              },
              {
                q: "Can I get a refund?",
                a: "Yes, we offer a 7-day money-back guarantee if you're not satisfied with your membership.",
              },
            ].map((faq, index) => (
              <div key={index} className="glass rounded-xl p-4 sm:p-6 card-hover">
                <h3 className="font-semibold text-white mb-2 text-sm sm:text-base">{faq.q}</h3>
                <p className="text-text text-xs sm:text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-12 sm:py-16 md:py-20 overflow-hidden">
        <div className="section-glow-horizontal" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <StaggerReveal className="text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-display text-white mb-4 sm:mb-6">
              Ready to Join the Movement?
            </h2>
            <p className="text-text text-base sm:text-lg mb-6 sm:mb-8">
              Join 2,000+ Nigerian AI builders today and start building the
              future.
            </p>
            <Link href="/signup" className="inline-block">
              <Button size="lg" className="btn-neon px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg min-h-[44px]">
                Become a Member
                <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" size={20} />
              </Button>
            </Link>
          </StaggerReveal>
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
