import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/routes.js';
import userRoutes from './routes/userRoutes.js';
import videoRoutes from './routes/videosroutes.js';
import interactionRoutes from './routes/interactionRoutes.js';
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Endpoints
app.use('/api/auth', authRoutes); // Conecta la ruta
app.use('/api/users', userRoutes);
app.use('/api/videos', videoRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API del MVP de YouTube funcionando' });
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});

app.use('/api/comments', interactionRoutes);