/**
 * Componente: Layout
 * 
 * Layout principal da aplicação.
 * Envolve todas as páginas com Header e container.
 */

import { Outlet } from 'react-router-dom';
import Header from './Header';
import './Layout.css';

const Layout = () => {
  return (
    <div className="layout">
      <Header />
      <main className="layout-main">
        <div className="layout-container">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
