export type FileOperation = {
  path: string;
  content: string;
};

export type StreamingChunk = {
  type: 'analysis' | 'error';
  content?: string;
  error?: string;
};

export type builddrrOperation =
  | { type: "write"; path: string; content: string }
  | { type: "delete"; path: string }
  | { type: "rename"; oldPath: string; newPath: string }
  | { type: "dependency"; dependency: string };
