import { DataSource, DataSourceOptions } from 'typeorm';
import { config as dotenvConfig } from 'dotenv';
import { registerAs } from '@nestjs/config';

dotenvConfig();

console.log('Configuration de la base de données :', {
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
});

const config: DataSourceOptions = {
  type: 'mysql',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT, 10) || 3307,
  username: process.env.DB_USERNAME_ROOT || 'root',
  password: process.env.MYSQL_ROOT_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'test',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'], // Chemin des entités
  synchronize: true, // Synchronisation en dev uniquement
  logging: true,
  ssl: false, // SSL désactivé en local
};

export default registerAs('typeorm', () => config);
export const connectionSource = new DataSource(config);
