import { FontAwesome } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import {
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useMovies } from "@/store/movie-context";
import type { CategoryFilter, Movie } from "@/types/movie";

// ─── Category config ──────────────────────────────────────────────────────────

const CATEGORY_CARDS: {
  key: CategoryFilter;
  label: string;
  emoji: string;
  color: string;
  bg: string;
}[] = [
  {
    key: "all",
    label: "All Movies",
    emoji: "🍿",
    color: "#6C63FF",
    bg: "#1A1829",
  },
  {
    key: "now_playing",
    label: "Now Playing",
    emoji: "🎥",
    color: "#E63946",
    bg: "#2A1520",
  },
  {
    key: "popular",
    label: "Popular",
    emoji: "🔥",
    color: "#F5A623",
    bg: "#261D10",
  },
  {
    key: "top_rated",
    label: "Top Rated",
    emoji: "⭐",
    color: "#27AE60",
    bg: "#0E2018",
  },
  {
    key: "upcoming",
    label: "Upcoming",
    emoji: "📅",
    color: "#3498DB",
    bg: "#0F1D2A",
  },
];

function formatYear(date?: string) {
  return date?.slice(0, 4) ?? "";
}

// Fallback poster if a movie has no posterUrl
function getPosterUri(item: Movie) {
  if (item.posterUrl) return item.posterUrl;
  return `https://picsum.photos/seed/movie-${item.id}/400/600`;
}

// ─── Mini card (horizontal scroll) ───────────────────────────────────────────

function MiniCard({ item }: { item: Movie }) {
  const router = useRouter();
  return (
    <TouchableOpacity
      style={mini.card}
      activeOpacity={0.8}
      onPress={() =>
        router.push({ pathname: "/movie/[id]" as any, params: { id: item.id } })
      }
    >
      <Image
        source={{ uri: getPosterUri(item) }}
        style={mini.poster}
        contentFit="cover"
        transition={300}
      />
      {item.contentRating ? (
        <View style={mini.badge}>
          <Text style={mini.badgeText}>{item.contentRating}</Text>
        </View>
      ) : null}
      <View style={mini.info}>
        <Text style={mini.title} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={mini.year}>{formatYear(item.releaseDate)}</Text>
      </View>
    </TouchableOpacity>
  );
}

