import { DataSource } from 'typeorm';
import { mongoConfig } from '../configs';
import { CoinListEntity, CryptoDataEntity, UserEntity, VerificationCodesEntity } from './entities';
import { projectModeConfig } from '../configs/project-mode';

export const MyDataSource = new DataSource({
  type: 'mongodb',
  username: mongoConfig.username,
  password: mongoConfig.pass,
  database: mongoConfig.database,
  port: mongoConfig.port,
  host: projectModeConfig.mode === 'production' ? process.env.MONGO_HOST : undefined,
  authSource: 'admin',
  useUnifiedTopology: true,
  useNewUrlParser: true,
  entities: [UserEntity, VerificationCodesEntity, CoinListEntity, CryptoDataEntity],
});

export const MongoManager = MyDataSource.mongoManager;
