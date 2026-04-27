import React, { useState } from 'react';
import { GitBranch, GitCommit, GitPullRequest, History, CheckCircle2, Circle } from 'lucide-react';
import { Commit, FileNode } from '../types';
import { cn } from '../lib/utils';

interface GitPanelProps {
  files: FileNode[];
  commits: Commit[];
  onCommit: (message: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const GitPanel: React.FC<GitPanelProps> = ({
  files,
  commits,
  onCommit,
  isOpen,
  onClose,
}) => {
  const [commitMessage, setCommitMessage] = useState('');

  const handleCommit = () => {
    if (!commitMessage.trim()) return;
    onCommit(commitMessage);
    setCommitMessage('');
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-[60] lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div 
        className={cn(
          "fixed top-0 left-0 h-full w-[300px] bg-slate-950/95 backdrop-blur-xl z-[70] border-r border-slate-800 flex flex-col transition-all duration-300 ease-in-out transform",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
             <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                <GitBranch className="w-5 h-5" />
             </div>
            <span className="text-xs font-black uppercase tracking-widest text-slate-400">Source Control</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Commit Area */}
          <div className="p-5 space-y-4">
            <div className="space-y-2">
              <textarea
                value={commitMessage}
                onChange={(e) => setCommitMessage(e.target.value)}
                placeholder="Commit message (e.g., 'Initial layout')"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none resize-none h-24 shadow-inner"
              />
              <button 
                onClick={handleCommit}
                disabled={!commitMessage.trim()}
                className="w-full bg-emerald-600 disabled:opacity-50 disabled:bg-slate-800 text-white text-xs font-black uppercase py-4 rounded-xl shadow-lg shadow-emerald-900/40 active:scale-95 transition-all flex items-center justify-center space-x-2"
              >
                <GitCommit className="w-4 h-4" />
                <span>Commit Snapshot</span>
              </button>
            </div>

            <div className="pt-4 border-t border-slate-900">
              <h3 className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-4">Version History</h3>
              {commits.length === 0 ? (
                <div className="py-8 text-center bg-slate-900/30 rounded-2xl border border-dashed border-slate-800">
                  <p className="text-[10px] text-slate-700 font-bold uppercase tracking-tighter">No Commits Yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {commits.map((commit, idx) => (
                    <div key={commit.id} className="relative pl-6 group">
                      {/* Timeline line */}
                      {idx !== commits.length - 1 && (
                        <div className="absolute left-[7px] top-4 bottom-[-16px] w-[1px] bg-slate-800 group-hover:bg-emerald-800 transition-colors" />
                      )}
                      
                      {/* Node */}
                      <div className="absolute left-0 top-1 w-4 h-4 rounded-full bg-slate-900 border-2 border-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)] z-10" />
                      
                      <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800 group-hover:border-slate-700 transition-all">
                        <p className="text-xs font-bold text-slate-200 line-clamp-2">{commit.message}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-[9px] text-slate-600 font-mono font-bold">{commit.id.substring(0, 7)}</span>
                          <span className="text-[9px] text-slate-600 font-bold">{new Date(commit.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-5 bg-slate-900/50 border-t border-slate-800">
          <button className="w-full py-3 bg-violet-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-violet-900/20 active:scale-95 transition-all flex items-center justify-center space-x-2">
            <GitPullRequest className="w-4 h-4" />
            <span>Push to Cloud</span>
          </button>
        </div>
      </div>
    </>
  );
};
