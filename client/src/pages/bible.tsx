import { useState, useEffect } from "react";
import { Search, Play, Bookmark, StickyNote, Share2, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { MobileContainer } from "@/components/ui/mobile-container";
import bibleData from "@/data/bible.json";

interface BibleBook {
  abbrev: string;
  chapters: string[][];
}

interface BibleData {
  [key: string]: BibleBook;
}

const bibleBookNames: { [key: string]: string } = {
  "Gn": "Gênesis", "Ex": "Êxodo", "Lv": "Levítico", "Nm": "Números", "Dt": "Deuteronômio",
  "Js": "Josué", "Jz": "Juízes", "Rt": "Rute", "1Sm": "1 Samuel", "2Sm": "2 Samuel",
  "1Rs": "1 Reis", "2Rs": "2 Reis", "1Cr": "1 Crônicas", "2Cr": "2 Crônicas", "Ed": "Esdras",
  "Ne": "Neemias", "Et": "Ester", "Jó": "Jó", "Sl": "Salmos", "Pv": "Provérbios",
  "Ec": "Eclesiastes", "Ct": "Cânticos", "Is": "Isaías", "Jr": "Jeremias", "Lm": "Lamentações",
  "Ez": "Ezequiel", "Dn": "Daniel", "Os": "Oséias", "Jl": "Joel", "Am": "Amós",
  "Ob": "Obadias", "Jn": "Jonas", "Mq": "Miquéias", "Na": "Naum", "Hc": "Habacuque",
  "Sf": "Sofonias", "Ag": "Ageu", "Zc": "Zacarias", "Ml": "Malaquias",
  "Mt": "Mateus", "Mc": "Marcos", "Lc": "Lucas", "Jo": "João", "At": "Atos",
  "Rm": "Romanos", "1Co": "1 Coríntios", "2Co": "2 Coríntios", "Gl": "Gálatas", "Ef": "Efésios",
  "Fp": "Filipenses", "Cl": "Colossenses", "1Ts": "1 Tessalonicenses", "2Ts": "2 Tessalonicenses",
  "1Tm": "1 Timóteo", "2Tm": "2 Timóteo", "Tt": "Tito", "Fm": "Filemom", "Hb": "Hebreus",
  "Tg": "Tiago", "1Pe": "1 Pedro", "2Pe": "2 Pedro", "1Jo": "1 João", "2Jo": "2 João",
  "3Jo": "3 João", "Jd": "Judas", "Ap": "Apocalipse"
};

export default function Bible() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentBookAbbrev, setCurrentBookAbbrev] = useState("Jo");
  const [currentChapter, setCurrentChapter] = useState(3);
  const [showBookSelector, setShowBookSelector] = useState(false);
  const [bible, setBible] = useState<BibleData>({});

  useEffect(() => {
    // Convert array format to object format for easier access
    const bibleObject: BibleData = {};
    (bibleData as BibleBook[]).forEach(book => {
      bibleObject[book.abbrev] = book;
    });
    setBible(bibleObject);
  }, []);

  const currentBook = bible[currentBookAbbrev];
  const currentText = currentBook?.chapters[currentChapter - 1] || [];
  const currentBookName = bibleBookNames[currentBookAbbrev] || currentBookAbbrev;
  const maxChapters = currentBook?.chapters.length || 1;

  const nextChapter = () => {
    if (currentChapter < maxChapters) {
      setCurrentChapter(currentChapter + 1);
    }
  };

  const prevChapter = () => {
    if (currentChapter > 1) {
      setCurrentChapter(currentChapter - 1);
    }
  };

  const changeBook = (abbrev: string) => {
    setCurrentBookAbbrev(abbrev);
    setCurrentChapter(1);
    setShowBookSelector(false);
  };

  return (
    <MobileContainer>
      <div className="p-4 pb-24">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">Bíblia Sagrada</h2>
          
          {/* Search Bar */}
          <div className="relative mb-4">
            <Input
              type="text"
              placeholder="Buscar versículos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              data-testid="input-bible-search"
            />
            <Search className="w-4 h-4 absolute left-3 top-3.5 text-muted-foreground" />
          </div>

          {/* Book Selection */}
          <Card className="mb-4">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">Livro Atual</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowBookSelector(!showBookSelector)}
                  data-testid="button-change-book"
                >
                  Alterar
                </Button>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary" data-testid="text-current-book">
                    {currentBookName}
                  </p>
                  <p className="text-xs text-muted-foreground">Livro</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-secondary" data-testid="text-current-chapter">
                    {currentChapter}
                  </p>
                  <p className="text-xs text-muted-foreground">Capítulo</p>
                </div>
                <div className="flex-1">
                  <Button className="w-full text-sm font-medium" data-testid="button-audio-tts">
                    <Play className="w-4 h-4 mr-2" />
                    Audio (TTS)
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Book Selector */}
          {showBookSelector && (
            <Card className="mb-4">
              <CardContent className="p-4">
                <h4 className="font-semibold mb-3">Selecionar Livro</h4>
                <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                  {Object.entries(bibleBookNames).map(([abbrev, name]) => (
                    <Button
                      key={abbrev}
                      variant={abbrev === currentBookAbbrev ? "default" : "outline"}
                      size="sm"
                      onClick={() => changeBook(abbrev)}
                      className="text-xs"
                      data-testid={`button-book-${abbrev}`}
                    >
                      {name}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mb-4">
            <Button 
              variant="outline" 
              className="flex items-center" 
              onClick={prevChapter}
              disabled={currentChapter <= 1}
              data-testid="button-prev-chapter"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Anterior
            </Button>
            <span className="font-medium">{currentBookName} {currentChapter}</span>
            <Button 
              variant="outline" 
              className="flex items-center" 
              onClick={nextChapter}
              disabled={currentChapter >= maxChapters}
              data-testid="button-next-chapter"
            >
              Próximo
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>

          {/* Bible Text */}
          <Card>
            <CardContent className="p-6 leading-relaxed">
              {currentText.length > 0 ? (
                currentText.map((verseText, index) => (
                  <p key={index + 1} className="mb-4" data-testid={`verse-${index + 1}`}>
                    <span className="text-primary font-semibold mr-2">{index + 1}</span>
                    {verseText}
                  </p>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  Carregando capítulo...
                </p>
              )}

              {/* Actions */}
              <div className="flex items-center justify-center space-x-2 mt-6 pt-4 border-t border-border">
                <Button variant="outline" size="icon" data-testid="button-bookmark">
                  <Bookmark className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon" data-testid="button-note">
                  <StickyNote className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon" data-testid="button-share">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MobileContainer>
  );
}