// src/components/Preview.tsx
import React, { useState } from 'react';
import { BlockData } from '../type';

interface PreviewProps {
  blocks: BlockData[];
}

const Preview: React.FC<PreviewProps> = ({ blocks }) => {
  const [isMobileView, setIsMobileView] = useState(false);

  const renderBlock = (block: BlockData) => {
    switch (block.type) {
      case 'text':
        return <p>{block.content}</p>;
      case 'image':
        return <img src={block.content} alt="画像" style={{ maxWidth: '100%' }} />;
      case 'button':
        return <button>{block.content}</button>;
      default:
        return null;
    }
  };

  return (
    <div
      style={{
        width: '300px',
        borderLeft: '1px solid #ccc',
        padding: '10px',
        backgroundColor: '#fafafa',
      }}
    >
      <h3>プレビュー</h3>

      <div style={{ marginBottom: '10px' }}>
        <button onClick={() => setIsMobileView(false)} disabled={!isMobileView}>
          🖥️ PC表示
        </button>
        <button
          onClick={() => setIsMobileView(true)}
          disabled={isMobileView}
          style={{ marginLeft: '8px' }}
        >
          📱 モバイル表示
        </button>
      </div>

      <div
        style={{
          width: isMobileView ? '375px' : '100%',
          border: '1px solid #ddd',
          padding: '10px',
          backgroundColor: '#fff',
          margin: '0 auto',
        }}
      >
        {blocks.map((block) => (
          <div key={block.id} style={{ marginBottom: '12px' }}>
            {renderBlock(block)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Preview;
