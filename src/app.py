import os
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
from pypdf import PdfReader
import io

# --- Configuration ---
BASE_API_URL = os.getenv("FLOWISE_API_URL", "http://localhost:3000")

TRIAGE_FLOW_ID = os.getenv("TRIAGE_ID", "8643a4dc-f0c8-43d9-bcdf-a8b3e2cffc23")
ANALYSIS_FLOW_ID = os.getenv("ANALYSIS_ID", "ed48d43e-4bc7-440d-9e6c-b69a377b28a4")

FLOWISE_ENDPOINT = f"{BASE_API_URL}/api/v1/prediction/{TRIAGE_FLOW_ID}"
ANALYSIS_ENDPOINT = f"{BASE_API_URL}/api/v1/prediction/{ANALYSIS_FLOW_ID}"

# --- Flask App Initialization ---
app = Flask(__name__)
# Enable Cross-Origin Resource Sharing for your frontend
CORS(app)

# --- API Endpoint: Triage ---
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

# --- API Endpoint: Analysis ---
@app.route('/api/analysis', methods=['POST'])
def analysis_proxy():
    """
    Proxy for the Blood Analysis module.
    """
    try:
        frontend_data = request.json
        user_message = frontend_data.get('message')

        if not user_message:
            return jsonify({"error": "Message is required"}), 400

        flowise_payload = {"question": user_message}

        # Use the Analysis Endpoint
        response = requests.post(ANALYSIS_ENDPOINT, json=flowise_payload)
        response.raise_for_status()

        return jsonify(response.json())

    except requests.exceptions.RequestException as e:
        return jsonify({"error": f"Could not connect to Flowise Analysis: {e}"}), 502
    except Exception as e:
        return jsonify({"error": f"An internal error occurred: {e}"}), 500

# --- API Endpoint: File Upload ---
@app.route('/api/upload', methods=['POST'])
def upload_proxy():
    """
    Handles file uploads, extracts text from PDF, and sends it to Flowise as a prompt.
    """
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    try:
        # Extract text from PDF
        pdf_reader = PdfReader(file)
        text_content = ""
        for page in pdf_reader.pages:
            text_content += page.extract_text() + "\n"
        
        if not text_content.strip():
             return jsonify({"error": "Could not extract text from PDF. It might be empty or scanned image."}), 400

        # Prepare the payload for Flowise Analysis Flow
        # We send the extracted text as part of the question
        prompt = f"Aşağıda bir hasta raporunun içeriği bulunmaktadır. Lütfen bu raporu analiz et, önemli bulguları özetle ve hasta için önerilerde bulun:\n\n{text_content}"
        
        flowise_payload = {"question": prompt}

        response = requests.post(ANALYSIS_ENDPOINT, json=flowise_payload)
        response.raise_for_status()

        return jsonify(response.json())

    except Exception as e:
        return jsonify({"error": f"An internal error occurred during processing: {e}"}), 500

if __name__ == '__main__':
    # Run on 0.0.0.0 to be accessible from other Docker containers
    app.run(host='0.0.0.0', port=5000)
