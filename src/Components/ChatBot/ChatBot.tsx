import { useState, useEffect, useRef } from 'react';
import './ChatBot.scss';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import GhostModel from './GhostModel';

type Message = {
  sender: 'user' | 'bot';
  text: string;
  final?: boolean;
};

const ChatBot: React.FC = () => {
  const [input, setInput] = useState('');
  const [chat, setChat] = useState<Message[]>([]);
  const [open, setOpen] = useState(false);
  const [typing, setTyping] = useState(false);
  const typingRef = useRef<NodeJS.Timeout | null>(null);
  const botIndexRef = useRef<number | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat, typing]);

  // Clean up intervals on unmount
  useEffect(() => {
    return () => {
      if (typingRef.current) {
        clearInterval(typingRef.current);
      }
    };
  }, []);

  const toggleChat = () => setOpen((prev) => !prev);

  const askBot = async () => {
    const trimmed = input.trim();
    if (!trimmed || typing) return;

    setChat((prev) => [...prev, { sender: 'user', text: trimmed }]);
    setInput('');
    setTyping(true);

    try {
      const res = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed }),
      });

      const data = await res.json();
      const reply = data.reply || 'No response received.';
      const botIndex = chat.length + 1;
      botIndexRef.current = botIndex;

      setChat((prev) => [...prev, { sender: 'bot', text: '', final: false }]);

      let charIndex = 0;

      if (typingRef.current) {
        clearInterval(typingRef.current);
      }

      typingRef.current = setInterval(() => {
        if (charIndex >= reply.length) {
          if (typingRef.current) {
            clearInterval(typingRef.current);
            typingRef.current = null;
          }
          setChat((prev) => {
            const updated = [...prev];
            const currentBotMsg = updated[botIndex];
            if (currentBotMsg) {
              updated[botIndex] = {
                ...currentBotMsg,
                final: true,
              };
            }
            return updated;
          });
          setTyping(false);
          return;
        }

        const char = reply[charIndex];
        charIndex++;

        setChat((prev) => {
          const updated = [...prev];
          const currentBotMsg = updated[botIndex];
          if (currentBotMsg) {
            updated[botIndex] = {
              ...currentBotMsg,
              text: currentBotMsg.text + char,
            };
          }
          return updated;
        });
      }, 30);
    } catch (error) {
      console.error(error);
      setChat((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: 'Oops! Something went wrong.',
          final: true,
        },
      ]);
      setTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      askBot();
    }
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
              {msg.sender === 'bot' && !msg.final && (
                <span className='typing-cursor'>|</span>
              )}
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        <div className='chat-input'>
          <textarea
            rows={2}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder='Ask me anything about Mohammed...'
            disabled={typing}
          />
          <div className='chat-buttons'>
            <button onClick={askBot} disabled={typing}>
              {typing ? '...' : 'Send'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatBot;
