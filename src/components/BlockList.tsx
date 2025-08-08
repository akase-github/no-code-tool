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
    <div>
      <div className="group">
        <h3 className="section-title">テンプレート</h3>
        <select
          onChange={(e) => onTemplateSelect(e.target.value)}
          className="ui-select"
          style={{ marginBottom: '10px' }}
        >
          <option value="">⚠️テンプレートを選択してください</option>
          {templates.map((tpl) => (
            <option key={tpl.id} value={tpl.id}>
              {tpl.name}
            </option>
          ))}
        </select>
      </div>

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
