import React from 'react';
import { Folder, FileJson, FileCode, FileText, Plus, X, Trash2, Edit2 } from 'lucide-react';
import { FileNode } from '../types';
import { cn } from '../lib/utils';

interface FileExplorerProps {
  files: FileNode[];
  activeFileId: string | null;
  onFileSelect: (id: string) => void;
  onAddFile: (name: string, language: FileNode['language']) => void;
  onDeleteFile: (id: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const FileExplorer: React.FC<FileExplorerProps> = ({
  files,
  activeFileId,
  onFileSelect,
  onAddFile,
  onDeleteFile,
  isOpen,
  onClose,
}) => {
  const [isAdding, setIsAdding] = React.useState(false);
  const [newFileName, setNewFileName] = React.useState('');

  const handleAdd = () => {
    if (!newFileName) return;
    const ext = newFileName.split('.').pop();
    let lang: FileNode['language'] = 'text';
    if (ext === 'js' || ext === 'ts' || ext === 'tsx') lang = 'javascript';
    if (ext === 'html') lang = 'html';
    if (ext === 'css') lang = 'css';
    if (ext === 'md') lang = 'markdown';
    
    onAddFile(newFileName, lang);
    setNewFileName('');
    setIsAdding(false);
  };

  const getIcon = (language: FileNode['language']) => {
    switch (language) {
      case 'javascript': return <FileJson className="w-4 h-4 text-yellow-400" />;
      case 'html': return <FileCode className="w-4 h-4 text-orange-400" />;
      case 'css': return <FileCode className="w-4 h-4 text-blue-400" />;
      default: return <FileText className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div 
        className={cn(
          "fixed lg:relative top-0 left-0 h-full w-[280px] bg-slate-950/95 lg:bg-transparent backdrop-blur-xl lg:backdrop-blur-none z-50 border-r border-slate-800 lg:border-none flex flex-col transition-all duration-300 ease-in-out transform",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="p-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
             <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-violet-600 to-rose-500 flex items-center justify-center">
                <div className="w-3 h-3 border border-white rounded-sm rotate-45"></div>
             </div>
            <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Explorer</span>
          </div>
          <button 
            onClick={() => setIsAdding(true)}
            className="p-1.5 hover:bg-slate-800 rounded-lg transition-colors border border-transparent hover:border-slate-700"
          >
            <Plus className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-2">
          {isAdding && (
            <div className="px-5 py-2 flex flex-col space-y-2">
              <input
                autoFocus
                type="text"
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                placeholder="file.js"
                className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-slate-200 focus:ring-1 focus:ring-violet-500 outline-none shadow-inner"
              />
              <div className="flex space-x-2">
                <button onClick={handleAdd} className="flex-1 bg-violet-600 text-white text-xs py-2 rounded-lg font-bold shadow-lg shadow-violet-600/20 active:scale-95">Add</button>
                <button onClick={() => setIsAdding(false)} className="flex-1 bg-slate-800 text-slate-300 text-xs py-2 rounded-lg active:scale-95">Cancel</button>
              </div>
            </div>
          )}

          {files.length === 0 && !isAdding && (
            <div className="px-5 py-12 text-center">
              <p className="text-slate-600 text-xs font-bold uppercase tracking-widest">No Projects</p>
            </div>
          )}

          <div className="px-3 space-y-1">
            {files.map((file) => (
              <div
                key={file.id}
                className={cn(
                  "group flex items-center justify-between px-3 py-2.5 cursor-pointer rounded-xl transition-all duration-200 active:scale-[0.98]",
                  activeFileId === file.id 
                    ? "bg-violet-600/10 text-violet-300 shadow-sm" 
                    : "hover:bg-slate-900/50 text-slate-400"
                )}
                onClick={() => {
                  onFileSelect(file.id);
                  onClose();
                }}
              >
                <div className="flex items-center space-x-3 overflow-hidden">
                  <div className={cn(
                    "w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold italic shadow-sm",
                    file.language === 'javascript' ? 'bg-cyan-500/20 text-cyan-400' :
                    file.language === 'html' ? 'bg-rose-500/20 text-rose-400' :
                    file.language === 'css' ? 'bg-violet-500/20 text-violet-400' :
                    'bg-slate-800 text-slate-400'
                  )}>
                    {file.language === 'javascript' ? 'JS' : file.language === 'html' ? 'HTML' : file.language === 'css' ? 'CSS' : '#'}
                  </div>
                  <span className={cn(
                    "text-sm truncate transition-colors",
                    activeFileId === file.id ? "text-white font-semibold" : ""
                  )}>
                    {file.name}
                  </span>
                  {activeFileId === file.id && (
                    <div className="w-1.5 h-1.5 rounded-full bg-violet-400 shadow-[0_0_8px_rgba(167,139,250,0.6)] animate-pulse" />
                  )}
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteFile(file.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-rose-500/20 rounded-lg transition-all"
                >
                  <Trash2 className="w-4 h-4 text-rose-400" />
                </button>
              </div>
            ))}
          </div>
        </div>
        
        <div className="p-5 border-t border-slate-800">
           <div className="flex items-center gap-2 mb-3">
             <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Storage Status</span>
           </div>
           <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
             <div className="h-full w-2/3 bg-gradient-to-r from-violet-600 to-rose-500"></div>
           </div>
        </div>
      </div>
    </>
  );
};
