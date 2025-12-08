import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './App.css';

// --- SVGs for Icons ---
const Logo = ({ size = 24 }) => (
  <img 
    src="/logo.svg" 
    alt="HygieAI Logo" 
    width={size} 
    height={size} 
  />
);

const ArrowIcon = () => (
  <img
    src="/arrow.svg"
    alt="Send"
    className="send-arrow-icon"	
  />
);

const UploadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="17 8 12 3 7 8"></polyline>
    <line x1="12" y1="3" x2="12" y2="15"></line>
  </svg>
);

const AnalysisIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <polyline points="10 9 9 9 8 9"></polyline>
  </svg>
);

const TriageIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
  </svg>
);

// --- Component: Header ---
const Header = ({ language, onToggleLanguage, activeModule, onModuleChange }) => (
  <header className="header">
    <div className="header-left">
      <Logo size={32} />
      <img src="/hygieai-white.svg" alt="HygieAI" className="logo-text-img" />
    </div>
    
    {activeModule && (
      <div className="module-tabs">
        <button 
          className={`module-tab ${activeModule === 'analysis' ? 'active' : ''}`}
          onClick={() => onModuleChange('analysis')}
        >
          {language === 'en' ? 'Blood Analysis' : 'Kan Analizi'}
        </button>
        <button 
          className={`module-tab ${activeModule === 'triage' ? 'active' : ''}`}
          onClick={() => onModuleChange('triage')}
        >
          {language === 'en' ? 'Triage Assistant' : 'Triyaj Asistanı'}
        </button>
      </div>
    )}

    <div className="header-right">
      <div className="language-switch">
        <span className={`lang-label ${language === 'tr' ? 'active' : ''}`}>TR</span>
        <label className="switch">
          <input 
            type="checkbox" 
            checked={language === 'en'} 
            onChange={() => onToggleLanguage(language === 'tr' ? 'en' : 'tr')} 
          />
          <span className="slider round"></span>
        </label>
        <span className={`lang-label ${language === 'en' ? 'active' : ''}`}>EN</span>
      </div>
    </div>
  </header>
);

