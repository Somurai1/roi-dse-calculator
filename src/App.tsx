import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TooltipProvider } from './components/ui/tooltip'
import { SourcesModal } from './components/SourcesModal'
import { KPIDisplay } from './components/KPIDisplay'
import { InputForm } from './components/InputForm'

import { ComplianceBanner } from './components/ComplianceBanner'
import { SensitivityChart } from './components/SensitivityChart'
import { AdvancedParameters } from './components/AdvancedParameters'
import { PDFExport } from './components/PDFExport'
import { 
  ROICalculationInputs, 
  DEFAULT_INPUTS, 
  calculateAllScenarios, 
  ScenarioResults,
  performSensitivityAnalysis
} from './lib/roi'
import { validateInputs } from './lib/schema'
import TestRunner from './components/TestRunner'
import { MethodologyModal } from './components/MethodologyModal'
import { ErrorBoundary } from './components/ErrorBoundary'

function App() {
  const [inputs, setInputs] = useState<ROICalculationInputs>(DEFAULT_INPUTS)
  const [scenarios, setScenarios] = useState<ScenarioResults | null>(null)
  const [activeScenario, setActiveScenario] = useState<'conservative' | 'expected' | 'stretch'>('expected')
  const [showSources, setShowSources] = useState(false)
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [showTestRunner, setShowTestRunner] = useState(false)
  const [sensitivityData, setSensitivityData] = useState<any[]>([])

  // Calculate ROI whenever inputs change
  useEffect(() => {
    const validationResult = validateInputs(inputs)
    
    if (validationResult.success) {
      setValidationErrors([])
      const results = calculateAllScenarios(inputs)
      setScenarios(results)
      
      // Generate sensitivity analysis
      const sensitivity = performSensitivityAnalysis(inputs)
      setSensitivityData(sensitivity)
    } else {
      setValidationErrors(validationResult.errors)
      setScenarios(null)
      setSensitivityData([])
    }
  }, [inputs])

  const handleInputChange = (field: keyof ROICalculationInputs, value: string | number) => {
    setInputs((prev: ROICalculationInputs) => ({
      ...prev,
      [field]: typeof value === 'string' ? parseFloat(value) || 0 : value
    }))
  }

  const resetToDefaults = () => {
    setInputs(DEFAULT_INPUTS)
    setActiveScenario('expected')
  }

  const copySummary = () => {
    if (!scenarios) return
    
    const active = scenarios[activeScenario]
    const summary = `ROI Calculator Summary (${activeScenario} scenario):
    
Headcount: ${inputs.headcount}
DSE Users: ${inputs.dseUserPercentage}%
ROI: ${active.roiPercentage.toFixed(1)}%
Annual Net Benefit: ${active.netBenefit.toLocaleString('en-IE', { style: 'currency', currency: inputs.currency })}
Payback Period: ${active.paybackMonths.toFixed(1)} months
Breakeven Users: ${active.breakevenUsers}

Key Savings:
- Admin: ${active.adminSaving.toLocaleString('en-IE', { style: 'currency', currency: inputs.currency })}
- Absence: ${active.absenceSaving.toLocaleString('en-IE', { style: 'currency', currency: inputs.currency })}
- Interventions: ${active.interventionSaving.toLocaleString('en-IE', { style: 'currency', currency: inputs.currency })}

Total Annual Savings: ${active.totalAnnualSavings.toLocaleString('en-IE', { style: 'currency', currency: inputs.currency })}
Licence Cost: ${active.licenceCost.toLocaleString('en-IE', { style: 'currency', currency: inputs.currency })}

Generated on ${new Date().toLocaleDateString()}`

    navigator.clipboard.writeText(summary)
  }



  const emailBreakdown = () => {
    if (!scenarios) return
    
    const active = scenarios[activeScenario]
    const subject = encodeURIComponent(`ROI Calculator Results - ${inputs.headcount} employees`)
    const body = encodeURIComponent(`Hi,

I've calculated the ROI for your DSE platform implementation:

Headcount: ${inputs.headcount}
DSE Users: ${inputs.dseUserPercentage}%
Scenario: ${activeScenario.charAt(0).toUpperCase() + activeScenario.slice(1)}

Results:
- ROI: ${active.roiPercentage.toFixed(1)}%
- Annual Net Benefit: ${active.netBenefit.toLocaleString('en-IE', { style: 'currency', currency: inputs.currency })}
- Payback Period: ${active.paybackMonths.toFixed(1)} months
- Breakeven Users: ${active.breakevenUsers}

Key Savings:
- Admin time reduction: ${active.adminSaving.toLocaleString('en-IE', { style: 'currency', currency: inputs.currency })}
- MSD absence reduction: ${active.absenceSaving.toLocaleString('en-IE', { style: 'currency', currency: inputs.currency })}
- Clinical intervention reduction: ${active.interventionSaving.toLocaleString('en-IE', { style: 'currency', currency: inputs.currency })}

Total Annual Savings: ${active.totalAnnualSavings.toLocaleString('en-IE', { style: 'currency', currency: inputs.currency })}

Let me know if you'd like to discuss any of these figures or explore different scenarios.

Best regards`)

    window.location.href = `mailto:?subject=${subject}&body=${body}`
  }

  return (
    <ErrorBoundary>
      <TooltipProvider>
        <div className="min-h-screen bg-background">
          {/* Header */}
          <header className="border-b bg-card">
            <div className="container mx-auto px-4 py-6">
              <div className="text-center">
                <h1 className="text-3xl font-bold text-foreground">ROI Calculator</h1>
                <p className="text-muted-foreground">Calculate the return on investment for DSE software implementation</p>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="container mx-auto px-4 py-6">
            {/* Input Form - Now at the top */}
            <div className="mb-8">
              <InputForm 
                inputs={inputs}
                onInputChange={handleInputChange}
                validationErrors={validationErrors}
              />
            </div>

            {/* Results Panel - Below the form */}
            <div className="mb-8">
              {scenarios ? (
                <KPIDisplay 
                  scenarios={scenarios}
                  activeScenario={activeScenario}
                  onScenarioChange={setActiveScenario}
                  inputs={inputs}
                />
              ) : (
                <div className="text-center p-8 bg-muted/20 rounded-lg">
                  <h2 className="text-xl font-semibold mb-2">ROI Calculation</h2>
                  <p className="text-muted-foreground">
                    {validationErrors.length > 0 
                      ? `Please fix ${validationErrors.length} validation error(s) to see results`
                      : 'Calculating ROI...'
                    }
                  </p>
                  {validationErrors.length > 0 && (
                    <div className="mt-4 text-sm text-destructive">
                      {validationErrors.map((error, index) => (
                        <div key={index}>• {error}</div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Hidden Advanced Features - Only show when toggled */}
            <div className="text-center mb-6">
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium mr-4"
              >
                {showAdvanced ? 'Hide' : 'Show'} Advanced Features
              </button>
              
              <button
                onClick={() => setShowTestRunner(!showTestRunner)}
                className="px-6 py-3 bg-orange-200 text-orange-700 rounded-lg hover:bg-orange-300 transition-colors font-medium mr-4"
              >
                {showTestRunner ? 'Hide' : 'Show'} Test Suite
              </button>

              <button
                onClick={() => setShowSources(true)}
                className="px-6 py-3 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors font-medium mr-4"
              >
                View Sources
              </button>

              <MethodologyModal />
            </div>

            {/* Advanced Features - Hidden by default */}
            {showAdvanced && scenarios && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-6"
              >
                {/* Sensitivity Analysis */}
                <SensitivityChart sensitivityData={sensitivityData} />
                
                {/* Advanced Parameters */}
                <AdvancedParameters 
                  inputs={inputs}
                  onInputChange={handleInputChange}
                  onResetToDefaults={resetToDefaults}
                />
                
                {/* PDF Export */}
                <PDFExport 
                  inputs={inputs}
                  scenarios={scenarios}
                  onCopySummary={copySummary}
                  onEmailBreakdown={emailBreakdown}
                />
              </motion.div>
            )}

            {/* Test Runner - Hidden by default */}
            {showTestRunner && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <TestRunner />
              </motion.div>
            )}
          </main>

          {/* Compliance Banner */}
          <ComplianceBanner />

          {/* Sources Modal */}
          <SourcesModal open={showSources} onOpenChange={setShowSources} />
        </div>
      </TooltipProvider>
    </ErrorBoundary>
  )
}

export default App
