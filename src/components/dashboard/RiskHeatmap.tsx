import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";

interface GeographicRiskData {
  country: string;
  riskScore: number;
  latitude: number;
  longitude: number;
  transactionCount: number;
}

export function RiskHeatmap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const { data: geoData, isLoading } = useQuery<GeographicRiskData[]>({
    queryKey: ["/api/analytics", "geographic-risk"],
    enabled: true,
  });

  // Sample risk data points for demonstration
  const sampleRiskData = [
    { country: "United States", riskScore: 85, latitude: 39.8283, longitude: -98.5795, transactionCount: 1250 },
    { country: "United Kingdom", riskScore: 65, latitude: 55.3781, longitude: -3.4360, transactionCount: 890 },
    { country: "Germany", riskScore: 45, latitude: 51.1657, longitude: 10.4515, transactionCount: 670 },
    { country: "Japan", riskScore: 30, latitude: 36.2048, longitude: 138.2529, transactionCount: 450 },
    { country: "Brazil", riskScore: 75, latitude: -14.2350, longitude: -51.9253, transactionCount: 320 },
    { country: "Russia", riskScore: 90, latitude: 61.5240, longitude: 105.3188, transactionCount: 280 },
    { country: "China", riskScore: 70, latitude: 35.8617, longitude: 104.1954, transactionCount: 1100 },
  ];

  const displayData = geoData || sampleRiskData;

  useEffect(() => {
    // Simulate map loading
    const timer = setTimeout(() => {
      setMapLoaded(true);
      if (mapRef.current && !isLoading) {
        console.log("Initialize React Leaflet map with geographic risk data", displayData);
      }
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [displayData, isLoading]);

  if (isLoading) {
    return (
      <Card className="bg-card dark:bg-card border-border dark:border-border">
        <CardHeader>
          <CardTitle className="text-card-foreground dark:text-card-foreground">Geographic Risk Heatmap</CardTitle>
          <p className="text-sm text-muted-foreground dark:text-muted-foreground">High-risk regions and transaction volumes</p>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-muted/20 dark:bg-muted/20 rounded-lg flex items-center justify-center border border-border dark:border-border animate-pulse">
            <div className="text-center">
              <div className="w-16 h-16 bg-muted dark:bg-muted rounded-full mx-auto mb-4"></div>
              <div className="h-4 bg-muted dark:bg-muted rounded w-32 mx-auto mb-2"></div>
              <div className="h-3 bg-muted dark:bg-muted rounded w-24 mx-auto"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card dark:bg-card border-border dark:border-border">
      <CardHeader>
        <CardTitle className="text-card-foreground dark:text-card-foreground">Geographic Risk Heatmap</CardTitle>
        <p className="text-sm text-muted-foreground dark:text-muted-foreground">High-risk regions and transaction volumes</p>
      </CardHeader>
      <CardContent>
        <div 
          ref={mapRef} 
          className="h-64 bg-slate-100 dark:bg-slate-800 rounded-lg border border-border dark:border-border relative overflow-hidden"
          data-testid="risk-heatmap"
        >
          {!mapLoaded ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-sm text-muted-foreground dark:text-muted-foreground">Loading world map...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Interactive World Map Background */}
              <div className="absolute inset-0 bg-gradient-to-b from-blue-200 to-blue-300 dark:from-blue-900 dark:to-blue-800">
                {/* World Map SVG representation */}
                <svg viewBox="0 0 1000 500" className="w-full h-full">
                  {/* Simplified world continents */}
                  <g fill="currentColor" className="text-slate-600 dark:text-slate-300">
                    {/* North America */}
                    <path d="M140 80 L280 85 L290 140 L200 180 L160 160 L120 120 Z" />
                    {/* South America */}
                    <path d="M180 200 L250 210 L240 350 L200 380 L170 320 Z" />
                    {/* Europe */}
                    <path d="M400 60 L480 65 L490 120 L430 140 L400 100 Z" />
                    {/* Africa */}
                    <path d="M420 140 L480 150 L490 280 L450 320 L420 280 Z" />
                    {/* Asia */}
                    <path d="M490 50 L750 60 L780 200 L650 220 L500 180 Z" />
                    {/* Australia */}
                    <path d="M650 280 L750 285 L740 320 L670 315 Z" />
                  </g>
                </svg>
              </div>

              {/* Risk Data Points */}
              {displayData.map((location, index) => {
                const getRiskColor = (score: number) => {
                  if (score >= 70) return "bg-red-500";
                  if (score >= 40) return "bg-yellow-500";
                  return "bg-green-500";
                };
                
                const getRiskSize = (score: number) => {
                  if (score >= 70) return "w-4 h-4";
                  if (score >= 40) return "w-3 h-3";
                  return "w-2 h-2";
                };

                // Simple position mapping (not geographically accurate, but for demonstration)
                const positions = [
                  { x: '15%', y: '35%' }, // US
                  { x: '45%', y: '30%' }, // UK
                  { x: '48%', y: '32%' }, // Germany
                  { x: '75%', y: '40%' }, // Japan
                  { x: '22%', y: '65%' }, // Brazil
                  { x: '65%', y: '25%' }, // Russia
                  { x: '70%', y: '38%' }, // China
                ];

                return (
                  <div
                    key={index}
                    className={`absolute ${getRiskSize(location.riskScore)} ${getRiskColor(location.riskScore)} rounded-full border-2 border-white shadow-lg cursor-pointer hover:scale-150 transition-transform`}
                    style={{ 
                      left: positions[index % positions.length].x,
                      top: positions[index % positions.length].y,
                      transform: 'translate(-50%, -50%)'
                    }}
                    title={`${location.country}: Risk ${location.riskScore}% (${location.transactionCount} transactions)`}
                  />
                );
              })}
            </>
          )}
          
          {/* Risk level indicators */}
          <div className="absolute top-4 right-4 bg-card/95 dark:bg-card/95 backdrop-blur-sm rounded-lg p-3 border border-border dark:border-border shadow-lg">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-xs text-card-foreground dark:text-card-foreground font-medium">High Risk</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-xs text-card-foreground dark:text-card-foreground font-medium">Medium Risk</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-xs text-card-foreground dark:text-card-foreground font-medium">Low Risk</span>
              </div>
            </div>
          </div>

          {/* Zoom controls simulation */}
          <div className="absolute bottom-4 left-4 flex flex-col space-y-1">
            <button className="w-8 h-8 bg-card/95 hover:bg-card border border-border rounded flex items-center justify-center text-sm font-bold">
              +
            </button>
            <button className="w-8 h-8 bg-card/95 hover:bg-card border border-border rounded flex items-center justify-center text-sm font-bold">
              −
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
