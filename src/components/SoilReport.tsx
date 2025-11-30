import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { FileText, Download, AlertTriangle, CheckCircle, Info, Lightbulb } from "lucide-react";

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

// Mock report data
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

export function SoilReport() {
  const handleDownloadReport = () => {
    // Mock download functionality
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
      {/* Report Header */}
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

      {/* Detailed Analysis */}
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

      {/* Recommendations */}
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

      {/* Crop Suitability */}
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