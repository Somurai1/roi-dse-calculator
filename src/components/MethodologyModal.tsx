import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'

export const MethodologyModal: React.FC = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="text-sm">
          📊 View Methodology & Sources
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">ROI Calculator Methodology & Sources</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Core Formulas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🧮 Core Calculation Formulas
                <Badge variant="secondary">v1.0</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold text-primary">Admin Time Savings</h4>
                  <code className="block p-2 bg-muted rounded text-sm">
                    Savings = (Admin Time Now - Admin Time With Software) × Admin Salary × DSE Users
                  </code>
                  <p className="text-sm text-muted-foreground">
                    Based on self-assessment automation reducing manual processing time
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-semibold text-primary">MSD Absence Reduction</h4>
                  <code className="block p-2 bg-muted rounded text-sm">
                    Savings = Baseline Absence × MSD Percentage × Reduction % × Cost Per Day × DSE Users
                  </code>
                  <p className="text-sm text-muted-foreground">
                    Early intervention preventing musculoskeletal disorder-related absences
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-semibold text-primary">Clinical Intervention Savings</h4>
                  <code className="block p-2 bg-muted rounded text-sm">
                    Savings = MSD Users × Intervention Rate × Reduction % × Cost Per Intervention
                  </code>
                  <p className="text-sm text-muted-foreground">
                    Preventative measures reducing need for expensive medical treatments
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-semibold text-primary">ROI Calculation</h4>
                  <code className="block p-2 bg-muted rounded text-sm">
                    ROI % = (Net Benefits / Software Costs) × 100
                  </code>
                  <p className="text-sm text-muted-foreground">
                    Standard ROI formula comparing benefits to investment
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Assumptions & Sources */}
          <Card>
            <CardHeader>
              <CardTitle>📚 Key Assumptions & Sources</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Absence Rates</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• <strong>Manufacturing:</strong> 2.8 days/year (HSE UK)</li>
                    <li>• <strong>Construction:</strong> 3.2 days/year (HSE UK)</li>
                    <li>• <strong>Healthcare:</strong> 2.1 days/year (NHS England)</li>
                    <li>• <strong>Office:</strong> 1.8 days/year (CIPD)</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">MSD Prevalence</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• <strong>DSE Users:</strong> 15-25% (HSE Display Screen Equipment)</li>
                    <li>• <strong>Manual Handling:</strong> 20-30% (HSE Manual Handling)</li>
                    <li>• <strong>Construction:</strong> 25-35% (HSE Construction)</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Cost Benchmarks</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• <strong>Absence Cost:</strong> £200-400/day (CIPD)</li>
                    <li>• <strong>Clinical Intervention:</strong> £500-2000 (NHS)</li>
                    <li>• <strong>Admin On-Cost:</strong> 20-30% (CIPD)</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Effectiveness Rates</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• <strong>Admin Time:</strong> 50-70% reduction (Industry studies)</li>
                    <li>• <strong>MSD Absence:</strong> 20-40% reduction (HSE guidance)</li>
                    <li>• <strong>Interventions:</strong> 30-50% reduction (Occupational health)</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* External Validation */}
          <Card>
            <CardHeader>
              <CardTitle>🔍 External Validation & Cross-Reference</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">National Safety Council Standards</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Our calculations align with NSC's safety ROI methodology for workplace interventions.
                  </p>
                  <a 
                    href="https://www.nsc.org/work-safety/safety-topics/roi" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline text-sm"
                  >
                    View NSC ROI Calculator →
                  </a>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Generic ROI Calculator Validation</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Simple ROI calculations cross-verified against industry-standard calculators.
                  </p>
                  <div className="flex gap-2">
                    <a 
                      href="https://www.calculator.net/roi-calculator.html" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline text-sm"
                    >
                      Calculator.net →
                    </a>
                    <a 
                      href="https://www.calculatorsoup.com/calculators/financial/roi-calculator.php" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline text-sm"
                    >
                      CalculatorSoup →
                    </a>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Privacy */}
          <Card>
            <CardHeader>
              <CardTitle>🔒 Data Privacy & Handling</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>
                  <strong>No Personal Data:</strong> This calculator does not collect, store, or transmit any personally identifiable information (PII).
                </p>
                <p>
                  <strong>Local Processing:</strong> All calculations are performed locally in your browser. No data is sent to external servers.
                </p>
                <p>
                  <strong>Export Options:</strong> Results can be exported as PDF/CSV for your records, but remain under your control.
                </p>
                <p>
                  <strong>Analytics:</strong> Basic usage analytics (calculate events, export events) are anonymized and used only to improve the tool.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
