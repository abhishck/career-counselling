import { BarChart3, FileText, MessageSquare, Edit2, Save, X, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import api from '../api/axios.js';
import Alert from '../components/ui/Alert.jsx';
import Loader from '../components/ui/Loader.jsx';
import PageHeader from '../components/ui/PageHeader.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function Profile() {
  const { user, refreshProfile, logout } = useAuth();
  const [profile, setProfile] = useState(user);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  
  // Real-time stats state
  const [stats, setStats] = useState({ testsTaken: 0, chats: 0, resumeUploads: 0 });

  useEffect(() => {
    const loadProfileData = async () => {
      setLoading(true);
      setError('');

      // 1. Refresh Profile
      try {
        await refreshProfile().then(setProfile);
      } catch (err) {
        console.error("Profile load error:", err);
        setError(prev => prev + " Could not load profile.");
      }

      // 2. Fetch Stats
      try {
        const res = await api.get('/api/user/stats');
        setStats(res.data);
      } catch (err) {
        console.error("Stats load error:", err);
        setError(prev => prev + " Could not load stats.");
      }

      setLoading(false);
    };
    loadProfileData();
  }, []);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setFormData({ name: profile?.name || '', email: profile?.email || '', password: '' });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put('/api/user/profile', formData);
      await refreshProfile(); 
      setIsEditing(false);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.');
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure? This action cannot be undone.")) {
      try {
        await api.delete('/api/user/profile');
        logout();
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete account.');
      }
    }
  };

  if (loading) return <Loader />;

  return (
    <>
      <PageHeader title="Profile" description="Manage your account details and view activity." />
      
      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <section className="surface p-6">
          {error && <div className="mb-4"><Alert>{error}</Alert></div>}
          
          <div className="flex justify-between items-start">
            <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-teal-50 text-2xl font-bold text-teal-700 dark:bg-teal-950 dark:text-teal-200">
              {(profile?.name || profile?.email || 'U').charAt(0).toUpperCase()}
            </div>
            {!isEditing && (
              <button onClick={handleEditToggle} className="text-zinc-500 hover:text-teal-600 transition">
                <Edit2 size={20} />
              </button>
            )}
          </div>

          {isEditing ? (
            <form onSubmit={handleUpdate} className="mt-5 space-y-3">
              <input className="w-full p-2 border rounded" type="text" placeholder="Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
              <input className="w-full p-2 border rounded" type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
              <input className="w-full p-2 border rounded" type="password" placeholder="New password (optional)" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex items-center gap-2 btn-primary"><Save size={16} /> Save</button>
                <button type="button" onClick={handleEditToggle} className="btn-secondary"><X size={16} /></button>
              </div>
            </form>
          ) : (
            <div className="mt-5">
              <h2 className="text-xl font-bold">{profile?.name}</h2>
              <p className="text-sm text-zinc-500">{profile?.email}</p>
              {profile?.careerGoal && <p className="mt-5 rounded-lg bg-zinc-100 p-4 text-sm dark:bg-zinc-800">{profile.careerGoal}</p>}
              
              <button onClick={handleDelete} className="mt-6 flex items-center gap-2 text-sm text-red-600 hover:text-red-700">
                <Trash2 size={16} /> Delete Account
              </button>
            </div>
          )}
        </section>

        <section className="grid gap-4 sm:grid-cols-3 h-fit">
          <div className="surface p-5">
            <BarChart3 className="text-teal-600 dark:text-teal-300" size={22} />
            <p className="mt-5 text-3xl font-bold">{stats.testsTaken}</p>
            <p className="mt-1 text-sm text-zinc-500">Tests taken</p>
          </div>
          <div className="surface p-5">
            <MessageSquare className="text-teal-600 dark:text-teal-300" size={22} />
            <p className="mt-5 text-3xl font-bold">{stats.chats}</p>
            <p className="mt-1 text-sm text-zinc-500">Chats</p>
          </div>
          <div className="surface p-5">
            <FileText className="text-teal-600 dark:text-teal-300" size={22} />
            <p className="mt-5 text-3xl font-bold">{stats.resumeUploads}</p>
            <p className="mt-1 text-sm text-zinc-500">Resume uploads</p>
          </div>
        </section>
      </div>
    </>
  );
}