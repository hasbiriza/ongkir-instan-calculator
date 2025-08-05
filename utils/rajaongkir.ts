// utils/rajaongkir.ts (Versi Final dengan URL Resmi RajaOngkir Pro)

import type { RajaOngkirSearchResponse, RajaOngkirSearchResult, RajaOngkirCostResponse, RajaOngkirServiceCost } from '../lib/types';

// PERBAIKAN: Menggunakan Base URL resmi dari RajaOngkir Komerce API
const RAJAONGKIR_BASE_URL = 'https://rajaongkir.komerce.id/api/v1';
const API_KEY = process.env.RAJAONGKIR_API_KEY;

// Semua kurir yang tersedia di RajaOngkir Komerce
const ALL_COURIERS = 'jne:sicepat:jnt:ninja:tiki:anteraja:pos:lion:rex:rpx:sentral:star:wahana:dse:ide:sap:ncs';

if (!API_KEY) {
  throw new Error('RAJAONGKIR_API_KEY environment variable is required');
}

export async function searchDestination(cityQuery: string): Promise<RajaOngkirSearchResult | null> {
  try {
    const response = await fetch(`${RAJAONGKIR_BASE_URL}/destination/domestic-destination?search=${encodeURIComponent(cityQuery)}&limit=5`, {
      headers: {
        'key': API_KEY
      }
    });

    if (!response.ok) {
      console.error("RajaOngkir search API error:", await response.text());
      throw new Error('RajaOngkir search API request failed');
    }
    
    const data = await response.json() as any;
    
    // Ambil hasil pertama yang paling relevan
    if (data.data && data.data.length > 0) {
      const firstResult = data.data[0];
      return {
        city_id: firstResult.id.toString(), // Gunakan id sebagai city_id
        province_id: '11', // Default untuk Jawa Timur
        province: firstResult.province_name,
        type: 'Kota',
        city_name: firstResult.city_name,
        postal_code: firstResult.zip_code
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error searching destination:', error);
    return null;
  }
}

export async function calculateCost(originSubdistrictId: string, destinationSubdistrictId: string, weightInGrams: number): Promise<RajaOngkirServiceCost[] | undefined> {
  try {
    const formData = new URLSearchParams();
    formData.append('origin', originSubdistrictId);
    formData.append('destination', destinationSubdistrictId);
    formData.append('weight', weightInGrams.toString());
    formData.append('courier', ALL_COURIERS);
    formData.append('price', 'lowest');

    const response = await fetch(`${RAJAONGKIR_BASE_URL}/calculate/domestic-cost`, {
      method: 'POST',
      headers: {
        'key': API_KEY,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData
    });

    if (!response.ok) {
      console.error("RajaOngkir cost calculation API error:", await response.text());
      throw new Error('RajaOngkir cost calculation API request failed');
    }
    
    const data = await response.json() as any;
    
    // Extract shipping rates from response
    if (data.data && data.data.length > 0) {
      const rates: RajaOngkirServiceCost[] = [];
      
      data.data.forEach((service: any) => {
        rates.push({
          service: service.service,
          description: service.description,
          cost: [{
            value: service.cost,
            etd: service.etd,
            note: service.description
          }]
        });
      });
      
      return rates;
    }
    
    return [];
  } catch (error) {
    console.error('Error calculating cost:', error);
    return [];
  }
}