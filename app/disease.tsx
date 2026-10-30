import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useLang } from './context';

const CROP_HEALTH_API_KEY = process.env.EXPO_PUBLIC_CROP_HEALTH_API_KEY || '';
const GROQ_API_KEY = process.env.EXPO_PUBLIC_GROQ_API_KEY || '';

const staticText: any = {
  tamil: {
    headerTitle: '🔬 நோய் பகுப்பாய்வு',
    sectionTitle: '📸 பயிர் படம் எடுங்கள்',
    hint: 'இலை, தண்டு அல்லது கனி-ன் தெளிவான படம் எடுங்கள்',
    camera: '📷 Camera',
    gallery: '🖼️ Gallery',
    analyzing: 'AI பகுப்பாய்கிறது...',
    analyzeBtn: '🤖 AI நோயை கண்டறி',
    errorImage: '❌ இது பயிர் படம் இல்லை. இலை அல்லது தண்டின் தெளிவான படம் எடுங்கள்.',
    errorNet: '❌ Internet connection சரி பார்க்கவும்.',
    invalidPhoto: '❌ Invalid Photo! பயிரின் இலையை மட்டும் எடுங்கள்.',
    healthyTitle: '✅ பயிர் நிலை',
    diseaseTitle: '⚠️ கண்டறியப்பட்ட நோய்',
    healthyLabel: 'நோய் இல்லை',
    solutionHealthy: '✅ பராமரிப்பு குறிப்புகள்',
    solutionDisease: '🌿 இயற்கை தீர்வுகள்',
    modelNote: '🤖 crop.health AI • Real-time Analysis',
    loadingSolution: '🌿 இயற்கை தீர்வு தயாரிக்கிறது...',
    solutionFallback: '🌿 இயற்கை தீர்வு பெற முடியவில்லை. மீண்டும் முயற்சிக்கவும்.',
  },
  english: {
    headerTitle: '🔬 Disease Analysis',
    sectionTitle: '📸 Take Crop Photo',
    hint: 'Take a clear photo of leaf, stem or fruit',
    camera: '📷 Camera',
    gallery: '🖼️ Gallery',
    analyzing: 'AI Analyzing...',
    analyzeBtn: '🤖 Detect Disease with AI',
    errorImage: '❌ This is not a crop photo. Take a clear photo of a leaf or stem.',
    errorNet: '❌ Check your internet connection.',
    invalidPhoto: '❌ Invalid Photo! Please take a photo of a crop leaf only.',
    healthyTitle: '✅ Crop Status',
    diseaseTitle: '⚠️ Disease Detected',
    healthyLabel: 'No Disease / Healthy',
    solutionHealthy: '✅ Care Tips',
    solutionDisease: '🌿 Natural Solutions',
    modelNote: '🤖 crop.health AI • Real-time Analysis',
    loadingSolution: '🌿 Generating natural solution...',
    solutionFallback: '🌿 Could not generate solution. Please try again.',
  },
};

