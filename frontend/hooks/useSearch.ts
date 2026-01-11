import { useState, useEffect, useCallback } from 'react';

interface SearchQuery {
  term: string;
  filters: Record<string, any>;
}

export const useSearch = (searchFunction: (query: SearchQuery) => Promise<any[]>) => {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Execute search when debounced query changes
  useEffect(() => {
    if (debouncedQuery.trim() || Object.keys(filters).length > 0) {
      const executeSearch = async () => {
        setLoading(true);
        setError(null);
        try {
          const searchResults = await searchFunction({
            term: debouncedQuery,
            filters,
          });
          setResults(searchResults);
        } catch (err) {
          console.error('Search failed:', err);
          setError(err instanceof Error ? err.message : 'Search failed');
          setResults([]);
        } finally {
          setLoading(false);
        }
      };

      executeSearch();
    } else {
      setResults([]);
    }
  }, [debouncedQuery, filters, searchFunction]);

  const clearSearch = useCallback(() => {
    setQuery('');
    setResults([]);
    setError(null);
  }, []);

  return {
    query,
    setQuery,
    filters,
    setFilters,
    results,
    loading,
    error,
    clearSearch,
  };
};