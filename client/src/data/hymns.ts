import { Hymn } from "@shared/schema";
import hymnData from "./hymns.json";

// Transform JSON data to match our Hymn interface
function transformHymnData(): Hymn[] {
  const hymns: Hymn[] = [];
  
  for (const [key, data] of Object.entries(hymnData)) {
    // Skip metadata entry
    if (key === "-1") continue;
    
    const hymnObj = data as {
      hino: string;
      coro?: string;
      verses: { [key: string]: string };
    };
    
    // Extract title from "number - title" format
    const titleMatch = hymnObj.hino.match(/^\d+\s*-\s*(.+)$/);
    const title = titleMatch ? titleMatch[1] : hymnObj.hino;
    
    // Convert verses object to array and clean HTML tags
    const lyrics: string[] = [];
    Object.values(hymnObj.verses).forEach(verse => {
      const cleanVerse = verse.replace(/<br\s*\/?>/gi, '\n');
      lyrics.push(cleanVerse);
    });
    
    // Clean chorus if it exists
    const chorus = hymnObj.coro ? hymnObj.coro.replace(/<br\s*\/?>/gi, '\n') : "";
    
    hymns.push({
      id: key,
      number: parseInt(key),
      title,
      lyrics,
      chorus
    });
  }
  
  return hymns.sort((a, b) => a.number - b.number);
}

export const hymns = transformHymnData();

export function searchHymns(query: string): Hymn[] {
  const lowerQuery = query.toLowerCase();
  return hymns.filter(hymn => 
    hymn.title.toLowerCase().includes(lowerQuery) ||
    hymn.number.toString().includes(query) ||
    hymn.lyrics.some(line => line.toLowerCase().includes(lowerQuery)) ||
    (hymn.chorus && hymn.chorus.toLowerCase().includes(lowerQuery))
  );
}
