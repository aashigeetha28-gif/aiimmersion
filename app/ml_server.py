from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np

app = Flask(__name__)
CORS(app)

TRAINING_DATA = [

    [90, 42, 43, 20.87, 82.00, 6.50, 202.93, 'rice'],
    [85, 58, 41, 21.77, 80.31, 7.03, 226.65, 'rice'],
    [60, 55, 44, 23.00, 82.32, 7.84, 263.96, 'rice'],
    [74, 35, 40, 26.49, 80.15, 6.98, 242.86, 'rice'],
    [78, 42, 42, 20.13, 81.60, 7.62, 262.72, 'rice'],
    [69, 37, 42, 23.05, 83.37, 7.07, 251.82, 'rice'],
    [69, 55, 38, 22.71, 82.63, 5.71, 271.30, 'rice'],
    [94, 53, 40, 20.27, 82.41, 5.60, 241.96, 'rice'],
    [89, 54, 38, 24.51, 83.44, 6.68, 285.29, 'rice'],
    [68, 58, 38, 23.22, 82.43, 6.37, 233.48, 'rice'],
    [40, 67, 19, 17.00, 20.00, 5.80, 230.00, 'maize'],
    [37, 67, 20, 18.00, 22.00, 6.00, 180.00, 'maize'],
    [39, 65, 21, 19.00, 21.00, 5.90, 200.00, 'maize'],
    [38, 68, 19, 20.00, 23.00, 6.10, 190.00, 'maize'],
    [41, 66, 20, 17.50, 19.00, 5.70, 220.00, 'maize'],
    [20, 67, 20, 15.00, 14.00, 5.63, 67.00, 'chickpea'],
    [18, 68, 19, 16.00, 13.00, 5.89, 72.00, 'chickpea'],
    [21, 66, 21, 14.00, 15.00, 6.10, 65.00, 'chickpea'],
    [19, 65, 20, 17.00, 12.00, 5.75, 70.00, 'chickpea'],
    [20, 50, 20, 18.87, 16.86, 7.10, 103.41, 'kidneybeans'],
    [21, 48, 21, 19.00, 17.00, 7.20, 105.00, 'kidneybeans'],
    [19, 51, 19, 18.00, 16.00, 6.90, 100.00, 'kidneybeans'],
    [20, 70, 20, 27.00, 48.00, 5.80, 39.00, 'pigeonpeas'],
    [21, 68, 21, 28.00, 49.00, 5.90, 40.00, 'pigeonpeas'],
    [19, 72, 19, 26.00, 47.00, 5.70, 38.00, 'pigeonpeas'],
    [20, 40, 20, 28.00, 65.00, 6.80, 50.00, 'mothbeans'],
    [21, 41, 19, 29.00, 66.00, 6.90, 48.00, 'mothbeans'],
    [20, 40, 20, 20.00, 18.00, 5.80, 40.00, 'mungbean'],
    [21, 41, 21, 21.00, 17.00, 5.90, 42.00, 'mungbean'],
    [20, 67, 19, 29.72, 64.51, 7.13, 150.16, 'blackgram'],
    [21, 68, 20, 30.00, 65.00, 7.20, 155.00, 'blackgram'],
    [19, 66, 19, 29.00, 63.00, 7.00, 148.00, 'blackgram'],
    [18, 68, 20, 24.12, 58.68, 6.52, 52.22, 'lentil'],
    [19, 67, 21, 25.00, 59.00, 6.60, 54.00, 'lentil'],
    [17, 69, 19, 23.00, 57.00, 6.40, 50.00, 'lentil'],
    [20, 10, 35, 21.83, 90.51, 5.79, 111.35, 'pomegranate'],
    [21, 11, 36, 22.00, 91.00, 5.80, 112.00, 'pomegranate'],
    [19, 10, 34, 21.00, 90.00, 5.70, 110.00, 'pomegranate'],
    [100, 82, 50, 27.38, 80.55, 5.98, 120.69, 'banana'],
    [102, 80, 51, 28.00, 81.00, 6.00, 122.00, 'banana'],
    [98, 84, 49, 27.00, 80.00, 5.90, 118.00, 'banana'],
    [20, 20, 30, 30.00, 50.00, 5.50, 100.00, 'mango'],
    [21, 21, 31, 31.00, 51.00, 5.60, 102.00, 'mango'],
    [19, 19, 29, 29.00, 49.00, 5.40, 98.00, 'mango'],
    [125, 200, 200, 23.86, 80.67, 6.29, 69.61, 'grapes'],
    [126, 198, 201, 24.00, 81.00, 6.30, 70.00, 'grapes'],
    [20, 50, 200, 23.60, 85.01, 6.96, 150.85, 'watermelon'],
    [21, 51, 201, 24.00, 86.00, 7.00, 152.00, 'watermelon'],
    [19, 49, 199, 23.00, 84.00, 6.90, 148.00, 'watermelon'],
    [20, 50, 200, 28.65, 92.34, 6.36, 24.91, 'muskmelon'],
    [21, 51, 201, 29.00, 93.00, 6.40, 25.00, 'muskmelon'],
    [7, 20, 10, 21.00, 92.00, 5.80, 112.00, 'apple'],
    [8, 21, 11, 22.00, 93.00, 5.90, 114.00, 'apple'],
    [6, 19, 9, 20.00, 91.00, 5.70, 110.00, 'apple'],
    [20, 10, 10, 22.63, 92.44, 6.85, 110.35, 'orange'],
    [21, 11, 11, 23.00, 93.00, 6.90, 112.00, 'orange'],
    [19, 10, 10, 22.00, 91.00, 6.80, 108.00, 'orange'],
    [50, 50, 50, 25.58, 80.07, 6.62, 148.53, 'papaya'],
    [51, 51, 51, 26.00, 81.00, 6.70, 150.00, 'papaya'],
    [49, 49, 49, 25.00, 79.00, 6.50, 146.00, 'papaya'],
    [30, 62, 200, 26.77, 95.40, 5.98, 175.69, 'coconut'],
    [31, 63, 201, 27.00, 96.00, 6.00, 177.00, 'coconut'],
    [29, 61, 199, 26.00, 94.00, 5.90, 173.00, 'coconut'],
    [117, 32, 34, 23.00, 80.00, 6.50, 115.00, 'cotton'],
    [118, 33, 35, 24.00, 81.00, 6.60, 117.00, 'cotton'],
    [116, 31, 33, 22.00, 79.00, 6.40, 113.00, 'cotton'],
    [70, 65, 20, 23.00, 85.00, 6.50, 175.00, 'jute'],
    [71, 66, 21, 24.00, 86.00, 6.60, 177.00, 'jute'],
    [69, 64, 19, 22.00, 84.00, 6.40, 173.00, 'jute'],
    [100, 20, 30, 25.54, 58.99, 6.74, 158.07, 'coffee'],
    [101, 21, 31, 26.00, 59.00, 6.80, 160.00, 'coffee'],
    [99, 19, 29, 25.00, 58.00, 6.70, 156.00, 'coffee'],
]

