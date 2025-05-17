// src/components/PropertiesPanel.tsx
import React from 'react';
import { BlockData } from './Canvas';

interface PropertiesPanelProps {
  selectedBlock: BlockData | null;
  onUpdateBlock: (updatedBlock: BlockData) => void;
}

const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  selectedBlock,
  onUpdateBlock,
}) => {
  if (!selectedBlock) return null;

  const handleContentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateBlock({ ...selectedBlock, content: e.target.value });
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: '#fff',
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '16px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        zIndex: 1000,
        minWidth: '300px',
      }}
    >
      <h4>プロパティ編集</h4>
      <div style={{ marginTop: 10 }}>
        <label>
          コンテンツ:
          <input
            type="text"
            value={selectedBlock.content}
            onChange={handleContentChange}
            style={{ width: '100%', marginTop: '5px', padding: '6px' }}
          />
        </label>
      </div>
    </div>
  );
};

export default PropertiesPanel;
