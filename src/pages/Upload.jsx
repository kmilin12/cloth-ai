import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWardrobe } from '../context/WardrobeContext';
import { supabase } from '../supabase';
import { Upload as UploadIcon, Loader2, Check } from 'lucide-react';

export default function Upload() {
  const { addItem } = useWardrobe();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [step, setStep] = useState('upload'); // upload, analyzing, uploading, details
  const [previewUrl, setPreviewUrl] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  
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
      processFile(file);
    }
  };

  const processFile = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target.result);
      setStep('analyzing');
      
      // Simulate API call for classification (could be replaced with real ML later)
      setTimeout(() => {
        const categories = ['Top', 'Bottom', 'Shoes', 'Outerwear'];
        const colors = ['Black', 'White', 'Navy', 'Beige', 'Grey', 'Red'];
        const styles = ['Casual', 'Formal', 'Sport', 'Streetwear'];
        
        setFormData({
          category: categories[Math.floor(Math.random() * categories.length)],
          color: colors[Math.floor(Math.random() * colors.length)],
          style: styles[Math.floor(Math.random() * styles.length)]
        });
        setStep('details');
      }, 2000);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) return;
    
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
      alert("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="page-container max-w-md mx-auto">
      <h2 className="text-center mb-8">Add to Wardrobe</h2>
      
      <div className="upload-card">
        {step === 'upload' && (
          <div 
            className="drop-zone"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleFileDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileDrop} 
              accept="image/*" 
              className="hidden-input" 
            />
            <UploadIcon size={48} className="text-tertiary mb-4" />
            <h3>Click to upload or drag and drop</h3>
            <p className="text-secondary">SVG, PNG, JPG or GIF (max. 5MB)</p>
          </div>
        )}

        {step === 'analyzing' && (
          <div className="analyzing-state">
            <div className="image-preview-wrapper mb-6">
              <img src={previewUrl} alt="Preview" className="preview-image" />
              <div className="overlay-loader">
                <Loader2 className="spinner" size={32} />
              </div>
            </div>
            <h3>Analyzing Item...</h3>
            <p className="text-secondary">AI is determining the type, color, and style.</p>
          </div>
        )}

        {step === 'details' && (
          <form onSubmit={handleSubmit} className="details-form fade-in">
             <div className="image-preview-wrapper small mb-6">
              <img src={previewUrl} alt="Preview" className="preview-image" />
              <div className="success-badge"><Check size={16} /></div>
            </div>

            <div className="form-group">
              <label>Category</label>
              <select 
                value={formData.category} 
                onChange={e => setFormData({...formData, category: e.target.value})}
                className="form-input"
              >
                <option value="Top">Top</option>
                <option value="Bottom">Bottom</option>
                <option value="Shoes">Shoes</option>
                <option value="Outerwear">Outerwear</option>
              </select>
            </div>

            <div className="form-group">
              <label>Color</label>
              <input 
                type="text" 
                value={formData.color} 
                onChange={e => setFormData({...formData, color: e.target.value})}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>Style</label>
              <select 
                value={formData.style} 
                onChange={e => setFormData({...formData, style: e.target.value})}
                className="form-input"
              >
                <option value="Casual">Casual</option>
                <option value="Formal">Formal</option>
                <option value="Sport">Sport</option>
                <option value="Streetwear">Streetwear</option>
              </select>
            </div>

            <div className="form-actions mt-8">
              <button 
                type="button" 
                className="btn-secondary" 
                onClick={() => setStep('upload')}
                disabled={isUploading}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn-primary"
                disabled={isUploading}
              >
                {isUploading ? <Loader2 className="spinner" size={18} /> : 'Save Item'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
