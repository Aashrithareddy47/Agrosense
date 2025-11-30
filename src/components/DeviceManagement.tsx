import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Wifi, WifiOff, Battery, MapPin, Settings, RefreshCw, Plus } from "lucide-react";

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

// Mock device data
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

const StatusBadge = ({ status }: { status: string }) => {
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

export function DeviceManagement() {
  const handleRefreshDevice = (deviceId: string) => {
    console.log(`Refreshing device ${deviceId}`);
    // Mock refresh functionality
  };

  const handleAddDevice = () => {
    console.log("Adding new device");
    // Mock add device functionality
  };

  return (
    <div className="space-y-6">
      {/* Header */}
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

      {/* Device Overview Stats */}
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

      {/* Device List */}
      <div className="space-y-4">
        {devices.map((device) => (
          <Card key={device.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-medium">{device.name}</h3>
                    <StatusBadge status={device.status} />
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