import React from 'react';

interface PreviewProps {
  html: string;
  width?: number; // px
}

const Preview: React.FC<PreviewProps> = ({ html, width = 750 }) => {
  const handleOpenHtmlInNewTab = () => {
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  return (
    <div className="preview-pane" style={{ width }}>
      <h3 className="section-title">プレビュー</h3>

      <div className="open-new-tab">
        <button onClick={handleOpenHtmlInNewTab} className="ui-button">
          🔗 別タブで開く
        </button>
      </div>

      <div
        style={{
          width: 750,
          boxSizing: 'border-box',
          backgroundColor: '#fff',
          margin: '0 auto',
          minHeight: '300px',
          overflowX: 'hidden',
        }}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
};

export default Preview;
