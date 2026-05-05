import { motion } from 'framer-motion';
import { BarChart3, Brain, FileText, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import FeatureCard from '../components/ui/FeatureCard.jsx';
import ThemeToggle from '../components/ui/ThemeToggle.jsx';

const features = [
  { icon: FileText, title: 'Resume Analyzer', description: 'Upload a PDF resume and receive focused feedback on fit, clarity, and next improvements.' },
  { icon: MessageSquare, title: 'AI Chatbot', description: 'Ask career questions in a calm conversation that keeps context for your account.' },
  { icon: Brain, title: 'Career Test', description: 'Take a structured MCQ assessment and receive career paths aligned with your answers.' },
  { icon: BarChart3, title: 'Profile Insights', description: 'Track tests, chats, resume uploads, and past guidance from one clean hub.' },
];

export default function Landing() {
  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <header className="container-page flex h-20 items-center justify-between">
        <Link to="/" className="text-xl font-bold tracking-tight">
          Pathwise
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link className="btn-secondary hidden sm:inline-flex" to="/login">
            Login
          </Link>
          <Link className="btn-primary" to="/register">
            Register
          </Link>
        </div>
      </header>

      <section className="container-page grid min-h-[calc(100vh-5rem)] items-center gap-10 py-10 lg:grid-cols-[1.05fr_0.95fr]">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
          <p className="mb-4 inline-flex rounded-full border border-zinc-200 bg-white px-3 py-1 text-sm font-medium text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">Career decisions with clearer evidence</p>
          <h1 className="max-w-4xl text-4xl font-bold tracking-tight text-zinc-950 dark:text-white sm:text-6xl">
            Build the next version of your career plan.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-zinc-600 dark:text-zinc-300">
            Pathwise combines resume analysis, guided assessments, profile insights, and career chat in one practical counselling workspace.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link className="btn-primary" to="/register">
              Start free
            </Link>
            <Link className="btn-secondary" to="/login">
              Login
            </Link>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15, duration: 0.55 }} className="surface overflow-hidden p-5">
          <div className="rounded-lg bg-zinc-950 p-5 text-white dark:bg-zinc-100 dark:text-zinc-950">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 dark:border-zinc-300">
              <div>
                <p className="text-sm opacity-70">Readiness score</p>
                <p className="mt-1 text-3xl font-bold">84%</p>
              </div>
              <BarChart3 />
            </div>
            <div className="mt-5 grid gap-3">
              {['Resume clarity improved', 'Career test completed', '3 counselling chats saved'].map((item) => (
                <div key={item} className="rounded-lg bg-white/8 p-3 text-sm dark:bg-zinc-200">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      <section className="border-y border-zinc-200 bg-white py-16 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="container-page grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </section>
    </main>
  );
}
