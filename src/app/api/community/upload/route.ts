import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// POST /api/community/upload - Upload media to Cloudinary
export async function POST(request: NextRequest) {
  try {
    // Get the form data from the request
    const formData = await request.formData();
    
    // Forward to backend upload endpoint
    const response = await fetch(`${API_BASE_URL}/api/community/upload`, {
      method: 'POST',
      headers: {
        'Authorization': request.headers.get('authorization') || '',
      },
      body: formData,
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}
