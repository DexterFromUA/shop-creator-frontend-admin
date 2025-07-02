import React from 'react';
import './SimpleLayout.css';

const SimpleLayout = ({ children }) => {
  return (
    <div className="simple-layout">
      <main className="simple-content">
        <div className="content-wrapper">
          {children}
        </div>
      </main>
    </div>
  );
};

export default SimpleLayout; 