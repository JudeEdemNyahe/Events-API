import { registerAs } from '@nestjs/config/dist';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export default registerAs(
  'typeOrm.Config',
  (): TypeOrmModuleOptions => ({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [__dirname + '/../**/*.entity.{js,ts}'],
    synchronize: true,
  }),
);
