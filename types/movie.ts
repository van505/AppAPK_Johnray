export type MovieCategory = 'now_playing' | 'popular' | 'top_rated' | 'upcoming';
export type CategoryFilter = MovieCategory | 'all';

export interface Movie {
    id: number;
    title: string;
    overview: string;
    posterUrl: string;
    backdropUrl?: string;
    contentRating?: string; // PG, PG-13, R, etc.
    releaseDate: string;
    genreIds: number[];
    genres: string[];
    category: MovieCategory;
    storeUrl?: string;      // Apple TV / iTunes link
}
