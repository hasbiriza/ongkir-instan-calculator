# Shopify Function Integration Guide

## Overview

API ini sudah dioptimasi untuk integrasi dengan Shopify Function pada checkout process.

## Endpoints

### 1. Standard API (Original)
```
POST /api/calculate
```

### 2. Shopify Optimized API
```
POST /api/calculate-shopify
```

## Input Format

### Shopify akan mengirim data seperti ini:
```json
{
  "destination": {
    "city": "Surabaya",
    "address1": "Jl. Sudirman No. 123",
    "province": "Jawa Timur",
    "countryCode": "ID"
  },
  "origin": {
    "subdistrictId": "2584"
  },
  "weightInGrams": 1000
}
```

## Response Format

### Standard Response:
```json
{
  "rates": [
    {
      "service": "REG",
      "description": "Layanan Reguler",
      "cost": [{"value": 75000, "etd": "5 day", "note": "Layanan Reguler"}]
    }
  ]
}
```

### Shopify Optimized Response:
```json
{
  "rates": [
    {
      "service_name": "REG",
      "service_code": "REG",
      "total_price": 75000,
      "currency": "IDR",
      "min_delivery_date": null,
      "max_delivery_date": null,
      "phone_required": false,
      "description": "Layanan Reguler"
    }
  ],
  "source": "rajaongkir"
}
```

## Fitur Shopify Optimized

### ✅ **Performance Optimizations:**
1. **Caching** - 30 menit cache untuk mengurangi API calls
2. **Error Handling** - Friendly error messages
3. **Validation** - Input validation yang ketat
4. **Rate Limiting** - Built-in protection

### ✅ **Shopify Specific:**
1. **Response Format** - Sesuai standar Shopify
2. **Currency** - IDR (Indonesian Rupiah)
3. **Service Codes** - Unique identifiers
4. **Error Messages** - Bahasa Indonesia

### ✅ **Production Ready:**
1. **Logging** - Console logging untuk debugging
2. **Cache Management** - Auto cleanup
3. **Retry Logic** - Built-in retry mechanism
4. **Monitoring** - Performance tracking

## Shopify Function Implementation

### 1. Install Shopify CLI
```bash
npm install -g @shopify/cli @shopify/theme
```

### 2. Create Shopify Function
```bash
shopify app function create --name shipping-calculator
```

### 3. Function Code Example:
```typescript
// shopify-function/shipping-calculator/src/index.ts
import { DeliveryOption } from "../generated/api";

const SHIPPING_API_URL = "https://your-domain.vercel.app/api/calculate-shopify";

export function run(input: Input): Output {
  const { cart } = input;
  
  // Calculate total weight
  const totalWeight = cart.lines.reduce((sum, line) => {
    return sum + (line.merchandise.weight * line.quantity);
  }, 0);

  // Prepare request
  const requestBody = {
    destination: {
      city: cart.deliveryAddress?.city || "",
      address1: cart.deliveryAddress?.address1 || "",
      province: cart.deliveryAddress?.province || "",
      countryCode: cart.deliveryAddress?.countryCode || "ID"
    },
    origin: {
      subdistrictId: "2584" // Your warehouse location
    },
    weightInGrams: Math.round(totalWeight * 1000) // Convert to grams
  };

  try {
    // Call shipping API
    const response = await fetch(SHIPPING_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json();

    // Convert to Shopify format
    const deliveryOptions: DeliveryOption[] = data.rates.map((rate: any) => ({
      handle: rate.service_code,
      title: `${rate.service_name} - ${rate.description}`,
      price: rate.total_price,
      currency: rate.currency
    }));

    return { deliveryOptions };
  } catch (error) {
    console.error("Shipping calculation failed:", error);
    return { deliveryOptions: [] };
  }
}
```

## Environment Variables

```bash
# Required
RAJAONGKIR_API_KEY=your_api_key_here

# Optional (for production)
REDIS_URL=your_redis_url_here
SENTRY_DSN=your_sentry_dsn_here
```

## Testing

### Test Standard API:
```bash
curl -X POST http://localhost:3000/api/calculate \
  -H "Content-Type: application/json" \
  -d '{
    "destination": {"city": "Surabaya"},
    "origin": {"subdistrictId": "2584"},
    "weightInGrams": 1000
  }'
```

### Test Shopify API:
```bash
curl -X POST http://localhost:3000/api/calculate-shopify \
  -H "Content-Type: application/json" \
  -d '{
    "destination": {"city": "Surabaya"},
    "origin": {"subdistrictId": "2584"},
    "weightInGrams": 1000
  }'
```

## Production Checklist

- [ ] Deploy to Vercel/Netlify
- [ ] Set environment variables
- [ ] Configure custom domain
- [ ] Set up monitoring (Sentry)
- [ ] Configure caching (Redis)
- [ ] Test with real Shopify store
- [ ] Monitor API usage
- [ ] Set up alerts

## Support

Untuk dukungan teknis, hubungi tim development atau buat issue di repository. 