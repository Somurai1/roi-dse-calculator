import { calculateROI } from './roi'
import { TEST_SCENARIOS, getRealisticInputs } from './test-data'
import { ROICalculationInputs } from './schema'

/**
 * Test runner for ROI calculator validation
 * Runs all test scenarios and validates results against expected outcomes
 */

export interface TestResult {
  scenarioName: string
  passed: boolean
  expected: any
  actual: any
  difference: string
  tolerance: number
  details: {
    adminSaving: { expected: number; actual: number; difference: number }
    absenceSaving: { expected: number; actual: number; difference: number }
    interventionSaving: { expected: number; actual: number; difference: number }
    totalAnnualSavings: { expected: number; actual: number; difference: number }
    roiPercentage: { expected: number; actual: number; difference: number }
    paybackMonths: { expected: number; actual: number; difference: number }
  }
}

export interface TestSummary {
  totalTests: number
  passed: number
  failed: number
  successRate: number
  results: TestResult[]
  recommendations: string[]
}

/**
 * Run all test scenarios and validate results
 */
export function runAllTests(): TestSummary {
  const results: TestResult[] = []
  let passed = 0
  let failed = 0

  // Test 1: Validate basic calculation logic
  const basicValidation = validateBasicCalculations()
  results.push(basicValidation)
  if (basicValidation.passed) {
    passed++
  } else {
    failed++
  }

  // Test 2: Validate all test scenarios
  for (const scenario of TEST_SCENARIOS) {
    const result = validateScenario(scenario)
    results.push(result)
    if (result.passed) {
      passed++
    } else {
      failed++
    }
  }

  // Test 3: Validate edge cases
  const edgeCaseValidation = validateEdgeCases()
  results.push(edgeCaseValidation)
  if (edgeCaseValidation.passed) {
    passed++
  } else {
    failed++
  }

  // Test 4: Validate industry benchmarks
  const benchmarkValidation = validateIndustryBenchmarks()
  results.push(benchmarkValidation)
  if (benchmarkValidation.passed) {
    passed++
  } else {
    failed++
  }

  const totalTests = results.length
  const successRate = (passed / totalTests) * 100

  // Generate recommendations based on test results
  const recommendations = generateRecommendations(results, successRate)

  return {
    totalTests,
    passed,
    failed,
    successRate,
    results,
    recommendations
  }
}

/**
 * Validate basic calculation logic with known inputs
 */
function validateBasicCalculations(): TestResult {
  const inputs: ROICalculationInputs = {
    headcount: 100,
    dseUserPercentage: 60,
    adminSalary: 50000,
    adminTimeNow: 2,
    adminTimeWithSoftware: 1,
    softwarePricePerUser: 15,
    baselineAbsenceRate: 5,
    costPerAbsenceDay: 300,
    msdPrevalence: 25,
    reductionInMsdAbsence: 15,
    reductionInClinicalInterventions: 25,
    costPerClinicalIntervention: 600,
    workDaysPerYear: 220,
    absenceDueToMsdPercentage: 30,
    msdNeedingInterventionPercentage: 20,
    adminOnCostPercentage: 30,
    currency: 'EUR'
  }

  const result = calculateROI(inputs, 'expected')
  
  // Expected calculations (manual verification)
  const onCostMultiplier = 1 + (30 / 100) // 1.3
  const adminCostNow = (50000 * onCostMultiplier) * (2 / 5) // 26,000
  const adminCostWithSoftware = (50000 * onCostMultiplier) * (1 / 5) // 13,000
  const expectedAdminSaving = adminCostNow - adminCostWithSoftware // 13,000
  
  const expectedAbsenceSaving = 60 * (5 / 100) * 220 * (30 / 100) * 300 * (15 / 100) // 891
  
  const expectedInterventionSaving = 60 * (25 / 100) * (25 / 100) * 600 * (20 / 100) // 450
  
  const expectedTotalSavings = expectedAdminSaving + expectedAbsenceSaving + expectedInterventionSaving
  const expectedROI = ((expectedTotalSavings - 1500) / 1500) * 100

  const tolerance = 5 // 5% tolerance for rounding differences
  
  const passed = Math.abs(result.adminSaving - expectedAdminSaving) / expectedAdminSaving * 100 < tolerance &&
                 Math.abs(result.absenceSaving - expectedAbsenceSaving) / expectedAbsenceSaving * 100 < tolerance &&
                 Math.abs(result.interventionSaving - expectedInterventionSaving) / expectedInterventionSaving * 100 < tolerance

  return {
    scenarioName: "Basic Calculation Validation",
    passed,
    expected: {
      adminSaving: expectedAdminSaving,
      absenceSaving: expectedAbsenceSaving,
      interventionSaving: expectedInterventionSaving,
      totalAnnualSavings: expectedTotalSavings,
      roiPercentage: expectedROI
    },
    actual: {
      adminSaving: result.adminSaving,
      absenceSaving: result.absenceSaving,
      interventionSaving: result.interventionSaving,
      totalAnnualSavings: result.totalAnnualSavings,
      roiPercentage: result.roiPercentage
    },
    difference: passed ? "Within tolerance" : "Outside tolerance",
    tolerance,
    details: {
      adminSaving: { expected: expectedAdminSaving, actual: result.adminSaving, difference: result.adminSaving - expectedAdminSaving },
      absenceSaving: { expected: expectedAbsenceSaving, actual: result.absenceSaving, difference: result.absenceSaving - expectedAbsenceSaving },
      interventionSaving: { expected: expectedInterventionSaving, actual: result.interventionSaving, difference: result.interventionSaving - expectedInterventionSaving },
      totalAnnualSavings: { expected: expectedTotalSavings, actual: result.totalAnnualSavings, difference: result.totalAnnualSavings - expectedTotalSavings },
      roiPercentage: { expected: expectedROI, actual: result.roiPercentage, difference: result.roiPercentage - expectedROI },
      paybackMonths: { expected: 0, actual: result.paybackMonths, difference: result.paybackMonths }
    }
  }
}

