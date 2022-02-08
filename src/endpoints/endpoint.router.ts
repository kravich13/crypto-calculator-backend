import { FastifyPluginAsync, FastifyPluginOptions } from 'fastify';
import { initAsyncLocalStorage } from '../shared/services/async-local-storage';
import { authRouter } from './auth/auth.router';

export const endpointRouter: FastifyPluginAsync<FastifyPluginOptions> = async (instance) => {
  instance.addHook('preHandler', (req, reply, done) => {
    initAsyncLocalStorage(done);
  });

  await instance.register(authRouter, { prefix: 'auth' });
};
