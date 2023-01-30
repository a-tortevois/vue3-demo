import test from 'node:test';
import assert from 'node:assert/strict';
import querystring from 'node:querystring';

const BASE_URL = 'http://127.0.0.1:3000/api/v1/employees';
const DATASET_LENGTH = 1785;

const getUrlWithSearchParams = (searchParams) => {
  let url = BASE_URL;
  if (searchParams.length > 0) {
    url += `?${searchParams}`;
  }
  console.log(`call`, url);
  return url;
};

// Pagination

test('It sould return the first 20 employees', async () => {
  const limit = 20;
  const searchParams = querystring.encode({});
  const url = getUrlWithSearchParams(searchParams);
  const params = {
    method: 'GET',
    headers: {},
  };
  const res = await fetch(url, params);
  if (res.status === 200) {
    const { count, data } = await res.json();
    assert(count === DATASET_LENGTH);
    assert(data.length === limit);
    assert(data[0].fullName === 'Abbotts Sarita');
    assert(data[data.length - 1].fullName === 'Aldcorn Garik');
  }
});

test('It sould return the first 50 employees', async () => {
  const limit = 50;
  const searchParams = querystring.encode({ limit });
  const url = getUrlWithSearchParams(searchParams);
  const params = {
    method: 'GET',
    headers: {},
  };
  const res = await fetch(url, params);
  if (res.status === 200) {
    const { data } = await res.json();
    assert(data.length === limit);
    assert(data[0].fullName === 'Abbotts Sarita');
    assert(data[data.length - 1].fullName === 'Antoniewski Fiann');
  }
});

test('It sould return the next 20 employees (page 2)', async () => {
  const limit = 20;
  const searchParams = querystring.encode({ page: 2 });
  const url = getUrlWithSearchParams(searchParams);
  const params = {
    method: 'GET',
    headers: {},
  };
  const res = await fetch(url, params);
  if (res.status === 200) {
    const { data } = await res.json();
    assert(data.length === limit);
    assert(data[0].fullName === 'Aldrick Marney');
    assert(data[data.length - 1].fullName === 'Andrea Manny');
  }
});

test('It sould return the next 50 employees (page 2)', async () => {
  const limit = 50;
  const searchParams = querystring.encode({ page: 2, limit });
  const url = getUrlWithSearchParams(searchParams);
  const params = {
    method: 'GET',
    headers: {},
  };
  const res = await fetch(url, params);
  if (res.status === 200) {
    const { data } = await res.json();
    assert(data.length === limit);
    assert(data[0].fullName === 'Antonoyev Isiahi');
    assert(data[data.length - 1].fullName === 'Barltrop Merralee');
  }
});

test('It sould return the last 20 employees (last page)', async () => {
  const limit = 20;
  const searchParams = querystring.encode({ page: Math.ceil(DATASET_LENGTH / limit) });
  const url = getUrlWithSearchParams(searchParams);
  const params = {
    method: 'GET',
    headers: {},
  };
  const res = await fetch(url, params);
  if (res.status === 200) {
    const { data } = await res.json();
    const remainder = DATASET_LENGTH - Math.floor(DATASET_LENGTH / limit) * limit;
    assert(data.length === remainder);
    assert(data[0].fullName === 'Yushkov Terra');
    assert(data[data.length - 1].fullName === 'Ziemens Malena');
  }
});

test('It sould return the last 50 employees (last page)', async () => {
  const limit = 50;
  const searchParams = querystring.encode({ page: Math.ceil(DATASET_LENGTH / limit), limit });
  const url = getUrlWithSearchParams(searchParams);
  const params = {
    method: 'GET',
    headers: {},
  };
  const res = await fetch(url, params);
  if (res.status === 200) {
    const { data } = await res.json();
    const remainder = DATASET_LENGTH - Math.floor(DATASET_LENGTH / limit) * limit;
    assert(data.length === remainder);
    assert(data[0].fullName === 'Wix Betsey');
    assert(data[data.length - 1].fullName === 'Ziemens Malena');
  }
});

