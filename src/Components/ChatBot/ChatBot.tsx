import { useState } from 'react';

const ChatBot: React.FC = () => {
  const [input, setInput] = useState<string>('');
  const [response, setResponse] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const askBot = async () => {
    if (!input.trim()) return;

    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();
      setResponse(data.reply || 'No response received.');
    } catch (error) {
      console.error(error);
      setResponse('Error communicating with the chatbot.');
    }

    setLoading(false);
  };

  return (
    <div className='chat-container' style={{ maxWidth: 500, margin: 'auto' }}>
      <textarea
        rows={3}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder='Ask me anything about Mohammed...'
        style={{ width: '100%', marginBottom: 8 }}
      />
      <button onClick={askBot} disabled={loading}>
        {loading ? 'Thinking...' : 'Ask'}
      </button>
      <div className='bot-response' style={{ marginTop: 16 }}>
        <strong>Bot:</strong> {response}
      </div>
    </div>
  );
};

export default ChatBot;
