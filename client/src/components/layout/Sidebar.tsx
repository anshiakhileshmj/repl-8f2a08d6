import { Shield, ChartLine, ArrowLeftRight, AlertTriangle, FolderOpen, ShieldQuestion, FileText, Key, Settings, CreditCard, User, ChevronDown, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useInlineSection } from "@/hooks/useInlineSection";
import { Link, useLocation } from "wouter";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const { toggleSection, isOpen } = useInlineSection();
  const [location] = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navigationItems = [
    { icon: ChartLine, label: "Dashboard", href: "/" },
    { icon: ArrowLeftRight, label: "Transactions", href: "/transactions" },
    { icon: AlertTriangle, label: "Alerts", href: "/alerts" },
    { icon: FolderOpen, label: "Cases", href: "/cases" },
    { icon: ShieldQuestion, label: "Sanctions & PEP", href: "/sanctions" },
    { icon: FileText, label: "Reports", href: "/reports" },
  ];

  const managementItems = [
    { icon: Key, label: "API Management", href: "/api-management" },
    { icon: Settings, label: "Settings", href: "/settings" },
    { icon: CreditCard, label: "Billing", href: "/billing" },
    { icon: User, label: "Profile", href: "/profile" },
  ];

  return (
    <div className={cn("hidden lg:flex lg:flex-shrink-0", className)}>
      <div className={cn(
        "flex flex-col bg-card dark:bg-card border-r border-border dark:border-border transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}>
        {/* Logo */}
        <div className="flex items-center h-16 px-6 border-b border-border dark:border-border">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary dark:bg-primary rounded-lg flex items-center justify-center">
                <Shield className="text-primary-foreground dark:text-primary-foreground text-sm w-4 h-4" />
              </div>
              {!isCollapsed && (
                <div>
                  <h1 className="text-lg font-semibold text-card-foreground dark:text-card-foreground">AML Dashboard</h1>
                  <p className="text-xs text-muted-foreground dark:text-muted-foreground">Anti-Money Laundering</p>
                </div>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1.5 h-auto"
              data-testid="button-toggle-sidebar"
            >
              {isCollapsed ? <Menu className="w-4 h-4" /> : <X className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <div className="space-y-1">
            {navigationItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                className={cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  location === item.href
                    ? "bg-accent dark:bg-accent text-accent-foreground dark:text-accent-foreground"
                    : "text-muted-foreground dark:text-muted-foreground hover:bg-accent dark:hover:bg-accent hover:text-accent-foreground dark:hover:text-accent-foreground",
                  isCollapsed && "justify-center"
                )}
                title={isCollapsed ? item.label : undefined}
              >
                <item.icon className={cn("text-sm w-4 h-4", !isCollapsed && "mr-3")} />
                {!isCollapsed && item.label}
              </Link>
            ))}
          </div>

          <div className="pt-4">
            {!isCollapsed && (
              <h3 className="px-3 text-xs font-semibold text-muted-foreground dark:text-muted-foreground uppercase tracking-wider">Management</h3>
            )}
            <div className="mt-2 space-y-1">
              {managementItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                  className={cn(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    location === item.href
                      ? "bg-accent dark:bg-accent text-accent-foreground dark:text-accent-foreground"
                      : "text-muted-foreground dark:text-muted-foreground hover:bg-accent dark:hover:bg-accent hover:text-accent-foreground dark:hover:text-accent-foreground",
                    isCollapsed && "justify-center"
                  )}
                  title={isCollapsed ? item.label : undefined}
                >
                  <item.icon className={cn("text-sm w-4 h-4", !isCollapsed && "mr-3")} />
                  {!isCollapsed && item.label}
                </Link>
              ))}
            </div>
          </div>
        </nav>

        {/* User info */}
        <div className="p-4 border-t border-border dark:border-border">
          <div className={cn("flex items-center", isCollapsed ? "justify-center" : "space-x-3")}>
            <div className="w-8 h-8 bg-secondary dark:bg-secondary rounded-full flex items-center justify-center">
              <User className="text-secondary-foreground dark:text-secondary-foreground text-sm w-4 h-4" />
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-card-foreground dark:text-card-foreground truncate">John Doe</p>
                <p className="text-xs text-muted-foreground dark:text-muted-foreground truncate">john@fintech.com</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