CROP_INFO = {
    'rice':        {'tamil': 'நெல்',           'profit': '₹45,000-50,000/acre', 'season': 'Kharif',  'water': 'High'},
    'maize':       {'tamil': 'மக்காச்சோளம்',   'profit': '₹35,000-45,000/acre', 'season': 'Kharif',  'water': 'Medium'},
    'chickpea':    {'tamil': 'கொண்டைக்கடலை',   'profit': '₹40,000-55,000/acre', 'season': 'Rabi',    'water': 'Low'},
    'kidneybeans': {'tamil': 'ராஜ்மா',          'profit': '₹45,000-60,000/acre', 'season': 'Kharif',  'water': 'Medium'},
    'pigeonpeas':  {'tamil': 'துவரம்பருப்பு',   'profit': '₹35,000-50,000/acre', 'season': 'Kharif',  'water': 'Low'},
    'mothbeans':   {'tamil': 'மொச்சை',          'profit': '₹30,000-40,000/acre', 'season': 'Kharif',  'water': 'Low'},
    'mungbean':    {'tamil': 'பச்சைப்பயறு',     'profit': '₹35,000-45,000/acre', 'season': 'Kharif',  'water': 'Low'},
    'blackgram':   {'tamil': 'உளுந்து',         'profit': '₹40,000-50,000/acre', 'season': 'Rabi',    'water': 'Low'},
    'lentil':      {'tamil': 'மசூர் பருப்பு',   'profit': '₹35,000-45,000/acre', 'season': 'Rabi',    'water': 'Low'},
    'pomegranate': {'tamil': 'மாதுளை',          'profit': '₹80,000-1,20,000/acre','season': 'Annual', 'water': 'Low'},
    'banana':      {'tamil': 'வாழை',            'profit': '₹70,000-90,000/acre', 'season': 'Annual',  'water': 'High'},
    'mango':       {'tamil': 'மாம்பழம்',        'profit': '₹60,000-80,000/acre', 'season': 'Annual',  'water': 'Medium'},
    'grapes':      {'tamil': 'திராட்சை',        'profit': '₹1,00,000-1,50,000/acre','season': 'Annual','water': 'Medium'},
    'watermelon':  {'tamil': 'தர்பூசணி',        'profit': '₹50,000-70,000/acre', 'season': 'Summer',  'water': 'High'},
    'muskmelon':   {'tamil': 'கஸ்தூரி மாம்பழம்','profit': '₹40,000-60,000/acre','season': 'Summer',  'water': 'Medium'},
    'apple':       {'tamil': 'ஆப்பிள்',         'profit': '₹1,50,000-2,00,000/acre','season': 'Annual','water': 'Medium'},
    'orange':      {'tamil': 'ஆரஞ்சு',          'profit': '₹60,000-80,000/acre', 'season': 'Annual',  'water': 'Medium'},
    'papaya':      {'tamil': 'பப்பாளி',         'profit': '₹50,000-70,000/acre', 'season': 'Annual',  'water': 'Medium'},
    'coconut':     {'tamil': 'தேங்காய்',        'profit': '₹40,000-60,000/acre', 'season': 'Annual',  'water': 'High'},
    'cotton':      {'tamil': 'பருத்தி',         'profit': '₹55,000-65,000/acre', 'season': 'Kharif',  'water': 'Medium'},
    'jute':        {'tamil': 'சணல்',            'profit': '₹25,000-35,000/acre', 'season': 'Kharif',  'water': 'High'},
    'coffee':      {'tamil': 'காபி',            'profit': '₹80,000-1,00,000/acre','season': 'Annual', 'water': 'Medium'},
}

