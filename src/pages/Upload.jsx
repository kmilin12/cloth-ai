import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWardrobe } from '../context/WardrobeContext';
import { supabase } from '../supabase';
import { Upload as UploadIcon, Loader2, Check, X, Wand2, ChevronRight } from 'lucide-react';

export default function Upload() {
  const { addItem } = useWardrobe();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [step, setStep] = useState('upload'); // upload, preview, analyzing, suggested, details
  const [previewUrl, setPreviewUrl] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const [formData, setFormData] = useState({
    category: 'Top',
    color: 'White',
    style: 'Casual'
  });

  const handleFileDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target.result);
        setStep('preview');
      };
      reader.readAsDataURL(file);
    }
  };

  const startAnalysis = async () => {
    if (isAnalyzing) return;
    
    setIsAnalyzing(true);
    setStep('analyzing');
    
    // Simulate AI analysis with a delay (debounce-like behavior already handled by state)
    setTimeout(() => {
      const categories = ['Top', 'Bottom', 'Shoes', 'Outerwear'];
      const colors = ['Negro', 'Blanco', 'Azul', 'Beige', 'Gris', 'Rojo'];
      const styles = ['Casual', 'Formal', 'Deportivo', 'Streetwear'];
      
      const suggestedCategory = categories[Math.floor(Math.random() * categories.length)];
      
      setFormData({
        category: suggestedCategory,
        color: colors[Math.floor(Math.random() * colors.length)],
        style: styles[Math.floor(Math.random() * styles.length)]
      });
      
      setIsAnalyzing(false);
      setStep('suggested');
    }, 1500);
  };

  const handleConfirmSuggestion = () => {
    handleSubmit();
  };

  const handleShowDetails = () => {
    setStep('details');
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!imageFile || isUploading) return;
    
    setIsUploading(true);
    try {
      // 1. Upload image to Supabase Storage
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `user-uploads/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('clothing-images')
        .upload(filePath, imageFile);
        
      if (uploadError) throw uploadError;
      
      // 2. Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('clothing-images')
        .getPublicUrl(filePath);

      // 3. Add to Database
      await addItem({
        imageUrl: publicUrl,
        ...formData
      });
      
      navigate('/');
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Hubo un error al subir la prenda. Por favor intenta de nuevo.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="page-container max-w-lg mx-auto">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold mb-2">Añadir Prenda</h2>
        <p className="text-secondary">Sube una foto para organizar tu armario</p>
      </div>
      
      <div className="card overflow-hidden">
        {step === 'upload' && (
          <div 
            className="drop-zone fade-in"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleFileDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileDrop} 
              accept="image/*" 
              className="hidden" 
            />
            <div className="drop-icon-container">
              <UploadIcon size={28} className="text-secondary" />
            </div>
            <h3 className="text-lg font-semibold mb-1">Arrastra tu prenda o haz clic para subir</h3>
            <p className="text-tertiary text-sm mt-2">Formatos sportados: JPG, PNG (Max 5MB)</p>
          </div>
        )}

        {(step === 'preview' || step === 'analyzing' || step === 'suggested' || step === 'details') && (
          <div className="space-y-6 fade-in">
            <div className="relative h-64 overflow-hidden rounded-xl bg-surface-secondary border border-border flex items-center justify-center">
              <img src={previewUrl} alt="Preview" className="h-full w-full object-contain p-4" />
              
              {step === 'preview' && (
                <button 
                  className="absolute top-4 right-4 p-2 bg-bg/80 text-text-[111111] border border-border shadow-sm rounded-full hover:bg-bg transition-colors backdrop-blur-md"
                  onClick={() => setStep('upload')}
                >
                  <X size={20} />
                </button>
              )}

              {step === 'analyzing' && (
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center text-white p-6 text-center">
                  <Loader2 className="spinner mb-4" size={48} />
                  <h3 className="text-xl font-bold mb-2">Analizando prenda...</h3>
                  <p className="text-white/80 text-sm">Nuestra IA está identificando el tipo, color y estilo.</p>
                </div>
              )}
            </div>

            {step === 'preview' && (
              <div className="p-2">
                <button 
                  onClick={startAnalysis}
                  className="btn-primary w-full py-4 text-lg"
                >
                  <Wand2 size={24} />
                  Analizar prenda con IA
                </button>
                <div className="mt-4 flex justify-center">
                  <button 
                    onClick={() => setStep('details')}
                    className="text-tertiary text-sm font-medium hover:text-secondary underline underline-offset-4"
                  >
                    Omitir IA y rellenar manualmente
                  </button>
                </div>
              </div>
            )}

            {step === 'suggested' && (
              <div className="p-4 space-y-6">
                <div className="text-center">
                  <p className="text-tertiary text-xs uppercase tracking-widest font-bold mb-2">Sugerencia de IA</p>
                  <h3 className="text-2xl font-bold">¿Esto es un {formData.category.toLowerCase()}?</h3>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={handleConfirmSuggestion}
                    className="btn-primary py-4"
                    disabled={isUploading}
                  >
                    {isUploading ? <Loader2 className="spinner" size={20} /> : <><Check size={20} /> Sí, guardar</>}
                  </button>
                  <button 
                    onClick={handleShowDetails}
                    className="btn-secondary py-4"
                    disabled={isUploading}
                  >
                    Cambiar
                  </button>
                </div>
              </div>
            )}

            {step === 'details' && (
              <form onSubmit={handleSubmit} className="p-2 space-y-6">
                <div className="grid gap-4">
                  <div className="form-group">
                    <label>Categoría</label>
                    <select 
                      value={formData.category} 
                      onChange={e => setFormData({...formData, category: e.target.value})}
                      className="form-input"
                    >
                      <option value="Top">Parte superior (Top)</option>
                      <option value="Bottom">Parte inferior (Bottom)</option>
                      <option value="Shoes">Calzado</option>
                      <option value="Outerwear">Abrigo/Exterior</option>
                      <option value="Accessory">Accesorio</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Color</label>
                    <input 
                      type="text" 
                      value={formData.color} 
                      onChange={e => setFormData({...formData, color: e.target.value})}
                      className="form-input"
                      placeholder="Ej: Negro, Blanco..."
                    />
                  </div>

                  <div className="form-group">
                    <label>Estilo</label>
                    <select 
                      value={formData.style} 
                      onChange={e => setFormData({...formData, style: e.target.value})}
                      className="form-input"
                    >
                      <option value="Casual">Casual</option>
                      <option value="Formal">Formal</option>
                      <option value="Sport">Deportivo</option>
                      <option value="Streetwear">Streetwear</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-4 pt-4 border-t border-border">
                  <button 
                    type="button" 
                    className="btn-secondary flex-1" 
                    onClick={() => setStep('suggested')}
                    disabled={isUploading}
                  >
                    Volver
                  </button>
                  <button 
                    type="submit" 
                    className="btn-primary flex-[2]"
                    disabled={isUploading}
                  >
                    {isUploading ? <Loader2 className="spinner" size={20} /> : 'Guardar Prenda'}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
