export interface Book {
  id: string;
  title: string;
  authors: string[];
  description: string;
  publisher?: string;
  publishedDate?: string;
  coverUrl?: string;
  isAdded?: boolean;
}

export interface MyBook extends Book {
  dateAdded: string;
}
