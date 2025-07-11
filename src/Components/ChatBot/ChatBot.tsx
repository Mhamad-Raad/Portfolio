import { useState } from 'react';
import './ChatBot.scss';

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
      <button className='chat-launcher' onClick={toggleChat}>
        {open ? '✖' : '💬'}
      </button>

      <div className={`chat-container ${open ? 'open' : ''}`}>
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
