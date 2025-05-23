import React from 'react';
import { BlockData } from '../types/types';

interface PropertiesPanelProps {
  selectedBlock: BlockData | null;
  onUpdateBlock: (updatedBlock: BlockData) => void;
}

const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  selectedBlock,
  onUpdateBlock,
}) => {
  if (!selectedBlock) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onUpdateBlock({ ...selectedBlock, [name]: value });
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

      {/* テキストブロック用 */}
      {selectedBlock.type === 'text' && (
        <label style={{ display: 'block', marginTop: '10px' }}>
          テキスト内容：
          <input
            type="text"
            name="text"
            value={selectedBlock.text}
            onChange={handleChange}
            style={{ width: '100%', marginTop: '5px', padding: '6px' }}
          />
        </label>
      )}

      {/* 画像ブロック用 */}
      {(selectedBlock.type === 'image' || selectedBlock.type === 'button') && (
        <>
          <label style={{ display: 'block', marginTop: '10px' }}>
            画像URL：
            <input
              type="text"
              name="src"
              value={selectedBlock.src}
              onChange={handleChange}
              style={{ width: '100%', marginTop: '5px', padding: '6px' }}
            />
          </label>
          <label style={{ display: 'block', marginTop: '10px' }}>
            altテキスト：
            <input
              type="text"
              name="alt"
              value={selectedBlock.alt || ''}
              onChange={handleChange}
              style={{ width: '100%', marginTop: '5px', padding: '6px' }}
            />
          </label>
        </>
      )}

      {/* ボタンブロック用 */}
      {selectedBlock.type === 'button' && (
        <label style={{ display: 'block', marginTop: '10px' }}>
          リンク：
          <input
            type="text"
            name="href"
            value={selectedBlock.href || ''}
            onChange={handleChange}
            style={{ width: '100%', marginTop: '5px', padding: '6px' }}
          />
        </label>
      )}
    </div>
  );
};

export default PropertiesPanel;
