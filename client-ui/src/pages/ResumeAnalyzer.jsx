import { UploadCloud, Loader2 } from 'lucide-react';
import { useState } from 'react';
import api from '../api/axios.js';
import Alert from '../components/ui/Alert.jsx';
import PageHeader from '../components/ui/PageHeader.jsx';
import { asList } from '../utils/format.js';

export default function ResumeAnalyzer() {
  const [file, setFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (selected && selected.type !== 'application/pdf') {
      setError('Please select a valid PDF file.');
      setFile(null);
    } else {
      setFile(selected || null);
      setError('');
    }
  };

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    if (!file) return setError('Please upload a PDF resume.');
    
    const formData = new FormData();
    formData.append('resume', file);
    
    setLoading(true);
    setAnalysis(null); // Clear previous analysis
    
    try {
      const { data } = await api.post('/api/resume/analyze', formData, { 
        headers: { 'Content-Type': 'multipart/form-data' } 
      });
      setAnalysis(data.analysis || data.result || data);
    } catch (err) {
      setError(err.response?.data?.message || 'Resume analysis failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHeader title="Resume Analyzer" description="Upload a PDF resume and receive structured AI feedback." />
      <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <form onSubmit={submit} className="surface p-6">
          {error && <div className="mb-4"><Alert>{error}</Alert></div>}
          <label className="grid cursor-pointer place-items-center rounded-lg border-2 border-dashed border-zinc-300 px-6 py-12 text-center transition hover:border-teal-500 dark:border-zinc-700">
            <UploadCloud className="mb-3 text-teal-600" size={32} />
            <span className="font-semibold truncate max-w-[200px]">{file?.name || 'Select PDF resume'}</span>
            <span className="mt-1 text-sm text-zinc-500">PDF files only</span>
            <input hidden type="file" accept="application/pdf" onChange={handleFileChange} />
          </label>
          <button className="btn-primary mt-5 w-full" disabled={loading}>
            {loading ? 'Analyzing...' : 'Analyze resume'}
          </button>
        </form>

        <div className="surface p-6">
          <h2 className="font-semibold">AI response</h2>
          
          {loading ? (
            <div className="mt-8 flex flex-col items-center justify-center space-y-3 text-zinc-500">
              <Loader2 className="animate-spin" size={32} />
              <p className="text-sm">Reading your experience...</p>
            </div>
          ) : !analysis ? (
            <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">Your analysis will appear here after upload.</p>
          ) : typeof analysis === 'string' ? (
            <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-zinc-700 dark:text-zinc-300">{analysis}</p>
          ) : (
            <div className="mt-4 space-y-5">
              {/* Added safety check for object mapping */}
              {Object.entries(analysis).map(([key, value]) => (
                <section key={key}>
                  <h3 className="text-sm font-semibold capitalize text-zinc-900 dark:text-zinc-100">{key.replaceAll('_', ' ')}</h3>
                  <ul className="mt-2 space-y-2 text-sm text-zinc-600 dark:text-zinc-300">
                    {asList(Array.isArray(value) ? value : typeof value === 'object' ? Object.values(value) : value).map((item, idx) => (
                      <li key={`${key}-${idx}`} className="rounded-lg bg-zinc-100 p-3 dark:bg-zinc-800">{item}</li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}