import { Send } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import api from '../api/axios.js';
import Alert from '../components/ui/Alert.jsx';
import PageHeader from '../components/ui/PageHeader.jsx';
import { sendChatMessage } from '../api/chat.js';

export default function Chatbot() {
  const [messages, setMessages] = useState([{ role: 'assistant', content: 'What career decision are you thinking through today?' }]);
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Ref to track the scrollable container
  const scrollRef = useRef(null);

  // Auto-scroll to bottom when messages change or loading state changes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const send = async (event) => {
    event.preventDefault();
    const prompt = input.trim();
    if (!prompt) return;
    
    const nextMessages = [...messages, { role: 'user', content: prompt }];
    setMessages(nextMessages);
    setInput('');
    setLoading(true);
    setError('');
    
    try {
      const { data } = await sendChatMessage(prompt, nextMessages);
      setMessages([...nextMessages, { role: 'assistant', content: data.reply || data.response || data.message || 'I saved your question, but no reply was returned.' }]);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to send message.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHeader title="AI Career Chatbot" description="Ask career questions and keep the conversation tied to your profile." />
      <section className="surface flex h-[72vh] flex-col overflow-hidden">
        {/* Added ref={scrollRef} here to control scrolling */}
        <div className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-6" ref={scrollRef}>
          {error && <Alert>{error}</Alert>}
          
          {messages.map((message, index) => (
            <div key={`${message.role}-${index}`} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[86%] rounded-lg px-4 py-3 text-sm leading-6 sm:max-w-[70%] ${message.role === 'user' ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950' : 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-100'}`}>
                {message.content}
              </div>
            </div>
          ))}

          {/* Typing Indicator / Loader */}
          {loading && (
            <div className="flex justify-start">
              <div className="flex gap-1 rounded-lg bg-zinc-100 px-4 py-3 text-sm leading-6 dark:bg-zinc-800">
                <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-400 [animation-delay:-0.3s]"></span>
                <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-400 [animation-delay:-0.15s]"></span>
                <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-400"></span>
              </div>
            </div>
          )}
        </div>
        
        <form onSubmit={send} className="flex gap-3 border-t border-zinc-200 p-4 dark:border-zinc-800">
          <input 
            className="input" 
            placeholder="Type your career question..." 
            value={input} 
            onChange={(e) => setInput(e.target.value)} 
            disabled={loading} 
          />
          <button className="btn-primary px-3" disabled={loading} aria-label="Send message">
            <Send size={18} />
          </button>
        </form>
      </section>
    </>
  );
}