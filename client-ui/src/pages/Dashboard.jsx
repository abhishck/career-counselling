import { BarChart3, Brain, FileText, History, MessageSquare, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import FeatureCard from '../components/ui/FeatureCard.jsx';
import PageHeader from '../components/ui/PageHeader.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const cards = [
  { to: '/resume-analyzer', icon: FileText, title: 'Resume Analyzer', description: 'Upload a PDF and get a structured improvement report.' },
  { to: '/chatbot', icon: MessageSquare, title: 'AI Career Chatbot', description: 'Ask practical questions about roles, skills, and decisions.' },
  { to: '/career-test', icon: Brain, title: 'Career Test', description: 'Complete the MCQ assessment for career suggestions.' },
  { to: '/test-results', icon: BarChart3, title: 'Test Results', description: 'Review scores and recommendations from past tests.' },
  { to: '/chat-history', icon: History, title: 'Chat History', description: 'Open previous career counselling conversations.' },
  { to: '/profile', icon: User, title: 'Profile', description: 'View account details and usage stats.' },
];

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <>
      <PageHeader title={`Hello${user?.name ? `, ${user.name}` : ''}`} description="Choose a counselling tool and continue building your career plan." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <Link key={card.to} to={card.to}>
            <FeatureCard {...card} />
          </Link>
        ))}
      </div>
    </>
  );
}
