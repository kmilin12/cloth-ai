import { useState } from 'react';
import { useWardrobe } from '../context/WardrobeContext';
import { Shuffle } from 'lucide-react';

export default function OutfitGenerator() {
  const { items } = useWardrobe();
  const [currentOutfit, setCurrentOutfit] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const generateOutfit = () => {
    setIsAnimating(true);
    
    setTimeout(() => {
      const tops = items.filter(i => i.category === 'Top' || i.category === 'Outerwear');
      const bottoms = items.filter(i => i.category === 'Bottom');
      const shoes = items.filter(i => i.category === 'Shoes');

      const selectedOutfit = {
        top: tops.length ? tops[Math.floor(Math.random() * tops.length)] : null,
        bottom: bottoms.length ? bottoms[Math.floor(Math.random() * bottoms.length)] : null,
        shoes: shoes.length ? shoes[Math.floor(Math.random() * shoes.length)] : null,
      };

      setCurrentOutfit(selectedOutfit);
      setIsAnimating(false);
    }, 600);
  };

  const hasEnoughItems = items.some(i => i.category === 'Top' || i.category === 'Outerwear') && 
                         items.some(i => i.category === 'Bottom');

  return (
    <div className="page-container max-w-lg mx-auto">
      <div className="generator-header text-center mb-8">
        <h2>Outfit Generator</h2>
        <p className="text-secondary mb-6">Let AI put together the perfect minimal look from your items.</p>
        
        <button 
          onClick={generateOutfit} 
          disabled={!hasEnoughItems || isAnimating}
          className="btn-primary"
        >
          <Shuffle size={18} />
          {currentOutfit ? 'Generate Another' : 'Generate Outfit'}
        </button>
        
        {!hasEnoughItems && (
          <p className="text-error small mt-4">You need at least one Top and one Bottom to generate an outfit.</p>
        )}
      </div>

      {currentOutfit && (
        <div className={`outfit-display ${isAnimating ? 'pulse' : 'fade-in'}`}>
          <div className="outfit-grid">
            {/* Top */}
            <div className="outfit-slot">
              {currentOutfit.top ? (
                <img src={currentOutfit.top.imageUrl} alt="Top" className="outfit-img" />
              ) : (
                <div className="empty-slot">No Top</div>
              )}
            </div>
            
            {/* Bottom */}
            <div className="outfit-slot">
              {currentOutfit.bottom ? (
                <img src={currentOutfit.bottom.imageUrl} alt="Bottom" className="outfit-img" />
              ) : (
                <div className="empty-slot">No Bottom</div>
              )}
            </div>
            
            {/* Shoes (Optional but good to have) */}
            <div className="outfit-slot small-slot">
              {currentOutfit.shoes ? (
                <img src={currentOutfit.shoes.imageUrl} alt="Shoes" className="outfit-img" />
              ) : (
                <div className="empty-slot">No Shoes</div>
              )}
            </div>
          </div>
          
          <div className="outfit-summary text-center mt-6">
            <h3>Minimalist Vibe</h3>
            <p className="text-secondary">Ready to wear</p>
          </div>
        </div>
      )}
    </div>
  );
}
