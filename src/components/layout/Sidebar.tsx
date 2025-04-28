
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  File,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  Home,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const navItems = [
    {
      title: "Dashboard",
      icon: Home,
      href: "/dashboard",
    },
    {
      title: "Patent Forms",
      icon: FileText,
      href: "/forms",
    },
    {
      title: "Patent Drafting",
      icon: File,
      href: "/drafting",
    },
    {
      title: "Settings",
      icon: Settings,
      href: "/settings",
    },
  ];

  return (
    <div
      className={cn(
        "bg-white border-r border-slate-200 h-full transition-all duration-300 flex flex-col",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="h-16 flex items-center px-4 border-b border-slate-200">
        {!collapsed && (
          <h1 className="font-serif text-lg font-bold text-navy-800">
            Patent Pilot
          </h1>
        )}
        {collapsed && (
          <div className="w-full flex justify-center">
            <span className="font-serif text-lg font-bold text-navy-800">P</span>
          </div>
        )}
      </div>

      <div className="flex-1 py-4 px-2 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              "flex items-center px-2 py-2 rounded-md text-sm font-medium transition-colors",
              location.pathname === item.href
                ? "bg-primary text-primary-foreground"
                : "text-slate-700 hover:bg-secondary hover:text-navy-800"
            )}
          >
            <item.icon className={cn("h-5 w-5", collapsed ? "mx-auto" : "mr-2")} />
            {!collapsed && <span>{item.title}</span>}
          </Link>
        ))}
      </div>

      <div className="p-4">
        <Button
          variant="outline"
          className={cn(
            "w-full justify-center",
            collapsed ? "px-0" : "px-4"
          )}
        >
          <Plus className="h-4 w-4 mr-1" />
          {!collapsed && <span>New Project</span>}
        </Button>
      </div>

      <div className="p-2 border-t border-slate-200">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="w-full h-8"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
}
