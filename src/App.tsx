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
  const [canvasWidth, setCanvasWidth] = useState(600); // ⭐ 追加：Canvasの幅を管理

  const handleAddBlock = (type: BlockType) => {
    const newBlock: BlockData = {
      id: uuidv4(),
      type,
      text: 'テキストを入力',
      src: '画像URLを入力',
      alt: 'altテキストを入力',
      href: 'リンクを入力'
    };
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

  const renderedBlocks = blocks.map((b) => {
    if (b.type === 'text') return `<tr><td align="center"><p>${b.text}</p></td></tr>`;
    if (b.type === 'image') return `<tr><td align="center"><img src="${b.src}" alt="${b.alt || ''}" width="750" /></td></tr>`;
    if (b.type === 'button') return `<tr><td align="center"><a href="${b.href}"><img src="${b.src}" alt="${b.alt || ''}" width="750" /></a></td></tr>`;
    return '';
  }).join('');

  const finalHtml = templateHtml
    .replace('TITLE_PLACEHOLDER', titleText)
    .replace(
      '<span id="preheader-placeholder" style="color:#f3f3f3;font-size:0;line-height:0;"></span>',
      `<span style="color:#f3f3f3;font-size:0;line-height:0;">${preheaderText}</span>`
    )
    .replace('<tr id="block-placeholder"></tr>', renderedBlocks)

  const selectedBlock = blocks.find((b) => b.id === selectedBlockId) || null;

   return (
    <div style={{ display: 'flex', height: '100vh', overflowX: 'auto', overscrollBehaviorX: 'none', }}>
      {/* サイドバー */}
      <div style={{ width: '200px', borderRight: '1px solid #ccc', padding: '10px' }}>
        <BlockList onAddBlock={handleAddBlock} onTemplateSelect={handleTemplateSelect} />
        <div style={{ marginTop: '20px' }}>
          {/* ...タイトル・プリヘッダー入力... */}
        </div>
      </div>

      {/* キャンバスとプレビュー中間エリア */}
      <div
        style={{ display: 'flex' }}
        onWheel={(e) => {
          // 横スクロールが発生した場合に親（ブラウザ）への伝播を防ぐ
          if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
            e.stopPropagation();
          }
        }}
      >
        {/* キャンバス */}
        <div
          style={{
            width: `${canvasWidth}px`,
            borderRight: '1px solid #ccc',
            padding: '10px',
            boxSizing: 'border-box',
            position: 'relative',
          }}
        >
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
          style={{
            width: '12px',
            cursor: 'col-resize',
            backgroundColor: '#eee',
            position: 'relative',
          }}
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
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: '50%',
              width: '2px',
              backgroundColor: '#ccc',
              transform: 'translateX(-50%)',
            }}
          />
        </div>

        {/* プレビュー */}
        <Preview html={finalHtml} />
      </div>

      {/* プロパティ編集 */}
      <PropertiesPanel selectedBlock={selectedBlock} onUpdateBlock={handleUpdateBlock} />
    </div>
  );
};

export default App;
