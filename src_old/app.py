import gradio as gr
import requests
import os

# ---------------------------------------------------------
# CONFIGURATION & ENVIRONMENT VARIABLES
# ---------------------------------------------------------

# The Base URL for the Flowise API.
# - In Docker (Production): This is injected as 'http://flowise:3000' via docker-compose.
# - Local Development: Defaults to 'http://localhost:3000'.
BASE_API_URL = os.getenv("FLOWISE_API_URL", "http://localhost:3000")

# The specific Chatflow ID from Flowise.
# NOTE: This is NOT a URL. It is the UUID string found at the end of the API endpoint.
# Example: "98089ccf-911f-4821-9196-416a160b329f"
TRIAGE_FLOW_ID = os.getenv("TRIAGE_ID", "YOUR_DEFAULT_LOCAL_ID_HERE")

# ---------------------------------------------------------
# CORE LOGIC
# ---------------------------------------------------------

def ask_hygieai(message, history):
    """
    Sends the user message to the Flowise API and returns the response.
    """
    # Construct the full API endpoint
    api_url = f"{BASE_API_URL}/api/v1/prediction/{TRIAGE_FLOW_ID}"
    
    payload = {"question": message}
    
    try:
        # Send POST request to Flowise
        response = requests.post(api_url, json=payload)
        response.raise_for_status() # Raise an error for bad status codes (4xx, 5xx)
        
        # Parse JSON response
        return response.json().get("text", "⚠️ Error: Received empty response from Flowise.")
        
    except requests.exceptions.ConnectionError:
        return (f"⚠️ Connection Error: Could not connect to Flowise at '{BASE_API_URL}'.\n"
                f"Ensure the backend container is running.")
    except Exception as e:
        return f"System Error: {str(e)}"

# ---------------------------------------------------------
# UI SETUP
# ---------------------------------------------------------

with gr.Blocks(theme=gr.themes.Soft(), title="HygieAI") as demo:
    gr.Markdown("# 🏥 HygieAI: Clinical Triage Assistant")
    gr.ChatInterface(fn=ask_hygieai)

# Launch configuration
if __name__ == "__main__":
    # Server name '0.0.0.0' is required for Docker networking
    demo.launch(server_name="0.0.0.0", server_port=7860)