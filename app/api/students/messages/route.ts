import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { PeerMessage } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('studentId');
    const peerId = searchParams.get('peerId');

    if (!studentId) {
      return NextResponse.json({ error: 'studentId query parameter is required' }, { status: 400 });
    }

    // If peerId is provided, return full conversation thread and mark as read
    if (peerId) {
      const messages = db.getPeerMessages(studentId, peerId);
      // Mark unread messages sent by peer to current student as read
      db.markPeerMessagesAsRead(peerId, studentId);

      return NextResponse.json({
        success: true,
        messages,
        total: messages.length
      });
    }

    // Otherwise, return all student conversation threads with latest message & unread badge
    const conversations = db.getStudentConversations(studentId);
    return NextResponse.json({
      success: true,
      conversations,
      total: conversations.length
    });
  } catch (error: any) {
    console.error('Error in GET /api/students/messages:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { senderStudentId, receiverStudentId, content, projectAttachment } = body;

    if (!senderStudentId || !receiverStudentId) {
      return NextResponse.json(
        { error: 'senderStudentId and receiverStudentId are required' },
        { status: 400 }
      );
    }

    if (!content || !content.trim()) {
      return NextResponse.json(
        { error: 'Message content cannot be empty' },
        { status: 400 }
      );
    }

    const sender = db.getStudentById(senderStudentId);
    const receiver = db.getStudentById(receiverStudentId);

    if (!sender || !receiver) {
      return NextResponse.json(
        { error: 'Sender or receiver student not found' },
        { status: 404 }
      );
    }

    const newMsg: PeerMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      senderStudentId,
      receiverStudentId,
      content: content.trim(),
      createdAt: new Date().toISOString(),
      read: false,
      projectAttachment: projectAttachment || undefined
    };

    const saved = db.createPeerMessage(newMsg);

    // Create a real-time notification for the receiver
    try {
      db.createNotification({
        id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        userId: receiver.userId,
        role: 'student',
        title: `💬 New Message from ${sender.fullName}`,
        message: content.length > 80 ? content.slice(0, 80) + '...' : content,
        type: 'info',
        link: `/student/messages?peerId=${senderStudentId}`,
        read: false,
        createdAt: new Date().toISOString()
      });
    } catch (notifErr) {
      console.warn('Failed to dispatch notification for peer message:', notifErr);
    }

    return NextResponse.json({
      success: true,
      message: saved
    });
  } catch (error: any) {
    console.error('Error in POST /api/students/messages:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
