import { useState } from 'react';
import { useWardrobe } from '../context/WardrobeContext';
import ClothingCard from '../components/ClothingCard';
import { Shirt, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Wardrobe() {
  const { items, removeItem } = useWardrobe();
  const [filter, setFilter] = useState('All');

  const categories = [
    { label: 'Todos', value: 'All' },
    { label: 'Tops', value: 'Top' },
    { label: 'Bottoms', value: 'Bottom' },
    { label: 'Calzado', value: 'Shoes' },
    { label: 'Abrigos', value: 'Outerwear' }
  ];

  const filteredItems = filter === 'All' 
    ? items 
    : items.filter(item => item.category === filter);

  return (
    <div className="page-container fade-in">
      <div className="page-header">
        <div>
          <h1 className="text-3xl font-bold mb-2">Tu Armario</h1>
          <p className="subtitle">{items.length} prendas en total</p>
        </div>
        
        <div className="filter-group">
          {categories.map(cat => (
            <button
              key={cat.value}
              className={`filter-btn ${filter === cat.value ? 'active' : ''}`}
              onClick={() => setFilter(cat.value)}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {filteredItems.length > 0 ? (
        <div className="clothing-grid">
          {filteredItems.map(item => (
            <ClothingCard 
              key={item.id} 
              item={item} 
              onDelete={removeItem} 
            />
          ))}
        </div>
      ) : (
        <div className="empty-state fade-in">
          <div className="empty-icon">
            <Shirt />
          </div>
          <h3 className="text-xl font-bold mb-4">No hay prendas</h3>
          <p className="text-secondary m-auto mb-8" style={{maxWidth: '300px'}}>
            Aún no has añadido ninguna prenda a tu {filter === 'All' ? 'armario' : 'categoría de ' + filter.toLowerCase()}.
          </p>
          <Link to="/upload" className="btn-primary" style={{display: 'inline-flex', margin: '0 auto'}}>
            <Plus size={20} />
            Añadir prenda
          </Link>
        </div>
      )}
    </div>
  );
}
