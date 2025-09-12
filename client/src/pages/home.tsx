import { useEffect } from "react";
import { Link } from "wouter";
import { Heart, BookOpen, Music, StickyNote, Calendar, Store, Share2, Instagram, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MobileContainer } from "@/components/ui/mobile-container";
import { useApp } from "@/context/app-context";
import { getDailyVerse } from "@/data/bible-verses";
import { getTodayDevotional as getDevotional } from "@/data/devotionals";

export default function Home() {
  const { user } = useApp();
  const dailyVerse = getDailyVerse();
  const todayDevotional = getDevotional();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bom dia";
    if (hour < 18) return "Boa tarde";
    return "Boa noite";
  };

  const userName = user?.name || "Amigo";

  return (
    <MobileContainer>
      <div className="p-4 pb-24">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-semibold" data-testid="text-greeting">
                {getGreeting()}, {userName}
              </h2>
              <p className="text-muted-foreground">Que Deus abençoe seu dia</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
              {user?.photo ? (
                <img src={user.photo} alt="Profile" className="w-12 h-12 rounded-full object-cover" />
              ) : (
                <span className="text-primary-foreground font-semibold">
                  {userName.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Daily Verse */}
        <Card className="mb-6 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center mb-3">
              <Heart className="w-5 h-5 text-secondary mr-2" />
              <h3 className="font-semibold">Verso do Dia</h3>
            </div>
            <p className="bible-verse text-lg mb-3" data-testid="text-daily-verse">
              "{dailyVerse.text}"
            </p>
            <p className="text-sm text-muted-foreground mb-3" data-testid="text-verse-reference">
              {dailyVerse.reference}
            </p>
            <Button variant="ghost" size="sm" className="p-0 h-auto text-primary" data-testid="button-share-verse">
              <Share2 className="w-4 h-4 mr-2" />
              Compartilhar
            </Button>
          </CardContent>
        </Card>

        {/* Daily Devotional */}
        <Card className="devotional-card mb-6 shadow-sm">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-3 flex items-center">
              <BookOpen className="w-5 h-5 text-primary mr-2" />
              Devocional do Dia
            </h3>
            <p className="text-sm text-muted-foreground mb-3" data-testid="text-devotional-preview">
              {todayDevotional.content.substring(0, 100)}...
            </p>
            <Link href="/devotional" className="text-primary text-sm font-medium" data-testid="link-full-devotional">
              Ler completo →
            </Link>
          </CardContent>
        </Card>

        {/* Main Actions Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Link href="/bible">
            <Card className="hover:shadow-md transition-shadow cursor-pointer" data-testid="card-bible">
              <CardContent className="p-6 text-center">
                <BookOpen className="w-8 h-8 text-primary mb-3 mx-auto" />
                <h4 className="font-semibold">Bíblia</h4>
                <p className="text-xs text-muted-foreground">Palavra de Deus</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/hymnal">
            <Card className="hover:shadow-md transition-shadow cursor-pointer" data-testid="card-hymnal">
              <CardContent className="p-6 text-center">
                <Music className="w-8 h-8 text-secondary mb-3 mx-auto" />
                <h4 className="font-semibold">Hinário</h4>
                <p className="text-xs text-muted-foreground">Harpa Cristã</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/notes">
            <Card className="hover:shadow-md transition-shadow cursor-pointer" data-testid="card-notes">
              <CardContent className="p-6 text-center">
                <StickyNote className="w-8 h-8 text-accent mb-3 mx-auto" />
                <h4 className="font-semibold">Anotações</h4>
                <p className="text-xs text-muted-foreground">Suas reflexões</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/calendar">
            <Card className="hover:shadow-md transition-shadow cursor-pointer" data-testid="card-calendar">
              <CardContent className="p-6 text-center">
                <Calendar className="w-8 h-8 text-primary mb-3 mx-auto" />
                <h4 className="font-semibold">Calendário</h4>
                <p className="text-xs text-muted-foreground">Lembretes</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Store Section */}
        <Card className="mb-8 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <img 
                src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100" 
                alt="Christian products" 
                className="w-16 h-16 rounded-lg object-cover" 
              />
              <div className="flex-1">
                <h4 className="font-semibold">Conheça nossa loja</h4>
                <p className="text-sm text-muted-foreground">Produtos que fortalecem sua fé</p>
                <Link href="/store">
                  <Button variant="ghost" size="sm" className="p-0 h-auto text-primary mt-1" data-testid="link-store">
                    Ver produtos →
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Social Media */}
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <h4 className="font-semibold mb-3">Conecte-se conosco</h4>
            <div className="flex space-x-4">
              <a href="#" className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-primary" data-testid="link-instagram">
                <Instagram className="w-4 h-4" />
                <span>Instagram</span>
              </a>
              <a href="#" className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-primary" data-testid="link-youtube">
                <Youtube className="w-4 h-4" />
                <span>YouTube</span>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </MobileContainer>
  );
}
