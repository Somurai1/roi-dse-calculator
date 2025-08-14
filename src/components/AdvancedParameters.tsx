import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Settings, TrendingUp, Clock, Users, Euro } from 'lucide-react';
import { ROICalculationInputs } from '../lib/roi';

interface AdvancedParametersProps {
  inputs: ROICalculationInputs;
  onInputChange: (field: keyof ROICalculationInputs, value: string | number) => void;
  onResetToDefaults: () => void;
}

export function AdvancedParameters({ inputs, onInputChange, onResetToDefaults }: AdvancedParametersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleInputChange = (field: keyof ROICalculationInputs, value: string) => {
    onInputChange(field, value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Advanced Parameters
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Fine-tune calculations for precise analysis
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Quick Actions */}
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              {showAdvanced ? 'Hide' : 'Show'} Advanced
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={onResetToDefaults}
            >
              Reset to Defaults
            </Button>
          </div>

          {/* Advanced Parameters */}
          {showAdvanced && (
            <Accordion type="multiple" defaultValue={['workdays', 'msd', 'compliance']}>
              
              {/* Work Days & Calendar */}
              <AccordionItem value="workdays">
                <AccordionTrigger className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Work Calendar & Efficiency
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                    <div>
                      <Label htmlFor="workDaysPerYear">Working Days per Year</Label>
                      <Input
                        id="workDaysPerYear"
                        type="number"
                        value={inputs.workDaysPerYear}
                        onChange={(e) => handleInputChange('workDaysPerYear', e.target.value)}
                        min="200"
                        max="260"
                        step="1"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Standard: 220, High efficiency: 240+
                      </p>
                    </div>
                    <div>
                      <Label htmlFor="adminOnCostPercentage">Admin On-Cost %</Label>
                      <Input
                        id="adminOnCostPercentage"
                        type="number"
                        value={inputs.adminOnCostPercentage}
                        onChange={(e) => handleInputChange('adminOnCostPercentage', e.target.value)}
                        min="0"
                        max="100"
                        step="5"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Benefits, pension, overhead costs
                      </p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* MSD & Health Metrics */}
              <AccordionItem value="msd">
                <AccordionTrigger className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  MSD & Health Impact
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                    <div>
                      <Label htmlFor="msdPrevalence">MSD Prevalence %</Label>
                      <Input
                        id="msdPrevalence"
                        type="number"
                        value={inputs.msdPrevalence}
                        onChange={(e) => handleInputChange('msdPrevalence', e.target.value)}
                        min="0"
                        max="100"
                        step="1"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        % of workforce with MSD symptoms
                      </p>
                    </div>
                    <div>
                      <Label htmlFor="absenceDueToMsdPercentage">MSD Absence %</Label>
                      <Input
                        id="absenceDueToMsdPercentage"
                        type="number"
                        value={inputs.absenceDueToMsdPercentage}
                        onChange={(e) => handleInputChange('absenceDueToMsdPercentage', e.target.value)}
                        min="0"
                        max="100"
                        step="1"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        % of total absence due to MSDs
                      </p>
                    </div>
                    <div>
                      <Label htmlFor="msdNeedingInterventionPercentage">MSD Intervention %</Label>
                      <Input
                        id="msdNeedingInterventionPercentage"
                        type="number"
                        value={inputs.msdNeedingInterventionPercentage}
                        onChange={(e) => handleInputChange('msdNeedingInterventionPercentage', e.target.value)}
                        min="0"
                        max="100"
                        step="1"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        % of MSD cases needing treatment
                      </p>
                    </div>
                    <div>
                      <Label htmlFor="costPerClinicalIntervention">Intervention Cost €</Label>
                      <Input
                        id="costPerClinicalIntervention"
                        type="number"
                        value={inputs.costPerClinicalIntervention}
                        onChange={(e) => handleInputChange('costPerClinicalIntervention', e.target.value)}
                        min="100"
                        max="10000"
                        step="50"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Cost per clinical intervention
                      </p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Compliance & Risk */}
              <AccordionItem value="compliance">
                <AccordionTrigger className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Compliance & Risk Factors
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                    <div>
                      <Label htmlFor="baselineAbsenceRate">Baseline Absence Rate %</Label>
                      <Input
                        id="baselineAbsenceRate"
                        type="number"
                        value={inputs.baselineAbsenceRate}
                        onChange={(e) => handleInputChange('baselineAbsenceRate', e.target.value)}
                        min="0"
                        max="20"
                        step="0.1"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Industry standard absence rate
                      </p>
                    </div>
                    <div>
                      <Label htmlFor="costPerAbsenceDay">Cost per Absence Day €</Label>
                      <Input
                        id="costPerAbsenceDay"
                        type="number"
                        value={inputs.costPerAbsenceDay}
                        onChange={(e) => handleInputChange('costPerAbsenceDay', e.target.value)}
                        min="100"
                        max="1000"
                        step="25"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Daily cost of employee absence
                      </p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Software Effectiveness */}
              <AccordionItem value="effectiveness">
                <AccordionTrigger className="flex items-center gap-2">
                  <Euro className="h-4 w-4" />
                  Software Effectiveness
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                    <div>
                      <Label htmlFor="reductionInMsdAbsence">MSD Absence Reduction %</Label>
                      <Input
                        id="reductionInMsdAbsence"
                        type="number"
                        value={inputs.reductionInMsdAbsence}
                        onChange={(e) => handleInputChange('reductionInMsdAbsence', e.target.value)}
                        min="0"
                        max="50"
                        step="1"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Expected reduction in MSD absences
                      </p>
                    </div>
                    <div>
                      <Label htmlFor="reductionInClinicalInterventions">Intervention Reduction %</Label>
                      <Input
                        id="reductionInClinicalInterventions"
                        type="number"
                        value={inputs.reductionInClinicalInterventions}
                        onChange={(e) => handleInputChange('reductionInClinicalInterventions', e.target.value)}
                        min="0"
                        max="50"
                        step="1"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Expected reduction in interventions
                      </p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}

          {/* Parameter Summary */}
          {showAdvanced && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Current Advanced Settings</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                <div>
                  <span className="text-gray-600">Work Days:</span>
                  <span className="ml-2 font-medium">{inputs.workDaysPerYear}</span>
                </div>
                <div>
                  <span className="text-gray-600">On-Cost:</span>
                  <span className="ml-2 font-medium">{inputs.adminOnCostPercentage}%</span>
                </div>
                <div>
                  <span className="text-gray-600">MSD Prevalence:</span>
                  <span className="ml-2 font-medium">{inputs.msdPrevalence}%</span>
                </div>
                <div>
                  <span className="text-gray-600">Absence Cost:</span>
                  <span className="ml-2 font-medium">€{inputs.costPerAbsenceDay}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
