import React from 'react';
import SNB from '@/components/snb';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="layout">
      <main>
        {children}
      </main>
      <div className="side side-left">
        <SNB />
      </div>
      <div className="side side-right">
        scroll
      </div>
    </div>
  );
};

export default Layout;
