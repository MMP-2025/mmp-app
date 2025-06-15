
export interface Resource {
  id: string;
  title: string;
  description: string;
  category: 'worksheet' | 'guide' | 'template' | 'reference';
  type: 'PDF' | 'Article' | 'Worksheet' | 'Guide';
  downloadUrl?: string;
}
