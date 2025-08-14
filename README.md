# ROI Calculator - Digital Health & Safety Ergonomics Platform

A production-quality, single-page ROI Calculator web app optimized for cold-call use. Built with TypeScript, React, Vite, TailwindCSS, and shadcn/ui components.

## 🎯 Business Context

We sell a digital health & safety ergonomics platform that enables DSE self-assessments, triage, and targeted interventions. The calculator compares a prospect's current manual process vs our software, quantifying savings across:

- **Admin time** - Reduction in competent person workload
- **Absenteeism** - MSD-related absence reduction
- **Clinical interventions** - Avoided medical costs

## 🚀 Features

- **Immediate Results** - ROI, Payback Period, and Net Benefit calculated in real-time
- **Three Scenarios** - Conservative, Expected, and Stretch with scenario toggles
- **Irish Market Focus** - Pre-filled with Irish DSE compliance data and benchmarks
- **Mobile-First Design** - Responsive layout optimized for all devices
- **Export Options** - Copy summary, PDF download, and email breakdown
- **Transparent Sources** - All assumptions and data sources clearly documented

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: TailwindCSS + shadcn/ui components
- **Animations**: Framer Motion
- **Charts**: Recharts (for future sensitivity analysis)
- **Testing**: Vitest
- **Build**: Vite

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd roi-dse-calculator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Run tests**
   ```bash
   npm test
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 🧮 ROI Calculation Equations

### Core Variables
- **N** = Headcount
- **pDSE** = % DSE users
- **lic** = Price per user per year
- **sal** = Admin base salary
- **onCost** = 30% (pension, PRSI, benefits)
- **adminDaysNow, adminDaysWith** = Admin time in days/week
- **absenceRate** = Baseline absence rate
- **costPerAbsenceDay** = Cost per absence day
- **msdPrev** = MSD prevalence among DSE users
- **reduAbsence** = Reduction in MSD-related absenteeism (fraction)
- **costPerIntervention** = Cost per clinical intervention
- **reduInterventions** = Reduction in clinical interventions (fraction)

### Derived Calculations

1. **Admin cost now** = (sal × (1+onCost)) × (adminDaysNow/5)
2. **Admin cost with software** = (sal × (1+onCost)) × (adminDaysWith/5)
3. **Admin saving** = 1) - 2)
4. **Licence cost** = N × pDSE × lic
5. **MSD-related absence baseline days** = N × pDSE × absenceRate × 220 × 0.3
6. **Absence saving** = 5) × costPerAbsenceDay × reduAbsence
7. **Intervention saving** = N × pDSE × msdPrev × reduInterventions × costPerIntervention × 0.2
8. **Total annual savings** = Admin saving + Absence saving + Intervention saving
9. **Net benefit** = Total savings - Licence cost
10. **ROI %** = Net benefit / Licence cost × 100
11. **Payback (months)** = 12 × Licence cost / max(Total savings, 1) (capped to 36 months)
12. **Breakeven users** = Solve for X where Licence cost = Total savings with X users

### Scenario Multipliers

- **Conservative**: Admin time +0.5 days, Reductions ×0.5
- **Expected**: No multipliers (baseline)
- **Stretch**: Reductions ×1.5

## 📊 Default Values (Irish Market)

| Parameter | Value | Source |
|-----------|-------|---------|
| Headcount | 800 | Internal case study |
| % DSE Users | 50% | Typical office environment |
| Admin Salary | €60,000 | Morgan McKinley 2025 |
| Admin Time Now | 5 days/week | Current manual process |
| Admin Time with Software | 2 days/week | 60% reduction |
| Software Price | €70/user/year | Standard pricing |
| Baseline Absence Rate | 5% | CSO Labour Force Survey Q1 2024 |
| Cost per Absence Day | €250 | Industry benchmark |
| MSD Prevalence | 25% | EU-OSHA evidence |
| Reduction in MSD Absence | 10% | Conservative estimate |
| Reduction in Interventions | 20% | Conservative estimate |
| Cost per Intervention | €500 | Healthcare cost estimate |
| Work Days per Year | 220 | Standard working year |
| % Absence Due to MSD | 30% | EU evidence |
| % MSD Needing Intervention | 20% | Clinical estimate |
| Admin On-Cost | 30% | Irish employment costs |

## 🎨 Component Architecture

```
src/
├── components/
│   ├── ui/                    # shadcn/ui base components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── select.tsx
│   │   ├── tabs.tsx
│   │   ├── accordion.tsx
│   │   ├── tooltip.tsx
│   │   ├── dialog.tsx
│   │   └── badge.tsx
│   ├── KPIDisplay.tsx         # Main results display
│   ├── InputForm.tsx          # Input parameters form
│   ├── AssumptionsCard.tsx    # Assumptions and sources
│   ├── ComplianceBanner.tsx   # Irish compliance note
│   └── SourcesModal.tsx       # Data sources modal
├── lib/
│   ├── roi.ts                 # Core calculation logic
│   ├── roi.test.ts            # Unit tests
│   └── utils.ts               # Utility functions
├── App.tsx                    # Main application
├── main.tsx                   # Entry point
└── index.css                  # Global styles
```

## 🧪 Testing

The application includes comprehensive unit tests covering:

- **ROI calculations** for all scenarios
- **Input validation** and edge cases
- **Mathematical consistency** across all formulas
- **Currency formatting** for multiple currencies
- **Scenario multipliers** and their effects

Run tests with:
```bash
npm test
```

## 📱 Responsive Design

- **Desktop**: Three-column layout with results, inputs, and assumptions
- **Tablet**: Responsive grid that adapts to screen size
- **Mobile**: Single-column layout optimized for touch interaction
- **Print**: Clean PDF export with print-specific CSS

## 🔒 Compliance & Trust

- **Irish DSE Law**: References Safety, Health and Welfare at Work (General Application) Regs 2007
- **HSA Guidance**: Aligns with Health & Safety Authority recommendations
- **Data Sources**: All external data properly cited with access dates
- **Transparency**: Assumptions clearly documented with tooltips

## 🚀 Performance Optimizations

- **Real-time calculations** using React hooks and useEffect
- **Debounced input handling** to prevent excessive recalculations
- **Memoized components** for expensive calculations
- **Lazy loading** of advanced features
- **Optimized animations** with Framer Motion

## 📈 Future Enhancements

- **Sensitivity Analysis Chart** using Recharts
- **Sector Presets** for different industry absence rates
- **Advanced Parameters Panel** with additional customization
- **Export to Excel** functionality
- **Multi-language Support** for international markets

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is proprietary software. All rights reserved.

## 📞 Support

For questions about the ROI Calculator or the underlying DSE platform, please contact our sales team.

---

**Built with ❤️ for cold-call success**
# roi-dse-calculator
