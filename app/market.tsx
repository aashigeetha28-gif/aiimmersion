import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useLang } from './context';

const TN_DISTRICT_LIST = [
  { key: 'Ariyalur',        en: 'Ariyalur',        ta: 'அரியலூர்',          hi: 'अरियलूर' },
  { key: 'Chengalpattu',    en: 'Chengalpattu',    ta: 'செங்கல்பட்டு',      hi: 'चेंगलपट्टू' },
  { key: 'Chennai',         en: 'Chennai',          ta: 'சென்னை',            hi: 'चेन्नई' },
  { key: 'Coimbatore',      en: 'Coimbatore',       ta: 'கோயம்புத்தூர்',     hi: 'कोयंबटूर' },
  { key: 'Cuddalore',       en: 'Cuddalore',        ta: 'கடலூர்',            hi: 'कडलूर' },
  { key: 'Dharmapuri',      en: 'Dharmapuri',       ta: 'தர்மபுரி',          hi: 'धर्मपुरी' },
  { key: 'Dindigul',        en: 'Dindigul',         ta: 'திண்டுக்கல்',       hi: 'डिंडीगुल' },
  { key: 'Erode',           en: 'Erode',            ta: 'ஈரோடு',             hi: 'इरोड' },
  { key: 'Kallakurichi',    en: 'Kallakurichi',     ta: 'கள்ளக்குறிச்சி',    hi: 'कल्लाकुरिची' },
  { key: 'Kancheepuram',    en: 'Kancheepuram',     ta: 'காஞ்சிபுரம்',       hi: 'कांचीपुरम' },
  { key: 'Kanyakumari',     en: 'Kanyakumari',      ta: 'கன்னியாகுமரி',      hi: 'कन्याकुमारी' },
  { key: 'Karur',           en: 'Karur',            ta: 'கரூர்',             hi: 'करूर' },
  { key: 'Krishnagiri',     en: 'Krishnagiri',      ta: 'கிருஷ்ணகிரி',       hi: 'कृष्णागिरि' },
  { key: 'Madurai',         en: 'Madurai',          ta: 'மதுரை',             hi: 'मदुरै' },
  { key: 'Mayiladuthurai',  en: 'Mayiladuthurai',   ta: 'மயிலாடுதுறை',      hi: 'मयिलादुतुरई' },
  { key: 'Nagapattinam',    en: 'Nagapattinam',     ta: 'நாகப்பட்டினம்',     hi: 'नागपट्टिनम' },
  { key: 'Namakkal',        en: 'Namakkal',         ta: 'நாமக்கல்',          hi: 'नामक्कल' },
  { key: 'Nilgiris',        en: 'Nilgiris',         ta: 'நீலகிரி',           hi: 'नीलगिरि' },
  { key: 'Perambalur',      en: 'Perambalur',       ta: 'பெரம்பலூர்',        hi: 'पेरम्बलूर' },
  { key: 'Pudukkottai',     en: 'Pudukkottai',      ta: 'புதுக்கோட்டை',      hi: 'पुदुक्कोट्टई' },
  { key: 'Ramanathapuram',  en: 'Ramanathapuram',   ta: 'ராமநாதபுரம்',       hi: 'रामनाथपुरम' },
  { key: 'Ranipet',         en: 'Ranipet',          ta: 'ராணிப்பேட்டை',      hi: 'रानीपेट' },
  { key: 'Salem',           en: 'Salem',            ta: 'சேலம்',             hi: 'सेलम' },
  { key: 'Sivaganga',       en: 'Sivaganga',        ta: 'சிவகங்கை',          hi: 'शिवगंगा' },
  { key: 'Tenkasi',         en: 'Tenkasi',          ta: 'தென்காசி',          hi: 'तेनकासी' },
  { key: 'Thanjavur',       en: 'Thanjavur',        ta: 'தஞ்சாவூர்',         hi: 'तंजावुर' },
  { key: 'Theni',           en: 'Theni',            ta: 'தேனி',              hi: 'थेनी' },
  { key: 'Thoothukudi',     en: 'Thoothukudi',      ta: 'தூத்துக்குடி',      hi: 'थूथुकुडी' },
  { key: 'Tiruchirappalli', en: 'Tiruchirappalli',  ta: 'திருச்சிராப்பள்ளி', hi: 'तिरुचिरापल्ली' },
  { key: 'Tirunelveli',     en: 'Tirunelveli',      ta: 'திருநெல்வேலி',      hi: 'तिरुनेलवेली' },
  { key: 'Tirupathur',      en: 'Tirupathur',       ta: 'திருப்பத்தூர்',     hi: 'तिरुपत्तूर' },
  { key: 'Tiruppur',        en: 'Tiruppur',         ta: 'திருப்பூர்',        hi: 'तिरुपुर' },
  { key: 'Tiruvallur',      en: 'Tiruvallur',       ta: 'திருவள்ளூர்',       hi: 'तिरुवल्लूर' },
  { key: 'Tiruvannamalai',  en: 'Tiruvannamalai',   ta: 'திருவண்ணாமலை',     hi: 'तिरुवन्नामलै' },
  { key: 'Tiruvarur',       en: 'Tiruvarur',        ta: 'திருவாரூர்',        hi: 'तिरुवारूर' },
  { key: 'Vellore',         en: 'Vellore',          ta: 'வேலூர்',            hi: 'वेल्लोर' },
  { key: 'Villupuram',      en: 'Villupuram',       ta: 'விழுப்புரம்',       hi: 'विल्लुपुरम' },
  { key: 'Virudhunagar',    en: 'Virudhunagar',     ta: 'விருதுநகர்',        hi: 'विरुधुनगर' },
];

