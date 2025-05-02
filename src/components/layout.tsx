import React from 'react';
import SNB from '@/components/snb';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div>
      <div className="contents">
        <main>
          <SNB />
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
