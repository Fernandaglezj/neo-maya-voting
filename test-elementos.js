// Test script for elementos_usuarios table
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://cfrmqfwommmpevffmevt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmcm1xZndvbW1tcGV2ZmZtZXZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUzNTgzODIsImV4cCI6MjA2MDkzNDM4Mn0.E_A81_rGiejA0mUKK5USk-c1tyFF-mabaTxsCPD6P_Y';

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

async function testElementosUsuariosTable() {
  console.log('Testing elementos_usuarios table...');
  
  try {
    // First check the table structure
    console.log('Checking table structure...');
    const { data: existingData, error: selectError } = await supabase
      .from('elementos_usuarios')
      .select('*')
      .limit(1);
      
    if (selectError) {
      console.error('Error querying table:', selectError);
    } else {
      console.log('Table query successful:', existingData);
      
      // Now try to insert a test record
      console.log('\nInserting test record...');
      const { data: insertData, error: insertError } = await supabase
        .from('elementos_usuarios')
        .insert([{
          nombre: 'Test User',
          correo_electronico: 'test@example.com',
          elemento: 'fuego',
          respuestas: { test: true }
        }])
        .select();
        
      if (insertError) {
        console.error('Error inserting data:', insertError);
      } else {
        console.log('Data inserted successfully:', insertData);
      }
    }
  } catch (e) {
    console.error('Exception during test:', e);
  }
}

// Run the test
testElementosUsuariosTable(); 