import React from 'react';
import DesktopSnb from '@/components/desktop-snb/desktop-snb';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="layout">
      <div className="side side-left no-drag">
        <DesktopSnb />
      </div>
      <main>
        {children}
      </main>
    </div>
  );
};

export default Layout;
