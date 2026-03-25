import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AmbientBackground from '../components/AmbientBackground';
import { useTheme } from '../components/ThemeProvider';

const MainLayout = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { theme } = useTheme();
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const lightBg =
    "linear-gradient(90deg, rgba(226,185,235,1) 0%, rgba(213,237,237,1) 50%, rgba(215,185,237,1) 100%)";
  const darkBg =
    "linear-gradient(135deg, #0f0e17 0%, #1a1a2e 40%, #16213e 70%, #0f0e17 100%)";

  return (
    <div
      className="min-h-screen flex flex-col relative"
      style={{
        background: theme === 'dark' ? darkBg : lightBg,
      }}
    >
      <AmbientBackground />
      <Header isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
      <main className="flex-grow relative" style={{ zIndex: 2 }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;