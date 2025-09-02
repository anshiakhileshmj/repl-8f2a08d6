import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Plus, Copy, RotateCcw, Trash2, CheckCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useInlineSection } from "@/hooks/useInlineSection";
import { ApiKey } from "@shared/schema";

export function ApiManagement() {
  const { isOpen } = useInlineSection();
  const { data: apiKeys, isLoading } = useQuery<ApiKey[]>({
    queryKey: ["/api/api-keys"],
    enabled: isOpen("api"),
  });

  const { data: usage } = useQuery({
    queryKey: ["/api/api-usage"],
    enabled: isOpen("api"),
  });

  if (!isOpen("api")) return null;

  const defaultUsage = {
    callsThisMonth: 1245678,
    limit: 1670000,
    avgResponseTime: 125,
    successRate: 99.8,
  };

  const usageData = usage || defaultUsage;
  const usagePercentage = (usageData.callsThisMonth / usageData.limit) * 100;

  return (
    <Card className="bg-card dark:bg-card border-border dark:border-border" data-testid="api-management-section">
      <CardHeader>
        <CardTitle className="text-card-foreground dark:text-card-foreground">API Management</CardTitle>
        <p className="text-sm text-muted-foreground dark:text-muted-foreground">Manage your API keys, monitor usage, and configure access</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* API Keys */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-md font-medium text-card-foreground dark:text-card-foreground">API Keys</h4>
              <Button size="sm" data-testid="create-api-key">
                <Plus className="mr-2 w-4 h-4" />
                Create New Key
              </Button>
            </div>
            <div className="space-y-3">
              {isLoading ? (
                Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="animate-pulse p-4 bg-muted/30 dark:bg-muted/30 rounded-lg border border-border dark:border-border">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="h-4 bg-muted dark:bg-muted rounded w-1/2 mb-2"></div>
                        <div className="h-3 bg-muted dark:bg-muted rounded w-3/4 mb-1"></div>
                        <div className="h-3 bg-muted dark:bg-muted rounded w-1/4"></div>
                      </div>
                      <div className="flex space-x-2">
                        <div className="w-8 h-8 bg-muted dark:bg-muted rounded"></div>
                        <div className="w-8 h-8 bg-muted dark:bg-muted rounded"></div>
                        <div className="w-8 h-8 bg-muted dark:bg-muted rounded"></div>
                      </div>
                    </div>
                  </div>
                ))
              ) : apiKeys && apiKeys.length > 0 ? (
                apiKeys.map((apiKey) => (
                  <div
                    key={apiKey.id}
                    className="p-4 bg-muted/30 dark:bg-muted/30 rounded-lg border border-border dark:border-border"
                    data-testid={`api-key-${apiKey.id}`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-card-foreground dark:text-card-foreground">{apiKey.name}</p>
                        <p className="text-xs text-muted-foreground dark:text-muted-foreground font-mono">{apiKey.keyPreview}</p>
                        <p className="text-xs text-muted-foreground dark:text-muted-foreground mt-1">
                          Created: {new Date(apiKey.createdAt!).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm" className="p-2" data-testid={`copy-key-${apiKey.id}`}>
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="p-2" data-testid={`rotate-key-${apiKey.id}`}>
                          <RotateCcw className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="p-2 text-destructive hover:text-destructive" data-testid={`delete-key-${apiKey.id}`}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground dark:text-muted-foreground">No API keys found</p>
                </div>
              )}
            </div>
          </div>

          {/* Usage Metrics */}
          <div>
            <h4 className="text-md font-medium text-card-foreground dark:text-card-foreground mb-4">Usage Metrics</h4>
            <div className="space-y-4">
              <div className="p-4 bg-muted/30 dark:bg-muted/30 rounded-lg border border-border dark:border-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground dark:text-muted-foreground">API Calls This Month</span>
                  <span className="text-sm font-medium text-card-foreground dark:text-card-foreground" data-testid="api-calls-count">
                    {usageData.callsThisMonth.toLocaleString()}
                  </span>
                </div>
                <Progress value={usagePercentage} className="mb-2" />
                <p className="text-xs text-muted-foreground dark:text-muted-foreground">
                  {Math.round(usagePercentage)}% of limit ({usageData.limit.toLocaleString()})
                </p>
              </div>
              
              <div className="p-4 bg-muted/30 dark:bg-muted/30 rounded-lg border border-border dark:border-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground dark:text-muted-foreground">Average Response Time</span>
                  <span className="text-sm font-medium text-card-foreground dark:text-card-foreground" data-testid="avg-response-time">
                    {usageData.avgResponseTime}ms
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="text-chart-2 dark:text-chart-2 w-4 h-4" />
                  <span className="text-xs text-chart-2 dark:text-chart-2">Excellent performance</span>
                </div>
              </div>
              
              <div className="p-4 bg-muted/30 dark:bg-muted/30 rounded-lg border border-border dark:border-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground dark:text-muted-foreground">Success Rate</span>
                  <span className="text-sm font-medium text-card-foreground dark:text-card-foreground" data-testid="success-rate">
                    {usageData.successRate}%
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="text-chart-2 dark:text-chart-2 w-4 h-4" />
                  <span className="text-xs text-chart-2 dark:text-chart-2">High reliability</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
