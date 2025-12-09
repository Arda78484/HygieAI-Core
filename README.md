# HygieAI-Core

<div align="center">
  <img src="./public/logo.svg" alt="HygieAI Logo" width="100" height="100" />
  <h3>AI-Powered Healthcare Triage & Blood Analysis Assistant</h3>
  <p>A comprehensive healthcare chatbot system for patient triage and medical report analysis</p>
</div>

---

## 📋 Table of Contents

- [About the Project](#about-the-project)
- [Features](#features)
- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Usage Guide](#usage-guide)
- [Development](#development)
- [Deployment](#deployment)
- [Configuration](#configuration)
- [Troubleshooting](#troubleshooting)
- [License](#license)

---

## About the Project

**HygieAI-Core** is an intelligent healthcare assistant application that leverages AI and Large Language Models (LLMs) to provide two primary services:

1. **Triage Assistant** - Helps patients describe symptoms and provides initial guidance on the urgency and type of medical attention needed
2. **Blood Analysis Module** - Analyzes medical reports (PDFs) and extracts key findings, providing summaries and health recommendations

The system uses **Flowise** (a visual LLM workflow builder) as the backend AI engine and provides a modern, user-friendly web interface with multi-language support (Turkish & English).

---

## Features

### 🏥 Triage Assistant
- **Interactive Chat Interface** - Conversational patient assessment
- **Symptom Tracking** - Users describe symptoms naturally
- **Risk Assessment** - AI-powered initial triage guidance
- **Multilingual Support** - Turkish & English interfaces

### 📊 Blood Analysis Module
- **PDF Upload** - Upload medical reports
- **Text Extraction** - Automatic text extraction from PDFs
- **Report Analysis** - AI-powered analysis of lab results
- **Summary Generation** - Key findings and recommendations
- **Instant Insights** - Quick medical insights from reports

### 🌐 General Features
- **Modern UI/UX** - Clean, intuitive React-based interface
- **Responsive Design** - Works on desktop and mobile devices
- **Real-time Streaming** - Live chat responses from AI
- **Markdown Support** - Rich formatting in AI responses
- **Error Handling** - Graceful error messages in user's language
- **Load States** - Visual feedback during processing

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (React)                         │
│                                                              │
│  ├─ Triage Module (Chat Interface)                          │
│  ├─ Blood Analysis Module (PDF Upload + Analysis)           │
│  ├─ Module Selection (Landing Page)                         │
│  └─ Header (Navigation, Language Toggle)                    │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTP/REST APIs
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              Backend API (Flask/Python)                      │
│                                                              │
│  ├─ /api/chat         → Triage Flowise Flow                 │
│  ├─ /api/analysis     → Analysis Flowise Flow               │
│  └─ /api/upload       → PDF Processing & Analysis           │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTP/Flowise API
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              Flowise (AI Engine)                             │
│                                                              │
│  ├─ Triage Chatflow   (ID: 8643a4dc-f0c8-43d9...)           │
   └─ Analysis Chatflow (ID: ed48d43e-4bc7-440d...)           │
└─────────────────────────────────────────────────────────────┘
```

---

## Flowise Workflow Configuration

The core intelligence of HygieAI relies on sophisticated Flowise workflows. Below is the detailed configuration for the **Blood Analysis & Report Assistant** flow, which utilizes a RAG (Retrieval Augmented Generation) architecture to process and analyze medical documents.

### 🧬 Analysis Flow Architecture (RAG)

This workflow is designed to ingest PDF documents, split them into manageable chunks, embed them into a vector store, and use a powerful LLM to answer questions based on the document context.

**Components:**

1.  **Document Loader (Pdf File)**
    *   **Function**: Loads the uploaded medical report (PDF).
    *   **Configuration**: Accepts file uploads from the API.

2.  **Text Splitter (Recursive Character Text Splitter)**
    *   **Function**: Splits the document text into smaller chunks for efficient processing.
    *   **Chunk Size**: `1000`
    *   **Chunk Overlap**: `200`

3.  **Embeddings (OpenAI Embeddings Custom)**
    *   **Model**: `nvidia/nv-embed-v1`
    *   **Provider**: NVIDIA NIM (via Custom OpenAI compatible endpoint)
    *   **Function**: Converts text chunks into vector embeddings.

4.  **Vector Store (In-Memory Vector Store)**
    *   **Function**: Stores the embeddings temporarily for retrieval.
    *   **Top K**: `4` (Retrieves the top 4 most relevant chunks).

5.  **Chat Model (Chat NVIDIA NIM)**
    *   **Model**: `meta/llama-4-maverick-17b-128e-ir`
    *   **Temperature**: `0.9` (For creative yet accurate generation)
    *   **Base Path**: `https://integrate.api.nvidia.com/v1`
    *   **Function**: Generates the final response based on the retrieved context and user query.

6.  **Memory (Buffer Memory)**
    *   **Function**: Maintains the context of the conversation (chat history).

7.  **Chain (Conversational Retrieval QA Chain)**
    *   **Function**: Orchestrates the entire process:
        1.  Takes the user question.
        2.  Retrieves relevant context from the Vector Store.
        3.  Passes the context and question to the Chat Model.
        4.  Returns the answer.

*(Note: The Triage flow follows a simpler conversational structure without document retrieval capabilities.)*

---

## Technology Stack

### Frontend
- **Framework**: React 19.2.0
- **Build Tool**: Vite 7.2.4
- **Styling**: CSS3
- **Markdown Rendering**: react-markdown + remark-gfm
- **State Management**: React Hooks (useState, useRef, useEffect)

### Backend
- **Framework**: Flask (Python)
- **Language**: Python 3.10
- **PDF Processing**: PyPDF
- **HTTP Client**: Requests
- **CORS**: Flask-CORS

### AI/ML
- **LLM Platform**: Flowise (Visual LLM workflow builder)
- **AI Models**: nv-embed-v1, meta/llama-4-maverick-17b-128e-ir

### Deployment & DevOps
- **Containerization**: Docker
- **Orchestration**: Docker Compose
- **Web Server**: Nginx (Frontend)
- **Port Configuration**: Frontend (8080), Backend (5000), Flowise (3000)

---

## Prerequisites

### Required
- **Docker** (v20.10+) and **Docker Compose** (v1.29+)
- **Git** (for cloning the repository)
- Flowise server running or accessible

### Optional (For Local Development)
- **Node.js** (v16+) - For frontend development
- **Python 3.10+** - For backend development
- **npm** or **yarn** - For package management

---

## Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Arda78484/HygieAI-Core.git
cd HygieAI-Core
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory (optional for Docker):

```env
# Flowise Configuration
FLOWISE_API_URL=http://flowise:3000
TRIAGE_ID=8643a4dc-f0c8-43d9-bcdf-a8b3e2cffc23
ANALYSIS_ID=ed48d43e-4bc7-440d-9e6c-b69a377b28a4

# Frontend Configuration
VITE_API_BASE_URL=http://localhost:5000
```

### 3. Prepare Flowise

Ensure Flowise is running with your chatflows created and configured:
- **Triage Flow ID**: `8643a4dc-f0c8-43d9-bcdf-a8b3e2cffc23`
- **Analysis Flow ID**: `ed48d43e-4bc7-440d-9e6c-b69a377b28a4`

You can find the flow configurations in the `flow/` directory:
- `HygieAI_Triage Chatflow.json`
- `Dexter - Blood Analysis Chatflow.json`

---

## Running the Application

### Option 1: Docker Compose (Recommended)

```bash
# Start all services (Flowise, Backend, Frontend)
docker-compose -f docker/docker-compose.yml up -d

# View logs
docker-compose -f docker/docker-compose.yml logs -f

# Stop services
docker-compose -f docker/docker-compose.yml down
```

**Access the application:**
- Frontend: http://localhost:8080
- Backend API: http://localhost:5000
- Flowise UI: http://localhost:3000

### Option 2: Local Development

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

Access at: http://localhost:5173

#### Backend

```bash
cd src
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

Access at: http://localhost:5000

#### Flowise

```bash
# Install Flowise globally
npm install -g flowise

# Run Flowise
flowise start
```

Access at: http://localhost:3000

---

## Project Structure

```
HygieAI-Core/
├── docker/
│   ├── docker-compose.yml          # Docker Compose configuration
│   └── Dockerfile                  # Docker build instructions
│
├── frontend/                        # React Frontend Application
│   ├── src/
│   │   ├── App.jsx                 # Main application component
│   │   ├── App.css                 # Application styles
│   │   ├── main.jsx                # React entry point
│   │   ├── index.css               # Global styles
│   │   └── assets/                 # Static assets
│   ├── public/                     # Public assets (logo.svg, etc.)
│   ├── package.json                # Node dependencies
│   ├── vite.config.js              # Vite configuration
│   ├── eslint.config.js            # ESLint configuration
│   ├── nginx.conf                  # Nginx configuration
│   ├── Dockerfile                  # Frontend Docker image
│   └── index.html                  # HTML entry point
│
├── src/                            # Python Backend API
│   ├── app.py                      # Flask application
│   ├── requirements.txt            # Python dependencies
│   └── Dockerfile                  # Backend Docker image
│
├── src_old/                        # Legacy backend (deprecated)
│   ├── app.py
│   └── requirements.txt
│
├── flow/                           # Flowise Chatflow Exports
│   ├── HygieAI_Triage Chatflow.json
│   └── Dexter - Blood Analysis Chatflow.json
│
├── README.md                       # This file
├── LICENSE                         # MIT License
└── .gitignore                      # Git ignore rules
```

---

## API Documentation

### Base URL
- **Production**: http://localhost:5000 (or your deployed domain)
- **Development**: http://localhost:5000

### Endpoints

#### 1. Chat Proxy (Triage Module)

**POST** `/api/chat`

Send a message to the Triage chatflow.

**Request:**
```json
{
  "message": "I have a severe headache and fever"
}
```

**Response:**
```json
{
  "text": "Based on your symptoms, I recommend...",
  "sourceDocuments": []
}
```

**Error Response:**
```json
{
  "error": "Could not connect to Flowise: [error details]"
}
```

---

#### 2. Analysis Proxy (Blood Analysis Module)

**POST** `/api/analysis`

Send a message or medical text to the Analysis chatflow.

**Request:**
```json
{
  "message": "Hemoglobin: 15.2 g/dL, RBC: 4.8 million/µL..."
}
```

**Response:**
```json
{
  "text": "The blood analysis shows normal values for...",
  "analysis": "Detailed interpretation of the lab results"
}
```

---

#### 3. File Upload (PDF Analysis)

**POST** `/api/upload`

Upload and analyze a medical report PDF.

**Request:**
- Content-Type: `multipart/form-data`
- Parameter: `file` (PDF file)

**Response:**
```json
{
  "text": "Aşağıda hasta raporunun analizi bulunmaktadır...",
  "file_name": "report.pdf",
  "pages": 1
}
```

**Error Responses:**
```json
{
  "error": "No file part"
}
```

```json
{
  "error": "Could not extract text from PDF. It might be empty or scanned image."
}
```

---

## Usage Guide

### For End Users

1. **Access the Application**
   - Open http://localhost:8080 in your browser

2. **Select a Module**
   - Click "Blood Analysis" to upload medical reports
   - Click "Triage Assistant" to describe symptoms

3. **Blood Analysis Module**
   - Click the upload button (📄)
   - Select a PDF file with your medical report
   - AI will analyze and provide insights

4. **Triage Assistant**
   - Type your symptoms or health concern
   - Follow-up with more details as needed
   - Receive guidance on urgency level

5. **Language Selection**
   - Toggle between Turkish (TR) and English (EN) using the header switch

---

### For Developers

#### Adding a New Chatflow

1. Create chatflow in Flowise
2. Note the Flow ID
3. Update `docker-compose.yml` with new environment variables:
   ```yaml
   environment:
     - YOUR_NEW_FLOW_ID=<uuid>
   ```
4. Create new endpoint in `src/app.py`:
   ```python
   @app.route('/api/your-endpoint', methods=['POST'])
   def your_endpoint():
       frontend_data = request.json
       user_message = frontend_data.get('message')
       flowise_payload = {"question": user_message}
       response = requests.post(f"{BASE_API_URL}/api/v1/prediction/<flow-id>", json=flowise_payload)
       return jsonify(response.json())
   ```

#### Modifying Frontend

- **Add new component**: Create in `frontend/src/`
- **Update styles**: Modify `frontend/src/App.css`
- **Add translations**: Update `texts` objects in components

#### Extending Backend

- **Add new dependencies**: Update `src/requirements.txt`
- **Create new routes**: Add to `src/app.py`
- **Process new file types**: Extend `upload_proxy()` function

---

## Development

### Setting Up Development Environment

#### Frontend Development

```bash
cd frontend
npm install
npm run dev
```

The app will run on http://localhost:5173 with hot reload.

#### Backend Development

```bash
cd src
python -m venv venv

# On Windows
venv\Scripts\activate

# On macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
python app.py
```

#### Code Quality

```bash
# Run linting
cd frontend
npm run lint

# Format code (if eslint is configured)
npm run lint -- --fix
```

---

## Deployment

### Docker Deployment

#### Building Images

```bash
# Build frontend image
docker build -t hygieai-frontend ./frontend

# Build backend image
docker build -t hygieai-backend ./src

# Build everything with compose
docker-compose -f docker/docker-compose.yml build
```

#### Running in Production

```bash
# Start services
docker-compose -f docker/docker-compose.yml up -d

# Scale services
docker-compose -f docker/docker-compose.yml up -d --scale backend=2
```

### Cloud Deployment (AWS, Azure, GCP)

#### Using Docker Images

1. Push images to container registry (ECR, ACR, GCR)
2. Deploy with orchestration (ECS, AKS, GKE)
3. Configure environment variables for production Flowise
4. Set up DNS and SSL certificates
5. Configure load balancer if needed

#### Example for AWS ECS

```yaml
version: '3.8'
services:
  frontend:
    image: <your-registry>/hygieai-frontend:latest
    ports:
      - "80:80"
    environment:
      - BACKEND_URL=https://api.yourdomain.com

  backend:
    image: <your-registry>/hygieai-backend:latest
    ports:
      - "5000:5000"
    environment:
      - FLOWISE_API_URL=https://flowise.yourdomain.com
      - TRIAGE_ID=${TRIAGE_ID}
      - ANALYSIS_ID=${ANALYSIS_ID}

  flowise:
    image: flowiseai/flowise:latest
    ports:
      - "3000:3000"
    volumes:
      - flowise_data:/root/.flowise
```

---

## Configuration

### Environment Variables

#### Backend (`src/app.py`)

| Variable | Default | Description |
|----------|---------|-------------|
| `FLOWISE_API_URL` | `http://localhost:3000` | Flowise server URL |
| `TRIAGE_ID` | `8643a4dc-f0c8-43d9-bcdf-a8b3e2cffc23` | Triage flow ID |
| `ANALYSIS_ID` | `ed48d43e-4bc7-440d-9e6c-b69a377b28a4` | Analysis flow ID |

#### Frontend (Vite)

Update `frontend/vite.config.js`:

```javascript
export default {
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
}
```

### Docker Compose Configuration

Edit `docker/docker-compose.yml`:

```yaml
backend:
  environment:
    - FLOWISE_API_URL=http://flowise:3000
    - TRIAGE_ID=your-triage-id
    - ANALYSIS_ID=your-analysis-id
```

---

## Troubleshooting

### Common Issues

#### 1. "Could not connect to Flowise"

**Problem**: Backend cannot reach Flowise server

**Solutions**:
```bash
# Check if Flowise is running
curl http://localhost:3000

# Verify network connectivity
docker network ls
docker network inspect docker_default

# Check environment variables
docker-compose config | grep FLOWISE_API_URL
```

#### 2. PDF Upload Returns "Empty or Scanned Image"

**Problem**: PDF is image-based without OCR

**Solutions**:
- Use OCR processing (install pytesseract)
- Request text-based PDF
- Implement OCR in backend:

```python
from pytesseract import image_to_string
from pdf2image import convert_from_bytes

# Convert PDF images to text
images = convert_from_bytes(file.read())
text = '\n'.join([image_to_string(img) for img in images])
```

#### 3. CORS Errors in Frontend

**Problem**: Cross-Origin Resource Sharing blocked

**Solutions**:
- Verify CORS is enabled in Flask:
```python
from flask_cors import CORS
CORS(app)  # Already in place
```

- Check proxy configuration in vite.config.js

#### 4. Port Already in Use

**Problem**: Port 5000, 3000, or 8080 is already occupied

**Solutions**:
```bash
# Find process using port
lsof -i :5000  # macOS/Linux
netstat -ano | findstr :5000  # Windows

# Kill process
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows

# Or use different port
docker-compose -f docker/docker-compose.yml -p custom_project up
```

#### 5. Module Not Found Errors in Backend

**Problem**: Missing Python dependencies

**Solutions**:
```bash
# Reinstall dependencies
pip install --upgrade pip
pip install -r src/requirements.txt

# Or rebuild Docker image
docker-compose build --no-cache backend
```

#### 6. Frontend Build Fails

**Problem**: Node dependencies issue

**Solutions**:
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

## Performance Optimization

### Frontend Optimization
- **Code Splitting**: Implement lazy loading for modules
- **Image Optimization**: Use WebP format for assets
- **Caching**: Configure service workers
- **Minification**: Vite handles automatic minification

### Backend Optimization
- **Connection Pooling**: Use connection pools for Flowise
- **Caching**: Implement Redis caching for common responses
- **Rate Limiting**: Add rate limiting for APIs
- **Async Processing**: Use Celery for long-running tasks

### Database Optimization (if implemented)
- Index frequently queried fields
- Implement query result caching
- Use connection pooling

---

## Security Considerations

### Current Implementation
- ✅ CORS enabled for local development
- ✅ Error messages don't expose sensitive info
- ⚠️ No authentication/authorization (public access)
- ⚠️ No input validation (add in production)

### Recommended Security Enhancements
1. **Authentication**: Add JWT-based authentication
2. **Input Validation**: Validate all user inputs
3. **Rate Limiting**: Prevent API abuse
4. **HTTPS**: Use SSL/TLS in production
5. **API Keys**: Secure Flowise API endpoints
6. **Data Encryption**: Encrypt sensitive data at rest

### Implementation Example

```python
from flask import request
from functools import wraps
import jwt

def require_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({"error": "Missing token"}), 401
        try:
            data = jwt.decode(token, 'secret-key', algorithms=['HS256'])
        except:
            return jsonify({"error": "Invalid token"}), 401
        return f(*args, **kwargs)
    return decorated

@app.route('/api/chat', methods=['POST'])
@require_auth
def chat_proxy():
    # ... existing code
```

---

## Contributing

### Guidelines
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style
- Follow PEP 8 for Python
- Use ESLint configuration for JavaScript
- Add comments for complex logic
- Update documentation for new features

---

## Roadmap

### Planned Features
- [ ] User authentication and profiles
- [ ] Chat history persistence
- [ ] Multiple file format support (DOCX, XLSX, TXT)
- [ ] Real-time notifications
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Integration with EHR systems
- [ ] Multi-language support expansion
- [ ] Offline mode capability
- [ ] Voice input/output support

### Known Limitations
- No persistent chat history
- Single Flowise instance (not load-balanced)
- Limited to PDF files (text-based)
- No user management
- No audit logging

---

## Support & Contact

### Resources
- **Documentation**: This README
- **Issues**: GitHub Issues
- **Discussions**: GitHub Discussions

### Contact
- **Project Lead**: ARDA ÇAM
- **Repository**: https://github.com/Arda78484/HygieAI-Core

---

## License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

### MIT License Summary
- ✅ Commercial use
- ✅ Modification
- ✅ Distribution
- ✅ Private use
- ❌ Liability
- ❌ Warranty

---

## Acknowledgments

- **Flowise**: Visual LLM workflow builder
- **React**: Frontend framework
- **Flask**: Backend framework
- **PyPDF**: PDF processing library
- **Docker**: Containerization platform

---

## FAQ

**Q: Can I use this with different AI models?**
A: Yes! Flowise supports multiple AI providers (OpenAI, Claude, LLaMA, etc.). Configure in Flowise UI.

**Q: How do I customize the chatflows?**
A: Edit the JSON files in the `flow/` directory or use Flowise UI to create new chatflows.

**Q: Is there a database?**
A: Currently, the app is stateless. Add a database (PostgreSQL, MongoDB) as needed.

**Q: How do I deploy to production?**
A: Use Docker images, push to cloud registry, and deploy with Kubernetes or cloud-native services.

**Q: Can I add more languages?**
A: Yes! Add language keys to the `texts` objects in React components.

**Q: What are the minimum system requirements?**
A: 2GB RAM, 2GB disk space, modern browser, Docker installed.

---

**Last Updated**: December 2025  
**Version**: 1.0.0  
**Status**: Active Development
