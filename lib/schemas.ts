// lib/schemas.ts
import { z } from 'zod';

export const calculateRequestBodySchema = z.object({
  destination: z.object({
    city: z.string().min(3),
    // Kita buat optional jika data dari Shopify tidak lengkap
    address1: z.string().optional(),
    province: z.string().optional(),
    countryCode: z.string().optional(),
  }),
  origin: z.object({
    subdistrictId: z.string(),
  }),
  weightInGrams: z.number().int().positive(),
});

// Tipe data ini bisa kita gunakan di kode kita
export type CalculateRequestBody = z.infer<typeof calculateRequestBodySchema>;