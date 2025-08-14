
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ExternalLink } from 'lucide-react'

interface SourcesModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SourcesModal({ open, onOpenChange }: SourcesModalProps) {
  const sources = [
    {
      title: "Irish DSE Law & Competent Person",
      description: "Health & Safety Authority FAQs and guidance",
      organization: "Health and Safety Authority",
      url: "https://healthservice.hse.ie",
      date: "Accessed 12 Aug 2025",
      details: "Official guidance confirming DSE assessment requirements and competent person oversight under Irish law."
    },
    {
      title: "Irish Absence Benchmarks",
      description: "CSO Labour Force Survey Q1 2024 (absence by sector)",
      organization: "Central Statistics Office (CSO)",
      url: "https://www.cso.ie",
      date: "Published 2024-06",
      details: "Official Irish government statistics on workplace absence rates across different sectors."
    },
    {
      title: "MSD Prevalence & Burden (EU)",
      description: "EU-OSHA facts & figures overview + report PDF",
      organization: "European Agency for Safety and Health at Work",
      url: "https://osha.europa.eu",
      date: "Accessed 12 Aug 2025",
      details: "Comprehensive EU-wide data on musculoskeletal disorders as the most common work-related health problem."
    },
    {
      title: "Salary Benchmarks (IE)",
      description: "Health & Safety Officer compensation ranges",
      organizations: [
        { name: "Morgan McKinley", url: "https://www.morganmckinley.com" },
        { name: "SalaryExpert", url: "https://www.salaryexpert.com" },
        { name: "Indeed", url: "https://www.indeed.com" },
        { name: "Glassdoor", url: "https://www.glassdoor.com" }
      ],
      date: "2025",
      details: "Multiple salary benchmarking sources providing comprehensive view of Irish H&S compensation ranges."
    },
    {
      title: "Internal Case Example",
      description: "ROI analysis from customer implementation",
      organization: "Customer case example (internal)",
      url: "",
      date: "Internal analysis",
      details: "Conservative ROI ~400% based on 800 staff, €70 licence, 60% admin time reduction. Used as 'Expected' scenario seed."
    }
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Data Sources & References</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {sources.map((source, index) => (
            <div key={index} className="border-l-4 border-primary/20 pl-4">
              <h3 className="font-semibold text-lg mb-2">{source.title}</h3>
              <p className="text-muted-foreground mb-3">{source.description}</p>
              
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-medium text-primary">
                  {Array.isArray(source.organizations) 
                    ? source.organizations.map(org => org.name).join(', ')
                    : source.organization
                  }
                </span>
                <span className="text-xs text-muted-foreground">• {source.date}</span>
              </div>
              
              <p className="text-sm text-muted-foreground mb-3">{source.details}</p>
              
              {Array.isArray(source.organizations) ? (
                <div className="flex flex-wrap gap-2">
                  {source.organizations.map((org, orgIndex) => (
                    <a
                      key={orgIndex}
                      href={org.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors"
                    >
                      {org.name}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  ))}
                </div>
              ) : source.url ? (
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors"
                >
                  View source
                  <ExternalLink className="h-3 w-3" />
                </a>
              ) : null}
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <h4 className="font-medium mb-2">Notes</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• All external sources accessed on 12 August 2025</li>
            <li>• Irish market data prioritized for local relevance</li>
            <li>• Conservative estimates used for MSD reduction assumptions</li>
            <li>• Internal case study represents typical customer outcomes</li>
            <li>• Sources updated annually to maintain accuracy</li>
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  )
}
