import { useState } from 'react'
import { runAllTests, quickValidation, TEST_SCENARIOS, getRealisticInputs } from '../lib/test-runner'
import { calculateROI, calculateAllScenarios } from '../lib/roi'

export default function TestRunner() {
  const [testResults, setTestResults] = useState<string>('')
  const [isRunning, setIsRunning] = useState(false)
  const [selectedScenario, setSelectedScenario] = useState<string>('')
  const [scenarioResults, setScenarioResults] = useState<any>(null)

  const runTests = async () => {
    setIsRunning(true)
    try {
      const results = quickValidation()
      setTestResults(results)
    } catch (error) {
      setTestResults(`Error running tests: ${error}`)
    } finally {
      setIsRunning(false)
    }
  }

  const runDetailedTests = async () => {
    setIsRunning(true)
    try {
      const summary = runAllTests()
      let output = `🧪 Detailed Test Results\n`
      output += `========================\n\n`
      
      output += `📊 Summary:\n`
      output += `   Total Tests: ${summary.totalTests}\n`
      output += `   Passed: ${summary.passed} ✅\n`
      output += `   Failed: ${summary.failed} ❌\n`
      output += `   Success Rate: ${summary.successRate.toFixed(1)}%\n\n`
      
      output += `📋 Test Details:\n`
      summary.results.forEach((result, index) => {
        output += `   ${index + 1}. ${result.scenarioName}\n`
        output += `      Status: ${result.passed ? '✅ PASSED' : '❌ FAILED'}\n`
        output += `      Expected: ${JSON.stringify(result.expected, null, 2)}\n`
        output += `      Actual: ${JSON.stringify(result.actual, null, 2)}\n`
        output += `      Difference: ${result.difference}\n\n`
      })
      
      if (summary.recommendations.length > 0) {
        output += `💡 Recommendations:\n`
        summary.recommendations.forEach(rec => {
          output += `   • ${rec}\n`
        })
      }
      
      setTestResults(output)
    } catch (error) {
      setTestResults(`Error running detailed tests: ${error}`)
    } finally {
      setIsRunning(false)
    }
  }

  const testScenario = (scenarioName: string) => {
    const scenario = TEST_SCENARIOS.find(s => s.name === scenarioName)
    if (!scenario) return

    const results = calculateAllScenarios(scenario.inputs)
    setScenarioResults({
      scenario: scenario,
      results: results
    })
  }

  const testCustomInputs = () => {
    // Test with realistic inputs for different company types
    const companyTypes = ['small', 'medium', 'large'] as const
    const industries = ['technology', 'manufacturing', 'healthcare', 'finance', 'retail'] as const
    
    let output = `🏢 Industry Benchmark Tests\n`
    output += `==========================\n\n`
    
    companyTypes.forEach(companyType => {
      industries.forEach(industry => {
        const inputs = getRealisticInputs(companyType, industry, 500)
        const result = calculateROI(inputs, 'expected')
        
        output += `${companyType.toUpperCase()} ${industry.toUpperCase()} (500 employees):\n`
        output += `   ROI: ${result.roiPercentage.toFixed(0)}%\n`
        output += `   Annual Savings: €${result.totalAnnualSavings.toLocaleString()}\n`
        output += `   Payback: ${result.paybackMonths.toFixed(1)} months\n\n`
      })
    })
    
    setTestResults(output)
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">🧪 ROI Calculator Test Suite</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">Test Controls</h2>
            
            <div className="space-y-3">
              <button
                onClick={runTests}
                disabled={isRunning}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                {isRunning ? 'Running...' : '🚀 Run Quick Tests'}
              </button>
              
              <button
                onClick={runDetailedTests}
                disabled={isRunning}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                {isRunning ? 'Running...' : '🔍 Run Detailed Tests'}
              </button>
              
              <button
                onClick={testCustomInputs}
                disabled={isRunning}
                className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                {isRunning ? 'Running...' : '🏢 Test Industry Benchmarks'}
              </button>
            </div>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">Test Scenarios</h2>
            
            <select
              value={selectedScenario}
              onChange={(e) => setSelectedScenario(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg"
            >
              <option value="">Select a test scenario...</option>
              {TEST_SCENARIOS.map((scenario, index) => (
                <option key={index} value={scenario.name}>
                  {scenario.name}
                </option>
              ))}
            </select>
            
            {selectedScenario && (
              <button
                onClick={() => testScenario(selectedScenario)}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                🧮 Test Selected Scenario
              </button>
            )}
          </div>
        </div>
        
        {scenarioResults && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              📊 Scenario Results: {scenarioResults.scenario.name}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(['conservative', 'expected', 'stretch'] as const).map(scenario => {
                const result = scenarioResults.results[scenario]
                return (
                  <div key={scenario} className="bg-white p-4 rounded-lg border">
                    <h4 className="font-medium text-gray-700 capitalize mb-2">{scenario}</h4>
                    <div className="space-y-1 text-sm">
                      <div>ROI: <span className="font-medium">{result.roiPercentage.toFixed(0)}%</span></div>
                      <div>Savings: <span className="font-medium">€{result.totalAnnualSavings.toLocaleString()}</span></div>
                      <div>Payback: <span className="font-medium">{result.paybackMonths.toFixed(1)} months</span></div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
        
        {testResults && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">📋 Test Results</h3>
            <pre className="whitespace-pre-wrap text-sm text-gray-700 bg-white p-4 rounded-lg border overflow-x-auto">
              {testResults}
            </pre>
          </div>
        )}
      </div>
      
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">📚 Test Data Sources</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-gray-700 mb-2">Industry Benchmarks</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• OSHA injury cost data</li>
              <li>• BLS productivity metrics</li>
              <li>• Ergonomic intervention studies</li>
              <li>• Irish/EU DSE regulations</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-700 mb-2">Test Scenarios</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Small company (100 employees)</li>
              <li>• Medium company (500 employees)</li>
              <li>• Large company (1000 employees)</li>
              <li>• Manufacturing (300 employees)</li>
              <li>• Tech company (2000 employees)</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-medium text-blue-800 mb-2">💡 How to Use</h3>
          <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
            <li>Run the quick tests to get a basic validation</li>
            <li>Use detailed tests for comprehensive analysis</li>
            <li>Test specific scenarios to validate edge cases</li>
            <li>Compare results against industry benchmarks</li>
            <li>Review failed tests and recommendations</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
