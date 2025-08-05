// api/calculate-shopify.ts - Optimized for Shopify Function
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { calculateRequestBodySchema } from '../lib/schemas';
import { searchDestination, calculateCost } from '../utils/rajaongkir';

// Cache TTL dalam detik (30 menit)
const CACHE_TTL_SECONDS = 1800;

// Simple in-memory cache (untuk production gunakan Redis/database)
const cache = new Map<string, { data: any; timestamp: number }>();

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  try {
    if (request.method !== 'POST') {
      return response.status(405).json({ error: 'Method Not Allowed' });
    }

    // 1. Validasi Input
    const validation = calculateRequestBodySchema.safeParse(request.body);
    if (!validation.success) {
      return response.status(400).json({ 
        error: 'Invalid request body', 
        details: validation.error.issues 
      });
    }
    
    const { destination, origin, weightInGrams } = validation.data;

    // 2. Validasi berat minimum
    if (weightInGrams < 100) {
      return response.status(400).json({ 
        error: 'Minimum weight is 100 grams' 
      });
    }

    // 3. Cache key berdasarkan input
    const cacheKey = `shopify:${origin.subdistrictId}:${destination.city.toLowerCase()}:${weightInGrams}`;
    
    // 4. Cek cache
    const cached = cache.get(cacheKey);
    if (cached && (Date.now() - cached.timestamp) < (CACHE_TTL_SECONDS * 1000)) {
      console.log('Cache HIT for Shopify request');
      return response.status(200).json(cached.data);
    }

    // 5. Search destination
    const destinationDetails = await searchDestination(destination.city);
    if (!destinationDetails) {
      return response.status(404).json({ 
        error: 'Destination city not found',
        message: 'Kota tujuan tidak ditemukan. Silakan cek kembali nama kota.'
      });
    }

    // 6. Calculate shipping rates
    const rates = await calculateCost(origin.subdistrictId, destinationDetails.city_id, weightInGrams);

    if (!rates || rates.length === 0) {
      return response.status(200).json({ 
        rates: [], 
        message: 'Tidak ada layanan pengiriman yang tersedia untuk tujuan ini.' 
      });
    }

    // 7. Format response untuk Shopify
    const shopifyResponse = {
      rates: rates.map(rate => ({
        service_name: rate.service,
        service_code: rate.service,
        total_price: rate.cost[0].value,
        currency: 'IDR',
        min_delivery_date: null, // Bisa dihitung dari ETD
        max_delivery_date: null, // Bisa dihitung dari ETD
        phone_required: false,
        description: rate.description
      })),
      source: 'rajaongkir'
    };

    // 8. Cache hasil
    cache.set(cacheKey, {
      data: shopifyResponse,
      timestamp: Date.now()
    });

    // 9. Cleanup cache lama (setiap 100 request)
    if (cache.size > 1000) {
      const now = Date.now();
      for (const [key, value] of cache.entries()) {
        if ((now - value.timestamp) > (CACHE_TTL_SECONDS * 1000)) {
          cache.delete(key);
        }
      }
    }

    return response.status(200).json(shopifyResponse);

  } catch (error) {
    console.error('Shopify calculate error:', error);
    
    // Error response yang friendly untuk Shopify
    return response.status(500).json({ 
      error: 'Shipping calculation failed',
      message: 'Terjadi kesalahan dalam menghitung ongkos kirim. Silakan coba lagi.',
      retry_after: 30 // Retry setelah 30 detik
    });
  }
} 