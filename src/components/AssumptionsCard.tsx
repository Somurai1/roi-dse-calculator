
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Info, ExternalLink } from 'lucide-react'

export function AssumptionsCard() {
  const assumptions = [
    {
      title: "Irish DSE Law",
      description: "Safety, Health and Welfare at Work (General Application) Regs 2007, Ch. 5 Part 2",
      source: "Health & Safety Authority",
      url: "https://healthservice.hse.ie",
      date: "Accessed 12 Aug 2025",
      details: "HSA guidance confirms requirement for assessments and competent person oversight."
    },
    {
      title: "Absence Rates (IE)",
      description: "CSO Labour Force Survey Q1 2024 sector absence examples",
      source: "CSO",
      url: "https://www.cso.ie",
      date: "Published 2024-06",
      details: "Typical office-adjacent ranges 4-8% absence rates."
    },
    {
      title: "MSD Burden (EU)",
      description: "MSDs are the most common work-related health problem",
      source: "EU-OSHA",
      url: "https://osha.europa.eu",
      date: "Accessed 12 Aug 2025",
      details: "Significant cost via absenteeism/presenteeism across EU member states."
    },
    {
      title: "Admin Salary Benchmarks (IE)",
      description: "Health & Safety Officer total comp ranges",
      source: "Multiple Sources",
      url: "",
      date: "2025",
      details: "Morgan McKinley: €45-60k, SalaryExpert: €68k avg, Indeed: €53.6k avg"
    },
    {
      title: "Internal Case Study",
      description: "800 staff, €70 licence, 60% admin time reduction",
      source: "Customer case example",
      url: "",
      date: "Internal",
      details: "Worked ROI ~400% (used as 'Expected' scenario seed)"
    }
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="h-5 w-5" />
          Assumptions & Sources
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {assumptions.map((assumption, index) => (
            <div key={index} className="border-l-4 border-primary/20 pl-4">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-sm">{assumption.title}</h4>
                <Badge variant="outline" className="text-xs">
                  {assumption.date}
                </Badge>
              </div>
              
              <p className="text-sm text-muted-foreground mb-2">
                {assumption.description}
              </p>
              
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-medium text-primary">
                  Source: {assumption.source}
                </span>
                {assumption.url && (
                  <a
                    href={assumption.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary/80 transition-colors"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
              
              <Tooltip>
                <TooltipTrigger>
                  <div className="text-xs text-muted-foreground cursor-help">
                    {assumption.details}
                  </div>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="text-sm">{assumption.details}</p>
                  {assumption.url && (
                    <p className="text-xs mt-1">
                      <a 
                        href={assumption.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        View source
                      </a>
                    </p>
                  )}
                </TooltipContent>
              </Tooltip>
            </div>
          ))}
        </div>

        {/* Key Defaults Summary */}
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <h4 className="font-medium mb-3">Key Default Values</h4>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-muted-foreground">Headcount:</span>
              <span className="ml-2 font-medium">800</span>
            </div>
            <div>
              <span className="text-muted-foreground">DSE Users:</span>
              <span className="ml-2 font-medium">50%</span>
            </div>
            <div>
              <span className="text-muted-foreground">Admin Salary:</span>
              <span className="ml-2 font-medium">€60k</span>
            </div>
            <div>
              <span className="text-muted-foreground">Licence:</span>
              <span className="ml-2 font-medium">€70/user/year</span>
            </div>
            <div>
              <span className="text-muted-foreground">Absence Rate:</span>
              <span className="ml-2 font-medium">5%</span>
            </div>
            <div>
              <span className="text-muted-foreground">MSD Prevalence:</span>
              <span className="ml-2 font-medium">25%</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            These defaults are based on Irish market data and internal case studies. 
            Adjust values to match your specific situation.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
