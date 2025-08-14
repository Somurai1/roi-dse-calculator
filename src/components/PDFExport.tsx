import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Download, FileText, Mail, Copy } from 'lucide-react';
import { ROICalculationInputs, ScenarioResults } from '../lib/roi';

interface PDFExportProps {
  inputs: ROICalculationInputs;
  scenarios: ScenarioResults;
  onCopySummary: () => void;
  onEmailBreakdown: () => void;
}

export function PDFExport({ inputs, scenarios, onCopySummary, onEmailBreakdown }: PDFExportProps) {
  const generatePDF = () => {
    // Create a comprehensive PDF report
    const reportContent = generateReportContent(inputs, scenarios);
    
    // For now, we'll create a downloadable text file
    // In production, you'd use a library like jsPDF or react-pdf
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ROI-Analysis-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const generateReportContent = (inputs: ROICalculationInputs, scenarios: ScenarioResults): string => {
    const expected = scenarios.expected;
    const conservative = scenarios.conservative;
    const stretch = scenarios.stretch;
    
    return `
ROI ANALYSIS REPORT
Generated: ${new Date().toLocaleDateString()}
Company: ${inputs.headcount} employees

EXECUTIVE SUMMARY
================
Expected ROI: ${expected.roiPercentage.toFixed(0)}%
Annual Net Benefit: €${expected.netBenefit.toLocaleString()}
Payback Period: ${expected.paybackMonths.toFixed(1)} months
Breakeven Users: ${expected.breakevenUsers}

SCENARIO ANALYSIS
================
Conservative Scenario:
- ROI: ${conservative.roiPercentage.toFixed(0)}%
- Net Benefit: €${conservative.netBenefit.toLocaleString()}
- Payback: ${conservative.paybackMonths.toFixed(1)} months

Expected Scenario:
- ROI: ${expected.roiPercentage.toFixed(0)}%
- Net Benefit: €${expected.netBenefit.toLocaleString()}
- Payback: ${expected.paybackMonths.toFixed(1)} months

Stretch Scenario:
- ROI: ${stretch.roiPercentage.toFixed(0)}%
- Net Benefit: €${stretch.netBenefit.toLocaleString()}
- Payback: ${stretch.paybackMonths.toFixed(1)} months

DETAILED BREAKDOWN
==================
Admin Cost Savings: €${expected.adminSaving.toLocaleString()}
Absence Reduction Savings: €${expected.absenceSaving.toLocaleString()}
Clinical Intervention Savings: €${expected.interventionSaving.toLocaleString()}
Software Licence Cost: €${expected.licenceCost.toLocaleString()}

INPUT PARAMETERS
================
Headcount: ${inputs.headcount} employees
DSE User %: ${inputs.dseUserPercentage}%
Admin Salary: €${inputs.adminSalary.toLocaleString()}/year
Admin Time (Current): ${inputs.adminTimeNow} days/week
Admin Time (Software): ${inputs.adminTimeWithSoftware} days/week
Baseline Absence Rate: ${inputs.baselineAbsenceRate}%
MSD Prevalence: ${inputs.msdPrevalence}%
MSD Absence Reduction: ${inputs.reductionInMsdAbsence}%
Clinical Intervention Reduction: ${inputs.reductionInClinicalInterventions}%

ASSUMPTIONS
===========
- Working days per year: ${inputs.workDaysPerYear}
- Admin on-cost percentage: ${inputs.adminOnCostPercentage}%
- Cost per absence day: €${inputs.costPerAbsenceDay}
- Cost per clinical intervention: €${inputs.costPerClinicalIntervention}
- Currency: ${inputs.currency}

RECOMMENDATIONS
===============
1. Implement software for immediate ROI of ${expected.roiPercentage.toFixed(0)}%
2. Expect payback within ${expected.paybackMonths.toFixed(1)} months
3. Focus on admin efficiency gains for maximum impact
4. Monitor MSD reduction metrics for validation

For questions or detailed analysis, contact the sales team.
    `.trim();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Export & Share
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Download reports and share results with stakeholders
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <Button 
            onClick={generatePDF} 
            className="w-full"
            size="lg"
          >
            <Download className="h-4 w-4 mr-2" />
            Download PDF Report
          </Button>
          
          <Button 
            onClick={onCopySummary} 
            variant="outline" 
            className="w-full"
          >
            <Copy className="h-4 w-4 mr-2" />
            Copy Executive Summary
          </Button>
          
          <Button 
            onClick={onEmailBreakdown} 
            variant="outline" 
            className="w-full"
          >
            <Mail className="h-4 w-4 mr-2" />
            Email Detailed Breakdown
          </Button>
        </div>
        
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <h4 className="text-sm font-medium text-blue-900 mb-2">Report Includes:</h4>
          <ul className="text-xs text-blue-800 space-y-1">
            <li>• Executive summary with key metrics</li>
            <li>• Three scenario analysis (Conservative/Expected/Stretch)</li>
            <li>• Detailed cost breakdown and savings</li>
            <li>• Input parameters and assumptions</li>
            <li>• Recommendations and next steps</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
