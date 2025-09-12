import { useState } from "react";
import { Search, Play, Pause, Volume2, Heart, Clock, Hash, List } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { MobileContainer } from "@/components/ui/mobile-container";
import { hymns, searchHymns } from "@/data/hymns";

export default function Hymnal() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentHymn, setCurrentHymn] = useState<typeof hymns[0] | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [backgroundMusicPlaying, setBackgroundMusicPlaying] = useState(true);
  const [favorites, setFavorites] = useState<number[]>([1, 30, 45]);
  const [recentHymns, setRecentHymns] = useState<number[]>([5, 12, 25]);
  const [showBackgroundMusic, setShowBackgroundMusic] = useState(false);

  const filteredHymns = searchQuery ? searchHymns(searchQuery) : hymns;
  const favoriteHymns = hymns.filter(h => favorites.includes(h.number));
  const recentHymnsList = hymns.filter(h => recentHymns.includes(h.number));

  const selectHymn = (hymn: typeof hymns[0]) => {
    setCurrentHymn(hymn);
    // Add to recent if not already there
    if (!recentHymns.includes(hymn.number)) {
      setRecentHymns([hymn.number, ...recentHymns.slice(0, 4)]);
    }
  };

  const toggleFavorite = (hymnNumber: number) => {
    if (favorites.includes(hymnNumber)) {
      setFavorites(favorites.filter(n => n !== hymnNumber));
    } else {
      setFavorites([hymnNumber, ...favorites]);
    }
  };

  const backgroundMusicList = [
    { id: 1, title: "Paz do Senhor", duration: "4:32" },
    { id: 2, title: "Suave Oração", duration: "3:45" },
    { id: 3, title: "Comunhão com Deus", duration: "5:12" },
    { id: 4, title: "Serenidade", duration: "4:18" },
    { id: 5, title: "Reflexão Divina", duration: "3:58" }
  ];

  return (
    <MobileContainer>
      <div className="p-4 pb-24">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">Hinário Harpa Cristã</h2>
          
          {/* Background Music Section */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="font-medium">Música de Fundo</h5>
                  <p className="text-sm text-muted-foreground">Meditação e Oração</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowBackgroundMusic(!showBackgroundMusic)}
                    data-testid="button-background-music-list"
                  >
                    {showBackgroundMusic ? 'Ocultar' : 'Ver Lista'}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setBackgroundMusicPlaying(!backgroundMusicPlaying)}
                    data-testid="button-background-music"
                  >
                    {backgroundMusicPlaying ? (
                      <Pause className="w-4 h-4 text-primary" />
                    ) : (
                      <Play className="w-4 h-4 text-primary" />
                    )}
                  </Button>
                  <Button variant="ghost" size="icon" data-testid="button-volume">
                    <Volume2 className="w-4 h-4 text-muted-foreground" />
                  </Button>
                </div>
              </div>
              
              {showBackgroundMusic && (
                <div className="mt-4 space-y-2">
                  <h6 className="font-medium text-sm">Músicas Disponíveis:</h6>
                  {backgroundMusicList.map((music) => (
                    <div key={music.id} className="flex items-center justify-between p-2 bg-muted/30 rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{music.title}</p>
                        <p className="text-xs text-muted-foreground">{music.duration}</p>
                      </div>
                      <Button variant="ghost" size="icon" data-testid={`button-play-music-${music.id}`}>
                        <Play className="w-4 h-4 text-primary" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Search Input */}
          <div className="relative mb-4">
            <Input
              type="text"
              placeholder="Buscar por nome ou número do hino..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              data-testid="input-hymn-search"
            />
            <Search className="w-4 h-4 absolute left-3 top-3.5 text-muted-foreground" />
          </div>

          {/* Current Hymn Player */}
          {currentHymn && (
            <Card className="hymn-player text-white mb-6">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold" data-testid="text-current-hymn-number">
                      Hino {currentHymn.number}
                    </h3>
                    <p className="opacity-90" data-testid="text-current-hymn-title">
                      {currentHymn.title}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white hover:bg-white/20"
                      onClick={() => currentHymn && toggleFavorite(currentHymn.number)}
                      data-testid="button-favorite-hymn"
                    >
                      <Heart className={`w-5 h-5 ${currentHymn && favorites.includes(currentHymn.number) ? 'fill-current' : ''}`} />
                    </Button>
                    <Button
                      size="icon"
                      className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30"
                      onClick={() => setIsPlaying(!isPlaying)}
                      data-testid="button-play-hymn"
                    >
                      {isPlaying ? (
                        <Pause className="w-5 h-5" />
                      ) : (
                        <Play className="w-5 h-5" />
                      )}
                    </Button>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-white/20 rounded-full h-2 mb-4">
                  <div className="bg-white h-2 rounded-full" style={{ width: "35%" }} />
                </div>
                
                <div className="flex items-center justify-between text-sm opacity-90">
                  <span>1:23</span>
                  <span>3:45</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Hymn Lyrics */}
          {currentHymn && (
            <Card className="mb-6">
              <CardContent className="p-6">
                <h4 className="font-bold text-lg mb-4 text-center" data-testid="text-hymn-title">
                  {currentHymn.title}
                </h4>
                <div className="space-y-4 text-center">
                  <div>
                    {currentHymn.lyrics.map((line, index) => (
                      <p key={index} className="mb-2">
                        {line}
                      </p>
                    ))}
                  </div>
                  
                  {currentHymn.chorus && (
                    <div className="font-semibold text-primary">
                      <p className="mb-2">Coro:</p>
                      {currentHymn.chorus.split('\n').map((line, index) => (
                        <p key={index} className="mb-2">
                          {line}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Hymn Lists with Tabs */}
        <Tabs defaultValue="recent" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="recent">Recentes</TabsTrigger>
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="favorites">Favoritos</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-4">
            <div className="space-y-2">
              <h4 className="font-semibold mb-3">
                {searchQuery ? `Resultados para "${searchQuery}"` : "Lista de Hinos"}
              </h4>
              
              {filteredHymns.map((hymn) => (
                <Card 
                  key={hymn.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => selectHymn(hymn)}
                  data-testid={`card-hymn-${hymn.number}`}
                >
                  <CardContent className="flex items-center p-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                      <span className="text-sm font-bold text-primary">
                        {hymn.number.toString().padStart(3, '0')}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h5 className="font-medium">{hymn.title}</h5>
                      <p className="text-sm text-muted-foreground">Hino {hymn.number}</p>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(hymn.number);
                        }}
                        data-testid={`button-favorite-${hymn.number}`}
                      >
                        <Heart className={`w-4 h-4 ${favorites.includes(hymn.number) ? 'fill-current text-red-500' : 'text-muted-foreground'}`} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-primary"
                        data-testid={`button-play-hymn-${hymn.number}`}
                      >
                        <Play className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="favorites" className="mt-4">
            <div className="space-y-2">
              <h4 className="font-semibold mb-3 flex items-center">
                <Heart className="w-5 h-5 text-red-500 mr-2" />
                Hinos Favoritos
              </h4>
              
              {favoriteHymns.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  Nenhum hino favoritado ainda.
                </p>
              ) : (
                favoriteHymns.map((hymn) => (
                  <Card 
                    key={hymn.id}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setCurrentHymn(hymn)}
                    data-testid={`card-favorite-hymn-${hymn.number}`}
                  >
                    <CardContent className="flex items-center p-3">
                      <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mr-3">
                        <span className="text-sm font-bold text-red-600">
                          {hymn.number.toString().padStart(3, '0')}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h5 className="font-medium">{hymn.title}</h5>
                        <p className="text-sm text-muted-foreground">Hino {hymn.number}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-primary"
                        data-testid={`button-play-favorite-${hymn.number}`}
                      >
                        <Play className="w-4 h-4" />
                      </Button>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="recent" className="mt-4">
            <div className="space-y-2">
              <h4 className="font-semibold mb-3 flex items-center">
                <Clock className="w-5 h-5 text-blue-500 mr-2" />
                Hinos Recentes
              </h4>
              
              {recentHymnsList.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  Nenhum hino reproduzido recentemente.
                </p>
              ) : (
                recentHymnsList.map((hymn) => (
                  <Card 
                    key={hymn.id}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setCurrentHymn(hymn)}
                    data-testid={`card-recent-hymn-${hymn.number}`}
                  >
                    <CardContent className="flex items-center p-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                        <span className="text-sm font-bold text-blue-600">
                          {hymn.number.toString().padStart(3, '0')}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h5 className="font-medium">{hymn.title}</h5>
                        <p className="text-sm text-muted-foreground">Hino {hymn.number}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-primary"
                        data-testid={`button-play-recent-${hymn.number}`}
                      >
                        <Play className="w-4 h-4" />
                      </Button>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MobileContainer>
  );
}
