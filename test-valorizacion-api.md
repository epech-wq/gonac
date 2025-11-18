# Testing Valorizacion API

## Quick Test Commands

Open your browser console and run these commands to test the API:

### 1. Test Summary Endpoint

```javascript
fetch("/api/valorizacion?format=summary")
  .then((r) => r.json())
  .then((data) => console.log("Summary:", data));
```

### 2. Test Agotado Details

```javascript
fetch("/api/valorizacion?format=agotado-detalle")
  .then((r) => r.json())
  .then((data) => {
    console.log("Agotado Response:", data);
    console.log("Has data array?", Array.isArray(data.data));
    console.log("Data length:", data.data?.length);
  });
```

### 3. Test Caducidad Details

```javascript
fetch("/api/valorizacion?format=caducidad-detalle")
  .then((r) => r.json())
  .then((data) => {
    console.log("Caducidad Response:", data);
    console.log("Has data array?", Array.isArray(data.data));
    console.log("Data length:", data.data?.length);
  });
```

### 4. Test Sin Ventas Details

```javascript
fetch("/api/valorizacion?format=sin-ventas-detalle")
  .then((r) => r.json())
  .then((data) => {
    console.log("Sin Ventas Response:", data);
    console.log("Has data array?", Array.isArray(data.data));
    console.log("Data length:", data.data?.length);
  });
```

## Expected Response Structure

### Summary Response

```json
{
  "success": true,
  "data": {
    "agotado": { "tiendas": 10, "impacto": 50000 },
    "caducidad": { "tiendas": 5, "impacto": 30000 },
    "sinVentas": { "tiendas": 8, "impacto": 20000 },
    "total": { "tiendas": 23, "impacto": 100000 }
  }
}
```

### Detail Response (Agotado, Caducidad, Sin Ventas)

```json
{
  "success": true,
  "data": [
    {
      "segment": "hot",
      "store_name": "Store 1",
      "product_name": "Product A",
      "dias_inventario": 5,
      "impacto": 1000,
      "detectado": "2024-01-01"
    }
  ],
  "total": 10,
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Debugging Steps

1. **Check Browser Console** - Look for the debug logs added:

   - `Hook data:` - Shows what the hooks received
   - `transformAgotadoData received:` - Shows what's being transformed
   - `useValorizacion error:` - Shows any fetch errors

2. **Check Network Tab** - Look at the actual API responses:

   - Status code should be 200
   - Response should have `success: true`
   - Response should have `data` array for detail endpoints

3. **Common Issues**:

   - **Empty data array**: Database tables might be empty
   - **Error 500**: Database connection or query error
   - **"No registers"**: Data is fetched but transformation fails

4. **Database Check** - Verify tables have data:
   ```sql
   SELECT COUNT(*) FROM gonac.agotamiento_detalle;
   SELECT COUNT(*) FROM gonac.caducidad_detalle;
   SELECT COUNT(*) FROM gonac.sin_ventas_detalle;
   ```
