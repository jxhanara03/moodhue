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
  const palettes = location.state?.palettes || [];

  const [savedPaletteHashes, setSavedPaletteHashes] = useState(new Set());
  const [showSavedMessage, setShowSavedMessage] = useState(false);
  const user = auth.currentUser;

  const getPaletteHash = (paletteHexArray) =>
    paletteHexArray.map((hex) => hex.replace('#', '')).join('-');

  // ✅ Live real-time listener, no manual refresh needed
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

  const handleToggleSave = async (palette) => {
    if (!user) {
      alert('Please log in to save palettes.');
      return;
    }

    const paletteHexArray = palette.map((color) => color.hex.value);
    const hash = getPaletteHash(paletteHexArray);
    const paletteRef = doc(db, 'users', user.uid, 'palettes', hash);
    const isCurrentlySaved = savedPaletteHashes.has(hash);

    // ✅ Optimistic UI update (instant heart change)
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

      // Optional rollback on failure
      setSavedPaletteHashes((prev) => {
        const newSet = new Set(prev);
        isCurrentlySaved ? newSet.add(hash) : newSet.delete(hash);
        return newSet;
      });
    }
  };

  return (
    <div className="relative min-h-screen w-screen bg-yellow-50 flex flex-col">
      {/* Top-left Back Button */}
      <div className="absolute top-4 left-4">
        <button
          className="text-lg text-yellow-600 hover:text-yellow-800 font-semibold"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>
      </div>

      {/* Top-right Saved Palettes Button */}
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
            {palettes.map((colors, index) => {
              const paletteHexArray = colors.map((c) => c.hex.value);
              const hash = getPaletteHash(paletteHexArray);
              const isSaved = savedPaletteHashes.has(hash);

              return (
                <div
                  key={index}
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
                          pointerEvents: 'none',
                        }}
                      ></i>
                    </button>
                  </div>

                  <h3 className="font-semibold mb-2 text-gray-700">
                    Palette {index + 1}
                  </h3>

                  <div className="grid grid-cols-5 gap-2 mb-6">
                    {colors.map((color, i) => (
                      <div
                        key={i}
                        className="w-12 h-12 rounded"
                        style={{ backgroundColor: color.hex.value }}
                        title={color.hex.value}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
