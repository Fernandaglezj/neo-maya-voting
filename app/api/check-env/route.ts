import { NextResponse } from 'next/server';

export async function GET() {
  // Comprobar las variables de entorno
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKeyFirstChars = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY 
    ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 10) + '...' 
    : null;

  return NextResponse.json({
    supabaseUrl,
    supabaseKeyPresent: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    supabaseKeyFirstChars,
    nodeEnv: process.env.NODE_ENV,
  });
} 