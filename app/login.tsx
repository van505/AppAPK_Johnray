import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// ── Brand colours (cinema dark theme) ────────────────────────────────────────
const BG = '#0D0D1A';
const SURFACE = '#1A1829';
const BORDER = '#252338';
const PRIMARY = '#6C63FF';
const PRIMARY_D = '#4B44CC';
const TEXT = '#FFFFFF';
const MUTED = '#7B78A8';
const PLACEHOLDER = '#4A4765';

export default function LoginScreen() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [signUpVisible, setSignUpVisible] = useState(false);

    const [suName, setSuName] = useState('');
    const [suEmail, setSuEmail] = useState('');
    const [suPassword, setSuPassword] = useState('');
    const [suConfirm, setSuConfirm] = useState('');

    const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

    const openSignUp = () => {
        setSignUpVisible(true);
        Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, bounciness: 4 }).start();
    };
    const closeSignUp = () => {
        Animated.timing(slideAnim, { toValue: SCREEN_HEIGHT, duration: 300, useNativeDriver: true })
            .start(() => setSignUpVisible(false));
    };

    return (
        <View style={styles.root}>

            {/* ── MAIN LOGIN ── */}
            <ScrollView
                contentContainerStyle={styles.container}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                {/* Logo */}
                <View style={styles.logoWrapper}>
                    <View style={styles.logoBadge}>
                        <FontAwesome name="film" size={28} color={PRIMARY} />
                    </View>
                    <Text style={styles.logoText}>CineTrack</Text>
                    <Text style={styles.tagline}>Your personal movie companion 🎬</Text>
                </View>

                {/* Form */}
                <View style={styles.formWrapper}>
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        placeholderTextColor={PLACEHOLDER}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        value={email}
                        onChangeText={setEmail}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        placeholderTextColor={PLACEHOLDER}
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                    />
                    <TouchableOpacity>
                        <Text style={styles.forgotText}>Forgot Password?</Text>
                    </TouchableOpacity>

                    {/* Login Button */}
                    <TouchableOpacity
                        style={styles.loginBtn}
                        activeOpacity={0.85}
                        onPress={() => router.replace('/(tabs)')}
                    >
                        <Text style={styles.loginBtnText}>Let's Watch! 🎥</Text>
                    </TouchableOpacity>

                    {/* Social */}
                    <Text style={styles.orText}>or sign in with</Text>
                    <View style={styles.socialRow}>
                        <TouchableOpacity style={styles.socialBtn}>
                            <FontAwesome name="facebook-square" size={38} color="#1877F2" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.socialBtn}>
                            <FontAwesome name="google" size={34} color="#EA4335" />
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>

            {/* ── SIGN UP TAB ── */}
            <TouchableOpacity style={styles.signUpTab} activeOpacity={0.9} onPress={openSignUp}>
                <FontAwesome name="chevron-up" size={12} color={TEXT} style={{ marginBottom: 2 }} />
                <Text style={styles.signUpTabText}>New here? Sign Up</Text>
            </TouchableOpacity>

            {/* ── SIGN UP BOTTOM SHEET ── */}
            <Modal visible={signUpVisible} transparent animationType="none" onRequestClose={closeSignUp}>
                <TouchableWithoutFeedback onPress={closeSignUp}>
                    <View style={styles.overlay} />
                </TouchableWithoutFeedback>

                <Animated.View style={[styles.sheet, { transform: [{ translateY: slideAnim }] }]}>
                    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
                        <ScrollView
                            contentContainerStyle={styles.sheetContent}
                            showsVerticalScrollIndicator={false}
                            keyboardShouldPersistTaps="handled"
                        >
                            <View style={styles.handle} />
                            <Text style={styles.sheetLogoHint}>CineTrack</Text>
                            <Text style={styles.sheetTitle}>Create Account</Text>
                            <View style={styles.sheetTitleUnderline} />

                            <TextInput style={styles.sheetInput} placeholder="Name" placeholderTextColor={PLACEHOLDER} value={suName} onChangeText={setSuName} />
                            <TextInput style={styles.sheetInput} placeholder="Email" placeholderTextColor={PLACEHOLDER} keyboardType="email-address" autoCapitalize="none" value={suEmail} onChangeText={setSuEmail} />
                            <TextInput style={styles.sheetInput} placeholder="Password" placeholderTextColor={PLACEHOLDER} secureTextEntry value={suPassword} onChangeText={setSuPassword} />
                            <TextInput style={styles.sheetInput} placeholder="Confirm Password" placeholderTextColor={PLACEHOLDER} secureTextEntry value={suConfirm} onChangeText={setSuConfirm} />

                            <TouchableOpacity
                                style={styles.loginBtn}
                                activeOpacity={0.85}
                                onPress={() => router.replace('/(tabs)')}
                            >
                                <Text style={styles.loginBtnText}>Join CineTrack 🍿</Text>
                            </TouchableOpacity>

                            <Text style={styles.orText}>or sign up with</Text>
                            <View style={styles.socialRow}>
                                <TouchableOpacity style={styles.socialBtn}>
                                    <FontAwesome name="facebook-square" size={38} color="#1877F2" />
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.socialBtn}>
                                    <FontAwesome name="google" size={34} color="#EA4335" />
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </KeyboardAvoidingView>
                </Animated.View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: BG },

    /* ── LOGIN ── */
    container: {
        flexGrow: 1, paddingHorizontal: 32,
        paddingTop: 80, paddingBottom: 130,
    },
    logoWrapper: { alignItems: 'center', marginBottom: 52 },
    logoBadge: {
        width: 72, height: 72, borderRadius: 22,
        backgroundColor: SURFACE,
        borderWidth: 1, borderColor: PRIMARY + '55',
        alignItems: 'center', justifyContent: 'center',
        marginBottom: 16,
        shadowColor: PRIMARY, shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5, shadowRadius: 20, elevation: 8,
    },
    logoText: {
        fontSize: 34, fontWeight: '900', color: TEXT,
        letterSpacing: -1,
    },
    tagline: { fontSize: 13, color: MUTED, marginTop: 6, textAlign: 'center' },

    formWrapper: { alignItems: 'center', gap: 14 },

    input: {
        width: '100%', height: 52,
        backgroundColor: SURFACE,
        borderRadius: 16,
        paddingHorizontal: 20,
        fontSize: 15, color: TEXT,
        borderWidth: 1, borderColor: BORDER,
    },
    forgotText: { fontSize: 13, color: MUTED, alignSelf: 'center' },

    loginBtn: {
        width: '100%', height: 54,
        backgroundColor: PRIMARY,
        borderRadius: 16,
        alignItems: 'center', justifyContent: 'center',
        marginTop: 4,
        shadowColor: PRIMARY, shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.45, shadowRadius: 14, elevation: 8,
    },
    loginBtnText: { color: TEXT, fontSize: 17, fontWeight: '800', letterSpacing: 0.2 },

    orText: { fontSize: 13, color: MUTED, marginTop: 4 },
    socialRow: { flexDirection: 'row', gap: 16, alignItems: 'center', justifyContent: 'center' },
    socialBtn: {
        width: 56, height: 56, borderRadius: 16,
        backgroundColor: SURFACE, borderWidth: 1, borderColor: BORDER,
        alignItems: 'center', justifyContent: 'center',
    },

    /* ── SIGN UP TAB ── */
    signUpTab: {
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: 68,
        backgroundColor: PRIMARY_D,
        alignItems: 'center', justifyContent: 'center',
        borderTopLeftRadius: 28, borderTopRightRadius: 28,
        shadowColor: PRIMARY, shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.3, shadowRadius: 14, elevation: 12,
    },
    signUpTabText: { color: TEXT, fontSize: 16, fontWeight: '700', letterSpacing: 0.3 },

    /* ── BOTTOM SHEET ── */
    overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' },
    sheet: {
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: SCREEN_HEIGHT * 0.82,
        backgroundColor: SURFACE,
        borderTopLeftRadius: 32, borderTopRightRadius: 32,
        shadowColor: '#000', shadowOffset: { width: 0, height: -6 },
        shadowOpacity: 0.4, shadowRadius: 20, elevation: 24,
    },
    sheetContent: {
        paddingHorizontal: 32, paddingTop: 16, paddingBottom: 40,
        alignItems: 'center', gap: 14,
    },
    handle: {
        width: 44, height: 4, borderRadius: 2,
        backgroundColor: BORDER, marginBottom: 8,
    },
    sheetLogoHint: {
        fontSize: 20, fontWeight: '900', color: MUTED,
        letterSpacing: -0.5, alignSelf: 'flex-start',
    },
    sheetTitle: {
        fontSize: 28, fontWeight: '800', color: TEXT,
        alignSelf: 'center', letterSpacing: -0.5,
    },
    sheetTitleUnderline: {
        width: 40, height: 3, backgroundColor: PRIMARY,
        borderRadius: 2, marginTop: -8, marginBottom: 4,
    },
    sheetInput: {
        width: '100%', height: 52,
        backgroundColor: BG,
        borderRadius: 16, paddingHorizontal: 20,
        fontSize: 15, color: TEXT,
        borderWidth: 1, borderColor: BORDER,
    },
});
