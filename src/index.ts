import dotenv from 'dotenv';
dotenv.config();
import fastify from 'fastify';
import { endpointRouter } from './endpoints/endpoint.router';
import { connectToDB } from './shared/database';
import { registerFastifySwagger } from './shared/plugins/swagger';

const PORT = process.env.PORT ?? 5000;
const server = fastify({ logger: true });

const start = async () => {
  registerFastifySwagger(server);
  await server.register(endpointRouter);
  await connectToDB();
  server.listen(PORT, (err) => {
    if (err) {
      server.log.error(err);
      process.exit(1);
    }
    console.log(`The server started on the PORT ${PORT}!`);
  });
};

start();
