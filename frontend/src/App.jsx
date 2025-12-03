import React, { useState, useRef, useEffect } from 'react';
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
const Header = () => (
  <header className="header">
    <Logo size={32} />
    <img src="/hygieai-white.svg" alt="HygieAI" className="logo-text-img" />
  </header>
);

// --- Component: Landing Page ---
const LandingPage = ({ onStartChat }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) onStartChat(input);
  };

  return (
    <div className="landing-container">
      <div className="landing-content">
        <div style={{ margin: '0 auto', width: 'fit-content' }}>
            <Logo size={80} />
        </div>
        <h1 className="landing-title">How may I help you today?</h1>
        <p className="landing-subtitle">Type out your problem and we will diagnose it for you.</p>
        
        <form onSubmit={handleSubmit} className="input-wrapper">
          <input 
            className="main-input"
            placeholder="Enter your prompt here."
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
const ChatInterface = ({ messages, isLoading, onSendMessage }) => {
  const [input, setInput] = useState('');
  const endOfChatRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input);
      setInput('');
    }
  };

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
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
            <div className="message-row bot">
                 <div className="bot-icon"><Logo size={28} /></div>
                 <div className="bubble bot">Thinking...</div>
            </div>
        )}
        <div ref={endOfChatRef} />
      </div>

      <div className="chat-footer">
        <form onSubmit={handleSubmit} className="input-wrapper">
          <input 
            className="main-input"
            placeholder="Reply..."
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

  const handleSendMessage = async (userMessage) => {
    if (view === 'home') setView('chat');
    
    const newHistory = [...messages, { type: 'user', text: userMessage }];
    setMessages(newHistory);
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json();
      console.log("RAW RESPONSE FROM BACKEND:", JSON.stringify(data, null, 2));
      
      const botText = typeof data === 'string' ? data : (data.text || data.response || JSON.stringify(data));
      
      setMessages(prev => [...prev, { type: 'bot', text: botText }]);
    } catch (error) {
      setMessages(prev => [...prev, { type: 'bot', text: "Sorry, I'm having trouble connecting to the server." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <Header />
      {view === 'home' ? (
        <LandingPage onStartChat={handleSendMessage} />
      ) : (
        <ChatInterface 
          messages={messages} 
          isLoading={loading} 
          onSendMessage={handleSendMessage} 
        />
      )}
    </div>
  );
}

export default App;
