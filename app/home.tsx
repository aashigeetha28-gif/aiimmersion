import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useLang } from './context';
 
const languages = [
  { code: 'tamil', label: 'தமிழ்', sub: 'Tamil', flag: '🌿' },
  { code: 'english', label: 'English', sub: 'English', flag: '🌍' },
 
];
 
export default function HomeScreen() {
  const router = useRouter();
  const { lang, setLang, t } = useLang();
 
  if (!lang) {
    return (
      <View style={styles.langContainer}>
        <Text style={styles.langEmoji}>🌾</Text>
        <Text style={styles.langAppName}>UZHAVAR IQ</Text>
        <Text style={styles.langAppSub}>Smart Farming Assistant</Text>
        <Text style={styles.langPrompt}>Select Language</Text>
        {languages.map((l) => (
          <TouchableOpacity
            key={l.code}
            style={styles.langCard}
            onPress={() => setLang(l.code)}
          >
            <Text style={styles.langFlag}>{l.flag}</Text>
            <View>
              <Text style={styles.langLabel}>{l.label}</Text>
              <Text style={styles.langSub}>{l.sub}</Text>
            </View>
            <Text style={styles.langArrow}>›</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  }
 
  return (
    <ScrollView style={styles.container}>
      {/* Hero Section */}
      <View style={styles.hero}>
        <View style={styles.heroBadge}>
          <Text style={styles.heroBadgeText}>🌱 AI Powered</Text>
        </View>
        <Text style={styles.emoji}>🌾</Text>
        <Text style={styles.langAppName}>UZHAVAR IQ</Text>
        <Text style={styles.subtitle}>{t.subtitle}</Text>
        <TouchableOpacity onPress={() => setLang('')} style={styles.changeLang}>
          <Text style={styles.changeLangText}>🌐 {t.changeLang}</Text>
        </TouchableOpacity>
      </View>
 
      {/* Feature Cards */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Features</Text>
      </View>
 
      <View style={styles.grid}>
        
 
        {/* Disease Detection */}
        <TouchableOpacity
          style={[styles.card, { borderColor: '#fbbf24' }]}
          onPress={() => router.push('/disease')}
        >
          <View style={[styles.cardIconBg, { backgroundColor: '#fbbf2420' }]}>
            <Text style={styles.cardEmoji}>🔬</Text>
          </View>
          <Text style={styles.cardTitle}>{t.disease}</Text>
          <Text style={styles.cardDesc}>Detect plant diseases</Text>
          <View style={[styles.cardArrow, { backgroundColor: '#fbbf2420' }]}>
            <Text style={styles.cardArrowText}>→</Text>
          </View>
        </TouchableOpacity>
 
        {/* Market Price */}
        <TouchableOpacity
          style={[styles.card, { borderColor: '#60a5fa' }]}
          onPress={() => router.push('/market')}
        >
          <View style={[styles.cardIconBg, { backgroundColor: '#60a5fa20' }]}>
            <Text style={styles.cardEmoji}>📈</Text>
          </View>
          <Text style={styles.cardTitle}>{t.market}</Text>
          <Text style={styles.cardDesc}>Live market prices</Text>
          <View style={[styles.cardArrow, { backgroundColor: '#60a5fa20' }]}>
            <Text style={styles.cardArrowText}>→</Text>
          </View>
        </TouchableOpacity>
 
       
      </View>
 
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}
 
const styles = StyleSheet.create({
  // Language Selection
  langContainer: {
    flex: 1,
    backgroundColor: '#0a1f0e',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  langEmoji: { fontSize: 64, marginBottom: 8 },
  langAppName: { fontSize: 30, fontWeight: 'bold', color: '#4ade80' },
  langAppSub: { fontSize: 13, color: '#6b9e74', marginBottom: 32 },
  langPrompt: { fontSize: 15, color: '#6b9e74', marginBottom: 16 },
  langCard: {
    width: '100%',
    backgroundColor: '#112214',
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1e3d23',
  },
  langFlag: { fontSize: 28, marginRight: 16 },
  langLabel: { fontSize: 18, fontWeight: '700', color: '#e2f5e6' },
  langSub: { fontSize: 12, color: '#6b9e74' },
  langArrow: { fontSize: 24, color: '#4ade80', marginLeft: 'auto' },
 
  // Main Screen
  container: { flex: 1, backgroundColor: '#0a1f0e' },
 
  // Hero
  hero: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 20,
  },
  heroBadge: {
    backgroundColor: '#4ade8020',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 5,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#4ade8040',
  },
  heroBadgeText: { color: '#4ade80', fontSize: 12, fontWeight: '600' },
  emoji: { fontSize: 60, marginBottom: 8 },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4ade80',
    marginBottom: 6,
    letterSpacing: 1,
  },
  subtitle: { fontSize: 15, color: '#6b9e74', textAlign: 'center' },
  changeLang: {
    marginTop: 14,
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#4ade80',
    backgroundColor: '#4ade8010',
  },
  changeLangText: { color: '#4ade80', fontSize: 13 },
 
  // Section
  sectionHeader: { paddingHorizontal: 16, marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#e2f5e6' },
 
  // Grid Cards
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 12,
  },
  card: {
    width: '47%',
    backgroundColor: '#112214',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1.5,
  },
  cardIconBg: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  cardEmoji: { fontSize: 28 },
  cardTitle: {
    fontSize: 13,
    color: '#e2f5e6',
    fontWeight: '700',
    marginBottom: 4,
  },
  cardDesc: { fontSize: 11, color: '#6b9e74', marginBottom: 12 },
  cardArrow: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardArrowText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
});
 