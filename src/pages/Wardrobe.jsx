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
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-bold mb-2">Tu Armario</h1>
          <p className="text-secondary font-medium">{items.length} prendas en total</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat.value}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                filter === cat.value 
                  ? 'bg-accent text-white shadow-md' 
                  : 'bg-surface border border-border text-secondary hover:border-text-tertiary'
              }`}
              onClick={() => setFilter(cat.value)}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredItems.map(item => (
            <ClothingCard 
              key={item.id} 
              item={item} 
              onDelete={removeItem} 
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center card bg-surface-hover/50 border-dashed border-2">
          <div className="w-20 h-20 bg-surface rounded-full flex items-center justify-center mb-6 shadow-sm">
            <Shirt size={40} className="text-tertiary" />
          </div>
          <h3 className="text-xl font-bold mb-2">No hay prendas</h3>
          <p className="text-secondary max-w-xs mx-auto mb-8">
            Aún no has añadido ninguna prenda a tu {filter === 'All' ? 'armario' : 'categoría de ' + filter.toLowerCase()}.
          </p>
          <Link to="/upload" className="btn-primary">
            <Plus size={20} />
            Añadir mi primera prenda
          </Link>
        </div>
      )}
    </div>
  );
}
