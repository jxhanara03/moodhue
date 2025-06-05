import { useState } from 'react';

export default function MoodForm({ onGenerate, onTyping }) {
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description.trim()) return;

    onGenerate(description);
    setDescription(''); 
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mt-4 text-center">
      <input
        type="text"
        placeholder="Or type your own vibe... e.g., sunset at the beach"
        value={description}
        onChange={(e) => {
            setDescription(e.target.value)
            onTyping();
        }}
        className="w-full px-4 py-2 border border-yellow-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 mb-4 text-lg"
      />

      <button
        type="submit"
        disabled={!description.trim()}
        className="px-6 py-2 bg-yellow-500 text-white font-semibold rounded hover:bg-yellow-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Generate Palette
      </button>
    </form>
  );
}
