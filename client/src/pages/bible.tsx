import { useState, useEffect } from "react";
import { Search, Play, Bookmark, StickyNote, Share2, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { MobileContainer } from "@/components/ui/mobile-container";
import bibleData from "@/data/bible.json";
import bibleDataACF from "@/data/bible-acf.json";

interface BibleBook {
  abbrev: string;
  chapters: string[][];
}

interface BibleData {
  [key: string]: BibleBook;
}

interface BookResult {
  type: 'book';
  abbrev: string;
  name: string;
  score: number;
}

interface VerseResult {
  type: 'verse';
  text: string;
  verse: number;
  book: string;
  chapter: number;
  score: number;
}

type SearchResult = BookResult | VerseResult;

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
  const [showChapterSelector, setShowChapterSelector] = useState(false);
  const [bible, setBible] = useState<BibleData>({});
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'extra-large'>('normal');
  const [highlightedVerses, setHighlightedVerses] = useState<{[key: string]: 'yellow' | 'green' | 'orange' | null}>({});
  const [showHighlightOptions, setShowHighlightOptions] = useState<number | null>(null);
  const [rangeStart, setRangeStart] = useState<number | null>(null);
  const [showTranslationSelector, setShowTranslationSelector] = useState(false);
  const [currentTranslation, setCurrentTranslation] = useState<'ARC' | 'ACF'>('ARC');

  useEffect(() => {
    // Convert array format to object format for easier access
    const bibleObject: BibleData = {};
    const currentBibleData = currentTranslation === 'ACF' ? bibleDataACF : bibleData;
    (currentBibleData as BibleBook[]).forEach(book => {
      // Normalize abbreviation to match the format expected by bibleBookNames
      // Handle numeric prefixes (1sm -> 1Sm, 2cr -> 2Cr) and regular books (jo -> Jo, gn -> Gn)
      const abbrev = book.abbrev.toLowerCase(); // Normalize to lowercase first
      const normalizedAbbrev = abbrev.replace(/^(\d*)(.)/g, (match, num, firstLetter) => {
        return num + firstLetter.toUpperCase();
      }) + abbrev.slice(abbrev.search(/[a-zA-Z]/) + 1);
      
      bibleObject[normalizedAbbrev] = {
        ...book,
        abbrev: normalizedAbbrev
      };
    });
    setBible(bibleObject);
  }, [currentTranslation]);

  const currentBook = bible[currentBookAbbrev];
  const currentText = currentBook?.chapters[currentChapter - 1] || [];
  const currentBookName = bibleBookNames[currentBookAbbrev] || currentBookAbbrev;
  const maxChapters = currentBook?.chapters.length || 1;


  const nextChapter = () => {
    if (currentChapter < maxChapters) {
      setCurrentChapter(currentChapter + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevChapter = () => {
    if (currentChapter > 1) {
      setCurrentChapter(currentChapter - 1);
      window.scrollTo(0, 0);
    }
  };

  const changeBook = (abbrev: string) => {
    setCurrentBookAbbrev(abbrev);
    setCurrentChapter(1);
    setShowBookSelector(false);
  };

  // Improved search function to find books and verses
  const searchResults = (): SearchResult[] => {
    if (!searchQuery.trim()) return [];
    
    const query = searchQuery.toLowerCase().trim();
    const results: SearchResult[] = [];
    
    // Search for book names
    for (const [abbrev, name] of Object.entries(bibleBookNames)) {
      if (name.toLowerCase().includes(query)) {
        results.push({
          type: 'book',
          abbrev,
          name,
          score: name.toLowerCase() === query ? 10 : (name.toLowerCase().startsWith(query) ? 5 : 1)
        } as BookResult);
      }
    }
    
    // Search in verses (limit to current book for performance)
    if (currentText.length > 0) {
      currentText.forEach((verseText, index) => {
        if (verseText.toLowerCase().includes(query)) {
          results.push({
            type: 'verse',
            text: verseText,
            verse: index + 1,
            book: currentBookName,
            chapter: currentChapter,
            score: 1
          } as VerseResult);
        }
      });
    }
    
    return results.sort((a, b) => b.score - a.score).slice(0, 10);
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

  const highlightVerse = (verseNumber: number, color: 'yellow' | 'green' | 'orange' | null) => {
    if (rangeStart !== null && rangeStart !== verseNumber) {
      // Destacar intervalo
      const start = Math.min(rangeStart, verseNumber);
      const end = Math.max(rangeStart, verseNumber);
      
      const updates: {[key: string]: 'yellow' | 'green' | 'orange' | null} = {};
      for (let i = start; i <= end; i++) {
        const verseKey = `${currentBookAbbrev}-${currentChapter}-${i}`;
        updates[verseKey] = color;
      }
      
      setHighlightedVerses(prev => ({
        ...prev,
        ...updates
      }));
      
      setRangeStart(null);
    } else {
      // Destacar apenas um versículo
      const verseKey = `${currentBookAbbrev}-${currentChapter}-${verseNumber}`;
      setHighlightedVerses(prev => ({
        ...prev,
        [verseKey]: color
      }));
      
      if (color && rangeStart === null) {
        // Se está aplicando uma cor e não há intervalo ativo, marcar como início
        setRangeStart(verseNumber);
      }
    }
    
    setShowHighlightOptions(null);
  };

  const handleVerseClick = (verseNumber: number) => {
    if (rangeStart !== null && rangeStart !== verseNumber) {
      // Se há um início de intervalo, mostrar opções para destacar o intervalo
      setShowHighlightOptions(verseNumber);
    } else if (rangeStart === verseNumber) {
      // Se clicou no mesmo versículo que é o início, cancelar intervalo
      setRangeStart(null);
      setShowHighlightOptions(verseNumber);
    } else {
      // Clique normal
      setShowHighlightOptions(showHighlightOptions === verseNumber ? null : verseNumber);
    }
  };

  const getVerseHighlight = (verseNumber: number) => {
    const verseKey = `${currentBookAbbrev}-${currentChapter}-${verseNumber}`;
    return highlightedVerses[verseKey] || null;
  };

  return (
    <MobileContainer>
      <div className="p-4 pb-24">
        <div className="mb-6">
          
          {/* Search Bar and Translation Selector */}
          <div className="flex items-center space-x-3 mb-4">
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder="Buscar livros..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 text-sm"
                data-testid="input-bible-search"
              />
              <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowTranslationSelector(!showTranslationSelector)}
              className="px-3 text-xs font-medium"
              data-testid="button-translation-selector"
            >
              {currentTranslation}
            </Button>
          </div>

          {/* Translation Selector Dropdown */}
          {showTranslationSelector && (
            <Card className="mb-4">
              <CardContent className="p-4">
                <h4 className="font-semibold mb-3">Traduções Disponíveis</h4>
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      setCurrentTranslation('ARC');
                      setShowTranslationSelector(false);
                    }}
                    className={`w-full text-left p-2 rounded-lg transition-colors ${
                      currentTranslation === 'ARC' 
                        ? 'bg-primary/10 hover:bg-primary/20' 
                        : 'hover:bg-muted/20'
                    }`}
                  >
                    <div>
                      <p className={`font-medium ${
                        currentTranslation === 'ARC' ? 'text-primary' : 'text-foreground'
                      }`}>Almeida Revista e Corrigida (ARC)</p>
                      <p className="text-xs text-muted-foreground">
                        {currentTranslation === 'ARC' ? 'Tradução atual' : 'Tradução padrão'}
                      </p>
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      setCurrentTranslation('ACF');
                      setShowTranslationSelector(false);
                    }}
                    className={`w-full text-left p-2 rounded-lg transition-colors ${
                      currentTranslation === 'ACF' 
                        ? 'bg-primary/10 hover:bg-primary/20' 
                        : 'hover:bg-muted/20'
                    }`}
                  >
                    <div>
                      <p className={`font-medium ${
                        currentTranslation === 'ACF' ? 'text-primary' : 'text-foreground'
                      }`}>Almeida Corrigida Fiel (ACF)</p>
                      <p className="text-xs text-muted-foreground">
                        {currentTranslation === 'ACF' ? 'Tradução atual' : 'Segunda opção'}
                      </p>
                    </div>
                  </button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Search Results */}
          {searchQuery.trim() && (
            <Card className="mb-4">
              <CardContent className="p-4">
                <h4 className="font-semibold mb-3">Resultados da Busca</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {searchResults().length > 0 ? (
                    searchResults().map((result, index) => (
                      <div key={index} className="p-2 rounded-lg bg-muted/20 hover:bg-muted/40 cursor-pointer" 
                           onClick={() => {
                             if (result.type === 'book') {
                               changeBook(result.abbrev);
                               setSearchQuery("");
                             }
                           }}>
                        {result.type === 'book' ? (
                          <div>
                            <p className="font-medium text-primary">{result.name}</p>
                            <p className="text-xs text-muted-foreground">Livro da Bíblia</p>
                          </div>
                        ) : (
                          <div>
                            <p className="text-sm">{result.text.substring(0, 100)}...</p>
                            <p className="text-xs text-muted-foreground">{result.book} {result.chapter}:{result.verse}</p>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">Nenhum resultado encontrado</p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Book and Chapter Selection */}
          <Card className="mb-4">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 mb-3">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowBookSelector(!showBookSelector)}
                  data-testid="button-change-book"
                  className="flex-1"
                >
                  <span className="text-sm font-medium">{currentBookName}</span>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowChapterSelector(!showChapterSelector)}
                  data-testid="button-change-chapter"
                  className="flex-none px-4"
                >
                  <span className="text-sm font-medium">Cap. {currentChapter}</span>
                </Button>
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

          {/* Chapter Selector */}
          {showChapterSelector && (
            <Card className="mb-4">
              <CardContent className="p-4">
                <h4 className="font-semibold mb-3">Selecionar Capítulo</h4>
                <div className="grid grid-cols-6 gap-2 max-h-48 overflow-y-auto">
                  {Array.from({ length: maxChapters }, (_, i) => i + 1).map(chapter => (
                    <Button
                      key={chapter}
                      variant={chapter === currentChapter ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        setCurrentChapter(chapter);
                        setShowChapterSelector(false);
                      }}
                      className="text-xs"
                      data-testid={`button-chapter-${chapter}`}
                    >
                      {chapter}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}


          {/* Font Size Control */}
          <div className="flex justify-end items-center mb-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={toggleFontSize}
              className="text-xs"
              data-testid="button-font-size"
            >
              Fonte: {fontSize === 'normal' ? 'Normal' : fontSize === 'large' ? 'Grande' : 'Muito Grande'}
            </Button>
          </div>

          {/* Bible Text */}
          <Card>
            <CardContent className="p-6 leading-relaxed">
              {currentText.length > 0 ? (
                currentText.map((verseText, index) => {
                  const verseNumber = index + 1;
                  const highlight = getVerseHighlight(verseNumber);
                  const fontClass = fontSize === 'large' ? 'text-lg' : fontSize === 'extra-large' ? 'text-xl' : 'text-base';
                  const highlightClass = highlight === 'yellow' ? 'bg-yellow-200 dark:bg-yellow-800' : 
                                       highlight === 'green' ? 'bg-green-200 dark:bg-green-800' :
                                       highlight === 'orange' ? 'bg-orange-200 dark:bg-orange-800' : '';
                  const rangeStartClass = rangeStart === verseNumber ? 'ring-2 ring-primary' : '';
                  
                  return (
                    <div key={verseNumber} className="relative">
                      <p 
                        className={`mb-4 cursor-pointer hover:bg-muted/20 p-2 rounded transition-all ${fontClass} ${highlightClass} ${rangeStartClass}`} 
                        data-testid={`verse-${verseNumber}`}
                        onClick={() => handleVerseClick(verseNumber)}
                      >
                        <span className="text-primary font-semibold mr-2">{verseNumber}</span>
                        {verseText}
                      </p>
                      
                      {/* Highlight Options */}
                      {showHighlightOptions === verseNumber && (
                        <div className="absolute right-2 top-2 bg-background border border-border rounded-lg shadow-lg p-2 z-10">
                          <div className="flex space-x-1">
                            <button
                              onClick={() => highlightVerse(verseNumber, 'yellow')}
                              className="w-6 h-6 rounded-full bg-yellow-300 hover:bg-yellow-400"
                              title="Destacar em amarelo"
                            />
                            <button
                              onClick={() => highlightVerse(verseNumber, 'green')}
                              className="w-6 h-6 rounded-full bg-green-300 hover:bg-green-400"
                              title="Destacar em verde"
                            />
                            <button
                              onClick={() => highlightVerse(verseNumber, 'orange')}
                              className="w-6 h-6 rounded-full bg-orange-300 hover:bg-orange-400"
                              title="Destacar em azul"
                            />
                            <button
                              onClick={() => highlightVerse(verseNumber, null)}
                              className="w-6 h-6 rounded-full bg-gray-300 hover:bg-gray-400 flex items-center justify-center text-xs"
                              title="Remover destaque"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  Carregando capítulo...
                </p>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={prevChapter}
                  disabled={currentChapter <= 1}
                  data-testid="button-prev-chapter-bottom"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="icon" data-testid="button-bookmark">
                    <Bookmark className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="icon" data-testid="button-note">
                    <StickyNote className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="icon" data-testid="button-share">
                    <Share2 className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => {
                      // TODO: Implementar reprodução de áudio TTS
                      console.log('Reproduzir áudio do capítulo');
                    }}
                    data-testid="button-audio-tts"
                  >
                    <Play className="w-4 h-4" />
                  </Button>
                </div>
                
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={nextChapter}
                  disabled={currentChapter >= maxChapters}
                  data-testid="button-next-chapter-bottom"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MobileContainer>
  );
}