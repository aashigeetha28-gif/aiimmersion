from flask import Flask, request, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)

@app.route('/api/market')
def get_market():
    district = request.args.get('district', '')

    try:
        url = "https://agmarknet.gov.in/api/DailyPriceAndArrivalReport"
        
        params = {
            "state": "Tamil Nadu",
            "district": district,
            "fromDate": "",
            "toDate": "",
            "pageNo": 1,
            "pageSize": 100
        }

        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
            'Referer': 'https://agmarknet.gov.in/daily-price-and-arrival-report',
            'Accept': 'application/json',
        }

        res = requests.get(url, params=params, headers=headers, timeout=20)
        data = res.json()

        records = []
        items = data.get('data', data.get('records', data.get('result', [])))
        
        for item in items:
            records.append({
                'commodity': item.get('commodity') or item.get('Commodity') or '',
                'market':    item.get('market')    or item.get('Market')    or '',
                'min_price': item.get('minPrice')  or item.get('Min_Price') or '0',
                'max_price': item.get('maxPrice')  or item.get('Max_Price') or '0',
                'modal_price': item.get('modalPrice') or item.get('Modal_Price') or '0',
            })

        return jsonify({'records': records})

    except Exception as e:
        return jsonify({'error': str(e), 'records': []}), 500

if __name__ == '__main__':
    app.run(port=3000, debug=True)