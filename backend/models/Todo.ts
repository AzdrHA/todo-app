import mongoose from 'mongoose';
import { ITodo } from '../interfaces/ITodo';

const TodoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  position: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  tags: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tag'
  }],
  priority: { type: String, enum: ['high', 'medium', 'low'], default: 'medium' }
});

export default mongoose.model<ITodo>('Todo', TodoSchema);