function getDistrictLabel(d: any, lang: string) {
  if (lang === 'tamil') return d.ta;
  if (lang === 'hindi') return d.hi;
  return d.en;
}


const CROP_TAMIL: any = {
  'Rice': 'நெல்', 'Wheat': 'கோதுமை', 'Maize': 'மக்காச்சோளம்',
  'Tomato': 'தக்காளி', 'Onion': 'வெங்காயம்', 'Banana': 'வாழை',
  'Cotton': 'பருத்தி', 'Turmeric': 'மஞ்சள்', 'Groundnut': 'வேர்க்கடலை',
  'Sugarcane': 'கரும்பு', 'Coconut': 'தேங்காய்', 'Mango': 'மாம்பழம்',
  'Chilli': 'மிளகாய்', 'Brinjal': 'கத்திரிக்காய்', 'Drumstick': 'முருங்கை',
  'Tamarind': 'புளி', 'Garlic': 'பூண்டு', 'Ginger': 'இஞ்சி',
  'Potato': 'உருளைக்கிழங்கு', 'Bhindi': 'வெண்டைக்காய்',
  'Cauliflower': 'காலிஃபிளவர்', 'Cabbage': 'முட்டைகோஸ்',
  'Bitter Gourd': 'பாவக்காய்', 'Cluster Beans': 'கொத்தவரை',
  'Ragi': 'கேழ்வரகு', 'Jowar': 'சோளம்', 'Bajra': 'கம்பு',
  'Tapioca': 'மரவள்ளிக்கிழங்கு', 'Papaya': 'பப்பாளி',
  'Guava': 'கொய்யா', 'Mushroom': 'காளான்', 'Jasmine': 'மல்லிகை',
  'Paddy': 'நெல்', 'Coriander': 'கொத்தமல்லி', 'Pumpkin': 'பூசணிக்காய்',
  'Ash Gourd': 'வெண்பூசணி', 'Snake Gourd': 'புடலங்காய்',
  'Cucumber': 'வெள்ளரிக்காய்', 'Beans': 'அவரைக்காய்',
  'Carrot': 'கேரட்', 'Radish': 'முள்ளங்கி', 'Beetroot': 'பீட்ரூட்',
  'Capsicum': 'குடைமிளகாய்', 'Apple': 'ஆப்பிள்',
  'Cardamom': 'ஏலக்காய்', 'Arecanut': 'கமுகு',
  'Watermelon': 'தர்பூசணி', 'Grapes': 'திராட்சை',
  'Pomegranate': 'மாதுளை', 'Blackgram': 'உளுந்து',
  'Greengram': 'பாசிப்பயறு', 'Redgram': 'துவரம்பருப்பு',
  'Yam': 'சேனைக்கிழங்கு', 'Tinda': 'திண்டா',
  'Cowpea': 'தட்டைப்பயறு', 'Pointed Gourd': 'பரவல்',
  'Lemon': 'எலுமிச்சை', 'Orange': 'ஆரஞ்சு',
  'Sweet Potato': 'சர்க்கரைவள்ளிக்கிழங்கு',
  'Elephant Yam': 'கருணைக்கிழங்கு', 'Colocasia': 'சேப்பங்கிழங்கு',
  'Jack Fruit': 'பலாப்பழம்', 'Jackfruit': 'பலாப்பழம்',
  'Pineapple': 'அன்னாசிப்பழம்', 'Sapota': 'சப்போட்டா',
  'Amla': 'நெல்லிக்காய்', 'Drumstick Leaves': 'முருங்கைக்கீரை',
  'Spinach': 'பசலைக்கீரை', 'Fenugreek': 'வெந்தயக்கீரை',
  'Amaranthus': 'முளைக்கீரை', 'Mustard': 'கடுகு',
  'Soybean': 'சோயாபீன்', 'Lentil': 'பருப்பு',
  'Field Pea': 'பட்டாணி', 'Green Pea': 'பச்சை பட்டாணி',
  'Bottle Gourd': 'சுரைக்காய்', 'Ridge Gourd': 'பீர்க்கங்காய்',
  'Sponge Gourd': 'நார்த்தங்காய்',
  'Other green and fresh vegetables': 'பிற கீரை மற்றும் காய்கறிகள்',
  'Other Vegetables': 'பிற காய்கறிகள்',
  'Other Fruits': 'பிற பழங்கள்',
};

