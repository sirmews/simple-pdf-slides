// Types for the application
export interface Page {
  title: string;
  content: string;
  backgroundColor: string;
  image: string | null;
  template: string;
}

export interface SavedData {
  pages: Page[];
  authorName: string;
  font: string;
  showPageNumbers: boolean;
}

export interface AppData extends SavedData {
  // Can extend with additional app-specific data if needed
}