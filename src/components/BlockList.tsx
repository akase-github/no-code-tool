// src/components/BlockList.tsx
import React from 'react';
import { BlockType } from '../type';


interface BlockListProps {
  onAddBlock: (type: BlockType) => void;
}

const BlockList: React.FC<BlockListProps> = ({ onAddBlock }) => {
  const blocks: { type: BlockType; label: string }[] = [
    { type: 'text', label: '📝 テキスト' },
    { type: 'image', label: '🖼️ 画像' },
    { type: 'button', label: '🔘 ボタン' },
  ];

  return (
    <div style={{ width: '180px', borderRight: '1px solid #ccc', padding: '10px' }}>
      <h3>ブロック一覧</h3>
      {blocks.map((block) => (
        <button
          key={block.type}
          onClick={() => onAddBlock(block.type)}
          style={{
            display: 'block',
            width: '100%',
            marginBottom: '10px',
            padding: '10px',
            cursor: 'pointer',
          }}
        >
          {block.label}
        </button>
      ))}
    </div>
  );
};

export default BlockList;
