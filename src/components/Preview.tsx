import React from 'react';

interface PreviewProps {
  html: string;
}

const Preview: React.FC<PreviewProps> = ({ html }) => {
  const handleOpenHtmlInNewTab = () => {
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  return (
    <div
      style={{
        width: '750px',
        borderLeft: '1px solid #ccc',
        padding: '10px',
        backgroundColor: '#fafafa',
      }}
    >
      <h3>プレビュー</h3>

      <div style={{ marginBottom: '10px' }}>
        <button onClick={handleOpenHtmlInNewTab}>
          🔗 別タブで開く
        </button>
      </div>

      <div
        style={{
          width: '100%',
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
