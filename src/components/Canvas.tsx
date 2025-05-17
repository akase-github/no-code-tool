// src/components/Canvas.tsx
import React from 'react';

export type BlockType = 'text' | 'image' | 'button';

export interface BlockData {
  id: string;
  type: BlockType;
  content: string;
}

interface CanvasProps {
  blocks: BlockData[];
  onSelectBlock: (id: string) => void;
  selectedBlockId: string | null;
}

const Canvas: React.FC<CanvasProps> = ({ blocks, onSelectBlock, selectedBlockId }) => {
  return (
    <div
      style={{
        flex: 1,
        padding: '20px',
        minHeight: '100vh',
        backgroundColor: '#f7f7f7',
        overflowY: 'auto',
      }}
    >
      <h3 style={{ marginBottom: '10px' }}>キャンバス</h3>
      {blocks.map((block) => (
        <div
          key={block.id}
          onClick={() => onSelectBlock(block.id)}
          style={{
            border: block.id === selectedBlockId ? '2px solid #007bff' : '1px solid #ccc',
            background: '#fff',
            padding: '10px',
            marginBottom: '10px',
            cursor: 'pointer',
          }}
        >
          {block.type === 'text' && <p>{block.content}</p>}
          {block.type === 'image' && <img src={block.content} alt="画像" style={{ maxWidth: '100%' }} />}
          {block.type === 'button' && (
            <button style={{ padding: '8px 16px' }}>{block.content}</button>
          )}
        </div>
      ))}
    </div>
  );
};

export default Canvas;