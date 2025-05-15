// Simple script to test Supabase connectivity
const https = require('https');

const SUPABASE_URL = 'https://cfrmqfwommmpevffmevt.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmcm1xZndvbW1tcGV2ZmZtZXZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUzNTgzODIsImV4cCI6MjA2MDkzNDM4Mn0.E_A81_rGiejA0mUKK5USk-c1tyFF-mabaTxsCPD6P_Y';

// Function to test basic connection to Supabase
function testConnection() {
  console.log(`Testing connection to Supabase URL: ${SUPABASE_URL}`);
  
  // Simple HTTPS GET request
  https.get(`${SUPABASE_URL}/rest/v1/`, {
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`
    }
  }, (res) => {
    console.log('Status Code:', res.statusCode);
    console.log('Headers:', res.headers);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('Response Body:', data);
      console.log('\nConnection test completed.');
    });
  }).on('error', (err) => {
    console.error('Connection Error:', err.message);
  });
}

// Test connection to a specific table
function testTable(tableName) {
  console.log(`\nTesting connection to table: ${tableName}`);
  
  // Using proper query syntax with select=* instead of any counting operation
  https.get(`${SUPABASE_URL}/rest/v1/${tableName}?select=*&limit=1`, {
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`
    }
  }, (res) => {
    console.log('Status Code:', res.statusCode);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('Response:', data.length > 200 ? data.substring(0, 200) + '...' : data);
    });
  }).on('error', (err) => {
    console.error(`Error accessing ${tableName}:`, err.message);
  });
}

// Run tests
console.log('=== Supabase Connection Test ===');
testConnection();
setTimeout(() => testTable('ceremonias'), 2000);
setTimeout(() => testTable('equipos'), 4000); 