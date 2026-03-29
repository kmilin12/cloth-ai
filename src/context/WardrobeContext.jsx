import { createContext, useContext, useState, useEffect } from 'react';

const WardrobeContext = createContext();

export const useWardrobe = () => useContext(WardrobeContext);

export const WardrobeProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('cloth-wardrobe');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [
      // Some initial mock data for demo purposes
      { id: '1', imageUrl: 'https://images.unsplash.com/photo-1574180566232-aaad1b5b8450?auto=format&fit=crop&q=80&w=400', category: 'Top', color: 'White', style: 'Casual' },
      { id: '2', imageUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=400', category: 'Bottom', color: 'Blue', style: 'Casual' },
      { id: '3', imageUrl: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=400', category: 'Shoes', color: 'Black', style: 'Formal' }
    ];
  });

  useEffect(() => {
    localStorage.setItem('cloth-wardrobe', JSON.stringify(items));
  }, [items]);

  const addItem = (item) => {
    setItems(prev => [item, ...prev]);
  };

  const removeItem = (id) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  return (
    <WardrobeContext.Provider value={{ items, addItem, removeItem }}>
      {children}
    </WardrobeContext.Provider>
  );
};
