import Link from 'next/link';

import { ArrowUpRight, Filter, MapPin, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/layout/Navbar';

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
    <main className="min-h-screen bg-midnight">
      <Navbar />
      
      {/* Hero */}
      <section className="pt-32 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            
            
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold font-display text-white mb-4">
              AI Products by Nigerians
            </h1>
            <p className="text-lg text-text">
              Discover innovative AI solutions built by Nigerian builders for Nigeria and the world.
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2 text-text">
              <Filter size={18} />
              <span>Filter by:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-text/60">Industry:</span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  className="px-3 py-1 text-sm rounded-full bg-midnight-light text-text hover:bg-emerald/20 hover:text-emerald transition-colors"
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 ml-4">
              <span className="text-sm text-text/60">State:</span>
              {states.map((state) => (
                <button
                  key={state}
                  className="px-3 py-1 text-sm rounded-full bg-midnight-light text-text hover:bg-cyan/20 hover:text-cyan transition-colors"
                >
                  {state}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product, index) => (
              <div
                key={product.id}
                
                
                
                
              >
                <Card className="glass card-hover overflow-hidden group">
                  <div className="relative h-48 bg-midnight-light">
                    {product.featured && (
                      <Badge className="absolute top-3 left-3 bg-gold text-midnight">
                        Featured
                      </Badge>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center text-text/30">
                      <Building size={48} />
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="outline" className="text-emerald border-emerald/30">
                        {product.category}
                      </Badge>
                      <div className="flex items-center gap-1 text-sm text-text/60">
                        <MapPin size={14} />
                        {product.state}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald transition-colors">
                      {product.title}
                    </h3>
                    <p className="text-text text-sm mb-4">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-text/60">
                        {product.likes} likes
                      </span>
                      <Link href={`/products/${product.id}`}>
                        <Button variant="ghost" size="sm" className="text-emerald hover:text-emerald hover:bg-emerald/10">
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
      <section className="py-20 bg-midnight-light/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold font-display text-white mb-4">
            Built Something Amazing?
          </h2>
          <p className="text-text text-lg mb-8">
            Submit your AI product to the NAB showcase and get discovered by investors and users.
          </p>
          <Link href="/dashboard/products">
            <Button size="lg" className="btn-neon">
              Submit Your Product
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-text text-sm">
          © 2025 AIBUILDERS.NG. All rights reserved.
        </div>
      </footer>
    </main>
  );
}
