import React from 'react';

const SYMBOLS = ['{', '}', '[', ']', '(', ')', ';', '=', '<', '>', '/', '\\', '"', "'", '`', '!', '?', ':', '&', '|', '#', '$'];

interface MobileToolbarProps {
  onInsert: (symbol: string) => void;
}

export const MobileToolbar: React.FC<MobileToolbarProps> = ({ onInsert }) => {
  return (
    <div className="w-full bg-slate-900/90 backdrop-blur-md border-t border-slate-800 h-14 flex items-center overflow-x-auto px-2 space-x-2 no-scrollbar shadow-2xl">
      {SYMBOLS.map((symbol) => (
        <button
          key={symbol}
          onClick={() => onInsert(symbol)}
          className="active:bg-violet-600 active:scale-90 transition-all flex-shrink-0 w-10 h-10 flex items-center justify-center bg-slate-800 rounded-lg text-slate-200 font-bold text-sm shadow-sm border border-slate-700/50"
        >
          {symbol}
        </button>
      ))}
    </div>
  );
};