from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder

data = np.array(TRAINING_DATA, dtype=object)
X = data[:, :7].astype(float)
y = data[:, 7]

le = LabelEncoder()
y_encoded = le.fit_transform(y)

model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X, y_encoded)

print("✅ ML Model trained! 22 crops ready!")

def estimate_npk(temperature, humidity, rainfall):
    """Estimate N, P, K based on climate"""
    if temperature > 30 and humidity > 75:
        return 85, 55, 42  # Rice-like
    elif temperature > 28 and humidity < 60:
        return 117, 32, 34  # Cotton-like
    elif temperature < 20:
        return 18, 68, 19  # Chickpea-like
    elif humidity > 85:
        return 30, 62, 200  # Coconut-like
    elif rainfall < 60:
        return 20, 67, 20  # Pigeonpeas-like
    else:
        return 60, 50, 40  # General

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        temperature = float(data.get('temperature', 25))
        humidity = float(data.get('humidity', 70))
        ph = float(data.get('ph', 6.5))
        rainfall = float(data.get('rainfall', 150))

        N, P, K = estimate_npk(temperature, humidity, rainfall)

        input_data = np.array([[N, P, K, temperature, humidity, ph, rainfall]])

        # Get probability for all 22 crops
        probabilities = model.predict_proba(input_data)[0]
        crop_probs = list(zip(le.classes_, probabilities))
        crop_probs.sort(key=lambda x: x[1], reverse=True)

        results = []
        for crop_name, prob in crop_probs[:6]:
            if prob > 0.01:
                info = CROP_INFO.get(crop_name, {})
                results.append({
                    'name': crop_name.capitalize(),
                    'tamil': info.get('tamil', crop_name),
                    'confidence': round(prob * 100, 1),
                    'season': info.get('season', 'Kharif'),
                    'profit': info.get('profit', '₹40,000-60,000/acre'),
                    'water': info.get('water', 'Medium'),
                    'reason': f'Temp {temperature}°C, Humidity {humidity}%, pH {ph} suits this crop',
                })

        return jsonify({'success': True, 'crops': results[:4]})

    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'model': 'RandomForest', 'crops': 22})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)