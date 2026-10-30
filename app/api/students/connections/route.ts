import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { StudentConnection } from '@/lib/types';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('studentId') || 'std_1';

    const allConnections = db.getStudentConnections(studentId);
    const allStudents = db.getStudents();

    // Enrich connections with peer details
    const accepted: any[] = [];
    const pendingReceived: any[] = [];
    const pendingSent: any[] = [];

    allConnections.forEach(conn => {
      const isRequester = conn.requesterStudentId === studentId;
      const peerId = isRequester ? conn.receiverStudentId : conn.requesterStudentId;
      const peer = allStudents.find(s => s.id === peerId);

      const enriched = {
        ...conn,
        peer: peer || {
          id: peerId,
          fullName: 'Student Peer',
          collegeName: 'University Peer',
          department: 'Engineering',
          interestedDomains: ['General Tech'],
          programmingLanguages: ['Python']
        }
      };

      if (conn.status === 'accepted') {
        accepted.push(enriched);
      } else if (conn.status === 'pending') {
        if (isRequester) {
          pendingSent.push(enriched);
        } else {
          pendingReceived.push(enriched);
        }
      }
    });

    return NextResponse.json({
      success: true,
      connections: accepted,
      pendingReceived,
      pendingSent,
      totalConnected: accepted.length,
      totalPending: pendingReceived.length
    });
  } catch (err: any) {
    console.error('Error fetching student connections:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { requesterStudentId, receiverStudentId, message } = body;

    if (!requesterStudentId || !receiverStudentId) {
      return NextResponse.json(
        { error: 'Requester and Receiver student IDs are required.' },
        { status: 400 }
      );
    }

    if (requesterStudentId === receiverStudentId) {
      return NextResponse.json(
        { error: 'You cannot connect with yourself.' },
        { status: 400 }
      );
    }

    const newConnection: StudentConnection = {
      id: `conn_${Date.now()}`,
      requesterStudentId,
      receiverStudentId,
      status: 'pending',
      message: message || 'Hi! Let us connect on Skill2Hire to share project architectures and practice.',
      createdAt: new Date().toISOString()
    };

    const saved = db.createStudentConnection(newConnection);

    return NextResponse.json({
      success: true,
      connection: saved,
      message: 'Connection request sent successfully!'
    });
  } catch (err: any) {
    console.error('Error creating connection:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { connectionId, status } = body;

    if (!connectionId || !status || !['accepted', 'rejected'].includes(status)) {
      return NextResponse.json(
        { error: 'Valid connectionId and status (accepted or rejected) are required.' },
        { status: 400 }
      );
    }

    const updated = db.updateStudentConnection(connectionId, status);
    if (!updated) {
      return NextResponse.json({ error: 'Connection not found.' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      connection: updated,
      message: status === 'accepted' ? 'Connection invitation accepted!' : 'Connection declined.'
    });
  } catch (err: any) {
    console.error('Error updating connection:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const connectionId = searchParams.get('connectionId');

    if (!connectionId) {
      return NextResponse.json({ error: 'Connection ID is required.' }, { status: 400 });
    }

    const deleted = db.deleteStudentConnection(connectionId);
    return NextResponse.json({
      success: deleted,
      message: deleted ? 'Connection removed.' : 'Connection not found.'
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
