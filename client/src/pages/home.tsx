import { useEffect } from "react";
import { Link } from "wouter";
import { Heart, BookOpen, Music, StickyNote, Calendar, Store, Share2, Instagram, Youtube } from "lucide-react";
import { SiTiktok } from "react-icons/si";
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
            <Card className="card-hover cursor-pointer shadow-sophisticated" data-testid="card-bible">
              <CardContent className="p-6 text-center">
                <BookOpen className="w-8 h-8 text-primary mb-3 mx-auto" />
                <h4 className="font-semibold">Bíblia</h4>
                <p className="text-xs text-muted-foreground">Palavra de Deus</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/hymnal">
            <Card className="card-hover cursor-pointer shadow-sophisticated" data-testid="card-hymnal">
              <CardContent className="p-6 text-center">
                <Music className="w-8 h-8 text-secondary mb-3 mx-auto" />
                <h4 className="font-semibold">Hinário</h4>
                <p className="text-xs text-muted-foreground">Harpa Cristã</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/notes">
            <Card className="card-hover cursor-pointer shadow-sophisticated" data-testid="card-notes">
              <CardContent className="p-6 text-center">
                <StickyNote className="w-8 h-8 text-accent mb-3 mx-auto" />
                <h4 className="font-semibold">Anotações</h4>
                <p className="text-xs text-muted-foreground">Suas reflexões</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/calendar">
            <Card className="card-hover cursor-pointer shadow-sophisticated" data-testid="card-calendar">
              <CardContent className="p-6 text-center">
                <Calendar className="w-8 h-8 text-primary mb-3 mx-auto" />
                <h4 className="font-semibold">Calendário</h4>
                <p className="text-xs text-muted-foreground">Lembretes</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Store Section */}
        <Card className="mb-8 shadow-sm bg-gradient-to-r from-secondary/10 to-primary/10 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-lg bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                <Store className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold">Loja Verso & Paz</h4>
                <p className="text-sm text-muted-foreground">Produtos especiais que fortalecem sua fé</p>
                <Link href="/store">
                  <Button variant="ghost" size="sm" className="p-0 h-auto text-primary mt-1 font-medium" data-testid="link-store">
                    Explorar agora →
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
            <div className="grid grid-cols-3 gap-2">
              <a 
                href="#" 
                className="flex flex-col items-center space-y-1 p-3 rounded-lg hover:bg-muted transition-colors"
                data-testid="link-instagram"
              >
                <Instagram className="w-6 h-6 text-pink-500" />
                <span className="text-xs font-medium">Instagram</span>
              </a>
              <a 
                href="#" 
                className="flex flex-col items-center space-y-1 p-3 rounded-lg hover:bg-muted transition-colors"
                data-testid="link-youtube"
              >
                <Youtube className="w-6 h-6 text-red-500" />
                <span className="text-xs font-medium">YouTube</span>
              </a>
              <a 
                href="#" 
                className="flex flex-col items-center space-y-1 p-3 rounded-lg hover:bg-muted transition-colors"
                data-testid="link-tiktok"
              >
                <SiTiktok className="w-6 h-6 text-black dark:text-white" />
                <span className="text-xs font-medium">TikTok</span>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </MobileContainer>
  );
}
