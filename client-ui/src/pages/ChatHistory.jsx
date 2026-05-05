import { useEffect, useState } from 'react';
import api from '../api/axios.js';
import Alert from '../components/ui/Alert.jsx';
// import api from '../api/axios.js';

import { getChatHistory } from '../api/chat.js';
import EmptyState from '../components/ui/EmptyState.jsx';
import Loader from '../components/ui/Loader.jsx';
import PageHeader from '../components/ui/PageHeader.jsx';
import { formatDate } from '../utils/format.js';

export default function ChatHistory() {
  const [chats, setChats] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // api.get('/api/chat/history')
     getChatHistory()
      .then(({ data }) => setChats(data.chats || data.history || data || []))
      .catch((err) => setError(err.response?.data?.message || 'Unable to load chat history.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <PageHeader title="Chat History" description="Open previous AI career counselling conversations." />
      {loading ? <Loader /> : error ? <Alert>{error}</Alert> : chats.length === 0 ? <EmptyState title="No chats yet" description="Start a chatbot conversation to create history." /> : (
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-3">
            {chats.map((chat, index) => (
              <button key={chat._id || chat.id || index} className="surface block w-full p-4 text-left transition hover:-translate-y-0.5" onClick={() => setSelected(chat)}>
                <p className="font-semibold">{chat.title || chat.prompt || chat.message || `Conversation ${index + 1}`}</p>
                <p className="mt-1 text-sm text-zinc-500">{formatDate(chat.createdAt || chat.date)}</p>
              </button>
            ))}
          </div>
          <div className="surface min-h-80 p-5">
            {!selected ? <p className="text-sm text-zinc-500">Select a conversation to reopen it.</p> : (
              <div className="space-y-3">
                {(selected.messages || selected.conversation || [selected]).map((message, index) => (
                  <div key={index} className={`rounded-lg p-3 text-sm ${message.role === 'user' ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950' : 'bg-zinc-100 dark:bg-zinc-800'}`}>
                    {message.content || message.message || message.reply || JSON.stringify(message)}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
