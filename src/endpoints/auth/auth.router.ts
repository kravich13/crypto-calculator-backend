import { FastifyPluginAsync, FastifyPluginOptions } from 'fastify';
import { jwtConfig } from '../../shared/configs';
import { checkAccessToken } from '../../shared/hooks';
import { signUpRouter, validateEmailRouter } from './auth.controller';

const { secret } = jwtConfig;

export const authRouter: FastifyPluginAsync<FastifyPluginOptions> = async (server, options) => {
  server.addHook('preHandler', async (req, reply) => {
    await checkAccessToken(secret, req.headers.authorization);
  });
  await server.register(signUpRouter);
  await server.register(validateEmailRouter);
};
