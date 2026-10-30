import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('studentId') || 'std_1';
    const domain = searchParams.get('domain') || undefined;
    const role = searchParams.get('role') || undefined;
    const search = searchParams.get('search') || undefined;
    const college = searchParams.get('college') || undefined;

    const peers = db.getPeerStudents(studentId, {
      domain,
      role,
      search,
      college
    });

    return NextResponse.json({
      success: true,
      peers,
      totalCount: peers.length
    });
  } catch (err: any) {
    console.error('Error fetching peer students:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
