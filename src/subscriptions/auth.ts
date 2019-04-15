import { Request } from 'express';

function validateToken(req: Request | string): string {
  let token: string;
  if (typeof req === 'string') {
    token = req;
  } else {
    token = req.headers.authorization || '';
  }
  const parts = token.split(' ');
  const bearer = parts[0];
  const credential = parts[1];
  if (/^Bearer$/i.test(bearer) && credential) {
    return credential;
  }
  throw new Error('Missing auth token!');
}

export { validateToken };
