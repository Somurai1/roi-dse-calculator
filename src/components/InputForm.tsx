
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Info } from 'lucide-react'
import { ROICalculationInputs, CURRENCY_SYMBOLS } from '@/lib/roi'
import { VALIDATION_RULES } from '@/lib/formulas'
import { calculateSoftwareCost } from '@/lib/pricing'

interface InputFormProps {
  inputs: ROICalculationInputs
  onInputChange: (field: keyof ROICalculationInputs, value: string | number) => void
  validationErrors: string[]
}

export function InputForm({ inputs, onInputChange, validationErrors }: InputFormProps) {

  const handleInputChange = (field: keyof ROICalculationInputs, value: string) => {
    onInputChange(field, value)
  }

  // Real-time validation for individual fields
  const getFieldError = (field: keyof ROICalculationInputs): string | null => {
    const value = inputs[field]
    const rules = VALIDATION_RULES[field as keyof typeof VALIDATION_RULES]
    
    if (!rules || typeof value !== 'number') return null
    
    if (value < rules.min) {
      return `${field} must be at least ${rules.min} ${rules.unit}`
    }
    
    if (value > rules.max) {
      return `${field} cannot exceed ${rules.max} ${rules.unit}`
    }
    
    return null
  }

  const getFieldConstraints = (field: keyof ROICalculationInputs) => {
    return VALIDATION_RULES[field as keyof typeof VALIDATION_RULES] || {}
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="h-5 w-5" />
          Input Parameters
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Validation Summary */}
        {validationErrors.length > 0 && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <h4 className="text-sm font-medium text-red-800 mb-2">
              ⚠️ {validationErrors.length} validation error(s) found
            </h4>
            <ul className="text-sm text-red-700 space-y-1">
              {validationErrors.map((error, index) => (
                <li key={index}>• {error}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Most Important Parameters - User Inputs */}
          
          {/* Headcount */}
          <div>
            <Label htmlFor="headcount">Headcount</Label>
            <Input
              id="headcount"
              type="number"
              value={inputs.headcount}
              onChange={(e) => {
                const newHeadcount = parseInt(e.target.value)
                handleInputChange('headcount', e.target.value)
                // Automatically update software price based on new headcount
                const softwareCost = calculateSoftwareCost(newHeadcount)
                handleInputChange('softwarePricePerUser', softwareCost.perUser.toString())
              }}
              min={getFieldConstraints('headcount').min}
              max={getFieldConstraints('headcount').max}
              step="1"
              className={getFieldError('headcount') ? 'border-red-500' : ''}
            />
            {getFieldError('headcount') && (
              <p className="text-sm text-red-500 mt-1">{getFieldError('headcount')}</p>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              Range: {getFieldConstraints('headcount').min} - {getFieldConstraints('headcount').max} employees
            </p>
          </div>

          {/* Automatic Software Pricing */}
          <div>
            <Label>Software Price (Auto-calculated)</Label>
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
              <div className="text-sm font-medium text-blue-900">
                {CURRENCY_SYMBOLS[inputs.currency]}{calculateSoftwareCost(inputs.headcount).perUser.toFixed(2)} per user/year
              </div>
              <div className="text-xs text-blue-700 mt-1">
                Total: {CURRENCY_SYMBOLS[inputs.currency]}{calculateSoftwareCost(inputs.headcount).annualPrice.toLocaleString()}
              </div>
              <div className="text-xs text-blue-600 mt-1">
                Tier: {calculateSoftwareCost(inputs.headcount).tier}
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Based on your {inputs.headcount} employees
            </p>
          </div>

          {/* DSE User Percentage */}
          <div>
            <Label htmlFor="dseUserPercentage">% DSE Users</Label>
            <Input
              id="dseUserPercentage"
              type="number"
              value={inputs.dseUserPercentage}
              onChange={(e) => handleInputChange('dseUserPercentage', e.target.value)}
              min={getFieldConstraints('dseUserPercentage').min}
              max={getFieldConstraints('dseUserPercentage').max}
              step="0.1"
              className={getFieldError('dseUserPercentage') ? 'border-red-500' : ''}
            />
            {getFieldError('dseUserPercentage') && (
              <p className="text-sm text-red-500 mt-1">{getFieldError('dseUserPercentage')}</p>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              Range: {getFieldConstraints('dseUserPercentage').min}% - {getFieldConstraints('dseUserPercentage').max}%
            </p>
          </div>

          {/* Admin Salary */}
          <div>
            <Label htmlFor="adminSalary">Admin Salary (Competent Person)</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                {CURRENCY_SYMBOLS[inputs.currency]}
              </span>
              <Input
                id="adminSalary"
                type="number"
                value={inputs.adminSalary}
                onChange={(e) => handleInputChange('adminSalary', e.target.value)}
                min={getFieldConstraints('adminSalary').min}
                max={getFieldConstraints('adminSalary').max}
                step="1000"
                className={`pl-8 ${getFieldError('adminSalary') ? 'border-red-500' : ''}`}
              />
            </div>
            {getFieldError('adminSalary') && (
              <p className="text-sm text-red-500 mt-1">{getFieldError('adminSalary')}</p>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              Range: €{getFieldConstraints('adminSalary').min.toLocaleString()} - €{getFieldConstraints('adminSalary').max.toLocaleString()}
            </p>
          </div>

          {/* Admin Time */}
          <div>
            <Label htmlFor="adminTimeNow">Admin Time Now (days/week)</Label>
            <Input
              id="adminTimeNow"
              type="number"
              value={inputs.adminTimeNow}
              onChange={(e) => handleInputChange('adminTimeNow', e.target.value)}
              min={getFieldConstraints('adminTimeNow').min}
              max={getFieldConstraints('adminTimeNow').max}
              step="0.5"
              className={getFieldError('adminTimeNow') ? 'border-red-500' : ''}
            />
            {getFieldError('adminTimeNow') && (
              <p className="text-sm text-red-500 mt-1">{getFieldError('adminTimeNow')}</p>
            )}
          </div>

          <div>
            <Label htmlFor="adminTimeWithSoftware">Admin Time with Software (days/week)</Label>
            <Input
              id="adminTimeWithSoftware"
              type="number"
              value={inputs.adminTimeWithSoftware}
              onChange={(e) => handleInputChange('adminTimeWithSoftware', e.target.value)}
              min={getFieldConstraints('adminTimeWithSoftware').min}
              max={getFieldConstraints('adminTimeWithSoftware').max}
              step="0.5"
              className={getFieldError('adminTimeWithSoftware') ? 'border-red-500' : ''}
            />
            {getFieldError('adminTimeWithSoftware') && (
              <p className="text-sm text-red-500 mt-1">{getFieldError('adminTimeWithSoftware')}</p>
            )}
          </div>

          {/* Currency */}
          <div>
            <Label htmlFor="currency">Currency</Label>
            <Select value={inputs.currency} onValueChange={(value) => handleInputChange('currency', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="EUR">EUR (€)</SelectItem>
                <SelectItem value="GBP">GBP (£)</SelectItem>
                <SelectItem value="USD">USD ($)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Advanced Settings Dropdown */}
        <div className="mt-6">
          <div className="border-t pt-6">
            <details className="group">
              <summary className="flex cursor-pointer items-center justify-between rounded-lg bg-gray-50 p-4 hover:bg-gray-100">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-900">Advanced Settings</span>
                  <span className="text-xs text-gray-500">(Optional - uses industry defaults)</span>
                </div>
                <span className="transition group-open:rotate-180">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </summary>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4 bg-gray-50 rounded-lg">
                
                {/* Industry Preset */}
                <div>
                  <Label htmlFor="industryPreset">Industry Type</Label>
                  <Select 
                    value="office" 
                    onValueChange={(value) => {
                      // Apply industry-specific presets
                      const presets = {
                        office: { baselineAbsenceRate: 5, msdPrevalence: 25, costPerAbsenceDay: 300, costPerClinicalIntervention: 500 },
                        manufacturing: { baselineAbsenceRate: 6, msdPrevalence: 35, costPerAbsenceDay: 350, costPerClinicalIntervention: 600 },
                        healthcare: { baselineAbsenceRate: 4, msdPrevalence: 30, costPerAbsenceDay: 400, costPerClinicalIntervention: 800 },
                        tech: { baselineAbsenceRate: 3, msdPrevalence: 20, costPerAbsenceDay: 250, costPerClinicalIntervention: 400 }
                      }
                      const preset = presets[value as keyof typeof presets]
                      if (preset) {
                        Object.entries(preset).forEach(([key, val]) => {
                          onInputChange(key as keyof ROICalculationInputs, val)
                        })
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="office">Office/Corporate</SelectItem>
                      <SelectItem value="manufacturing">Manufacturing</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="tech">Technology</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">
                    Sets absence rates, MSD prevalence, and costs
                  </p>
                </div>

                {/* Company Size Preset */}
                <div>
                  <Label htmlFor="companySizePreset">Company Size</Label>
                  <Select 
                    value="medium" 
                    onValueChange={(value) => {
                      // Apply company size presets
                      const presets = {
                        small: { reductionInMsdAbsence: 10, reductionInClinicalInterventions: 15, adminOnCostPercentage: 25 },
                        medium: { reductionInMsdAbsence: 15, reductionInClinicalInterventions: 25, adminOnCostPercentage: 30 },
                        large: { reductionInMsdAbsence: 20, reductionInClinicalInterventions: 30, adminOnCostPercentage: 35 }
                      }
                      const preset = presets[value as keyof typeof presets]
                      if (preset) {
                        Object.entries(preset).forEach(([key, val]) => {
                          onInputChange(key as keyof ROICalculationInputs, val)
                        })
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small (50-200)</SelectItem>
                      <SelectItem value="medium">Medium (200-1000)</SelectItem>
                      <SelectItem value="large">Large (1000+)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">
                    Sets reduction percentages and admin costs
                  </p>
                </div>

                {/* Standard Values */}
                <div>
                  <Label htmlFor="standardValues">Calculation Approach</Label>
                  <Select 
                    value="default" 
                    onValueChange={(value) => {
                      // Apply standard value presets
                      const presets = {
                        default: { workDaysPerYear: 220, absenceDueToMsdPercentage: 30, msdNeedingInterventionPercentage: 20 },
                        conservative: { workDaysPerYear: 200, absenceDueToMsdPercentage: 25, msdNeedingInterventionPercentage: 15 },
                        aggressive: { workDaysPerYear: 240, absenceDueToMsdPercentage: 35, msdNeedingInterventionPercentage: 25 }
                      }
                      const preset = presets[value as keyof typeof presets]
                      if (preset) {
                        Object.entries(preset).forEach(([key, val]) => {
                          onInputChange(key as keyof ROICalculationInputs, val)
                        })
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default (Standard)</SelectItem>
                      <SelectItem value="conservative">Conservative</SelectItem>
                      <SelectItem value="aggressive">Aggressive</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">
                    Sets work days and MSD percentages
                  </p>
                </div>
              </div>
            </details>
          </div>
        </div>



        {/* Validation Errors */}
        {validationErrors.length > 0 && (
          <div className="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <div className="text-destructive font-medium mb-2">Please fix the following errors:</div>
            <ul className="text-sm text-destructive/80 space-y-1">
              {validationErrors.map((error, index) => (
                <li key={index}>• {error}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
