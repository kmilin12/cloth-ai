import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import './App.css';

import Wardrobe from './pages/Wardrobe';
import Upload from './pages/Upload';
import OutfitGenerator from './pages/OutfitGenerator';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Wardrobe />} />
        <Route path="upload" element={<Upload />} />
        <Route path="outfits" element={<OutfitGenerator />} />
      </Route>
    </Routes>
  );
}

export default App;
