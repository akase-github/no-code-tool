import React, { useState } from 'react';

interface PreviewProps {
  html: string;
}

const Preview: React.FC<PreviewProps> = ({ html }) => {
  const [isMobileView, setIsMobileView] = useState(false);

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
          backgroundColor: '#fff',
          margin: '0 auto',
          minHeight: '300px',
        }}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
};

export default Preview;