const CROP_HINDI: any = {
  'Rice': 'चावल', 'Wheat': 'गेहूं', 'Maize': 'मक्का',
  'Tomato': 'टमाटर', 'Onion': 'प्याज', 'Banana': 'केला',
  'Cotton': 'कपास', 'Turmeric': 'हल्दी', 'Groundnut': 'मूंगफली',
  'Sugarcane': 'गन्ना', 'Coconut': 'नारियल', 'Mango': 'आम',
  'Chilli': 'मिर्च', 'Brinjal': 'बैंगन', 'Drumstick': 'सहजन',
  'Tamarind': 'इमली', 'Garlic': 'लहसुन', 'Ginger': 'अदरक',
  'Potato': 'आलू', 'Bhindi': 'भिंडी', 'Cauliflower': 'फूलगोभी',
  'Cabbage': 'पत्तागोभी', 'Bitter Gourd': 'करेला',
  'Cluster Beans': 'ग्वारफली', 'Ragi': 'रागी', 'Jowar': 'ज्वार',
  'Bajra': 'बाजरा', 'Tapioca': 'टेपिओका', 'Papaya': 'पपीता',
  'Cardamom': 'इलायची', 'Watermelon': 'तरबूज', 'Grapes': 'अंगूर',
  'Pomegranate': 'अनार', 'Blackgram': 'उड़द', 'Greengram': 'मूंग',
  'Redgram': 'अरहर', 'Apple': 'सेब', 'Paddy': 'धान',
  'Yam': 'जिमीकंद', 'Tinda': 'टिंडा', 'Cowpea': 'लोबिया',
  'Pointed Gourd': 'परवल', 'Lemon': 'नींबू', 'Orange': 'संतरा',
  'Sweet Potato': 'शकरकंद', 'Elephant Yam': 'सूरन',
  'Colocasia': 'अरबी', 'Jack Fruit': 'कटहल', 'Jackfruit': 'कटहल',
  'Pineapple': 'अनानास', 'Sapota': 'चीकू', 'Amla': 'आंवला',
  'Spinach': 'पालक', 'Fenugreek': 'मेथी', 'Mustard': 'सरसों',
  'Soybean': 'सोयाबीन', 'Green Pea': 'हरी मटर',
  'Bottle Gourd': 'लौकी', 'Ridge Gourd': 'तुरई',
  'Snake Gourd': 'चिचिंडा', 'Pumpkin': 'कद्दू',
  'Cucumber': 'खीरा', 'Beans': 'फलियाँ', 'Carrot': 'गाजर',
  'Radish': 'मूली', 'Capsicum': 'शिमला मिर्च',
  'Coriander': 'धनिया', 'Beetroot': 'चुकंदर',
  'Other green and fresh vegetables': 'अन्य हरी सब्जियाँ',
  'Other Vegetables': 'अन्य सब्जियाँ',
  'Other Fruits': 'अन्य फल',
};

