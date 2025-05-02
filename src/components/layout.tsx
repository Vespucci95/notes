import React from 'react';
import SNB from '@/components/snb';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div>
      <header>
        <h1>사이트 공통 헤더</h1>
      </header>
      <SNB />
      <main>{children}</main>
      <footer>
        <p>사이트 공통 푸터</p>
      </footer>
    </div>
  );
};

export default Layout;