// Ordered by

test('It sould return the first employee ordered by `fullName`', async () => {
  const searchParams = querystring.encode({ orderedBy: 'fullName', sort: 'asc' });
  const url = getUrlWithSearchParams(searchParams);
  const params = {
    method: 'GET',
    headers: {},
  };
  const res = await fetch(url, params);
  if (res.status === 200) {
    const { data } = await res.json();
    assert(data[0].fullName === 'Abbotts Sarita');
  }
});

test('It sould return the last employee ordered by `fullName`', async () => {
  const searchParams = querystring.encode({ orderedBy: 'fullName', sort: 'desc' });
  const url = getUrlWithSearchParams(searchParams);
  const params = {
    method: 'GET',
    headers: {},
  };
  const res = await fetch(url, params);
  if (res.status === 200) {
    const { data } = await res.json();
    assert(data[0].fullName === 'Ziemens Malena');
  }
});

test('It should return the first employee ordered by `birthDate`', async () => {
  const searchParams = querystring.encode({ orderedBy: 'birthDate', sort: 'asc' });
  const url = getUrlWithSearchParams(searchParams);
  const params = {
    method: 'GET',
    headers: {},
  };
  const res = await fetch(url, params);
  if (res.status === 200) {
    const { data } = await res.json();
    assert(data[0].birthDate === new Date('1975-01-06').getTime() / 1_000);
  }
});

test('It should return the last employee ordered by `birthDate`', async () => {
  const searchParams = querystring.encode({ orderedBy: 'birthDate', sort: 'desc' });
  const url = getUrlWithSearchParams(searchParams);
  const params = {
    method: 'GET',
    headers: {},
  };
  const res = await fetch(url, params);
  if (res.status === 200) {
    const { data } = await res.json();
    assert(data[0].birthDate === new Date('1999-12-27').getTime() / 1_000);
  }
});

test('It should return the first employee ordered by `startDate`', async () => {
  const searchParams = querystring.encode({ orderedBy: 'startDate', sort: 'asc' });
  const url = getUrlWithSearchParams(searchParams);
  const params = {
    method: 'GET',
    headers: {},
  };
  const res = await fetch(url, params);
  if (res.status === 200) {
    const { data } = await res.json();
    assert(data[0].startDate === new Date('1998-12-30').getTime() / 1_000);
  }
});

test('It should return the last employee ordered by `startDate`', async () => {
  const searchParams = querystring.encode({ orderedBy: 'startDate', sort: 'desc' });
  const url = getUrlWithSearchParams(searchParams);
  const params = {
    method: 'GET',
    headers: {},
  };
  const res = await fetch(url, params);
  if (res.status === 200) {
    const { data } = await res.json();
    assert(data[0].startDate === new Date('2023-01-29').getTime() / 1_000);
  }
});

test('It should return the first employee ordered by `office`', async () => {
  const searchParams = querystring.encode({ orderedBy: 'office', sort: 'asc' });
  const url = getUrlWithSearchParams(searchParams);
  const params = {
    method: 'GET',
    headers: {},
  };
  const res = await fetch(url, params);
  if (res.status === 200) {
    const { data } = await res.json();
    assert(data[0].office === 'Amsterdam');
  }
});

test('It should return the last employee ordered by `office`', async () => {
  const searchParams = querystring.encode({ orderedBy: 'office', sort: 'desc' });
  const url = getUrlWithSearchParams(searchParams);
  const params = {
    method: 'GET',
    headers: {},
  };
  const res = await fetch(url, params);
  if (res.status === 200) {
    const { data } = await res.json();
    assert(data[0].office === 'Paris');
  }
});

