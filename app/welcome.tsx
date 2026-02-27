import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function WelcomeScreen() {
    const router = useRouter();

    return (
        <LinearGradient
            colors={['#FFFFFF', '#E8EFF5', '#1A2535', '#000000']}
            locations={[0, 0.35, 0.7, 1]}
            style={styles.container}
        >
            {/* Logo Area */}
            <View style={styles.logoContainer}>
                <Text style={styles.logoText}>
                    KantoFlix
                </Text>
                <Text style={styles.tagline}>Find something great to watch tonight.</Text>
            </View>

            {/* Bottom Content */}
            <View style={styles.bottomContent}>
                <Text style={styles.welcomeTitle}>Welcome to KantoFlix</Text>
                <Text style={styles.welcomeSubtitle}>
                    Browse trending movies, explore categories, and open a film to see details
                    and watch the trailer.
                </Text>

                {/* Arrow Button */}
                <TouchableOpacity
                    style={styles.arrowButton}
                    activeOpacity={0.8}
                    onPress={() => router.replace('/login')}
                >
                    <Text style={styles.arrowText}>→</Text>
                </TouchableOpacity>
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        paddingTop: 80,
        paddingBottom: 70,
        paddingHorizontal: 28,
    },
    logoContainer: {
        alignItems: 'center',
        marginTop: 10,
    },
    logoText: {
        fontSize: 34,
        fontWeight: '800',
        color: '#111827',
        letterSpacing: -1,
    },
    tagline: {
        fontSize: 12,
        color: '#6B7280',
        marginTop: 4,
        textAlign: 'center',
    },
    bottomContent: {
        alignItems: 'center',
    },
    welcomeTitle: {
        fontSize: 26,
        fontWeight: '800',
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: 14,
        letterSpacing: -0.5,
    },
    welcomeSubtitle: {
        fontSize: 15,
        color: '#CBD5E1',
        textAlign: 'center',
        lineHeight: 23,
        marginBottom: 36,
        paddingHorizontal: 8,
    },
    arrowButton: {
        backgroundColor: '#FFFFFF',
        width: 200,
        height: 52,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 6,
    },
    arrowText: {
        fontSize: 24,
        color: '#111827',
        fontWeight: '600',
    },
});
