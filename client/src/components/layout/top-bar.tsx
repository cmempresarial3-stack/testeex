import { Heart } from "lucide-react";

export function TopBar() {
  return (
    <div className="fixed top-0 left-1/2 transform -translate-x-1/2 max-w-[428px] w-full bg-card/95 backdrop-blur-sm border-b border-border/50 z-50">
      <div className="flex items-center justify-center px-4 py-3">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
            <Heart className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-sm font-medium text-muted-foreground tracking-wide">
            Verso & Paz
          </span>
        </div>
      </div>
    </div>
  );
}