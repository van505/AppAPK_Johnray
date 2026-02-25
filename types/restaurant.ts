export type RestaurantType = 'restaurant' | 'cafe' | 'fast_food';
export type CategoryFilter = RestaurantType | 'all';

export interface Restaurant {
    id: string;          // Google Place ID (e.g. "ChIJN1t_tDeuEmsR...")
    lat: number;
    lng: number;
    name: string;
    type: RestaurantType;
    cuisine?: string;
    openingHours?: string;
    phone?: string;
    website?: string;
    address?: string;    // "vicinity" from Google Places
    distance?: number;   // metres, computed via Haversine
    imageUrl?: string;   // Google Places Photo URL (includes API key)
    rating?: number;     // e.g. 4.2
    openNow?: boolean;   // from Google Places opening_hours.open_now
}

export interface AppLocation {
    lat: number;
    lng: number;
    city?: string;
}
