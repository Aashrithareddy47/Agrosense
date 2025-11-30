import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from "recharts";

// Mock historical data
const generateHistoricalData = () => {
  const data = [];
  const baseDate = new Date('2025-07-01');
  
  for (let i = 0; i < 30; i++) {
    const date = new Date(baseDate);
    date.setDate(baseDate.getDate() + i);
    
    data.push({
      date: date.toISOString().split('T')[0],
      dateFormatted: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      pH: Number((6.5 + Math.random() * 1.0).toFixed(1)),
      moisture: Number((40 + Math.random() * 25).toFixed(1)),
      temperature: Number((18 + Math.random() * 10).toFixed(1)),
      nitrogen: Number((20 + Math.random() * 15).toFixed(0)),
      phosphorus: Number((15 + Math.random() * 12).toFixed(0)),
      potassium: Number((25 + Math.random() * 20).toFixed(0)),
      healthScore: Number((60 + Math.random() * 35).toFixed(0))
    });
  }
  return data;
};

const historicalData = generateHistoricalData();

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-medium">{`Date: ${label}`}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }}>
            {`${entry.name}: ${entry.value}${entry.name === 'pH' ? '' : entry.name.includes('ppm') ? ' ppm' : entry.name.includes('%') ? '%' : entry.name.includes('°C') ? '°C' : ''}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function SoilHistoryCharts() {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="conditions">Conditions</TabsTrigger>
          <TabsTrigger value="nutrients">Nutrients</TabsTrigger>
          <TabsTrigger value="health">Health Trend</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Soil Health Overview - Last 30 Days</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={historicalData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="dateFormatted" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line 
                    yAxisId="left" 
                    type="monotone" 
                    dataKey="pH" 
                    stroke="#8884d8" 
                    name="pH Level" 
                    strokeWidth={2}
                  />
                  <Line 
                    yAxisId="right" 
                    type="monotone" 
                    dataKey="moisture" 
                    stroke="#82ca9d" 
                    name="Moisture %" 
                    strokeWidth={2}
                  />
                  <Line 
                    yAxisId="right" 
                    type="monotone" 
                    dataKey="temperature" 
                    stroke="#ffc658" 
                    name="Temperature °C" 
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conditions" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>pH Levels</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={historicalData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="dateFormatted" />
                    <YAxis domain={[5.5, 8.5]} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line type="monotone" dataKey="pH" stroke="#8884d8" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Moisture & Temperature</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={historicalData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="dateFormatted" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="moisture" stroke="#82ca9d" name="Moisture %" strokeWidth={2} />
                    <Line yAxisId="right" type="monotone" dataKey="temperature" stroke="#ffc658" name="Temperature °C" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="nutrients" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Nutrient Levels Over Time (ppm)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={historicalData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="dateFormatted" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line type="monotone" dataKey="nitrogen" stroke="#2563eb" name="Nitrogen (N)" strokeWidth={2} />
                  <Line type="monotone" dataKey="phosphorus" stroke="#16a34a" name="Phosphorus (P)" strokeWidth={2} />
                  <Line type="monotone" dataKey="potassium" stroke="#ea580c" name="Potassium (K)" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Average Nutrient Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={[
                  { nutrient: 'Nitrogen', value: historicalData.reduce((sum, d) => sum + d.nitrogen, 0) / historicalData.length, optimal: 30 },
                  { nutrient: 'Phosphorus', value: historicalData.reduce((sum, d) => sum + d.phosphorus, 0) / historicalData.length, optimal: 20 },
                  { nutrient: 'Potassium', value: historicalData.reduce((sum, d) => sum + d.potassium, 0) / historicalData.length, optimal: 37 }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="nutrient" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#8884d8" name="Current Average" />
                  <Bar dataKey="optimal" fill="#82ca9d" name="Optimal Level" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="health" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Soil Health Score Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={historicalData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="dateFormatted" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="healthScore" 
                    stroke="#16a34a" 
                    strokeWidth={3}
                    name="Health Score"
                    dot={{ fill: '#16a34a', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}