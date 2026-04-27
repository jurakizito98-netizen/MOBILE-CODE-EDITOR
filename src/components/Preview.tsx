import React, { useMemo } from 'react';
import { FileNode } from '../types';

interface PreviewProps {
  files: FileNode[];
}

export const Preview: React.FC<PreviewProps> = ({ files }) => {
  const srcDoc = useMemo(() => {
    const htmlFile = files.find(f => f.name.endsWith('.html'));
    const cssFiles = files.filter(f => f.name.endsWith('.css'));
    const jsFiles = files.filter(f => f.name.endsWith('.js'));

    const htmlContent = htmlFile?.content || `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: system-ui; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; background: #020617; color: white; text-align: center; }
            .error-box { border: 2px dashed #334155; padding: 40px; border-radius: 20px; max-width: 300px; }
            h2 { color: #f43f5e; margin-bottom: 10px; font-weight: 800; }
            p { font-size: 14px; color: #94a3b8; }
          </style>
        </head>
        <body>
          <div class="error-box">
            <h2>No HTML Module</h2>
            <p>Create or rename a file to <b>index.html</b> to see your blog preview here.</p>
          </div>
        </body>
      </html>
    `;
    const cssStyle = cssFiles.map(f => `<style>${f.content}</style>`).join('\n');
    const jsScript = jsFiles.map(f => `<script>${f.content}</script>`).join('\n');

    // Inject styles and scripts before </body> or at the end
    if (htmlContent.includes('</body>')) {
      return htmlContent.replace('</body>', `${cssStyle}\n${jsScript}\n</body>`);
    }
    return `${htmlContent}\n${cssStyle}\n${jsScript}`;
  }, [files]);

  return (
    <div className="w-full h-full bg-white flex flex-col">
      <div className="h-8 bg-slate-100 border-b border-slate-200 flex items-center px-4 space-x-2">
        <div className="flex space-x-1">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
          <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
          <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
        </div>
        <div className="flex-1 bg-white border border-slate-200 rounded px-2 text-[10px] text-slate-400 font-mono flex items-center h-5">
          http://localhost:3000/preview.html
        </div>
      </div>
      <iframe
        title="Live Preview"
        srcDoc={srcDoc}
        className="flex-1 w-full border-none"
        sandbox="allow-scripts allow-modals"
      />
    </div>
  );
};
