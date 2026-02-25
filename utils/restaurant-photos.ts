import type { Restaurant, RestaurantType } from '@/types/restaurant';

// ─── Curated fallback pools (only used when Google Places has no photo) ────────

const RESTAURANT_PHOTOS = [
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80',
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80',
    'https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?w=600&q=80',
    'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=600&q=80',
    'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&q=80',
    'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=600&q=80',
    'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80',
];
const CAFE_PHOTOS = [
    'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&q=80',
    'https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=600&q=80',
    'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80',
    'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=600&q=80',
    'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&q=80',
];
const FAST_FOOD_PHOTOS = [
    'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80',
    'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=600&q=80',
    'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=600&q=80',
    'https://images.unsplash.com/photo-1549515604-6a21b4dc7f5c?w=600&q=80',
];

// Hash a string (Place ID) to a stable number for pool indexing
function hashString(s: string): number {
    let h = 0;
    for (let i = 0; i < s.length; i++) {
        h = ((h * 31) + s.charCodeAt(i)) & 0xffffff;
    }
    return Math.abs(h);
}

function pickFrom(arr: string[], id: string): string {
    return arr[hashString(id) % arr.length];
}

/**
 * Returns the best available photo for a restaurant:
 * 1. Google Places photo URL (stored in imageUrl by the context)
 * 2. Curated food photo matched to category as fallback
 */
export function getRestaurantPhoto(restaurant: Restaurant): string {
    if (restaurant.imageUrl) return restaurant.imageUrl;

    const pool: Record<RestaurantType, string[]> = {
        restaurant: RESTAURANT_PHOTOS,
        cafe: CAFE_PHOTOS,
        fast_food: FAST_FOOD_PHOTOS,
    };
    return pickFrom(pool[restaurant.type] ?? RESTAURANT_PHOTOS, restaurant.id);
}
