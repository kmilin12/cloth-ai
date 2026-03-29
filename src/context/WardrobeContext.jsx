import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { useAuth } from './AuthContext';

const WardrobeContext = createContext();

export const useWardrobe = () => useContext(WardrobeContext);

export const WardrobeProvider = ({ children }) => {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('wardrobe')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching wardrobe:', error);
    } else {
      setItems(data?.map(i => ({ ...i, imageUrl: i.image_url })) || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user) {
      fetchItems();
    } else {
      setItems([]);
      setLoading(false);
    }
  }, [user]);


  const addItem = async (itemData) => {
    // Add the user_id since RLS requires it, and map imageUrl to image_url
    const newItem = { 
      user_id: user.id,
      image_url: itemData.imageUrl,
      category: itemData.category,
      color: itemData.color,
      style: itemData.style
    };
    
    const { data, error } = await supabase
      .from('wardrobe')
      .insert([newItem])
      .select();
      
    if (error) {
      console.error('Error adding item:', error);
      throw error;
    }
    
    if (data && data.length > 0) {
      const insertedItem = { ...data[0], imageUrl: data[0].image_url };
      setItems(prev => [insertedItem, ...prev]);
    }
  };

  const removeItem = async (id) => {
    const { error } = await supabase
      .from('wardrobe')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error('Error deleting item:', error);
      throw error;
    } else {
      setItems(prev => prev.filter(i => i.id !== id));
    }
  };

  return (
    <WardrobeContext.Provider value={{ items, addItem, removeItem, loading }}>
      {children}
    </WardrobeContext.Provider>
  );
};
