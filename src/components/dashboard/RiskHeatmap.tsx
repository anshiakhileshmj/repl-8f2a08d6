import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { GeographicRiskData } from "@/types/database";

export function RiskHeatmap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const { data: geoData, isLoading } = useQuery<GeographicRiskData[]>({
    queryKey: ["/api/geographic-risk"],
    enabled: true,
  });

  useEffect(() => {
    // Simulate map loading
    const timer = setTimeout(() => {
      setMapLoaded(true);
      if (mapRef.current) {
        console.log("Initialize world map with geographic risk data", geoData);
      }
    }, 800);
    
    return () => clearTimeout(timer);
  }, [geoData]);

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
          className="h-80 bg-blue-50 dark:bg-slate-900 rounded-lg border border-border dark:border-border relative overflow-hidden"
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
              {/* Enhanced World Map with Better Geography */}
              <div className="absolute inset-0 bg-gradient-to-b from-blue-100 to-blue-200 dark:from-slate-800 dark:to-slate-700">
                {/* Detailed World Map SVG */}
                <svg viewBox="0 0 1000 500" className="w-full h-full">
                  {/* Ocean Background */}
                  <rect width="1000" height="500" fill="#3B82F6" fillOpacity="0.1" />
                  
                  {/* Continents with better shapes */}
                  <g fill="currentColor" className="text-green-600 dark:text-green-400" fillOpacity="0.8">
                    {/* North America */}
                    <path d="M120 60 L140 50 L200 45 L280 60 L320 80 L300 120 L280 140 L200 170 L160 160 L140 140 L100 120 L110 90 Z" />
                    {/* South America */}
                    <path d="M190 190 L220 185 L250 200 L260 240 L250 300 L240 350 L220 380 L200 390 L180 370 L170 330 L175 290 L180 250 Z" />
                    {/* Europe */}
                    <path d="M420 50 L480 45 L500 60 L490 80 L480 100 L460 120 L440 130 L420 120 L410 100 L415 75 Z" />
                    {/* Africa */}
                    <path d="M440 130 L480 125 L500 140 L510 180 L500 220 L490 260 L480 300 L460 330 L440 340 L420 330 L410 300 L415 260 L420 220 L425 180 Z" />
                    {/* Asia */}
                    <path d="M500 40 L600 35 L700 45 L780 60 L820 100 L800 140 L780 180 L750 200 L700 190 L650 180 L600 170 L550 160 L520 140 L510 100 Z" />
                    {/* Australia */}
                    <path d="M680 300 L750 295 L780 310 L770 330 L750 340 L720 335 L690 330 Z" />
                    {/* Russia */}
                    <path d="M500 70 L800 60 L850 80 L830 120 L800 140 L750 135 L700 130 L650 125 L600 120 L550 115 L520 100 Z" />
                  </g>
                </svg>
              </div>

              {/* Show message when no data */}
              {(!geoData || geoData.length === 0) ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-lg p-6 border border-border">
                    <div className="text-4xl mb-3">🌍</div>
                    <h3 className="text-lg font-medium text-card-foreground dark:text-card-foreground mb-2">
                      No Geographic Data Available
                    </h3>
                    <p className="text-sm text-muted-foreground dark:text-muted-foreground max-w-md">
                      Country-wise risk data will appear here once transactions start flowing through your APIs. 
                      Each transaction's sender IP will be mapped to show regional risk patterns.
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Real Risk Data Points from API */}
                  {geoData.map((location, index) => {
                    const getRiskColor = (score: number) => {
                      if (score >= 70) return "bg-red-500";
                      if (score >= 40) return "bg-yellow-500";
                      return "bg-green-500";
                    };
                    
                    const getRiskSize = (score: number) => {
                      const baseSize = Math.min(Math.max(location.transaction_count / 100, 1), 6);
                      return `w-${Math.ceil(baseSize)} h-${Math.ceil(baseSize)}`;
                    };

                    // Convert lat/lng to map coordinates (simplified projection)
                    const x = ((location.longitude + 180) / 360) * 100;
                    const y = ((90 - location.latitude) / 180) * 100;

                    return (
                      <div
                        key={location.country}
                        className={`absolute w-3 h-3 ${getRiskColor(location.risk_score)} rounded-full border-2 border-white shadow-lg cursor-pointer hover:scale-150 transition-all duration-200 hover:z-10`}
                        style={{ 
                          left: `${Math.max(5, Math.min(95, x))}%`,
                          top: `${Math.max(5, Math.min(95, y))}%`,
                          transform: 'translate(-50%, -50%)'
                        }}
                        title={`${location.country}: Risk ${location.risk_score.toFixed(1)}% (${location.transaction_count} transactions)`}
                      />
                    );
                  })}

                  {/* Statistics overlay */}
                  <div className="absolute bottom-4 right-4 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm rounded-lg p-3 border border-border shadow-lg">
                    <div className="text-xs text-muted-foreground mb-1">Total Countries</div>
                    <div className="text-lg font-bold text-card-foreground">{geoData.length}</div>
                    <div className="text-xs text-muted-foreground mt-2">Total Transactions</div>
                    <div className="text-sm font-semibold text-card-foreground">
                      {geoData.reduce((sum, item) => sum + item.transaction_count, 0).toLocaleString()}
                    </div>
                  </div>
                </>
              )}
            </>
          )}
          
          {/* Risk level indicators */}
          <div className="absolute top-4 right-4 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm rounded-lg p-3 border border-border shadow-lg">
            <div className="text-xs font-semibold text-card-foreground mb-2">Risk Levels</div>
            <div className="space-y-1.5">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-xs text-card-foreground">High (70%+)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-xs text-card-foreground">Medium (40-69%)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-xs text-card-foreground">Low (0-39%)</span>
              </div>
            </div>
          </div>

          {/* Interactive map controls */}
          <div className="absolute bottom-4 left-4 flex flex-col space-y-1">
            <button className="w-8 h-8 bg-white/95 hover:bg-white dark:bg-slate-800/95 dark:hover:bg-slate-800 border border-border rounded flex items-center justify-center text-sm font-bold shadow transition-colors">
              +
            </button>
            <button className="w-8 h-8 bg-white/95 hover:bg-white dark:bg-slate-800/95 dark:hover:bg-slate-800 border border-border rounded flex items-center justify-center text-sm font-bold shadow transition-colors">
              −
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
