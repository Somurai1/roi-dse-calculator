import { describe, it, expect } from 'vitest'
import { 
  calculateROI, 
  calculateAllScenarios, 
  DEFAULT_INPUTS, 
  formatCurrency, 
  formatPercentage,
  validateInputs 
} from './roi'

describe('ROI Calculations', () => {
  describe('calculateROI', () => {
    it('should calculate expected scenario correctly with default inputs', () => {
      const result = calculateROI(DEFAULT_INPUTS, 'expected')
      
      // Test key calculations
      expect(result.adminCostNow).toBeGreaterThan(0)
      expect(result.adminCostWithSoftware).toBeGreaterThan(0)
      expect(result.adminSaving).toBeGreaterThan(0)
      expect(result.licenceCost).toBeGreaterThan(0)
      expect(result.totalAnnualSavings).toBeGreaterThan(0)
      expect(result.netBenefit).toBeGreaterThan(0)
      expect(result.roiPercentage).toBeGreaterThan(0)
      expect(result.paybackMonths).toBeGreaterThan(0)
      expect(result.breakevenUsers).toBeGreaterThan(0)
    })

    it('should apply conservative scenario multipliers correctly', () => {
      const expected = calculateROI(DEFAULT_INPUTS, 'expected')
      const conservative = calculateROI(DEFAULT_INPUTS, 'conservative')
      
      // Conservative should have higher admin time (adds 0.5 days)
      expect(conservative.adminCostWithSoftware).toBeGreaterThan(expected.adminCostWithSoftware)
      
      // Conservative should have lower savings (50% of reductions)
      expect(conservative.absenceSaving).toBeLessThan(expected.absenceSaving)
      expect(conservative.interventionSaving).toBeLessThan(expected.interventionSaving)
    })

    it('should apply stretch scenario multipliers correctly', () => {
      const expected = calculateROI(DEFAULT_INPUTS, 'expected')
      const stretch = calculateROI(DEFAULT_INPUTS, 'stretch')
      
      // Stretch should have higher savings (150% of reductions)
      expect(stretch.absenceSaving).toBeGreaterThan(expected.absenceSaving)
      expect(stretch.interventionSaving).toBeGreaterThan(expected.interventionSaving)
    })

    it('should handle edge case with zero headcount', () => {
      const zeroInputs = { ...DEFAULT_INPUTS, headcount: 0 }
      const result = calculateROI(zeroInputs, 'expected')
      
      expect(result.licenceCost).toBe(0)
      expect(result.totalAnnualSavings).toBe(0)
      expect(result.netBenefit).toBe(0)
      expect(result.roiPercentage).toBe(0)
    })

    it('should handle edge case with zero DSE users', () => {
      const zeroInputs = { ...DEFAULT_INPUTS, dseUserPercentage: 0 }
      const result = calculateROI(zeroInputs, 'expected')
      
      expect(result.licenceCost).toBe(0)
      expect(result.msdAbsenceBaselineDays).toBe(0)
      expect(result.absenceSaving).toBe(0)
      expect(result.interventionSaving).toBe(0)
    })
  })

  describe('calculateAllScenarios', () => {
    it('should return all three scenarios', () => {
      const scenarios = calculateAllScenarios(DEFAULT_INPUTS)
      
      expect(scenarios).toHaveProperty('conservative')
      expect(scenarios).toHaveProperty('expected')
      expect(scenarios).toHaveProperty('stretch')
    })

    it('should maintain consistent structure across scenarios', () => {
      const scenarios = calculateAllScenarios(DEFAULT_INPUTS)
      
      const keys = Object.keys(scenarios.expected)
      expect(Object.keys(scenarios.conservative)).toEqual(keys)
      expect(Object.keys(scenarios.stretch)).toEqual(keys)
    })

    it('should show progressive improvement from conservative to stretch', () => {
      const scenarios = calculateAllScenarios(DEFAULT_INPUTS)
      
      // ROI should improve from conservative to expected to stretch
      expect(scenarios.conservative.roiPercentage).toBeLessThanOrEqual(scenarios.expected.roiPercentage)
      expect(scenarios.expected.roiPercentage).toBeLessThanOrEqual(scenarios.stretch.roiPercentage)
      
      // Net benefit should improve
      expect(scenarios.conservative.netBenefit).toBeLessThanOrEqual(scenarios.expected.netBenefit)
      expect(scenarios.expected.netBenefit).toBeLessThanOrEqual(scenarios.stretch.netBenefit)
    })
  })

  describe('formatCurrency', () => {
    it('should format EUR correctly', () => {
      expect(formatCurrency(1234.56, 'EUR')).toContain('€')
      expect(formatCurrency(1234.56, 'EUR')).toContain('1.235')
    })

    it('should format GBP correctly', () => {
      expect(formatCurrency(1234.56, 'GBP')).toContain('£')
    })

    it('should format USD correctly', () => {
      expect(formatCurrency(1234.56, 'USD')).toContain('$')
    })

    it('should handle zero values', () => {
      expect(formatCurrency(0, 'EUR')).toContain('€0')
    })

    it('should handle negative values', () => {
      expect(formatCurrency(-1234.56, 'EUR')).toContain('-€')
    })
  })

  describe('formatPercentage', () => {
    it('should format percentages correctly', () => {
      expect(formatPercentage(12.345)).toBe('12.3%')
      expect(formatPercentage(12.345, 2)).toBe('12.35%')
    })

    it('should handle zero values', () => {
      expect(formatPercentage(0)).toBe('0.0%')
    })

    it('should handle negative values', () => {
      expect(formatPercentage(-12.345)).toBe('-12.3%')
    })
  })

  describe('validateInputs', () => {
    it('should pass validation for valid inputs', () => {
      const result = validateInputs(DEFAULT_INPUTS)
      expect(result.success).toBe(true)
    })

    it('should catch negative headcount', () => {
      const invalidInputs = { ...DEFAULT_INPUTS, headcount: -1 }
      const result = validateInputs(invalidInputs)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.errors).toContain('headcount: Must be greater than 0')
      }
    })

    it('should catch invalid DSE user percentage', () => {
      const invalidInputs = { ...DEFAULT_INPUTS, dseUserPercentage: 150 }
      const result = validateInputs(invalidInputs)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.errors).toContain('dseUserPercentage: Cannot exceed 100%')
      }
    })

    it('should catch invalid admin time', () => {
      const invalidInputs = { ...DEFAULT_INPUTS, adminTimeNow: 10 }
      const result = validateInputs(invalidInputs)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.errors).toContain('adminTimeNow: Cannot exceed 7 days')
      }
    })

    it('should catch multiple validation errors', () => {
      const invalidInputs = { 
        ...DEFAULT_INPUTS, 
        headcount: -1, 
        dseUserPercentage: 150,
        adminSalary: 0
      }
      const result = validateInputs(invalidInputs)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.errors.length).toBeGreaterThan(1)
        expect(result.errors).toContain('headcount: Must be greater than 0')
        expect(result.errors).toContain('dseUserPercentage: Cannot exceed 100%')
        expect(result.errors).toContain('adminSalary: Must be greater than 0')
      }
    })
  })

  describe('Default inputs validation', () => {
    it('should have sensible default values', () => {
      expect(DEFAULT_INPUTS.headcount).toBe(800)
      expect(DEFAULT_INPUTS.dseUserPercentage).toBe(50)
      expect(DEFAULT_INPUTS.adminSalary).toBe(60000)
      expect(DEFAULT_INPUTS.softwarePricePerUser).toBe(70)
      expect(DEFAULT_INPUTS.currency).toBe('EUR')
    })

    it('should produce positive ROI with default values', () => {
      const result = calculateROI(DEFAULT_INPUTS, 'expected')
      expect(result.roiPercentage).toBeGreaterThan(300) // Should be >300% as specified
      expect(result.paybackMonths).toBeLessThan(12) // Should be <12 months
    })
  })

  describe('Mathematical consistency', () => {
    it('should maintain mathematical relationships', () => {
      const result = calculateROI(DEFAULT_INPUTS, 'expected')
      
      // Admin saving = admin cost now - admin cost with software
      expect(result.adminSaving).toBeCloseTo(
        result.adminCostNow - result.adminCostWithSoftware, 
        2
      )
      
      // Total savings = sum of individual savings
      expect(result.totalAnnualSavings).toBeCloseTo(
        result.adminSaving + result.absenceSaving + result.interventionSaving,
        2
      )
      
      // Net benefit = total savings - licence cost
      expect(result.netBenefit).toBeCloseTo(
        result.totalAnnualSavings - result.licenceCost,
        2
      )
      
      // ROI = net benefit / licence cost * 100
      if (result.licenceCost > 0) {
        expect(result.roiPercentage).toBeCloseTo(
          (result.netBenefit / result.licenceCost) * 100,
          1
        )
      }
    })
  })
})
