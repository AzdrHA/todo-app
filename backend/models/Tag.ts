import mongoose from 'mongoose';

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

export default mongoose.model('Tag', TagSchema);