import React, { useState } from 'react';
import BlockList from './components/BlockList';
import PropertiesPanel from './components/PropertiesPanel';
import Preview from './components/Preview';
import { v4 as uuidv4 } from 'uuid'; // ブロックID生成に使います（npm install uuid）
import Canvas from './components/Canvas';
import { BlockData, BlockType } from './type';

const App: React.FC = () => {
  const [blocks, setBlocks] = useState<BlockData[]>([]);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

  const handleAddBlock = (type: BlockType) => {
    const newBlock: BlockData = {
      id: uuidv4(),
      type,
      content:
        type === 'text'
          ? 'テキストを入力'
          : type === 'image'
          ? 'https://via.placeholder.com/300'
          : 'ボタン',
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


  const selectedBlock = blocks.find((b) => b.id === selectedBlockId) || null;

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <BlockList onAddBlock={handleAddBlock} />
      <Canvas
        blocks={blocks}
        selectedBlockId={selectedBlockId}
        onSelectBlock={handleSelectBlock}
        setBlocks={setBlocks}
        onDeleteBlock={handleDeleteBlock}
      />
      <Preview blocks={blocks} />
      <PropertiesPanel selectedBlock={selectedBlock} onUpdateBlock={handleUpdateBlock} />
    </div>
  );
};

export default App;
