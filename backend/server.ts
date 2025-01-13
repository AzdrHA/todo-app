import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import todoRoutes from './routes/todos';
import tagRoutes from './routes/tags';

const app = express();
const MONGO_URI = process.env.MONGO_URI || 'mongodb://mongo:27017/todos';

(async () => {
  const PORT = 5000;

  app.use(cors());
  app.use(bodyParser.json());
  app.use('/api/todos', todoRoutes);
  app.use('/api/tags', tagRoutes);

  try {
    await mongoose.connect(MONGO_URI, {
      family: 4
    });
    console.log('Connected to MongoDB');

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server is running on port ${PORT}`);
      // Stocker le port utilisé dans une variable d'environnement pour que le frontend puisse l'utiliser
      process.env.ACTUAL_PORT = PORT.toString();
    });
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);

  }
})()
