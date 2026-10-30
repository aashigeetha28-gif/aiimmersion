# 🌾 UZHAVAR-IQ (உழவர் IQ)

> **Farmer-Focused Smart Agricultural Platform**  
> Comprehensive crop disease detection, impact analysis, organic/natural solutions, ML crop recommendations, and real-time government mandi market prices in both **Tamil (தமிழ்)** and **English**.

---

## 📖 Overview

**UZHAVAR-IQ** empowers farmers with actionable, AI-driven agricultural insights at their fingertips. Designed specifically for Indian agriculture with deep regional support (Tamil & English), it bridges the technology gap to boost crop yield, minimize losses from plant diseases, and maximize profits through live market visibility.

---

## ✨ Key Features

- **🔬 AI Crop Disease Detection & Impact Analysis**
  - Instant disease identification using leaf and crop photos via camera or gallery.
  - Powered by Kindwise Crop.Health AI with accurate diagnosis and severity evaluation.
  
- **🌿 Natural & Organic Treatment Solutions**
  - Customized natural, biological, and herbal remedies for identified plant diseases.
  - Step-by-step preparation guides in regional languages to avoid costly synthetic chemicals.

- **📈 Real-Time Mandi Market Prices**
  - Live commodity price reporting fetched directly from Government datasets (`agmarknet.gov.in` & `data.gov.in`).
  - Search by district across Tamil Nadu with minimum, maximum, and modal price trends.

- **🌱 ML Crop Recommendation Engine**
  - 22-crop Machine Learning model powered by Random Forest Classifier.
  - Predicts optimal crops based on real-time climate (temperature, humidity), rainfall, soil pH, and estimated N-P-K nutrients.

- **🎙️ Multilingual AI Voice Assistant**
  - Hands-free voice assistance powered by Groq (Whisper + Llama 3).
  - Voice queries and spoken audio responses in Tamil and English for seamless farmer accessibility.

- **🌐 Bilingual User Experience**
  - Full native localization in **Tamil (தமிழ்)** and **English**, designed with clean, accessible mobile UI.

---

## 🛠️ Tech Stack

### Mobile Frontend
- **Framework:** [React Native](https://reactnative.dev/) with [Expo](https://expo.dev/) (SDK 54)
- **Routing:** [Expo Router](https://docs.expo.dev/router/introduction/) (File-based navigation)
- **Language:** TypeScript
- **Media & Sensors:** `expo-image-picker`, `expo-av`, `expo-speech`, `expo-location`

### Backend & Machine Learning
- **Framework:** Python 3, [Flask](https://flask.palletsprojects.com/), `Flask-CORS`
- **Machine Learning:** `scikit-learn` (Random Forest Classifier), `numpy`
- **HTTP Client:** `requests`

### External APIs & Cloud Services
- **Disease Recognition:** Kindwise Crop.Health API
- **AI & Voice Intelligence:** Groq Cloud API (Llama 3 & Whisper)
- **Market Data:** Open Government Data (`api.data.gov.in`) & Agmarknet Daily Price Report
- **Weather Data:** OpenWeatherMap API

---

## 📁 Project Structure

```text
UZHAVAR-IQ/
├── app/                      # Expo Router screens and application logic
│   ├── (tabs)/               # Tab-based navigation layouts
│   ├── _layout.tsx           # Root navigation stack & provider
│   ├── context.tsx           # Language context (Tamil/English state & dictionary)
│   ├── crop.tsx              # Weather fetching, NPK calculation & crop recommendation
│   ├── disease.tsx           # Image capture, disease detection & organic remedies
│   ├── home.tsx              # Landing screen & feature navigation
│   ├── market.tsx            # Live Mandi market commodity prices
│   ├── ml_server.py          # Standalone ML Flask service (RandomForest model)
│   ├── modal.tsx             # Interactive modals
│   └── voice.tsx             # Multilingual Groq voice assistant
├── backend/                  # Flask API server & ML training data
│   ├── Crop_recommendation.csv
│   ├── server.py             # Agmarknet market price proxy server
│   └── train_model.py
├── assets/                   # App icons and branding assets
├── components/               # Reusable UI components
├── constants/                # App styling and constants
├── hooks/                    # Custom React hooks
├── .env.example              # Template for environment credentials
├── .gitignore                # Git ignore configuration
├── app.json                  # Expo project manifest
├── package.json              # Project dependencies & scripts
└── tsconfig.json             # TypeScript configuration
```

---

## ⚙️ Setup & Installation

### 1. Prerequisites
- **Node.js** (v18.0 or higher)
- **npm** or **yarn**
- **Python** (3.9 or higher)
- **Expo Go** app on your physical device (iOS/Android) or an emulator

### 2. Clone the Repository
```bash
git clone https://github.com/aashigeetha28-gif/UZHAVAR-IQ.git
cd UZHAVAR-IQ
```

### 3. Install Node.js Dependencies
```bash
npm install
```

### 4. Configure Environment Variables
Copy `.env.example` to create `.env`:
```bash
cp .env.example .env
```
Open `.env` and fill in your API credentials:
```env
EXPO_PUBLIC_CROP_HEALTH_API_KEY=your_kindwise_crop_health_key
EXPO_PUBLIC_GROQ_API_KEY=your_groq_api_key
EXPO_PUBLIC_GOV_API_KEY=your_data_gov_in_api_key
EXPO_PUBLIC_WEATHER_API_KEY=your_openweathermap_api_key
```

### 5. Start the Python Backend / ML Server
In a separate terminal:
```bash
# Optional: create a virtual environment
python -m venv .venv
# Activate on Windows: .venv\Scripts\activate
# Activate on macOS/Linux: source .venv/bin/activate

# Install requirements
pip install flask flask-cors requests scikit-learn numpy

# Start the ML recommendation server
python app/ml_server.py
```
*(Optionally, start the market proxy server via `python backend/server.py` on port 3000).*

### 6. Start the Expo Mobile App
```bash
npx expo start
```
- Scan the QR code using the **Expo Go** app (Android) or **Camera app** (iOS).
- Press `a` for Android Emulator, `i` for iOS Simulator, or `w` for Web.

---

## 🔐 Security & Privacy

All API keys and secrets are isolated from version control using `.env` and excluded via `.gitignore`. Never commit `.env` containing sensitive credentials to any public or private repository.

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
