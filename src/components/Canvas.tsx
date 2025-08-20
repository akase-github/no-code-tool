import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { BlockData } from '../types/types';

interface CanvasProps {
  blocks: BlockData[];
  onSelectBlock: (id: string) => void;
  selectedBlockId: string | null;
  setBlocks: (newBlocks: BlockData[]) => void;
  onDeleteBlock: (id: string) => void;
}

const SortableBlock: React.FC<{
  block: BlockData;
  selected: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}> = ({ block, selected, onSelect, onDelete }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: block.id,
  });

  const isDragging = !!transform;
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  } as React.CSSProperties;

  return (
    <div
      ref={setNodeRef}
      className={`canvas-block${selected ? ' is-selected' : ''}${isDragging ? ' is-dragging' : ''}`}
      style={style}
      {...attributes}
    >
      {/* ヘッダー */}
      <div className="canvas-block__header">
        {/* ドラッグ可能エリア */}
        <div {...listeners} className="canvas-block__grab" style={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          ≡
        </div>

        {/* 削除ボタン */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(block.id);
          }}
          style={{
            background: 'transparent',
            border: 'none',
            fontSize: '16px',
            cursor: 'pointer',
            color: '#999',
            padding: '0 8px',
          }}
          aria-label="削除"
        >
          ×
        </button>
      </div>

      {/* ブロック本体 */}
      <div onClick={() => onSelect(block.id)} className="canvas-block__body">
        {block.type === 'image' && (
          <img src={block.src} alt="画像" style={{ maxWidth: '100%' }} />
        )}
        {block.type === 'button' && (
          <img src={block.src} alt="画像ボタン" style={{ maxWidth: '100%' }} />
        )}
        {block.type === 'custom' && (
          <div dangerouslySetInnerHTML={{ __html: block.html || '' }} />
        )}
      </div>
    </div>
  );
};

const Canvas: React.FC<CanvasProps> = ({
  blocks,
  onSelectBlock,
  selectedBlockId,
  setBlocks,
  onDeleteBlock,
}) => {
  const sensors = useSensors(useSensor(PointerSensor));
  const [draggingBlock, setDraggingBlock] = useState<BlockData | null>(null);

  const handleDragStart = (event: DragStartEvent) => {
    const id = event.active.id;
    const block = blocks.find((b) => b.id === id) || null;
    setDraggingBlock(block);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setDraggingBlock(null);
    if (active.id !== over?.id) {
      const oldIndex = blocks.findIndex((b) => b.id === active.id);
      const newIndex = blocks.findIndex((b) => b.id === over?.id);
      setBlocks(arrayMove(blocks, oldIndex, newIndex));
    }
  };

  return (
    <div
      style={{
        padding: '20px',
        backgroundColor: '#f7f7f7',
      }}
    >
      <div className="canvas-title">キャンバス（ドラッグで並び替え・✕で削除）</div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
          {blocks.map((block) => (
            <SortableBlock
              key={block.id}
              block={block}
              selected={block.id === selectedBlockId}
              onSelect={onSelectBlock}
              onDelete={onDeleteBlock}
            />
          ))}
        </SortableContext>

        <DragOverlay>
          {draggingBlock && (
            <div className="canvas-block canvas-block--overlay" style={{ width: '100%', maxWidth: 750 }}>
              <div className="canvas-block__header">
                <div style={{ visibility: 'hidden' }}>≡</div>
                <div style={{ visibility: 'hidden' }}>×</div>
              </div>
              <div className="canvas-block__body">
                {draggingBlock.type === 'image' && (
                  <img src={draggingBlock.src} alt="画像" />
                )}
                {draggingBlock.type === 'button' && (
                  <img src={draggingBlock.src} alt="画像ボタン" />
                )}
                {draggingBlock.type === 'custom' && (
                  <div dangerouslySetInnerHTML={{ __html: draggingBlock.html || '' }} />
                )}
              </div>
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default Canvas;
