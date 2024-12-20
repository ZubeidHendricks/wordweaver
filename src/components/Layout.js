import Link from 'next/link';

const Layout = ({ children }) => {
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
        </div>
      </nav>

      <main>
        {children}
      </main>

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