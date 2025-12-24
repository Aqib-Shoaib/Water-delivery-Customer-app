const https = require('https');

const API_BASE = 'https://api.kshealthplus.site';

function checkEndpoint(endpoint) {
  return new Promise((resolve, reject) => {
    https.get(`${API_BASE}${endpoint}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve({ status: res.statusCode, data: JSON.parse(data) });
          } else {
            resolve({ status: res.statusCode, error: data });
          }
        } catch (e) {
            // response might not be json
             resolve({ status: res.statusCode, error: data });
        }
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

(async () => {
  console.log(`Checking connection to ${API_BASE}...`);
  try {
    // Check Health
    console.log('1. Checking /api/health or root...');
    const health = await checkEndpoint('/'); 
    console.log('Root Status:', health.status);

    // Check Products (Public endpoint usually)
    console.log('2. Checking /api/products...');
    const products = await checkEndpoint('/api/products');
    
    if (products.status === 200) {
      console.log('✅ Products Endpoint Works');
      if (Array.isArray(products.data)) {
        console.log(`   Found ${products.data.length} products.`);
      } else {
        console.log('   Warning: products data is not an array.');
      }
    } else {
      console.log('❌ Products Endpoint Failed:', products.status);
    }
    
  } catch (err) {
    console.error('❌ Connection Failed:', err.message);
  }
})();
