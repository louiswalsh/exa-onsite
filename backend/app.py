from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from exa_py import Exa
import os
import logging

# Load environment like exatention
load_dotenv()

from search_trials_specialty import search_trials_by_specialty

app = Flask(__name__)
CORS(app)

# Basic logging setup
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create Exa client like exatention and attach to app
exa_api_key = os.getenv('EXA_API_KEY')
exa = Exa(exa_api_key) if exa_api_key else None
masked = (exa_api_key[-4:] if exa_api_key else 'none')
logger.info("EXA client init: present=%s, key_last4=%s", bool(exa), masked)
app.config['EXA_CLIENT'] = exa


@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy'}), 200


@app.route('/api/trials/specialty/<specialty>', methods=['GET'])
def trials_specialty_route(specialty: str):
    try:
        if not exa:
            logger.error("Exa client not configured. Set EXA_API_KEY in the environment.")
            return jsonify({'error': 'Exa API not configured. Set EXA_API_KEY.'}), 500

        result = search_trials_by_specialty(exa, specialty)
        return jsonify(result), 200
    except ValueError as ex_err:
        logger.error("Exa search failed: %s", str(ex_err))
        return jsonify({'error': 'Exa search failed', 'message': str(ex_err)}), 400
    except Exception as ex_err:
        logger.error("Unexpected error: %s", str(ex_err), exc_info=True)
        return jsonify({'error': 'Unexpected error', 'message': str(ex_err)}), 500


if __name__ == '__main__':
    app.run(debug=True, port=8080, host='0.0.0.0')
