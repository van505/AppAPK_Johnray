import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useReducer,
} from 'react';

import { TMDB_API_KEY } from '@/constants/api-keys';
import { MOVIES } from '@/data/movies';
import type { CategoryFilter, Movie, MovieCategory } from '@/types/movie';

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

// ─── TMDB helpers ───────────────────────────────────────────────────────────────

const TMDB_BASE = 'https://api.themoviedb.org/3';
const TMDB_IMAGE = 'https://image.tmdb.org/t/p';

type TmdbMovie = {
    id: number;
    title: string;
    overview: string;
    poster_path: string | null;
    backdrop_path: string | null;
    release_date: string;
    genre_ids: number[];
};

const GENRE_MAP: Record<number, string> = {
    28: 'Action',
    12: 'Adventure',
    16: 'Animation',
    35: 'Comedy',
    80: 'Crime',
    18: 'Drama',
    14: 'Fantasy',
    27: 'Horror',
    9648: 'Mystery',
    10749: 'Romance',
    878: 'Sci-Fi',
    53: 'Thriller',
    10752: 'War',
    10402: 'Music',
    36: 'History',
    10751: 'Family',
};

function mapTmdbMovie(m: TmdbMovie, category: MovieCategory): Movie {
    return {
        id: m.id,
        title: m.title || '(Untitled movie)',
        overview: m.overview || 'No overview available.',
        posterUrl: m.poster_path ? `${TMDB_IMAGE}/w500${m.poster_path}` : '',
        backdropUrl: m.backdrop_path ? `${TMDB_IMAGE}/w780${m.backdrop_path}` : undefined,
        contentRating: undefined,
        releaseDate: m.release_date || '',
        genreIds: m.genre_ids ?? [],
        genres: (m.genre_ids ?? []).map((id) => GENRE_MAP[id] ?? 'Unknown'),
        category,
        storeUrl: undefined,
    };
}

export function MovieProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(reducer, initialState);

    const fetchMovies = useCallback(async (isRefresh = false) => {
        dispatch({ type: isRefresh ? 'SET_REFRESHING' : 'SET_LOADING', payload: true });
        dispatch({ type: 'SET_ERROR', payload: null });

        // Small artificial delay so the loading spinner is visible on refresh
        await new Promise((res) => setTimeout(res, isRefresh ? 600 : 300));

        try {
            // If the user hasn't set a TMDB key yet, fall back to local data.
            if (!TMDB_API_KEY || TMDB_API_KEY === 'YOUR_TMDB_API_KEY_HERE') {
                dispatch({ type: 'SET_MOVIES', payload: MOVIES });
            } else {
                const endpoints: { category: MovieCategory; path: string }[] = [
                    { category: 'now_playing', path: '/movie/now_playing' },
                    { category: 'popular', path: '/movie/popular' },
                    { category: 'top_rated', path: '/movie/top_rated' },
                    { category: 'upcoming', path: '/movie/upcoming' },
                ];

                const allMovies: Movie[] = [];

                for (const { category, path } of endpoints) {
                    const url = `${TMDB_BASE}${path}?api_key=${TMDB_API_KEY}&language=en-US&page=1`;
                    const res = await fetch(url);
                    if (!res.ok) {
                        throw new Error(`TMDB request failed (${category})`);
                    }
                    const json = (await res.json()) as { results?: TmdbMovie[] };
                    const mapped = (json.results ?? []).map((m) => mapTmdbMovie(m, category));
                    allMovies.push(...mapped);
                }

                dispatch({ type: 'SET_MOVIES', payload: allMovies });
            }
        } catch (err) {
            console.error('Failed to fetch movies from TMDB', err);
            dispatch({
                type: 'SET_ERROR',
                payload: 'Unable to fetch movies right now. Please try again.',
            });
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
            dispatch({ type: 'SET_REFRESHING', payload: false });
        }
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
