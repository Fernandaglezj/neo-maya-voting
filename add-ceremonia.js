// Add a test ceremony record
const https = require('https');

const SUPABASE_URL = 'https://cfrmqfwommmpevffmevt.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmcm1xZndvbW1tcGV2ZmZtZXZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUzNTgzODIsImV4cCI6MjA2MDkzNDM4Mn0.E_A81_rGiejA0mUKK5USk-c1tyFF-mabaTxsCPD6P_Y';

// Check the schema definition of the ceremonias table
function checkSchema() {
  console.log('Checking ceremonias table schema...');
  
  https.get(`${SUPABASE_URL}/rest/v1/ceremonias?select=*`, {
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Prefer': 'count=exact'
    }
  }, (res) => {
    console.log('Schema check status:', res.statusCode);
    console.log('Content-Type:', res.headers['content-type']);
    console.log('Content-Range:', res.headers['content-range']);
    
    // Proceed to create a new record
    addCeremonia();
  }).on('error', (err) => {
    console.error('Error checking schema:', err.message);
  });
}

// Add a test ceremony
function addCeremonia() {
  console.log('\nAttempting to add a test ceremony...');
  
  const currentDate = new Date().toISOString();
  
  // Test ceremony data
  const ceremonyData = {
    nombre: "CEREMONIA TEST",
    fecha_inicio: currentDate,
    activa: true,
    codigo_maestro: "TEST123"
  };
  
  // Convert data to JSON
  const postData = JSON.stringify(ceremonyData);
  
  // Set up the request options
  const options = {
    hostname: SUPABASE_URL.replace('https://', ''),
    path: '/rest/v1/ceremonias',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Prefer': 'return=representation',
      'Content-Length': Buffer.byteLength(postData)
    }
  };
  
  // Make the POST request
  const req = https.request(options, (res) => {
    console.log('Status:', res.statusCode);
    console.log('Headers:', JSON.stringify(res.headers));
    
    let responseData = '';
    res.on('data', (chunk) => {
      responseData += chunk;
    });
    
    res.on('end', () => {
      console.log('Response:', responseData);
      
      if (res.statusCode >= 200 && res.statusCode < 300) {
        console.log('\nCeremony added successfully!');
        
        // Now verify if we can read it back
        console.log('\nVerifying by reading the data back...');
        checkCeremonias();
      } else {
        console.log('\nFailed to add ceremony.');
      }
    });
  });
  
  req.on('error', (e) => {
    console.error(`Problem with request: ${e.message}`);
  });
  
  // Write data to the request body
  req.write(postData);
  req.end();
}

// Check if we can read the ceremonies
function checkCeremonias() {
  https.get(`${SUPABASE_URL}/rest/v1/ceremonias?select=*`, {
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`
    }
  }, (res) => {
    console.log('Check ceremonies status:', res.statusCode);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      if (data) {
        try {
          const jsonData = JSON.parse(data);
          console.log('Ceremonies found:', jsonData.length);
          console.log('Data:', JSON.stringify(jsonData, null, 2));
        } catch (error) {
          console.error('Error parsing JSON response:', error);
        }
      } else {
        console.log('No data returned.');
      }
    });
  }).on('error', (err) => {
    console.error('Error reading ceremonies:', err.message);
  });
}

// Start the process
checkSchema(); 