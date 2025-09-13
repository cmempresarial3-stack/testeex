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

export type Devotional = {
  id: string;
  title: string;
  content: string;
  verse: string;
  verseReference: string;
  date: string;
};

export function getTodayDevotional(): Devotional {
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
  const index = dayOfYear % (dailyDevotionals as DailyDevotional[]).length;
  const devotional = (dailyDevotionals as DailyDevotional[])[index];
  
  // Format date as YYYY-MM-DD
  const dateStr = today.toISOString().split('T')[0];
  
  return {
    id: devotional.day.toString(),
    title: devotional.theme,
    content: devotional.reflection,
    verse: devotional.verse.text,
    verseReference: devotional.verse.reference,
    date: dateStr
  };
}

// Export the full devotional data for detailed view
export function getFullDevotional(dayNumber?: number): DailyDevotional {
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
  const index = dayNumber ? ((dayNumber - 1) % (dailyDevotionals as DailyDevotional[]).length) : (dayOfYear % (dailyDevotionals as DailyDevotional[]).length);
  
  return (dailyDevotionals as DailyDevotional[])[index];
}