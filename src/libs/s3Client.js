import fs from 'fs';
import https from 'https';

import { S3Client } from '@aws-sdk/client-s3';

const certs = fs.readFileSync('/path/to/cert.pem');

const s3Client = new S3Client({
  httpOptions: {
    agent: new https.Agent({
      rejectUnauthorized: true,
      ca: certs,
    }),
  },
});

export { s3Client };
