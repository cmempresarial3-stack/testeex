import { useState } from "react";
import { Search, Play, Bookmark, StickyNote, Share2, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { MobileContainer } from "@/components/ui/mobile-container";
import { bibleBooks, sampleBibleText } from "@/data/bible-books";

export default function Bible() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentBook, setCurrentBook] = useState("João");
  const [currentChapter, setCurrentChapter] = useState(3);
  const [showBookSelector, setShowBookSelector] = useState(false);

  const currentText = sampleBibleText[currentBook as keyof typeof sampleBibleText]?.[currentChapter as keyof typeof sampleBibleText[keyof typeof sampleBibleText]] || [];

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
                    {currentBook}
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
                  {bibleBooks.map((book) => (
                    <Button
                      key={book.name}
                      variant={book.name === currentBook ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        setCurrentBook(book.name);
                        setShowBookSelector(false);
                      }}
                      className="text-xs"
                      data-testid={`button-book-${book.name}`}
                    >
                      {book.name}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Bible Text */}
        <Card>
          <CardContent className="p-6">
            <div className="bible-verse space-y-4">
              {currentText.length > 0 ? (
                currentText.map((verseData: { verse: number; text: string }) => (
                  <p key={verseData.verse} data-testid={`verse-${verseData.verse}`}>
                    <span className="font-bold text-primary">{verseData.verse}</span> {verseData.text}
                  </p>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  Conteúdo bíblico será carregado aqui. <br />
                  Esta é uma versão de demonstração.
                </p>
              )}
            </div>

            <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
              <Button variant="ghost" size="sm" data-testid="button-previous-chapter">
                <ChevronLeft className="w-4 h-4 mr-2" />
                Anterior
              </Button>
              
              <div className="flex space-x-2">
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
              
              <Button variant="ghost" size="sm" data-testid="button-next-chapter">
                Próximo
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MobileContainer>
  );
}
