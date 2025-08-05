# RajaOngkir Komerce - Daftar Kurir Lengkap

## Semua Kurir yang Tersedia

Berikut adalah daftar lengkap kurir yang didukung oleh RajaOngkir Komerce API:

### 1. JNE (Jalur Nugraha Ekakurir)
- **Kode**: `jne`
- **Layanan**: REG, JTR, YES, OKE, PAKET, SPEEDY
- **Deskripsi**: Kurir nasional terbesar di Indonesia

### 2. SiCepat
- **Kode**: `sicepat`
- **Layanan**: REG, BEST, PIS, HALU
- **Deskripsi**: Kurir dengan jaringan luas

### 3. J&T Express
- **Kode**: `jnt`
- **Layanan**: EZ, REG, YES
- **Deskripsi**: Kurir dengan harga kompetitif

### 4. Ninja Xpress
- **Kode**: `ninja`
- **Layanan**: STANDARD, EXPRESS, PRIORITY
- **Deskripsi**: Kurir dengan teknologi modern

### 5. TIKI (Citra Van Titipan Kilat)
- **Kode**: `tiki`
- **Layanan**: ECO, REG, DAT, TRC, T15, T25, T60
- **Deskripsi**: Kurir dengan layanan bervariasi

### 6. AnterAja
- **Kode**: `anteraja`
- **Layanan**: REG, YES, SPS
- **Deskripsi**: Kurir dengan layanan premium

### 7. POS Indonesia
- **Kode**: `pos`
- **Layanan**: Pos Reguler, Pos Express
- **Deskripsi**: Layanan pos nasional

### 8. Lion Parcel
- **Kode**: `lion`
- **Layanan**: JAGOPACK, REGPACK, BIGPACK, OTOPACK150, OTOPACK250
- **Deskripsi**: Kurir dengan layanan khusus

### 9. REX (Royal Express)
- **Kode**: `rex`
- **Layanan**: REG, YES
- **Deskripsi**: Kurir dengan jaringan luas

### 10. RPX (RPX Express)
- **Kode**: `rpx`
- **Layanan**: REG, YES
- **Deskripsi**: Kurir dengan layanan cepat

### 11. Sentral Cargo
- **Kode**: `sentral`
- **Layanan**: REG, YES
- **Deskripsi**: Kurir dengan layanan cargo

### 12. Star Cargo
- **Kode**: `star`
- **Layanan**: REG, YES
- **Deskripsi**: Kurir dengan layanan cargo

### 13. Wahana
- **Kode**: `wahana`
- **Layanan**: REG, YES
- **Deskripsi**: Kurir dengan jaringan luas

### 14. DSE (Dakota Sarana Express)
- **Kode**: `dse`
- **Layanan**: REG, YES
- **Deskripsi**: Kurir dengan layanan khusus

### 15. ID Express
- **Kode**: `ide`
- **Layanan**: REG, YES
- **Deskripsi**: Kurir dengan layanan cepat

### 16. SAP (SAP Express)
- **Kode**: `sap`
- **Layanan**: REG, YES
- **Deskripsi**: Kurir dengan layanan premium

### 17. NCS (Nusantara Card Semesta)
- **Kode**: `ncs`
- **Layanan**: REG, YES
- **Deskripsi**: Kurir dengan layanan khusus

## Implementasi di Kode

```typescript
// Semua kurir yang tersedia
const ALL_COURIERS = 'jne:sicepat:jnt:ninja:tiki:anteraja:pos:lion:rex:rpx:sentral:star:wahana:dse:ide:sap:ncs';

// Penggunaan dalam API
formData.append('courier', ALL_COURIERS);
```

## Catatan Penting

1. **Tidak semua kurir melayani semua rute** - tergantung lokasi origin dan destination
2. **Harga bervariasi** - dari termurah (Rp 48.000) sampai premium (Rp 6.000.000+)
3. **ETD (Estimated Time of Delivery)** - bervariasi dari 1-21 hari
4. **1 Request = 1 Hit** - terlepas dari berapa kurir yang diminta

## Rekomendasi

- **Gunakan semua kurir** untuk memberikan pilihan maksimal kepada pelanggan
- **Filter berdasarkan harga** jika perlu menampilkan hanya opsi tertentu
- **Cache hasil** untuk mengurangi request berulang
- **Sort berdasarkan harga** untuk UX yang lebih baik 