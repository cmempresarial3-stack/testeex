import { Devotional } from "@shared/schema";

export const dailyDevotionals: Devotional[] = [
  {
    id: "1",
    title: "Planos de Esperança",
    content: "Deus tem planos para você! Mesmo quando não conseguimos ver o caminho à frente, Ele já conhece cada passo da nossa jornada. Os planos de Deus para nós não são de mal, mas de bem. Ele deseja nos dar esperança e um futuro próspero. Hoje, confie que Deus está no controle e que seus planos para você são perfeitos.",
    verse: "Porque eu bem sei os pensamentos que tenho a vosso respeito, diz o Senhor; pensamentos de paz, e não de mal, para vos dar o fim que esperais.",
    verseReference: "Jeremias 29:11",
    date: "2024-01-01",
  },
  {
    id: "2",
    title: "Amor Incondicional",
    content: "O amor de Deus por você é tão grande que Ele deu seu próprio Filho para sua salvação. Este amor não depende do que você faz ou deixa de fazer. É um amor puro, incondicional e eterno. Hoje, permita-se experimentar esse amor transformador que pode mudar sua vida completamente.",
    verse: "Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna.",
    verseReference: "João 3:16",
    date: "2024-01-02",
  },
  {
    id: "3",
    title: "Força Interior",
    content: "Quando nos sentimos fracos e incapazes, Deus nos lembra que nossa força vem dele. Não precisamos enfrentar os desafios da vida sozinhos. Cristo vive em nós e nos fortalece para cada batalha. Hoje, descanse na certeza de que você pode todas as coisas naquele que te fortalece.",
    verse: "Posso todas as coisas em Cristo que me fortalece.",
    verseReference: "Filipenses 4:13",
    date: "2024-01-03",
  }
];

export function getTodayDevotional(): Devotional {
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
  const index = dayOfYear % dailyDevotionals.length;
  return dailyDevotionals[index];
}
