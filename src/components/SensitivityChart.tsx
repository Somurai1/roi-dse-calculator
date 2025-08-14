
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { SensitivityAnalysis } from '../lib/roi';

interface SensitivityChartProps {
  sensitivityData: SensitivityAnalysis[];
  selectedParameter?: string;
}

export function SensitivityChart({ sensitivityData, selectedParameter }: SensitivityChartProps) {
  if (!sensitivityData || sensitivityData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>📊 Sensitivity Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No sensitivity data available</p>
        </CardContent>
      </Card>
    );
  }

  // Filter data for selected parameter or show all
  const dataToShow = selectedParameter 
    ? sensitivityData.filter(d => d.parameter === selectedParameter)
    : sensitivityData;

  // Transform data for Recharts - much simpler and clearer
  const chartData = dataToShow[0]?.variations.map(point => ({
    variation: `${point.variation > 0 ? '+' : ''}${point.variation}%`,
    roi: point.roi,
    payback: point.paybackMonths,
    netBenefit: point.netBenefit / 1000, // Convert to thousands for better display
  })) || [];

  // Clear, distinct colors
  const colors = {
    roi: '#2563eb',      // Blue for ROI
    payback: '#dc2626',  // Red for Payback  
    netBenefit: '#059669' // Green for Net Benefit
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          📊 Sensitivity Analysis
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          How key metrics change when parameters vary by ±30%
        </p>
        
        {/* Description Section */}
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-medium text-blue-900 mb-2">What This Shows:</h4>
          <p className="text-sm text-blue-800 leading-relaxed">
            This analysis demonstrates how your ROI, Net Benefit, and Payback Period change when key business parameters 
            (like headcount, admin salary, or software costs) increase or decrease by up to 30%. 
            <br /><br />
            <strong>How to read:</strong> The horizontal axis shows parameter changes (e.g., "+20%" means a 20% increase), 
            while the vertical axes show the resulting impact on your financial metrics. 
            <strong>Steeper lines indicate more sensitive parameters</strong> - small changes create big impacts.
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          
          {/* Parameter Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dataToShow.map((param) => (
              <div key={param.parameter} className="p-4 border rounded-lg bg-gray-50">
                <h4 className="font-medium text-sm text-gray-700 mb-2 capitalize">
                  {param.parameter.replace(/([A-Z])/g, ' $1').trim()}
                </h4>
                <p className="text-2xl font-bold text-blue-600">
                  {param.baseline.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">{param.unit}</p>
              </div>
            ))}
          </div>

          {/* Main Chart - ROI and Net Benefit (separate Y-axes) */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-center">ROI % & Net Benefit (€k)</h4>
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 20, right: 60, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  
                  {/* X-Axis */}
                  <XAxis 
                    dataKey="variation" 
                    tick={{ fontSize: 12 }}
                    label={{ 
                      value: 'Parameter Variation', 
                      position: 'bottom', 
                      offset: 10,
                      style: { fontSize: 14, fontWeight: 'bold' }
                    }}
                  />
                  
                  {/* Left Y-Axis for ROI */}
                  <YAxis 
                    yAxisId="left"
                    tick={{ fontSize: 12 }}
                    label={{ 
                      value: 'ROI %', 
                      angle: -90, 
                      position: 'left', 
                      offset: 10,
                      style: { fontSize: 14, fontWeight: 'bold' }
                    }}
                  />
                  
                  {/* Right Y-Axis for Net Benefit */}
                  <YAxis 
                    yAxisId="right" 
                    orientation="right"
                    tick={{ fontSize: 12 }}
                    label={{ 
                      value: 'Net Benefit (€k)', 
                      angle: 90, 
                      position: 'right', 
                      offset: 10,
                      style: { fontSize: 14, fontWeight: 'bold' }
                    }}
                  />
                  
                  {/* Tooltip */}
                  <Tooltip 
                    formatter={(value: any, name: string) => [
                      name === 'roi' ? `${Number(value).toFixed(0)}%` : 
                      `€${Number(value).toFixed(0)}k`,
                      name === 'roi' ? 'ROI' : 'Net Benefit'
                    ]}
                    labelFormatter={(label) => `Variation: ${label}`}
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      padding: '8px'
                    }}
                  />
                  
                  {/* Legend */}
                  <Legend verticalAlign="top" height={40} />
                  
                  {/* ROI Line - Blue */}
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="roi" 
                    stroke={colors.roi} 
                    strokeWidth={3}
                    name="ROI %"
                    dot={{ fill: colors.roi, strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: colors.roi, strokeWidth: 2 }}
                  />
                  
                  {/* Net Benefit Line - Green */}
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="netBenefit" 
                    stroke={colors.netBenefit} 
                    strokeWidth={3}
                    name="Net Benefit (€k)"
                    dot={{ fill: colors.netBenefit, strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: colors.netBenefit, strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Separate Payback Period Chart */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-center">Payback Period (months)</h4>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  
                  {/* X-Axis */}
                  <XAxis 
                    dataKey="variation" 
                    tick={{ fontSize: 12 }}
                    label={{ 
                      value: 'Parameter Variation', 
                      position: 'bottom', 
                      offset: 10,
                      style: { fontSize: 14, fontWeight: 'bold' }
                    }}
                  />
                  
                  {/* Y-Axis for Payback Period */}
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    label={{ 
                      value: 'Payback Period (months)', 
                      angle: -90, 
                      position: 'left', 
                      offset: 10,
                      style: { fontSize: 14, fontWeight: 'bold' }
                    }}
                  />
                  
                  {/* Tooltip */}
                  <Tooltip 
                    formatter={(value: any) => [`${Number(value).toFixed(1)} months`, 'Payback Period']}
                    labelFormatter={(label) => `Variation: ${label}`}
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      padding: '8px'
                    }}
                  />
                  
                  {/* Legend */}
                  <Legend verticalAlign="top" height={30} />
                  
                  {/* Payback Period Line - Red */}
                  <Line 
                    type="monotone" 
                    dataKey="payback" 
                    stroke={colors.payback} 
                    strokeWidth={3}
                    name="Payback Period (months)"
                    dot={{ fill: colors.payback, strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: colors.payback, strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Key Insights Summary */}
          <div className="mt-6 p-6 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-4 text-center">Key Insights</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-blue-800">
              <div className="text-center">
                <div className="text-lg font-bold text-blue-700 mb-1">ROI Range</div>
                <div className="text-2xl font-bold">
                  {Math.min(...chartData.map(d => d.roi)).toFixed(0)}% to {Math.max(...chartData.map(d => d.roi)).toFixed(0)}%
                </div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-blue-700 mb-1">Payback Range</div>
                <div className="text-2xl font-bold">
                  {Math.min(...chartData.map(d => d.payback)).toFixed(1)} to {Math.max(...chartData.map(d => d.payback)).toFixed(1)} months
                </div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-blue-700 mb-1">Net Benefit Range</div>
                <div className="text-2xl font-bold">
                  €{Math.min(...chartData.map(d => d.netBenefit)).toFixed(0)}k to €{Math.max(...chartData.map(d => d.netBenefit)).toFixed(0)}k
                </div>
              </div>
            </div>
          </div>

        </div>
      </CardContent>
    </Card>
  );
}
