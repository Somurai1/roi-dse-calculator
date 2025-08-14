/**
 * Formulas and validation rules for ROI calculator
 * Contains calculation constants and validation logic
 */

export const CALCULATOR_VERSION = {
  version: '1.0.0',
  effectiveDate: '2024-01-01',
  description: 'DSE ROI Calculator with industry benchmarks'
}

/**
 * Validation rules for input fields
 * Used for real-time validation and input constraints
 */
export const VALIDATION_RULES = {
  headcount: {
    min: 1,
    max: 100000,
    step: 1,
    unit: 'employees',
    description: 'Total number of employees'
  },
  dseUserPercentage: {
    min: 0,
    max: 100,
    step: 0.1,
    unit: '%',
    description: 'Percentage of employees using display screen equipment'
  },
  adminSalary: {
    min: 0,
    max: 1000000,
    step: 1000,
    unit: '€/year',
    description: 'Annual salary of administrative staff'
  },
  adminTimeNow: {
    min: 0,
    max: 7,
    step: 0.5,
    unit: 'days/week',
    description: 'Current time spent on DSE administration per week'
  },
  adminTimeWithSoftware: {
    min: 0,
    max: 7,
    step: 0.5,
    unit: 'days/week',
    description: 'Time spent on DSE administration with software per week'
  },
  softwarePricePerUser: {
    min: 0,
    max: 10000,
    step: 10,
    unit: '€/user/year',
    description: 'Software cost per user per year'
  },
  baselineAbsenceRate: {
    min: 0,
    max: 100,
    step: 0.1,
    unit: '%',
    description: 'Baseline absence rate across the organization'
  },
  costPerAbsenceDay: {
    min: 0,
    max: 10000,
    step: 50,
    unit: '€/day',
    description: 'Cost per day of employee absence'
  },
  msdPrevalence: {
    min: 0,
    max: 100,
    step: 0.1,
    unit: '%',
    description: 'Prevalence of musculoskeletal disorders in the workforce'
  },
  reductionInMsdAbsence: {
    min: 0,
    max: 100,
    step: 0.1,
    unit: '%',
    description: 'Expected reduction in MSD-related absence with software'
  },
  reductionInClinicalInterventions: {
    min: 0,
    max: 100,
    step: 0.1,
    unit: '%',
    description: 'Expected reduction in clinical interventions with software'
  },
  costPerClinicalIntervention: {
    min: 0,
    max: 100000,
    step: 100,
    unit: '€',
    description: 'Cost per clinical intervention for MSD treatment'
  },
  workDaysPerYear: {
    min: 200,
    max: 260,
    step: 1,
    unit: 'days',
    description: 'Number of working days per year'
  },
  absenceDueToMsdPercentage: {
    min: 0,
    max: 100,
    step: 0.1,
    unit: '%',
    description: 'Percentage of absence due to MSD issues'
  },
  msdNeedingInterventionPercentage: {
    min: 0,
    max: 100,
    step: 0.1,
    unit: '%',
    description: 'Percentage of MSD cases needing clinical intervention'
  },
  adminOnCostPercentage: {
    min: 0,
    max: 100,
    step: 0.1,
    unit: '%',
    description: 'Additional on-cost percentage for admin staff (benefits, etc.)'
  }
}

/**
 * Calculation constants used in ROI formulas
 */
export const CALCULATION_CONSTANTS = {
  // Time constants
  WORK_WEEKS_PER_YEAR: 52,
  WORK_DAYS_PER_WEEK: 5,
  HOURS_PER_DAY: 8,
  
  // Cost multipliers
  DEFAULT_ADMIN_ON_COST: 0.30, // 30% additional costs
  DEFAULT_ABSENCE_COST_MULTIPLIER: 1.5, // 1.5x salary for absence costs
  
  // ROI thresholds
  MIN_ACCEPTABLE_ROI: 100, // 100% minimum ROI
  TARGET_PAYBACK_MONTHS: 12, // 12 months target payback
  
  // Scenario multipliers
  CONSERVATIVE_MULTIPLIER: 0.5, // 50% of expected benefits
  STRETCH_MULTIPLIER: 1.5, // 150% of expected benefits
}

/**
 * Industry benchmark ranges for validation
 */
export const INDUSTRY_BENCHMARKS = {
  // Absence rates by industry (%)
  absenceRates: {
    technology: { min: 2, max: 4, average: 3 },
    manufacturing: { min: 5, max: 8, average: 6.5 },
    healthcare: { min: 4, max: 7, average: 5.5 },
    finance: { min: 3, max: 5, average: 4 },
    retail: { min: 6, max: 10, average: 8 }
  },
  
  // MSD prevalence by industry (%)
  msdPrevalence: {
    technology: { min: 12, max: 20, average: 16 },
    manufacturing: { min: 25, max: 40, average: 32.5 },
    healthcare: { min: 20, max: 35, average: 27.5 },
    finance: { min: 15, max: 25, average: 20 },
    retail: { min: 18, max: 30, average: 24 }
  },
  
  // Admin salary ranges by company size (€/year)
  adminSalary: {
    small: { min: 35000, max: 55000, average: 45000 },
    medium: { min: 50000, max: 80000, average: 65000 },
    large: { min: 70000, max: 120000, average: 95000 }
  }
}

/**
 * Validation functions for business logic
 */
export function validateBusinessLogic(inputs: any): string[] {
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

/**
 * Get field constraints for a specific field
 */
export function getFieldConstraints(field: keyof typeof VALIDATION_RULES) {
  return VALIDATION_RULES[field] || {}
}

/**
 * Validate a single field value
 */
export function validateField(field: keyof typeof VALIDATION_RULES, value: string | number): { valid: boolean; message: string } {
  const rules = VALIDATION_RULES[field]
  if (!rules) return { valid: true, message: '' }
  
  const numValue = typeof value === 'string' ? parseFloat(value) : value
  
  if (isNaN(numValue)) {
    return { valid: false, message: `${field} must be a valid number` }
  }
  
  if (numValue < rules.min) {
    return { valid: false, message: `${field} must be at least ${rules.min} ${rules.unit}` }
  }
  
  if (numValue > rules.max) {
    return { valid: false, message: `${field} cannot exceed ${rules.max} ${rules.unit}` }
  }
  
  return { valid: true, message: '' }
}
