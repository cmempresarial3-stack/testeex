import { useState } from "react";
import { useLocation } from "wouter";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MobileContainer } from "@/components/ui/mobile-container";
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

export default function Quiz() {
  const { user } = useApp();
  const [, setLocation] = useLocation();
  const [selectedEmotion, setSelectedEmotion] = useState<Emotion | null>(null);
  const [showResponse, setShowResponse] = useState(false);
  const [responseVerse, setResponseVerse] = useState<any>(null);

  const handleEmotionSelect = (emotion: Emotion) => {
    setSelectedEmotion(emotion);
    const verse = getVerseForEmotion(emotion);
    setResponseVerse(verse);
    setShowResponse(true);

    // Store response (in a real app, this would be more sophisticated)
    setTimeout(() => {
      setLocation("/");
    }, 5000);
  };

  const userName = user?.name || "Amigo";

  if (showResponse && responseVerse) {
    return (
      <MobileContainer>
        <div className="min-h-screen flex flex-col justify-center p-6">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <Heart className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">Deus tem uma palavra para você</h2>
            <p className="text-muted-foreground">Baseado em como você está se sentindo</p>
          </div>

          <Card className="shadow-sm">
            <CardContent className="p-6">
              <p className="bible-verse text-lg mb-4 text-center" data-testid="text-response-verse">
                "{responseVerse.text}"
              </p>
              <p className="text-center text-sm text-muted-foreground" data-testid="text-response-reference">
                {responseVerse.reference}
              </p>
            </CardContent>
          </Card>

          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Retornando à tela inicial em alguns segundos...
            </p>
            <Button 
              onClick={() => setLocation("/")} 
              variant="outline"
              data-testid="button-return-home"
            >
              Voltar agora
            </Button>
          </div>
        </div>
      </MobileContainer>
    );
  }

  return (
    <MobileContainer>
      <div className="min-h-screen flex flex-col justify-center p-6">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
            <Heart className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-semibold mb-2" data-testid="text-quiz-greeting">
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
              data-testid={`button-emotion-${emotion.id}`}
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
          onClick={() => setLocation("/")} 
          className="w-full mt-8 text-muted-foreground"
          data-testid="button-answer-later"
        >
          Responder depois
        </Button>
      </div>
    </MobileContainer>
  );
}