/**
 * Validate a specific test scenario
 */
function validateScenario(scenario: any): TestResult {
  const result = calculateROI(scenario.inputs, 'expected')
  
  // Extract expected ranges from scenario
  const expectedROI = scenario.expectedResults.roiRange
  const expectedPayback = scenario.expectedResults.paybackMonths
  const expectedSavings = scenario.expectedResults.annualSavings
  
  // Parse expected ranges (e.g., "800-1200%" -> min: 800, max: 1200)
  const roiRange = parseRange(expectedROI)
  const paybackRange = parseRange(expectedPayback)
  const savingsRange = parseRange(expectedSavings)
  
  // Check if actual results fall within expected ranges
  const roiInRange = result.roiPercentage >= roiRange.min && result.roiPercentage <= roiRange.max
  const paybackInRange = result.paybackMonths >= paybackRange.min && result.paybackMonths <= paybackRange.max
  const savingsInRange = result.totalAnnualSavings >= savingsRange.min && result.totalAnnualSavings <= savingsRange.max
  
  const passed = roiInRange && paybackInRange && savingsInRange
  
  return {
    scenarioName: scenario.name,
    passed,
    expected: {
      roiRange: expectedROI,
      paybackMonths: expectedPayback,
      annualSavings: expectedSavings
    },
    actual: {
      roiPercentage: result.roiPercentage,
      paybackMonths: result.paybackMonths,
      totalAnnualSavings: result.totalAnnualSavings
    },
    difference: passed ? "Within expected ranges" : "Outside expected ranges",
    tolerance: 0, // Not applicable for range validation
    details: {
      adminSaving: { expected: 0, actual: result.adminSaving, difference: 0 },
      absenceSaving: { expected: 0, actual: result.absenceSaving, difference: 0 },
      interventionSaving: { expected: 0, actual: result.interventionSaving, difference: 0 },
      totalAnnualSavings: { expected: savingsRange.min, actual: result.totalAnnualSavings, difference: 0 },
      roiPercentage: { expected: roiRange.min, actual: result.roiPercentage, difference: 0 },
      paybackMonths: { expected: paybackRange.min, actual: result.paybackMonths, difference: 0 }
    }
  }
}

/**
 * Validate edge cases
 */
function validateEdgeCases(): TestResult {
  // Test with zero headcount
  const zeroHeadcountInputs: ROICalculationInputs = {
    ...TEST_SCENARIOS[0].inputs,
    headcount: 0
  }
  
  const zeroResult = calculateROI(zeroHeadcountInputs, 'expected')
  
  // Test with maximum values
  const maxInputs: ROICalculationInputs = {
    ...TEST_SCENARIOS[0].inputs,
    headcount: 100000,
    dseUserPercentage: 100,
    adminSalary: 1000000
  }
  
  const maxResult = calculateROI(maxInputs, 'expected')
  
  const passed = zeroResult.isValid && 
                 zeroResult.totalAnnualSavings === 0 &&
                 maxResult.isValid &&
                 maxResult.totalAnnualSavings > 0
  
  return {
    scenarioName: "Edge Case Validation",
    passed,
    expected: "Valid results for edge cases",
    actual: `Zero headcount: ${zeroResult.isValid}, Max values: ${maxResult.isValid}`,
    difference: passed ? "All edge cases handled correctly" : "Edge case handling issues",
    tolerance: 0,
    details: {
      adminSaving: { expected: 0, actual: 0, difference: 0 },
      absenceSaving: { expected: 0, actual: 0, difference: 0 },
      interventionSaving: { expected: 0, actual: 0, difference: 0 },
      totalAnnualSavings: { expected: 0, actual: 0, difference: 0 },
      roiPercentage: { expected: 0, actual: 0, difference: 0 },
      paybackMonths: { expected: 0, actual: 0, difference: 0 }
    }
  }
}

