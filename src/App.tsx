import React, { useState, useEffect, useRef } from 'react';
import { Menu, Search, Settings, Save, Play, ChevronRight, Github, Code2, Layers, Cpu, Radio, GitBranch } from 'lucide-react';
import { FileExplorer } from './components/FileExplorer';
import { Editor } from './components/Editor';
import { TabBar } from './components/TabBar';
import { MobileToolbar } from './components/MobileToolbar';
import { Preview } from './components/Preview';
import { GitPanel } from './components/GitPanel';
import { AssistantPanel } from './components/AssistantPanel';
import { FileNode, Commit } from './types';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';
import { Sparkles, BrainCircuit } from 'lucide-react';

const INITIAL_FILES: FileNode[] = [
  {
    id: '1',
    name: 'index.html',
    content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>JURADO KIDZ | Personal Blog</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <header>
        <div class="container">
            <h1 class="logo">JURADO<span>KIDZ</span></h1>
            <nav>
                <ul>
                    <li><a href="#hero">Home</a></li>
                    <li><a href="#about">About</a></li>
                    <li><a href="#blog">Blog</a></li>
                </ul>
            </nav>
        </div>
    </header>

    <section id="hero">
        <div class="hero-content">
            <h2>Coding the Future</h2>
            <p>Welcome to my personal digital garden where I share my journey in tech and mobile development.</p>
            <a href="#blog" class="btn">Read My Story</a>
        </div>
    </section>

    <section id="about" class="container">
        <h3 class="section-title">About Me</h3>
        <div class="about-card">
            <p>I am a creative developer focused on building the next generation of mobile experiences. JURADO KIDZ is my platform for exploring the intersection of AI, design, and code.</p>
        </div>
    </section>

    <section id="blog" class="container">
        <h3 class="section-title">Latest Articles</h3>
        <div class="blog-grid">
            <article class="post-card">
                <div class="post-image"></div>
                <div class="post-content">
                    <span class="tag">Mobile</span>
                    <h4>Building a Mobile Code Editor</h4>
                    <p>Exploring the challenges of creating a full-featured IDE for smartphones...</p>
                    <a href="#" class="more">Read More →</a>
                </div>
            </article>
            <article class="post-card">
                <div class="post-image secondary"></div>
                <div class="post-content">
                    <span class="tag">AI</span>
                    <h4>The Power of Gemini 3.1</h4>
                    <p>How AI is revolutionizing the way we write and understand code today...</p>
                    <a href="#" class="more">Read More →</a>
                </div>
            </article>
        </div>
    </section>

    <footer>
        <p>&copy; 2026 JURADO KIDZ. Built with Flow Mobile.</p>
    </footer>

    <script src="script.js"></script>
</body>
</html>`,
    language: 'html',
    lastModified: Date.now(),
  },
  {
    id: '2',
    name: 'styles.css',
    content: `/* JURADO KIDZ Blog Styles */
:root {
  --primary: #7c3aed;
  --secondary: #f43f5e;
  --bg: #020617;
  --card-bg: #0f172a;
  --text: #f8fafc;
  --text-muted: #94a3b8;
}

html { scroll-behavior: smooth; }

* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: 'Inter', system-ui, sans-serif;
  background-color: var(--bg);
  color: var(--text);
  line-height: 1.6;
}

.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 20px;
}

header {
  height: 80px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #1e293b;
  position: sticky;
  top: 0;
  background: rgba(2, 6, 23, 0.8);
  backdrop-filter: blur(10px);
  z-index: 100;
}

header .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.logo { font-size: 24px; font-weight: 800; letter-spacing: -1px; }
.logo span { color: var(--primary); }

nav ul { display: flex; list-style: none; gap: 20px; }
nav a { text-decoration: none; color: var(--text-muted); font-size: 14px; font-weight: 600; transition: color 0.3s; }
nav a:hover { color: var(--primary); }

#hero {
  height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  background: radial-gradient(circle at top right, #1e1b4b, var(--bg));
}

.hero-content h2 { font-size: clamp(32px, 8vw, 64px); font-weight: 900; margin-bottom: 10px; line-height: 1.1; }
.hero-content p { color: var(--text-muted); margin-bottom: 25px; max-width: 500px; margin-inline: auto; }

.btn {
  display: inline-block;
  padding: 12px 30px;
  background: var(--primary);
  color: white;
  text-decoration: none;
  border-radius: 50px;
  font-weight: 700;
  box-shadow: 0 10px 20px rgba(124, 58, 237, 0.3);
}

.section-title { margin: 80px 0 30px; font-size: 32px; font-weight: 800; letter-spacing: -1px; }

.about-card {
  background: linear-gradient(135deg, rgba(124,58,237,0.1), rgba(244,63,94,0.1));
  padding: 40px;
  border-radius: 30px;
  border: 1px solid rgba(255,255,255,0.05);
  font-size: 18px;
  color: var(--text-muted);
}

