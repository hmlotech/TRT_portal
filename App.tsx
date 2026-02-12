import React from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import NewsFeed from './pages/NewsFeed';
import Analytics from './pages/MonthlyReview';
import Library from './pages/Library';
import TRTScience from './pages/TRTScience';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import Help from './pages/Help';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import TopicDetail from './pages/science/TopicDetail';
import PublicationDetail from './pages/science/PublicationDetail';
import { Header } from './components/layout/Header';
import { IsotopeCursor } from './components/visuals/IsotopeCursor';

// Layout wrapper for pages with Header (Light Theme)
const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen text-gray-800 relative">
      <Header />
      {children}
    </div>
  );
};

// Route wrapper to conditional render layout
const RouteWrapper: React.FC<{ component: React.ComponentType }> = ({ component: Component }) => {
  const location = useLocation();
  const isFullScreen = 
    location.pathname === '/' || 
    location.pathname === '/login' || 
    location.pathname === '/signup' || 
    location.pathname === '/home' ||
    location.pathname === '/help' ||
    location.pathname === '/privacy' ||
    location.pathname === '/terms';

  // Cursor only on Home page
  const showCursor = location.pathname === '/home';

  return (
    <>
      {showCursor && <IsotopeCursor />}
      {isFullScreen ? (
        <Component />
      ) : (
        <AppLayout>
          <Component />
        </AppLayout>
      )}
    </>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RouteWrapper component={Login} />} />
        <Route path="/login" element={<RouteWrapper component={Login} />} />
        <Route path="/signup" element={<RouteWrapper component={Signup} />} />
        <Route path="/home" element={<RouteWrapper component={Home} />} />
        <Route path="/news-feed" element={<RouteWrapper component={NewsFeed} />} />
        <Route path="/analytics" element={<RouteWrapper component={Analytics} />} />
        <Route path="/library" element={<RouteWrapper component={Library} />} />
        <Route path="/trt-science" element={<RouteWrapper component={TRTScience} />} />
        
        {/* New Pages */}
        <Route path="/help" element={<RouteWrapper component={Help} />} />
        <Route path="/privacy" element={<RouteWrapper component={PrivacyPolicy} />} />
        <Route path="/terms" element={<RouteWrapper component={TermsOfService} />} />
        
        {/* Dynamic Science Routes */}
        <Route path="/trt-science/topic/:id" element={<RouteWrapper component={TopicDetail} />} />
        <Route path="/trt-science/publication/:id" element={<RouteWrapper component={PublicationDetail} />} />

        <Route path="/profile" element={<RouteWrapper component={Profile} />} />
        <Route path="/admin" element={<RouteWrapper component={Admin} />} />
      </Routes>
    </Router>
  );
};

export default App;