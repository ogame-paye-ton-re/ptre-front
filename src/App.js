import React, { lazy, Suspense, useEffect, useState } from 'react';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

import { PtreProvider, useCurrentTeam, useUniverseMenuData } from './context/PtreContext';

import Header from './components/Header/Header';
import LeftMenu from './components/LeftMenu/LeftMenu';
import Footer from './components/Footer/Footer';
import LoginModal from './components/Modals/LoginModal/LoginModal';

import ScrollToTop from './shared/ScrollToTop/ScrollToTop';
import BackToTopButton from './shared/BackToTopButton/BackToTopButton';
import './App.css';

const Splash = lazy(() => import('./components/Splash/Splash'));
const TeamDashboard = lazy(() => import('./components/Team/Home/Home'));
const TeamTargetList = lazy(() => import('./components/Team/TargetList/TargetList'));

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('join');
  const [animationClass, setAnimationClass] = useState("");

  const toggleModal = () => {
    if (!isModalOpen) {
      toggleTab("join")
      setAnimationClass("fade-in");
      setIsModalOpen(true);
    } else {
      setAnimationClass("fade-down");
      setTimeout(() => {
        setIsModalOpen(false);
      }, 250);
    }
  };

  const toggleTab = (tabName) => {
    setActiveTab(tabName);
  };

  return (
    <HelmetProvider>
      <Router>
        <ScrollToTop />
        <PtreProvider>
          <div className="App">
            <Header
              toggleModal={toggleModal}
            />

            <div className="app-layout">
              <LeftMenu toggleModal={toggleModal} />
              <div className="content-wrapper">
                <PageContent />
              </div>
            </div>

            <Footer />
          </div>
          <BackToTopButton />
          {/* Modal Dialog */}
          <LoginModal
            isModalOpen={isModalOpen}
            toggleModal={toggleModal}
            animationClass={animationClass}
            activeTab={activeTab}
            toggleTab={toggleTab}
          />
        </PtreProvider>
      </Router>
    </HelmetProvider>
  );
}

function PageContent() {
  const teamData = useCurrentTeam();
  const universeData = useUniverseMenuData();

  const [currentPage, setCurrentPage] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const page = queryParams.get('page');
    setCurrentPage(page);
  }, [location]);

  const isSplashPage = () =>
    currentPage === 'splash' || (!currentPage && !teamData && !universeData);

  const isTeamDashboardPage = () =>
    !currentPage && (teamData || universeData);

  const renderPage = () => {
    if (isSplashPage()) {
      return <Splash />;
    }

    if (isTeamDashboardPage()) {
      return <TeamDashboard />;
    }

    if (teamData && universeData) {
      switch (currentPage) {
        case 'players_list':
          return <TeamTargetList />;
        default:
          return <TeamDashboard />;
      }
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
