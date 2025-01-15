export interface ISearchParams {
  title?: string;
  completed?: boolean | 'all';
  priority?: 'high' | 'medium' | 'low' | 'all';
  tags?: string[];
  page: number;
}