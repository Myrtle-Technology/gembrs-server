import { Request } from 'express';

export function getSeverBaseUrl(request: Request) {
  return 'https://' + request.header('host');
}
