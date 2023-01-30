import { fileURLToPath } from 'node:url';
import path from 'node:path';
import Fastify from 'fastify';
import { RequestHeadersDefault } from 'fastify';
import { fastifyStatic } from '@fastify/static';
import { getEmployees, EmployeeQueryString, SortModes } from './employees.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.join(path.dirname(__filename), '../'); // ensure __dirname is the top directory level

const fastify = Fastify(/* {logger: true} */);
fastify.register(fastifyStatic, {
  root: path.join(__dirname, 'public'),
  // prefix: '/public/', // optional, to specifically follow routes containing '/public/...'
});

fastify.get('/api/v1', async (_, res) => {
  res.type('application/json').code(200);
  return { result: 'API version 1' };
});

fastify.get<{ Querystring: EmployeeQueryString; Headers: RequestHeadersDefault }>('/api/v1/employees', async (req, res) => {
  try {
    // Parse & check query string params
    const orderedBy = req.query['orderedBy'] || 'fullName';
    const sort = req.query['sort'] !== undefined && Object.keys(SortModes).includes(req.query['sort']) ? req.query['sort'] : 'asc';
    const page = Number(req.query['page']) || 1;
    const limit = Number(req.query['limit']) || 20;
    const filters = req.query['filters'] !== undefined ? JSON.parse(req.query['filters']) : null;
    const result = getEmployees({ orderedBy, sort, page, limit, filters });
    res.type('application/json').code(200);
    return result;
  } catch (err) {
    res.type('application/json').code(500);
    return {
      error: err,
    };
  }
});

fastify.get('/', async (_, res) => {
  return await res.sendFile('index.html');
});

fastify.listen({ host: '0.0.0.0', port: 3000 }, (err, address) => {
  if (err != null) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server is now listening on ${address}`);
});
