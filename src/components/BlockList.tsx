import React from 'react';
import { BlockType } from '../types/types';
import TemplateManager from './TemplateManager';

interface BlockListProps {
  onAddBlock: (type: BlockType) => void;
  onTemplateSelect: (templateId: string) => void;
}

const BlockList: React.FC<BlockListProps> = ({ onAddBlock, onTemplateSelect }) => {
  const blocks: { type: BlockType; label: string }[] = [
    { type: 'image', label: '🖼️ 画像' },
    { type: 'button', label: '🔘 画像ボタン' },
    { type: 'custom', label: '🧩 カスタム' },
  ];

  return (
    <div>
      <TemplateManager onSelectTemplateId={onTemplateSelect} />

      <div className="group">
        <h3 className="section-title">ブロック一覧</h3>
        {blocks.map((block) => (
          <button
            key={block.type}
            onClick={() => onAddBlock(block.type)}
            className="ui-button block-button"
          >
            {block.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default BlockList;
