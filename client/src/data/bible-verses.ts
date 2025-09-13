import dailyDevotionals from "./daily-devotionals-clean.json";

export type DailyDevotional = {
  day: number;
  theme: string;
  verse: {
    text: string;
    reference: string;
  };
  reflection: string;
  questions: string[];
  prayer: string;
};

export type BibleVerse = {
  id: string;
  book: string;
  chapter: number;
  verse: number;
  text: string;
  reference: string;
  category: string;
};

export const emotionalVerses = {
  alegre: [
    {
      id: "happy1",
      text: "Alegrai-vos sempre no Senhor; outra vez digo, alegrai-vos.",
      reference: "Filipenses 4:4"
    },
    {
      id: "happy2", 
      text: "Este é o dia que fez o Senhor; regozijemo-nos e alegremo-nos nele.",
      reference: "Salmos 118:24"
    }
  ],
  preocupado: [
    {
      id: "worried1",
      text: "Não andeis cuidadosos por coisa alguma; antes as vossas petições sejam em tudo conhecidas diante de Deus pela oração e súplicas, com ação de graças.",
      reference: "Filipenses 4:6"
    },
    {
      id: "worried2",
      text: "Lançando sobre ele toda a vossa ansiedade, porque ele tem cuidado de vós.",
      reference: "1 Pedro 5:7"
    }
  ],
  triste: [
    {
      id: "sad1",
      text: "Bem-aventurados os que choram, porque eles serão consolados.",
      reference: "Mateus 5:4"
    },
    {
      id: "sad2",
      text: "Perto está o Senhor dos que têm o coração quebrantado, e salva os contritos de espírito.",
      reference: "Salmos 34:18"
    }
  ],
  esperancoso: [
    {
      id: "hopeful1",
      text: "Ora, a esperança não traz confusão, porquanto o amor de Deus está derramado em nossos corações pelo Espírito Santo que nos foi dado.",
      reference: "Romanos 5:5"
    },
    {
      id: "hopeful2",
      text: "Porque eu bem sei os pensamentos que tenho a vosso respeito, diz o Senhor; pensamentos de paz, e não de mal, para vos dar o fim que esperais.",
      reference: "Jeremias 29:11"
    }
  ],
  grato: [
    {
      id: "grateful1",
      text: "Em tudo dai graças, porque esta é a vontade de Deus em Cristo Jesus para convosco.",
      reference: "1 Tessalonicenses 5:18"
    },
    {
      id: "grateful2",
      text: "Oferecerei sacrifícios de louvor, e invocarei o nome do Senhor.",
      reference: "Salmos 116:17"
    }
  ]
};

// Helper function to parse Bible reference
function parseReference(reference: string): { book: string; chapter: number; verse: number } {
  // Match patterns like "Salmos 23:1", "1 Coríntios 13:4", "João 3:16"
  const match = reference.match(/^(.+?)\s+(\d+):(\d+)$/);
  
  if (match) {
    const [, bookName, chapterStr, verseStr] = match;
    return {
      book: bookName.trim(),
      chapter: parseInt(chapterStr, 10),
      verse: parseInt(verseStr, 10)
    };
  }
  
  // Fallback for references without verse (like "Salmos 23")
  const chapterMatch = reference.match(/^(.+?)\s+(\d+)$/);
  if (chapterMatch) {
    const [, bookName, chapterStr] = chapterMatch;
    return {
      book: bookName.trim(),
      chapter: parseInt(chapterStr, 10),
      verse: 1
    };
  }
  
  // Final fallback - just use the first word as book
  return {
    book: reference.split(' ')[0],
    chapter: 1,
    verse: 1
  };
}

export function getDailyVerse(): BibleVerse {
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
  const index = dayOfYear % (dailyDevotionals as DailyDevotional[]).length;
  const devotional = (dailyDevotionals as DailyDevotional[])[index];
  
  const parsed = parseReference(devotional.verse.reference);
  
  return {
    id: devotional.day.toString(),
    book: parsed.book,
    chapter: parsed.chapter,
    verse: parsed.verse,
    text: devotional.verse.text,
    reference: devotional.verse.reference,
    category: "daily"
  };
}

export function getVerseForEmotion(emotion: keyof typeof emotionalVerses) {
  const verses = emotionalVerses[emotion];
  const randomIndex = Math.floor(Math.random() * verses.length);
  return verses[randomIndex];
}