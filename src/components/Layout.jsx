import { NavLink, Outlet } from 'react-router-dom';
import { Shirt, Plus, Shuffle } from 'lucide-react';

export default function Layout() {
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
              <span>Wardrobe</span>
            </NavLink>
            <NavLink to="/upload" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
              <Plus size={20} />
              <span>Add Items</span>
            </NavLink>
            <NavLink to="/outfits" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
              <Shuffle size={20} />
              <span>Outfits</span>
            </NavLink>
          </nav>
        </div>
      </header>
      
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
