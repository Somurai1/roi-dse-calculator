import { z } from 'zod'

// Base schema for all numeric inputs with proper validation
const percentage = z.number().min(0, "Must be 0% or higher").max(100, "Cannot exceed 100%")
const daysPerWeek = z.number().min(0, "Must be 0 or higher").max(7, "Cannot exceed 7 days")
const currency = z.number().gt(0, "Must be greater than 0")
const headcount = z.number().int("Must be whole number").min(1, "Must be positive").max(100000, "Maximum 100,000 employees")

// Currency enum
export const CurrencyEnum = z.enum(['EUR', 'GBP', 'USD'])
export type Currency = z.infer<typeof CurrencyEnum>

// Main input schema with comprehensive validation
export const ROICalculationSchema = z.object({
  // Basic Parameters
  headcount: headcount,
  dseUserPercentage: percentage,
  adminSalary: currency,
  adminTimeNow: daysPerWeek,
  adminTimeWithSoftware: daysPerWeek,
  softwarePricePerUser: currency,
  
  // Absence & MSD Parameters
  baselineAbsenceRate: percentage,
  costPerAbsenceDay: currency,
  msdPrevalence: percentage,
  reductionInMsdAbsence: percentage,
  reductionInClinicalInterventions: percentage,
  costPerClinicalIntervention: currency,
  
  // Advanced Parameters
  workDaysPerYear: z.number().int().min(200, "Minimum 200 work days").max(260, "Maximum 260 work days"),
  absenceDueToMsdPercentage: percentage,
  msdNeedingInterventionPercentage: percentage,
  adminOnCostPercentage: percentage,
  
  // Currency
  currency: CurrencyEnum
})

// Type inference
export type ROICalculationInputs = z.infer<typeof ROICalculationSchema>

// Validation function that returns detailed errors
export function validateInputs(inputs: unknown): { success: true; data: ROICalculationInputs } | { success: false; errors: string[] } {
  const result = ROICalculationSchema.safeParse(inputs)
  
  if (result.success) {
    return { success: true, data: result.data }
  }
  
  // Format validation errors for user display
  const errors = result.error.errors.map(err => {
    const field = err.path.join('.')
    return `${field}: ${err.message}`
  })
  
  return { success: false, errors }
}

// Helper function to get field constraints for UI
export function getFieldConstraints() {
  return {
    headcount: { min: 1, max: 100000, step: 1, unit: 'employees' },
    dseUserPercentage: { min: 0, max: 100, step: 0.1, unit: '%' },
    adminSalary: { min: 0, max: 1000000, step: 1000, unit: '€' },
    adminTimeNow: { min: 0, max: 7, step: 0.5, unit: 'days/week' },
    adminTimeWithSoftware: { min: 0, max: 7, step: 0.5, unit: 'days/week' },
    softwarePricePerUser: { min: 0, max: 10000, step: 10, unit: '€/user/year' },
    baselineAbsenceRate: { min: 0, max: 100, step: 0.1, unit: '%' },
    costPerAbsenceDay: { min: 0, max: 10000, step: 50, unit: '€/day' },
    msdPrevalence: { min: 0, max: 100, step: 0.1, unit: '%' },
    reductionInMsdAbsence: { min: 0, max: 100, step: 0.1, unit: '%' },
    reductionInClinicalInterventions: { min: 0, max: 100, step: 0.1, unit: '%' },
    costPerClinicalIntervention: { min: 0, max: 100000, step: 100, unit: '€' },
    workDaysPerYear: { min: 200, max: 260, step: 1, unit: 'days' },
    absenceDueToMsdPercentage: { min: 0, max: 100, step: 0.1, unit: '%' },
    msdNeedingInterventionPercentage: { min: 0, max: 100, step: 0.1, unit: '%' },
    adminOnCostPercentage: { min: 0, max: 100, step: 0.1, unit: '%' }
  }
}

// Business logic validation
export function validateBusinessLogic(inputs: ROICalculationInputs): string[] {
  const errors: string[] = []
  
  // Admin time with software should be less than current admin time
  if (inputs.adminTimeWithSoftware >= inputs.adminTimeNow) {
    errors.push("Admin time with software must be less than current admin time")
  }
  
  // DSE users cannot exceed total headcount
  if (inputs.dseUserPercentage > 100) {
    errors.push("DSE user percentage cannot exceed 100%")
  }
  
  // Work days per year should be reasonable
  if (inputs.workDaysPerYear < 200 || inputs.workDaysPerYear > 260) {
    errors.push("Work days per year should be between 200-260")
  }
  
  return errors
}
