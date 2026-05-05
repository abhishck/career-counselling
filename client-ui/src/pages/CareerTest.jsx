import { useState } from 'react';
import api from '../api/axios.js';
import Alert from '../components/ui/Alert.jsx';
import PageHeader from '../components/ui/PageHeader.jsx';

const questions = [
  { id: 'work_style', text: 'Which work style feels most natural?', options: ['Analytical problem solving', 'Creative expression', 'Helping people directly', 'Building systems'] },
  { id: 'environment', text: 'Where do you do your best work?', options: ['Structured teams', 'Independent projects', 'Client-facing settings', 'Fast-moving startups'] },
  { id: 'motivation', text: 'What motivates you most?', options: ['Mastery', 'Impact', 'Stability', 'Recognition'] },
  { id: 'skill', text: 'Which skill would you like to use more?', options: ['Research', 'Communication', 'Design', 'Technical execution'] },
  { id: 'challenge', text: 'Which challenge sounds energizing?', options: ['Optimizing a process', 'Launching a campaign', 'Coaching a person', 'Designing a product'] },
];

export default function CareerTest() {
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  // Check if every question has an answer
  const isFormComplete = Object.keys(answers).length === questions.length;

  const submit = async (event) => {
    event.preventDefault();
    setHasAttemptedSubmit(true);
    setError('');

    if (!isFormComplete) {
      setError('Please answer all questions before submitting.');
      return;
    }

    setLoading(true);
    try {
      // Sending the answers object (e.g., { work_style: "...", environment: "..." })
      const { data } = await api.post('/api/test/submit', { answers });
      setResult(data.result || data);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to submit career test.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHeader title="Career Test" description="Complete the assessment to receive a score and career suggestions." />
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <form onSubmit={submit} className="space-y-4">
          {error && <Alert>{error}</Alert>}
          
          {questions.map((question, index) => {
            const isMissing = hasAttemptedSubmit && !answers[question.id];
            
            return (
              <fieldset 
                key={question.id} 
                className={`surface p-5 border-2 transition-colors ${isMissing ? 'border-red-500/50' : 'border-transparent'}`}
              >
                <legend className="mb-4 font-semibold flex items-center gap-2">
                  {index + 1}. {question.text}
                  {isMissing && <span className="text-red-500 text-xs">*Required</span>}
                </legend>
                <div className="grid gap-3 sm:grid-cols-2">
                  {question.options.map((option) => (
                    <label 
                      key={option} 
                      className={`cursor-pointer rounded-lg border p-3 text-sm transition ${
                        answers[question.id] === option 
                          ? 'border-teal-500 bg-teal-50 text-teal-900 dark:bg-teal-950/40 dark:text-teal-100' 
                          : 'border-zinc-200 hover:bg-zinc-100 dark:border-zinc-800 dark:hover:bg-zinc-800'
                      }`}
                    >
                      <input 
                        className="sr-only" 
                        type="radio" 
                        name={question.id} 
                        value={option} 
                        onChange={() => setAnswers(prev => ({ ...prev, [question.id]: option }))} 
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </fieldset>
            );
          })}
          
          <button 
            className="btn-primary w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed" 
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit test'}
          </button>
        </form>

        <aside className="surface h-fit p-6">
          <h2 className="font-semibold">Result</h2>
          {!result ? (
            <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">Your score and career suggestions will appear here.</p>
          ) : (
            <div className="mt-4 space-y-4 text-sm">
              <div className="rounded-lg bg-zinc-100 p-4 dark:bg-zinc-800">
                <span className="text-zinc-500">Score</span>
                <p className="mt-1 text-3xl font-bold">{result.score ?? result.totalScore ?? 'Completed'}</p>
              </div>
              <div>
                <h3 className="font-semibold">Career suggestions</h3>
                <ul className="mt-2 space-y-2">
                  {(result.suggestions || result.careerSuggestions || result.careers || []).map((item) => (
                    <li key={item} className="rounded-lg border border-zinc-200 p-3 dark:border-zinc-800">{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </aside>
      </div>
    </>
  );
}