import React, { lazy, Suspense, useEffect, useState } from 'react';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

import { PtreProvider, useCurrentTeam } from './context/PtreContext';

import Header from './components/Header/Header';
import LeftMenu from './components/LeftMenu/LeftMenu';
import Footer from './components/Footer/Footer';

import ScrollToTop from './shared/ScrollToTop/ScrollToTop';
import BackToTopButton from './shared/BackToTopButton/BackToTopButton';
import './App.css';

const Splash = lazy(() => import('./components/Splash/Splash'));
const TeamDashboard = lazy(() => import('./components/Team/Home/Home'));

function App() {
  return (
    <HelmetProvider>
      <Router>
        <ScrollToTop />
        <PtreProvider>
          <div className="App">
            {/* Header */}
            <Header />

            {/* Main Content */}
            <div className="app-layout">
              <LeftMenu /> {/* Left Menu */}
              <div className="content-wrapper">
                <PageContent /> {/* Main Content */}
              </div>
            </div>

            {/* Footer */}
            <Footer />
          </div>
          <BackToTopButton />
        </PtreProvider>
      </Router>
    </HelmetProvider>
  );
}

function PageContent() {
  const teamData = useCurrentTeam();

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
    if (isSplashPage()) {
      return <Splash />;
    }

    if (!currentPage && teamData) {
      return <TeamDashboard />;
    }

    return <div className="container">Page not found</div>;
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
