import { type UserProfile, type Note, type BibleVerse, type Devotional } from "@shared/schema";
import { randomUUID } from "crypto";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // User methods
  getUser(id: string): Promise<UserProfile | undefined>;
  createUser(user: Omit<UserProfile, 'id'>): Promise<UserProfile>;
  
  // Notes methods
  getNotes(userId: string): Promise<Note[]>;
  createNote(note: Omit<Note, 'id'>): Promise<Note>;
  updateNote(id: string, updates: Partial<Note>): Promise<Note | undefined>;
  deleteNote(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, UserProfile>;
  private notes: Map<string, Note>;

  constructor() {
    this.users = new Map();
    this.notes = new Map();
  }

  async getUser(id: string): Promise<UserProfile | undefined> {
    return this.users.get(id);
  }

  async createUser(userData: Omit<UserProfile, 'id'>): Promise<UserProfile> {
    const id = randomUUID();
    const user: UserProfile = { ...userData, id };
    this.users.set(id, user);
    return user;
  }

  async getNotes(userId: string): Promise<Note[]> {
    return Array.from(this.notes.values()).filter(note => note.id.startsWith(userId));
  }

  async createNote(noteData: Omit<Note, 'id'>): Promise<Note> {
    const id = randomUUID();
    const note: Note = { ...noteData, id };
    this.notes.set(id, note);
    return note;
  }

  async updateNote(id: string, updates: Partial<Note>): Promise<Note | undefined> {
    const note = this.notes.get(id);
    if (!note) return undefined;
    
    const updatedNote = { ...note, ...updates };
    this.notes.set(id, updatedNote);
    return updatedNote;
  }

  async deleteNote(id: string): Promise<boolean> {
    return this.notes.delete(id);
  }
}

export const storage = new MemStorage();
