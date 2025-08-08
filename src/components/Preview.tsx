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
    <div className="preview-pane">
      <h3 className="section-title">プレビュー</h3>

      <div className="open-new-tab">
        <button onClick={handleOpenHtmlInNewTab} className="ui-button">
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
