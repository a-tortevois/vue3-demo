import { fileURLToPath } from 'node:url';
import path from 'node:path';

import Fastify from 'fastify';
import { RequestHeadersDefault } from 'fastify';
import cors from '@fastify/cors';
import { fastifyStatic } from '@fastify/static';

import { OrderBy, SortMode } from './types/employees.js';
import { EmployeesQueryString, EmployeeFilterParams, getEmployees, getEmployeesFilterProps, exportEmployees } from './models/employees.js';

import XLSX from 'xlsx';

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
    const orderedBy = req.query['orderedBy'] !== undefined && Object.keys(OrderBy).includes(req.query['orderedBy']) ? req.query['orderedBy'] : OrderBy.fullName;
    const sortMode = req.query['sortMode'] !== undefined && Object.keys(SortMode).includes(req.query['sortMode']) ? req.query['sortMode'] : SortMode.asc;
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

// Return a XLSX buffer
fastify.get<{ Querystring: EmployeesQueryString; Headers: RequestHeadersDefault }>('/api/v1/employees/export', async (req, res) => {
  const orderedBy = req.query['orderedBy'] !== undefined && Object.keys(OrderBy).includes(req.query['orderedBy']) ? req.query['orderedBy'] : OrderBy.fullName;
  const sortMode = req.query['sortMode'] !== undefined && Object.keys(SortMode).includes(req.query['sortMode']) ? req.query['sortMode'] : SortMode.asc;
  const filters = req.query['filters'] !== undefined ? (JSON.parse(req.query['filters']) as EmployeeFilterParams[]) : null;
  const employees = exportEmployees(orderedBy, sortMode, filters);
  const worksheet = XLSX.utils.json_to_sheet(employees);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'data');
  // XLSX.writeFile(workbook, fileName, { compression: true });
  const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  res.header('Content-Type', 'application/vnd.ms-excel');
  res.header('Content-Disposition', `attachment; filename="data.xlsx"`);
  res.header('Access-Control-Expose-Headers', 'Content-Disposition');
  res.code(200);
  res.send(buffer);
});

// Return the filter properties
fastify.get<{ Querystring: EmployeesQueryString; Headers: RequestHeadersDefault }>('/api/v1/employeesFilterProps', async (_, res) => {
  const employeesFilterProps = getEmployeesFilterProps();
  res.type('application/json').code(200);
  return { ...employeesFilterProps };
});

fastify.get('/', async (_, res) => {
  return await res.sendFile('index.html');
});

fastify.listen({ host: '0.0.0.0', port: 3001 }, (err, address) => {
  if (err != null) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server is now listening on ${address}`);
});
