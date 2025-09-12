import { z } from "zod";

// User Profile Schema
export const userProfileSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  photo: z.string().optional(),
  createdAt: z.string(),
});

// Bible Verse Schema
export const bibleVerseSchema = z.object({
  id: z.string(),
  book: z.string(),
  chapter: z.number(),
  verse: z.number(),
  text: z.string(),
  reference: z.string(),
  category: z.enum(['comfort', 'hope', 'gratitude', 'peace', 'strength']).optional(),
});

// Devotional Schema
export const devotionalSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  verse: z.string(),
  verseReference: z.string(),
  date: z.string(),
});

// Note Schema
export const noteSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  type: z.enum(['devotional', 'prayer', 'verses', 'reflection']),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// Hymn Schema
export const hymnSchema = z.object({
  id: z.string(),
  number: z.number(),
  title: z.string(),
  lyrics: z.array(z.string()),
  chorus: z.string().optional(),
});

// Quiz Response Schema
export const quizResponseSchema = z.object({
  id: z.string(),
  emotion: z.enum(['alegre', 'preocupado', 'triste', 'esperancoso', 'grato']),
  timestamp: z.string(),
  responseVerse: z.string(),
});

// App Settings Schema
export const appSettingsSchema = z.object({
  darkMode: z.boolean(),
  notificationsEnabled: z.boolean(),
  morningTime: z.string(),
  eveningTime: z.string(),
  fontSize: z.enum(['small', 'medium', 'large']),
  prayerAlarmEnabled: z.boolean().optional(),
  morningPrayerEnabled: z.boolean().optional(),
  eveningPrayerEnabled: z.boolean().optional(),
  morningPrayerTime: z.string().optional(),
  eveningPrayerTime: z.string().optional(),
  prayerAlarmSound: z.string().optional(),
});

export type UserProfile = z.infer<typeof userProfileSchema>;
export type BibleVerse = z.infer<typeof bibleVerseSchema>;
export type Devotional = z.infer<typeof devotionalSchema>;
export type Note = z.infer<typeof noteSchema>;
export type Hymn = z.infer<typeof hymnSchema>;
export type QuizResponse = z.infer<typeof quizResponseSchema>;
export type AppSettings = z.infer<typeof appSettingsSchema>;
