export type BlockType = 'text' | 'image' | 'button';

export interface BlockData {
  id: string;
  type: BlockType;
  text?: string;
  src?: string;
  alt?: string;
  href?: string;
}
