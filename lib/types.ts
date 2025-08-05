// lib/types.ts

// Cetakan untuk satu hasil pencarian destinasi
export interface RajaOngkirSearchResult {
    city_id: string;
    province_id: string;
    province: string;
    type: string;
    city_name: string;
    postal_code: string;
  }
  
  // Cetakan untuk seluruh respons dari API pencarian destinasi
  export interface RajaOngkirSearchResponse {
    rajaongkir: {
      query: any[];
      status: {
        code: number;
        description: string;
      };
      results: RajaOngkirSearchResult[];
    };
  }
  
  // Cetakan untuk detail biaya dari satu layanan
  export interface RajaOngkirCostDetail {
      value: number;
      etd: string;
      note: string;
  }
  
  // Cetakan untuk satu layanan pengiriman (misal: JNE REG)
  export interface RajaOngkirServiceCost {
      service: string;
      description: string;
      cost: RajaOngkirCostDetail[];
  }
  
  // Cetakan untuk seluruh respons dari API kalkulasi biaya
  export interface RajaOngkirCostResponse {
      rajaongkir: {
          // Terdapat properti lain di sini, tapi kita hanya butuh 'results'
          results: {
              code: string;
              name: string;
              costs: RajaOngkirServiceCost[];
          }[]; // Ini adalah array karena bisa ada beberapa kurir
      }
  }