test('It should return the first employee ordered by `jobTitle`', async () => {
  const searchParams = querystring.encode({ orderedBy: 'jobTitle', sort: 'asc' });
  const url = getUrlWithSearchParams(searchParams);
  const params = {
    method: 'GET',
    headers: {},
  };
  const res = await fetch(url, params);
  if (res.status === 200) {
    const { data } = await res.json();
    assert(data[0].jobTitle === 'Development Team Leader');
  }
});

test('It should return the last employee ordered by `jobTitle`', async () => {
  const searchParams = querystring.encode({ orderedBy: 'jobTitle', sort: 'desc' });
  const url = getUrlWithSearchParams(searchParams);
  const params = {
    method: 'GET',
    headers: {},
  };
  const res = await fetch(url, params);
  if (res.status === 200) {
    const { data } = await res.json();
    assert(data[0].jobTitle === 'Systems Architect');
  }
});

test('It should return the first employee ordered by `salary`', async () => {
  const searchParams = querystring.encode({ orderedBy: 'salary', sort: 'asc' });
  const url = getUrlWithSearchParams(searchParams);
  const params = {
    method: 'GET',
    headers: {},
  };
  const res = await fetch(url, params);
  if (res.status === 200) {
    const { data } = await res.json();
    assert(data[0].salary === 35008);
  }
});

test('It should return the last employee ordered by `salary`', async () => {
  const searchParams = querystring.encode({ orderedBy: 'salary', sort: 'desc' });
  const url = getUrlWithSearchParams(searchParams);
  const params = {
    method: 'GET',
    headers: {},
  };
  const res = await fetch(url, params);
  if (res.status === 200) {
    const { data } = await res.json();
    assert(data[0].salary === 79995);
  }
});

// Filter

test('It should return the first 20 employees filtered by `startDate < 2010-01-01`', async () => {
  const limit = 20;
  const searchParams = querystring.encode({ orderedBy: 'startDate', filters: JSON.stringify([{ key: 'startDate', to: '2010-01-01' }]) });
  const url = getUrlWithSearchParams(searchParams);
  const params = {
    method: 'GET',
    headers: {},
  };
  const res = await fetch(url, params);
  if (res.status === 200) {
    const { count, data } = await res.json();
    assert(count === 268);
    assert(data.length === limit);
    assert(data[0].startDate === new Date('1998-12-30').getTime() / 1_000);
    assert(data[data.length - 1].startDate === new Date('2001-07-30').getTime() / 1_000);
  }
});

test('It should return the next employees filtered by `startDate < 2010-01-01` (page 2)', async () => {
  const limit = 20;
  const searchParams = querystring.encode({ orderedBy: 'startDate', page: 2, filters: JSON.stringify([{ key: 'startDate', to: '2010-01-01' }]) });
  const url = getUrlWithSearchParams(searchParams);
  const params = {
    method: 'GET',
    headers: {},
  };
  const res = await fetch(url, params);
  if (res.status === 200) {
    const { data } = await res.json();
    assert(data.length === limit);
    assert(data[0].startDate === new Date('2001-08-23').getTime() / 1_000);
    assert(data[data.length - 1].startDate === new Date('2003-03-09').getTime() / 1_000);
  }
});

test('It should return the last employees filtered by `startDate < 2010-01-01` (page 14)', async () => {
  const limit = 20;
  const page = 14; // Math.ceil(268/20)
  const searchParams = querystring.encode({ orderedBy: 'startDate', page, filters: JSON.stringify([{ key: 'startDate', to: '2010-01-01' }]) });
  const url = getUrlWithSearchParams(searchParams);
  const params = {
    method: 'GET',
    headers: {},
  };
  const res = await fetch(url, params);
  if (res.status === 200) {
    const { count, data } = await res.json();
    const remainder = count - (page - 1) * limit;
    assert(data.length === remainder);
    assert(data[0].startDate === new Date('2009-11-02').getTime() / 1_000);
    assert(data[data.length - 1].startDate === new Date('2009-12-15').getTime() / 1_000);
  }
});
