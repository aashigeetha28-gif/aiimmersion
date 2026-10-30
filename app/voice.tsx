import { Audio } from 'expo-av';
import { useRouter } from 'expo-router';
import * as Speech from 'expo-speech';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useLang } from './context';
 
const GROQ_API_KEY = process.env.EXPO_PUBLIC_GROQ_API_KEY || '';
 
const SUGGESTS: any = {
  tamil: [
    'தக்காளி விலை என்ன?',
    'நெல் பயிருக்கு என்ன உரம்?',
    'வெண்டை நோய் எப்படி சரி செய்வது?',
    'இன்றைய வானிலை எப்படி?',
    'கத்திரிக்காய் எப்போது நடவு செய்யலாம்?',
  ],
  english: [
    'What is the price of tomato?',
    'Which fertilizer for paddy?',
    'How to treat brinjal disease?',
    "What's the weather today?",
    'When to sow groundnut?',
  ],
  hindi: [
    'टमाटर का भाव क्या है?',
    'धान के लिए कौन सी खाद?',
    'बैंगन की बीमारी कैसे ठीक करें?',
    'आज मौसम कैसा है?',
    'मूंगफली कब बोएं?',
  ],
};
 
const GREETING: any = {
  tamil: 'வணக்கம்! நான் உங்கள் விவசாய AI உதவியாளர். பயிர் விலை, வானிலை, நோய், உரம் — எதுவும் கேளுங்கள்! 🌾',
  english: 'Hello! I am your AgriSmart AI assistant. Ask me about crop prices, weather, diseases, fertilizers — anything! 🌾',
  hindi: 'नमस्ते! मैं आपका कृषि AI सहायक हूँ। फसल भाव, मौसम, रोग, खाद — कुछ भी पूछें! 🌾',
};
 
const SUB_HEADER: any = {
  tamil: 'கேளுங்கள் அல்லது type பண்ணுங்கள்',
  english: 'Speak or type your question',
  hindi: 'बोलें या टाइप करें',
};
 
const THINKING_LABEL: any = {
  tamil: 'யோசிக்கிறேன்...',
  english: 'Thinking...',
  hindi: 'सोच रहा हूँ...',
};
 
const RECORDING_LABEL: any = {
  tamil: '🎙️ பேசுங்கள்...',
  english: '🎙️ Speak now...',
  hindi: '🎙️ बोलें...',
};
 
const PROCESSING_LABEL: any = {
  tamil: '⏳ பகுப்பாய்கிறது...',
  english: '⏳ Processing...',
  hindi: '⏳ प्रक्रिया हो रही है...',
};
 
const ERROR_MSG: any = {
  tamil: 'மன்னிக்கவும், இணைப்பு தோல்வி. மீண்டும் முயற்சிக்கவும்.',
  english: 'Sorry, connection failed. Please try again.',
  hindi: 'माफ करें, कनेक्शन विफल। फिर कोशिश करें।',
};
 
const PLACEHOLDER: any = {
  tamil: 'இங்கே type பண்ணுங்கள்...',
  english: 'Type your question here...',
  hindi: 'यहाँ टाइप करें...',
};
 
// FIX: Voice hint per language
const VOICE_HINT: any = {
  tamil: '🎙️ Mic-ஐ Press & Hold பண்ணி பேசுங்கள் • AI reply-ஐ கேட்க message long press பண்ணுங்கள்',
  english: '🎙️ Press & Hold Mic to speak • Long press any message to hear it',
  hindi: '🎙️ Mic को दबाकर बोलें • Message सुनने के लिए long press करें',
};
 
const SPEAK_LANG: any = {
  tamil: 'ta-IN',
  english: 'en-IN',
  hindi: 'hi-IN',
};
 
const GROQ_LANG: any = {
  tamil: 'ta',
  english: 'en',
  hindi: 'hi',
};
 
