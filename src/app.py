import os
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS

# --- Configuration ---
BASE_API_URL = os.getenv("FLOWISE_API_URL", "http://localhost:3000")

TRIAGE_FLOW_ID = os.getenv("TRIAGE_ID", "682f7ed3-3b0f-436c-b907-7bc7d6e706f9")

FLOWISE_ENDPOINT = f"{BASE_API_URL}/api/v1/prediction/{TRIAGE_FLOW_ID}"

# --- Flask App Initialization ---
app = Flask(__name__)
# Enable Cross-Origin Resource Sharing for your frontend
CORS(app)

# --- API Endpoint ---
@app.route('/api/chat', methods=['POST'])
def chat_proxy():
    """
    Receives a message from the frontend, forwards it to Flowise,
    and returns the Flowise response.
    """
    try:
        # Get the JSON data from the frontend's request
        frontend_data = request.json
        user_message = frontend_data.get('message')

        if not user_message:
            return jsonify({"error": "Message is required"}), 400

        # Prepare the payload for the Flowise API
        flowise_payload = {"question": user_message}

        # Forward the request to the Flowise container
        response = requests.post(FLOWISE_ENDPOINT, json=flowise_payload)
        response.raise_for_status()  # Raise an exception for bad status codes (4xx or 5xx)

        # Return the JSON response from Flowise back to the frontend
        return jsonify(response.json())

    except requests.exceptions.RequestException as e:
        return jsonify({"error": f"Could not connect to Flowise: {e}"}), 502
    except Exception as e:
        return jsonify({"error": f"An internal error occurred: {e}"}), 500

if __name__ == '__main__':
    # Run on 0.0.0.0 to be accessible from other Docker containers
    app.run(host='0.0.0.0', port=5000)
