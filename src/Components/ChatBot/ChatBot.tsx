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

const SUGGESTIONS = [
  'What are his hobbies?',
  'Can you describe his personality?',
];

const ChatBot: React.FC = () => {
  const [input, setInput] = useState('');
  const [chat, setChat] = useState<Message[]>([]);
  const [open, setOpen] = useState(false);
  const [typing, setTyping] = useState(false);
  const typingRef = useRef<NodeJS.Timeout | null>(null);
  const botIndexRef = useRef<number | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const [showHint, setShowHint] = useState(false);
  const hintIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const hintCountRef = useRef(0);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  const API_URL = process.env.REACT_APP_CHATBOT_API!;

  useEffect(() => {
    const showHintOnce = () => {
      if (hintCountRef.current >= 5) return;
      setShowHint(true);
      hintCountRef.current += 1;
      setTimeout(() => setShowHint(false), 7000);
      if (hintCountRef.current >= 5 && hintIntervalRef.current) {
        clearInterval(hintIntervalRef.current);
        hintIntervalRef.current = null;
      }
    };

    const initialDelay = setTimeout(() => {
      showHintOnce();
      const interval = setInterval(showHintOnce, 30000);
      hintIntervalRef.current = interval;
    }, 15000);

    return () => {
      clearTimeout(initialDelay);
      if (hintIntervalRef.current) clearInterval(hintIntervalRef.current);
    };
  }, []);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat, typing]);

  useEffect(() => {
    return () => {
      if (typingRef.current) clearInterval(typingRef.current);
    };
  }, []);

  useEffect(() => {
    if (open && chat.length === 0) {
      setChat([
        {
          sender: 'bot',
          text: "👋 Hi! I'm an AI bot. Ask me anything about Mohammed, and I might also surprise you with related suggestions!",
          final: true,
        },
      ]);
    }
  }, [open]);

  const toggleChat = () => setOpen((prev) => !prev);

  const askBot = async (customMessage?: string) => {
    const messageToSend = customMessage || input.trim();
    if (!messageToSend || typing) return;

    setChat((prev) => [...prev, { sender: 'user', text: messageToSend }]);
    setInput('');
    setTyping(true);

    const botIndex = chat.length + 1;
    botIndexRef.current = botIndex;

    setChat((prev) => [
      ...prev,
      {
        sender: 'bot',
        text: '🤖 Thinking..., I am a slow thinker.',
        final: false,
      },
    ]);

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: messageToSend }),
      });

      const data = await res.json();
      const reply = data.reply || 'No response received.';

      if (
        reply[0].includes('Chat generation failed') ||
        reply[0].includes('402 Client Error')
      ) {
        reply[0] =
          'Oops! It appears that I am under maintenance, please try again later.';
      }

      let charIndex = 0;
      if (typingRef.current) clearInterval(typingRef.current);

      typingRef.current = setInterval(() => {
        if (charIndex >= reply.length) {
          clearInterval(typingRef.current!);
          typingRef.current = null;
          setChat((prev) => {
            const updated = [...prev];
            const currentBotMsg = updated[botIndex];
            if (currentBotMsg)
              updated[botIndex] = { ...currentBotMsg, final: true };
            return updated;
          });
          setTyping(false);
          return;
        }

        const char = reply[charIndex++];
        setChat((prev) => {
          const updated = [...prev];
          const currentBotMsg = updated[botIndex];
          if (currentBotMsg) {
            const isThinking = currentBotMsg.text.startsWith('🤖 Thinking');
            updated[botIndex] = {
              ...currentBotMsg,
              text: isThinking ? char : currentBotMsg.text + char,
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

  useEffect(() => {
    if (open && inputRef.current && !typing) {
      inputRef.current.focus();
    }
  }, [open, typing]);

  return (
    <>
      {showHint && (
        <div className='chatbot-helper-bubble'>
          💡 Hi! I'm your assistant. Ask me anything about Mohammed.
        </div>
      )}

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

          {chat.length === 1 && chat[0].sender === 'bot' && (
            <div className='chat-suggestions-inbox'>
              {SUGGESTIONS.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => askBot(suggestion)}
                  disabled={typing}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        <div className='chat-input'>
          <textarea
            ref={inputRef}
            rows={2}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder='Ask me anything about Mohammed...'
            disabled={typing}
          />
          <div className='chat-buttons'>
            <button onClick={() => askBot()} disabled={typing}>
              {typing ? '...' : 'Send'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatBot;
