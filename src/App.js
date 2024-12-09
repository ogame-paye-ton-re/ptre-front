import React, { lazy, Suspense, useEffect, useState } from 'react';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';

import { getCookie } from './utils/cookieUtils';

import './App.css';

const Splash = lazy(() => import('./components/Splash/Splash'));
const TeamDashboard = lazy(() => import('./components/Team/Home/Home'));

function App() {
  const [teamKey, setTeamKey] = useState("");

  useEffect(() => {
    // let sessionId = getCookie("session_id");
    // let ptreId = getCookie("prte_id");

    // if (!sessionId) {
    //   sessionId = generateSessionId();
    //   setCookie("session_id", sessionId, { path: "/" });
    // }

    // if (!ptreId) {
    //   setCookie("prte_id", sessionId, { path: "/", expires: 2114377200 });
    // }

    const cookieValue = getCookie("ptre_team_key");
    setTeamKey(cookieValue || "TMDCD4R6ZVT27BPEHU");
  }, []);

  return (
    <HelmetProvider>
      <Router>
        <div className="App">
          {/* Header */}
          <Header />

          {/* Main Content */}
          <PageContent teamKey={teamKey} />

          {/* Footer */}
          <Footer />
        </div>
      </Router>
    </HelmetProvider>
  );
}

function PageContent({ teamKey }) {
  const [currentPage, setCurrentPage] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const page = queryParams.get('page');
    setCurrentPage(page); 
  }, [location]);

  const isSplashPage = () =>
    currentPage === 'splash' || (location.pathname === '/' && !teamKey);

  const renderPage = () => {
    console.log('Rendering page:', currentPage);
    console.log(location.pathname)
    
    if (isSplashPage()) {
      return <Splash />;
    }

    if (location.pathname === '/' && teamKey && !currentPage) {
      return <TeamDashboard />;
    }

    return <div>Page not found</div>;
  };

  return (
    <main className="main-content">
      <Suspense fallback={<div>Loading...</div>}>
        {renderPage()}
      </Suspense>
    </main>
  );
}

export default App;
