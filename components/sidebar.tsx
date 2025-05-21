"use client";

import { Home, Plus, Settings, LayoutDashboard, Code, Mail, Info, ChevronLeft, ChevronRight } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

import { cn } from "@/lib/utils";
import { useProModal } from "@/hooks/use-pro-modal";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface SidebarProps {
  isPro: boolean;
}

export const Sidebar = ({
  isPro
}: SidebarProps) => {
  const proModal = useProModal();
  const router = useRouter();
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const onNavigate = (url: string, pro: boolean) => {
    if (pro && !isPro) {
      return proModal.onOpen();
    }

    return router.push(url);
  }

  const mainRoutes = [
    {
      icon: Home,
      href: '/',
      label: "Home",
      pro: false,
    },
    {
      icon: LayoutDashboard,
      href: '/dashboard',
      label: "Dashboard",
      pro: false,
      badge: "New"
    },
    {
      icon: Code,
      href: '/sessions',
      label: "Live Sessions",
      pro: false,
    },
  ];

  const secondaryRoutes = [
    {
      icon: Plus,
      href: '/companion/new',
      label: "Create",
      pro: true,
    },
    {
      icon: Mail,
      href: '/contacts',
      label: "Contact",
      pro: false,
    },
    {
      icon: Info,
      href: '/about',
      label: "About",
      pro: false,
    },
  ];

  const settingsRoutes = [
    {
      icon: Settings,
      href: '/settings',
      label: "Settings",
      pro: false,
    },
  ];

  const renderRoutes = (routes: typeof mainRoutes) => (
    <div className="space-y-2">
      {routes.map((route) => (
        <TooltipProvider key={route.href}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                onClick={() => onNavigate(route.href, route.pro)}
                className={cn(
                  "text-muted-foreground text-xs group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-primary hover:bg-primary/10 rounded-lg transition",
                  pathname === route.href && "bg-primary/10 text-primary",
                  isCollapsed && "justify-center"
                )}
              >
                <div className={cn(
                  "flex items-center gap-x-2",
                  isCollapsed ? "flex-col gap-y-2" : "flex-row"
                )}>
                  <route.icon className="h-5 w-5" />
                  {!isCollapsed && (
                    <div className="flex items-center gap-x-2">
                      {route.label}
                      {route.badge && (
                        <Badge variant="secondary" className="ml-auto">
                          {route.badge}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </TooltipTrigger>
            {isCollapsed && (
              <TooltipContent side="right">
                <p>{route.label}</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  );

  return (
    <div className={cn(
      "space-y-4 flex flex-col h-full text-primary bg-secondary transition-all duration-300",
      isCollapsed ? "w-16" : "w-72"
    )}>
      <div className="p-3 flex-1 flex flex-col">
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 hover:bg-primary/10 rounded-lg transition"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        </div>

        {renderRoutes(mainRoutes)}

        <Separator className="my-4" />

        {renderRoutes(secondaryRoutes)}

        <div className="mt-auto">
          <Separator className="my-4" />
          {renderRoutes(settingsRoutes)}
        </div>
      </div>
    </div>
  );
};
