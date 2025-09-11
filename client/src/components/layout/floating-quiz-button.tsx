import { MessageCircle } from "lucide-react";
import { Link } from "wouter";

export function FloatingQuizButton() {
  return (
    <Link 
      href="/quiz"
      className="fixed bottom-24 right-5 bg-secondary text-secondary-foreground w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center z-50"
      data-testid="button-quiz-float"
    >
      <MessageCircle className="w-6 h-6" />
    </Link>
  );
}
