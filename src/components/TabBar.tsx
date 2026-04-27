import React from 'react';
import { X, FileCode } from 'lucide-react';
import { FileNode } from '../types';
import { cn } from '../lib/utils';

interface TabBarProps {
  files: FileNode[];
  activeFileId: string | null;
  openFileIds: string[];
  onSelect: (id: string) => void;
  onClose: (id: string) => void;
}

export const TabBar: React.FC<TabBarProps> = ({
  files,
  activeFileId,
  openFileIds,
  onSelect,
  onClose,
}) => {
  const activeFiles = files.filter(f => openFileIds.includes(f.id));

  return (
    <div className="w-full bg-slate-900 overflow-x-auto flex border-b border-slate-800 no-scrollbar">
      {activeFiles.map((file) => (
        <div
          key={file.id}
          className={cn(
            "flex items-center space-x-3 px-5 py-3 min-w-[140px] border-r border-slate-800 cursor-pointer transition-all relative",
            activeFileId === file.id 
              ? "bg-slate-950" 
              : "bg-slate-900 hover:bg-slate-800/50"
          )}
          onClick={() => onSelect(file.id)}
        >
          {activeFileId === file.id && (
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-violet-500 shadow-[0_0_10px_rgba(139,92,246,0.5)]" />
          )}
          <span className={cn(
            "text-[10px] font-bold italic",
            file.language === 'javascript' ? 'text-cyan-400' : 
            file.language === 'html' ? 'text-rose-400' : 'text-violet-400'
          )}>
            {file.language === 'javascript' ? 'JS' : file.language === 'html' ? 'HTML' : file.language === 'css' ? 'CSS' : '#'}
          </span>
          <span className={cn(
            "text-xs font-semibold truncate flex-1 tracking-tight",
            activeFileId === file.id ? "text-white" : "text-slate-500"
          )}>
            {file.name}
          </span>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onClose(file.id);
            }}
            className="p-1 hover:bg-slate-700/50 rounded-full text-slate-600 hover:text-slate-200 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
