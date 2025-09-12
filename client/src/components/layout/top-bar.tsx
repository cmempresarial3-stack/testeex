import { Heart } from "lucide-react";

export function TopBar() {
  return (
    <div className="bg-background border-b border-border/30">
      <div className="flex items-center justify-center px-4 py-3">
        <div className="flex items-center space-x-2">
          <span className="text-lg">🕊️</span>
          <span className="text-sm font-medium text-muted-foreground tracking-wide">
            Verso & Paz
          </span>
        </div>
      </div>
    </div>
  );
}