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
      // 1. Pick a random top first to "anchor" the outfit's style
      const tops = items.filter(i => i.category === 'Top' || i.category === 'Outerwear');
      if (!tops.length) {
        setIsAnimating(false);
        return;
      }
      
      const randomTop = tops[Math.floor(Math.random() * tops.length)];
      const anchorStyle = randomTop.style; 

      // 2. Try to find a bottom that matches the same style. If none exists, pick any.
      let bottoms = items.filter(i => i.category === 'Bottom' && i.style === anchorStyle);
      if (!bottoms.length) {
        bottoms = items.filter(i => i.category === 'Bottom');
      }
      const randomBottom = bottoms.length ? bottoms[Math.floor(Math.random() * bottoms.length)] : null;

      // 3. Try to find shoes that match the style. If none exists, pick any.
      let shoes = items.filter(i => i.category === 'Shoes' && i.style === anchorStyle);
      if (!shoes.length) {
        shoes = items.filter(i => i.category === 'Shoes');
      }
      const randomShoes = shoes.length ? shoes[Math.floor(Math.random() * shoes.length)] : null;

      setCurrentOutfit({
        top: randomTop,
        bottom: randomBottom,
        shoes: randomShoes,
        style: anchorStyle
      });
      
      setIsAnimating(false);
    }, 600);
  };

  const hasEnoughItems = items.some(i => i.category === 'Top' || i.category === 'Outerwear') && 
                         items.some(i => i.category === 'Bottom');

  return (
    <div className="page-container max-w-lg mx-auto">
      <div className="generator-header text-center mb-8">
        <h2>Outfit Generator</h2>
        <p className="text-secondary mb-6">Logical matching based on your clothing styles.</p>
        
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
            
            {/* Shoes */}
            <div className="outfit-slot small-slot">
              {currentOutfit.shoes ? (
                <img src={currentOutfit.shoes.imageUrl} alt="Shoes" className="outfit-img" />
              ) : (
                <div className="empty-slot">No Shoes</div>
              )}
            </div>
          </div>
          
          <div className="outfit-summary text-center mt-6">
            <h3>{currentOutfit.style} Outfit</h3>
            <p className="text-secondary">Items styled together logically</p>
          </div>
        </div>
      )}
    </div>
  );
}