// --- Component: Module Selection (Landing Page) ---
const ModuleSelection = ({ onSelectModule, language }) => {
  const texts = {
    en: {
      title: "How may I help you today?",
      subtitle: "Select a service to proceed.",
      analysisTitle: "Blood Analysis",
      analysisDesc: "Upload your reports and get detailed insights.",
      triageTitle: "Triage Assistant",
      triageDesc: "Describe your symptoms for quick guidance."
    },
    tr: {
      title: "Bugün size nasıl yardımcı olabilirim?",
      subtitle: "Devam etmek için bir hizmet seçin.",
      analysisTitle: "Kan Analizi",
      analysisDesc: "Raporlarınızı yükleyin ve detaylı bilgi alın.",
      triageTitle: "Triyaj Asistanı",
      triageDesc: "Hızlı yönlendirme için şikayetlerinizi anlatın."
    }
  };

  const t = texts[language];

  return (
    <div className="landing-container">
      <div className="landing-content">
        <div style={{ margin: '0 auto 2rem', width: 'fit-content' }}>
            <Logo size={80} />
        </div>
        <h1 className="landing-title">{t.title}</h1>
        <p className="landing-subtitle">{t.subtitle}</p>
        
        <div className="module-cards">
          <div className="module-card" onClick={() => onSelectModule('analysis')}>
            <div className="card-icon"><AnalysisIcon /></div>
            <h3>{t.analysisTitle}</h3>
            <p>{t.analysisDesc}</p>
          </div>
          <div className="module-card" onClick={() => onSelectModule('triage')}>
            <div className="card-icon"><TriageIcon /></div>
            <h3>{t.triageTitle}</h3>
            <p>{t.triageDesc}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Component: Chat Interface ---
const ChatInterface = ({ messages, isLoading, onSendMessage, language, activeModule, onFileUpload }) => {
  const [input, setInput] = useState('');
  const endOfChatRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input);
      setInput('');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onFileUpload(file);
    }
  };

  const texts = {
    en: {
      thinking: "Thinking...",
      reply: "Reply...",
      upload: "Upload PDF"
    },
    tr: {
      thinking: "Düşünüyor...",
      reply: "Yanıtla...",
      upload: "PDF Yükle"
    }
  };

  const t = texts[language];

  useEffect(() => {
    endOfChatRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="chat-container">
      <div className="chat-history">
        {messages.map((msg, index) => (
          <div key={index} className={`message-row ${msg.type}`}>
            {msg.type === 'bot' && (
              <div className="bot-icon">
                <Logo size={28} />
              </div>
            )}
            <div className={`bubble ${msg.type}`}>
              {msg.type === 'bot' ? (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {msg.text}
                </ReactMarkdown>
              ) : (
                msg.text
              )}
              {msg.file && (
                <div className="file-attachment">
                  📄 {msg.file.name}
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
            <div className="message-row bot">
                 <div className="bot-icon"><Logo size={28} /></div>
                 <div className="bubble bot">{t.thinking}</div>
            </div>
        )}
        <div ref={endOfChatRef} />
      </div>

      <div className="chat-footer">
        <form onSubmit={handleSubmit} className="input-wrapper">
          {activeModule === 'analysis' && (
            <>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                style={{ display: 'none' }} 
                accept=".pdf"
              />
              <button 
                type="button" 
                className="upload-btn" 
                onClick={() => fileInputRef.current.click()}
                title={t.upload}
                disabled={isLoading}
              >
                <UploadIcon />
              </button>
            </>
          )}
          <input 
            className="main-input"
            placeholder={t.reply}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
          />
          <button type="submit" className="send-btn" disabled={isLoading}>
            <ArrowIcon />
          </button>
        </form>
      </div>
    </div>
  );
};


// --- Main App Controller ---
function App() {
  const [view, setView] = useState('home'); // 'home' | 'chat'
  const [activeModule, setActiveModule] = useState(null); // 'analysis' | 'triage'
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState('en'); // 'en' | 'tr'

  // Reset chat when module changes
  const handleModuleChange = (module) => {
    if (module !== activeModule) {
      setActiveModule(module);
      setMessages([]); // Clear history for new module
      setView('chat');
    }
  };

  const handleSelectModule = (module) => {
    setActiveModule(module);
    setView('chat');
  };

  const handleSendMessage = async (userMessage) => {
    const newHistory = [...messages, { type: 'user', text: userMessage }];
    setMessages(newHistory);
    setLoading(true);

    try {
      const endpoint = activeModule === 'analysis' ? '/api/analysis' : '/api/chat';
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json();
      const botText = typeof data === 'string' ? data : (data.text || data.response || JSON.stringify(data));
      
      setMessages(prev => [...prev, { type: 'bot', text: botText }]);
    } catch (error) {
      const errorMsg = language === 'en' 
        ? "Sorry, I'm having trouble connecting to the server." 
        : "Üzgünüm, sunucuya bağlanırken bir sorun yaşadım.";
      setMessages(prev => [...prev, { type: 'bot', text: errorMsg }]);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file) => {
    const newHistory = [...messages, { type: 'user', text: `Uploaded: ${file.name}`, file: file }];
    setMessages(newHistory);
    setLoading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      const botText = typeof data === 'string' ? data : (data.text || data.response || JSON.stringify(data));
      
      setMessages(prev => [...prev, { type: 'bot', text: botText }]);
    } catch (error) {
      const errorMsg = language === 'en' 
        ? "Sorry, failed to upload file." 
        : "Üzgünüm, dosya yüklenemedi.";
      setMessages(prev => [...prev, { type: 'bot', text: errorMsg }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <Header 
        language={language} 
        onToggleLanguage={setLanguage} 
        activeModule={activeModule}
        onModuleChange={handleModuleChange}
      />
      {view === 'home' ? (
        <ModuleSelection onSelectModule={handleSelectModule} language={language} />
      ) : (
        <ChatInterface 
          messages={messages} 
          isLoading={loading} 
          onSendMessage={handleSendMessage} 
          language={language}
          activeModule={activeModule}
          onFileUpload={handleFileUpload}
        />
      )}
    </div>
  );
}

export default App;
