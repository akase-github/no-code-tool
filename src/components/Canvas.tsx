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

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    border: selected ? '2px solid #007bff' : '1px solid #ccc',
    background: '#fff',
    marginBottom: '10px',
    boxShadow: selected ? '0 0 0 2px rgba(0, 123, 255, 0.2)' : 'none',
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      {/* ヘッダー */}
      <div
        style={{
          backgroundColor: '#f0f0f0',
          padding: '8px',
          borderBottom: '1px solid #ddd',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontWeight: 'bold',
          color: '#555',
        }}
      >
        {/* ドラッグ可能エリア */}
        <div
          {...listeners}
          style={{
            display: 'flex',
            alignItems: 'center',
            flexGrow: 1,
            cursor: 'grab',
            userSelect: 'none',
          }}
        >
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
      <div
        onClick={() => onSelect(block.id)}
        style={{ cursor: 'default', padding: '10px' }}
      >
        {block.type === 'text' && <p>{block.text}</p>}
        {block.type === 'image' && (
          <img src={block.src} alt="画像" style={{ maxWidth: '100%' }} />
        )}
        {block.type === 'button' && (
          <img src={block.src} alt="画像ボタン" style={{ maxWidth: '100%' }} />
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
        flex: 1,
        padding: '20px',
        minHeight: '100vh',
        backgroundColor: '#f7f7f7',
        overflowY: 'auto',
      }}
    >
      <h3 style={{ marginBottom: '10px' }}>キャンバス（ドラッグで並び替え・✕で削除）</h3>
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
            <div
              style={{
                width: '100%',
                maxWidth: '750px',
                padding: '10px',
                backgroundColor: '#fff',
                border: '1px solid #ccc',
              }}
            >
              {draggingBlock.type === 'text' && <p>{draggingBlock.text}</p>}
              {draggingBlock.type === 'image' && (
                <img src={draggingBlock.src} alt="画像" style={{ maxWidth: '100%' }} />
              )}
              {draggingBlock.type === 'button' && (
                <img src={draggingBlock.src} alt="画像ボタン" style={{ maxWidth: '100%' }} />
              )}
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default Canvas;
