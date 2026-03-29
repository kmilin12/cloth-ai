import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

import Login from './pages/Login';
import Wardrobe from './pages/Wardrobe';
import Upload from './pages/Upload';
import OutfitGenerator from './pages/OutfitGenerator';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Layout />}>
          <Route index element={<Wardrobe />} />
          <Route path="upload" element={<Upload />} />
          <Route path="outfits" element={<OutfitGenerator />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;

import { useEffect } from "react"
import { supabase } from "./supabaseClient" // ajusta si tu ruta es diferente

useEffect(() => {
  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      window.location.href = "/login"
    }
  }

  checkUser()
}, [])