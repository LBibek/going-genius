import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

/**
 * API route for the SDK to clear the GG session.
 * POST /api/gg/logout
 */
export async function POST() {
  const cookieStore = await cookies();
  
  // Delete the session cookie
  cookieStore.delete('session');
  
  return NextResponse.json({ success: true });
}
