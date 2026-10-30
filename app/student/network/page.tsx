'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import PeerChatModal from '@/components/PeerChatModal';
import {
  Users,
  UserPlus,
  CheckCircle2,
  XCircle,
  Sparkles,
  Search,
  Building2,
  GraduationCap,
  Code2,
  Brain,
  Lock,
  Globe,
  Cpu,
  ShieldCheck,
  Send,
  MessageSquare,
  ArrowRight,
  Filter,
  Check,
  FolderGit2,
  ExternalLink,
  Flame,
  Award
} from 'lucide-react';

interface PeerStudent {
  id: string;
  fullName: string;
  collegeName: string;
  department: string;
  degree: string;
  graduationYear: number;
  cgpa: number;
  bio?: string;
  avatar?: string;
  interestedRoles?: string[];
  programmingLanguages?: string[];
  interestedDomains?: string[];
  githubConnected?: boolean;
  githubUsername?: string;
  githubRepoCount?: number;
  connectionStatus: 'connected' | 'pending_sent' | 'pending_received' | 'none';
  connectionId?: string;
  mutualDomains?: string[];
  mutualLanguages?: string[];
  isSameCollege?: boolean;
  matchScore?: number;
}

export default function StudentNetworkPage() {
  const { profile } = useAuth();
  const studentId = profile?.id || 'std_1';

  const [peers, setPeers] = useState<PeerStudent[]>([]);
  const [connections, setConnections] = useState<any[]>([]);
  const [pendingReceived, setPendingReceived] = useState<any[]>([]);
  const [pendingSent, setPendingSent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [activeDomainFilter, setActiveDomainFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [collegeOnly, setCollegeOnly] = useState(false);

  // Connect Note Modal
  const [selectedPeerForConnect, setSelectedPeerForConnect] = useState<PeerStudent | null>(null);
  const [connectMessage, setConnectMessage] = useState('');
  const [isSendingRequest, setIsSendingRequest] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Chat Messenger Modal State
  const [chatModalOpen, setChatModalOpen] = useState(false);
  const [chatPeerId, setChatPeerId] = useState<string | null>(null);

  const loadNetworkData = async () => {
    setLoading(true);
    try {
      const [peersRes, connRes] = await Promise.all([
        fetch(`/api/students/peers?studentId=${studentId}`),
        fetch(`/api/students/connections?studentId=${studentId}`)
      ]);

      const peersData = await peersRes.json();
      const connData = await connRes.json();

      if (peersData.peers) setPeers(peersData.peers);
      if (connData.connections) setConnections(connData.connections);
      if (connData.pendingReceived) setPendingReceived(connData.pendingReceived);
      if (connData.pendingSent) setPendingSent(connData.pendingSent);
    } catch (err) {
      console.error('Error loading network data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNetworkData();
  }, [studentId]);

  // Handle Send Connection Request
  const handleSendConnect = async (peer: PeerStudent, customMsg?: string) => {
    setIsSendingRequest(true);
    try {
      const res = await fetch('/api/students/connections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requesterStudentId: studentId,
          receiverStudentId: peer.id,
          message: customMsg || `Hi ${peer.fullName.split(' ')[0]}! I noticed our shared interests in ${(peer.interestedDomains || ['technology']).slice(0, 2).join(' & ')}. Let's connect on Skill2Hire!`
        })
      });

      const data = await res.json();
      if (data.success) {
        setToastMessage(`Connection request sent to ${peer.fullName}!`);
        setSelectedPeerForConnect(null);
        setConnectMessage('');
        // Optimistically update peer status in UI
        setPeers(prev => prev.map(p => p.id === peer.id ? { ...p, connectionStatus: 'pending_sent' } : p));
        // Reload fresh network list
        loadNetworkData();
        setTimeout(() => setToastMessage(null), 4000);
      }
    } catch (err) {
      console.error('Error sending connection request:', err);
    } finally {
      setIsSendingRequest(false);
    }
  };

  // Handle Accept or Decline Connection
  const handleConnectionAction = async (connectionId: string, status: 'accepted' | 'rejected', peerName: string) => {
    try {
      const res = await fetch('/api/students/connections', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ connectionId, status })
      });

      const data = await res.json();
      if (data.success) {
        setToastMessage(status === 'accepted' ? `You are now connected with ${peerName}!` : `Connection invitation declined.`);
        loadNetworkData();
        setTimeout(() => setToastMessage(null), 4000);
      }
    } catch (err) {
      console.error('Error updating connection:', err);
    }
  };

  const domainOptions = [
    { label: 'All Students', value: 'All' },
    { label: '🔥 Data Science & AI', value: 'Data Science' },
    { label: '🛡️ Cybersecurity & InfoSec', value: 'Cybersecurity' },
    { label: '☁️ Cloud & DevOps', value: 'Cloud' },
    { label: '💻 Web & Mobile Development', value: 'Web' },
    { label: '⚙️ Systems & Embedded', value: 'Systems' }
  ];

  // Filter peers
  const filteredPeers = peers.filter(p => {
    // Domain filter
    const matchesDomain = activeDomainFilter === 'All' ||
      (p.interestedDomains && p.interestedDomains.some(d => d.toLowerCase().includes(activeDomainFilter.toLowerCase())));

    // College filter
    const matchesCollege = !collegeOnly || p.isSameCollege;

    // Search query (name, college, department, languages)
    const q = searchQuery.toLowerCase();
    const matchesSearch = searchQuery === '' ||
      p.fullName.toLowerCase().includes(q) ||
      p.collegeName.toLowerCase().includes(q) ||
      p.department.toLowerCase().includes(q) ||
      (p.programmingLanguages && p.programmingLanguages.some(l => l.toLowerCase().includes(q))) ||
      (p.interestedRoles && p.interestedRoles.some(r => r.toLowerCase().includes(q)));

    return matchesDomain && matchesCollege && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            href="/student/dashboard"
            className="text-xs font-bold text-slate-400 hover:text-cyan-400 transition-colors flex items-center gap-1.5"
          >
            ← Back to Student Dashboard
          </Link>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs font-mono text-cyan-400 font-bold">Peer Network Synchronized</span>
          </div>
        </div>

        {/* Global Toast Alert */}
        {toastMessage && (
          <div className="p-4 rounded-2xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 flex items-center justify-between shadow-xl animate-fade-in">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0" />
              <span className="text-xs sm:text-sm font-bold">{toastMessage}</span>
            </div>
            <button onClick={() => setToastMessage(null)} className="text-cyan-400 hover:text-white">
              ✕
            </button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 🌟 HERO NETWORK HEADER & METRICS                                          */}
        {/* ========================================================================= */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/80 border border-slate-800 p-6 sm:p-10 shadow-2xl space-y-6">
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 -mb-12 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Campus Peer Community
                </span>
                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-purple-400" /> LinkedIn-Style Networking
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                Connect with Fellow Campus Builders &amp; Peers
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Form study circles, discover project partners in <strong>Data Science, Cybersecurity, and AI</strong>, review peer code repositories, and grow your campus professional network.
              </p>
            </div>

            {/* Quick Stats Grid */}
            <div className="flex items-center gap-3 shrink-0 flex-wrap">
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-center min-w-[110px]">
                <div className="text-2xl font-black text-cyan-300">{connections.length}</div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">Connections</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-center min-w-[110px]">
                <div className="text-2xl font-black text-purple-400">{pendingReceived.length}</div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">Pending Invitations</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-center min-w-[110px]">
                <div className="text-2xl font-black text-emerald-400">{peers.length}</div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">Campus Talent</div>
              </div>
              <button
                onClick={() => {
                  setChatPeerId(null);
                  setChatModalOpen(true);
                }}
                className="p-4 rounded-2xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-center min-w-[110px] transition-all group cursor-pointer"
              >
                <MessageSquare className="w-5 h-5 text-cyan-400 mx-auto group-hover:scale-110 transition-transform" />
                <div className="text-[10px] font-bold uppercase tracking-wider text-cyan-300 mt-1.5">Direct Chat</div>
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 📬 PENDING INVITATIONS SECTION                                            */}
        {/* ========================================================================= */}
        {pendingReceived.length > 0 && (
          <div className="p-6 rounded-3xl bg-purple-950/30 border border-purple-500/30 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-purple-500/20 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-white">Pending Connection Requests ({pendingReceived.length})</h3>
                  <p className="text-[11px] text-purple-200">Students who requested to connect with you.</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {pendingReceived.map(inv => {
                const peer = inv.peer;
                return (
                  <div
                    key={inv.id}
                    className="p-4 rounded-2xl bg-slate-900 border border-purple-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      {peer.avatar ? (
                        <img src={peer.avatar} alt={peer.fullName} className="w-12 h-12 rounded-2xl object-cover border border-purple-500/30" />
                      ) : (
                        <div className="w-12 h-12 rounded-2xl bg-purple-950 text-purple-300 font-bold flex items-center justify-center">
                          {peer.fullName.charAt(0)}
                        </div>
                      )}
                      <div>
                        <h4 className="font-bold text-xs sm:text-sm text-white">{peer.fullName}</h4>
                        <p className="text-[11px] text-slate-400">
                          {peer.department} • {peer.collegeName}
                        </p>
                        {inv.message && (
                          <p className="text-[11px] text-purple-300 mt-1 italic leading-snug">
                            &quot;{inv.message}&quot;
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleConnectionAction(inv.id, 'accepted', peer.fullName)}
                        className="px-3.5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1 shadow-sm"
                      >
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span>Accept</span>
                      </button>
                      <button
                        onClick={() => handleConnectionAction(inv.id, 'rejected', peer.fullName)}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white font-semibold text-xs"
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 🔍 FILTER & SEARCH CONTROLS                                               */}
        {/* ========================================================================= */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Domain Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
              {domainOptions.map(opt => {
                const isActive = activeDomainFilter === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => setActiveDomainFilter(opt.value)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all shrink-0 flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-md shadow-cyan-500/20'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                    }`}
                  >
                    <span>{opt.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Same University Toggle */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setCollegeOnly(!collegeOnly)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 border ${
                  collegeOnly
                    ? 'bg-indigo-600 text-white border-indigo-500'
                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>My University Only</span>
              </button>
            </div>
          </div>

          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search peers by name, college, programming language (Python, C++, SQL), or role..."
              className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 focus:border-cyan-500 outline-none text-xs text-white placeholder-slate-500 transition-colors"
            />
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 👥 PEERS DIRECTORY GRID                                                   */}
        {/* ========================================================================= */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-cyan-400" />
              <span>Campus Peer Directory</span>
              <span className="text-xs font-normal text-slate-400 font-mono">({filteredPeers.length} Peers Discovered)</span>
            </h2>
          </div>

          {loading ? (
            <div className="p-16 text-center space-y-3">
              <div className="w-10 h-10 border-3 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-slate-400 font-bold">Discovering student peers &amp; matching skill affinities...</p>
            </div>
          ) : filteredPeers.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
              <Users className="w-8 h-8 text-slate-500 mx-auto" />
              <h3 className="text-base font-bold text-white">No student peers found</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Try selecting &quot;All Students&quot; or clearing your search term to see other student profiles.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredPeers.map((peer) => {
                const isConnected = peer.connectionStatus === 'connected';
                const isPendingSent = peer.connectionStatus === 'pending_sent';
                const isPendingReceived = peer.connectionStatus === 'pending_received';

                return (
                  <div
                    key={peer.id}
                    className="p-5 sm:p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 hover:shadow-xl transition-all flex flex-col justify-between space-y-5"
                  >
                    <div className="space-y-3.5">
                      {/* Peer Top Profile */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          {peer.avatar ? (
                            <img
                              src={peer.avatar}
                              alt={peer.fullName}
                              className="w-13 h-13 rounded-2xl object-cover border border-slate-700 shadow-md"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-2xl bg-indigo-950 text-cyan-300 font-bold flex items-center justify-center text-base border border-indigo-500/30">
                              {peer.fullName.charAt(0)}
                            </div>
                          )}
                          <div className="space-y-0.5">
                            <h3 className="font-black text-sm text-white hover:text-cyan-300 transition-colors flex items-center gap-1.5">
                              <span>{peer.fullName}</span>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            </h3>
                            <p className="text-[11px] text-slate-300 font-medium leading-tight">
                              {peer.department} ({peer.graduationYear})
                            </p>
                            <p className="text-[10px] text-slate-400 leading-tight">
                              {peer.collegeName}
                            </p>
                          </div>
                        </div>

                        {peer.matchScore && peer.matchScore > 20 && (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30 shrink-0">
                            High Fit
                          </span>
                        )}
                      </div>

                      {/* Bio */}
                      {peer.bio && (
                        <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                          {peer.bio}
                        </p>
                      )}

                      {/* Domain Badges */}
                      {peer.interestedDomains && peer.interestedDomains.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {peer.interestedDomains.map(d => (
                            <span
                              key={d}
                              className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                                d.includes('Data')
                                  ? 'bg-purple-950/40 text-purple-300 border-purple-500/30'
                                  : d.includes('Cyber')
                                  ? 'bg-rose-950/40 text-rose-300 border-rose-500/30'
                                  : 'bg-cyan-950/40 text-cyan-300 border-cyan-500/30'
                              }`}
                            >
                              {d}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Programming Languages */}
                      {peer.programmingLanguages && peer.programmingLanguages.length > 0 && (
                        <div className="space-y-1">
                          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">
                            Tech Skills:
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {peer.programmingLanguages.map(lang => (
                              <span
                                key={lang}
                                className="px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-slate-300 font-mono text-[10px]"
                              >
                                {lang}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Mutual Affinity Callout */}
                      {peer.mutualDomains && peer.mutualDomains.length > 0 && (
                        <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[10px] text-slate-300 flex items-center gap-1.5">
                          <Sparkles className="w-3 h-3 text-cyan-400 shrink-0" />
                          <span>Mutual Focus: <strong>{peer.mutualDomains.join(', ')}</strong></span>
                        </div>
                      )}
                    </div>

                    {/* Card Footer Connection Actions */}
                    <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                      {peer.githubConnected && (
                        <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                          <FolderGit2 className="w-3 h-3 text-purple-400" />
                          <span>@{peer.githubUsername || 'dev'}</span>
                        </span>
                      )}

                      <div className="ml-auto">
                        {isConnected ? (
                          <div className="flex items-center gap-1.5">
                            <div className="px-2.5 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center gap-1">
                              <Check className="w-3 h-3" />
                              <span>Connected</span>
                            </div>
                            <button
                              onClick={() => {
                                setChatPeerId(peer.id);
                                setChatModalOpen(true);
                              }}
                              className="px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1 shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                              <span>Message</span>
                            </button>
                          </div>
                        ) : isPendingSent ? (
                          <div className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-400 font-semibold text-xs flex items-center gap-1">
                            <span>Pending Sent</span>
                          </div>
                        ) : isPendingReceived ? (
                          <button
                            onClick={() => handleConnectionAction(peer.connectionId!, 'accepted', peer.fullName)}
                            className="px-3.5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1"
                          >
                            <Check className="w-3 h-3" />
                            <span>Accept</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setSelectedPeerForConnect(peer);
                              setConnectMessage(`Hi ${peer.fullName.split(' ')[0]}! I noticed our shared interests in ${(peer.interestedDomains || ['software']).slice(0, 2).join(' & ')}. Let's connect on Skill2Hire!`);
                            }}
                            className="px-4 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-500/20 transition-all hover:scale-105 active:scale-95"
                          >
                            <UserPlus className="w-3.5 h-3.5" />
                            <span>Connect</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* 📝 MODAL: SEND CUSTOM CONNECTION MESSAGE                                  */}
        {/* ========================================================================= */}
        {selectedPeerForConnect && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 flex items-center justify-center font-bold">
                    <UserPlus className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white">Connect with {selectedPeerForConnect.fullName}</h3>
                    <p className="text-xs text-slate-400">{selectedPeerForConnect.collegeName}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedPeerForConnect(null)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300">Personalize Connection Note (Optional):</label>
                <textarea
                  rows={4}
                  value={connectMessage}
                  onChange={(e) => setConnectMessage(e.target.value)}
                  placeholder="Share what project, domain, or study circle you want to collaborate on..."
                  className="w-full p-3 rounded-2xl bg-slate-950 border border-slate-800 focus:border-cyan-500 text-white outline-none text-xs leading-relaxed resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedPeerForConnect(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isSendingRequest}
                  onClick={() => handleSendConnect(selectedPeerForConnect, connectMessage)}
                  className="px-5 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-400/20 transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSendingRequest ? 'Sending...' : 'Send Invitation'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Peer Chat Messenger Modal */}
        <PeerChatModal
          isOpen={chatModalOpen}
          onClose={() => setChatModalOpen(false)}
          initialPeerId={chatPeerId}
        />

      </div>
    </div>
  );
}
