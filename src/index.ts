import 'dotenv/config';
import Ajv from 'ajv';
import ajvFormats from 'ajv-formats';
import fastify, { FastifyBaseLogger, FastifyInstance } from 'fastify';
import { endpointRouter } from './endpoints/endpoint.router';
import { MyDataSource } from './shared/database';
import { registerGlobal } from './shared/error-handler';
import { registerFastifyCookie } from './shared/plugins/cookie';
import { registerFastifySwagger } from './shared/plugins/swagger';
import { LoggerInstance } from './shared/services';
import cors from '@fastify/cors';
import { registerUpdateCoinListCron } from './shared/plugins/cron';

const ajv = new Ajv({
  strict: true,
  strictTypes: true,
  removeAdditional: true,
  useDefaults: true,
  allErrors: true,
});
ajvFormats(ajv, ['email']);

const envPORT = process.env.PORT;

const PORT = Boolean(envPORT && !Number.isNaN(envPORT)) ? Number(envPORT) : 5001;
const server: FastifyInstance = fastify({ logger: LoggerInstance as FastifyBaseLogger });

const start = async () => {
  registerGlobal(server);
  await MyDataSource.initialize();
  await registerFastifyCookie(server);
  await registerFastifySwagger(server);
  await server.register(cors);
  await server.register(endpointRouter);
  await server.listen({ port: PORT, host: '0.0.0.0' });

  registerUpdateCoinListCron();
};

start();
