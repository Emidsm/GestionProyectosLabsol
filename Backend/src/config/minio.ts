import * as Minio from 'minio';
import { config } from './env';

export const minioClient = new Minio.Client({
  endPoint: config.minioEndpoint,
  port: config.minioPort,
  useSSL: false,
  accessKey: config.minioAccessKey,
  secretKey: config.minioSecretKey,
});

export const initMinio = async () => {
  try {
    const exists = await minioClient.bucketExists(config.minioBucket);
    if (!exists) {
      await minioClient.makeBucket(config.minioBucket, 'us-east-1');
      
      // Hacemos el bucket público para que los enlaces funcionen
      const policy = {
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Principal: { AWS: ['*'] },
            Action: ['s3:GetObject'],
            Resource: [`arn:aws:s3:::${config.minioBucket}/*`],
          },
        ],
      };
      await minioClient.setBucketPolicy(config.minioBucket, JSON.stringify(policy));
      console.log(`✅ Bucket '${config.minioBucket}' creado y configurado.`);
    } else {
      console.log(`✅ Bucket '${config.minioBucket}' listo.`);
    }
  } catch (error) {
    console.error('❌ Error configurando MinIO:', error);
  }
};
