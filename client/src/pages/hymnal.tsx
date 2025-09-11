import { useState } from "react";
import { Search, Play, Pause, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { MobileContainer } from "@/components/ui/mobile-container";
import { hymns, searchHymns } from "@/data/hymns";

export default function Hymnal() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentHymn, setCurrentHymn] = useState(hymns.find(h => h.number === 15) || hymns[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [backgroundMusicPlaying, setBackgroundMusicPlaying] = useState(true);

  const filteredHymns = searchQuery ? searchHymns(searchQuery) : hymns;

  return (
    <MobileContainer>
      <div className="p-4 pb-24">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">Hinário Harpa Cristã</h2>
          
          {/* Search */}
          <div className="relative mb-4">
            <Input
              type="text"
              placeholder="Buscar hinos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              data-testid="input-hymn-search"
            />
            <Search className="w-4 h-4 absolute left-3 top-3.5 text-muted-foreground" />
          </div>

          {/* Current Hymn Player */}
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

          {/* Hymn Lyrics */}
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
        </div>

        {/* Hymn List */}
        <div className="space-y-2">
          <h4 className="font-semibold mb-3">
            {searchQuery ? `Resultados para "${searchQuery}"` : "Outros Hinos"}
          </h4>
          
          {filteredHymns.map((hymn) => (
            <Card 
              key={hymn.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setCurrentHymn(hymn)}
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
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-primary"
                  data-testid={`button-play-hymn-${hymn.number}`}
                >
                  <Play className="w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Background Music Controls */}
        <Card className="mt-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-medium">Música de Fundo</h5>
                <p className="text-sm text-muted-foreground">Meditação Instrumental</p>
              </div>
              <div className="flex items-center space-x-2">
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
          </CardContent>
        </Card>
      </div>
    </MobileContainer>
  );
}
