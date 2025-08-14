import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { 
  ScenarioResults, 
  ROICalculationInputs,
  formatCurrency,
  formatPercentage,
  getCurrentPricingTier
} from '@/lib/roi'
import { CALCULATOR_VERSION } from '@/lib/formulas'
import { PRICING_METADATA } from '@/lib/pricing'

interface KPIDisplayProps {
  scenarios: ScenarioResults | null
  activeScenario: 'conservative' | 'expected' | 'stretch'
  onScenarioChange: (scenario: 'conservative' | 'expected' | 'stretch') => void
  inputs: ROICalculationInputs
}

export function KPIDisplay({ scenarios, activeScenario, onScenarioChange, inputs }: KPIDisplayProps) {
  if (!scenarios) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            Enter your details to see ROI calculations
          </div>
        </CardContent>
      </Card>
    )
  }

  const active = scenarios[activeScenario]
  const isPositiveROI = active.roiPercentage > 0
  const isGoodPayback = active.paybackMonths <= 12

  return (
    <Card>
      <CardContent className="p-6">
        {/* Version and Pricing Info */}
        <div className="mb-4 text-xs text-muted-foreground border-b pb-2">
          <div className="flex justify-between items-center">
            <span>Calculator v{CALCULATOR_VERSION.version} | Effective: {CALCULATOR_VERSION.effectiveDate}</span>
            <span>Pricing v{PRICING_METADATA.version} | Effective: {PRICING_METADATA.effectiveDate}</span>
          </div>
        </div>

        {/* Scenario Toggle */}
        <div className="mb-6">
          <Tabs value={activeScenario} onValueChange={(value) => onScenarioChange(value as any)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="conservative">Conservative</TabsTrigger>
              <TabsTrigger value="expected">Expected</TabsTrigger>
              <TabsTrigger value="stretch">Stretch</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Main KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* ROI */}
          <motion.div
            key={`roi-${activeScenario}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="text-center"
          >
            <div className="text-3xl font-bold text-foreground mb-2">
              {formatPercentage(active.roiPercentage)}
            </div>
            <div className="text-sm text-muted-foreground mb-2">ROI</div>
            <Badge variant={isPositiveROI ? "default" : "destructive"}>
              {isPositiveROI ? "Positive Return" : "Negative Return"}
            </Badge>
          </motion.div>

          {/* Annual Net Benefit */}
          <motion.div
            key={`net-benefit-${activeScenario}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="text-center"
          >
            <div className="text-3xl font-bold text-foreground mb-2">
              {formatCurrency(active.netBenefit, inputs.currency)}
            </div>
            <div className="text-sm text-muted-foreground mb-2">Annual Net Benefit</div>
            <Badge variant={isPositiveROI ? "default" : "destructive"}>
              {isPositiveROI ? "Net Savings" : "Net Cost"}
            </Badge>
          </motion.div>

          {/* Payback Period */}
          <motion.div
            key={`payback-${activeScenario}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="text-center"
          >
            <div className="text-3xl font-bold text-foreground mb-2">
              {active.paybackMonths.toFixed(1)}
            </div>
            <div className="text-sm text-muted-foreground mb-2">Payback Period (months)</div>
            <Badge variant={isGoodPayback ? "default" : "secondary"}>
              {isGoodPayback ? "Fast Payback" : "Extended Payback"}
            </Badge>
          </motion.div>

          {/* Breakeven Users */}
          <motion.div
            key={`breakeven-${activeScenario}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="text-center"
          >
            <div className="text-3xl font-bold text-foreground mb-2">
              {active.breakevenUsers.toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground mb-2">Breakeven Users</div>
            <Badge variant={active.breakevenUsers <= inputs.headcount ? "default" : "secondary"}>
              {active.breakevenUsers <= inputs.headcount ? "Achievable" : "High Threshold"}
            </Badge>
          </motion.div>
        </div>

        {/* Warning Banner for Edge Cases */}
        {(!isPositiveROI || !isGoodPayback) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg"
          >
            <div className="text-destructive font-medium mb-2">Consider Adjusting Parameters</div>
            <div className="text-sm text-destructive/80">
              {!isPositiveROI && "ROI is negative. Try reducing MSD absence reduction to 5-10% and check DSE user percentage."}
              {!isPositiveROI && !isGoodPayback && " "}
              {!isGoodPayback && "Payback period exceeds 12 months. Consider increasing reduction percentages or reducing admin time."}
            </div>
          </motion.div>
        )}

        {/* Pricing Information */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-medium text-blue-900 mb-3 text-center">💻 Software Pricing</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-700">
                €{active.licenceCost.toLocaleString()}
              </div>
              <div className="text-sm text-blue-600">Annual Licence Cost</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-700">
                €{active.softwareCostPerUser}
              </div>
              <div className="text-sm text-blue-600">Cost per User/Year</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-700">
                {getCurrentPricingTier(inputs.headcount).tierName}
              </div>
              <div className="text-sm text-blue-600">Pricing Tier</div>
            </div>
          </div>
          <div className="mt-3 text-xs text-blue-700 text-center">
            Based on {inputs.headcount} employees • {inputs.dseUserPercentage}% DSE users
          </div>
        </div>

        {/* Savings Breakdown */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-lg font-semibold text-green-700">
              {formatCurrency(active.adminSaving, inputs.currency)}
            </div>
            <div className="text-sm text-green-600">Admin Time Savings</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-lg font-semibold text-blue-700">
              {formatCurrency(active.absenceSaving, inputs.currency)}
            </div>
            <div className="text-sm text-blue-600">Absence Reduction Savings</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-lg font-semibold text-purple-700">
              {formatCurrency(active.interventionSaving, inputs.currency)}
            </div>
            <div className="text-sm text-purple-600">Intervention Savings</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
