import { app } from './app';
import { config } from './config/env';
import { prisma } from './config/database';

const startServer = async () => {
  try {
    await prisma.$connect();
    console.log('✅ PostgreSQL conectado');

    app.listen(config.port, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${config.port}`);
    });
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

startServer();