// FIX: case-insensitive lookup maps, built once. Govt API commodity names
// sometimes come in different casing ("TOMATO", "tomato") or with extra
// spacing, so a plain object[key] lookup was silently failing and falling
// back to the untranslated raw English name.
function buildLowerCaseMap(source: any) {
  const out: any = {};
  Object.keys(source).forEach((key) => {
    out[key.toLowerCase()] = source[key];
  });
  return out;
}
const CROP_TAMIL_LOWER = buildLowerCaseMap(CROP_TAMIL);
const CROP_HINDI_LOWER = buildLowerCaseMap(CROP_HINDI);

function getCropName(commodity: string, lang: string) {
  // Collapse repeated whitespace and trim stray spaces from the API value.
  const cleaned = commodity.replace(/\s+/g, ' ').trim();
  // "Bhindi(Ladies Finger)" -> "Bhindi"
  const base = cleaned.split('(')[0].trim();
  const baseLower = base.toLowerCase();
  const fullLower = cleaned.toLowerCase();

  if (lang === 'tamil') {
    const ta = CROP_TAMIL_LOWER[baseLower] || CROP_TAMIL_LOWER[fullLower];
    if (ta) return `${ta} / ${base}`;
  }
  if (lang === 'hindi') {
    const hi = CROP_HINDI_LOWER[baseLower] || CROP_HINDI_LOWER[fullLower];
    if (hi) return `${hi} / ${base}`;
  }
  return cleaned;
}

const GOV_API_KEY = process.env.EXPO_PUBLIC_GOV_API_KEY || '';
const RESOURCE_ID_1 = '9ef84268-d588-465a-a308-a864a43d0070';
const RESOURCE_ID_2 = '35985678-0d79-46b4-9ed6-6f13308a1d24';
const BASE_URL = 'https://api.data.gov.in/resource';


const staticText: any = {
  tamil: {
    headerTitle: '📈 சந்தை விலைகள்',
    liveTag: '🟢 நேரடி விலை · புதுப்பிக்கப்பட்டது',
    estimateTag: '🟡 மாவட்ட விலை (தோராயம்)',
    selectDistrict: 'உங்கள் மாவட்டத்தை தேர்ந்தெடுக்கவும்',
    pickerTitle: 'மாவட்டம் தேர்ந்தெடு',
    searchPlaceholder: 'மாவட்டம் தேடுக...',
    cancel: 'ரத்து செய்',
    districtSubText: 'இன்றைய சந்தை விலை (₹/kg)',
    noDistrictText: 'விலை பார்க்க உங்கள் மாவட்டத்தை தேர்ந்தெடுக்கவும்',
    fetchingText: 'விலை பெறுகிறது...',
    minMax: 'குறை - அதிக',
    live: 'நேரடி',
    approx: 'தோராயம்',
    noData: 'இந்த மாவட்டத்திற்கு இப்போது விலை தரவு கிடைக்கவில்லை. மீண்டும் முயற்சிக்கவும்.',
    commoditySearchPlaceholder: '🔍 காய்கறி / பயிர் பெயர் தேடுக...',
    noSearchResults: 'இந்த பெயருக்கு பொருந்தும் பயிர் கிடைக்கவில்லை.',
  },
  english: {
    headerTitle: '📈 Market Prices',
    liveTag: '🟢 LIVE · Updated',
    estimateTag: '🟡 District Price (Approx)',
    selectDistrict: 'Select Your District',
    pickerTitle: 'Select District',
    searchPlaceholder: 'Search district...',
    cancel: 'Cancel',
    districtSubText: "Today's market price (₹/kg)",
    noDistrictText: 'Select your district to see prices',
    fetchingText: 'Fetching prices...',
    minMax: 'Min - Max',
    live: 'Live',
    approx: 'Approx',
    noData: 'No price data available for this district right now. Please try again.',
    commoditySearchPlaceholder: '🔍 Search vegetable / crop name...',
    noSearchResults: 'No crop matches that name.',
  },

};

