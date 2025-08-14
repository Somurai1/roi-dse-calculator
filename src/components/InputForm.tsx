
import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { ROICalculationInputs, CURRENCY_SYMBOLS } from '@/lib/roi'
import { getFieldConstraints, validateField } from '../lib/formulas'
import { calculateSoftwareCost } from '../lib/pricing'

interface InputFormProps {
  inputs: ROICalculationInputs
  onInputChange: (field: keyof ROICalculationInputs, value: string | number) => void
  validationErrors: string[]
}

export const InputForm: React.FC<InputFormProps> = ({ inputs, onInputChange, validationErrors }) => {
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [showHelp, setShowHelp] = useState(false)
  const [selectedIndustry, setSelectedIndustry] = useState<string>('')
  const [selectedCompanySize, setSelectedCompanySize] = useState<string>('')
  const [selectedApproach, setSelectedApproach] = useState<string>('')

  // Validate field on change
  const handleFieldChange = (field: keyof ROICalculationInputs, value: string) => {
    // Skip validation for currency field
    if (field === 'currency') {
      onInputChange(field, value)
      return
    }
    
    const validation = validateField(field, value)
    if (!validation.valid) {
      setFieldErrors(prev => ({ ...prev, [field]: validation.message }))
    } else {
      setFieldErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
    onInputChange(field, value)
  }

  // Apply presets and update form
  const applyPresets = (presets: Record<string, number>) => {
    Object.entries(presets).forEach(([field, value]) => {
      handleFieldChange(field as keyof ROICalculationInputs, value.toString())
    })
  }

  // Get field constraints for help text
  const getFieldHelp = (field: keyof ROICalculationInputs) => {
    // Skip validation for currency field
    if (field === 'currency') return ''
    
    const constraints = getFieldConstraints(field)
    if (!constraints) return ''
    
    const { min, max, unit, step } = constraints
    let help = ''
    if (min !== undefined) help += `Min: ${min}${unit || ''} `
    if (max !== undefined) help += `Max: ${max}${unit || ''} `
    if (step !== undefined) help += `Step: ${step}${unit || ''}`
    return help.trim()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>📊 ROI Calculator Inputs</span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowHelp(!showHelp)}
            className="text-xs"
          >
            {showHelp ? 'Hide' : 'Show'} Help
          </Button>
        </CardTitle>
        <CardDescription>
          Enter your company details to calculate ROI for DSE safety software
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Main Inputs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Headcount */}
            <div className="space-y-2">
              <Label htmlFor="headcount" className="flex items-center gap-2">
                Total Headcount
                <span className="text-red-500">*</span>
                {showHelp && (
                  <span className="text-xs text-muted-foreground">
                    ({getFieldHelp('headcount')})
                  </span>
                )}
              </Label>
              <Input
                id="headcount"
                type="number"
                value={inputs.headcount}
                onChange={(e) => {
                  const newHeadcount = parseInt(e.target.value)
                  handleFieldChange('headcount', e.target.value)
                  // Automatically update software price based on new headcount
                  if (!isNaN(newHeadcount)) {
                    const softwareCost = calculateSoftwareCost(newHeadcount)
                    handleFieldChange('softwarePricePerUser', softwareCost.perUser.toString())
                  }
                }}
                min={getFieldConstraints('headcount')?.min}
                max={getFieldConstraints('headcount')?.max}
                step={getFieldConstraints('headcount')?.step}
                aria-describedby={fieldErrors.headcount ? `headcount-error` : `headcount-help`}
                aria-invalid={!!fieldErrors.headcount}
                className={fieldErrors.headcount ? 'border-red-500' : ''}
              />
              {fieldErrors.headcount && (
                <p id="headcount-error" className="text-sm text-red-500" role="alert">
                  {fieldErrors.headcount}
                </p>
              )}
              {showHelp && !fieldErrors.headcount && (
                <p id="headcount-help" className="text-xs text-muted-foreground">
                  Total number of employees in your organization
                </p>
              )}
            </div>

            {/* DSE User Percentage */}
            <div className="space-y-2">
              <Label htmlFor="dseUserPercentage" className="flex items-center gap-2">
                DSE Users (%)
                <span className="text-red-500">*</span>
                {showHelp && (
                  <span className="text-xs text-muted-foreground">
                    ({getFieldHelp('dseUserPercentage')})
                  </span>
                )}
              </Label>
              <Input
                id="dseUserPercentage"
                type="number"
                value={inputs.dseUserPercentage}
                onChange={(e) => handleFieldChange('dseUserPercentage', e.target.value)}
                min={getFieldConstraints('dseUserPercentage')?.min}
                max={getFieldConstraints('dseUserPercentage')?.max}
                step={getFieldConstraints('dseUserPercentage')?.step}
                aria-describedby={fieldErrors.dseUserPercentage ? `dseUserPercentage-error` : `dseUserPercentage-help`}
                aria-invalid={!!fieldErrors.dseUserPercentage}
                className={fieldErrors.dseUserPercentage ? 'border-red-500' : ''}
              />
              {fieldErrors.dseUserPercentage && (
                <p id="dseUserPercentage-error" className="text-sm text-red-500" role="alert">
                  {fieldErrors.dseUserPercentage}
                </p>
              )}
              {showHelp && !fieldErrors.dseUserPercentage && (
                <p id="dseUserPercentage-help" className="text-xs text-muted-foreground">
                  Percentage of employees using display screen equipment
                </p>
              )}
            </div>

            {/* Admin Salary */}
            <div className="space-y-2">
              <Label htmlFor="adminSalary" className="flex items-center gap-2">
                Admin Salary ({CURRENCY_SYMBOLS[inputs.currency]}/year)
                <span className="text-red-500">*</span>
                {showHelp && (
                  <span className="text-xs text-muted-foreground">
                    ({getFieldHelp('adminSalary')})
                  </span>
                )}
              </Label>
              <Input
                id="adminSalary"
                type="number"
                value={inputs.adminSalary}
                onChange={(e) => handleFieldChange('adminSalary', e.target.value)}
                min={getFieldConstraints('adminSalary')?.min}
                max={getFieldConstraints('adminSalary')?.max}
                step={getFieldConstraints('adminSalary')?.step}
                aria-describedby={fieldErrors.adminSalary ? `adminSalary-error` : `adminSalary-help`}
                aria-invalid={!!fieldErrors.adminSalary}
                className={fieldErrors.adminSalary ? 'border-red-500' : ''}
              />
              {fieldErrors.adminSalary && (
                <p id="adminSalary-error" className="text-sm text-red-500" role="alert">
                  {fieldErrors.adminSalary}
                </p>
              )}
              {showHelp && !fieldErrors.adminSalary && (
                <p id="adminSalary-help" className="text-xs text-muted-foreground">
                  Annual salary of admin staff handling DSE assessments
                </p>
              )}
            </div>

            {/* Admin Time Now */}
            <div className="space-y-2">
              <Label htmlFor="adminTimeNow" className="flex items-center gap-2">
                Admin Time Now (hours/year)
                <span className="text-red-500">*</span>
                {showHelp && (
                  <span className="text-xs text-muted-foreground">
                    ({getFieldHelp('adminTimeNow')})
                  </span>
                )}
              </Label>
              <Input
                id="adminTimeNow"
                type="number"
                value={inputs.adminTimeNow}
                onChange={(e) => handleFieldChange('adminTimeNow', e.target.value)}
                min={getFieldConstraints('adminTimeNow')?.min}
                max={getFieldConstraints('adminTimeNow')?.max}
                step={getFieldConstraints('adminTimeNow')?.step}
                aria-describedby={fieldErrors.adminTimeNow ? `adminTimeNow-error` : `adminTimeNow-help`}
                aria-invalid={!!fieldErrors.adminTimeNow}
                className={fieldErrors.adminTimeNow ? 'border-red-500' : ''}
              />
              {fieldErrors.adminTimeNow && (
                <p id="adminTimeNow-error" className="text-sm text-red-500" role="alert">
                  {fieldErrors.adminTimeNow}
                </p>
              )}
              {showHelp && !fieldErrors.adminTimeNow && (
                <p id="adminTimeNow-help" className="text-xs text-muted-foreground">
                  Current annual hours spent on DSE assessments per user
                </p>
              )}
            </div>

            {/* Admin Time With Software */}
            <div className="space-y-2">
              <Label htmlFor="adminTimeWithSoftware" className="flex items-center gap-2">
                Admin Time With Software (hours/year)
                <span className="text-red-500">*</span>
                {showHelp && (
                  <span className="text-xs text-muted-foreground">
                    ({getFieldHelp('adminTimeWithSoftware')})
                  </span>
                )}
              </Label>
              <Input
                id="adminTimeWithSoftware"
                type="number"
                value={inputs.adminTimeWithSoftware}
                onChange={(e) => handleFieldChange('adminTimeWithSoftware', e.target.value)}
                min={getFieldConstraints('adminTimeWithSoftware')?.min}
                max={getFieldConstraints('adminTimeWithSoftware')?.max}
                step={getFieldConstraints('adminTimeWithSoftware')?.step}
                aria-describedby={fieldErrors.adminTimeWithSoftware ? `adminTimeWithSoftware-error` : `adminTimeWithSoftware-help`}
                aria-invalid={!!fieldErrors.adminTimeWithSoftware}
                className={fieldErrors.adminTimeWithSoftware ? 'border-red-500' : ''}
              />
              {fieldErrors.adminTimeWithSoftware && (
                <p id="adminTimeWithSoftware-error" className="text-sm text-red-500" role="alert">
                  {fieldErrors.adminTimeWithSoftware}
                </p>
              )}
              {showHelp && !fieldErrors.adminTimeWithSoftware && (
                <p id="adminTimeWithSoftware-help" className="text-xs text-muted-foreground">
                  Expected annual hours with software automation
                </p>
              )}
            </div>

            {/* Currency */}
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select value={inputs.currency} onValueChange={(value) => onInputChange('currency', value)}>
                <SelectTrigger id="currency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GBP">GBP (£)</SelectItem>
                  <SelectItem value="EUR">EUR (€)</SelectItem>
                  <SelectItem value="USD">USD ($)</SelectItem>
                </SelectContent>
              </Select>
              {showHelp && (
                <p className="text-xs text-muted-foreground">
                  Currency for all calculations and results
                </p>
              )}
            </div>
          </div>

          {/* Software Price Display */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <Label className="text-blue-900 font-medium">Software Price (Auto-calculated)</Label>
            <div className="mt-2 space-y-1">
              <div className="text-lg font-semibold text-blue-900">
                {CURRENCY_SYMBOLS[inputs.currency]}{calculateSoftwareCost(inputs.headcount).perUser.toFixed(2)} per user/year
              </div>
              <div className="text-sm text-blue-700">
                Total Annual: {CURRENCY_SYMBOLS[inputs.currency]}{calculateSoftwareCost(inputs.headcount).annualPrice.toLocaleString()}
              </div>
              <div className="text-xs text-blue-600">
                Tier: {calculateSoftwareCost(inputs.headcount).tier}
              </div>
            </div>
            <p className="text-xs text-blue-600 mt-2">
              Based on your {inputs.headcount} employees - volume discounts applied automatically
            </p>
          </div>

          {/* Advanced Settings Dropdown */}
          <div className="mt-6">
            <div className="border-t pt-6">
              <details className="group">
                <summary className="flex cursor-pointer items-center justify-between rounded-lg bg-gray-50 p-4 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary">
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
                
                {/* Preset Selectors */}
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4 bg-gray-50 rounded-lg">
                  {/* Industry Preset */}
                  <div className="space-y-2">
                    <Label htmlFor="industryPreset">Industry Type</Label>
                    <Select 
                      value={selectedIndustry} 
                      onValueChange={(value) => {
                        console.log('Industry selected:', value)
                        setSelectedIndustry(value)
                        const presets = INDUSTRY_PRESETS[value as keyof typeof INDUSTRY_PRESETS]
                        console.log('Applying presets:', presets)
                        if (presets) {
                          applyPresets(presets)
                        }
                      }}
                    >
                      <SelectTrigger id="industryPreset">
                        <SelectValue>
                          {selectedIndustry ? selectedIndustry.charAt(0).toUpperCase() + selectedIndustry.slice(1) : "Select industry..."}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="manufacturing">Manufacturing</SelectItem>
                        <SelectItem value="construction">Construction</SelectItem>
                        <SelectItem value="healthcare">Healthcare</SelectItem>
                        <SelectItem value="office">Office/Admin</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Sets absence rates, MSD prevalence, and costs
                    </p>
                  </div>

                  {/* Company Size Preset */}
                  <div className="space-y-2">
                    <Label htmlFor="companySize">Company Size</Label>
                    <Select 
                      value={selectedCompanySize} 
                      onValueChange={(value) => {
                        console.log('Company size selected:', value)
                        setSelectedCompanySize(value)
                        const presets = COMPANY_SIZE_PRESETS[value as keyof typeof COMPANY_SIZE_PRESETS]
                        console.log('Applying presets:', presets)
                        if (presets) {
                          applyPresets(presets)
                        }
                      }}
                    >
                      <SelectTrigger id="companySize">
                        <SelectValue>
                          {selectedCompanySize ? selectedCompanySize.charAt(0).toUpperCase() + selectedCompanySize.slice(1) : "Select size..."}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Small (1-50)</SelectItem>
                        <SelectItem value="medium">Medium (51-250)</SelectItem>
                        <SelectItem value="large">Large (250+)</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Sets reduction percentages and admin costs
                    </p>
                  </div>

                  {/* Calculation Approach */}
                  <div className="space-y-2">
                    <Label htmlFor="calculationApproach">Calculation Approach</Label>
                    <Select 
                      value={selectedApproach} 
                      onValueChange={(value) => {
                        console.log('Approach selected:', value)
                        setSelectedApproach(value)
                        const presets = CALCULATION_APPROACH_PRESETS[value as keyof typeof CALCULATION_APPROACH_PRESETS]
                        console.log('Applying presets:', presets)
                        if (presets) {
                          applyPresets(presets)
                        }
                      }}
                    >
                      <SelectTrigger id="calculationApproach">
                        <SelectValue>
                          {selectedApproach ? selectedApproach.charAt(0).toUpperCase() + selectedApproach.slice(1) : "Select approach..."}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="conservative">Conservative</SelectItem>
                        <SelectItem value="moderate">Moderate</SelectItem>
                        <SelectItem value="optimistic">Optimistic</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Sets work days and MSD percentages
                    </p>
                  </div>
                </div>

                {/* Debug Info */}
                {(selectedIndustry || selectedCompanySize || selectedApproach) && (
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="text-sm font-medium text-blue-900 mb-2">Current Preset Selections:</h4>
                    <div className="text-xs text-blue-700 space-y-1">
                      {selectedIndustry && <div>Industry: {selectedIndustry}</div>}
                      {selectedCompanySize && <div>Company Size: {selectedCompanySize}</div>}
                      {selectedApproach && <div>Approach: {selectedApproach}</div>}
                    </div>
                  </div>
                )}

                {/* Advanced Input Fields */}
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4 bg-gray-50 rounded-lg">
                  {/* Baseline Absence Rate */}
                  <div className="space-y-2">
                    <Label htmlFor="baselineAbsenceRate">Baseline Absence Rate (%)</Label>
                    <Input
                      id="baselineAbsenceRate"
                      type="number"
                      value={inputs.baselineAbsenceRate}
                      onChange={(e) => handleFieldChange('baselineAbsenceRate', e.target.value)}
                      min={getFieldConstraints('baselineAbsenceRate')?.min}
                      max={getFieldConstraints('baselineAbsenceRate')?.max}
                      step={getFieldConstraints('baselineAbsenceRate')?.step}
                      className={fieldErrors.baselineAbsenceRate ? 'border-red-500' : ''}
                    />
                    {fieldErrors.baselineAbsenceRate && (
                      <p className="text-sm text-red-500">{fieldErrors.baselineAbsenceRate}</p>
                    )}
                  </div>

                  {/* Cost Per Absence Day */}
                  <div className="space-y-2">
                    <Label htmlFor="costPerAbsenceDay">Cost Per Absence Day ({CURRENCY_SYMBOLS[inputs.currency]})</Label>
                    <Input
                      id="costPerAbsenceDay"
                      type="number"
                      value={inputs.costPerAbsenceDay}
                      onChange={(e) => handleFieldChange('costPerAbsenceDay', e.target.value)}
                      min={getFieldConstraints('costPerAbsenceDay')?.min}
                      max={getFieldConstraints('costPerAbsenceDay')?.max}
                      step={getFieldConstraints('costPerAbsenceDay')?.step}
                      className={fieldErrors.costPerAbsenceDay ? 'border-red-500' : ''}
                    />
                    {fieldErrors.costPerAbsenceDay && (
                      <p className="text-sm text-red-500">{fieldErrors.costPerAbsenceDay}</p>
                    )}
                  </div>

                  {/* MSD Prevalence */}
                  <div className="space-y-2">
                    <Label htmlFor="msdPrevalence">MSD Prevalence (%)</Label>
                    <Input
                      id="msdPrevalence"
                      type="number"
                      value={inputs.msdPrevalence}
                      onChange={(e) => handleFieldChange('msdPrevalence', e.target.value)}
                      min={getFieldConstraints('msdPrevalence')?.min}
                      max={getFieldConstraints('msdPrevalence')?.max}
                      step={getFieldConstraints('msdPrevalence')?.step}
                      className={fieldErrors.msdPrevalence ? 'border-red-500' : ''}
                    />
                    {fieldErrors.msdPrevalence && (
                      <p className="text-sm text-red-500">{fieldErrors.msdPrevalence}</p>
                    )}
                  </div>

                  {/* Reduction in MSD Absence */}
                  <div className="space-y-2">
                    <Label htmlFor="reductionInMsdAbsence">MSD Absence Reduction (%)</Label>
                    <Input
                      id="reductionInMsdAbsence"
                      type="number"
                      value={inputs.reductionInMsdAbsence}
                      onChange={(e) => handleFieldChange('reductionInMsdAbsence', e.target.value)}
                      min={getFieldConstraints('reductionInMsdAbsence')?.min}
                      max={getFieldConstraints('reductionInMsdAbsence')?.max}
                      step={getFieldConstraints('reductionInMsdAbsence')?.step}
                      className={fieldErrors.reductionInMsdAbsence ? 'border-red-500' : ''}
                    />
                    {fieldErrors.reductionInMsdAbsence && (
                      <p className="text-sm text-red-500">{fieldErrors.reductionInMsdAbsence}</p>
                    )}
                  </div>

                  {/* Reduction in Clinical Interventions */}
                  <div className="space-y-2">
                    <Label htmlFor="reductionInClinicalInterventions">Clinical Intervention Reduction (%)</Label>
                    <Input
                      id="reductionInClinicalInterventions"
                      type="number"
                      value={inputs.reductionInClinicalInterventions}
                      onChange={(e) => handleFieldChange('reductionInClinicalInterventions', e.target.value)}
                      min={getFieldConstraints('reductionInClinicalInterventions')?.min}
                      max={getFieldConstraints('reductionInClinicalInterventions')?.max}
                      step={getFieldConstraints('reductionInClinicalInterventions')?.step}
                      className={fieldErrors.reductionInClinicalInterventions ? 'border-red-500' : ''}
                    />
                    {fieldErrors.reductionInClinicalInterventions && (
                      <p className="text-sm text-red-500">{fieldErrors.reductionInClinicalInterventions}</p>
                    )}
                  </div>

                  {/* Cost Per Clinical Intervention */}
                  <div className="space-y-2">
                    <Label htmlFor="costPerClinicalIntervention">Cost Per Clinical Intervention ({CURRENCY_SYMBOLS[inputs.currency]})</Label>
                    <Input
                      id="costPerClinicalIntervention"
                      type="number"
                      value={inputs.costPerClinicalIntervention}
                      onChange={(e) => handleFieldChange('costPerClinicalIntervention', e.target.value)}
                      min={getFieldConstraints('costPerClinicalIntervention')?.min}
                      max={getFieldConstraints('costPerClinicalIntervention')?.max}
                      step={getFieldConstraints('costPerClinicalIntervention')?.step}
                      className={fieldErrors.costPerClinicalIntervention ? 'border-red-500' : ''}
                    />
                    {fieldErrors.costPerClinicalIntervention && (
                      <p className="text-sm text-red-500">{fieldErrors.costPerClinicalIntervention}</p>
                    )}
                  </div>
                </div>
              </details>
            </div>
          </div>

          {/* Validation Errors Summary */}
          {validationErrors.length > 0 && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <h4 className="font-medium text-red-900 mb-2">Please fix the following errors:</h4>
              <ul className="text-sm text-red-700 space-y-1">
                {validationErrors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Add these preset objects at the bottom of the file
const INDUSTRY_PRESETS = {
  manufacturing: {
    baselineAbsenceRate: 2.8,
    msdPrevalence: 25, // Changed from 0.25 to 25 (percentage)
    costPerAbsenceDay: 300,
    costPerClinicalIntervention: 1500
  },
  construction: {
    baselineAbsenceRate: 3.2,
    msdPrevalence: 30, // Changed from 0.30 to 30 (percentage)
    costPerAbsenceDay: 350,
    costPerClinicalIntervention: 2000
  },
  healthcare: {
    baselineAbsenceRate: 2.1,
    msdPrevalence: 20, // Changed from 0.20 to 20 (percentage)
    costPerAbsenceDay: 250,
    costPerClinicalIntervention: 1200
  },
  office: {
    baselineAbsenceRate: 1.8,
    msdPrevalence: 15, // Changed from 0.15 to 15 (percentage)
    costPerAbsenceDay: 200,
    costPerClinicalIntervention: 800
  }
}

const COMPANY_SIZE_PRESETS = {
  small: {
    reductionInMsdAbsence: 20, // Changed from 0.20 to 20 (percentage)
    reductionInClinicalInterventions: 30, // Changed from 0.30 to 30 (percentage)
    adminOnCostPercentage: 20 // Changed from 0.20 to 20 (percentage)
  },
  medium: {
    reductionInMsdAbsence: 25, // Changed from 0.25 to 25 (percentage)
    reductionInClinicalInterventions: 35, // Changed from 0.35 to 35 (percentage)
    adminOnCostPercentage: 25 // Changed from 0.25 to 25 (percentage)
  },
  large: {
    reductionInMsdAbsence: 30, // Changed from 0.30 to 30 (percentage)
    reductionInClinicalInterventions: 40, // Changed from 0.40 to 40 (percentage)
    adminOnCostPercentage: 30 // Changed from 0.30 to 30 (percentage)
  }
}

const CALCULATION_APPROACH_PRESETS = {
  conservative: {
    workDaysPerYear: 220,
    absenceDueToMsdPercentage: 15, // Changed from 0.15 to 15 (percentage)
    msdNeedingInterventionPercentage: 20 // Changed from 0.20 to 20 (percentage)
  },
  moderate: {
    workDaysPerYear: 230,
    absenceDueToMsdPercentage: 20, // Changed from 0.20 to 20 (percentage)
    msdNeedingInterventionPercentage: 25 // Changed from 0.25 to 25 (percentage)
  },
  optimistic: {
    workDaysPerYear: 240,
    absenceDueToMsdPercentage: 25, // Changed from 0.25 to 25 (percentage)
    msdNeedingInterventionPercentage: 30 // Changed from 0.30 to 30 (percentage)
  }
}
