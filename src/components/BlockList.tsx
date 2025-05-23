import React from 'react';
import { BlockType } from '../types/types';
import { templates } from '../templates/templates';

interface BlockListProps {
  onAddBlock: (type: BlockType) => void;
  onTemplateSelect: (templateId: string) => void;
}

const BlockList: React.FC<BlockListProps> = ({ onAddBlock, onTemplateSelect }) => {
  const blocks: { type: BlockType; label: string }[] = [
    { type: 'text', label: '📝 テキスト' },
    { type: 'image', label: '🖼️ 画像' },
    { type: 'button', label: '🔘 画像ボタン' },
  ];

  return (
    <div style={{ width: '180px', borderRight: '1px solid #ccc', padding: '10px' }}>
      <h3>テンプレート</h3>
      <select
        onChange={(e) => onTemplateSelect(e.target.value)}
        style={{ width: '100%', marginBottom: '20px', padding: '5px' }}
      >
        <option value="">テンプレートを選択</option>
        {templates.map((tpl) => (
          <option key={tpl.id} value={tpl.id}>
            {tpl.name}
          </option>
        ))}
      </select>

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
