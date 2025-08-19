export interface HtmlTemplate {
  id: string;
  name: string;
  file: string;
}

export const templates: HtmlTemplate[] = [
  {
    id: 'ad',
    name: 'AD',
    file: `${process.env.PUBLIC_URL || ''}/templates/ad.html`,
  },
];
