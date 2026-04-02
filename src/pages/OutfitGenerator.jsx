import { useState } from 'react';
import { useWardrobe } from '../context/WardrobeContext';
import { Shuffle, Loader2, Info } from 'lucide-react';

export default function OutfitGenerator() {
  const { items } = useWardrobe();
  const [currentOutfit, setCurrentOutfit] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const generateOutfit = () => {
    setIsAnimating(true);
    
    setTimeout(() => {
      // 1. Pick a random top first
      const tops = items.filter(i => i.category === 'Top' || i.category === 'Outerwear');
      if (!tops.length) {
        setIsAnimating(false);
        return;
      }
      
      const randomTop = tops[Math.floor(Math.random() * tops.length)];
      const anchorStyle = randomTop.style; 

      // 2. Pick a bottom
      let bottoms = items.filter(i => i.category === 'Bottom' && i.style === anchorStyle);
      if (!bottoms.length) {
        bottoms = items.filter(i => i.category === 'Bottom');
      }
      const randomBottom = bottoms.length ? bottoms[Math.floor(Math.random() * bottoms.length)] : null;

      // 3. Pick shoes
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
    <div className="page-container max-w-lg mx-auto fade-in">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Generador de Outfits</h1>
        <p className="text-secondary m-auto mb-8" style={{maxWidth: '400px'}}>Creamos combinaciones lógicas basadas en el estilo de tus prendas.</p>
        
        <div className="mt-8">
          <button 
            onClick={generateOutfit} 
            disabled={!hasEnoughItems || isAnimating}
            className="btn-primary"
            style={{padding: '1rem 2rem', fontSize: '1.1rem'}}
          >
            {isAnimating ? <Loader2 className="spinner" size={24} /> : <Shuffle size={24} />}
            {currentOutfit ? 'Generar otro' : 'Generar Outfit'}
          </button>
        </div>
        
        {!hasEnoughItems && (
          <div className="text-error bg-error-bg border-error mt-6 p-4 rounded-xl items-center justify-center gap-2 m-auto" style={{display: 'inline-flex', marginTop: '1.5rem', border: '1px solid'}}>
            <Info size={18} />
            <p className="font-medium small">Necesitas al menos una parte superior y una inferior.</p>
          </div>
        )}
      </div>

      {currentOutfit && (
        <div className="outfit-display" style={{transition: 'all 0.3s ease', opacity: isAnimating ? 0.5 : 1, transform: isAnimating ? 'scale(0.98)' : 'none'}}>
          <div className="outfit-grid-structured">
            {/* Top */}
            <div className="outfit-section">
              <span className="outfit-section-label">Parte Superior</span>
              <div className="outfit-slot">
                {currentOutfit.top ? (
                  <img src={currentOutfit.top.imageUrl} alt="Top" className="outfit-img" />
                ) : (
                  <div className="empty-slot">Vacío</div>
                )}
              </div>
            </div>
            
            {/* Bottom */}
            <div className="outfit-section">
              <span className="outfit-section-label">Parte Inferior</span>
              <div className="outfit-slot">
                {currentOutfit.bottom ? (
                  <img src={currentOutfit.bottom.imageUrl} alt="Bottom" className="outfit-img" />
                ) : (
                  <div className="empty-slot">Vacío</div>
                )}
              </div>
            </div>
            
            {/* Shoes */}
            <div className="outfit-section">
              <span className="outfit-section-label">Calzado</span>
              <div className="outfit-slot" style={{height: '160px'}}>
                {currentOutfit.shoes ? (
                  <img src={currentOutfit.shoes.imageUrl} alt="Shoes" className="outfit-img" />
                ) : (
                  <div className="empty-slot">Vacío</div>
                )}
              </div>
            </div>
          </div>
          
          <div className="text-center p-6 border rounded-xl" style={{borderColor: 'var(--border)', backgroundColor: 'var(--surface)'}}>
            <h3 className="text-2xl font-bold text-accent mb-2">Estilo {currentOutfit.style}</h3>
            <p className="text-secondary small">Combinado lógicamente por nuestra IA</p>
          </div>
        </div>
      )}
    </div>
  );
}
