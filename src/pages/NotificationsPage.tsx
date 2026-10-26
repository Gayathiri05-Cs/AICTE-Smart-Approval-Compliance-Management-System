import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  Bell,
  Mail,
  MessageSquare,
  Smartphone,
  CheckCircle,
  AlertCircle,
  RotateCcw,
  Send,
  Filter,
  CheckCheck,
  Clock,
  Radio,
  ExternalLink
} from 'lucide-react';
import { DeliveryStatus, NotificationChannel, NotificationItem } from '../types';

export const NotificationsPage: React.FC = () => {
  const {
    notifications,
    currentUser,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    retryNotification,
    sendTestReminder,
    applications
  } = useApp();

  const [channelFilter, setChannelFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Test Reminder Form State
  const [testTitle, setTestTitle] = useState('Urgent: Fire Safety NOC Renewal Required');
  const [testMessage, setTestMessage] = useState(
    'AICTE Alert: Fire Safety NOC is expiring in 15 days. Upload renewed certificate on the portal to maintain compliance.'
  );
  const [testChannel, setTestChannel] = useState<NotificationChannel>('WHATSAPP');
  const [testAppId, setTestAppId] = useState(applications[0]?.id || 'APP-2026-8812');

  const filteredNotifs = useMemo(() => {
    return notifications.filter((notif) => {
      const roleMatches =
        currentUser.role === 'BUREAU_ADMIN' ||
        notif.recipientRole === currentUser.role ||
        notif.recipientRole === 'INSTITUTION';

      const channelMatches = channelFilter === 'ALL' || notif.channel === channelFilter;
      const statusMatches = statusFilter === 'ALL' || notif.deliveryStatus === statusFilter;

      return roleMatches && channelMatches && statusMatches;
    });
  }, [notifications, currentUser, channelFilter, statusFilter]);

  const handleSendTest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testTitle.trim() || !testMessage.trim()) return;

    sendTestReminder(testTitle.trim(), testMessage.trim(), testChannel, 'APPLICATION', testAppId);
    alert(`Test alert sent via ${testChannel} adapter! Added to notification log.`);
  };

  const getChannelIcon = (ch: NotificationChannel) => {
    switch (ch) {
      case 'IN_APP':
        return <Bell className="w-4 h-4 text-indigo-400" />;
      case 'EMAIL':
        return <Mail className="w-4 h-4 text-sky-400" />;
      case 'SMS':
        return <Smartphone className="w-4 h-4 text-emerald-400" />;
      case 'WHATSAPP':
        return <MessageSquare className="w-4 h-4 text-green-400" />;
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            Notification Center & Multi-Channel Adapters
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Automated alerts, deficiency reminders, SMS, WhatsApp Business API, and SMTP dispatch monitoring.
          </p>
        </div>

        <button
          onClick={markAllNotificationsAsRead}
          className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap"
        >
          <CheckCheck className="w-3.5 h-3.5 text-indigo-400" />
          <span>Mark All as Read</span>
        </button>
      </div>

      {/* Integration Adapter Notice */}
      <div className="bg-slate-900 border border-indigo-900/40 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-indigo-600/20 text-indigo-400 mt-0.5">
            <Radio className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="font-semibold text-white flex items-center gap-2">
              <span>Multi-Channel Gateway Simulation Engine</span>
              <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded text-[10px] font-mono">
                SIMULATED ADAPTERS ACTIVE
              </span>
            </div>
            <p className="text-slate-400 mt-0.5 text-[11px] leading-relaxed">
              Email (SMTP Relay), SMS (CDAC Gateway), and WhatsApp Business API adapters log simulated payloads,
              timestamps, and latency in compliance with SIH Hackathon guidelines without exposing private credentials.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Notification Stream */}
        <div className="lg:col-span-2 space-y-4">
          {/* Filters */}
          <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-400 text-[11px] font-mono">Channel:</span>
              <select
                value={channelFilter}
                onChange={(e) => setChannelFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-md px-2 py-1 text-slate-200"
              >
                <option value="ALL">All Channels ({notifications.length})</option>
                <option value="IN_APP">In-App Alerts</option>
                <option value="EMAIL">Email (SMTP)</option>
                <option value="SMS">SMS Gateway</option>
                <option value="WHATSAPP">WhatsApp API</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-400 text-[11px] font-mono">Delivery Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-md px-2 py-1 text-slate-200"
              >
                <option value="ALL">All Statuses</option>
                <option value="SENT">Sent</option>
                <option value="SIMULATED">Simulated</option>
                <option value="PENDING">Pending</option>
                <option value="FAILED">Failed</option>
              </select>
            </div>
          </div>

          {/* List */}
          <div className="space-y-3">
            {filteredNotifs.length === 0 ? (
              <div className="p-8 text-center text-slate-500 bg-slate-900 border border-slate-800 rounded-xl text-xs">
                No notifications match your selected filter criteria.
              </div>
            ) : (
              filteredNotifs.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => markNotificationAsRead(notif.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    notif.isRead
                      ? 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                      : 'bg-indigo-950/20 border-indigo-500/40 shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-slate-800 border border-slate-700 shrink-0 mt-0.5">
                        {getChannelIcon(notif.channel)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-slate-100 text-xs">{notif.title}</h4>
                          {!notif.isRead && (
                            <span className="w-2 h-2 rounded-full bg-indigo-400" />
                          )}
                        </div>
                        <p className="text-xs text-slate-300 mt-1 leading-relaxed">{notif.message}</p>

                        <div className="flex flex-wrap items-center gap-3 text-[10px] text-slate-400 font-mono mt-2 pt-2 border-t border-slate-800/60">
                          <span>Channel: <strong className="text-slate-300">{notif.channel}</strong></span>
                          <span>·</span>
                          <span>Recipient: {notif.recipientName} ({notif.recipientContact})</span>
                          <span>·</span>
                          <span>{new Date(notif.timestamp).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${
                          notif.deliveryStatus === 'SIMULATED'
                            ? 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/30'
                            : notif.deliveryStatus === 'SENT'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        {notif.deliveryStatus}
                      </span>

                      {notif.deliveryDetails && (
                        <span className="text-[10px] font-mono text-slate-500">
                          {notif.deliveryDetails.simulatedLatencyMs}ms
                        </span>
                      )}

                      {notif.deliveryStatus === 'FAILED' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            retryNotification(notif.id);
                          }}
                          className="flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Retry</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Test Reminder Dispatcher Panel */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Send className="w-4 h-4 text-indigo-400" />
              <span>Simulate Live Reminder Dispatch</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Trigger an instant notification via SMS, WhatsApp, or Email to test scheduled alert behavior.
            </p>
          </div>

          <form onSubmit={handleSendTest} className="space-y-3.5 text-xs">
            <div>
              <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                Dispatch Channel
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(['WHATSAPP', 'SMS', 'EMAIL', 'IN_APP'] as NotificationChannel[]).map((ch) => (
                  <button
                    key={ch}
                    type="button"
                    onClick={() => setTestChannel(ch)}
                    className={`p-2 rounded-lg border text-xs font-medium flex items-center justify-center gap-1.5 transition-colors ${
                      testChannel === ch
                        ? 'border-indigo-500 bg-indigo-950/40 text-white'
                        : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {getChannelIcon(ch)}
                    <span>{ch}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                Related Application Dossier
              </label>
              <select
                value={testAppId}
                onChange={(e) => setTestAppId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 font-mono"
              >
                {applications.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.id} - {a.institutionName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                Alert Subject / Header
              </label>
              <input
                type="text"
                value={testTitle}
                onChange={(e) => setTestTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                Notification Message Body
              </label>
              <textarea
                rows={3}
                value={testMessage}
                onChange={(e) => setTestMessage(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20 transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Dispatch Test Alert</span>
            </button>
          </form>

          <div className="pt-3 border-t border-slate-800 text-[10px] text-slate-500 font-mono space-y-1">
            <div>• WhatsApp: Meta Cloud API Webhook v19.0</div>
            <div>• SMS: National Informatics Centre (NIC) Gateway</div>
            <div>• Email: Postfix TLS Relay / SMTP Port 587</div>
          </div>
        </div>
      </div>
    </div>
  );
};
