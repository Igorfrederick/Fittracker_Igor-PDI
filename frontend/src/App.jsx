/**
 * App - Componente Principal
 * 
 * Configura as rotas da aplicação.
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import ListaTreinos from './pages/ListaTreinos';
import FormTreino from './pages/FormTreino';
import DetalhesTreino from './pages/DetalhesTreino';

// Importa estilos
import './styles/global.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Home / Dashboard */}
          <Route index element={<Home />} />
          
          {/* Treinos */}
          <Route path="treinos">
            <Route index element={<ListaTreinos />} />
            <Route path="novo" element={<FormTreino />} />
            <Route path=":id" element={<DetalhesTreino />} />
            <Route path=":id/editar" element={<FormTreino />} />
          </Route>

          {/* Estatísticas (placeholder para Fase 4) */}
          <Route path="estatisticas" element={
            <div style={{ textAlign: 'center', padding: '4rem' }}>
              <h2>📊 Estatísticas</h2>
              <p style={{ color: 'var(--text-muted)' }}>
                Em breve - Fase 4 (Gráficos)
              </p>
            </div>
          } />

          {/* 404 */}
          <Route path="*" element={
            <div style={{ textAlign: 'center', padding: '4rem' }}>
              <h2>404</h2>
              <p>Página não encontrada</p>
            </div>
          } />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
