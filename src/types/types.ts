export type BlockType = 'text' | 'image' | 'button';

export interface BlockData {
  id: string;
  type: BlockType;
  content: string;
}
