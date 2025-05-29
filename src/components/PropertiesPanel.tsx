import React, { useState } from 'react';
import { BlockData } from '../types/types';

interface PropertiesPanelProps {
  selectedBlock: BlockData | null;
  onUpdateBlock: (updatedBlock: BlockData) => void;
}

const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  selectedBlock,
  onUpdateBlock,
}) => {
  const [position, setPosition] = useState({ x: 500, y: 500 });

  if (!selectedBlock) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onUpdateBlock({ ...selectedBlock, [name]: value });
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const startX = e.clientX;
    const startY = e.clientY;
    const origX = position.x;
    const origY = position.y;

    document.body.style.userSelect = 'none';

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const newX = origX + (moveEvent.clientX - startX);
      const newY = origY + (moveEvent.clientY - startY);
      setPosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      document.body.style.userSelect = '';
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        background: '#fff',
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '16px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        zIndex: 1000,
        minWidth: '300px',
        cursor: 'move',
      }}
      onMouseDown={handleMouseDown}
    >
      <h4 style={{ marginTop: 0 }}>プロパティ編集</h4>

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
