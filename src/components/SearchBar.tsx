"use client";

import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Loader2, AlertCircle, TrendingUp } from 'lucide-react';

// --- Custom Hook for Debouncing ---
/**
 * A custom hook to debounce any fast-changing value.
 * @param value The value to debounce (e.g., search text)
 * @param delay The delay in milliseconds (e.g., 500)
 * @returns The debounced value
 */
function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        // Set up a timer to update the debounced value after the delay
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // Clean up the timer if the value changes (e.g., user keeps typing)
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}

// --- Type for the Demo API Response ---
// Using JSONPlaceholder 'posts' as a stand-in for video suggestions
type VideoSuggestion = {
    id: number;
    title: string;
    userId: number; // We can pretend this is the channelId
};

// --- API Fetching Function ---
/**
 * Fetches video suggestions from the demo API.
 * React Query's `queryFn` will call this.
 */
const fetchVideoSuggestions = async (query: string): Promise<VideoSuggestion[]> => {
    if (query.length < 3) {
        return []; // Don't search for less than 3 characters
    }

    // Using a demo API for suggestions
    const res = await fetch(`https://jsonplaceholder.typicode.com/posts?q=${query}`);

    if (!res.ok) {
        throw new Error('Network response was not ok');
    }

    const data = await res.json();
    // Limit to 5 results for a clean dropdown
    return data.slice(0, 5);
};


// --- The Main SearchBar Component ---
export default function SearchBar() {
    const [searchTerm, setSearchTerm] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const searchContainerRef = useRef<HTMLDivElement>(null);

    // Use the custom hook to debounce the search term by 500ms
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    // --- React Query ---
    const {
        data: suggestions,
        isLoading,
        isError
    } = useQuery<VideoSuggestion[], Error>({
        // The queryKey includes the debounced term, so it re-fetches only when that changes
        queryKey: ['video-search', debouncedSearchTerm],

        // The queryFn calls our fetcher
        queryFn: () => fetchVideoSuggestions(debouncedSearchTerm),

        // `enabled` ensures the query only runs if the user has typed >= 3 chars
        enabled: debouncedSearchTerm.length >= 3,

        // Optional: Keep data fresh for 5 minutes
        staleTime: 1000 * 60 * 5,
    });

    // Effect to handle clicking outside the component to close suggestions
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
                setIsFocused(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const showSuggestions = isFocused && searchTerm.length > 0;

    return (
        <div className="relative w-full max-w-xs" ref={searchContainerRef}>
            <div className="relative w-full">
                <Search className="h-4 w-4 absolute left-2 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                <input
                    type="text"
                    placeholder="Search ..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    className="border border-gray-300 rounded-full py-1 pl-8 pr-2 w-full text-xs focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all h-8 text-gray-100"
                />
                {isLoading && (
                    <Loader2 className="h-4 w-4 absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 animate-spin" />
                )}
            </div>

            {/* --- Suggestions Dropdown --- */}
            {showSuggestions && (
                <div className="absolute top-full mt-2 w-full bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl overflow-hidden z-10">
                    {/* Loading State */}
                    {isLoading && (
                        <div className="p-4 text-sm text-zinc-400 flex items-center justify-center">
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Searching...
                        </div>
                    )}

                    {/* Error State */}
                    {isError && !isLoading && (
                        <div className="p-4 text-sm text-red-400 flex items-center">
                            <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                            Could not fetch suggestions.
                        </div>
                    )}

                    {/* Prompt to type more */}
                    {!isLoading && !isError && debouncedSearchTerm.length < 3 && searchTerm.length > 0 && (
                        <div className="p-4 text-sm text-zinc-400">
                            Keep typing to see suggestions...
                        </div>
                    )}

                    {/* No Results State */}
                    {!isLoading && !isError && debouncedSearchTerm.length >= 3 && suggestions?.length === 0 && (
                        <div className="p-4 text-sm text-zinc-400">
                            No results found for &quot;{debouncedSearchTerm}&quot;
                        </div>
                    )}

                    {/* Suggestions List */}
                    {!isLoading && !isError && debouncedSearchTerm.length >= 3 && (suggestions?.length ?? 0) > 0 && (
                        <ul>
                            {suggestions?.map((suggestion) => (
                                <li key={suggestion.id}>
                                    <a
                                        href={`/watch?v=${suggestion.id}`} // In a real app, use <Link>
                                        className="flex items-center px-4 py-3 hover:bg-purple-600 hover:text-white transition-colors"
                                        // Hide suggestions on click (or navigate)
                                        onClick={() => setIsFocused(false)}
                                    >
                                        <TrendingUp className="w-4 h-4 mr-3 text-zinc-400" />
                                        <span className="text-sm truncate">{suggestion.title}</span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
}
