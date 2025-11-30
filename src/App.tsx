import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Button } from './components/ui/button';
import { Badge } from './components/ui/badge';
import { Progress } from './components/ui/progress';
import { Separator } from './components/ui/separator';
import { 
  Leaf, BarChart3, FileText, Settings, Bell, User, 
  Thermometer, Droplets, Activity, AlertTriangle, CheckCircle, 
  Info, Lightbulb, Download, Wifi, WifiOff, Battery, 
  MapPin, RefreshCw, Plus 
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, BarChart, Bar 
} from 'recharts';

// ============================================
// TYPES & INTERFACES
// ============================================

interface SensorReading {
  id: string;
  timestamp: string;
  pH: number;
  moisture: number;
  temperature: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  organicMatter: number;
  salinity: number;
}

interface ReportData {
  overallScore: number;
  pH: { value: number; status: string; recommendation: string };
  moisture: { value: number; status: string; recommendation: string };
  nutrients: {
    nitrogen: { value: number; status: string; recommendation: string };
    phosphorus: { value: number; status: string; recommendation: string };
    potassium: { value: number; status: string; recommendation: string };
  };
  recommendations: string[];
  cropSuitability: { crop: string; suitability: string; reason: string }[];
}

interface Device {
  id: string;
  name: string;
  location: string;
  status: 'online' | 'offline' | 'warning';
  lastSeen: string;
  batteryLevel: number;
  signalStrength: number;
  firmware: string;
  sensors: string[];
}

// ============================================
// MOCK DATA
// ============================================

const currentReading: SensorReading = {
  id: "device-001",
  timestamp: "2025-08-06T14:30:00Z",
  pH: 6.8,
  moisture: 45,
  temperature: 22.5,
  nitrogen: 25,
  phosphorus: 18,
  potassium: 32,
  organicMatter: 3.2,
  salinity: 0.8
};

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

const reportData: ReportData = {
  overallScore: 75,
  pH: {
    value: 6.8,
    status: "optimal",
    recommendation: "pH level is within optimal range for most crops. Continue monitoring."
  },
  moisture: {
    value: 45,
    status: "good",
    recommendation: "Moisture levels are adequate. Consider slight increase during dry periods."
  },
  nutrients: {
    nitrogen: {
      value: 25,
      status: "good",
      recommendation: "Nitrogen levels are adequate. Consider organic compost for sustained release."
    },
    phosphorus: {
      value: 18,
      status: "optimal",
      recommendation: "Phosphorus levels are excellent for root development."
    },
    potassium: {
      value: 32,
      status: "good",
      recommendation: "Potassium levels support good plant health and disease resistance."
    }
  },
  recommendations: [
    "Add 2-3 inches of organic compost to improve soil structure and nutrient retention",
    "Consider cover cropping during off-season to prevent nutrient loss",
    "Install drip irrigation for more efficient water management",
    "Test soil microbiome health for optimal nutrient cycling",
    "Apply lime if pH drops below 6.0 in future readings"
  ],
  cropSuitability: [
    { crop: "Tomatoes", suitability: "Excellent", reason: "pH and nutrient levels ideal" },
    { crop: "Lettuce", suitability: "Very Good", reason: "Good moisture and nitrogen levels" },
    { crop: "Carrots", suitability: "Good", reason: "Adequate phosphorus for root development" },
    { crop: "Corn", suitability: "Fair", reason: "May need additional nitrogen supplementation" },
    { crop: "Blueberries", suitability: "Poor", reason: "pH too high (prefer 4.5-5.5)" }
  ]
};

const devices: Device[] = [
  {
    id: "device-001",
    name: "Field Station Alpha",
    location: "North Field - Zone A1",
    status: "online",
    lastSeen: "2 minutes ago",
    batteryLevel: 87,
    signalStrength: 4,
    firmware: "v2.1.3",
    sensors: ["pH", "Moisture", "Temperature", "NPK", "Salinity"]
  },
  {
    id: "device-002", 
    name: "Field Station Beta",
    location: "South Field - Zone B2",
    status: "warning",
    lastSeen: "45 minutes ago",
    batteryLevel: 23,
    signalStrength: 2,
    firmware: "v2.0.8",
    sensors: ["pH", "Moisture", "Temperature", "NPK"]
  },
  {
    id: "device-003",
    name: "Field Station Gamma", 
    location: "Greenhouse - Section C",
    status: "offline",
    lastSeen: "3 hours ago",
    batteryLevel: 5,
    signalStrength: 0,
    firmware: "v1.9.2",
    sensors: ["pH", "Moisture", "Temperature"]
  }
];

