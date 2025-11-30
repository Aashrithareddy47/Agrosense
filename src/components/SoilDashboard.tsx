import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Thermometer, Droplets, Activity, Leaf, AlertTriangle, CheckCircle } from "lucide-react";

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

// Mock current sensor data
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

const getSoilHealthScore = (reading: SensorReading): number => {
  // Calculate overall soil health score based on optimal ranges
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

export function SoilDashboard() {
  const healthScore = getSoilHealthScore(currentReading);
  const healthStatus = getHealthStatus(healthScore);
  const StatusIcon = healthStatus.icon;

  return (
    <div className="space-y-6">
      {/* Overall Health Score */}
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

      {/* Current Sensor Readings */}
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

      {/* Nutrient Levels */}
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