'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Send,
  MessageSquare,
  Users,
  Search,
  Sparkles,
  FolderGit2,
  ExternalLink,
  CheckCheck,
  Building2,
  GraduationCap,
  Code2,
  Paperclip,
  Check
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { PeerMessage } from '@/lib/types';

interface PeerChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPeerId?: string | null;
}

interface ConversationItem {
  connectionId: string;
  peerId: string;
  peer: {
    id: string;
    fullName: string;
    avatar?: string;
    department: string;
    collegeName: string;
    graduationYear: number;
    interestedDomains: string[];
    programmingLanguages: string[];
    githubConnected?: boolean;
    githubUsername?: string;
  } | null;
  lastMessage: PeerMessage | null;
  unreadCount: number;
  updatedAt: string;
}

export default function PeerChatModal({ isOpen, onClose, initialPeerId }: PeerChatModalProps) {
  const { profile } = useAuth();
  const currentStudentId = profile?.id || 'std_1';

  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [activePeerId, setActivePeerId] = useState<string | null>(initialPeerId || null);
  const [messages, setMessages] = useState<PeerMessage[]>([]);
  const [newMessageText, setNewMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingConversations, setLoadingConversations] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [showProjectSelector, setShowProjectSelector] = useState(false);
  const [studentProjects, setStudentProjects] = useState<any[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      loadConversations();
      loadStudentProjects();
      if (initialPeerId) {
        setActivePeerId(initialPeerId);
      }
    }
  }, [isOpen, initialPeerId]);

  useEffect(() => {
    if (activePeerId) {
      loadMessages(activePeerId);
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [activePeerId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadConversations = async () => {
    setLoadingConversations(true);
    try {
      const res = await fetch(`/api/students/messages?studentId=${currentStudentId}`);
      if (res.ok) {
        const data = await res.json();
        setConversations(data.conversations || []);
        if (!activePeerId && data.conversations && data.conversations.length > 0) {
          setActivePeerId(data.conversations[0].peerId);
        }
      }
    } catch (err) {
      console.error('Failed to load conversations:', err);
    } finally {
      setLoadingConversations(false);
    }
  };

  const loadStudentProjects = async () => {
    try {
      const res = await fetch(`/api/students/${currentStudentId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.student && data.student.projects) {
          setStudentProjects(data.student.projects);
        }
      }
    } catch (err) {
      console.error('Failed to load student projects:', err);
    }
  };

  const loadMessages = async (peerId: string) => {
    setLoadingMessages(true);
    try {
      const res = await fetch(`/api/students/messages?studentId=${currentStudentId}&peerId=${peerId}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
        // Update local conversation item unread count to 0
        setConversations(prev =>
          prev.map(c => (c.peerId === peerId ? { ...c, unreadCount: 0 } : c))
        );
      }
    } catch (err) {
      console.error('Failed to load thread:', err);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleSendMessage = async (textToSend?: string, projectAttachment?: any) => {
    const text = (textToSend || newMessageText).trim();
    if (!text && !projectAttachment) return;
    if (!activePeerId) return;

    const tempMsg: PeerMessage = {
      id: `temp_${Date.now()}`,
      senderStudentId: currentStudentId,
      receiverStudentId: activePeerId,
      content: text,
      createdAt: new Date().toISOString(),
      read: false,
      projectAttachment
    };

    setMessages(prev => [...prev, tempMsg]);
    setNewMessageText('');
    setShowProjectSelector(false);
    setIsSending(true);

    try {
      const res = await fetch('/api/students/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderStudentId: currentStudentId,
          receiverStudentId: activePeerId,
          content: text,
          projectAttachment
        })
      });

      if (res.ok) {
        const data = await res.json();
        // Replace temporary message with confirmed message
        setMessages(prev =>
          prev.map(m => (m.id === tempMsg.id ? data.message : m))
        );
        // Update conversations preview
        setConversations(prev =>
          prev.map(c =>
            c.peerId === activePeerId
              ? { ...c, lastMessage: data.message, updatedAt: data.message.createdAt }
              : c
          )
        );
      }
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setIsSending(false);
    }
  };

  if (!isOpen) return null;

  const activeConv = conversations.find(c => c.peerId === activePeerId);
  const activePeer = activeConv?.peer;

  const filteredConversations = conversations.filter(c => {
    if (!searchQuery) return true;
    const name = c.peer?.fullName?.toLowerCase() || '';
    const dept = c.peer?.department?.toLowerCase() || '';
    return name.includes(searchQuery.toLowerCase()) || dept.includes(searchQuery.toLowerCase());
  });

  const quickStarters = [
    '🚀 Want to collaborate on an open-source AI project?',
    '💡 Let us practice DSA mock interviews together!',
    '📊 Saw your verified assessment score — impressive!',
    '🤝 How is your campus placement preparation going?'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div
        className="relative w-full max-w-5xl h-[88vh] max-h-[750px] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-white">Campus Peer Messenger</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Direct Chat
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Connect and collaborate with verified student builders on campus
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main 2-Pane Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Column: Conversations List */}
          <div className="w-full sm:w-80 md:w-96 border-r border-slate-800 bg-slate-950/50 flex flex-col shrink-0">
            {/* Search Peers */}
            <div className="p-3 border-b border-slate-800">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search connections..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 focus:border-cyan-500 rounded-xl text-xs text-white placeholder-slate-500 outline-none transition-colors"
                />
              </div>
            </div>

            {/* Conversations Scroll */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-800/40">
              {loadingConversations ? (
                <div className="p-8 text-center text-xs text-slate-500">
                  <div className="w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  Loading conversations...
                </div>
              ) : filteredConversations.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400 space-y-2">
                  <Users className="w-8 h-8 text-slate-600 mx-auto" />
                  <p className="font-bold text-white">No active connections yet</p>
                  <p className="text-[11px] text-slate-500">
                    Accept or send connection requests in the Peer Network directory to start chatting.
                  </p>
                </div>
              ) : (
                filteredConversations.map(conv => {
                  const isActive = conv.peerId === activePeerId;
                  const peer = conv.peer;
                  if (!peer) return null;

                  return (
                    <button
                      key={conv.connectionId}
                      onClick={() => setActivePeerId(conv.peerId)}
                      className={`w-full p-3.5 text-left flex items-start gap-3 transition-colors ${
                        isActive
                          ? 'bg-cyan-500/10 border-r-2 border-cyan-400'
                          : 'hover:bg-slate-900/60'
                      }`}
                    >
                      {peer.avatar ? (
                        <img
                          src={peer.avatar}
                          alt={peer.fullName}
                          className="w-11 h-11 rounded-2xl object-cover border border-slate-700 shrink-0"
                        />
                      ) : (
                        <div className="w-11 h-11 rounded-2xl bg-indigo-950 text-cyan-300 font-bold flex items-center justify-center text-sm border border-indigo-500/30 shrink-0">
                          {peer.fullName.charAt(0)}
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-0.5">
                          <h4 className="text-xs font-bold text-white truncate">{peer.fullName}</h4>
                          {conv.lastMessage && (
                            <span className="text-[10px] text-slate-500 shrink-0">
                              {new Date(conv.lastMessage.createdAt).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          )}
                        </div>

                        <p className="text-[11px] text-slate-400 truncate mb-1">
                          {peer.department} • {peer.collegeName}
                        </p>

                        <div className="flex items-center justify-between gap-2">
                          <p className="text-[11px] text-slate-300 truncate">
                            {conv.lastMessage?.content || 'Started connection'}
                          </p>
                          {conv.unreadCount > 0 && (
                            <span className="px-1.5 py-0.5 rounded-full bg-cyan-500 text-slate-950 text-[10px] font-black shrink-0">
                              {conv.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: Active Chat Thread */}
          <div className="flex-1 flex flex-col bg-slate-900 overflow-hidden">
            {activePeer ? (
              <>
                {/* Active Peer Profile Banner */}
                <div className="px-6 py-3.5 border-b border-slate-800 bg-slate-950/40 flex items-center justify-between gap-4 shrink-0">
                  <div className="flex items-center gap-3 min-w-0">
                    {activePeer.avatar ? (
                      <img
                        src={activePeer.avatar}
                        alt={activePeer.fullName}
                        className="w-10 h-10 rounded-2xl object-cover border border-slate-700"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-2xl bg-indigo-950 text-cyan-300 font-bold flex items-center justify-center text-sm border border-indigo-500/30">
                        {activePeer.fullName.charAt(0)}
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-black text-white truncate">{activePeer.fullName}</h3>
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      </div>
                      <p className="text-[11px] text-slate-400 truncate">
                        {activePeer.department} ({activePeer.graduationYear}) • {activePeer.collegeName}
                      </p>
                    </div>
                  </div>

                  {/* Peer Tech Badges */}
                  <div className="hidden md:flex items-center gap-1.5 shrink-0">
                    {activePeer.interestedDomains?.slice(0, 2).map(d => (
                      <span
                        key={d}
                        className="px-2 py-0.5 rounded-md bg-purple-950/40 text-purple-300 border border-purple-500/30 text-[10px] font-bold"
                      >
                        {d}
                      </span>
                    ))}
                    {activePeer.githubConnected && (
                      <span className="px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-slate-300 text-[10px] font-mono flex items-center gap-1">
                        <FolderGit2 className="w-3 h-3 text-purple-400" />
                        @{activePeer.githubUsername || 'dev'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Message Bubbles Container */}
                <div className="flex-1 p-6 overflow-y-auto space-y-4">
                  {loadingMessages ? (
                    <div className="py-16 text-center text-xs text-slate-500">
                      <div className="w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                      Loading message history...
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="py-12 text-center max-w-sm mx-auto space-y-3">
                      <div className="w-12 h-12 rounded-3xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto">
                        <Sparkles className="w-6 h-6" />
                      </div>
                      <h4 className="text-sm font-bold text-white">Start the conversation!</h4>
                      <p className="text-xs text-slate-400">
                        Say hi to {activePeer.fullName.split(' ')[0]} and discuss study groups, code projects, or campus placement drives.
                      </p>
                    </div>
                  ) : (
                    messages.map((msg, idx) => {
                      const isMe = msg.senderStudentId === currentStudentId;
                      return (
                        <div
                          key={msg.id || idx}
                          className={`flex items-end gap-2.5 ${isMe ? 'justify-end' : 'justify-start'}`}
                        >
                          {!isMe && (
                            activePeer.avatar ? (
                              <img
                                src={activePeer.avatar}
                                alt={activePeer.fullName}
                                className="w-7 h-7 rounded-xl object-cover mb-1 shrink-0"
                              />
                            ) : (
                              <div className="w-7 h-7 rounded-xl bg-indigo-950 text-cyan-300 font-bold flex items-center justify-center text-[10px] mb-1 shrink-0">
                                {activePeer.fullName.charAt(0)}
                              </div>
                            )
                          )}

                          <div
                            className={`max-w-[75%] sm:max-w-md rounded-2xl p-3.5 space-y-2 ${
                              isMe
                                ? 'bg-gradient-to-br from-cyan-500 to-blue-600 text-slate-950 rounded-br-xs shadow-md shadow-cyan-500/10 font-medium'
                                : 'bg-slate-800/90 text-slate-100 rounded-bl-xs border border-slate-700/60'
                            }`}
                          >
                            <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                              {msg.content}
                            </p>

                            {/* Project Attachment Card if included */}
                            {msg.projectAttachment && (
                              <div
                                className={`p-3 rounded-xl text-xs space-y-1.5 border ${
                                  isMe
                                    ? 'bg-cyan-600/30 border-cyan-700/50 text-slate-950'
                                    : 'bg-slate-900 border-slate-700 text-slate-200'
                                }`}
                              >
                                <div className="flex items-center justify-between gap-2">
                                  <span className="font-bold flex items-center gap-1">
                                    <FolderGit2 className="w-3.5 h-3.5" />
                                    Shared Project:
                                  </span>
                                  {msg.projectAttachment.githubUrl && (
                                    <a
                                      href={msg.projectAttachment.githubUrl}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="underline flex items-center gap-1 font-mono text-[10px]"
                                    >
                                      View Code <ExternalLink className="w-3 h-3" />
                                    </a>
                                  )}
                                </div>
                                <div className="font-bold text-xs">{msg.projectAttachment.title}</div>
                                {msg.projectAttachment.technologies && (
                                  <div className="flex flex-wrap gap-1 pt-1">
                                    {msg.projectAttachment.technologies.map(t => (
                                      <span
                                        key={t}
                                        className="px-1.5 py-0.5 rounded bg-black/20 text-[9px] font-mono"
                                      >
                                        {t}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Timestamp and Read Status */}
                            <div
                              className={`flex items-center gap-1 text-[10px] ${
                                isMe ? 'text-slate-800 justify-end' : 'text-slate-400'
                              }`}
                            >
                              <span>
                                {new Date(msg.createdAt).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                              {isMe && <CheckCheck className="w-3 h-3 ml-0.5 text-slate-900" />}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Starter Chips */}
                {messages.length < 6 && (
                  <div className="px-6 py-2 bg-slate-950/40 border-t border-slate-800/60 overflow-x-auto flex items-center gap-2 shrink-0">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-cyan-400" /> Starters:
                    </span>
                    {quickStarters.map((starter, i) => (
                      <button
                        key={i}
                        onClick={() => handleSendMessage(starter)}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium whitespace-nowrap transition-colors border border-slate-700/60"
                      >
                        {starter}
                      </button>
                    ))}
                  </div>
                )}

                {/* Input Area */}
                <div className="p-4 bg-slate-950 border-t border-slate-800 space-y-2 shrink-0">
                  {/* Project Selector Tray */}
                  {showProjectSelector && (
                    <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 animate-fade-in">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white flex items-center gap-1.5">
                          <FolderGit2 className="w-3.5 h-3.5 text-cyan-400" /> Share One of Your Projects
                        </span>
                        <button
                          onClick={() => setShowProjectSelector(false)}
                          className="text-slate-400 hover:text-white text-xs"
                        >
                          ✕
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {studentProjects.length === 0 ? (
                          <div className="text-xs text-slate-400 py-2">No projects submitted yet in your portfolio.</div>
                        ) : (
                          studentProjects.map((p, i) => (
                            <button
                              key={p.id || i}
                              onClick={() => {
                                handleSendMessage(
                                  `I would love your feedback on my project: "${p.title}". Let us discuss!`,
                                  {
                                    title: p.title,
                                    githubUrl: p.githubUrl,
                                    technologies: p.technologies || []
                                  }
                                );
                              }}
                              className="p-2.5 text-left rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 transition-colors"
                            >
                              <div className="font-bold text-xs text-white truncate">{p.title}</div>
                              <div className="text-[10px] text-slate-400 font-mono truncate">
                                {(p.technologies || []).slice(0, 3).join(', ')}
                              </div>
                            </button>
                          ))
                        )}
                      </div>
                    </div>
                  )}

                  {/* Text Input Row */}
                  <form
                    onSubmit={e => {
                      e.preventDefault();
                      handleSendMessage();
                    }}
                    className="flex items-center gap-2"
                  >
                    <button
                      type="button"
                      onClick={() => setShowProjectSelector(!showProjectSelector)}
                      title="Share Project"
                      className="p-2.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-cyan-400 transition-colors"
                    >
                      <Paperclip className="w-4 h-4" />
                    </button>

                    <input
                      ref={inputRef}
                      type="text"
                      value={newMessageText}
                      onChange={e => setNewMessageText(e.target.value)}
                      placeholder={`Message ${activePeer.fullName.split(' ')[0]}...`}
                      className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 focus:border-cyan-500 text-xs sm:text-sm text-white placeholder-slate-500 outline-none transition-colors"
                    />

                    <button
                      type="submit"
                      disabled={!newMessageText.trim() || isSending}
                      className="px-4 py-2.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-cyan-500/20"
                    >
                      <span>Send</span>
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-3">
                <MessageSquare className="w-12 h-12 text-slate-600" />
                <h3 className="text-base font-bold text-white">Select a connection</h3>
                <p className="text-xs text-slate-400 max-w-sm">
                  Choose a student peer from the left list to start a peer collaboration chat.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
