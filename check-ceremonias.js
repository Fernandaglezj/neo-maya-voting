// Simple script to inspect the ceremonias table
const https = require('https');

const SUPABASE_URL = 'https://cfrmqfwommmpevffmevt.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmcm1xZndvbW1tcGV2ZmZtZXZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUzNTgzODIsImV4cCI6MjA2MDkzNDM4Mn0.E_A81_rGiejA0mUKK5USk-c1tyFF-mabaTxsCPD6P_Y';

// Get the ceremonias table data
function getCeremonias() {
  console.log('Fetching ceremonias table data...');
  
  // Direct REST API call
  https.get(`${SUPABASE_URL}/rest/v1/ceremonias?select=*`, {
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
          const jsonData = JSON.parse(data);
          console.log('\n=== Ceremonias Table Data ===');
          console.log(JSON.stringify(jsonData, null, 2));
          
          if (jsonData.length > 0) {
            console.log('\n=== First Record Schema ===');
            const firstRecord = jsonData[0];
            
            // Print the schema of the first record
            console.log('Fields and their values:');
            for (const [key, value] of Object.entries(firstRecord)) {
              const valueType = typeof value;
              console.log(`${key}: ${valueType} = ${JSON.stringify(value)}`);
            }
          } else {
            console.log('No data found in the ceremonias table.');
          }
        } catch (error) {
          console.error('Error parsing JSON response:', error);
          console.log('Raw response:', data);
        }
      } else {
        console.log('No data returned from the API.');
      }
    });
  }).on('error', (err) => {
    console.error('Error accessing ceremonias table:', err.message);
  });
}

// Run the inspection
getCeremonias(); 