import { useState, useEffect, useCallback } from 'react';

const RECENT_HYMNS_KEY = 'recent-hymns';
const MAX_RECENT_HYMNS = 7;

export function useRecentHymns() {
  const [recentHymns, setRecentHymns] = useState<number[]>([]);

  // Load recent hymns from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(RECENT_HYMNS_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setRecentHymns(parsed);
        }
      } catch (error) {
        console.error('Erro ao carregar hinos recentes:', error);
        setRecentHymns([]);
      }
    }
  }, []);

  // Add hymn to recent list - memoized to prevent re-render loops
  const addToRecent = useCallback((hymnNumber: number) => {
    setRecentHymns(current => {
      // Remove if already exists
      const filtered = current.filter(num => num !== hymnNumber);
      // Add to beginning
      const updated = [hymnNumber, ...filtered];
      // Keep only the last 7
      const trimmed = updated.slice(0, MAX_RECENT_HYMNS);
      
      // Save to localStorage
      localStorage.setItem(RECENT_HYMNS_KEY, JSON.stringify(trimmed));
      
      return trimmed;
    });
  }, []);

  // Clear recent hymns
  const clearRecent = useCallback(() => {
    setRecentHymns([]);
    localStorage.removeItem(RECENT_HYMNS_KEY);
  }, []);

  return {
    recentHymns,
    addToRecent,
    clearRecent
  };
}