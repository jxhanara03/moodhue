import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import App from './App.jsx';
import PaletteResults from './components/PaletteResults.jsx';
import { AuthProvider } from './AuthContext.jsx';
import 'bootstrap-icons/font/bootstrap-icons.css';

import Login from './components/Login.jsx';
import SignUp from './components/SignUp.jsx';
import SavedPalettes from './components/SavedPalettes.jsx';

import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/palette" element={<PaletteResults />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/saved" element={<SavedPalettes />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
