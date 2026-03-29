import { useState } from 'react';
import { useWardrobe } from '../context/WardrobeContext';
import ClothingCard from '../components/ClothingCard';

export default function Wardrobe() {
  const { items, removeItem } = useWardrobe();
  const [filter, setFilter] = useState('All');

  const categories = ['All', 'Top', 'Bottom', 'Shoes', 'Outerwear'];

  const filteredItems = filter === 'All' 
    ? items 
    : items.filter(item => item.category === filter);

  return (
    <div className="page-container">
      <header className="page-header">
        <div>
          <h2>Your Wardrobe</h2>
          <p className="subtitle">{items.length} items total</p>
        </div>
        
        <div className="filter-group">
          {categories.map(cat => (
            <button
              key={cat}
              className={`filter-btn ${filter === cat ? 'active' : ''}`}
              onClick={() => setFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

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
        <div className="empty-state">
          <div className="empty-icon">👕</div>
          <h3>No items found</h3>
          <p>You haven't added any {filter === 'All' ? 'clothes' : filter.toLowerCase() + 's'} yet.</p>
        </div>
      )}
    </div>
  );
}
