// Check all available tables in Supabase
const https = require('https');

const SUPABASE_URL = 'https://cfrmqfwommmpevffmevt.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmcm1xZndvbW1tcGV2ZmZtZXZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUzNTgzODIsImV4cCI6MjA2MDkzNDM4Mn0.E_A81_rGiejA0mUKK5USk-c1tyFF-mabaTxsCPD6P_Y';

// Get all tables
function getTables() {
  console.log('Fetching all tables from Supabase...');
  
  // Direct REST API call to root endpoint
  https.get(`${SUPABASE_URL}/rest/v1/`, {
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
      if (data) {
        try {
          // This will be OpenAPI schema that contains all tables
          console.log('\n=== Available Tables ===');
          
          // The response is large, so we'll extract just the table names
          const apiSchema = JSON.parse(data);
          const paths = apiSchema.paths || {};
          
          // Extract table names from the paths
          const tableNames = Object.keys(paths)
            .filter(path => path !== '/')
            .map(path => path.replace(/^\/|\/$/g, ''))
            .filter((value, index, self) => self.indexOf(value) === index);
          
          console.log(tableNames);
          
          // Try to access each table to see which ones are accessible
          console.log('\n=== Checking Table Access ===');
          tableNames.forEach(tableName => {
            checkTable(tableName);
          });
          
        } catch (error) {
          console.error('Error parsing JSON response:', error);
          console.log('Raw response (partial):', data.substring(0, 500) + '...');
        }
      } else {
        console.log('No data returned from the API.');
      }
    });
  }).on('error', (err) => {
    console.error('Error accessing API:', err.message);
  });
}

// Check a specific table
function checkTable(tableName) {
  https.get(`${SUPABASE_URL}/rest/v1/${tableName}?limit=1`, {
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`
    }
  }, (res) => {
    console.log(`Table "${tableName}" - Status: ${res.statusCode}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      if (data && res.statusCode === 200) {
        try {
          const jsonData = JSON.parse(data);
          if (jsonData.length > 0) {
            console.log(`- Table "${tableName}" contains data: ${JSON.stringify(jsonData).substring(0, 100)}...`);
          } else {
            console.log(`- Table "${tableName}" is empty`);
          }
        } catch (error) {
          console.error(`- Error parsing data from "${tableName}":`, error);
        }
      }
    });
  }).on('error', (err) => {
    console.error(`- Error accessing table "${tableName}":`, err.message);
  });
}

// Run the inspection
getTables(); 