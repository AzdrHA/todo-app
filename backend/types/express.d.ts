import 'express';
import Todo from '../models/Todo';

declare module 'express' {
  export interface Response {
    locals: {
      todo?: Todo;
    };
  }
}