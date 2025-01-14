import mongoose from 'mongoose';
import { ITag } from '../interfaces/ITag';

const TagSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  color: {
    type: String,
    required: true
  }
});

export default mongoose.model<ITag>('Tag', TagSchema);