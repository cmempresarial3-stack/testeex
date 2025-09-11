import { BibleVerse } from "@shared/schema";

export const dailyVerses: BibleVerse[] = [
  {
    id: "1",
    book: "Jeremias",
    chapter: 29,
    verse: 11,
    text: "Porque eu bem sei os pensamentos que tenho a vosso respeito, diz o Senhor; pensamentos de paz, e não de mal, para vos dar o fim que esperais.",
    reference: "Jeremias 29:11",
    category: "hope"
  },
  {
    id: "2",
    book: "João",
    chapter: 3,
    verse: 16,
    text: "Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna.",
    reference: "João 3:16",
    category: "comfort"
  },
  {
    id: "3",
    book: "Filipenses",
    chapter: 4,
    verse: 13,
    text: "Posso todas as coisas em Cristo que me fortalece.",
    reference: "Filipenses 4:13",
    category: "strength"
  },
  {
    id: "4",
    book: "Salmos",
    chapter: 23,
    verse: 1,
    text: "O Senhor é o meu pastor; nada me faltará.",
    reference: "Salmos 23:1",
    category: "peace"
  },
  {
    id: "5",
    book: "Provérbios",
    chapter: 3,
    verse: 5,
    text: "Confia no Senhor de todo o teu coração, e não te estribes no teu próprio entendimento.",
    reference: "Provérbios 3:5",
    category: "hope"
  },
  {
    id: "6",
    book: "Isaías",
    chapter: 40,
    verse: 31,
    text: "Mas os que esperam no Senhor renovarão as forças, subirão com asas como águias; correrão, e não se cansarão; caminharão, e não se fatigarão.",
    reference: "Isaías 40:31",
    category: "strength"
  },
  {
    id: "7",
    book: "Mateus",
    chapter: 11,
    verse: 28,
    text: "Vinde a mim, todos os que estais cansados e oprimidos, e eu vos aliviarei.",
    reference: "Mateus 11:28",
    category: "comfort"
  }
];

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

export function getDailyVerse(): BibleVerse {
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
  const index = dayOfYear % dailyVerses.length;
  return dailyVerses[index];
}

export function getVerseForEmotion(emotion: keyof typeof emotionalVerses) {
  const verses = emotionalVerses[emotion];
  const randomIndex = Math.floor(Math.random() * verses.length);
  return verses[randomIndex];
}
