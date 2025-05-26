import { useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';

import EmojiSelector from './components/EmojiSelector';
import MoodForm from './components/MoodForm';
import PaletteResults from './components/PaletteResults';
import SavedPalettes from './components/SavedPalettes';

import { useAuth } from './AuthContext';
import { auth } from './firebase';

function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [selectedMood, setSelectedMood] = useState('');
  const [description, setDescription] = useState('');
  const [inputUsed, setInputUsed] = useState('');

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleEmojiSelect = (mood) => {
    setSelectedMood(mood);
    setInputUsed('emoji');
    fetchPalettes(mood);
  };

  const handleGenerate = (desc) => {
    setDescription(desc);
    setInputUsed('text');
    fetchPalettes(desc);
  };

  const fetchPalettes = async (query) => {
    const cleaned = query.toLowerCase().trim();
  
    const moodHexMap = {
      calm: ['a3d5d3', 'b2f2bb', 'c3f0ca'],
      sad: ['5f9ea0', '6c91bf', '4a6fa5'],
      angry: ['ff4d4d', 'ff6f61', 'ff6347'],
      romantic: ['ffb6c1', 'ff69b4', 'ffc0cb'],
      excited: ['f7c948', 'ffdd57', 'ffe066'],
      default: ['00aaff', '0099cc', '33ccff'],
    };
  
    const hexOptions = moodHexMap[cleaned] || moodHexMap.default;
    const hex = hexOptions[Math.floor(Math.random() * hexOptions.length)];
  
    try {
      const allPalettes = [];
      const modes = ['analogic', 'monochrome', 'triad', 'quad', 'complement', 'analogic-complement'];
  
      for (let mode of modes) {
        const response = await fetch(
          `https://www.thecolorapi.com/scheme?hex=${hex}&mode=${mode}&count=5`
        );
        const data = await response.json();
        allPalettes.push(data.colors);
      }
  
      navigate('/palette', { state: { palettes: allPalettes, lastQuery: query } });
    } catch (err) {
      console.error('Error fetching palettes:', err);
    }
  };
  

  return (
    <div className="relative min-h-screen w-screen bg-yellow-50 flex flex-col px-4 pt-20 pb-12">
      {/* Top-left: Login / Sign Up or Logged In */}
      <div className="absolute top-4 left-4">
        {user ? (
          <div className="text-sm text-yellow-700">
            Logged in as <strong>{user.email}</strong> ·{' '}
            <button onClick={handleLogout} className="underline text-red-600 ml-2">
              Sign Out
            </button>
          </div>
        ) : (
          <div className="text-sm">
            <Link to="/login" className="underline mr-4">Log In</Link>
            <Link to="/signup" className="underline">Sign Up</Link>
          </div>
        )}
      </div>

      {/* Top-right: Saved Palettes */}
      <div className="absolute top-4 right-4">
        <Link
          to="/saved"
          className="bg-yellow-400 text-white font-semibold px-4 py-2 rounded shadow hover:bg-yellow-500 transition"
        >
          💾 Saved Palettes
        </Link>
      </div>

      {/* Centered MoodHue block */}
      <div className="flex flex-1 items-center justify-center">
        <div className="flex flex-col items-center text-center max-w-xl w-full space-y-6">
          <h1 className="text-6xl font-bold text-yellow-800">🎨 MoodHue</h1>

          <EmojiSelector selectedMood={selectedMood} onSelect={handleEmojiSelect} />

          <p className="text-gray-500 text-lg font-medium">— OR —</p>

          <MoodForm
            onGenerate={handleGenerate}
            onTyping={() => {
              if (selectedMood) {
                setSelectedMood('');
                setInputUsed('text');
              }
            }}
          />

          {inputUsed === 'emoji' && selectedMood && (
            <p className="text-yellow-700 text-lg">
              Generating a palette for mood: <strong>{selectedMood}</strong>
            </p>
          )}

          {inputUsed === 'text' && description && (
            <p className="text-yellow-700 text-lg">
              Generating a palette based on: <em>"{description}"</em>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ✅ App component below
function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/palette" element={<PaletteResults />} />
      <Route path="/saved" element={<SavedPalettes />} />
    </Routes>
  );
}

export default App;
