import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout.jsx';
import AuthLayout from './components/layout/AuthLayout.jsx';
import ProtectedRoute from './components/routing/ProtectedRoute.jsx';
import PublicOnlyRoute from './components/routing/PublicOnlyRoute.jsx';
import Chatbot from './pages/Chatbot.jsx';
import ChatHistory from './pages/ChatHistory.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Landing from './pages/Landing.jsx';
import Login from './pages/Login.jsx';
import NotFound from './pages/NotFound.jsx';
import Profile from './pages/Profile.jsx';
import Register from './pages/Register.jsx';
import ResumeAnalyzer from './pages/ResumeAnalyzer.jsx';
import TestResults from './pages/TestResults.jsx';
import CareerTest from './pages/CareerTest.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route element={<PublicOnlyRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/resume-analyzer" element={<ResumeAnalyzer />} />
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="/career-test" element={<CareerTest />} />
          <Route path="/test-results" element={<TestResults />} />
          <Route path="/chat-history" element={<ChatHistory />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Route>
      <Route path="/home" element={<Navigate to="/" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
