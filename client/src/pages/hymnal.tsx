import { useState } from "react";
import { Search, Play, Pause, Volume2, Heart, Clock, Hash, List, Music } from "lucide-react";
import { useLocation } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MobileContainer } from "@/components/ui/mobile-container";
import { hymns, searchHymns } from "@/data/hymns";
import { useRecentHymns } from "@/hooks/use-recent-hymns";

export default function Hymnal() {
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState<number[]>([1, 30, 45]);
  const [showAllHymns, setShowAllHymns] = useState(false);
  const [, setLocation] = useLocation();
  const { recentHymns, addToRecent } = useRecentHymns();

  const filteredHymns = searchQuery ? searchHymns(searchQuery) : hymns;
  const favoriteHymns = hymns.filter(h => favorites.includes(h.number));
  // Order recent hymns by recency (most recent first)
  const recentHymnsList = recentHymns.map(number => hymns.find(h => h.number === number)).filter(Boolean) as typeof hymns;

  const selectHymn = (hymn: typeof hymns[0]) => {
    // Add to recent hymns list
    addToRecent(hymn.number);
    // Navigate to individual hymn page
    setLocation(`/hymn/${hymn.number}`);
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
          
          {/* Background Music Section */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="font-medium">Música de Fundo</h5>
                  <p className="text-sm text-muted-foreground">Meditação e Oração</p>
                </div>
                <Button
                  onClick={() => setLocation('/background-music')}
                  className="flex items-center space-x-2"
                  data-testid="button-background-music"
                >
                  <Music className="w-4 h-4" />
                  <span>Entrar</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Search Input and View List Button */}
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder="Buscar hino..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 max-w-xs"
                data-testid="input-hymn-search"
              />
              <Search className="w-4 h-4 absolute left-3 top-3.5 text-muted-foreground" />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowAllHymns(true)}
              className="flex items-center space-x-2"
              data-testid="button-view-all-hymns"
            >
              <List className="w-4 h-4" />
              <span>Ver Lista</span>
            </Button>
          </div>

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
                      <p className="text-sm text-muted-foreground">{hymn.title}</p>
                    </div>
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
                    onClick={() => selectHymn(hymn)}
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
                        <p className="text-sm text-muted-foreground">{hymn.title}</p>
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
                    onClick={() => selectHymn(hymn)}
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
                        <p className="text-sm text-muted-foreground">{hymn.title}</p>
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
        
        {/* All Hymns Dialog */}
        <Dialog open={showAllHymns} onOpenChange={setShowAllHymns}>
          <DialogContent className="max-w-[95vw] w-full mx-auto max-h-[90vh] overflow-auto">
            <DialogHeader>
              <DialogTitle>Lista Completa - 640 Hinos da Harpa Cristã</DialogTitle>
            </DialogHeader>
            <div className="space-y-2 max-h-[70vh] overflow-auto">
              {hymns.map((hymn) => (
                <Card 
                  key={hymn.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => {
                    setShowAllHymns(false);
                    selectHymn(hymn);
                  }}
                  data-testid={`card-all-hymn-${hymn.number}`}
                >
                  <CardContent className="flex items-center p-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                      <span className="text-sm font-bold text-primary">
                        {hymn.number}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h5 className="font-medium">{hymn.title}</h5>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(hymn.number);
                      }}
                      data-testid={`button-favorite-all-${hymn.number}`}
                    >
                      <Heart className={`w-4 h-4 ${favorites.includes(hymn.number) ? 'fill-current text-red-500' : 'text-muted-foreground'}`} />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </MobileContainer>
  );
}
