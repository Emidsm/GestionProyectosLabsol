import { app } from './app';
import { config } from './config/env';
import { prisma } from './config/database';
import { initMinio } from './config/minio';

const startServer = async () => {
  try {
    await prisma.$connect();
    console.log('✅ PostgreSQL conectado');

    // Inicializamos MinIO antes de levantar Express
    await initMinio();

    app.listen(config.port, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${config.port}`);
    });
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

startServer();
