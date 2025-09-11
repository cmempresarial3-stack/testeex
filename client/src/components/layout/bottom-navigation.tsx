import { Home, BookOpen, Music, Store, Settings } from "lucide-react";
import { Link, useLocation } from "wouter";

export function BottomNavigation() {
  const [location] = useLocation();

  const navItems = [
    { path: "/", icon: Home, label: "Início" },
    { path: "/bible", icon: BookOpen, label: "Bíblia" },
    { path: "/hymnal", icon: Music, label: "Hinário" },
    { path: "/store", icon: Store, label: "Loja" },
    { path: "/settings", icon: Settings, label: "Config" },
  ];

  return (
    <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 max-w-[428px] w-full bg-card border-t border-border z-40">
      <div className="flex items-center justify-around p-4">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location === path;
          return (
            <Link
              key={path}
              href={path}
              className={`flex flex-col items-center space-y-1 transition-colors ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-primary"
              }`}
              data-testid={`nav-${label.toLowerCase()}`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs">{label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
