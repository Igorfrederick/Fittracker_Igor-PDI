/**
 * Componente: Header
 * 
 * Barra de navegação superior da aplicação.
 */

import { Link, useLocation } from 'react-router-dom';
import { Dumbbell, Home, PlusCircle, BarChart3, Menu, X } from 'lucide-react';
import { useState } from 'react';
import './Header.css';

const Header = () => {
  const location = useLocation();
  const [menuAberto, setMenuAberto] = useState(false);

  const links = [
    { path: '/', label: 'Início', icon: Home },
    { path: '/treinos', label: 'Treinos', icon: Dumbbell },
    { path: '/treinos/novo', label: 'Novo Treino', icon: PlusCircle },
    { path: '/estatisticas', label: 'Estatísticas', icon: BarChart3 },
  ];

  const isAtivo = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo */}
        <Link to="/" className="header-logo">
          <Dumbbell size={28} />
          <span>FitTracker</span>
        </Link>

        {/* Navegação Desktop */}
        <nav className="header-nav">
          {links.map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              className={`header-link ${isAtivo(path) ? 'ativo' : ''}`}
            >
              <Icon size={18} />
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        {/* Botão Menu Mobile */}
        <button 
          className="header-menu-btn"
          onClick={() => setMenuAberto(!menuAberto)}
          aria-label="Menu"
        >
          {menuAberto ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Menu Mobile */}
      {menuAberto && (
        <nav className="header-nav-mobile">
          {links.map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              className={`header-link-mobile ${isAtivo(path) ? 'ativo' : ''}`}
              onClick={() => setMenuAberto(false)}
            >
              <Icon size={20} />
              <span>{label}</span>
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
};

export default Header;
