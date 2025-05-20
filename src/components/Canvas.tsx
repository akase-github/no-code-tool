import React from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { BlockData } from '../type';

interface CanvasProps {
  blocks: BlockData[];
  onSelectBlock: (id: string) => void;
  selectedBlockId: string | null;
  setBlocks: (newBlocks: BlockData[]) => void;
}

const SortableBlock: React.FC<{
  block: BlockData;
  selected: boolean;
  onSelect: (id: string) => void;
}> = ({ block, selected, onSelect }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: block.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    border: selected ? '2px solid #007bff' : '1px solid #ccc',
    background: '#fff',
    padding: '10px',
    marginBottom: '10px',
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <div {...listeners} style={{ cursor: 'grab' }}>≡</div>
      <div onClick={() => onSelect(block.id)}>
        {block.type === 'text' && <p>{block.content}</p>}
        {block.type === 'image' && <img src={block.content} alt="画像" style={{ maxWidth: '100%' }} />}
        {block.type === 'button' && <button>{block.content}</button>}
      </div>
    </div>
  );

};

const Canvas: React.FC<CanvasProps> = ({
  blocks,
  onSelectBlock,
  selectedBlockId,
  setBlocks,
}) => {
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
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
      <h3 style={{ marginBottom: '10px' }}>キャンバス（ドラッグで並び替え）</h3>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
          {blocks.map((block) => (
            <SortableBlock
              key={block.id}
              block={block}
              selected={block.id === selectedBlockId}
              onSelect={onSelectBlock}
            />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default Canvas;
