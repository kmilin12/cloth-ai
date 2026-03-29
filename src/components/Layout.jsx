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
          <div className="logo-section">
            <h1 className="logo">Cloth.</h1>
          </div>
          <nav className="nav-links">
            <NavLink to="/" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
              <Shirt size={20} />
              <span className="nav-label">Wardrobe</span>
            </NavLink>
            <NavLink to="/upload" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
              <Plus size={20} />
              <span className="nav-label">Add Items</span>
            </NavLink>
            <NavLink to="/outfits" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
              <Shuffle size={20} />
              <span className="nav-label">Outfits</span>
            </NavLink>
          </nav>
          
          <div className="nav-actions">
            <button 
              className="nav-item logout-btn" 
              onClick={async () => {
                await signOut();
                navigate('/login');
              }}
              title="Sign Out"
            >
              <LogOut size={20} />
              <span className="nav-label">Cerrar sesión</span>
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
