import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import projectRoutes from './routes/project.routes';
import enrollmentRoutes from './routes/enrollment.routes';
import uploadRoutes from './routes/upload.routes'; // Importamos rutas de subida

export const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/upload', uploadRoutes); // Registramos el endpoint