const mini = StyleSheet.create({
  card: {
    width: 120,
    backgroundColor: "#1A1829",
    borderRadius: 12,
    overflow: "hidden",
    marginRight: 10,
  },
  poster: { width: 120, height: 180 },
  badge: {
    position: "absolute",
    top: 6,
    right: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: "rgba(0,0,0,0.75)",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
  },
  badgeText: { fontSize: 10, fontWeight: "800", color: "#F5A623" },
  info: { padding: 8 },
  title: { fontSize: 12, fontWeight: "700", color: "#FFFFFF", marginBottom: 2 },
  year: { fontSize: 10, color: "#555272" },
});

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function DiscoverScreen() {
  const { state, dispatch, fetchMovies, filteredMovies } = useMovies();
  const { movies, loading, refreshing, activeCategory } = state;
  const router = useRouter();

  const counts: Record<CategoryFilter, number> = {
    all: movies.length,
    now_playing: movies.filter((m) => m.category === "now_playing").length,
    popular: movies.filter((m) => m.category === "popular").length,
    top_rated: movies.filter((m) => m.category === "top_rated").length,
    upcoming: movies.filter((m) => m.category === "upcoming").length,
  };

  const featured = movies.filter((m) => m.backdropUrl).slice(0, 10);
  const activeCfg = CATEGORY_CARDS.find((c) => c.key === activeCategory)!;

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => fetchMovies(true)}
            tintColor="#6C63FF"
            colors={["#6C63FF"]}
          />
        }
      >
        {/* ── Header ── */}
        <View style={styles.header}>
          <Text style={styles.title}>Discover</Text>
          <Text style={styles.subtitle}>Browse by category</Text>
        </View>

        {/* ── Category Cards Grid ── */}
        <View style={styles.grid}>
          {CATEGORY_CARDS.map((cat) => {
            const active = activeCategory === cat.key;
            return (
              <TouchableOpacity
                key={cat.key}
                style={[
                  styles.catCard,
                  {
                    backgroundColor: active ? cat.color : cat.bg,
                    borderColor: active ? cat.color : "#252338",
                  },
                ]}
                activeOpacity={0.8}
                onPress={() =>
                  dispatch({ type: "SET_CATEGORY", payload: cat.key })
                }
              >
                <Text style={styles.catEmoji}>{cat.emoji}</Text>
                <Text
                  style={[
                    styles.catLabel,
                    { color: active ? "#FFFFFF" : cat.color },
                  ]}
                >
                  {cat.label}
                </Text>
                <View
                  style={[
                    styles.catBadge,
                    {
                      backgroundColor: active
                        ? "rgba(255,255,255,0.2)"
                        : cat.color + "25",
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.catCount,
                      { color: active ? "#FFFFFF" : cat.color },
                    ]}
                  >
                    {counts[cat.key]}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ── Trending (horizontal) ── */}
        {featured.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🎞️ Trending</Text>
            <FlatList
              horizontal
              data={featured}
              keyExtractor={(m) => `feat-${m.id}`}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingLeft: 20, paddingRight: 10 }}
              renderItem={({ item }) => <MiniCard item={item} />}
            />
          </View>
        )}

        {/* ── Filtered List ── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {activeCfg.emoji} {activeCfg.label}
            </Text>
            <Text style={styles.sectionCount}>
              {filteredMovies.length} films
            </Text>
          </View>

          {loading ? (
            <View style={styles.stateRow}>
              <Text style={styles.stateText}>Loading movies…</Text>
            </View>
          ) : filteredMovies.length === 0 ? (
            <View style={styles.stateRow}>
              <Text style={styles.stateText}>No movies in this category</Text>
            </View>
          ) : (
            filteredMovies.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.listCard}
                activeOpacity={0.8}
                onPress={() =>
                  router.push({
                    pathname: "/movie/[id]" as any,
                    params: { id: item.id },
                  })
                }
              >
                <Image
                  source={{ uri: getPosterUri(item) }}
                  style={styles.listPoster}
                  contentFit="cover"
                  transition={300}
                />
                <View style={styles.listInfo}>
                  <Text style={styles.listTitle} numberOfLines={2}>
                    {item.title}
                  </Text>
                  <Text style={styles.listMeta}>
                    {formatYear(item.releaseDate)}
                    {item.genres[0] ? `  ·  ${item.genres[0]}` : ""}
                  </Text>
                  {item.contentRating ? (
                    <View style={styles.listRating}>
                      <Text style={styles.listRatingText}>
                        {item.contentRating}
                      </Text>
                    </View>
                  ) : null}
                </View>
                <FontAwesome name="chevron-right" size={12} color="#252338" />
              </TouchableOpacity>
            ))
          )}
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#0D0D1A" },

  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 6 },
  title: { fontSize: 28, fontWeight: "800", color: "#FFFFFF" },
  subtitle: { fontSize: 13, color: "#555272", marginTop: 2 },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 14,
    gap: 10,
    marginTop: 16,
    marginBottom: 8,
  },
  catCard: {
    width: "47%",
    borderRadius: 18,
    padding: 14,
    alignItems: "flex-start",
    gap: 6,
    borderWidth: 1,
  },
  catEmoji: { fontSize: 26 },
  catLabel: { fontSize: 14, fontWeight: "700" },
  catBadge: { borderRadius: 12, paddingHorizontal: 10, paddingVertical: 3 },
  catCount: { fontSize: 12, fontWeight: "700" },

  section: { marginTop: 24 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#FFFFFF",
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionCount: { fontSize: 12, color: "#555272" },

  listCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1A1829",
    marginHorizontal: 16,
    borderRadius: 14,
    marginBottom: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#252338",
  },
  listPoster: { width: 60, height: 90 },
  listInfo: { flex: 1, padding: 12 },
  listTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  listMeta: { fontSize: 11, color: "#555272", marginBottom: 6 },
  listRating: { flexDirection: "row", alignItems: "center", gap: 4 },
  listRatingText: { fontSize: 12, fontWeight: "700", color: "#F5A623" },

  stateRow: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    alignItems: "center",
  },
  stateText: { color: "#555272", fontSize: 14 },
});
