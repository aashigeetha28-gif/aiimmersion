import React, { createContext, useContext, useState } from 'react';

const translations: any = {
  tamil: {
    appName: 'UZHAVAR IQ',
    subtitle: 'உங்கள் விவசாய உதவியாளர்',
    crop: 'பயிர் கணிப்பு',
    disease: 'நோய் பகுப்பாய்வு',
    market: 'சந்தை போக்கு',
    voice: 'குரல் உதவியாளர்',
    location: 'இடம் & வானிலை',
    detectLocation: 'என் இடத்தை கண்டறி',
    searching: 'தேடுகிறது...',
    found: 'கண்டறியப்பட்டது',
    retry: 'மீண்டும் முயற்சி',
    predict: 'ML பயிர் கணிக்கவும்',
    predicting: 'ML யோசிக்கிறது...',
    bestCrops: 'சிறந்த பயிர்கள்',
    confidence: 'நம்பகத்தன்மை',
    temperature: 'வெப்பநிலை',
    humidity: 'ஈரப்பதம்',
    wind: 'காற்று',
    uploadPhoto: 'படம் எடுங்கள்',
    camera: 'கேமரா',
    gallery: 'கேலரி',
    analyze: 'நோயை கண்டறி',
    analyzing: 'AI பகுப்பாய்கிறது...',
    diseaseFound: 'கண்டறியப்பட்ட நோய்',
    naturalSolution: 'இயற்கை தீர்வுகள்',
    marketPrice: 'சந்தை விலை',
    profitCalc: 'லாப கணக்கீடு',
    investment: 'முதலீடு (₹)',
    land: 'நிலம் (ஏக்கர்)',
    calculate: 'கணக்கிடு',
    expectedReturn: 'எதிர்பார்க்கப்படும் வருமானம்',
    profit: 'லாபம்',
    askQuestion: 'கேள்வி கேளுங்கள்',
    typeQuestion: 'கேள்வியை தட்டச்சு செய்யுங்கள்...',
    ask: 'கேளுங்கள்',
    sampleQuestions: 'உதாரண கேள்விகள்',
    changeLang: 'மொழி மாற்று',
    back: '←',
    best: 'சிறந்தது',
    cityPlaceholder: 'உ.தா: Erode, Delhi, Mumbai...',
    searchCity: 'வானிலை தரவு எடு',
    market: 'சந்தை போக்கு',
    voice: 'குரல் உதவியாளர்',
  },
  english: {
    appName: 'UZHAVAR IQ',
    subtitle: 'Your Smart Farming Assistant',
    crop: 'Crop Prediction',
    disease: 'Disease Analysis',
    market: 'Market Trends',
    voice: 'Voice Assistant',
    location: 'Location & Weather',
    detectLocation: 'Detect My Location',
    searching: 'Searching...',
    found: 'Found',
    retry: 'Retry',
    predict: 'ML Predict Crop',
    predicting: 'ML Thinking...',
    bestCrops: 'Best Crops',
    confidence: 'Confidence',
    temperature: 'Temperature',
    humidity: 'Humidity',
    wind: 'Wind',
    uploadPhoto: 'Take Photo',
    camera: 'Camera',
    gallery: 'Gallery',
    analyze: 'Detect Disease',
    analyzing: 'AI Analyzing...',
    diseaseFound: 'Disease Detected',
    naturalSolution: 'Natural Solutions',
    marketPrice: 'Market Price',
    profitCalc: 'Profit Calculator',
    investment: 'Investment (₹)',
    land: 'Land (acres)',
    calculate: 'Calculate',
    expectedReturn: 'Expected Return',
    profit: 'Profit',
    askQuestion: 'Ask a Question',
    typeQuestion: 'Type your question...',
    ask: 'Ask',
    sampleQuestions: 'Sample Questions',
    changeLang: 'Change Language',
    back: '←',
    best: 'Best',
    cityPlaceholder: 'e.g: Erode, Delhi, Mumbai...',
    searchCity: 'Get Weather Data',
  },

};

type LangContextType = {
  lang: string;
  setLang: (l: string) => void;
  t: any;
};

const LangContext = createContext<LangContextType>({
  lang: '',
  setLang: () => {},
  t: translations.tamil,
});

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState('');
  const t = translations[lang] || translations.tamil;
  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}

export default function ContextPage() {
  return null;
}