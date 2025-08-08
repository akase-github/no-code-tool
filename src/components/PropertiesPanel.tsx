import React, { useState, useRef } from 'react';
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
  const panelRef = useRef<HTMLDivElement>(null);

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
      ref={panelRef}
      className="properties-panel"
      style={{ position: 'absolute', left: position.x, top: position.y, zIndex: 1000 }}
    >
      {/* ドラッグ用ヘッダー */}
      <div onMouseDown={handleMouseDown} className="properties-panel__header">
        プロパティ編集
      </div>

      <div className="properties-panel__body">
        {selectedBlock.type === 'text' && (
          <label className="field">
            テキスト内容：
            <input
              type="text"
              name="text"
              value={selectedBlock.text}
              onChange={handleChange}
              className="ui-input"
              style={{ marginTop: '6px' }}
            />
          </label>
        )}

        {(selectedBlock.type === 'image' || selectedBlock.type === 'button') && (
          <>
            <label className="field">
              画像URL：
              <input
                type="text"
                name="src"
                value={selectedBlock.src}
                onChange={handleChange}
                className="ui-input"
                style={{ marginTop: '6px' }}
              />
            </label>
            <label className="field">
              altテキスト：
              <input
                type="text"
                name="alt"
                value={selectedBlock.alt || ''}
                onChange={handleChange}
                className="ui-input"
                style={{ marginTop: '6px' }}
              />
            </label>
          </>
        )}

        {selectedBlock.type === 'button' && (
          <label className="field">
            リンク：
            <input
              type="text"
              name="href"
              value={selectedBlock.href || ''}
              onChange={handleChange}
              className="ui-input"
              style={{ marginTop: '6px' }}
            />
          </label>
        )}
      </div>
    </div>
  );
};

export default PropertiesPanel;
