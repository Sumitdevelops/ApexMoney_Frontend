import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const MainLayout = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div
      className="min-h-screen flex flex-col relative"
      style={{
        background:
          "linear-gradient(90deg, rgba(226,185,235,1) 0%, rgba(213,237,237,1) 50%, rgba(215,185,237,1) 100%)",
      }}
    >
      <Header isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
      <main className="flex-grow relative" style={{ zIndex: 2 }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;