.blog-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
}

.post-card {
  background: var(--card-bg);
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid #1e293b;
  transition: transform 0.3s;
}

.post-card:hover { transform: translateY(-10px); border-color: var(--primary); }

.post-image { height: 180px; background: linear-gradient(45deg, #7c3aed, #ec4899); }
.post-image.secondary { background: linear-gradient(45deg, #3b82f6, #10b981); }

.post-content { padding: 25px; }

.tag {
  display: inline-block;
  font-size: 10px;
  font-weight: 800;
  color: var(--primary);
  text-transform: uppercase;
  margin-bottom: 10px;
}

.post-card h4 { font-size: 20px; margin-bottom: 10px; }
.post-card p { font-size: 14px; color: var(--text-muted); margin-bottom: 20px; }

.more { text-decoration: none; color: var(--primary); font-weight: 700; font-size: 14px; }

footer {
  text-align: center;
  padding: 60px 0;
  color: var(--text-muted);
  font-size: 12px;
  border-top: 1px solid #1e293b;
  margin-top: 100px;
}`,
    language: 'css',
    lastModified: Date.now(),
  },
  {
    id: '3',
    name: 'script.js',
    content: `// JURADO KIDZ Personal Blog Script
console.log("Welcome to JURADO KIDZ's digital world!");

document.addEventListener('DOMContentLoaded', () => {
    // Nav highlight observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                document.querySelectorAll('nav a').forEach(a => {
                    a.style.color = a.getAttribute('href') === '#' + id ? '#7c3aed' : '#94a3b8';
                });
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('section').forEach(s => observer.observe(s));
});`,
    language: 'javascript',
    lastModified: Date.now(),
  }
];

export default function App() {
  const [files, setFiles] = useState<FileNode[]>(() => {
    const saved = localStorage.getItem('mobile-editor-v4-files');
    return saved ? JSON.parse(saved) : INITIAL_FILES;
  });
  
  const [commits, setCommits] = useState<Commit[]>(() => {
    const saved = localStorage.getItem('mobile-editor-v4-commits');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeFileId, setActiveFileId] = useState<string | null>(files[0]?.id || null);
  const [openFileIds, setOpenFileIds] = useState<string[]>(files.map(f => f.id));
  const [isExplorerOpen, setIsExplorerOpen] = useState(window.innerWidth > 1024);
  const [isGitOpen, setIsGitOpen] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isSaved, setIsSaved] = useState(true);

  // Persistence
  useEffect(() => {
    localStorage.setItem('mobile-editor-v4-files', JSON.stringify(files));
  }, [files]);

  useEffect(() => {
    localStorage.setItem('mobile-editor-v4-commits', JSON.stringify(commits));
  }, [commits]);

  const activeFile = files.find(f => f.id === activeFileId);

  const handleFileSelect = (id: string) => {
    setActiveFileId(id);
    if (!openFileIds.includes(id)) {
      setOpenFileIds(prev => [...prev, id]);
    }
  };

  const handleCloseFile = (id: string) => {
    const newOpenIds = openFileIds.filter(oid => oid !== id);
    setOpenFileIds(newOpenIds);
    if (activeFileId === id) {
      setActiveFileId(newOpenIds[newOpenIds.length - 1] || null);
    }
  };

  const handleUpdateContent = (content: string) => {
    if (!activeFileId) return;
    setFiles(prev => prev.map(f => 
      f.id === activeFileId ? { ...f, content, lastModified: Date.now() } : f
    ));
    setIsSaved(false);
    setTimeout(() => setIsSaved(true), 1000);
  };

  const handleAddFile = (name: string, language: FileNode['language']) => {
    const newFile: FileNode = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      content: '',
      language,
      lastModified: Date.now(),
    };
    setFiles(prev => [...prev, newFile]);
    handleFileSelect(newFile.id);
  };

  const handleDeleteFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
    handleCloseFile(id);
  };

  const handleCommit = (message: string) => {
    const newCommit: Commit = {
      id: Math.random().toString(36).substr(2, 9),
      message,
      timestamp: Date.now(),
      files: JSON.parse(JSON.stringify(files)),
    };
    setCommits(prev => [newCommit, ...prev]);
    setIsGitOpen(false);
  };

  const insertSymbol = (symbol: string) => {
    if (!activeFileId) return;
    const currentFile = files.find(f => f.id === activeFileId);
    if (!currentFile) return;
    handleUpdateContent(currentFile.content + symbol);
  };

  return (
    <div className="flex flex-col h-screen bg-[#0f172a] text-slate-200 overflow-hidden select-none">
      {/* Header */}
      <header className="h-14 bg-slate-900/50 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-5 z-40">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setIsExplorerOpen(true)}
            className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-rose-500 flex items-center justify-center shadow-lg shadow-violet-600/30 active:scale-95 transition-all"
          >
            <div className="w-5 h-5 border-2 border-white rounded-sm rotate-45" />
          </button>
          <div className="flex flex-col">
            <span className="font-bold text-white tracking-widest text-xs uppercase italic">CodeFlow <span className="text-violet-400">Mobile</span></span>
            <div className="flex items-center space-x-2">
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-tighter">
                {activeFile?.name || 'No file'}
              </span>
              {!isSaved && <span className="w-1 h-1 bg-rose-500 rounded-full shadow-[0_0_5px_rgba(244,63,94,1)] animate-ping" />}
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setShowPreview(!showPreview)}
            className="px-3 py-1 bg-violet-600/15 text-violet-400 border border-violet-600/30 rounded-lg text-[9px] font-black tracking-widest uppercase"
          >
            {showPreview ? 'EDITOR' : 'PREVIEW'}
          </button>
          <div className="flex -space-x-2 border-l border-slate-800 pl-3">
             <div className="w-7 h-7 rounded-full bg-cyan-500 border-2 border-slate-950 flex items-center justify-center text-[10px] text-white font-black shadow-sm">JK</div>
             <div className="relative group">
                <div className="w-7 h-7 rounded-full bg-rose-500 border-2 border-slate-950 flex items-center justify-center text-[10px] text-white font-black shadow-sm">+{commits.length}</div>
             </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex relative w-full overflow-hidden bg-slate-950">
        <div className={cn(
          "transition-all duration-300 ease-in-out flex shrink-0 border-r border-slate-900 bg-slate-950/50 backdrop-blur-xl",
          isExplorerOpen ? "w-[280px]" : "w-0"
        )}>
           <FileExplorer
            files={files}
            activeFileId={activeFileId}
            onFileSelect={handleFileSelect}
            onAddFile={handleAddFile}
            onDeleteFile={handleDeleteFile}
            isOpen={isExplorerOpen}
            onClose={() => setIsExplorerOpen(false)}
          />
        </div>

        <div className="flex-1 flex flex-col relative overflow-hidden bg-slate-950">
          <TabBar
            files={files}
            activeFileId={activeFileId}
            openFileIds={openFileIds}
            onSelect={setActiveFileId}
            onClose={handleCloseFile}
          />
          
          <div className="flex-1 relative overflow-hidden bg-slate-950">
            {showPreview ? (
              <Preview files={files} />
            ) : activeFile ? (
              <>
                <Editor 
                  file={activeFile} 
                  onChange={handleUpdateContent} 
                  contextFiles={files}
                />
                {/* Floating Run Button */}
                <button 
                  onClick={() => setShowPreview(true)}
                  className="absolute bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-br from-violet-500 to-rose-500 shadow-2xl flex items-center justify-center text-white ring-4 ring-slate-900 active:scale-90 transition-all z-20"
                >
                  <Play className="w-6 h-6 fill-current ml-1" />
                </button>
              </>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 space-y-6 p-8 text-center bg-[radial-gradient(circle_at_center,_#1e293b_0%,_#020617_100%)]">
                <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-violet-600/20 to-rose-500/20 border border-slate-800 flex items-center justify-center">
                  <Menu className="w-10 h-10 text-violet-500 opacity-50" />
                </div>
                <div>
                  <p className="text-xl font-black text-white italic tracking-tighter uppercase">Ready to Flow?</p>
                  <p className="text-xs mt-2 text-slate-500 font-bold uppercase tracking-widest leading-loose max-w-[200px] mx-auto">Select a module from the explorer to begin development</p>
                </div>
                <button 
                  onClick={() => setIsExplorerOpen(true)}
                  className="px-8 py-3 bg-white text-slate-950 rounded-full font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-white/10"
                >
                  Open Projects
                </button>
              </div>
            )}
            
            {/* Status Bar Overlay */}
            {!showPreview && (
              <div className="absolute bottom-6 left-6 right-6 h-10 bg-slate-900/90 border border-slate-800 rounded-2xl flex items-center px-4 justify-between shadow-2xl backdrop-blur-xl z-10 hidden sm:flex">
                <div className="flex gap-4 items-center">
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span className="text-[9px] font-black text-emerald-500 uppercase tracking-tighter">Main: 12ms</span>
                  </div>
                  <div className="h-3 w-[1px] bg-slate-800" />
                  <span className="text-[9px] text-slate-500 font-bold">Ln 1, Col 1</span>
                </div>
                <div className="flex gap-4 items-center">
                  <span className="text-[9px] font-black text-violet-400 uppercase tracking-tighter">{activeFile?.language?.toUpperCase() || 'TEXT'}</span>
                  <span className="text-[9px] text-slate-500 font-bold">UTF-8</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side Panels */}
        <div className={cn(
          "transition-all duration-300 ease-in-out flex shrink-0 border-l border-slate-900 bg-slate-950",
          isAssistantOpen ? "w-[320px]" : "w-0"
        )}>
          <AssistantPanel
            isOpen={isAssistantOpen}
            onClose={() => setIsAssistantOpen(false)}
            activeFile={activeFile}
            allFiles={files}
          />
        </div>

        <GitPanel
          files={files}
          commits={commits}
          onCommit={handleCommit}
          isOpen={isGitOpen}
          onClose={() => setIsGitOpen(false)}
        />
      </main>

      {/* Footer / Mobile Nav */}
      <footer className="safe-area-bottom">
        <AnimatePresence>
          {activeFile && !showPreview && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
            >
              <MobileToolbar onInsert={insertSymbol} />
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="h-16 bg-slate-950 border-t border-slate-900 flex items-center justify-around px-2 relative">
          <div className={cn("flex flex-col items-center gap-1 cursor-pointer transition-all active:scale-90", isExplorerOpen ? "opacity-100" : "opacity-40")} onClick={() => { setIsExplorerOpen(true); setIsGitOpen(false); }}>
            <div className={cn("w-6 h-6 border-2 rounded-lg flex items-center justify-center text-[7px] font-black transition-colors", isExplorerOpen ? "border-violet-500 text-violet-500" : "border-slate-700 text-slate-700")}>APP</div>
            <span className={cn("text-[8px] font-black uppercase tracking-tighter transition-colors", isExplorerOpen ? "text-violet-500" : "text-slate-700")}>Explorer</span>
          </div>
          
          <div className={cn("flex flex-col items-center gap-1 cursor-pointer transition-all active:scale-90", showPreview ? "opacity-100" : "opacity-40")} onClick={() => setShowPreview(!showPreview)}>
            <div className={cn("w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors", showPreview ? "border-violet-500" : "border-slate-700")}>
              <div className={cn("w-2 h-2 rounded-full transition-colors", showPreview ? "bg-violet-500" : "bg-slate-700")} />
            </div>
            <span className={cn("text-[8px] font-black uppercase tracking-tighter transition-colors", showPreview ? "text-violet-500" : "text-slate-700")}>Preview</span>
          </div>

          <div className={cn("flex flex-col items-center gap-1 cursor-pointer transition-all active:scale-90", isGitOpen ? "opacity-100" : "opacity-40")} onClick={() => { setIsGitOpen(true); setIsExplorerOpen(false); setIsAssistantOpen(false); }}>
            <div className="relative">
              <div className={cn("w-6 h-6 border-2 rounded-sm rotate-45 transition-colors", isGitOpen ? "border-emerald-500" : "border-slate-700")} />
              {!isSaved && <div className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full shadow-[0_0_8px_rgba(244,63,94,0.6)]" />}
            </div>
            <span className={cn("text-[8px] font-black uppercase tracking-tighter transition-colors", isGitOpen ? "text-emerald-500" : "text-slate-700")}>Git</span>
          </div>

          <div className={cn("flex flex-col items-center gap-1 cursor-pointer transition-all active:scale-90", isAssistantOpen ? "opacity-100" : "opacity-40")} onClick={() => { setIsAssistantOpen(true); setIsExplorerOpen(false); setIsGitOpen(false); }}>
            <div className={cn("w-6 h-6 border-2 rounded-lg flex items-center justify-center transition-colors", isAssistantOpen ? "border-violet-500" : "border-slate-700")}>
              <BrainCircuit className={cn("w-3.5 h-3.5", isAssistantOpen ? "text-violet-500" : "text-slate-700")} />
            </div>
            <span className={cn("text-[8px] font-black uppercase tracking-tighter transition-colors", isAssistantOpen ? "text-violet-500" : "text-slate-700")}>AI Bot</span>
          </div>

           <div className="flex flex-col items-center gap-1 opacity-20 cursor-not-allowed">
            <div className="w-5 h-5 grid grid-cols-2 gap-0.5">
              <div className="bg-white rounded-sm"></div><div className="bg-white rounded-sm"></div>
              <div className="bg-white rounded-sm"></div><div className="border-2 border-white rounded-sm"></div>
            </div>
            <span className="text-[8px] font-black text-white uppercase tracking-tighter transition-colors">Nodes</span>
          </div>
          
          <div className="flex flex-col items-center gap-1 opacity-20 cursor-not-allowed">
            <div className="w-5 h-5 border-2 border-slate-700 rounded-full flex items-center justify-center">
              <div className="w-3 h-0.5 bg-slate-700" />
            </div>
            <span className="text-[8px] font-black text-slate-700 uppercase tracking-tighter transition-colors">Trace</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
