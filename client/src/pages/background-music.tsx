import { useState } from "react";
import { ArrowLeft, Play, Pause, SkipBack, SkipForward, Volume2 } from "lucide-react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { MobileContainer } from "@/components/ui/mobile-container";

const backgroundMusicList = [
  { id: 1, title: "Paz do Senhor", duration: "4:32" },
  { id: 2, title: "Suave Oração", duration: "3:45" },
  { id: 3, title: "Comunhão com Deus", duration: "5:12" },
  { id: 4, title: "Serenidade", duration: "4:18" },
  { id: 5, title: "Reflexão Divina", duration: "3:58" }
];

export default function BackgroundMusic() {
  const [, setLocation] = useLocation();
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [volume, setVolume] = useState([70]);
  const [progress, setProgress] = useState(35);

  const currentMusic = backgroundMusicList[currentTrack];

  const nextTrack = () => {
    setCurrentTrack((prev) => (prev + 1) % backgroundMusicList.length);
  };

  const prevTrack = () => {
    setCurrentTrack((prev) => (prev - 1 + backgroundMusicList.length) % backgroundMusicList.length);
  };

  return (
    <MobileContainer>
      <div className="p-4 pb-24">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocation("/hymnal")}
            data-testid="button-back"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold ml-2">Música de Fundo</h1>
        </div>

        {/* Current Playing Card */}
        <Card className="hymn-player text-white mb-6">
          <CardContent className="p-8 text-center">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-white/20 flex items-center justify-center">
              <span className="text-2xl">🎵</span>
            </div>
            
            <h2 className="text-xl font-bold mb-2" data-testid="text-current-music">
              {currentMusic.title}
            </h2>
            <p className="text-white/80 mb-6">Meditação e Oração</p>
            
            {/* Progress Bar */}
            <div className="w-full bg-white/20 rounded-full h-2 mb-4">
              <div 
                className="bg-white h-2 rounded-full transition-all duration-1000" 
                style={{ width: `${progress}%` }} 
              />
            </div>
            
            <div className="flex justify-between text-sm mb-6 opacity-90">
              <span>1:23</span>
              <span>{currentMusic.duration}</span>
            </div>
            
            {/* Controls */}
            <div className="flex items-center justify-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={prevTrack}
                data-testid="button-prev"
              >
                <SkipBack className="w-5 h-5" />
              </Button>
              
              <Button
                size="icon"
                className="w-16 h-16 rounded-full bg-white/20 hover:bg-white/30"
                onClick={() => setIsPlaying(!isPlaying)}
                data-testid="button-play-pause"
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6" />
                ) : (
                  <Play className="w-6 h-6" />
                )}
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={nextTrack}
                data-testid="button-next"
              >
                <SkipForward className="w-5 h-5" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Volume Control */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Volume2 className="w-4 h-4 text-muted-foreground" />
              <Slider
                value={volume}
                onValueChange={setVolume}
                max={100}
                step={1}
                className="flex-1"
                data-testid="slider-volume"
              />
              <span className="text-sm text-muted-foreground w-8">{volume[0]}%</span>
            </div>
          </CardContent>
        </Card>

        {/* Playlist */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-4">Lista de Reprodução</h3>
            <div className="space-y-2">
              {backgroundMusicList.map((music, index) => (
                <div 
                  key={music.id}
                  className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                    currentTrack === index 
                      ? 'bg-primary/10 border border-primary/20' 
                      : 'hover:bg-muted/50'
                  }`}
                  onClick={() => setCurrentTrack(index)}
                  data-testid={`music-item-${music.id}`}
                >
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                    {currentTrack === index && isPlaying ? (
                      <Pause className="w-4 h-4 text-primary" />
                    ) : (
                      <Play className="w-4 h-4 text-primary" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-medium ${currentTrack === index ? 'text-primary' : ''}`}>
                      {music.title}
                    </h4>
                    <p className="text-sm text-muted-foreground">{music.duration}</p>
                  </div>
                  {currentTrack === index && (
                    <div className="text-primary text-sm font-medium">
                      Tocando
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 p-4 bg-muted/30 rounded-lg text-center">
          <p className="text-sm text-muted-foreground">
            🔄 Reprodução em loop ativada
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            A música continuará tocando até você pausar
          </p>
        </div>
      </div>
    </MobileContainer>
  );
}