export default function DiseaseScreen() {
  const router = useRouter();
  const { lang } = useLang();
  const s = staticText[lang] || staticText.english;

  const [image, setImage] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [loadingSolution, setLoadingSolution] = useState(false);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return;
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      base64: true,
    });
    if (!res.canceled) {
      setImage(res.assets[0].uri);
      setImageBase64(res.assets[0].base64 || null);
      setResult(null);
      setError('');
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') return;
    const res = await ImagePicker.launchCameraAsync({
      quality: 0.8,
      base64: true,
    });
    if (!res.canceled) {
      setImage(res.assets[0].uri);
      setImageBase64(res.assets[0].base64 || null);
      setResult(null);
      setError('');
    }
  };

  const getTranslatedDiseaseAndSolution = async (
    englishDiseaseName: string,
    isHealthy: boolean
  ): Promise<{ translatedName: string; solutions: string[] }> => {
    const langName =
      lang === 'tamil' ? 'Tamil' :
      lang === 'hindi' ? 'Hindi' : 'English';

    const prompt = isHealthy
      ? `The crop is healthy.
Task 1: Translate "Healthy - No Disease" to ${langName}.
Task 2: Give exactly 3 short specific care tips in ${langName}.
Each tip must start with a relevant emoji.

Return in this exact format:
TRANSLATED_NAME: <translated name>
SOLUTIONS:
<tip 1>
<tip 2>
<tip 3>`
      : `The crop disease name in English is: "${englishDiseaseName}"
Task 1: Translate this disease name to ${langName}.
Task 2: Give exactly 5 unique natural/organic solutions specific to "${englishDiseaseName}" in ${langName}.
Each solution must start with a relevant emoji.
Solutions must be specific to this disease only.

Return in this exact format:
TRANSLATED_NAME: <translated disease name in ${langName}>
SOLUTIONS:
<solution 1>
<solution 2>
<solution 3>
<solution 4>
<solution 5>`;

    try {
      const response = await fetch(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${GROQ_API_KEY}`,
          },
          body: JSON.stringify({
            // llama-3.3-70b-versatile was deprecated by Groq (June 2026).
            // openai/gpt-oss-120b is Groq's recommended replacement, but it's
            // a REASONING model — it burns tokens on internal "thinking"
            // before writing the actual answer. reasoning_effort: 'low' keeps
            // that thinking short, and max_tokens is raised so the real
            // answer isn't cut off after the reasoning eats the budget.
            model: 'openai/gpt-oss-120b',
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 1200,
            temperature: 0.7,
            reasoning_effort: 'low',
          }),
        }
      );

      if (!response.ok) {
        const errText = await response.text();
        console.error('Groq API error:', response.status, errText);
        throw new Error(`Groq API failed with status ${response.status}`);
      }

      const data = await response.json();
      const text = data.choices?.[0]?.message?.content || '';

      if (!text) {
        console.error('Groq returned empty content:', JSON.stringify(data));
        throw new Error('Empty Groq response');
      }

      const nameMatch = text.match(/TRANSLATED_NAME:\s*(.+)/);
      const translatedName = nameMatch ? nameMatch[1].trim() : englishDiseaseName;

      const solutionsMatch = text.split('SOLUTIONS:')[1];
      const solutions = solutionsMatch
        ? solutionsMatch
            .split('\n')
            .map((l: string) => l.trim())
            .filter((l: string) => l.length > 5)
        : [];

      if (solutions.length === 0) {
        console.error('Could not parse solutions from Groq text:', text);
        throw new Error('No solutions parsed');
      }

      return { translatedName, solutions };
    } catch (err) {
      console.error('getTranslatedDiseaseAndSolution failed:', err);
      return {
        translatedName: englishDiseaseName,
        solutions: [s.solutionFallback],
      };
    }
  };

  const analyzeDisease = async () => {
    if (!image || !imageBase64) return;
    setAnalyzing(true);
    setError('');
    setResult(null);

    try {
      const base64 = imageBase64;

      const sizeEstimate = (base64.length * 3) / 4;
      if (sizeEstimate < 8000) {
        setError(s.invalidPhoto);
        setAnalyzing(false);
        return;
      }

      const apiResponse = await fetch(
        'https://crop.kindwise.com/api/v1/identification',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Api-Key': CROP_HEALTH_API_KEY,
          },
          body: JSON.stringify({
            images: [`data:image/jpeg;base64,${base64}`],
            latitude: 11.341,
            longitude: 77.7172,
            similar_images: true,
          }),
        }
      );

      const data = await apiResponse.json();

      if (!data || !data.result) {
        setError(s.invalidPhoto);
        setAnalyzing(false);
        return;
      }

      if (data.result.is_plant && data.result.is_plant.binary === false) {
        setError(s.invalidPhoto);
        setAnalyzing(false);
        return;
      }

      setAnalyzing(false);
      setLoadingSolution(true);

      if (data.result.disease) {
        const rawSuggestions = data.result.disease.suggestions || [];

        // FIX: crop.health sometimes puts a "healthy" entry INSIDE
        // disease.suggestions itself. Filter that out before deciding
        // whether a real disease was found, otherwise "healthy" gets
        // treated as a disease name and shown untranslated in red.
        const diseaseSuggestions = rawSuggestions.filter(
          (d: any) => d?.name && d.name.toLowerCase() !== 'healthy'
        );

        const isHealthy =
          data.result.is_healthy?.binary === true ||
          diseaseSuggestions.length === 0;

        const englishDiseaseName = isHealthy
          ? 'Healthy'
          : diseaseSuggestions[0]?.name || 'Unknown Disease';

        const confidence = isHealthy
          ? Math.round((data.result.is_healthy?.probability || 0.95) * 100)
          : Math.round((diseaseSuggestions[0]?.probability || 0) * 100);

        const { translatedName, solutions } =
          await getTranslatedDiseaseAndSolution(englishDiseaseName, isHealthy);

        setResult({
          name: translatedName,
          confidence,
          solutions,
          isHealthy,
        });
      } else {
        setError(s.errorImage);
      }
    } catch (e) {
      console.error('analyzeDisease failed:', e);
      setError(s.errorNet);
    }

    setAnalyzing(false);
    setLoadingSolution(false);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{s.headerTitle}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>{s.sectionTitle}</Text>
        <Text style={styles.hint}>{s.hint}</Text>

        <View style={styles.btnRow}>
          <TouchableOpacity style={styles.halfBtn} onPress={takePhoto}>
            <Text style={styles.halfBtnText}>{s.camera}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.halfBtn} onPress={pickImage}>
            <Text style={styles.halfBtnText}>{s.gallery}</Text>
          </TouchableOpacity>
        </View>

        {image && (
          <Image source={{ uri: image }} style={styles.previewImage} />
        )}

        {image && (
          <TouchableOpacity
            style={[
              styles.btn,
              (analyzing || loadingSolution) && styles.btnDisabled,
            ]}
            onPress={analyzeDisease}
            disabled={analyzing || loadingSolution}
          >
            {analyzing ? (
              <View style={styles.loadingRow}>
                <ActivityIndicator color="#000" />
                <Text style={styles.btnText}> {s.analyzing}</Text>
              </View>
            ) : loadingSolution ? (
              <View style={styles.loadingRow}>
                <ActivityIndicator color="#000" />
                <Text style={styles.btnText}> {s.loadingSolution}</Text>
              </View>
            ) : (
              <Text style={styles.btnText}>{s.analyzeBtn}</Text>
            )}
          </TouchableOpacity>
        )}

        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </View>

      {result && (
        <>
          <View style={[styles.card, {
            borderColor: result.isHealthy ? '#4ade8040' : '#f8717140',
          }]}>
            <View style={styles.resultRow}>
              <Text style={styles.sectionTitle}>
                {result.isHealthy ? s.healthyTitle : s.diseaseTitle}
              </Text>
              <Text style={[styles.confidenceBadge, {
                backgroundColor: result.isHealthy ? '#4ade8020' : '#f8717120',
                color: result.isHealthy ? '#4ade80' : '#f87171',
              }]}>
                {result.confidence}%
              </Text>
            </View>
            <Text style={[styles.diseaseName, {
              color: result.isHealthy ? '#4ade80' : '#f87171',
            }]}>
              {result.name}
            </Text>
            <Text style={styles.modelNote}>{s.modelNote}</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>
              {result.isHealthy ? s.solutionHealthy : s.solutionDisease}
            </Text>
            {result.solutions.map((sol: string, i: number) => (
              <View key={i} style={styles.solutionItem}>
                <Text style={styles.solutionText}>{sol}</Text>
              </View>
            ))}
          </View>
        </>
      )}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a1f0e' },
  header: {
    flexDirection: 'row', alignItems: 'center',
    padding: 20, paddingTop: 50, gap: 12,
  },
  back: { fontSize: 24, color: '#4ade80' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#4ade80' },
  card: {
    backgroundColor: '#112214', borderRadius: 16,
    padding: 18, margin: 16, marginTop: 0,
    borderWidth: 1, borderColor: '#1e3d23',
  },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#4ade80', marginBottom: 6 },
  hint: { fontSize: 12, color: '#6b9e74', marginBottom: 14 },
  btnRow: { flexDirection: 'row', gap: 10, marginBottom: 14 },
  halfBtn: {
    flex: 1, backgroundColor: '#1e3d23', borderRadius: 12,
    padding: 14, alignItems: 'center',
    borderWidth: 1, borderColor: '#4ade8040',
  },
  halfBtnText: { color: '#4ade80', fontWeight: '700', fontSize: 14 },
  previewImage: { width: '100%', height: 220, borderRadius: 12, marginBottom: 14 },
  btn: {
    backgroundColor: '#16a34a', borderRadius: 12,
    padding: 16, alignItems: 'center',
  },
  btnDisabled: { backgroundColor: '#1e3d23' },
  btnText: { color: '#000', fontWeight: '700', fontSize: 15 },
  loadingRow: { flexDirection: 'row', alignItems: 'center' },
  errorText: { color: '#f87171', fontSize: 13, marginTop: 10, textAlign: 'center' },
  resultRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 8,
  },
  confidenceBadge: {
    paddingHorizontal: 10, paddingVertical: 3,
    borderRadius: 8, fontSize: 13, fontWeight: '700', overflow: 'hidden',
  },
  diseaseName: { fontSize: 18, fontWeight: '700', marginBottom: 10 },
  modelNote: { fontSize: 11, color: '#6b9e74', marginTop: 4 },
  solutionItem: {
    backgroundColor: '#0d2515', borderRadius: 10,
    padding: 12, marginBottom: 8,
    borderLeftWidth: 3, borderLeftColor: '#4ade80',
  },
  solutionText: { color: '#e2f5e6', fontSize: 13, lineHeight: 20 },
});