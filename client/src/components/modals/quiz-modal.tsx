import { useState, useEffect } from "react";
import { Heart, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useApp } from "@/context/app-context";
import { getVerseForEmotion } from "@/data/bible-verses";

type Emotion = 'alegre' | 'preocupado' | 'triste' | 'esperancoso' | 'grato';

const emotions = [
  { 
    id: 'alegre' as Emotion, 
    emoji: '😊', 
    title: 'Alegre', 
    description: 'Gratidão e felicidade' 
  },
  { 
    id: 'preocupado' as Emotion, 
    emoji: '😟', 
    title: 'Preocupado', 
    description: 'Ansiedade e preocupações' 
  },
  { 
    id: 'triste' as Emotion, 
    emoji: '😢', 
    title: 'Triste', 
    description: 'Precisando de conforto' 
  },
  { 
    id: 'esperancoso' as Emotion, 
    emoji: '🙏', 
    title: 'Esperançoso', 
    description: 'Fé e expectativa' 
  },
  { 
    id: 'grato' as Emotion, 
    emoji: '🤲', 
    title: 'Grato', 
    description: 'Reconhecendo bênçãos' 
  }
];

export function QuizModal() {
  const { user } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedEmotion, setSelectedEmotion] = useState<Emotion | null>(null);
  const [showResponse, setShowResponse] = useState(false);
  const [responseVerse, setResponseVerse] = useState<any>(null);

  useEffect(() => {
    const handleShowQuizModal = () => {
      setIsOpen(true);
      setSelectedEmotion(null);
      setShowResponse(false);
      setResponseVerse(null);
    };

    window.addEventListener('show-quiz-modal', handleShowQuizModal);
    return () => window.removeEventListener('show-quiz-modal', handleShowQuizModal);
  }, []);

  const handleEmotionSelect = (emotion: Emotion) => {
    setSelectedEmotion(emotion);
    const verse = getVerseForEmotion(emotion);
    setResponseVerse(verse);
    setShowResponse(true);

    // Auto-close after 8 seconds
    setTimeout(() => {
      setIsOpen(false);
    }, 8000);
  };

  const handleClose = () => {
    setIsOpen(false);
    setSelectedEmotion(null);
    setShowResponse(false);
    setResponseVerse(null);
  };

  const userName = user?.name || "Amigo";

  if (showResponse && responseVerse) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-[95vw] w-full mx-auto">
          <div className="absolute right-4 top-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="h-6 w-6"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="text-center p-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <Heart className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Deus tem uma palavra para você</h2>
            <p className="text-muted-foreground mb-6">Baseado em como você está se sentindo</p>

            <Card className="shadow-sm mb-6">
              <CardContent className="p-6">
                <p className="bible-verse text-lg mb-4 text-center">
                  "{responseVerse.text}"
                </p>
                <p className="text-center text-sm text-muted-foreground">
                  {responseVerse.reference}
                </p>
              </CardContent>
            </Card>

            <p className="text-sm text-muted-foreground mb-4">
              Esta janela se fechará automaticamente em alguns segundos...
            </p>
            <Button onClick={handleClose} variant="outline" size="sm">
              Fechar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-[95vw] w-full mx-auto max-h-[90vh] overflow-y-auto">
        <div className="absolute right-4 top-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="h-6 w-6"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <Heart className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-xl font-semibold mb-2">
              Oi {userName}, como você está se sentindo hoje?
            </h2>
            <p className="text-muted-foreground">Sua resposta nos ajuda a conectar você com a palavra certa</p>
          </div>

          <div className="space-y-3">
            {emotions.map((emotion) => (
              <Card 
                key={emotion.id}
                className="quiz-option cursor-pointer hover:border-primary hover:shadow-md transition-all"
                onClick={() => handleEmotionSelect(emotion.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{emotion.emoji}</span>
                    <div>
                      <h4 className="font-medium">{emotion.title}</h4>
                      <p className="text-sm text-muted-foreground">{emotion.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Button 
            variant="ghost" 
            onClick={handleClose} 
            className="w-full mt-6 text-muted-foreground"
          >
            Responder depois
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}