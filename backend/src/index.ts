import { fileURLToPath } from 'node:url';
import path from 'node:path';
import Fastify from 'fastify';
import { fastifyStatic } from '@fastify/static';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.join(path.dirname(__filename), '../'); // ensure __dirname is the top directory level

const fastify = Fastify(/* {logger: true} */);
fastify.register(fastifyStatic, {
  root: path.join(__dirname, 'public'),
  // prefix: '/public/', // optional, to specifically follow routes containing '/public/...'
});

fastify.get('/api', async (req, res) => {
  res.type('application/json').code(200);
  return { result: 'hello_world' };
});

fastify.get('/', async (req, res) => {
  return await res.sendFile('index.html');
});

fastify.listen({ host: '0.0.0.0', port: 3000 }, (err, address) => {
  if (err != null) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server is now listening on ${address}`);
});
