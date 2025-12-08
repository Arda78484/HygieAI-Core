import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './App.css';

// --- SVGs for Icons ---
// This component now uses your logo.svg file
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

// --- Component: Header ---
// Updated to use both logo.svg and hygieai-white.svg
const Header = ({ language, onToggleLanguage }) => (
  <header className="header">
    <div className="header-left">
      <Logo size={32} />
      <img src="/hygieai-white.svg" alt="HygieAI" className="logo-text-img" />
    </div>
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

// --- Component: Landing Page ---
const LandingPage = ({ onStartChat, language }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) onStartChat(input);
  };

  const texts = {
    en: {
      title: "How may I help you today?",
      subtitle: "Type out your problem and we will diagnose it for you.",
      placeholder: "Enter your prompt here."
    },
    tr: {
      title: "Bugün size nasıl yardımcı olabilirim?",
      subtitle: "Sorununuzu yazın, sizin için teşhis edelim.",
      placeholder: "Şikayetinizi buraya yazın."
    }
  };

  const t = texts[language];

  return (
    <div className="landing-container">
      <div className="landing-content">
        <div style={{ margin: '0 auto', width: 'fit-content' }}>
            <Logo size={80} />
        </div>
        <h1 className="landing-title">{t.title}</h1>
        <p className="landing-subtitle">{t.subtitle}</p>
        
        <form onSubmit={handleSubmit} className="input-wrapper">
          <input 
            className="main-input"
            placeholder={t.placeholder}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            autoFocus
          />
          <button type="submit" className="send-btn">
            <ArrowIcon />
          </button>
        </form>
      </div>
    </div>
  );
};

// --- Component: Chat Interface ---
const ChatInterface = ({ messages, isLoading, onSendMessage, language }) => {
  const [input, setInput] = useState('');
  const endOfChatRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input);
      setInput('');
    }
  };

  const texts = {
    en: {
      thinking: "Thinking...",
      reply: "Reply...",
      error: "Sorry, I'm having trouble connecting to the server."
    },
    tr: {
      thinking: "Düşünüyor...",
      reply: "Yanıtla...",
      error: "Üzgünüm, sunucuya bağlanırken bir sorun yaşadım."
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
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState('en'); // 'en' | 'tr'

  const handleSendMessage = async (userMessage) => {
    if (view === 'home') setView('chat');
    
    const newHistory = [...messages, { type: 'user', text: userMessage }];
    setMessages(newHistory);
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json();
      console.log("RAW RESPONSE FROM BACKEND:", JSON.stringify(data, null, 2));
      
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

  return (
    <div className="app-container">
      <Header language={language} onToggleLanguage={setLanguage} />
      {view === 'home' ? (
        <LandingPage onStartChat={handleSendMessage} language={language} />
      ) : (
        <ChatInterface 
          messages={messages} 
          isLoading={loading} 
          onSendMessage={handleSendMessage} 
          language={language}
        />
      )}
    </div>
  );
}

export default App;
