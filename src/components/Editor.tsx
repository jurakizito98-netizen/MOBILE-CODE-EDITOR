import React, { useRef, useState } from 'react';
import CodeMirror, { ReactCodeMirrorRef, EditorView } from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { oneDark } from '@codemirror/theme-one-dark';
import { FileNode } from '../types';
import { Sparkles, Loader2, BrainCircuit } from 'lucide-react';
import { getCodeCompletion, chatWithAI } from '../services/geminiService';

interface EditorProps {
  file: FileNode;
  onChange: (content: string) => void;
  contextFiles: FileNode[];
}

export const Editor: React.FC<EditorProps> = ({ file, onChange, contextFiles }) => {
  const [isAiLoading, setIsAiLoading] = useState(false);
  const editorRef = useRef<ReactCodeMirrorRef>(null);

  const getExtensions = () => {
    const exts = [];
    switch (file.language) {
      case 'javascript':
        exts.push(javascript({ jsx: true }));
        break;
      case 'html':
        exts.push(html());
        break;
      case 'css':
        exts.push(css());
        break;
    }
    return exts;
  };

  const handleAiSuggest = async () => {
    const view = editorRef.current?.view;
    if (!view || isAiLoading) return;

    const selection = view.state.selection.main;
    const content = view.state.doc.toString();
    const prefix = content.substring(0, selection.from);
    const suffix = content.substring(selection.to);

    setIsAiLoading(true);
    try {
      const completion = await getCodeCompletion(
        prefix,
        suffix,
        file.name,
        file.language,
        contextFiles
      );

      if (completion) {
        view.dispatch({
          changes: {
            from: selection.from,
            to: selection.to,
            insert: completion,
          },
          selection: { anchor: selection.from + completion.length }
        });
      }
    } catch (err) {
      console.error("AI Completion Failed:", err);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleMagicRefactor = async () => {
    if (isAiLoading) return;
    setIsAiLoading(true);
    
    try {
      const messages = [
        { role: 'user' as const, content: `Please refactor and optimize this file content. Return ONLY the refactored code without markdown blocks or explanations.\n\nFILE: ${file.name}\nCONTENT:\n${file.content}` }
      ];
      const result = await chatWithAI(messages, file, contextFiles);
      // Clean up potential markdown blocks if AI ignored instructions
      const cleaned = result.replace(/^```[a-z]*\n/i, '').replace(/\n```$/i, '').trim();
      if (cleaned && cleaned !== file.content) {
        onChange(cleaned);
      }
    } catch (err) {
      console.error("Magic Refactor Failed:", err);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="flex-1 h-full relative overflow-hidden bg-[#282c34]">
      {/* CodeMirror omitted for brevity in target content matching */}
      <CodeMirror
        ref={editorRef}
        value={file.content}
        height="100%"
        theme={oneDark}
        extensions={getExtensions()}
        onChange={onChange}
        basicSetup={{
          lineNumbers: true,
          foldGutter: true,
          dropCursor: true,
          allowMultipleSelections: true,
          indentOnInput: true,
          highlightActiveLine: true,
          bracketMatching: true,
          closeBrackets: true,
          autocompletion: true,
          rectangularSelection: true,
          crosshairCursor: true,
        }}
        className="text-[14px] sm:text-[16px] h-full"
      />

      {/* Floating AI Buttons Container */}
      <div className="absolute bottom-24 right-6 flex flex-col gap-3 z-20">
        <button 
          onClick={handleMagicRefactor}
          disabled={isAiLoading}
          className="w-12 h-12 rounded-2xl bg-indigo-600 text-white shadow-2xl flex items-center justify-center active:scale-95 transition-all border-2 border-slate-900 group"
          title="Magic Refactor"
        >
          {isAiLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <BrainCircuit className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          )}
          <div className="absolute right-14 bg-slate-950 text-white text-[9px] font-black py-1.5 px-3 rounded-lg border border-slate-800 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest shadow-xl">
            Refactor File
          </div>
        </button>

        <button 
          onClick={handleAiSuggest}
          disabled={isAiLoading}
          className="w-12 h-12 rounded-2xl bg-white text-slate-950 shadow-2xl flex items-center justify-center active:scale-95 transition-all border-2 border-slate-900 group"
          title="AI Suggest (Inline Autocomplete)"
        >
          {isAiLoading ? (
            <Loader2 className="w-5 h-5 animate-spin text-violet-600" />
          ) : (
            <Sparkles className="w-5 h-5 text-violet-600 group-hover:scale-110 transition-transform" />
          )}
          <div className="absolute right-14 bg-slate-950 text-white text-[9px] font-black py-1.5 px-3 rounded-lg border border-slate-800 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest shadow-xl">
            Autocomplete
          </div>
        </button>
      </div>
    </div>
  );
};
