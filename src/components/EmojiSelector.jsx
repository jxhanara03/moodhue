import React from 'react';

const emojis = [
  { emoji: '😌', label: 'calm' },
  { emoji: '😭', label: 'sad' },
  { emoji: '😡', label: 'angry' },
  { emoji: '🥰', label: 'romantic' },
  { emoji: '🤩', label: 'excited' },
];


export default function EmojiSelector({ selectedMood, onSelect }) {
    return (
      <div className="flex flex-wrap justify-center gap-6 mb-6">
        {emojis.map((item) => (
          <button
            key={item.label}
            onClick={() => onSelect(item.label)}
            className={`focus:outline-none transition-transform hover:scale-110 ${
              selectedMood === item.label ? 'ring-4 ring-yellow-500 rounded-full' : ''
            }`}
          >
            <span
              role="img"
              aria-label={item.label}
              className="text-5xl"
            >
              {item.emoji}
            </span>
          </button>
        ))}
      </div>
    );
  }