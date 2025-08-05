import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  if (request.method !== 'POST') {
    response.status(405).send('Method Not Allowed');
    return;
  }
  
  response.status(200).json({
    message: "Welcome to Ongkir Instan Calculator API!",
    received_body: request.body,
  });
}