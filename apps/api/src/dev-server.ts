import http from 'node:http';
import { handler as healthHandler } from './handlers/health';
import { handleProjectsRequest } from './handlers/projects';
import { normalizeHeaders } from './headers';

type ResponsePayload = {
  statusCode: number;
  headers?: Record<string, string>;
  body?: string | null;
};

const port = Number(process.env.PORT ?? 3001);

const send = (res: http.ServerResponse, payload: ResponsePayload) => {
  res.statusCode = payload.statusCode;
  if (payload.headers) {
    Object.entries(payload.headers).forEach(([key, value]) => {
      if (value) res.setHeader(key, value);
    });
  }
  res.end(payload.body ?? '');
};

const server = http.createServer(async (req, res) => {
  const method = req.method ?? 'GET';
  const url = new URL(req.url ?? '/', `http://${req.headers.host ?? 'localhost'}`);
  const path = url.pathname;
  const headers = normalizeHeaders(req.headers as Record<string, string | undefined>);

  if (method === 'OPTIONS') {
    return send(res, { statusCode: 204, headers: { 'access-control-allow-origin': '*' } });
  }

  if (path === '/health') {
    const payload = await healthHandler({} as never, {} as never, () => ({} as never));
    return send(res, payload as ResponsePayload);
  }

  if (path === '/projects' || path.startsWith('/projects/')) {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', async () => {
      const payload = await handleProjectsRequest({
        method,
        path,
        headers,
        body: body.length ? body : null,
        requestId: 'local',
        pathParameters: (() => {
          if (!path.startsWith('/projects/')) return undefined;
          const projectId = path.split('/')[2];
          if (!projectId) return undefined;
          return { projectId };
        })(),
      });
      send(res, payload as ResponsePayload);
    });
    return;
  }

  send(res, { statusCode: 404, body: 'Not found' });
});

server.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`API dev server listening on http://localhost:${port}`);
});