// ============================================
// UTILITY FUNCTIONS
// ============================================

const getSoilHealthScore = (reading: SensorReading): number => {
  const pHScore = reading.pH >= 6.0 && reading.pH <= 7.5 ? 100 : Math.max(0, 100 - Math.abs(reading.pH - 6.75) * 20);
  const moistureScore = reading.moisture >= 40 && reading.moisture <= 60 ? 100 : Math.max(0, 100 - Math.abs(reading.moisture - 50) * 2);
  const tempScore = reading.temperature >= 15 && reading.temperature <= 30 ? 100 : Math.max(0, 100 - Math.abs(reading.temperature - 22.5) * 3);
  const nutrientScore = ((reading.nitrogen + reading.phosphorus + reading.potassium) / 3);
  
  return Math.round((pHScore + moistureScore + tempScore + nutrientScore) / 4);
};

const getHealthStatus = (score: number) => {
  if (score >= 80) return { label: "Excellent", color: "bg-green-500", icon: CheckCircle };
  if (score >= 60) return { label: "Good", color: "bg-blue-500", icon: Activity };
  if (score >= 40) return { label: "Fair", color: "bg-yellow-500", icon: AlertTriangle };
  return { label: "Poor", color: "bg-red-500", icon: AlertTriangle };
};

// ============================================
// DASHBOARD COMPONENTS
// ============================================

const MetricCard = ({ 
  title, 
  value, 
  unit, 
  icon: Icon, 
  optimal, 
  current 
}: { 
  title: string; 
  value: string; 
  unit: string; 
  icon: any; 
  optimal: string; 
  current: number;
}) => {
  const isOptimal = () => {
    const [min, max] = optimal.split('-').map(Number);
    return current >= min && current <= max;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="text-xs text-muted-foreground mt-1">
          Optimal: {optimal} {unit}
        </div>
        <Badge 
          variant={isOptimal() ? "default" : "destructive"} 
          className="mt-2"
        >
          {isOptimal() ? "Optimal" : "Needs Attention"}
        </Badge>
      </CardContent>
    </Card>
  );
};

