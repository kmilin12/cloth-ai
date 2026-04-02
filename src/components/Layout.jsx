import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Shirt, Plus, Shuffle, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Layout() {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  
  return (
    <div className="app-container">
      <header className="top-nav">
        <div className="nav-content">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight">Cloth.</h1>
          </div>
          
          <nav className="nav-links">
            <NavLink to="/" className={({ isActive }) => (isActive ? 'nav-item active text-primary font-semibold' : 'nav-item')}>
              <Shirt size={18} />
              <span className="nav-label">Armario</span>
            </NavLink>
            <NavLink to="/upload" className={({ isActive }) => (isActive ? 'nav-item active text-primary font-semibold' : 'nav-item')}>
              <Plus size={18} />
              <span className="nav-label">Añadir Prenda</span>
            </NavLink>
            <NavLink to="/outfits" className={({ isActive }) => (isActive ? 'nav-item active text-primary font-semibold' : 'nav-item')}>
              <Shuffle size={18} />
              <span className="nav-label">Outfits</span>
            </NavLink>
          </nav>
          
          <div className="nav-actions">
            <button 
              className="flex items-center gap-2 text-sm text-tertiary hover:text-primary transition-colors" 
              onClick={async () => {
                await signOut();
                navigate('/login');
              }}
              title="Cerrar sesión"
            >
              <LogOut size={16} />
              <span className="nav-label hidden sm:inline">Cerrar sesión</span>
            </button>
          </div>
        </div>
      </header>
      
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