type MarketItem = {
  commodity: string;
  price: number;
  change: number;
  unit: string;
  market: string;
  minPrice?: number;
  maxPrice?: number;
  isLive: boolean;
};

const tryFetch = async (resourceId: string, district: string) => {
  const districtEncoded = encodeURIComponent(district);
  const stateEncoded    = encodeURIComponent('Tamil Nadu');
  const url = `${BASE_URL}/${resourceId}?api-key=${GOV_API_KEY}&format=json&limit=500` +
    `&filters[state]=${stateEncoded}&filters[district]=${districtEncoded}`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000);
  const res = await fetch(url, { signal: controller.signal });
  clearTimeout(timeoutId);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return await res.json();
};

function parseRecords(records: any[]): MarketItem[] {
  const seen = new Set<string>();
  const result: MarketItem[] = [];

  records.forEach((rec: any) => {
    const name = rec.commodity || rec.Commodity || rec['Commodity Name'] || rec.commodity_name || '';
    if (!name) return;
    const marketName = rec.market || rec.Market || rec['Market Name'] || rec.market_name || '';
    const key = `${name}||${marketName}`;
    if (seen.has(key)) return;
    seen.add(key);

    const modal = parseFloat(rec.modal_price || rec.Modal_Price || rec['Modal Price'] || rec.modal || '0');
    const min   = parseFloat(rec.min_price   || rec.Min_Price   || rec['Min Price']   || rec.min   || '0');
    const max   = parseFloat(rec.max_price   || rec.Max_Price   || rec['Max Price']   || rec.max   || '0');

    const pricePerKg = +(modal / 100).toFixed(2);
    const minPerKg   = +(min   / 100).toFixed(2);
    const maxPerKg   = +(max   / 100).toFixed(2);
    const change     = +(pricePerKg - minPerKg).toFixed(2);

    result.push({
      commodity: name,
      price: pricePerKg,
      change,
      unit: 'kg',
      market: marketName,
      minPrice: minPerKg,
      maxPrice: maxPerKg,
      isLive: true,
    });
  });

  return result.filter(item => item.price > 0);
}

