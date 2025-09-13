import { useState, useEffect } from "react";
import { ArrowLeft, Play, Pause, Heart, Share } from "lucide-react";
import { useLocation, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MobileContainer } from "@/components/ui/mobile-container";
import { hymns } from "@/data/hymns";
import { useRecentHymns } from "@/hooks/use-recent-hymns";

export default function HymnView() {
  const [, setLocation] = useLocation();
  const params = useParams<{ number: string }>();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [hymn, setHymn] = useState<typeof hymns[0] | null>(null);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'extra-large'>('normal');
  const { addToRecent } = useRecentHymns();

  useEffect(() => {
    const hymnNumber = parseInt(params.number || "0");
    const foundHymn = hymns.find(h => h.number === hymnNumber);
    if (foundHymn) {
      setHymn(foundHymn);
      // Add to recent hymns when viewed
      addToRecent(hymnNumber);
      // Check if it's in favorites (this would normally come from context/state)
      const favorites = JSON.parse(localStorage.getItem('hymn-favorites') || '[]');
      setIsFavorite(favorites.includes(hymnNumber));
    } else {
      setLocation("/hymnal");
    }
  }, [params.number, setLocation, addToRecent]);

  const toggleFavorite = () => {
    if (!hymn) return;
    const favorites = JSON.parse(localStorage.getItem('hymn-favorites') || '[]');
    let newFavorites;
    
    if (isFavorite) {
      newFavorites = favorites.filter((n: number) => n !== hymn.number);
    } else {
      newFavorites = [hymn.number, ...favorites];
    }
    
    localStorage.setItem('hymn-favorites', JSON.stringify(newFavorites));
    setIsFavorite(!isFavorite);
  };

  const toggleFontSize = () => {
    setFontSize(current => {
      switch (current) {
        case 'normal': return 'large';
        case 'large': return 'extra-large';
        case 'extra-large': return 'normal';
        default: return 'normal';
      }
    });
  };

  const handleShare = () => {
    if (!hymn) return;
    if (navigator.share) {
      navigator.share({
        title: `Hino ${hymn.number} - ${hymn.title}`,
        text: `Confira este hino da Harpa Cristã: ${hymn.title}`,
        url: window.location.href
      });
    } else {
      // Fallback for browsers without native share
      navigator.clipboard.writeText(window.location.href);
      alert('Link copiado para a área de transferência!');
    }
  };

  if (!hymn) {
    return (
      <MobileContainer>
        <div className="p-4">
          <p>Carregando hino...</p>
        </div>
      </MobileContainer>
    );
  }

  return (
    <MobileContainer>
      <div className="p-4 pb-24">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocation("/hymnal")}
            data-testid="button-back"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleShare}
              data-testid="button-share"
            >
              <Share className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleFavorite}
              data-testid="button-favorite"
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current text-red-500' : 'text-muted-foreground'}`} />
            </Button>
          </div>
        </div>

        {/* Hymn Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold mb-2" data-testid="text-hymn-title">
            {hymn.title}
          </h1>
          <div className="flex justify-center items-center space-x-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={toggleFontSize}
              className="text-xs"
              data-testid="button-font-size"
              title="Ajustar tamanho da fonte"
            >
              Aa
            </Button>
          </div>
        </div>

        {/* Instrumental Player */}
        <Card className="hymn-player text-white mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold">Instrumental</h3>
                <p className="text-sm opacity-90">Versão para acompanhamento</p>
              </div>
              <Button
                size="icon"
                className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30"
                onClick={() => setIsPlaying(!isPlaying)}
                data-testid="button-play-instrumental"
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5" />
                )}
              </Button>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-white/20 rounded-full h-2 mb-4">
              <div className="bg-white h-2 rounded-full" style={{ width: "25%" }} />
            </div>
            
            <div className="flex items-center justify-between text-sm opacity-90">
              <span>0:45</span>
              <span>3:12</span>
            </div>
          </CardContent>
        </Card>

        {/* Hymn Lyrics */}
        <Card>
          <CardContent className="p-6">
            <h3 className="font-bold text-lg mb-4 text-center">Letra</h3>
            <div className={`space-y-4 text-center leading-relaxed transition-all duration-200 ${
              fontSize === 'large' ? 'text-lg' : fontSize === 'extra-large' ? 'text-xl' : 'text-base'
            }`}>
              {hymn.lyrics.map((verse, verseIndex) => (
                <div key={verseIndex} className="mb-6">
                  {verse.split('\n').map((line, lineIndex) => (
                    <p key={lineIndex} className={`mb-2 ${
                      fontSize === 'large' ? 'text-lg' : fontSize === 'extra-large' ? 'text-xl' : 'text-base'
                    }`}>
                      {line}
                    </p>
                  ))}
                </div>
              ))}
              
              {hymn.chorus && (
                <div className="mt-6 p-4 bg-primary/5 rounded-lg">
                  <p className="font-semibold text-primary mb-3">Coro:</p>
                  {hymn.chorus.split('\n').map((line, index) => (
                    <p key={index} className={`text-primary/90 mb-2 ${
                      fontSize === 'large' ? 'text-lg' : fontSize === 'extra-large' ? 'text-xl' : 'text-base'
                    }`}>
                      {line}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <Button 
            variant="outline" 
            onClick={() => setLocation("/hymnal")}
            data-testid="button-back-to-list"
          >
            Voltar à Lista
          </Button>
          <Button 
            onClick={toggleFavorite}
            variant={isFavorite ? "default" : "outline"}
            data-testid="button-toggle-favorite"
          >
            {isFavorite ? 'Favoritado ❤️' : 'Favoritar'}
          </Button>
        </div>
      </div>
    </MobileContainer>
  );
}