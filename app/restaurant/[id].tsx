import { FontAwesome } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
    Linking,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useMovies } from '@/store/movie-context';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(dateStr?: string) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function MovieDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const { state } = useMovies();

    const movie = state.movies.find((m) => m.id === Number(id));

    if (!movie) {
        return (
            <SafeAreaView style={styles.root}>
                <View style={styles.notFound}>
                    <Text style={styles.notFoundEmoji}>🎞️</Text>
                    <Text style={styles.notFoundTitle}>Movie not found</Text>
                    <TouchableOpacity style={styles.backBtnSmall} onPress={() => router.back()}>
                        <Text style={styles.backBtnSmallText}>← Go Back</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    const heroUri = movie.backdropUrl ?? movie.posterUrl;

    return (
        <SafeAreaView style={styles.root}>
            <ScrollView showsVerticalScrollIndicator={false} bounces>

                {/* ── Hero / Backdrop ─────────────────────────────────────── */}
                <View style={styles.heroWrap}>
                    <Image
                        source={{ uri: heroUri }}
                        style={styles.heroImage}
                        contentFit="cover"
                        transition={400}
                        placeholder={{ blurhash: 'L9B[IV-=00M{~qM{WBxa00M{-;xu' }}
                    />
                    {/* Dark gradient */}
                    <LinearGradient
                        colors={['transparent', 'rgba(13,13,26,0.9)', '#0D0D1A']}
                        style={styles.heroGradient}
                    />

                    {/* Back button */}
                    <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                        <FontAwesome name="chevron-left" size={14} color="#FFFFFF" />
                    </TouchableOpacity>

                    {/* Content Rating pill (PG, R, etc.) */}
                    {movie.contentRating && (
                        <View style={styles.ratingPill}>
                            <Text style={styles.ratingPillText}>{movie.contentRating}</Text>
                        </View>
                    )}
                </View>

                {/* ── Poster + Title (overlap hero bottom) ─────────────────── */}
                <View style={styles.posterRowWrap}>
                    <Image
                        source={{ uri: movie.posterUrl }}
                        style={styles.posterSmall}
                        contentFit="cover"
                        transition={300}
                        placeholder={{ blurhash: 'L9B[IV-=00M{~qM{WBxa00M{-;xu' }}
                    />
                    <View style={styles.titleBlock}>
                        <Text style={styles.movieTitle} numberOfLines={3}>{movie.title}</Text>
                        <Text style={styles.movieYear}>{formatDate(movie.releaseDate)}</Text>
                    </View>
                </View>

                {/* ── Genres ───────────────────────────────────────────────── */}
                {movie.genres.length > 0 && (
                    <View style={styles.genreRow}>
                        {movie.genres.map((g) => (
                            <View key={g} style={styles.genrePill}>
                                <Text style={styles.genrePillText}>{g}</Text>
                            </View>
                        ))}
                    </View>
                )}

                {/* ── Overview ─────────────────────────────────────────────── */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>📝 Overview</Text>
                    <Text style={styles.overview}>
                        {movie.overview || 'No overview available.'}
                    </Text>
                </View>

                {/* ── Details ──────────────────────────────────────────────── */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>ℹ️ Details</Text>
                    <View style={styles.detailsCard}>
                        <DetailRow label="Release" value={formatDate(movie.releaseDate)} />
                        <DetailRow label="Category" value={movie.category.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())} />
                        {movie.contentRating && <DetailRow label="Rating" value={movie.contentRating} />}
                        {movie.genres.length > 0 && <DetailRow label="Genres" value={movie.genres.join(', ')} />}
                    </View>
                </View>

                {/* ── CTA ──────────────────────────────────────────────────── */}
                <View style={styles.ctaWrap}>
                    <TouchableOpacity
                        style={styles.ctaBtn}
                        activeOpacity={0.85}
                        onPress={() =>
                            Linking.openURL(`https://www.youtube.com/results?search_query=${encodeURIComponent(movie.title + ' official trailer')}`)
                        }
                    >
                        <FontAwesome name="youtube-play" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
                        <Text style={styles.ctaBtnText}>Watch Trailer on YouTube</Text>
                    </TouchableOpacity>

                    {movie.storeUrl ? (
                        <TouchableOpacity
                            style={styles.ctaBtnSecondary}
                            activeOpacity={0.8}
                            onPress={() => Linking.openURL(movie.storeUrl!)}
                        >
                            <FontAwesome name="apple" size={15} color="#6C63FF" style={{ marginRight: 6 }} />
                            <Text style={styles.ctaBtnSecondaryText}>View on Apple TV</Text>
                        </TouchableOpacity>
                    ) : null}
                </View>

                <View style={{ height: 32 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

function DetailRow({ label, value }: { label: string; value: string }) {
    return (
        <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>{label}</Text>
            <Text style={styles.detailValue}>{value}</Text>
        </View>
    );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: '#0D0D1A' },

    heroWrap: { height: 260, position: 'relative' },
    heroImage: { width: '100%', height: '100%' },
    heroGradient: { ...StyleSheet.absoluteFillObject },

    backBtn: {
        position: 'absolute', top: 16, left: 16, width: 36, height: 36,
        borderRadius: 18, backgroundColor: 'rgba(0,0,0,0.5)',
        alignItems: 'center', justifyContent: 'center',
    },
    ratingPill: {
        position: 'absolute', top: 16, right: 16, flexDirection: 'row', alignItems: 'center', gap: 4,
        backgroundColor: 'rgba(0,0,0,0.65)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20,
    },
    ratingPillText: { color: '#F5A623', fontWeight: '800', fontSize: 15 },
    ratingVotes: { color: 'rgba(255,255,255,0.5)', fontSize: 10 },

    /* Poster + title row */
    posterRowWrap: { flexDirection: 'row', alignItems: 'flex-end', paddingHorizontal: 20, marginTop: -60, gap: 14 },
    posterSmall: { width: 90, height: 135, borderRadius: 12, borderWidth: 2, borderColor: '#252338' },
    titleBlock: { flex: 1, paddingBottom: 6 },
    movieTitle: { fontSize: 20, fontWeight: '900', color: '#FFFFFF', lineHeight: 26 },
    movieYear: { fontSize: 12, color: '#555272', marginTop: 4 },
    movieStars: { fontSize: 14, marginTop: 4 },

    /* Genres */
    genreRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingHorizontal: 20, marginTop: 14 },
    genrePill: { backgroundColor: '#1A1829', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 5, borderWidth: 1, borderColor: '#252338' },
    genrePillText: { fontSize: 12, fontWeight: '700', color: '#6C63FF' },

    /* Sections */
    section: { paddingHorizontal: 20, marginTop: 22 },
    sectionTitle: { fontSize: 16, fontWeight: '800', color: '#FFFFFF', marginBottom: 10 },
    overview: { fontSize: 14, color: '#9592A8', lineHeight: 22 },

    /* Details card */
    detailsCard: { backgroundColor: '#1A1829', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#252338' },
    detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#252338' },
    detailLabel: { fontSize: 12, color: '#555272', fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, flex: 1 },
    detailValue: { fontSize: 13, color: '#FFFFFF', fontWeight: '600', flex: 2, textAlign: 'right' },

    /* CTAs */
    ctaWrap: { paddingHorizontal: 20, marginTop: 24, gap: 10 },
    ctaBtn: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        height: 52, borderRadius: 28, backgroundColor: '#E63946',
        shadowColor: '#E63946', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.35, shadowRadius: 12, elevation: 6,
    },
    ctaBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
    ctaBtnSecondary: {
        height: 48, borderRadius: 28, alignItems: 'center', justifyContent: 'center',
        backgroundColor: '#1A1829', borderWidth: 1, borderColor: '#252338',
    },
    ctaBtnSecondaryText: { color: '#6C63FF', fontSize: 14, fontWeight: '700' },

    /* Not found */
    notFound: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 40 },
    notFoundEmoji: { fontSize: 48 },
    notFoundTitle: { fontSize: 20, fontWeight: '700', color: '#FFFFFF' },
    backBtnSmall: { marginTop: 8, backgroundColor: '#6C63FF', paddingHorizontal: 28, paddingVertical: 12, borderRadius: 24 },
    backBtnSmallText: { color: '#FFFFFF', fontWeight: '700', fontSize: 15 },
});
