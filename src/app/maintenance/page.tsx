import { Construction, Clock, Mail } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function MaintenancePage() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <Card className="glass border-cyan/20">
          <CardContent className="p-8 text-center">
            <div className="mx-auto w-20 h-20 rounded-full bg-gold/20 flex items-center justify-center mb-6">
              <Construction className="text-gold" size={40} />
            </div>
            
            <h1 className="text-2xl font-bold font-display text-white mb-3">
              Under Maintenance
            </h1>
            
            <p className="text-text mb-6">
              We&apos;re currently performing system upgrades to serve you better. 
              Please check back soon.
            </p>

            <div className="flex items-center justify-center gap-2 text-sm text-text/60 mb-4">
              <Clock size={16} />
              <span>Expected to be back shortly</span>
            </div>

            <div className="border-t border-border pt-6 mt-6">
              <p className="text-text/60 text-sm mb-2">Need urgent assistance?</p>
              <a 
                href="mailto:support@aibuilders.ng" 
                className="inline-flex items-center gap-2 text-emerald hover:text-emerald/80 transition-colors"
              >
                <Mail size={16} />
                <span>support@aibuilders.ng</span>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
