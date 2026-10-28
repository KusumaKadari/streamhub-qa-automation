const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const endpoint = 'https://jsonplaceholder.typicode.com/posts';
const executions = [];

async function sendPost(request, payload) {
  const response = await request.post(endpoint, { data: payload });
  const status = response.status();
  const body = await response.json();
  return { status, body, headers: response.headers() };
}

function record(name, payload, status, body) {
  executions.push({ name, requestPayload: payload, actualStatus: status, responseBody: body });
  console.log(`[API RESULT] ${name}`);
  console.log(`Request: ${JSON.stringify(payload)}`);
  console.log(`Status: ${status}`);
  console.log(`Response body: ${JSON.stringify(body)}`);
}

test.afterAll(async () => {
  const outputDir = path.resolve(__dirname, '..', 'test-results');
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(path.join(outputDir, 'api-execution-results.json'), JSON.stringify({
    endpoint,
    executedAt: new Date().toISOString(),
    executions
  }, null, 2));

  const lines = executions.map((item) => {
    const compactBody = { ...item.responseBody };
    if (typeof compactBody.title === 'string' && compactBody.title.length > 120) {
      compactBody.title = `${compactBody.title.slice(0, 40)}... [2048-character title; full value in api-execution-results.json]`;
    }
    const bodyText = JSON.stringify(compactBody).replace(/\n/g, ' ');
    return `| ${item.name} | ${item.actualStatus} | \`${bodyText}\` |`;
  });
  fs.writeFileSync(path.join(outputDir, 'api-execution-summary.md'), `# JSONPlaceholder POST /posts API Results\n\nEndpoint: \`${endpoint}\`\n\n| Scenario | Actual HTTP status | Actual response body |\n|---|---:|---|\n${lines.join('\n')}\n\n## Interpretation\nJSONPlaceholder is a mock API. Invalid-looking payloads returned HTTP 201 and echoed the supplied fields instead of applying stricter assessment-style validation with 4xx responses.\n`);
});

test('POST valid request returns the actual mock response', async ({ request }) => {
  const payload = { title: 'SaveSmart API Test', body: 'Valid savings post', userId: 7 };
  const { status, body } = await sendPost(request, payload);
  record('Normal valid request', payload, status, body);

  expect(status).toBe(201);
  expect(body).toMatchObject(payload);
  expect(body.id).toBe(101);
});

test('POST excessively long title is recorded without assumed validation', async ({ request }) => {
  const payload = { title: 'L'.repeat(2048), body: 'Long-title payload', userId: 12 };
  const { status, body } = await sendPost(request, payload);
  record('Excessively long title', payload, status, body);

  expect(status).toBe(201);
  expect(body.title).toBe(payload.title);
  expect(body.body).toBe(payload.body);
  expect(body.userId).toBe(payload.userId);
  expect(body.id).toBe(101);
});

test('POST unsupported special characters are echoed by the mock API', async ({ request }) => {
  const payload = {
    title: '<script>alert("QA")</script> & % ! @ # $',
    body: 'Symbols: café — 東京 — 😀',
    userId: 9
  };
  const { status, body } = await sendPost(request, payload);
  record('Unsupported special characters', payload, status, body);

  expect(status).toBe(201);
  expect(body).toMatchObject(payload);
  expect(body.id).toBe(101);
});

test('POST missing userId records mock response behavior', async ({ request }) => {
  const payload = { title: 'Missing user ID', body: 'No userId field is supplied' };
  const { status, body } = await sendPost(request, payload);
  record('Missing userId', payload, status, body);

  expect(status).toBe(201);
  expect(body).toEqual({ title: payload.title, body: payload.body, id: 101 });
});

test('POST missing all required fields records mock response behavior', async ({ request }) => {
  const payload = {};
  const { status, body } = await sendPost(request, payload);
  record('Missing required fields', payload, status, body);

  expect(status).toBe(201);
  expect(body).toEqual({ id: 101 });
});
