import { useState } from 'react';
import './ChatBot.scss';

import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import GhostModel from './GhostModel';

type Message = {
  sender: 'user' | 'bot';
  text: string;
};

const ChatBot: React.FC = () => {
  const [input, setInput] = useState('');
  const [chat, setChat] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const toggleChat = () => setOpen((prev) => !prev);

  const askBot = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    setChat((prev) => [...prev, { sender: 'user', text: trimmed }]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed }),
      });

      const data = await res.json();
      const reply = data.reply || 'No response received.';

      setChat((prev) => [...prev, { sender: 'bot', text: reply }]);
    } catch (err) {
      console.error(err);
      setChat((prev) => [
        ...prev,
        { sender: 'bot', text: 'Error communicating with the chatbot.' },
      ]);
    }

    setLoading(false);
  };

  return (
    <>
      <div className='chatbot-launcher' onClick={toggleChat}>
        <Canvas camera={{ position: [0, 0, 1.8], fov: 25 }}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[1, 2, 1]} intensity={1} />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            enableRotate={false}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 2}
          />
          <GhostModel />
        </Canvas>
      </div>

      <div className={`chat-container ${open ? 'open' : ''}`}>
        <button className='chat-close' onClick={toggleChat}>
          ✖
        </button>

        <div className='chat-box'>
          {chat.map((msg, i) => (
            <div key={i} className={`chat-bubble ${msg.sender}`}>
              {msg.text}
            </div>
          ))}
          {loading && (
            <div className='chat-bubble bot loading'>Bot is typing...</div>
          )}
        </div>

        <div className='chat-input'>
          <textarea
            rows={2}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='Ask me anything about Mohammed...'
          />
          <button onClick={askBot} disabled={loading}>
            {loading ? '...' : 'Send'}
          </button>
        </div>
      </div>
    </>
  );
};

export default ChatBot;
