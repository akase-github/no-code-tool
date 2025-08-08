import React, { useEffect, useState } from 'react';
import BlockList from './components/BlockList';
import PropertiesPanel from './components/PropertiesPanel';
import Preview from './components/Preview';
import Canvas from './components/Canvas';
import { v4 as uuidv4 } from 'uuid';
import { BlockData, BlockType } from './types/types';
import { templates, HtmlTemplate } from './templates/templates';

const App: React.FC = () => {
  const [blocks, setBlocks] = useState<BlockData[]>([]);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<HtmlTemplate | null>(null);
  const [templateHtml, setTemplateHtml] = useState<string>('');
  const [titleText, setTitleText] = useState('メールタイトル');
  const [preheaderText, setPreheaderText] = useState('プリヘッダーのテキスト');
  const [canvasWidth, setCanvasWidth] = useState(600); // ⭐ Canvasの幅

  const handleAddBlock = (type: BlockType) => {
    const base: BlockData = { id: uuidv4(), type };
    const newBlock: BlockData =
      type === 'image'
        ? { ...base, src: '画像URLを入力', alt: 'altテキストを入力' }
        : type === 'button'
        ? { ...base, src: '画像URLを入力', alt: 'ボタン画像のalt', href: 'リンクを入力' }
        : { ...base, html: '<!-- カスタムHTMLをここに -->' };
    setBlocks((prev) => [...prev, newBlock]);
  };

  const handleSelectBlock = (id: string) => {
    setSelectedBlockId(id);
  };

  const handleUpdateBlock = (updatedBlock: BlockData) => {
    setBlocks((prev) =>
      prev.map((block) => (block.id === updatedBlock.id ? updatedBlock : block))
    );
  };

  const handleDeleteBlock = (id: string) => {
    setBlocks((prev) => prev.filter((block) => block.id !== id));
    if (selectedBlockId === id) {
      setSelectedBlockId(null);
    }
  };

  const handleTemplateSelect = (templateId: string) => {
    const found = templates.find((t) => t.id === templateId) || null;
    setSelectedTemplate(found);
  };

  useEffect(() => {
    if (!selectedTemplate) return;
    fetch(selectedTemplate.file)
      .then((res) => res.text())
      .then((html) => setTemplateHtml(html));
  }, [selectedTemplate]);

  const renderedBlocks = blocks
    .map((b) => {
      if (b.type === 'image') {
        return `<tr><td align="center"><img src="${b.src || ''}" alt="${b.alt || ''}" width="750" /></td></tr>`;
      }
      if (b.type === 'button') {
        return `<tr><td align="center"><a href="${b.href || '#'}"><img src="${b.src || ''}" alt="${b.alt || ''}" width="750" /></a></td></tr>`;
      }
      if (b.type === 'custom') {
        const html = (b.html || '').trim();
        const isRow = /<tr[\s>]/i.test(html);
        return isRow ? html : `<tr><td align="center">${html}</td></tr>`;
      }
      return '';
    })
    .join('');

  const finalHtml = templateHtml
    .replace('TITLE_PLACEHOLDER', titleText)
    .replace(
      '<span id="preheader-placeholder" style="color:#f3f3f3;font-size:0;line-height:0;"></span>',
      `<div style="display:none; mso-hide:all; font-size:1px; color:#ffffff; line-height:1px; max-height:0px; max-width:0px; opacity:0; overflow:hidden;">${preheaderText}</div>`
    )
    .replace('PREHEADER_PLACEHOLDER', preheaderText)
    .replace('<tr id="block-placeholder"></tr>', renderedBlocks)

  const selectedBlock = blocks.find((b) => b.id === selectedBlockId) || null;

   return (
    <div className="app-layout" style={{ overscrollBehaviorX: 'none' }}>
      {/* サイドバー */}
      <div className="sidebar">
        <BlockList onAddBlock={handleAddBlock} onTemplateSelect={handleTemplateSelect} />
        <div className="group" style={{ marginTop: '12px' }}>
          <h3 className="section-title">メール設定</h3>
          <label className="field">
            タイトル
            <input
              type="text"
              value={titleText}
              onChange={(e) => setTitleText(e.target.value)}
              className="ui-input"
              style={{ marginTop: 6 }}
            />
          </label>
          <label className="field">
            プリヘッダー
            <input
              type="text"
              value={preheaderText}
              onChange={(e) => setPreheaderText(e.target.value)}
              className="ui-input"
              style={{ marginTop: 6 }}
            />
          </label>
        </div>
      </div>

      {/* キャンバスとプレビュー中間エリア */}
      <div
        className="workarea"
        onWheel={(e) => {
          // 横スクロールが発生した場合に親（ブラウザ）への伝播を防ぐ
          if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
            e.stopPropagation();
          }
        }}
      >
        {/* キャンバス */}
        <div className="canvas-wrapper" style={{ width: `${canvasWidth}px` }}>
          <Canvas
            blocks={blocks}
            selectedBlockId={selectedBlockId}
            onSelectBlock={handleSelectBlock}
            setBlocks={setBlocks}
            onDeleteBlock={handleDeleteBlock}
          />
        </div>

        {/* リサイズバー */}
        <div
          className="resizer"
          onMouseDown={(e) => {
            const startX = e.clientX;
            const startWidth = canvasWidth;
            document.body.style.userSelect = 'none';

            const onMouseMove = (e: MouseEvent) => {
              const newWidth = Math.max(300, startWidth + (e.clientX - startX));
              setCanvasWidth(newWidth);
            };

            const onMouseUp = () => {
              document.body.style.userSelect = '';
              document.removeEventListener('mousemove', onMouseMove);
              document.removeEventListener('mouseup', onMouseUp);
            };

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
          }}
        />

        {/* プレビュー */}
        <Preview html={finalHtml} />
      </div>

      {/* プロパティ編集 */}
      <PropertiesPanel selectedBlock={selectedBlock} onUpdateBlock={handleUpdateBlock} />
    </div>
  );
};

export default App;
