import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css';

const NotFound: React.FC = () => {
  return (
    <div className="not-found">
      <div className="not-found__content">
        <div className="not-found__error-code">404</div>
        <h1 className="not-found__title">Page Not Found</h1>
        <p className="not-found__message">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <div className="not-found__actions">
          <Link to="/products" className="not-found__button not-found__button--primary">
            Go to Products
          </Link>
          <Link to="/create-product" className="not-found__button not-found__button--secondary">
            Go to Create
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;