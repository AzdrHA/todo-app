import { Document } from "mongoose";
import { ITag } from './ITag';

export interface ITodo extends Document {
  title: string;
  completed: boolean;
  position: number;
  tags: ITag[];
  createdAt: Date;
  priority: 'high' | 'medium' | 'low';
}