/**
 * Validate industry benchmarks
 */
function validateIndustryBenchmarks(): TestResult {
  // Test that realistic inputs produce reasonable results
  const techCompany = getRealisticInputs('large', 'technology', 1000)
  const manufacturingCompany = getRealisticInputs('medium', 'manufacturing', 500)
  
  const techResult = calculateROI(techCompany, 'expected')
  const manufacturingResult = calculateROI(manufacturingCompany, 'expected')
  
  // Tech companies should have lower ROI (already good ergonomics)
  // Manufacturing should have higher ROI (more improvement potential)
  const techROIReasonable = techResult.roiPercentage >= 100 && techResult.roiPercentage <= 500
  const manufacturingROIReasonable = manufacturingResult.roiPercentage >= 300 && manufacturingResult.roiPercentage <= 1000
  
  const passed = techROIReasonable && manufacturingROIReasonable
  
  return {
    scenarioName: "Industry Benchmark Validation",
    passed,
    expected: "ROI within reasonable industry ranges",
    actual: `Tech: ${techResult.roiPercentage.toFixed(0)}%, Manufacturing: ${manufacturingResult.roiPercentage.toFixed(0)}%`,
    difference: passed ? "Within industry ranges" : "Outside industry ranges",
    tolerance: 0,
    details: {
      adminSaving: { expected: 0, actual: 0, difference: 0 },
      absenceSaving: { expected: 0, actual: 0, difference: 0 },
      interventionSaving: { expected: 0, actual: 0, difference: 0 },
      totalAnnualSavings: { expected: 0, actual: 0, difference: 0 },
      roiPercentage: { expected: 0, actual: 0, difference: 0 },
      paybackMonths: { expected: 0, actual: 0, difference: 0 }
    }
  }
}

/**
 * Parse range strings like "800-1200%" or "2-4 months"
 */
function parseRange(rangeStr: string): { min: number; max: number } {
  const numbers = rangeStr.match(/\d+/g)
  if (numbers && numbers.length >= 2) {
    return {
      min: parseInt(numbers[0]),
      max: parseInt(numbers[1])
    }
  }
  return { min: 0, max: 0 }
}

/**
 * Generate recommendations based on test results
 */
function generateRecommendations(results: TestResult[], successRate: number): string[] {
  const recommendations: string[] = []
  
  if (successRate < 80) {
    recommendations.push("⚠️  Multiple test failures detected. Review calculation logic and input validation.")
  }
  
  if (successRate < 95) {
    recommendations.push("🔍 Some tests failed. Check for edge cases and boundary conditions.")
  }
  
  if (successRate >= 95) {
    recommendations.push("✅ Calculator is working well! Consider adding more edge case tests.")
  }
  
  // Specific recommendations based on failed tests
  const failedTests = results.filter(r => !r.passed)
  failedTests.forEach(test => {
    if (test.scenarioName.includes("Basic Calculation")) {
      recommendations.push("🧮 Basic calculation logic needs review. Check mathematical formulas.")
    }
    if (test.scenarioName.includes("Edge Case")) {
      recommendations.push("⚠️  Edge case handling needs improvement. Test boundary conditions.")
    }
    if (test.scenarioName.includes("Industry Benchmark")) {
      recommendations.push("📊 Industry benchmark validation failed. Review realistic input ranges.")
    }
  })
  
  return recommendations
}

/**
 * Run a quick validation and return results
 */
export function quickValidation(): string {
  const summary = runAllTests()
  
  let output = `🧪 ROI Calculator Test Results\n`
  output += `=============================\n\n`
  output += `📊 Summary:\n`
  output += `   Total Tests: ${summary.totalTests}\n`
  output += `   Passed: ${summary.passed} ✅\n`
  output += `   Failed: ${summary.failed} ❌\n`
  output += `   Success Rate: ${summary.successRate.toFixed(1)}%\n\n`
  
  if (summary.recommendations.length > 0) {
    output += `💡 Recommendations:\n`
    summary.recommendations.forEach(rec => {
      output += `   • ${rec}\n`
    })
    output += `\n`
  }
  
  if (summary.failed > 0) {
    output += `❌ Failed Tests:\n`
    summary.results.filter(r => !r.passed).forEach(result => {
      output += `   • ${result.scenarioName}: ${result.difference}\n`
    })
  }
  
  return output
}

/**
 * Export test scenarios for easy access
 */
export { TEST_SCENARIOS, getRealisticInputs }
