import { Shield, ChartLine, ArrowLeftRight, AlertTriangle, FolderOpen, ShieldQuestion, FileText, Key, Settings, CreditCard, User, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useInlineSection } from "@/hooks/useInlineSection";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const { toggleSection, isOpen } = useInlineSection();

  const navigationItems = [
    { icon: ChartLine, label: "Dashboard", href: "#", active: true },
    { icon: ArrowLeftRight, label: "Transactions", href: "#" },
    { icon: AlertTriangle, label: "Alerts", href: "#" },
    { icon: FolderOpen, label: "Cases", href: "#" },
    { icon: ShieldQuestion, label: "Sanctions & PEP", href: "#" },
    { icon: FileText, label: "Reports", href: "#" },
  ];

  const managementItems = [
    { icon: Key, label: "API Management", sectionId: "api", testId: "toggle-api-section" },
    { icon: Settings, label: "Settings", sectionId: "settings", testId: "toggle-settings-section" },
    { icon: CreditCard, label: "Billing", sectionId: "billing", testId: "toggle-billing-section" },
    { icon: User, label: "Profile", sectionId: "profile", testId: "toggle-profile-section" },
  ];

  return (
    <div className={cn("hidden lg:flex lg:flex-shrink-0", className)}>
      <div className="flex flex-col w-64 bg-card dark:bg-card border-r border-border dark:border-border">
        {/* Logo */}
        <div className="flex items-center h-16 px-6 border-b border-border dark:border-border">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary dark:bg-primary rounded-lg flex items-center justify-center">
              <Shield className="text-primary-foreground dark:text-primary-foreground text-sm w-4 h-4" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-card-foreground dark:text-card-foreground">AML Dashboard</h1>
              <p className="text-xs text-muted-foreground dark:text-muted-foreground">Anti-Money Laundering</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <div className="space-y-1">
            {navigationItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                className={cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  item.active
                    ? "bg-accent dark:bg-accent text-accent-foreground dark:text-accent-foreground"
                    : "text-muted-foreground dark:text-muted-foreground hover:bg-accent dark:hover:bg-accent hover:text-accent-foreground dark:hover:text-accent-foreground"
                )}
              >
                <item.icon className="mr-3 text-sm w-4 h-4" />
                {item.label}
              </a>
            ))}
          </div>

          <div className="pt-4">
            <h3 className="px-3 text-xs font-semibold text-muted-foreground dark:text-muted-foreground uppercase tracking-wider">Management</h3>
            <div className="mt-2 space-y-1">
              {managementItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => toggleSection(item.sectionId)}
                  data-testid={item.testId}
                  className="flex items-center w-full px-3 py-2 text-sm font-medium text-muted-foreground dark:text-muted-foreground hover:bg-accent dark:hover:bg-accent hover:text-accent-foreground dark:hover:text-accent-foreground rounded-md transition-colors"
                >
                  <item.icon className="mr-3 text-sm w-4 h-4" />
                  {item.label}
                  <ChevronDown className={cn(
                    "ml-auto text-xs w-3 h-3 transition-transform",
                    isOpen(item.sectionId) && "rotate-180"
                  )} />
                </button>
              ))}
            </div>
          </div>
        </nav>

        {/* User info */}
        <div className="p-4 border-t border-border dark:border-border">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-secondary dark:bg-secondary rounded-full flex items-center justify-center">
              <User className="text-secondary-foreground dark:text-secondary-foreground text-sm w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-card-foreground dark:text-card-foreground truncate">John Doe</p>
              <p className="text-xs text-muted-foreground dark:text-muted-foreground truncate">john@fintech.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
