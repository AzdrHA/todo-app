import { ITodo } from './ITodo';

export interface ISearchResult {
  results: ITodo[]
  totalCount: number;
  page: number;
  totalPages: number;
}