function buildSystemPrompt(lang: string): string {
  const langName =
    lang === 'tamil' ? 'Tamil' :
    lang === 'hindi' ? 'Hindi' : 'English';
  return `You are AgriSmart AI, a helpful agricultural assistant for Indian farmers.
 
LANGUAGE RULE: You MUST respond ONLY in ${langName}. Never mix languages. Never use English words if the language is Tamil or Hindi.
 
YOUR EXPERTISE:
- Crop prices and market trends in Tamil Nadu mandis
- Weather impact on farming
- Crop diseases, pests and organic/chemical treatments
- Fertilizer and pesticide recommendations
- Sowing and harvesting seasons
- Government schemes for farmers
- Soil health and irrigation advice
 
RESPONSE STYLE:
- Keep answers SHORT and PRACTICAL (3-5 lines max)
- Use simple language a farmer can understand
- Use ₹ for prices
- Always be encouraging and respectful
 
PRICE FORMAT RULES (EXTREMELY IMPORTANT - READ CAREFULLY):
- Price ranges MUST be written as: ₹120 முதல் 130 வரை per kg (Tamil), ₹120 से 130 प्रति किलो (Hindi), ₹120 to 130 per kg (English)
- NEVER write prices like: ₹120-130 (hyphen format causes TTS to say "minus")
- NEVER use hyphen between numbers for price ranges
- ALWAYS spell out the range in full words appropriate to the language
- Example Tamil: கிலோவுக்கு ₹120 முதல் ₹130 வரை
- Example Hindi: किलो के लिए ₹120 से ₹130 तक
- Example English: ₹120 to ₹130 per kg`;
}
 
type Message = {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
  isVoice?: boolean;
};
 
// FIX: cleanTranscript per language — remove minus/hyphen issues for TTS display
function cleanTranscriptForDisplay(text: string, lang: string): string {
  if (lang === 'tamil') {
    return text
      .replace(/(\d+)\s*-\s*(\d+)/g, '₹$1 முதல் $2 வரை')
      .replace(/(\d+)\s+minus\s+(\d+)/gi, '₹$1 முதல் $2 வரை')
      .trim();
  } else if (lang === 'hindi') {
    return text
      .replace(/(\d+)\s*-\s*(\d+)/g, '₹$1 से $2 तक')
      .replace(/(\d+)\s+minus\s+(\d+)/gi, '₹$1 से $2 तक')
      .trim();
  } else {
    return text
      .replace(/(\d+)\s*-\s*(\d+)/g, '₹$1 to $2')
      .replace(/(\d+)\s+minus\s+(\d+)/gi, '₹$1 to $2')
      .trim();
  }
}
 
// FIX: Clean text before TTS speak — remove symbols that TTS mispronounces
function cleanTextForTTS(text: string, lang: string): string {
  let cleaned = text
    .replace(/₹(\d+)\s*-\s*(\d+)/g, (_, a, b) => {
      if (lang === 'tamil') return `${a} முதல் ${b} வரை ரூபாய்`;
      if (lang === 'hindi') return `${a} से ${b} रुपये`;
      return `${a} to ${b} rupees`;
    })
    .replace(/₹(\d+)/g, (_, n) => {
      if (lang === 'tamil') return `${n} ரூபாய்`;
      if (lang === 'hindi') return `${n} रुपये`;
      return `${n} rupees`;
    })
    .replace(/(\d+)\s*-\s*(\d+)/g, (_, a, b) => {
      if (lang === 'tamil') return `${a} முதல் ${b} வரை`;
      if (lang === 'hindi') return `${a} से ${b} तक`;
      return `${a} to ${b}`;
    })
    // Remove emojis for cleaner TTS
    .replace(/[\u{1F300}-\u{1FFFF}]/gu, '')
    .replace(/[🌾🌿🤖👨‍🌾🎙️⏳✅❌⚠️]/g, '')
    .trim();
  return cleaned;
}
 
