import { fileURLToPath } from 'node:url';
import path from 'node:path';
import Fastify from 'fastify';
import { RequestHeadersDefault } from 'fastify';
import cors from '@fastify/cors';
import { fastifyStatic } from '@fastify/static';
import { EmployeesQueryString, AllowedOrderedBy, SortMode, EmployeeFilterParams, getEmployees, getEmployeesFilterProps } from './employees.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.join(path.dirname(__filename), '../'); // ensure __dirname is the top directory level

const fastify = Fastify(/* {logger: true} */);

fastify.register(cors, {
  // options here
});

fastify.register(fastifyStatic, {
  root: path.join(__dirname, 'public'),
  // prefix: '/public/', // optional, to specifically follow routes containing '/public/...'
});

fastify.get('/api/v1', async (_, res) => {
  res.type('application/json').code(200);
  return { result: 'API version 1' };
});

fastify.get<{ Querystring: EmployeesQueryString; Headers: RequestHeadersDefault }>('/api/v1/employees', async (req, res) => {
  try {
    const orderedBy = req.query['orderedBy'] !== undefined && Object.keys(AllowedOrderedBy).includes(req.query['orderedBy']) ? req.query['orderedBy'] : 'fullName';
    const sortMode = req.query['sortMode'] !== undefined && Object.keys(SortMode).includes(req.query['sortMode']) ? req.query['sortMode'] : 'asc';
    const page = Number(req.query['page']) || 1;
    const limit = Number(req.query['limit']) || 20;
    const filters = req.query['filters'] !== undefined ? (JSON.parse(req.query['filters']) as EmployeeFilterParams[]) : null;
    const { count, data } = getEmployees(orderedBy, sortMode, page, limit, filters);
    res.type('application/json').code(200);
    return { count, data };
  } catch (err) {
    if (err instanceof Error) {
      res.type('application/json').code(500);
      return {
        error: err.message,
      };
    } else {
      console.error(err);
    }
  }
});

fastify.get<{ Querystring: EmployeesQueryString; Headers: RequestHeadersDefault }>('/api/v1/employeesFilterProps', async (_, res) => {
  const employeesFilterProps = getEmployeesFilterProps();
  res.type('application/json').code(200);
  return { ...employeesFilterProps };
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
