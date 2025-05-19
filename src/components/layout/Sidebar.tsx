
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Home,
  FileText,
  Settings,
  FileEdit,
  BookOpen,
  Users,
  UserCog,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const navItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: <Home className="h-4 w-4" />,
    },
    {
      title: "Patent Forms",
      href: "/forms",
      icon: <FileText className="h-4 w-4" />,
    },
    {
      title: "Patent Drafting",
      href: "/drafting",
      icon: <FileEdit className="h-4 w-4" />,
    },
    {
      title: "Filing Guide",
      href: "/filing-guide",
      icon: <BookOpen className="h-4 w-4" />,
    },
    {
      title: "Agent Details",
      href: "/agent-details",
      icon: <UserCog className="h-4 w-4" />,
    },
    {
      title: "Settings",
      href: "/settings",
      icon: <Settings className="h-4 w-4" />,
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
            {item.icon}
            {!collapsed && <span className="ml-2">{item.title}</span>}
          </Link>
        ))}
      </div>

      <div className="p-4">
        <Button
          variant="outline"
          size={collapsed ? "icon" : "default"}
          className="w-full"
          asChild
        >
          <Link to="/forms">
            {collapsed ? (
              <FileText className="h-4 w-4" />
            ) : (
              <>
                <FileText className="mr-2 h-4 w-4" />
                New Application
              </>
            )}
          </Link>
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
