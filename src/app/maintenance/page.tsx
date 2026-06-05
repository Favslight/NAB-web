import { Construction, Clock, Mail } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function MaintenancePage() {
  return (
    <main className="flex min-h-screen items-center justify-center overflow-x-hidden bg-background p-3 sm:p-4">
      <div className="w-full max-w-md">
        <Card className="glass border-cyan/20">
          <CardContent className="p-4 text-center sm:p-8">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gold/20 sm:h-20 sm:w-20">
              <Construction className="text-gold" size={40} />
            </div>
            
            <h1 className="text-2xl font-bold font-display text-white mb-3">
              Under Maintenance
            </h1>
            
            <p className="text-text mb-6">
              We&apos;re currently performing system upgrades to serve you better. 
              Please check back soon.
            </p>

            <div className="mb-4 flex items-center justify-center gap-2 text-sm text-text/60">
              <Clock size={16} />
              <span>Expected to be back shortly</span>
            </div>

            <div className="border-t border-border pt-6 mt-6">
              <p className="text-text/60 text-sm mb-2">Need urgent assistance?</p>
              <a 
                href="mailto:support@aibuilders.ng" 
                className="inline-flex max-w-full items-center gap-2 text-emerald transition-colors hover:text-emerald/80"
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
