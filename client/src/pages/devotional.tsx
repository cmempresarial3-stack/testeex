import { useState } from "react";
import { ChevronLeft, ChevronRight, Heart, Share2, Bookmark, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MobileContainer } from "@/components/ui/mobile-container";
import { getTodayDevotional, getFullDevotional, type DailyDevotional } from "@/data/devotionals";
import { useApp } from "@/context/app-context";
import { Link } from "wouter";

export default function Devotional() {
  const { user } = useApp();
  const [currentIndex, setCurrentIndex] = useState(() => {
    // Start with today's devotional
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
    return dayOfYear % 3; // Using 3 devotionals for now
  });

  const currentDevotional = getFullDevotional(currentIndex + 1);
  const userName = user?.name || "Amigo";

  const nextDevotional = () => {
    setCurrentIndex((prev) => (prev + 1) % 3); // Using 3 devotionals for now
  };

  const previousDevotional = () => {
    setCurrentIndex((prev) => (prev - 1 + 3) % 3); // Using 3 devotionals for now
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    
    if (date.toDateString() === today.toDateString()) {
      return "Hoje";
    } else {
      return date.toLocaleDateString('pt-BR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    }
  };

  const isToday = currentIndex === Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000) % 3;

  return (
    <MobileContainer>
      <div className="p-4 pb-24">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link href="/">
            <Button variant="ghost" size="icon" data-testid="button-back-home">
              <ChevronLeft className="w-5 h-5" />
            </Button>
          </Link>
          
          <div className="text-center">
            <h2 className="text-xl font-bold">Devocional</h2>
            <p className="text-sm text-muted-foreground">
              {isToday ? "Hoje" : `${currentIndex + 1} de 3`}
            </p>
          </div>

          <div className="flex space-x-1">
            <Button variant="ghost" size="icon" data-testid="button-bookmark">
              <Bookmark className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" data-testid="button-share">
              <Share2 className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Devotional Card */}
        <Card className="devotional-card mb-6 shadow-lg">
          <CardContent className="p-6">
            {/* Date and greeting */}
            <div className="text-center mb-6">
              <div className="flex items-center justify-center mb-2">
                <CalendarIcon className="w-5 h-5 text-primary mr-2" />
                <span className="text-sm font-medium text-primary">
                  {new Date().toLocaleDateString('pt-BR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </span>
              </div>
              <h1 className="text-2xl font-bold mb-2" data-testid="text-devotional-title">
                {currentDevotional.theme}
              </h1>
              <p className="text-muted-foreground">
                De: Deus, Para: {userName}
              </p>
            </div>

            {/* Bible Verse */}
            <Card className="mb-6 bg-primary/5 border-primary/20">
              <CardContent className="p-4">
                <div className="flex items-center mb-3">
                  <Heart className="w-5 h-5 text-primary mr-2" />
                  <span className="text-sm font-medium text-primary">Versículo base</span>
                </div>
                <p className="bible-verse text-lg mb-3 font-medium" data-testid="text-devotional-verse">
                  "{currentDevotional.verse.text}"
                </p>
                <p className="text-sm text-muted-foreground text-right" data-testid="text-devotional-reference">
                  {currentDevotional.verse.reference}
                </p>
              </CardContent>
            </Card>

            {/* Devotional Content */}
            <div className="space-y-4">
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <p className="text-base leading-relaxed" data-testid="text-devotional-content">
                  {currentDevotional.reflection}
                </p>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-6 mb-4">
              <Button 
                variant="outline" 
                onClick={previousDevotional}
                className="flex items-center justify-center"
                size="icon"
                data-testid="button-previous-devotional"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>

              <div className="flex space-x-1">
                {[0, 1, 2].map((index: number) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentIndex 
                        ? 'bg-primary' 
                        : 'bg-muted hover:bg-muted-foreground'
                    }`}
                    data-testid={`dot-${index}`}
                  />
                ))}
              </div>

              <Button 
                variant="outline" 
                onClick={nextDevotional}
                className="flex items-center justify-center"
                size="icon"
                data-testid="button-next-devotional"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            {/* Reflection Questions */}
            <Card className="mt-6 bg-secondary/5 border-secondary/20">
              <CardContent className="p-4">
                <h4 className="font-semibold mb-3 text-secondary">Para Reflexão:</h4>
                <ul className="space-y-2 text-sm">
                  {currentDevotional.questions.map((question: string, index: number) => (
                    <li key={index}>• {question}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Prayer Suggestion */}
            <Card className="mt-4 bg-accent/5 border-accent/20">
              <CardContent className="p-4">
                <h4 className="font-semibold mb-2 text-accent">Oração:</h4>
                <p className="text-sm italic">
                  {currentDevotional.prayer}
                </p>
              </CardContent>
            </Card>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <Card className="mt-6">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground mb-3">
              Gostou deste devocional? Compartilhe a bênção!
            </p>
            <div className="flex space-x-2 justify-center">
              <Button variant="outline" size="sm" data-testid="button-share-whatsapp">
                Compartilhar
              </Button>
              <Link href="/notes">
                <Button variant="outline" size="sm" data-testid="button-make-note">
                  Fazer Anotação
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </MobileContainer>
  );
}