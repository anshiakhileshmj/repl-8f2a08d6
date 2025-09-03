import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, FolderOpen, ShieldQuestion, BarChart3, TrendingUp, TrendingDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface MetricCardProps {
  title: string;
  value: string | number;
  change: string;
  changeType: "positive" | "negative";
  icon: React.ReactNode;
  iconBgColor: string;
}

function MetricCard({ title, value, change, changeType, icon, iconBgColor }: MetricCardProps) {
  const TrendIcon = changeType === "positive" ? TrendingUp : TrendingDown;
  const trendColor = changeType === "positive" ? "text-chart-2 dark:text-chart-2" : "text-destructive dark:text-destructive";

  return (
    <Card className="bg-card dark:bg-card border-border dark:border-border">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground dark:text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold text-card-foreground dark:text-card-foreground" data-testid={`metric-${title.toLowerCase().replace(/\s+/g, '-')}`}>
              {value}
            </p>
            <p className={`text-xs mt-1 ${trendColor}`}>
              <TrendIcon className="inline w-3 h-3 mr-1" />
              {change}
            </p>
          </div>
          <div className={`w-12 h-12 ${iconBgColor} rounded-lg flex items-center justify-center`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function MetricsCards() {
  const { data: metrics, isLoading } = useQuery({
    queryKey: ["/api/metrics"],
    enabled: true,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="bg-card dark:bg-card border-border dark:border-border">
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-muted dark:bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-muted dark:bg-muted rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-muted dark:bg-muted rounded w-1/4"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Default values if no data
  const defaultMetrics = {
    highRiskCount: 247,
    activeCases: 52,
    sanctionsMatches: 8,
    apiCalls: 45231,
  };

  const metricsData = metrics || defaultMetrics;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <MetricCard
        title="High Risk Transactions"
        value={metricsData.highRiskCount || defaultMetrics.highRiskCount}
        change="+12% from last week"
        changeType="negative"
        icon={<AlertTriangle className="text-destructive dark:text-destructive w-6 h-6" />}
        iconBgColor="bg-destructive/10 dark:bg-destructive/10"
      />
      
      <MetricCard
        title="Active Cases"
        value={metricsData.activeCases || defaultMetrics.activeCases}
        change="-3% from last week"
        changeType="positive"
        icon={<FolderOpen className="text-chart-2 dark:text-chart-2 w-6 h-6" />}
        iconBgColor="bg-chart-2/10 dark:bg-chart-2/10"
      />
      
      <MetricCard
        title="Sanctions Matches"
        value={metricsData.sanctionsMatches || defaultMetrics.sanctionsMatches}
        change="+2 new today"
        changeType="negative"
        icon={<ShieldQuestion className="text-chart-3 dark:text-chart-3 w-6 h-6" />}
        iconBgColor="bg-chart-3/10 dark:bg-chart-3/10"
      />
      
      <MetricCard
        title="API Calls Today"
        value={(metricsData.apiCalls || defaultMetrics.apiCalls).toLocaleString()}
        change="+18% from yesterday"
        changeType="positive"
        icon={<BarChart3 className="text-chart-1 dark:text-chart-1 w-6 h-6" />}
        iconBgColor="bg-chart-1/10 dark:bg-chart-1/10"
      />
    </div>
  );
}
