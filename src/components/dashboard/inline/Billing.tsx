import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Download } from "lucide-react";
import { useInlineSection } from "@/hooks/useInlineSection";
import { useQuery } from "@tanstack/react-query";

export function Billing() {
  const { isOpen } = useInlineSection();
  const { data: billingData = {}, isLoading, error } = useQuery({
    queryKey: ["/api/billing"],
    enabled: isOpen("billing"),
    retry: false,
    refetchOnWindowFocus: false,
  });

  if (!isOpen("billing")) return null;

  const defaultBilling = {
    plan: {
      name: "Professional Plan",
      price: 299,
      features: [
        "Up to 2M API calls/month",
        "Real-time transaction monitoring",
        "Advanced risk analytics",
        "24/7 priority support"
      ]
    },
    paymentMethod: {
      type: "Visa",
      last4: "4242",
      expiry: "12/25"
    },
    usage: {
      apiCalls: 1245678,
      apiLimit: 2000000,
      storage: 15.2,
      storageLimit: 100
    },
    invoices: [
      { id: "1", date: "Jan 1, 2024", amount: 299, status: "paid", period: "January 2024" },
      { id: "2", date: "Dec 1, 2023", amount: 299, status: "paid", period: "December 2023" },
      { id: "3", date: "Nov 1, 2023", amount: 99, status: "paid", period: "November 2023" }
    ]
  };

  const billing = billingData || defaultBilling;
  const apiUsagePercentage = (billing.usage.apiCalls / billing.usage.apiLimit) * 100;
  const storageUsagePercentage = (billing.usage.storage / billing.usage.storageLimit) * 100;

  return (
    <Card className="bg-card dark:bg-card border-border dark:border-border" data-testid="billing-section">
      <CardHeader>
        <CardTitle className="text-card-foreground dark:text-card-foreground">Billing & Subscription</CardTitle>
        <p className="text-sm text-muted-foreground dark:text-muted-foreground">Manage your subscription, view invoices, and update payment methods</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Current Plan */}
          <div>
            <h4 className="text-md font-medium text-card-foreground dark:text-card-foreground mb-4">Current Plan</h4>
            <div className="p-6 bg-primary/10 dark:bg-primary/10 border border-primary/20 dark:border-primary/20 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h5 className="text-lg font-semibold text-card-foreground dark:text-card-foreground">{billing.plan.name}</h5>
                  <p className="text-sm text-muted-foreground dark:text-muted-foreground">Advanced AML monitoring and compliance</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-card-foreground dark:text-card-foreground">${billing.plan.price}</p>
                  <p className="text-sm text-muted-foreground dark:text-muted-foreground">/month</p>
                </div>
              </div>
              <div className="space-y-2 mb-4">
                {billing.plan.features.map((feature, index) => (
                  <div key={index} className="flex items-center text-sm text-card-foreground dark:text-card-foreground">
                    <CheckCircle className="text-chart-2 dark:text-chart-2 mr-2 w-4 h-4" />
                    {feature}
                  </div>
                ))}
              </div>
              <div className="flex space-x-3">
                <Button className="flex-1" data-testid="upgrade-plan">
                  Upgrade Plan
                </Button>
                <Button variant="outline" className="flex-1" data-testid="change-plan">
                  Change Plan
                </Button>
              </div>
            </div>
            
            {/* Payment Method */}
            <div className="mt-6">
              <h5 className="text-sm font-medium text-card-foreground dark:text-card-foreground mb-3">Payment Method</h5>
              <div className="p-4 bg-muted/30 dark:bg-muted/30 rounded-lg border border-border dark:border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-chart-1 dark:bg-chart-1 rounded flex items-center justify-center">
                      <span className="text-white text-xs font-bold">V</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-card-foreground dark:text-card-foreground">
                        •••• •••• •••• {billing.paymentMethod.last4}
                      </p>
                      <p className="text-xs text-muted-foreground dark:text-muted-foreground">
                        Expires {billing.paymentMethod.expiry}
                      </p>
                    </div>
                  </div>
                  <Button variant="link" className="text-xs" data-testid="update-payment-method">
                    Update
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Billing History & Usage */}
          <div>
            <h4 className="text-md font-medium text-card-foreground dark:text-card-foreground mb-4">Billing History</h4>
            <div className="space-y-3">
              {billing.invoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="p-4 bg-muted/30 dark:bg-muted/30 rounded-lg border border-border dark:border-border"
                  data-testid={`invoice-${invoice.id}`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-card-foreground dark:text-card-foreground">{invoice.period}</p>
                      <p className="text-xs text-muted-foreground dark:text-muted-foreground">Professional Plan</p>
                      <p className="text-xs text-muted-foreground dark:text-muted-foreground">Paid on {invoice.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-card-foreground dark:text-card-foreground">${invoice.amount}.00</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="secondary" className="text-chart-2 dark:text-chart-2">
                          Paid
                        </Badge>
                        <Button variant="link" className="text-xs p-0 h-auto" data-testid={`download-invoice-${invoice.id}`}>
                          <Download className="mr-1 w-3 h-3" />
                          PDF
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Usage This Month */}
            <div className="mt-6">
              <h5 className="text-sm font-medium text-card-foreground dark:text-card-foreground mb-3">Usage This Month</h5>
              <div className="p-4 bg-muted/30 dark:bg-muted/30 rounded-lg border border-border dark:border-border">
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-muted-foreground dark:text-muted-foreground">API Calls</span>
                      <span className="text-xs text-card-foreground dark:text-card-foreground">
                        {billing.usage.apiCalls.toLocaleString()} / {billing.usage.apiLimit.toLocaleString()}
                      </span>
                    </div>
                    <Progress value={apiUsagePercentage} />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-muted-foreground dark:text-muted-foreground">Storage</span>
                      <span className="text-xs text-card-foreground dark:text-card-foreground">
                        {billing.usage.storage} GB / {billing.usage.storageLimit} GB
                      </span>
                    </div>
                    <Progress value={storageUsagePercentage} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
