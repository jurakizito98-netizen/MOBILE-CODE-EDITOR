export interface FileNode {
  id: string;
  name: string;
  content: string;
  language: 'javascript' | 'html' | 'css' | 'markdown' | 'text';
  lastModified: number;
}

export interface Commit {
  id: string;
  message: string;
  timestamp: number;
  files: FileNode[]; // Snapshot of all files at this point
}

export interface EditorState {
  files: FileNode[];
  activeFileId: string | null;
  openFileIds: string[];
  commits: Commit[];
}
