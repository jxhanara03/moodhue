import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import {
  collection,
  onSnapshot,
  setDoc,
  deleteDoc,
  doc,
  query,
  limit,
} from 'firebase/firestore';

export default function SavedPalettes() {
  const [savedPalettes, setSavedPalettes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) {
      setSavedPalettes([]);
      setLoading(false);
      return;
    }

    const palettesRef = collection(db, 'users', user.uid, 'palettes');
    const limitedQuery = query(palettesRef, limit(10));

    const unsubscribe = onSnapshot(
      limitedQuery,
      (snapshot) => {
        const palettes = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          colors: docSnap.data().colors?.slice(0, 5) || [],
        }));

        setSavedPalettes(palettes);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching saved palettes:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const handleSave = async (palette) => {
    if (!user) return;

    const paletteRef = doc(db, 'users', user.uid, 'palettes', palette.id);

    try {
      await setDoc(paletteRef, {
        colors: palette.colors,
      });
    } catch (error) {
      console.error('Error saving palette:', error);
    }
  };

  const handleUnsave = async (paletteId) => {
    if (!user) return;

    const paletteRef = doc(db, 'users', user.uid, 'palettes', paletteId);

    try {
      await deleteDoc(paletteRef);
    } catch (error) {
      console.error('Error unsaving palette:', error);
    }
  };

  const isPaletteSaved = (id) => savedPalettes.some((p) => p.id === id);

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

      {/* Centered Saved Palettes */}
      <div className="flex flex-1 items-center justify-center">
        <div className="flex flex-col items-center">
          <h2 className="text-3xl font-bold mb-6 text-yellow-700">
            Your Saved Palettes
          </h2>

          {loading ? (
            <p className="text-gray-600">Loading palettes...</p>
          ) : savedPalettes.length === 0 ? (
            <p className="text-gray-600">No palettes saved yet.</p>
          ) : (
            <div className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {savedPalettes.map((palette, index) => (
                <div
                  key={palette.id}
                  className="relative border rounded-lg p-4 shadow bg-white pt-10"
                >
                  <div className="absolute top-3 right-3 z-10">
                    <button
                      onClick={() =>
                        isPaletteSaved(palette.id)
                          ? handleUnsave(palette.id)
                          : handleSave(palette)
                      }
                      title={isPaletteSaved(palette.id) ? 'Unsave' : 'Save'}
                      className="focus:outline-none border-none"
                      style={{
                        background: 'transparent',
                        padding: 0,
                      }}
                    >
                      <i
                        className={`bi ${
                          isPaletteSaved(palette.id)
                            ? 'bi-heart-fill'
                            : 'bi-heart'
                        }`}
                        style={{
                          color: isPaletteSaved(palette.id)
                            ? 'lightpink'
                            : '#ccc',
                          fontSize: '1.6rem',
                          cursor: 'pointer',
                        }}
                      ></i>
                    </button>
                  </div>

                  <h3 className="font-semibold mb-2 text-gray-700">
                    Palette {index + 1}
                  </h3>

                  <div className="grid grid-cols-5 gap-2 mb-6">
                    {palette.colors.map((hex, i) => (
                      <div
                        key={i}
                        className="w-12 h-12 rounded"
                        style={{ backgroundColor: hex }}
                        title={hex}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
