import http from 'http';
import { app } from './app';
import { config } from './config/env';
import { prisma } from './config/database';
import { initMinio } from './config/minio';
import { initSocket } from './config/socket';

const startServer = async () => {
  try {
    await prisma.$connect();
    console.log('✅ PostgreSQL conectado');

    // Inicializamos MinIO antes de levantar Express
    await initMinio();

    // Creamos un servidor HTTP propio para poder montar Socket.IO encima.
    const httpServer = http.createServer(app);
    await initSocket(httpServer);

    httpServer.listen(config.port, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${config.port}`);
    });
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

startServer();