export default function MarketScreen() {
  const router = useRouter();
  const { lang } = useLang();
  const s = staticText[lang] || staticText.english;

  const [selectedDistrictKey, setSelectedDistrictKey] = useState('');
  const [districtSearch, setDistrictSearch]           = useState('');
  const [showDistrictPicker, setShowDistrictPicker]   = useState(false);
  const [marketData, setMarketData]                   = useState<MarketItem[]>([]);
  const [loading, setLoading]                         = useState(false);
  const [refreshing, setRefreshing]                   = useState(false);
  const [lastUpdated, setLastUpdated]                 = useState('');
  const [isLive, setIsLive]                           = useState(false);
  const [noData, setNoData]                           = useState(false);
  const [commoditySearch, setCommoditySearch]         = useState(''); // FIX: new search box state

  const filteredDistricts = TN_DISTRICT_LIST.filter((d) =>
    getDistrictLabel(d, lang).toLowerCase().includes(districtSearch.toLowerCase()) ||
    d.en.toLowerCase().includes(districtSearch.toLowerCase())
  );

  const selectedDistrictObj = TN_DISTRICT_LIST.find(d => d.key === selectedDistrictKey);
  const selectedDistrictLabel = selectedDistrictObj ? getDistrictLabel(selectedDistrictObj, lang) : '';

  // FIX: filter the fetched market data by the commodity search box.
  // Matches against both the raw English name and the translated name,
  // so searching in Tamil/Hindi or English both work.
  const filteredMarketData = marketData.filter((item) => {
    const query = commoditySearch.trim().toLowerCase();
    if (!query) return true;
    const translated = getCropName(item.commodity, lang).toLowerCase();
    return (
      item.commodity.toLowerCase().includes(query) ||
      translated.includes(query)
    );
  });

  const fetchPrices = async (districtKey: string, isRefresh = false) => {
    isRefresh ? setRefreshing(true) : setLoading(true);
    setIsLive(false);
    setNoData(false);
    setMarketData([]);

    try {
      let json = await tryFetch(RESOURCE_ID_1, districtKey);
      let records: any[] = json.records || [];

      if (records.length === 0) {
        json = await tryFetch(RESOURCE_ID_2, districtKey);
        records = json.records || [];
      }

      if (records.length > 0) {
        const liveItems = parseRecords(records);
        if (liveItems.length > 0) {
          setMarketData(liveItems);
          setIsLive(true);
          setLastUpdated(new Date().toLocaleTimeString('en-IN'));
        } else {
          setNoData(true);
        }
      } else {
        setNoData(true);
      }
    } catch (err) {
      console.error('Market fetch error:', err);
      setNoData(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onSelectDistrict = (d: any) => {
    setSelectedDistrictKey(d.key);
    setShowDistrictPicker(false);
    setDistrictSearch('');
    setCommoditySearch(''); // FIX: reset commodity search on district change
    fetchPrices(d.key);
  };

  const onRefresh = () => {
    if (selectedDistrictKey) fetchPrices(selectedDistrictKey, true);
  };

  const renderItem = ({ item }: { item: MarketItem }) => {
    const isUp = item.change >= 0;
    return (
      <View style={styles.card}>
        <View style={styles.cardLeft}>
          <Text style={styles.cropName}>{getCropName(item.commodity, lang)}</Text>
          <Text style={styles.marketName}>📍 {item.market}</Text>
          {item.minPrice != null && item.maxPrice != null && (
            <Text style={styles.priceRange}>
              {s.minMax}: ₹{item.minPrice} – ₹{item.maxPrice}/kg
            </Text>
          )}
          <Text style={item.isLive ? styles.liveDot : styles.estimateDot}>
            {item.isLive ? `🟢 ${s.live}` : `🟡 ${s.approx}`}
          </Text>
        </View>
        <View style={styles.cardRight}>
          <Text style={styles.price}>₹{item.price.toFixed(2)}</Text>
          <Text style={styles.unit}>/{item.unit}</Text>
          <View style={[styles.changeBadge, { backgroundColor: isUp ? '#e8f5e9' : '#fce4ec' }]}>
            <Text style={[styles.changeText, { color: isUp ? '#2e7d32' : '#c62828' }]}>
              {isUp ? '▲' : '▼'} ₹{Math.abs(item.change).toFixed(2)}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.outerContainer}>
      {/* ✅ District Picker Modal — FlatList-க்கு வெளியே */}
      <Modal
        visible={showDistrictPicker}
        transparent
        animationType="slide"
        onRequestClose={() => { setShowDistrictPicker(false); setDistrictSearch(''); }}
      >
        <View style={styles.pickerOverlay}>
          <View style={styles.pickerBox}>
            <Text style={styles.pickerTitle}>{s.pickerTitle}</Text>
            <TextInput
              style={styles.searchInput}
              placeholder={s.searchPlaceholder}
              placeholderTextColor="#888"
              value={districtSearch}
              onChangeText={setDistrictSearch}
              autoFocus
            />
            <ScrollView style={{ maxHeight: 340 }} keyboardShouldPersistTaps="handled">
              {filteredDistricts.map((d) => (
                <TouchableOpacity
                  key={d.key}
                  style={[styles.districtOption, d.key === selectedDistrictKey && styles.districtOptionActive]}
                  onPress={() => onSelectDistrict(d)}
                >
                  <Text style={[styles.districtOptionText, d.key === selectedDistrictKey && styles.districtOptionTextActive]}>
                    {getDistrictLabel(d, lang)}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => { setShowDistrictPicker(false); setDistrictSearch(''); }}
            >
              <Text style={styles.cancelBtnText}>{s.cancel}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ✅ Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>{s.headerTitle}</Text>
          {isLive && lastUpdated
            ? <Text style={styles.liveTag}>{s.liveTag} {lastUpdated}</Text>
            : <Text style={styles.estimateTag}>{s.estimateTag}</Text>
          }
        </View>
      </View>

      {/* ✅ District Dropdown Button */}
      <TouchableOpacity style={styles.districtBtn} onPress={() => setShowDistrictPicker(true)}>
        <Text style={styles.districtBtnIcon}>📍</Text>
        <Text style={[styles.districtBtnText, !selectedDistrictKey && styles.districtBtnPlaceholder]}>
          {selectedDistrictLabel || s.selectDistrict}
        </Text>
        <Text style={styles.dropIcon}>▾</Text>
      </TouchableOpacity>

      {/* ✅ FIX: Commodity search box — only useful once a district's data is loaded */}
      {selectedDistrictKey && !loading && marketData.length > 0 && (
        <View style={styles.commoditySearchBox}>
          <Text style={styles.commoditySearchIcon}>🔍</Text>
          <TextInput
            style={styles.commoditySearchInput}
            placeholder={s.commoditySearchPlaceholder}
            placeholderTextColor="#888"
            value={commoditySearch}
            onChangeText={setCommoditySearch}
          />
          {commoditySearch.length > 0 && (
            <TouchableOpacity onPress={() => setCommoditySearch('')}>
              <Text style={styles.commoditySearchClear}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* ✅ Loading */}
      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color="#2e7d32" />
          <Text style={styles.loadingText}>{s.fetchingText}</Text>
        </View>
      ) : (
        <FlatList
          data={filteredMarketData}
          keyExtractor={(item, i) => `${item.commodity}-${i}`}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#2e7d32']}
              tintColor="#2e7d32"
            />
          }
          ListHeaderComponent={
            selectedDistrictKey ? (
              <View style={styles.districtHeader}>
                <Text style={styles.districtHeaderText}>{selectedDistrictLabel}</Text>
                <Text style={styles.districtSubText}>{s.districtSubText}</Text>
              </View>
            ) : (
              <View style={styles.noDistrictBox}>
                <Text style={styles.noDistrictEmoji}>🗺️</Text>
                <Text style={styles.noDistrictText}>{s.noDistrictText}</Text>
              </View>
            )
          }
          ListEmptyComponent={
            selectedDistrictKey && !loading ? (
              <View style={styles.noDistrictBox}>
                <Text style={styles.noDistrictEmoji}>📭</Text>
                <Text style={styles.noDistrictText}>
                  {noData
                    ? s.noData
                    : commoditySearch.trim()
                    ? s.noSearchResults
                    : s.noData}
                </Text>
              </View>
            ) : null
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: { flex: 1, backgroundColor: '#f1f8e9' },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#2e7d32', paddingTop: 52, paddingBottom: 16, paddingHorizontal: 16,
  },
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  backIcon: { color: '#fff', fontSize: 20 },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: '700' },
  liveTag: { color: '#a5d6a7', fontSize: 12, marginTop: 2 },
  estimateTag: { color: '#ffe082', fontSize: 12, marginTop: 2 },

  districtBtn: {
    flexDirection: 'row', alignItems: 'center',
    margin: 14, padding: 14, backgroundColor: '#fff',
    borderRadius: 12, borderWidth: 2, borderColor: '#2e7d32',
    gap: 8, elevation: 2,
  },
  districtBtnIcon: { fontSize: 18 },
  districtBtnText: { flex: 1, fontSize: 15, color: '#1b5e20', fontWeight: '600' },
  districtBtnPlaceholder: { color: '#888', fontWeight: '400' },
  dropIcon: { fontSize: 18, color: '#2e7d32' },

  // FIX: styles for the new commodity search box
  commoditySearchBox: {
    flexDirection: 'row', alignItems: 'center',
    marginHorizontal: 14, marginBottom: 10, paddingHorizontal: 12,
    backgroundColor: '#fff', borderRadius: 12, borderWidth: 1.5,
    borderColor: '#c8e6c9', height: 46, gap: 8, elevation: 1,
  },
  commoditySearchIcon: { fontSize: 14 },
  commoditySearchInput: { flex: 1, fontSize: 14, color: '#1b5e20' },
  commoditySearchClear: { fontSize: 15, color: '#999', paddingHorizontal: 4 },

  pickerOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  pickerBox: {
    backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20,
    padding: 20, paddingBottom: 40, elevation: 8,
  },
  pickerTitle: { fontSize: 18, fontWeight: '700', color: '#1b5e20', marginBottom: 12 },
  searchInput: {
    borderWidth: 1, borderColor: '#c8e6c9', borderRadius: 10,
    padding: 10, fontSize: 15, marginBottom: 8, backgroundColor: '#f9fbe7', color: '#1b5e20',
  },
  districtOption: { paddingVertical: 12, paddingHorizontal: 8, borderBottomWidth: 1, borderBottomColor: '#f1f8e9' },
  districtOptionActive: { backgroundColor: '#e8f5e9', borderRadius: 8 },
  districtOptionText: { fontSize: 15, color: '#333' },
  districtOptionTextActive: { color: '#2e7d32', fontWeight: '700' },
  cancelBtn: { marginTop: 12, padding: 12, backgroundColor: '#f1f8e9', borderRadius: 10, alignItems: 'center' },
  cancelBtnText: { color: '#c62828', fontWeight: '700', fontSize: 15 },

  loadingBox: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, marginTop: 60 },
  loadingText: { color: '#2e7d32', fontSize: 15, fontWeight: '600' },
  listContent: { paddingHorizontal: 14, paddingBottom: 30 },
  districtHeader: { marginBottom: 12, marginTop: 4 },
  districtHeaderText: { fontSize: 18, fontWeight: '800', color: '#1b5e20' },
  districtSubText: { fontSize: 13, color: '#558b2f', marginTop: 2 },
  noDistrictBox: { alignItems: 'center', padding: 30, marginTop: 40, backgroundColor: '#fff', borderRadius: 16, elevation: 2 },
  noDistrictEmoji: { fontSize: 48, marginBottom: 12 },
  noDistrictText: { textAlign: 'center', color: '#558b2f', fontSize: 15, lineHeight: 22 },

  card: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: '#fff', borderRadius: 14, padding: 14, marginBottom: 10,
    elevation: 2, borderLeftWidth: 4, borderLeftColor: '#66bb6a',
  },
  cardLeft: { flex: 1, paddingRight: 10 },
  cropName: { fontSize: 15, fontWeight: '700', color: '#1b5e20' },
  marketName: { fontSize: 12, color: '#81c784', marginTop: 3 },
  priceRange: { fontSize: 11, color: '#999', marginTop: 2 },
  liveDot: { fontSize: 11, color: '#2e7d32', marginTop: 3, fontWeight: '600' },
  estimateDot: { fontSize: 11, color: '#f9a825', marginTop: 3 },
  cardRight: { alignItems: 'flex-end', gap: 4 },
  price: { fontSize: 22, fontWeight: '800', color: '#2e7d32' },
  unit: { fontSize: 12, color: '#888', marginTop: -4 },
  changeBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20, marginTop: 2 },
  changeText: { fontSize: 12, fontWeight: '700' },
});