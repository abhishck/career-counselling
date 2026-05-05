import { useEffect, useState } from 'react';
import api from '../api/axios.js';
import Alert from '../components/ui/Alert.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import Loader from '../components/ui/Loader.jsx';
import PageHeader from '../components/ui/PageHeader.jsx';
import { formatDate } from '../utils/format.js';

export default function TestResults() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/api/test/results')
      .then(({ data }) => setResults(data.results || data.tests || data || []))
      .catch((err) => setError(err.response?.data?.message || 'Unable to load test results.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <PageHeader title="Test Results" description="Review your past assessment scores and recommendations." />
      {loading ? <Loader /> : error ? <Alert>{error}</Alert> : results.length === 0 ? <EmptyState title="No test results yet" description="Complete the career test to see results here." /> : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {results.map((result, index) => (
            <article key={result._id || result.id || index} className="surface p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-zinc-500">{formatDate(result.createdAt || result.date)}</p>
                  <h2 className="mt-2 text-2xl font-bold">{result.score ?? result.totalScore ?? 'Completed'}</h2>
                </div>
              </div>
              <div className="mt-4 space-y-2 text-sm text-zinc-600 dark:text-zinc-300">
                {(result.suggestions || result.careerSuggestions || result.careers || []).slice(0, 4).map((item) => (
                  <p key={item} className="rounded-lg bg-zinc-100 p-3 dark:bg-zinc-800">{item}</p>
                ))}
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
