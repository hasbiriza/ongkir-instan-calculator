// api/calculate.ts (Versi Sederhana Tanpa Caching)

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { calculateRequestBodySchema } from '../lib/schemas';
import { searchDestination, calculateCost } from '../utils/rajaongkir';

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  try {
    if (request.method !== 'POST') {
      return response.status(405).send('Method Not Allowed');
    }

    // 1. Validasi Input menggunakan Zod
    const validation = calculateRequestBodySchema.safeParse(request.body);
    if (!validation.success) {
      return response.status(400).json({ error: 'Invalid request body', details: validation.error.issues });
    }
    const { destination, origin, weightInGrams } = validation.data;

    // Logika Caching DIHAPUS

    // 2. Langsung panggil API RajaOngkir untuk mencari destinasi
    const destinationDetails = await searchDestination(destination.city);

    if (!destinationDetails) {
      return response.status(404).json({ error: 'Destination city not found' });
    }
    const destinationSubdistrictId = destinationDetails.city_id; // Sementara gunakan city_id, nanti bisa diubah ke subdistrict_id

    // 3. Hitung ongkos kirim
    const rates = await calculateCost(origin.subdistrictId, destinationSubdistrictId, weightInGrams);

    if (!rates || rates.length === 0) {
      return response.status(200).json({ rates: [], message: 'No shipping rates found for this destination.' });
    }

    // Logika Simpan ke Cache DIHAPUS

    // 4. Kembalikan hasil
    // Perhatikan: 'source' kita hapus dari respons karena tidak relevan lagi
    return response.status(200).json({ rates });

  } catch (error) {
    // Jika terjadi error, log ke konsol
    console.error('An unexpected error occurred:', error);
    
    // Kembalikan response error yang generik ke pengguna
    return response.status(500).json({ error: 'An internal server error occurred.' });
  }
}