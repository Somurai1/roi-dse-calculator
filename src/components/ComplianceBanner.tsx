
import { Shield, CheckCircle } from 'lucide-react'

export function ComplianceBanner() {
  return (
    <div className="bg-primary/5 border-t border-primary/20">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-center gap-3 text-primary">
          <Shield className="h-5 w-5" />
          <div className="text-center">
            <span className="font-medium">
              Meets Irish DSE regs (2007, Ch.5 Pt.2). 
            </span>
            <span className="text-sm">
              Self-assessment with competent-person verification aligns with HSA guidance.
            </span>
          </div>
          <CheckCircle className="h-5 w-5" />
        </div>
      </div>
    </div>
  )
}
