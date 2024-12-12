import React, { lazy, Suspense, useEffect, useState } from 'react';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

import { PtreProvider, useTeamData } from './context/PtreContext';

import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';

import './App.css';

const Splash = lazy(() => import('./components/Splash/Splash'));
const TeamDashboard = lazy(() => import('./components/Team/Home/Home'));

function App() {
  return (
    <HelmetProvider>
      <Router>
        <PtreProvider>
          <div className="App">
            {/* Header */}
            <Header />

            {/* Main Content */}
            <PageContent />

            {/* Footer */}
            <Footer />
          </div>
        </PtreProvider>
      </Router>
    </HelmetProvider>
  );
}

function PageContent() {
  const teamData = useTeamData();

  const [currentPage, setCurrentPage] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const page = queryParams.get('page');
    setCurrentPage(page);
  }, [location]);

  const isSplashPage = () =>
    currentPage === 'splash' || (!currentPage && !teamData);

  const renderPage = () => {
    console.log('Rendering page:', currentPage);
    console.log(location.pathname);

    if (isSplashPage()) {
      return <Splash />;
    }

    if (!currentPage && teamData) {
      return <TeamDashboard />;
    }

    return <div>Page not found</div>;
  };

  return (
    <main className="main-content">
      <Suspense>
        {renderPage()}
      </Suspense>
    </main>
  );
}

export default App;