function SoilDashboard() {
  const healthScore = getSoilHealthScore(currentReading);
  const healthStatus = getHealthStatus(healthScore);
  const StatusIcon = healthStatus.icon;

  return (
    <div className="space-y-6">
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Leaf className="h-6 w-6 text-green-600" />
            Overall Soil Health
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="text-4xl font-bold">{healthScore}%</div>
            <div className="flex items-center gap-2">
              <StatusIcon className={`h-6 w-6 text-white`} />
              <Badge className={healthStatus.color}>
                {healthStatus.label}
              </Badge>
            </div>
          </div>
          <Progress value={healthScore} className="w-full" />
          <p className="text-sm text-muted-foreground mt-2">
            Last updated: {new Date(currentReading.timestamp).toLocaleString()}
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="pH Level"
          value={currentReading.pH.toString()}
          unit="pH"
          icon={Activity}
          optimal="6.0-7.5"
          current={currentReading.pH}
        />
        <MetricCard
          title="Soil Moisture"
          value={`${currentReading.moisture}%`}
          unit="%"
          icon={Droplets}
          optimal="40-60"
          current={currentReading.moisture}
        />
        <MetricCard
          title="Temperature"
          value={`${currentReading.temperature}°C`}
          unit="°C"
          icon={Thermometer}
          optimal="15-30"
          current={currentReading.temperature}
        />
        <MetricCard
          title="Salinity"
          value={`${currentReading.salinity}`}
          unit="dS/m"
          icon={AlertTriangle}
          optimal="0.0-2.0"
          current={currentReading.salinity}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Nutrient Levels (ppm)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>Nitrogen (N)</span>
              </div>
              <div className="text-right">
                <span className="font-medium">{currentReading.nitrogen} ppm</span>
                <div className="text-sm text-muted-foreground">Optimal: 20-40 ppm</div>
              </div>
            </div>
            <Progress value={(currentReading.nitrogen / 50) * 100} className="w-full" />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Phosphorus (P)</span>
              </div>
              <div className="text-right">
                <span className="font-medium">{currentReading.phosphorus} ppm</span>
                <div className="text-sm text-muted-foreground">Optimal: 15-25 ppm</div>
              </div>
            </div>
            <Progress value={(currentReading.phosphorus / 35) * 100} className="w-full" />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span>Potassium (K)</span>
              </div>
              <div className="text-right">
                <span className="font-medium">{currentReading.potassium} ppm</span>
                <div className="text-sm text-muted-foreground">Optimal: 25-50 ppm</div>
              </div>
            </div>
            <Progress value={(currentReading.potassium / 60) * 100} className="w-full" />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span>Organic Matter</span>
              </div>
              <div className="text-right">
                <span className="font-medium">{currentReading.organicMatter}%</span>
                <div className="text-sm text-muted-foreground">Optimal: 2.5-5.0%</div>
              </div>
            </div>
            <Progress value={(currentReading.organicMatter / 6) * 100} className="w-full" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================
// ANALYTICS COMPONENTS
// ============================================

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

function SoilHistoryCharts() {
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

// ============================================
// REPORT COMPONENTS
// ============================================

const StatusIcon = ({ status }: { status: string }) => {
  switch (status) {
    case 'optimal':
    case 'excellent':
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'good':
    case 'very good':
      return <Info className="h-4 w-4 text-blue-500" />;
    case 'fair':
      return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    case 'poor':
      return <AlertTriangle className="h-4 w-4 text-red-500" />;
    default:
      return <Info className="h-4 w-4 text-gray-500" />;
  }
};

const SuitabilityBadge = ({ suitability }: { suitability: string }) => {
  const variant = 
    suitability === 'Excellent' ? 'default' :
    suitability === 'Very Good' ? 'secondary' :
    suitability === 'Good' ? 'outline' :
    suitability === 'Fair' ? 'secondary' :
    'destructive';
  
  return <Badge variant={variant}>{suitability}</Badge>;
};

function SoilReport() {
  const handleDownloadReport = () => {
    const reportContent = `
Soil Health Report - ${new Date().toLocaleDateString()}
Overall Score: ${reportData.overallScore}%
pH: ${reportData.pH.value}
Moisture: ${reportData.moisture.value}%
Nutrients: N=${reportData.nutrients.nitrogen.value}, P=${reportData.nutrients.phosphorus.value}, K=${reportData.nutrients.potassium.value}
`;
    
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `soil-report-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-6 w-6 text-blue-600" />
              <CardTitle>Soil Health Analysis Report</CardTitle>
            </div>
            <Button onClick={handleDownloadReport} variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Download Report
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="text-3xl font-bold text-green-600">{reportData.overallScore}%</div>
            <div>
              <p className="text-sm text-muted-foreground">Overall Soil Health Score</p>
              <p className="text-sm">Generated on {new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Soil Conditions Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <StatusIcon status={reportData.pH.status} />
                  <span className="font-medium">pH Level: {reportData.pH.value}</span>
                </div>
                <Badge variant={reportData.pH.status === 'optimal' ? 'default' : 'secondary'}>
                  {reportData.pH.status}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground pl-6">{reportData.pH.recommendation}</p>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <StatusIcon status={reportData.moisture.status} />
                  <span className="font-medium">Moisture: {reportData.moisture.value}%</span>
                </div>
                <Badge variant={reportData.moisture.status === 'optimal' ? 'default' : 'secondary'}>
                  {reportData.moisture.status}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground pl-6">{reportData.moisture.recommendation}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Nutrient Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {Object.entries(reportData.nutrients).map(([nutrient, data]) => (
                <div key={nutrient}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <StatusIcon status={data.status} />
                      <span className="font-medium">
                        {nutrient.charAt(0).toUpperCase() + nutrient.slice(1)}: {data.value} ppm
                      </span>
                    </div>
                    <Badge variant={data.status === 'optimal' ? 'default' : 'secondary'}>
                      {data.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground pl-6">{data.recommendation}</p>
                  {nutrient !== 'potassium' && <Separator className="mt-3" />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            Improvement Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {reportData.recommendations.map((recommendation, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mt-0.5">
                  {index + 1}
                </div>
                <p className="text-sm">{recommendation}</p>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Crop Suitability Assessment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reportData.cropSuitability.map((crop, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{crop.crop}</h4>
                  <SuitabilityBadge suitability={crop.suitability} />
                </div>
                <p className="text-sm text-muted-foreground">{crop.reason}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================
// DEVICE MANAGEMENT COMPONENTS
// ============================================

const DeviceStatusBadge = ({ status }: { status: string }) => {
  const config = {
    online: { variant: "default" as const, color: "bg-green-500" },
    warning: { variant: "secondary" as const, color: "bg-yellow-500" },
    offline: { variant: "destructive" as const, color: "bg-red-500" }
  };
  
  const { variant, color } = config[status as keyof typeof config];
  
  return (
    <Badge variant={variant} className="flex items-center gap-1">
      <div className={`w-2 h-2 rounded-full ${color}`}></div>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

const SignalBars = ({ strength }: { strength: number }) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4].map((bar) => (
        <div
          key={bar}
          className={`w-1 h-3 ${
            bar <= strength ? 'bg-green-500' : 'bg-gray-200'
          } rounded-sm`}
        />
      ))}
    </div>
  );
};

const BatteryIndicator = ({ level }: { level: number }) => {
  const getColor = () => {
    if (level > 50) return 'bg-green-500';
    if (level > 20) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <Battery className="h-4 w-4 text-gray-400" />
        <div 
          className={`absolute inset-0 ${getColor()} opacity-75`}
          style={{ clipPath: `inset(${100 - level}% 0 0 0)` }}
        />
      </div>
      <span className="text-sm">{level}%</span>
    </div>
  );
};

function DeviceManagement() {
  const handleRefreshDevice = (deviceId: string) => {
    console.log(`Refreshing device ${deviceId}`);
  };

  const handleAddDevice = () => {
    console.log("Adding new device");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Device Management</h2>
          <p className="text-muted-foreground">Monitor and manage your soil sensor devices</p>
        </div>
        <Button onClick={handleAddDevice} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Device
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Devices</p>
                <p className="text-2xl font-bold">{devices.length}</p>
              </div>
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Settings className="h-4 w-4 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Online</p>
                <p className="text-2xl font-bold text-green-600">
                  {devices.filter(d => d.status === 'online').length}
                </p>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Wifi className="h-4 w-4 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Warning</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {devices.filter(d => d.status === 'warning').length}
                </p>
              </div>
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <RefreshCw className="h-4 w-4 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Offline</p>
                <p className="text-2xl font-bold text-red-600">
                  {devices.filter(d => d.status === 'offline').length}
                </p>
              </div>
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <WifiOff className="h-4 w-4 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {devices.map((device) => (
          <Card key={device.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-medium">{device.name}</h3>
                    <DeviceStatusBadge status={device.status} />
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{device.location}</span>
                    <span>•</span>
                    <span>ID: {device.id}</span>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleRefreshDevice(device.id)}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="h-3 w-3" />
                  Refresh
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Battery Level</p>
                  <BatteryIndicator level={device.batteryLevel} />
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium">Signal Strength</p>
                  <div className="flex items-center gap-2">
                    <SignalBars strength={device.signalStrength} />
                    <span className="text-sm text-muted-foreground">
                      {device.signalStrength}/4
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium">Last Seen</p>
                  <p className="text-sm text-muted-foreground">{device.lastSeen}</p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium">Firmware</p>
                  <p className="text-sm text-muted-foreground">{device.firmware}</p>
                </div>
              </div>

              <Separator className="my-4" />

              <div>
                <p className="text-sm font-medium mb-2">Active Sensors</p>
                <div className="flex flex-wrap gap-2">
                  {device.sensors.map((sensor) => (
                    <Badge key={sensor} variant="outline" className="text-xs">
                      {sensor}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ============================================
// MAIN APP COMPONENT
// ============================================

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <Leaf className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">AgroSense</h1>
                <p className="text-sm text-muted-foreground">Smart Agricultural Monitoring</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <User className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <Leaf className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Reports
            </TabsTrigger>
            <TabsTrigger value="devices" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Devices
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Soil Health Dashboard</h2>
                <p className="text-muted-foreground">Real-time monitoring and analysis of your soil conditions</p>
              </div>
            </div>
            <SoilDashboard />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Historical Analytics</h2>
                <p className="text-muted-foreground">Trends and patterns in your soil data over time</p>
              </div>
            </div>
            <SoilHistoryCharts />
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Soil Health Reports</h2>
                <p className="text-muted-foreground">Detailed analysis and recommendations for optimal soil health</p>
              </div>
            </div>
            <SoilReport />
          </TabsContent>

          <TabsContent value="devices" className="space-y-6">
            <DeviceManagement />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/30 mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-muted-foreground">
            <p>AgroSense - Smart Agricultural Monitoring System</p>
            <p className="mt-1">Helping farmers optimize crop yields through data-driven soil analysis</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
