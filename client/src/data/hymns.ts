import { Hymn } from "@shared/schema";

export const hymns: Hymn[] = [
  {
    id: "1",
    number: 1,
    title: "Chuvas de Bênçãos",
    lyrics: [
      "Gotas da graça, gotas caíram",
      "Já sobre mim, mas as chuvas nada",
      "Do que está por vir, chuvas de bênçãos",
      "Nós esperamos, gotas somente",
      "Agora vemos, chuvas copiosas",
      "Deus prometeu"
    ],
    chorus: "Chuvas de bênçãos, Chuvas de bênçãos, Deus prometeu! Chuvas de bênçãos, Chuvas de bênçãos, Vamos ter!"
  },
  {
    id: "15",
    number: 15,
    title: "A Voz de Jesus",
    lyrics: [
      "A voz de Jesus, com doce união,",
      "Proclama a todos: vinde",
      "Achado tenho gozo, paz, perdão",
      "Na graça que nos salva sempre"
    ],
    chorus: "Oh! Vinde, oh! Vinde A Cristo, o Salvador Achado tenho gozo, paz E eterno amor"
  },
  {
    id: "19",
    number: 19,
    title: "Ceia do Senhor",
    lyrics: [
      "Jesus, quando estava para ser entregue,",
      "Tomou o pão e deu graças ao Pai",
      "Partiu dizendo: 'Este é meu corpo",
      "Que por vós é dado; fazei isto em memória'"
    ],
    chorus: "Oh! Santa ceia do Senhor, Sagrado memorial Do grande amor, do grande amor De Cristo, nosso Salvador"
  }
];

export function searchHymns(query: string): Hymn[] {
  const lowerQuery = query.toLowerCase();
  return hymns.filter(hymn => 
    hymn.title.toLowerCase().includes(lowerQuery) ||
    hymn.number.toString().includes(query) ||
    hymn.lyrics.some(line => line.toLowerCase().includes(lowerQuery))
  );
}
