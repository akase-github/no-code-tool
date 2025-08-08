import React, { useEffect, useMemo, useRef, useState } from 'react';
import BlockList from './components/BlockList';
import PropertiesPanel from './components/PropertiesPanel';
import Preview from './components/Preview';
import Canvas from './components/Canvas';
import { v4 as uuidv4 } from 'uuid';
import { BlockData, BlockType, DocumentState } from './types/types';
import { templates, HtmlTemplate } from './templates/templates';
import { useHistory } from './hooks/useHistory';

const App: React.FC = () => {
  // 履歴管理対象のドキュメント状態
  const initialDoc: DocumentState = useMemo(
    () => ({
      titleText: 'メールタイトル',
      preheaderText: 'プリヘッダーのテキスト',
      templateId: null,
      canvasWidth: 600,
      blocks: [],
    }),
    []
  );
  const { present, set, undo, redo, canUndo, canRedo } = useHistory<DocumentState>(initialDoc);

  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<HtmlTemplate | null>(null);
  const [templateHtml, setTemplateHtml] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddBlock = (type: BlockType) => {
    const base: BlockData = { id: uuidv4(), type };
    const newBlock: BlockData =
      type === 'image'
        ? { ...base, src: '画像URLを入力', alt: 'altテキストを入力' }
        : type === 'button'
        ? { ...base, src: '画像URLを入力', alt: 'ボタン画像のalt', href: 'リンクを入力' }
        : { ...base, html: '<!-- カスタムHTMLをここに -->' };
    set({ ...present, blocks: [...present.blocks, newBlock] });
  };

  const handleSelectBlock = (id: string) => {
    setSelectedBlockId(id);
  };

  const handleUpdateBlock = (updatedBlock: BlockData) => {
    const nextBlocks = present.blocks.map((block) => (block.id === updatedBlock.id ? updatedBlock : block));
    set({ ...present, blocks: nextBlocks });
  };

  const handleDeleteBlock = (id: string) => {
    const nextBlocks = present.blocks.filter((block) => block.id !== id);
    set({ ...present, blocks: nextBlocks });
    if (selectedBlockId === id) {
      setSelectedBlockId(null);
    }
  };

  const handleTemplateSelect = (templateId: string) => {
    set({ ...present, templateId });
  };

  // templateId からテンプレートを解決
  useEffect(() => {
    const found = templates.find((t) => t.id === present.templateId) || null;
    setSelectedTemplate(found);
  }, [present.templateId]);

  useEffect(() => {
    if (!selectedTemplate) {
      setTemplateHtml('');
      return;
    }
    fetch(selectedTemplate.file)
      .then((res) => res.text())
      .then((html) => setTemplateHtml(html));
  }, [selectedTemplate]);

  const renderedBlocks = present.blocks
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
    .replace('TITLE_PLACEHOLDER', present.titleText)
    .replace(
      '<span id="preheader-placeholder" style="color:#f3f3f3;font-size:0;line-height:0;"></span>',
      `<div style="display:none; mso-hide:all; font-size:1px; color:#ffffff; line-height:1px; max-height:0px; max-width:0px; opacity:0; overflow:hidden;">${present.preheaderText}</div>`
    )
    .replace('PREHEADER_PLACEHOLDER', present.preheaderText)
    .replace('<tr id="block-placeholder"></tr>', renderedBlocks)

  const selectedBlock = present.blocks.find((b) => b.id === selectedBlockId) || null;

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
              value={present.titleText}
              onChange={(e) => set({ ...present, titleText: e.target.value })}
              className="ui-input"
              style={{ marginTop: 6 }}
            />
          </label>
          <label className="field">
            プリヘッダー
            <input
              type="text"
              value={present.preheaderText}
              onChange={(e) => set({ ...present, preheaderText: e.target.value })}
              className="ui-input"
              style={{ marginTop: 6 }}
            />
          </label>
        </div>

        <div className="group">
          <h3 className="section-title">編集</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <button className="ui-button secondary" onClick={undo} disabled={!canUndo}>↩ Undo</button>
            <button className="ui-button secondary" onClick={redo} disabled={!canRedo}>↪ Redo</button>
          </div>
        </div>

        <div className="group">
          <h3 className="section-title">作業ファイル</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <button
              className="ui-button secondary"
              onClick={() => {
                const doc = { ...present };
                const blob = new Blob([JSON.stringify(doc, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'document.json';
                a.click();
                URL.revokeObjectURL(url);
              }}
            >
              💾 保存
            </button>
            <button className="ui-button secondary" onClick={() => fileInputRef.current?.click()}>📂 読み込み</button>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json"
              style={{ display: 'none' }}
              onChange={async (e) => {
                const inputEl = e.currentTarget as HTMLInputElement;
                const file = inputEl.files?.[0];
                if (!file) return;
                const text = await file.text();
                try {
                  const parsed = JSON.parse(text) as DocumentState;
                  // 最低限のバリデーション
                  if (!parsed || !('blocks' in parsed)) throw new Error('invalid');
                  set(parsed);
                } catch {
                  alert('不正なJSONです');
                } finally {
                  if (inputEl) inputEl.value = '';
                }
              }}
            />
          </div>
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
        <div className="canvas-wrapper" style={{ width: `${present.canvasWidth}px` }}>
          <Canvas
            blocks={present.blocks}
            selectedBlockId={selectedBlockId}
            onSelectBlock={handleSelectBlock}
            setBlocks={(newBlocks) => set({ ...present, blocks: newBlocks })}
            onDeleteBlock={handleDeleteBlock}
          />
        </div>

        {/* リサイズバー */}
        <div
          className="resizer"
          onMouseDown={(e) => {
            const startX = e.clientX;
            const startWidth = present.canvasWidth;
            document.body.style.userSelect = 'none';

            const onMouseMove = (e: MouseEvent) => {
              const newWidth = Math.max(300, startWidth + (e.clientX - startX));
              set({ ...present, canvasWidth: newWidth });
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
