import { config as loadEnv } from 'dotenv';
loadEnv();

export const config = {
  port: process.env.PORT || 3001,
  databaseUrl: process.env.DATABASE_URL!,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'super_secreto_para_desarrollo_proconecta',
  jwtExpiresIn: '1d',
  
  minioEndpoint: process.env.MINIO_ENDPOINT || 'minio',
  minioPort: parseInt(process.env.MINIO_PORT || '9000'),
  minioAccessKey: process.env.MINIO_ACCESS_KEY || 'admin_proconecta',
  minioSecretKey: process.env.MINIO_SECRET_KEY || 'superpassword123',
  minioBucket: process.env.MINIO_BUCKET || 'proconecta-uploads',
};
