import { config as loadEnv } from 'dotenv';
loadEnv();

export const config = {
  port: process.env.PORT || 3001,
  databaseUrl: process.env.DATABASE_URL!,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'super_secreto_para_desarrollo_proconecta',
  jwtExpiresIn: '1d', // El token durará 1 día
};
