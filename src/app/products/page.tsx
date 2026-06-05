import Link from 'next/link';

import { ArrowUpRight, Filter, MapPin, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/layout/Navbar';
import { StaggerReveal } from '@/components/ui/stagger-reveal';

const products = [
  {
    id: 1,
    title: 'MediAI Nigeria',
    description: 'AI-powered healthcare diagnosis for rural communities',
    category: 'Healthcare',
    state: 'Lagos',
    image: '/api/placeholder/400/300',
    featured: true,
    likes: 234,
  },
  {
    id: 2,
    title: 'AgroIntel',
    description: 'Smart farming assistant using computer vision',
    category: 'Agriculture',
    state: 'Kano',
    image: '/api/placeholder/400/300',
    featured: true,
    likes: 189,
  },
  {
    id: 3,
    title: 'EduBot NG',
    description: 'AI tutor for Nigerian students',
    category: 'Education',
    state: 'Abuja',
    image: '/api/placeholder/400/300',
    featured: false,
    likes: 156,
  },
  {
    id: 4,
    title: 'FinSense',
    description: 'Fraud detection for mobile money transactions',
    category: 'Finance',
    state: 'Lagos',
    image: '/api/placeholder/400/300',
    featured: false,
    likes: 142,
  },
  {
    id: 5,
    title: 'TrafficAI',
    description: 'Smart traffic management system',
    category: 'Transportation',
    state: 'Port Harcourt',
    image: '/api/placeholder/400/300',
    featured: true,
    likes: 128,
  },
  {
    id: 6,
    title: 'PowerGrid AI',
    description: 'Predictive maintenance for power infrastructure',
    category: 'Energy',
    state: 'Enugu',
    image: '/api/placeholder/400/300',
    featured: false,
    likes: 98,
  },
];

const categories = ['All', 'Healthcare', 'Agriculture', 'Education', 'Finance', 'Transportation', 'Energy'];
const states = ['All', 'Lagos', 'Abuja', 'Kano', 'Port Harcourt', 'Enugu'];

export default function ProductsPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero */}
      <section className="relative pt-24 sm:pt-28 md:pt-32 pb-8 sm:pb-10 md:pb-12 overflow-hidden">
        <div className="section-glow" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <StaggerReveal className="text-center max-w-3xl mx-auto">
            <p className="label-accent mb-2">Showcase</p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-display text-white mb-3 sm:mb-4">
              AI Products by Nigerians
            </h1>
            <p className="text-base sm:text-lg text-text px-1">
              Discover innovative AI solutions built by Nigerian builders for Nigeria and the world.
            </p>
          </StaggerReveal>
        </div>
      </section>

      {/* Filters */}
      <section className="py-4 sm:py-6 md:py-8 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2 sm:gap-4 items-center">
            <div className="flex items-center gap-2 text-text text-sm sm:text-base w-full sm:w-auto">
              <Filter size={16} className="sm:w-[18px] sm:h-[18px]" />
              <span>Filter by:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="text-xs sm:text-sm text-text/60">Industry:</span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  className="px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm rounded-full bg-midnight-light text-text hover:bg-emerald/20 hover:text-emerald transition-colors min-h-[32px] sm:min-h-0"
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 mt-2 sm:mt-0 sm:ml-4">
              <span className="text-xs sm:text-sm text-text/60">State:</span>
              {states.map((state) => (
                <button
                  key={state}
                  className="px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm rounded-full bg-midnight-light text-text hover:bg-cyan/20 hover:text-cyan transition-colors min-h-[32px] sm:min-h-0"
                >
                  {state}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-10 sm:py-14 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {products.map((product, index) => (
              <div
                key={product.id}
                
                
                
                
              >
                <Card className="glass card-hover overflow-hidden group">
                  <div className="relative h-40 sm:h-48 bg-midnight-light">
                    {product.featured && (
                      <Badge className="absolute top-3 left-3 bg-gold text-midnight">
                        Featured
                      </Badge>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center text-text/30">
                      <Building size={48} />
                    </div>
                  </div>
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-wrap items-center gap-2 mb-2 sm:mb-3">
                      <Badge variant="outline" className="text-emerald border-emerald/30 text-xs">
                        {product.category}
                      </Badge>
                      <div className="flex items-center gap-1 text-xs sm:text-sm text-text/60">
                        <MapPin size={12} className="sm:w-3.5 sm:h-3.5" />
                        {product.state}
                      </div>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-2 group-hover:text-emerald transition-colors">
                      {product.title}
                    </h3>
                    <p className="text-text text-xs sm:text-sm mb-3 sm:mb-4">
                      {product.description}
                    </p>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <span className="text-sm text-text/60">
                        {product.likes} likes
                      </span>
                      <Link href={`/products/${product.id}`} className="w-full sm:w-auto">
                        <Button variant="ghost" size="sm" className="w-full text-emerald hover:text-emerald hover:bg-emerald/10 sm:w-auto">
                          View Project
                          <ArrowUpRight size={16} className="ml-1" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Submit CTA */}
      <section className="py-12 sm:py-16 md:py-20 bg-midnight-light/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-white mb-3 sm:mb-4">
            Built Something Amazing?
          </h2>
          <p className="text-text text-base sm:text-lg mb-6 sm:mb-8">
            Submit your AI product to the NAB showcase and get discovered by investors and users.
          </p>
          <Link href="/dashboard/products">
            <Button size="lg" className="btn-neon min-h-[44px] w-full px-6 py-5 text-sm sm:w-auto sm:px-8 sm:py-6 sm:text-base">
              Submit Your Product
            </Button>
          </Link>
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
