from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from exa_py import Exa
import os

load_dotenv()

from search_trials_specialty import search_trials_by_specialty

app = Flask(__name__)
CORS(app)

exa_api_key = os.getenv('EXA_API_KEY')
exa = Exa(exa_api_key) if exa_api_key else None

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy'}), 200

@app.route('/api/trials/specialty/<specialty>', methods=['GET'])
def trials_specialty_route(specialty: str):
    if not exa:
        return jsonify({'error': 'Exa API not configured. Set EXA_API_KEY.'}), 500
    try:
        result = search_trials_by_specialty(exa, specialty)
        return jsonify(result), 200
    except ValueError as ex_err:
        return jsonify({'error': 'Exa search failed', 'message': str(ex_err)}), 400
    except Exception as ex_err:
        return jsonify({'error': 'Unexpected error', 'message': str(ex_err)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=8080, host='0.0.0.0')
