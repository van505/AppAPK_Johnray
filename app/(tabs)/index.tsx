import { FontAwesome } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useMovies } from '@/store/movie-context';
import type { CategoryFilter, Movie } from '@/types/movie';

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORIES: { key: CategoryFilter; label: string; emoji: string }[] = [
  { key: 'all', label: 'All', emoji: '🍿' },
  { key: 'now_playing', label: 'Now Playing', emoji: '🎥' },
  { key: 'popular', label: 'Popular', emoji: '🔥' },
  { key: 'top_rated', label: 'Top Rated', emoji: '⭐' },
  { key: 'upcoming', label: 'Upcoming', emoji: '📅' },
];

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning 🌤️';
  if (h < 17) return 'Good Afternoon ☀️';
  if (h < 21) return 'Good Evening 🎬';
  return 'Movie Night 🌙';
}

function formatYear(date?: string) {
  return date?.slice(0, 4) ?? '';
}

// ─── Movie Card (portrait poster, 2-column grid) ──────────────────────────────

function MovieCard({ item }: { item: Movie }) {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={() => router.push({ pathname: '/restaurant/[id]', params: { id: item.id } })}
    >
      {/* Poster */}
      <Image
        source={{ uri: item.posterUrl }}
        style={styles.poster}
        contentFit="cover"
        transition={300}
        placeholder={{ blurhash: 'L9B[IV-=00M{~qM{WBxa00M{-;xu' }}
      />

      {/* Content rating badge (PG, PG-13, R, etc.) */}
      <View style={styles.cardOverlay}>
        {item.contentRating ? (
          <View style={styles.ratingBadge}>
            <Text style={styles.ratingText}>{item.contentRating}</Text>
          </View>
        ) : null}
      </View>

      {/* Info below poster */}
      <View style={styles.cardInfo}>
        <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.cardMeta}>
          {formatYear(item.releaseDate)}
          {item.genres[0] ? `  ·  ${item.genres[0]}` : ''}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

// ─── Empty / Error / Loading ───────────────────────────────────────────────────

