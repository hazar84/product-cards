import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  // Скрываем навигацию на странице 404 для более чистого дизайна
  const isNotFoundPage = location.pathname === '/404' || 
                        (location.pathname !== '/' && 
                         location.pathname !== '/products' && 
                         location.pathname !== '/create-product' &&
                         !location.pathname.startsWith('/products/'));

  if (isNotFoundPage) {
    return <div className="layout">{children}</div>;
  }

  return (
    <div className="layout">
      <header className="layout__header">
        <nav className="layout__nav">
          <Link 
            to="/products" 
            className={`layout__link ${location.pathname === '/products' ? 'layout__link--active' : ''}`}
          >
            Products
          </Link>
          <Link 
            to="/create-product" 
            className={`layout__link ${location.pathname === '/create-product' ? 'layout__link--active' : ''}`}
          >
            Create Product
          </Link>
        </nav>
      </header>
      <main className="layout__main">
        {children}
      </main>
    </div>
  );
};

export default Layout;