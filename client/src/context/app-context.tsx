import React, { createContext, useContext, ReactNode } from "react";
import { UserProfile, AppSettings, Note } from "@shared/schema";
import { useLocalStorage } from "../hooks/use-local-storage";

interface AppContextType {
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;
  settings: AppSettings;
  setSettings: (settings: AppSettings) => void;
  notes: Note[];
  setNotes: (notes: Note[]) => void;
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const defaultSettings: AppSettings = {
  darkMode: false,
  notificationsEnabled: true,
  morningTime: "07:00",
  eveningTime: "20:00",
  fontSize: "medium",
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useLocalStorage<UserProfile | null>("user", null);
  const [settings, setSettings] = useLocalStorage<AppSettings>("settings", defaultSettings);
  const [notes, setNotes] = useLocalStorage<Note[]>("notes", []);

  const addNote = (noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newNote: Note = {
      ...noteData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setNotes([...notes, newNote]);
  };

  const updateNote = (id: string, updates: Partial<Note>) => {
    setNotes(notes.map(note => 
      note.id === id 
        ? { ...note, ...updates, updatedAt: new Date().toISOString() }
        : note
    ));
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  return (
    <AppContext.Provider value={{
      user,
      setUser,
      settings,
      setSettings,
      notes,
      setNotes,
      addNote,
      updateNote,
      deleteNote,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