export default function VoiceScreen() {
  const router = useRouter();
  const { lang, t } = useLang();
 
  const effectiveLang = ['tamil', 'english', 'hindi'].includes(lang) ? lang : 'tamil';
 
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'assistant',
      text: GREETING[effectiveLang],
      timestamp: new Date().toLocaleTimeString('en-IN', {
        hour: '2-digit', minute: '2-digit',
      }),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
 
  const flatListRef = useRef<FlatList>(null);
  const recordingRef = useRef<Audio.Recording | null>(null);
  const isRecordingActiveRef = useRef(false);
 
  useEffect(() => {
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  }, [messages]);
 
  useEffect(() => {
    return () => {
      if (recordingRef.current && isRecordingActiveRef.current) {
        recordingRef.current.stopAndUnloadAsync().catch(() => {});
        recordingRef.current = null;
        isRecordingActiveRef.current = false;
      }
      Speech.stop();
    };
  }, []);
 
  const speakText = (text: string) => {
    Speech.stop();
    setIsSpeaking(true);
    // FIX: Clean text before speaking
    const cleanedText = cleanTextForTTS(text, effectiveLang);
    Speech.speak(cleanedText, {
      language: SPEAK_LANG[effectiveLang] || 'en-IN',
      pitch: 1.0,
      rate: 0.9,
      onDone: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  };
 
  const stopSpeaking = () => {
    Speech.stop();
    setIsSpeaking(false);
  };
 
  const startRecording = async () => {
    if (isRecordingActiveRef.current) return;
 
    try {
      if (recordingRef.current) {
        try {
          await recordingRef.current.stopAndUnloadAsync();
        } catch (_) {}
        recordingRef.current = null;
        isRecordingActiveRef.current = false;
      }
 
      const { granted } = await Audio.requestPermissionsAsync();
      if (!granted) return;
 
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
 
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
 
      recordingRef.current = recording;
      isRecordingActiveRef.current = true;
      setIsRecording(true);
    } catch (e) {
      console.error('Recording start error:', e);
      recordingRef.current = null;
      isRecordingActiveRef.current = false;
      setIsRecording(false);
    }
  };
 
  const stopRecording = async () => {
    if (!recordingRef.current || !isRecordingActiveRef.current) {
      setIsRecording(false);
      return;
    }
 
    setIsRecording(false);
    setIsProcessing(true);
    isRecordingActiveRef.current = false;
 
    const currentRecording = recordingRef.current;
    recordingRef.current = null;
 
    try {
      await currentRecording.stopAndUnloadAsync();
      const uri = currentRecording.getURI();
 
      if (!uri) {
        setIsProcessing(false);
        return;
      }
 
      const formData = new FormData();
      formData.append('file', {
        uri,
        type: 'audio/m4a',
        name: 'voice.m4a',
      } as any);
      formData.append('model', 'whisper-large-v3');
      formData.append('language', GROQ_LANG[effectiveLang] || 'ta');
      formData.append('response_format', 'json');
      formData.append(
        'prompt',
        effectiveLang === 'tamil'
          ? 'விவசாயம், பயிர், விலை, ரூபாய், கிலோ, ஏக்கர், டன், 100, 200, 300'
          : effectiveLang === 'hindi'
          ? 'कृषि, फसल, भाव, रुपये, किलो, एकड़, टन, 100, 200, 300'
          : 'agriculture, crop, price, rupees, kg, acre, ton, 100, 200, 300'
      );
 
      const response = await fetch(
        'https://api.groq.com/openai/v1/audio/transcriptions',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${GROQ_API_KEY}`,
          },
          body: formData,
        }
      );
 
      const data = await response.json();
      const rawTranscript = data?.text?.trim() || '';
 
      setIsProcessing(false);
 
      if (rawTranscript && rawTranscript.length > 0) {
        sendMessage(rawTranscript, true);
      }
    } catch (e) {
      console.error('Transcription error:', e);
      setIsProcessing(false);
    }
  };
 
  const sendMessage = async (overrideText?: string, isVoice?: boolean) => {
    const text = (overrideText ?? input).trim();
    if (!text || loading) return;
 
    setInput('');
    setLoading(true);
 
    const now = new Date().toLocaleTimeString('en-IN', {
      hour: '2-digit', minute: '2-digit',
    });
 
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text,
      timestamp: now,
      isVoice: isVoice || false,
    };
 
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
 
    const history = updatedMessages
      .filter((m) => m.id !== '0')
      .map((m) => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: m.text,
      }));
 
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
            model: 'llama-3.3-70b-versatile',
            messages: [
              { role: 'system', content: buildSystemPrompt(effectiveLang) },
              ...history,
            ],
            max_tokens: 500,
            temperature: 0.7,
          }),
        }
      );
 
      const data = await response.json();
      if (data.error) throw new Error(data.error.message);
 
      const rawReply = data.choices?.[0]?.message?.content || ERROR_MSG[effectiveLang];
      // FIX: Clean display text
      const replyText = cleanTranscriptForDisplay(rawReply, effectiveLang);
 
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString('en-IN', {
          hour: '2-digit', minute: '2-digit',
        }),
      };
 
      setMessages((prev) => [...prev, assistantMsg]);
 
      if (isVoice) {
        speakText(replyText);
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          text: ERROR_MSG[effectiveLang],
          timestamp: new Date().toLocaleTimeString('en-IN', {
            hour: '2-digit', minute: '2-digit',
          }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };
 
  const renderMessage = ({ item }: { item: Message }) => {
    const isUser = item.role === 'user';
    return (
      <View style={[styles.bubbleRow, isUser ? styles.bubbleRowUser : styles.bubbleRowBot]}>
        {!isUser && (
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>🤖</Text>
          </View>
        )}
        <TouchableOpacity
          style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleBot]}
          onLongPress={() => !isUser && speakText(item.text)}
          activeOpacity={0.8}
        >
          {item.isVoice && (
            <Text style={styles.voiceTag}>🎙️ Voice</Text>
          )}
          <Text style={[
            styles.bubbleText,
            isUser ? styles.bubbleTextUser : styles.bubbleTextBot,
          ]}>
            {item.text}
          </Text>
          <Text style={[
            styles.timestamp,
            isUser ? styles.timestampUser : styles.timestampBot,
          ]}>
            {item.timestamp}
          </Text>
        </TouchableOpacity>
        {isUser && (
          <View style={styles.avatarUser}>
            <Text style={styles.avatarText}>👨‍🌾</Text>
          </View>
        )}
      </View>
    );
  };
 
  const showSuggestions = messages.length === 1;
 
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>🤖 {t.voice}</Text>
          <Text style={styles.headerSub}>{SUB_HEADER[effectiveLang]}</Text>
        </View>
        {isSpeaking && (
          <TouchableOpacity onPress={stopSpeaking} style={styles.speakingBtn}>
            <Text style={styles.speakingText}>🔊 Stop</Text>
          </TouchableOpacity>
        )}
      </View>
 
      {/* Chat */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.chatContent}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          <>
            {showSuggestions && (
              <View style={styles.suggestBox}>
                <Text style={styles.suggestTitle}>{t.sampleQuestions}</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={styles.suggestRow}>
                    {SUGGESTS[effectiveLang].map((q: string, i: number) => (
                      <TouchableOpacity
                        key={i}
                        style={styles.chip}
                        onPress={() => sendMessage(q)}
                      >
                        <Text style={styles.chipText}>{q}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </View>
            )}
            {loading && (
              <View style={[styles.bubbleRow, styles.bubbleRowBot]}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>🤖</Text>
                </View>
                <View style={[styles.bubble, styles.bubbleBot, styles.typingBubble]}>
                  <ActivityIndicator size="small" color="#2e7d32" />
                  <Text style={styles.typingText}>{THINKING_LABEL[effectiveLang]}</Text>
                </View>
              </View>
            )}
          </>
        }
      />
 
      {/* Recording Status */}
      {(isRecording || isProcessing) && (
        <View style={styles.recordingBar}>
          <ActivityIndicator color="#fff" size="small" />
          <Text style={styles.recordingText}>
            {isRecording
              ? RECORDING_LABEL[effectiveLang]
              : PROCESSING_LABEL[effectiveLang]}
          </Text>
        </View>
      )}
 
      {/* Input Bar */}
      <View style={styles.inputBar}>
        <TouchableOpacity
          style={[styles.micBtn, isRecording && styles.micBtnActive]}
          onPressIn={startRecording}
          onPressOut={stopRecording}
          disabled={isProcessing || loading}
        >
          <Text style={styles.micIcon}>
            {isRecording ? '⏹' : '🎙️'}
          </Text>
        </TouchableOpacity>
 
        <TextInput
          style={styles.textInput}
          value={input}
          onChangeText={setInput}
          placeholder={PLACEHOLDER[effectiveLang]}
          placeholderTextColor="#aaa"
          multiline
          maxLength={500}
          editable={!loading && !isRecording && !isProcessing}
          returnKeyType="send"
          onSubmitEditing={() => sendMessage()}
        />
 
        <TouchableOpacity
          style={[
            styles.sendBtn,
            (!input.trim() || loading) && styles.sendBtnDisabled,
          ]}
          onPress={() => sendMessage()}
          disabled={!input.trim() || loading}
        >
          <Text style={styles.sendIcon}>➤</Text>
        </TouchableOpacity>
      </View>
 
      {/* FIX: Voice hint per language */}
      <View style={styles.voiceHint}>
        <Text style={styles.voiceHintText}>
          {VOICE_HINT[effectiveLang]}
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}
 
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f1f8e9' },
  header: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#2e7d32',
    paddingTop: 52, paddingBottom: 14,
    paddingHorizontal: 16, gap: 10,
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  backIcon: { color: '#fff', fontSize: 20 },
  headerCenter: { flex: 1 },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: '700' },
  headerSub: { color: '#a5d6a7', fontSize: 12, marginTop: 1 },
  speakingBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16,
  },
  speakingText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  chatContent: { paddingHorizontal: 14, paddingTop: 16, paddingBottom: 8 },
  bubbleRow: {
    flexDirection: 'row', alignItems: 'flex-end',
    marginBottom: 12, gap: 8,
  },
  bubbleRowUser: { justifyContent: 'flex-end' },
  bubbleRowBot: { justifyContent: 'flex-start' },
  avatar: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: '#e8f5e9',
    alignItems: 'center', justifyContent: 'center',
  },
  avatarUser: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: '#c8e6c9',
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { fontSize: 16 },
  bubble: { maxWidth: '75%', borderRadius: 18, padding: 12 },
  bubbleUser: { backgroundColor: '#2e7d32', borderBottomRightRadius: 4 },
  bubbleBot: { backgroundColor: '#fff', borderBottomLeftRadius: 4, elevation: 1 },
  bubbleText: { fontSize: 15, lineHeight: 22 },
  bubbleTextUser: { color: '#fff' },
  bubbleTextBot: { color: '#1b5e20' },
  voiceTag: {
    fontSize: 10, color: 'rgba(255,255,255,0.7)',
    marginBottom: 4, fontStyle: 'italic',
  },
  timestamp: { fontSize: 10, marginTop: 4 },
  timestampUser: { color: 'rgba(255,255,255,0.6)', textAlign: 'right' },
  timestampBot: { color: '#aaa' },
  typingBubble: {
    flexDirection: 'row', alignItems: 'center',
    gap: 8, paddingVertical: 10,
  },
  typingText: { color: '#888', fontSize: 13 },
  suggestBox: { marginTop: 8, marginBottom: 4 },
  suggestTitle: { fontSize: 12, color: '#888', marginBottom: 8 },
  suggestRow: { flexDirection: 'row', gap: 8 },
  chip: {
    backgroundColor: '#fff', borderRadius: 20,
    paddingHorizontal: 14, paddingVertical: 8,
    borderWidth: 1, borderColor: '#a5d6a7', elevation: 1,
  },
  chipText: { fontSize: 13, color: '#2e7d32', fontWeight: '600' },
  recordingBar: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#e53935',
    paddingVertical: 10, paddingHorizontal: 20,
    gap: 10, justifyContent: 'center',
  },
  recordingText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  inputBar: {
    flexDirection: 'row', alignItems: 'flex-end',
    backgroundColor: '#fff', padding: 10,
    borderTopWidth: 1, borderTopColor: '#e8f5e9',
    gap: 8, elevation: 4,
  },
  micBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: '#e8f5e9',
    alignItems: 'center', justifyContent: 'center',
  },
  micBtnActive: { backgroundColor: '#ffcdd2' },
  micIcon: { fontSize: 20 },
  textInput: {
    flex: 1, minHeight: 44, maxHeight: 120,
    backgroundColor: '#f9fbe7', borderRadius: 22,
    paddingHorizontal: 16, paddingVertical: 10,
    fontSize: 15, color: '#1b5e20',
    borderWidth: 1, borderColor: '#c8e6c9',
  },
  sendBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: '#2e7d32',
    alignItems: 'center', justifyContent: 'center',
  },
  sendBtnDisabled: { backgroundColor: '#c8e6c9' },
  sendIcon: { color: '#fff', fontSize: 18 },
  voiceHint: {
    backgroundColor: '#e8f5e9',
    paddingVertical: 8, paddingHorizontal: 16,
    alignItems: 'center',
  },
  voiceHintText: { fontSize: 11, color: '#2e7d32', textAlign: 'center' },
});
 