/**
 * Software pricing configuration for ROI calculator
 * Defines tiered pricing based on company size
 */

export const PRICING_METADATA = {
  version: '2.0.0',
  effectiveDate: '2024-01-01',
  description: 'Tiered pricing structure for DSE software',
  currency: 'EUR',
  billingCycle: 'annual'
}

export interface PricingTier {
  headcount: number
  annualPrice: number
  perUser: number
  description: string
}

export interface SoftwareCost {
  annualPrice: number
  perUser: number
  tier: string
}

// Tiered pricing structure
export const SOFTWARE_PRICING_TIERS: PricingTier[] = [
  {
    headcount: 50,
    annualPrice: 750,
    perUser: 15.00,
    description: "Small business (50+ employees)"
  },
  {
    headcount: 100,
    annualPrice: 1200,
    perUser: 12.00,
    description: "Small-medium business (100+ employees)"
  },
  {
    headcount: 250,
    annualPrice: 2500,
    perUser: 10.00,
    description: "Medium business (250+ employees)"
  },
  {
    headcount: 500,
    annualPrice: 4500,
    perUser: 9.00,
    description: "Medium-large business (500+ employees)"
  },
  {
    headcount: 1000,
    annualPrice: 8000,
    perUser: 8.00,
    description: "Large business (1000+ employees)"
  },
  {
    headcount: 2500,
    annualPrice: 17500,
    perUser: 7.00,
    description: "Enterprise (2500+ employees)"
  },
  {
    headcount: 5000,
    annualPrice: 30000,
    perUser: 6.00,
    description: "Large enterprise (5000+ employees)"
  },
  {
    headcount: 10000,
    annualPrice: 55000,
    perUser: 5.50,
    description: "Mega enterprise (10000+ employees)"
  }
]

/**
 * Calculate software cost based on headcount using tiered pricing
 */
export function calculateSoftwareCost(headcount: number): SoftwareCost {
  // Find the appropriate pricing tier
  let selectedTier = SOFTWARE_PRICING_TIERS[0]
  
  for (let i = SOFTWARE_PRICING_TIERS.length - 1; i >= 0; i--) {
    if (headcount >= SOFTWARE_PRICING_TIERS[i].headcount) {
      selectedTier = SOFTWARE_PRICING_TIERS[i]
      break
    }
  }
  
  // For very large companies, apply volume discounts
  let finalPrice = selectedTier.annualPrice
  let finalPerUser = selectedTier.perUser
  
  if (headcount >= 10000) {
    // Apply 10% volume discount
    finalPrice = selectedTier.annualPrice * 0.9
    finalPerUser = finalPrice / headcount
  } else if (headcount >= 5000) {
    // Apply 5% volume discount
    finalPrice = selectedTier.annualPrice * 0.95
    finalPerUser = finalPrice / headcount
  }
  
  return {
    annualPrice: Math.round(finalPrice),
    perUser: Math.round(finalPerUser * 100) / 100,
    tier: selectedTier.description
  }
}

/**
 * Get pricing information for a specific headcount
 */
export function getPricingInfo(headcount: number): {
  tier: PricingTier
  cost: SoftwareCost
  savings: number
} {
  const cost = calculateSoftwareCost(headcount)
  const tier = SOFTWARE_PRICING_TIERS.find(t => t.headcount <= headcount) || SOFTWARE_PRICING_TIERS[0]
  
  // Calculate potential savings vs next lower tier
  const lowerTier = SOFTWARE_PRICING_TIERS.find(t => t.headcount < headcount)
  const savings = lowerTier ? (lowerTier.annualPrice - cost.annualPrice) : 0
  
  return {
    tier,
    cost,
    savings
  }
}

/**
 * Get all available pricing tiers
 */
export function getAllPricingTiers(): PricingTier[] {
  return [...SOFTWARE_PRICING_TIERS]
}

/**
 * Calculate cost per user for different company sizes
 */
export function getCostPerUserComparison(): Array<{
  headcount: number
  costPerUser: number
  totalCost: number
  savings: number
}> {
  const comparison = []
  let previousCost = 0
  
  for (const tier of SOFTWARE_PRICING_TIERS) {
    const cost = calculateSoftwareCost(tier.headcount)
    const savings = previousCost > 0 ? previousCost - cost.annualPrice : 0
    
    comparison.push({
      headcount: tier.headcount,
      costPerUser: cost.perUser,
      totalCost: cost.annualPrice,
      savings
    })
    
    previousCost = cost.annualPrice
  }
  
  return comparison
}