function EmptyState({ onRetry }: { onRetry: () => void }) {
  return (
    <View style={styles.centerWrap}>
      <Text style={styles.stateEmoji}>🎞️</Text>
      <Text style={styles.stateTitle}>No movies found</Text>
      <Text style={styles.stateSub}>Try a different category or search term.</Text>
      <TouchableOpacity style={styles.retryBtn} onPress={onRetry}>
        <Text style={styles.retryBtnText}>Refresh</Text>
      </TouchableOpacity>
    </View>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <View style={styles.centerWrap}>
      <Text style={styles.stateEmoji}>⚠️</Text>
      <Text style={styles.stateTitle}>Couldn't load movies</Text>
      <Text style={styles.stateSub}>{message}</Text>
      <TouchableOpacity style={styles.retryBtn} onPress={onRetry}>
        <Text style={styles.retryBtnText}>Try Again</Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function MoviesHomeScreen() {
  const { state, dispatch, fetchMovies, filteredMovies } = useMovies();
  const { loading, refreshing, error, activeCategory, searchQuery, movies } = state;

  const counts: Record<CategoryFilter, number> = {
    all: movies.length,
    now_playing: movies.filter((m) => m.category === 'now_playing').length,
    popular: movies.filter((m) => m.category === 'popular').length,
    top_rated: movies.filter((m) => m.category === 'top_rated').length,
    upcoming: movies.filter((m) => m.category === 'upcoming').length,
  };

  return (
    <SafeAreaView style={styles.root}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{getGreeting()}</Text>
          <Text style={styles.subGreeting}>What are you watching tonight?</Text>
        </View>
        <View style={styles.logoWrap}>
          <FontAwesome name="film" size={14} color="#6C63FF" />
          <Text style={styles.logoText}> Movies</Text>
        </View>
      </View>

      {/* ── Search ── */}
      <View style={styles.searchWrap}>
        <FontAwesome name="search" size={14} color="#555272" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search movies, genres…"
          placeholderTextColor="#555272"
          value={searchQuery}
          onChangeText={(t) => dispatch({ type: 'SET_SEARCH', payload: t })}
          returnKeyType="search"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => dispatch({ type: 'SET_SEARCH', payload: '' })}>
            <FontAwesome name="times-circle" size={15} color="#555272" />
          </TouchableOpacity>
        )}
      </View>

      {/* ── Category Tabs ── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabsRow}
      >
        {CATEGORIES.map((cat) => {
          const active = activeCategory === cat.key;
          return (
            <TouchableOpacity
              key={cat.key}
              style={styles.tab}
              onPress={() => dispatch({ type: 'SET_CATEGORY', payload: cat.key })}
              activeOpacity={0.7}
            >
              {/* Emoji box */}
              <View style={[styles.tabIconBox, active && styles.tabIconBoxActive]}>
                <Text style={styles.tabEmoji}>{cat.emoji}</Text>
              </View>
              <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>
                {cat.label}
              </Text>
              {counts[cat.key] > 0 && (
                <View style={[styles.tabBadge, active && styles.tabBadgeActive]}>
                  <Text style={[styles.tabBadgeText, active && styles.tabBadgeTextActive]}>
                    {counts[cat.key]}
                  </Text>
                </View>
              )}
              <View style={[styles.tabBar, active && styles.tabBarActive]} />
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* ── Count ── */}
      {!loading && !error && (
        <View style={styles.countRow}>
          <Text style={styles.countText}>
            {filteredMovies.length} movie{filteredMovies.length !== 1 ? 's' : ''}
          </Text>
        </View>
      )}

      {/* ── Content ── */}
      {loading ? (
        <View style={styles.centerWrap}>
          <ActivityIndicator size="large" color="#6C63FF" />
          <Text style={styles.loadingText}>Fetching movies…</Text>
        </View>
      ) : error ? (
        <ErrorState message={error} onRetry={() => fetchMovies()} />
      ) : (
        <FlatList
          data={filteredMovies}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          renderItem={({ item }) => <MovieCard item={item} />}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.gridContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<EmptyState onRetry={() => fetchMovies()} />}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => fetchMovies(true)}
              tintColor="#6C63FF"
              colors={['#6C63FF']}
            />
          }
        />
      )}
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const CARD_W = 170;
const POSTER_H = CARD_W * 1.5; // standard 2:3 movie poster ratio

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0D0D1A' },

  /* Header */
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 12, paddingBottom: 10,
  },
  greeting: { fontSize: 20, fontWeight: '800', color: '#FFFFFF' },
  subGreeting: { fontSize: 12, color: '#555272', marginTop: 2 },
  logoWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1A1829', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  logoText: { fontSize: 13, fontWeight: '800', color: '#6C63FF' },

  /* Search */
  searchWrap: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#1A1829',
    marginHorizontal: 16, marginBottom: 12, borderRadius: 28,
    paddingHorizontal: 16, height: 46,
    borderWidth: 1, borderColor: '#252338',
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 14, color: '#FFFFFF' },

  /* Category Tabs */
  tabsRow: { paddingLeft: 12, paddingRight: 4, paddingTop: 10, paddingBottom: 8, flexDirection: 'row', marginTop: 8 },
  tab: {
    alignItems: 'center', justifyContent: 'flex-start',
    paddingHorizontal: 10, paddingTop: 0, paddingBottom: 0,
    marginRight: 6, minWidth: 80,
  },
  tabIconBox: {
    width: 58, height: 58, borderRadius: 18,
    backgroundColor: '#1A1829',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 8,
    borderWidth: 1, borderColor: '#252338',
  },
  tabIconBoxActive: {
    backgroundColor: 'rgba(108,99,255,0.18)',
    borderColor: '#6C63FF',
  },
  tabEmoji: { fontSize: 28 },
  tabLabel: { fontSize: 13, fontWeight: '700', color: '#555272', marginBottom: 10, textAlign: 'center' },
  tabLabelActive: { color: '#FFFFFF' },
  tabBadge: { backgroundColor: '#252338', borderRadius: 10, paddingHorizontal: 6, paddingVertical: 2, marginBottom: 8, marginTop: -4 },
  tabBadgeActive: { backgroundColor: '#6C63FF' },
  tabBadgeText: { fontSize: 10, fontWeight: '800', color: '#555272' },
  tabBadgeTextActive: { color: '#FFFFFF' },
  tabBar: { height: 3, width: '100%', borderRadius: 2, backgroundColor: 'transparent' },
  tabBarActive: { backgroundColor: '#6C63FF', shadowColor: '#6C63FF', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.9, shadowRadius: 6, elevation: 4 },

  countRow: { paddingHorizontal: 20, marginBottom: 8 },
  countText: { fontSize: 12, color: '#555272', fontWeight: '500' },

  /* Grid */
  gridContent: { paddingHorizontal: 12, paddingBottom: 24 },
  row: { justifyContent: 'space-between', marginBottom: 14, paddingHorizontal: 4 },

  /* Card */
  card: { width: CARD_W, borderRadius: 12, overflow: 'hidden', backgroundColor: '#1A1829' },
  poster: { width: CARD_W, height: POSTER_H },
  cardOverlay: {
    position: 'absolute', top: 8, right: 8,
  },
  ratingBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    backgroundColor: 'rgba(0,0,0,0.7)', paddingHorizontal: 7, paddingVertical: 4, borderRadius: 10,
  },
  ratingText: { fontSize: 11, fontWeight: '800', color: '#F5A623' },
  cardInfo: { padding: 10 },
  cardTitle: { fontSize: 13, fontWeight: '700', color: '#FFFFFF', marginBottom: 3, lineHeight: 18 },
  cardMeta: { fontSize: 11, color: '#555272' },

  /* States */
  centerWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40, gap: 12 },
  stateEmoji: { fontSize: 48 },
  stateTitle: { fontSize: 20, fontWeight: '700', color: '#FFFFFF' },
  stateSub: { fontSize: 13, color: '#555272', textAlign: 'center', lineHeight: 20 },
  loadingText: { fontSize: 14, color: '#555272' },
  retryBtn: { marginTop: 8, backgroundColor: '#6C63FF', paddingHorizontal: 28, paddingVertical: 12, borderRadius: 24 },
  retryBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 15 },
});
