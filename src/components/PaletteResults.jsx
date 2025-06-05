import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import {
  collection,
  onSnapshot,
  doc,
  deleteDoc,
  setDoc,
} from 'firebase/firestore';

export default function PaletteResults() {
  const navigate = useNavigate();
  const location = useLocation();
  const initialPalettes = location.state?.palettes || [];
  const query = location.state?.lastQuery || '';

  const [currentPalettes, setCurrentPalettes] = useState(initialPalettes);
  const [savedPaletteHashes, setSavedPaletteHashes] = useState(new Set());
  const [showSavedMessage, setShowSavedMessage] = useState(false);

  const user = auth.currentUser;

  const getPaletteHash = (paletteHexArray) =>
    paletteHexArray.map((hex) => hex.replace('#', '')).join('-');

  // Redirect to home if no palettes passed
  useEffect(() => {
    if (!initialPalettes.length) {
      navigate('/', { replace: true });
    }
  }, [initialPalettes, navigate]);

  // Keep saved palettes updated in real-time
  useEffect(() => {
    if (!user) return;

    const palettesRef = collection(db, 'users', user.uid, 'palettes');

    const unsubscribe = onSnapshot(
      palettesRef,
      (snapshot) => {
        const hashes = new Set();
        snapshot.forEach((docSnap) => {
          hashes.add(docSnap.id);
        });
        setSavedPaletteHashes(hashes);
      },
      (error) => {
        console.error('Error fetching saved palettes (realtime):', error);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const handleRegenerate = async () => {
    const cleaned = query.toLowerCase().trim();

    const moodHexMap = {
      calm: ['a3d5d3', 'b2f2bb', 'c3f0ca'],
      sad: ['5f9ea0', '6c91bf', '4a6fa5'],
      angry: ['ff4d4d', 'ff6f61', 'ff6347'],
      romantic: ['ffb6c1', 'ff69b4', 'ffc0cb'],
      excited: ['f7c948', 'ffdd57', 'ffe066'],
      sunset: ['ff9a8b', 'ffb347', 'ffd580'],
      ocean: ['0077be', '00b4d8', '90e0ef'],
      forest: ['228B22', '6B8E23', '8FBC8F'],
      rainbow: ['FF0000', 'FF7F00', 'FFFF00', '00FF00', '0000FF', '4B0082', '9400D3'],
      rainy: ['a0c4ff', 'bdbdbd', '90a4ae'],
      night: ['0d1b2a', '1b263b', '415a77'],
      default: ['00aaff', '0099cc', '33ccff'],
    };

    const hexOptions = moodHexMap[cleaned] || moodHexMap.default;
    const hex = hexOptions[Math.floor(Math.random() * hexOptions.length)];

    const allPalettes = [];
    const modes = ['analogic', 'monochrome', 'triad', 'quad', 'complement', 'analogic-complement'];

    for (let mode of modes) {
      const response = await fetch(
        `https://www.thecolorapi.com/scheme?hex=${hex}&mode=${mode}&count=5`
      );
      const data = await response.json();
      allPalettes.push(data.colors);
    }

    setCurrentPalettes(allPalettes);
  };

  const handleToggleSave = async (palette) => {
    if (!user) {
      navigate('/login', {
        state: {
          pendingPalette: palette,
          from: location.pathname,
          palettes: currentPalettes,
        },
      });
      return;
    }

    const paletteHexArray = palette.map((color) => color.hex.value);
    const hash = getPaletteHash(paletteHexArray);
    const paletteRef = doc(db, 'users', user.uid, 'palettes', hash);
    const isCurrentlySaved = savedPaletteHashes.has(hash);

    // Optimistic update
    setSavedPaletteHashes((prev) => {
      const newSet = new Set(prev);
      isCurrentlySaved ? newSet.delete(hash) : newSet.add(hash);
      return newSet;
    });

    try {
      if (isCurrentlySaved) {
        await deleteDoc(paletteRef);
      } else {
        await setDoc(paletteRef, {
          colors: paletteHexArray,
          createdAt: new Date(),
        });
        setShowSavedMessage(true);
        setTimeout(() => setShowSavedMessage(false), 2000);
      }
    } catch (error) {
      console.error('Error updating saved palettes:', error);
      setSavedPaletteHashes((prev) => {
        const newSet = new Set(prev);
        isCurrentlySaved ? newSet.add(hash) : newSet.delete(hash);
        return newSet;
      });
    }
  };

  return (
    <div className="relative min-h-screen w-screen bg-yellow-50 flex flex-col">
      <div className="absolute top-4 left-4">
        <button
          className="text-lg text-yellow-600 hover:text-yellow-800 font-semibold"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>
      </div>

      <div className="absolute top-4 right-4">
        <Link
          to="/saved"
          className="bg-yellow-400 text-white font-semibold px-4 py-2 rounded shadow hover:bg-yellow-500 transition"
        >
          💾 Saved Palettes
        </Link>
      </div>

      <div className="flex flex-1 items-center justify-center">
        <div className="flex flex-col items-center">
          <h2 className="text-3xl font-bold mb-6 text-yellow-700">
            Your MoodHue Palettes
          </h2>

          {showSavedMessage && (
            <div className="fixed top-6 right-6 bg-green-500 text-white px-4 py-2 rounded shadow z-50">
              ✅ Palette saved!
            </div>
          )}

          <div className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentPalettes.map((colors) => {
              const paletteHexArray = colors.map((c) => c.hex.value);
              const hash = getPaletteHash(paletteHexArray);
              const isSaved = savedPaletteHashes.has(hash);

              return (
                <div
                  key={hash}
                  className="relative border rounded-lg p-4 shadow bg-white pt-10"
                >
                  <div className="absolute top-3 right-3 z-10">
                    <button
                      onClick={() => handleToggleSave(colors)}
                      title={isSaved ? 'Unsave' : 'Save'}
                      className="focus:outline-none border-none bg-transparent p-0"
                    >
                      <i
                        className={isSaved ? 'bi bi-heart-fill' : 'bi bi-heart'}
                        style={{
                          color: isSaved ? 'lightpink' : 'gray',
                          fontSize: '1.6rem',
                          cursor: 'pointer',
                        }}
                      ></i>
                    </button>
                  </div>

                  <h3 className="font-semibold mb-2 text-gray-700">
                    Palette {currentPalettes.indexOf(colors) + 1}
                  </h3>

                  <div className="grid grid-cols-5 gap-2 mb-2">
                    {colors.map((color, i) => (
                      <div
                        key={i}
                        className="w-12 h-12 rounded"
                        style={{ backgroundColor: color.hex.value }}
                        title={color.hex.value}
                      />
                    ))}
                  </div>

                  <div className="flex justify-center space-x-2 mb-6 text-sm text-gray-600">
                    {paletteHexArray.map((hex, i) => (
                      <span key={i} className="font-mono">
                        {hex.toUpperCase()}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-10 flex justify-center">
            <button
              onClick={handleRegenerate}
              className="bg-yellow-500 text-white font-semibold px-6 py-3 rounded hover:bg-yellow-600 transition shadow"
            >
              🎲 Regenerate Palettes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
