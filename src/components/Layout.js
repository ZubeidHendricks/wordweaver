import React, { useState } from 'react';
import Link from 'next/link';
import Tutorial from './Tutorial';

const Layout = ({ children }) => {
  const [showTutorial, setShowTutorial] = useState(false);

  return (
    <div className="layout">
      <nav>
        <Link href="/">
          <a className="logo">WordWeaver</a>
        </Link>
        <div className="nav-links">
          <Link href="/">
            <a>Game</a>
          </Link>
          <Link href="/leaderboard">
            <a>Leaderboard</a>
          </Link>
          <button 
            onClick={() => setShowTutorial(true)}
            className="tutorial-btn"
          >
            How to Play
          </button>
        </div>
      </nav>

      <main>
        {children}
      </main>

      {showTutorial && (
        <Tutorial onComplete={() => setShowTutorial(false)} />
      )}

      <style jsx>{`
        .layout {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 2rem;
          background: #2196f3;
          color: white;
        }

        .logo {
          font-size: 1.5rem;
          font-weight: bold;
          text-decoration: none;
          color: white;
        }

        .nav-links {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .nav-links a {
          color: white;
          text-decoration: none;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          transition: background-color 0.2s;
        }

        .nav-links a:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }

        .tutorial-btn {
          background: rgba(255, 255, 255, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.4);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
          font-size: 1rem;
          transition: all 0.2s;
        }

        .tutorial-btn:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        main {
          flex: 1;
          padding: 2rem;
          background: #f5f5f5;
        }
      `}</style>

      <style jsx global>{`
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
            Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        }
      `}</style>
    </div>
  );
};

export default Layout;