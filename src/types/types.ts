export type BlockType = 'image' | 'button' | 'custom';

export interface BlockData {
  id: string;
  type: BlockType;
  src?: string;
  alt?: string;
  href?: string;
  html?: string; // custom 用の生HTML
}

export interface DocumentState {
  titleText: string;
  preheaderText: string;
  mirrorPageUrl: string;
  templateId: string | null;
  blocks: BlockData[];
}
