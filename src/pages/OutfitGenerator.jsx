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
    <div className="page-container max-w-2xl mx-auto fade-in">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-3">Generador de Outfits</h1>
        <p className="text-secondary max-w-md mx-auto">Creamos combinaciones lógicas basadas en el estilo de tus prendas.</p>
        
        <div className="mt-8">
          <button 
            onClick={generateOutfit} 
            disabled={!hasEnoughItems || isAnimating}
            className="btn-primary px-8 py-4 text-lg shadow-lg"
          >
            {isAnimating ? <Loader2 className="spinner" size={24} /> : <Shuffle size={24} />}
            {currentOutfit ? 'Generar otro' : 'Generar Outfit'}
          </button>
        </div>
        
        {!hasEnoughItems && (
          <div className="mt-6 p-4 bg-amber-50 text-amber-700 rounded-xl border border-amber-100 flex items-center justify-center gap-2 text-sm mx-auto max-w-sm">
            <Info size={18} />
            <p>Necesitas al menos una parte superior y una inferior.</p>
          </div>
        )}
      </div>

      {currentOutfit && (
        <div className={`space-y-8 ${isAnimating ? 'opacity-50 scale-95' : 'opacity-100 scale-100'} transition-all duration-300`}>
          <div className="card grid grid-cols-1 md:grid-cols-3 gap-6 bg-surface-hover/30 border-2">
            {/* Top */}
            <div className="flex flex-col gap-3">
              <span className="text-[10px] uppercase tracking-widest font-bold text-tertiary px-2">Parte Superior</span>
              <div className="aspect-[3/4] rounded-xl bg-white border border-border overflow-hidden shadow-sm">
                {currentOutfit.top ? (
                  <img src={currentOutfit.top.imageUrl} alt="Top" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-tertiary italic">Vacio</div>
                )}
              </div>
            </div>
            
            {/* Bottom */}
            <div className="flex flex-col gap-3">
              <span className="text-[10px] uppercase tracking-widest font-bold text-tertiary px-2">Parte Inferior</span>
              <div className="aspect-[3/4] rounded-xl bg-white border border-border overflow-hidden shadow-sm">
                {currentOutfit.bottom ? (
                  <img src={currentOutfit.bottom.imageUrl} alt="Bottom" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-tertiary italic">Vacio</div>
                )}
              </div>
            </div>
            
            {/* Shoes */}
            <div className="flex flex-col gap-3">
              <span className="text-[10px] uppercase tracking-widest font-bold text-tertiary px-2">Calzado</span>
              <div className="aspect-[3/4] rounded-xl bg-white border border-border overflow-hidden shadow-sm">
                {currentOutfit.shoes ? (
                  <img src={currentOutfit.shoes.imageUrl} alt="Shoes" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-tertiary italic">Vacio</div>
                )}
              </div>
            </div>
          </div>
          
          <div className="text-center p-6 bg-accent/5 rounded-2xl border border-accent/10">
            <h3 className="text-2xl font-bold text-accent mb-1">Estilo {currentOutfit.style}</h3>
            <p className="text-secondary text-sm">Combinado lógicamente por nuestra IA</p>
          </div>
        </div>
      )}
    </div>
  );
}
