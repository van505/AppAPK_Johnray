import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useReducer,
} from 'react';

import { MOVIES } from '@/data/movies';
import type { CategoryFilter, Movie } from '@/types/movie';

// ─── State ───────────────────────────────────────────────────────────────────

interface State {
    movies: Movie[];
    loading: boolean;
    refreshing: boolean;
    error: string | null;
    activeCategory: CategoryFilter;
    searchQuery: string;
}

type Action =
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_REFRESHING'; payload: boolean }
    | { type: 'SET_MOVIES'; payload: Movie[] }
    | { type: 'SET_ERROR'; payload: string | null }
    | { type: 'SET_CATEGORY'; payload: CategoryFilter }
    | { type: 'SET_SEARCH'; payload: string };

const initialState: State = {
    movies: [],
    loading: false,
    refreshing: false,
    error: null,
    activeCategory: 'all',
    searchQuery: '',
};

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case 'SET_LOADING': return { ...state, loading: action.payload };
        case 'SET_REFRESHING': return { ...state, refreshing: action.payload };
        case 'SET_MOVIES': return { ...state, movies: action.payload };
        case 'SET_ERROR': return { ...state, error: action.payload };
        case 'SET_CATEGORY': return { ...state, activeCategory: action.payload };
        case 'SET_SEARCH': return { ...state, searchQuery: action.payload };
        default: return state;
    }
}

// ─── Context ─────────────────────────────────────────────────────────────────

interface ContextValue {
    state: State;
    dispatch: React.Dispatch<Action>;
    fetchMovies: (isRefresh?: boolean) => Promise<void>;
    filteredMovies: Movie[];
}

const MovieContext = createContext<ContextValue | undefined>(undefined);

export function MovieProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(reducer, initialState);

    const fetchMovies = useCallback(async (isRefresh = false) => {
        dispatch({ type: isRefresh ? 'SET_REFRESHING' : 'SET_LOADING', payload: true });
        dispatch({ type: 'SET_ERROR', payload: null });

        // Small artificial delay so the loading spinner is visible on refresh
        await new Promise((res) => setTimeout(res, isRefresh ? 600 : 300));

        dispatch({ type: 'SET_MOVIES', payload: MOVIES });
        dispatch({ type: 'SET_LOADING', payload: false });
        dispatch({ type: 'SET_REFRESHING', payload: false });
    }, []);

    useEffect(() => { fetchMovies(); }, [fetchMovies]);

    const filteredMovies = state.movies.filter((m) => {
        const matchCat = state.activeCategory === 'all' || m.category === state.activeCategory;
        const q = state.searchQuery.toLowerCase();
        const matchSearch =
            !q ||
            m.title.toLowerCase().includes(q) ||
            m.overview.toLowerCase().includes(q) ||
            m.genres.some((g) => g.toLowerCase().includes(q));
        return matchCat && matchSearch;
    });

    return (
        <MovieContext.Provider value={{ state, dispatch, fetchMovies, filteredMovies }}>
            {children}
        </MovieContext.Provider>
    );
}

export function useMovies() {
    const ctx = useContext(MovieContext);
    if (!ctx) throw new Error('useMovies must be used inside <MovieProvider>');
    return ctx;
}
