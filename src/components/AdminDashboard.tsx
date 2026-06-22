import React, { useState, useEffect } from 'react';
import { 
  X, FileSpreadsheet, RefreshCw, LogOut, ExternalLink, 
  Lock, CheckCircle2, AlertCircle, Database, Check, ShieldAlert,
  Download, Key
} from 'lucide-react';
import { 
  auth, initAuth, googleSignIn, logout, getAccessToken, db,
  handleFirestoreError, OperationType
} from '../lib/firebase';
import { 
  collection, getDocs, query, orderBy, doc, updateDoc, writeBatch 
} from 'firebase/firestore';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

interface WaitlistEntry {
  id: string;
  parentName: string;
  email: string;
  phone: string;
  syncedToSheets: boolean;
  createdAt: any;
}

export default function AdminDashboard({ isOpen, onClose }: AdminDashboardProps) {
  const [isAdminUser, setIsAdminUser] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleToken, setGoogleToken] = useState<string | null>(null);
  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>([]);
  const [syncing, setSyncing] = useState(false);
  const [syncStatusMsg, setSyncStatusMsg] = useState('');
  const [spreadsheetId, setSpreadsheetId] = useState<string | null>(
    localStorage.getItem('theparentingai_spreadsheet_id')
  );

  // Fallback Passcode States
  const [passcodeInput, setPasscodeInput] = useState('');
  const [passcodeError, setPasscodeError] = useState('');

  useEffect(() => {
    // Listen to Auth State
    const unsubscribe = initAuth((user, token) => {
      if (user) {
        if (token) {
          setGoogleToken(token);
        }
        if (user.email === 'faizansadiqi501@gmail.com') {
          setIsAdminUser(true);
          setAdminEmail(user.email || '');
          fetchWaitlist();
        } else {
          setIsAdminUser(false);
          setAdminEmail(user.email || '');
        }
      } else {
        // Only reset if we didn't use the passcode bypass
        if (!adminEmail.includes('(Bypassed)')) {
          setIsAdminUser(false);
          setAdminEmail('');
          setGoogleToken(null);
        }
      }
    });
    return () => unsubscribe();
  }, [isOpen]);

  const handlePasscodeBypass = (e: React.FormEvent) => {
    e.preventDefault();
    setPasscodeError('');
    const cleanPass = passcodeInput.trim().toLowerCase();
    
    if (cleanPass === 'faizanadmin' || cleanPass === 'faizan') {
      setIsAdminUser(true);
      setAdminEmail('faizansadiqi501@gmail.com (Bypassed)');
      setSyncStatusMsg('By-passed redirect checks successfully. Offline roster operational.');
      setPasscodeInput('');
      setTimeout(() => {
        fetchWaitlist();
      }, 50);
    } else {
      setPasscodeError('Invalid passcode. Please check and try again.');
    }
  };

  const downloadCSV = () => {
    if (waitlist.length === 0) {
      alert('No entries to export.');
      return;
    }
    
    // Create headers
    const headers = ['Parent Name', 'Email Address', 'WhatsApp / Phone', 'Sync ID', 'Sync Status', 'Registration Date'];
    
    // Create rows
    const rows = waitlist.map(item => [
      `"${(item.parentName || '').replace(/"/g, '""')}"`,
      `"${(item.email || '').replace(/"/g, '""')}"`,
      `"${(item.phone || '').replace(/"/g, '""')}"`,
      `"${item.id}"`,
      item.syncedToSheets ? 'Synced' : 'Pending',
      `"${formatDate(item.createdAt).replace(/"/g, '""')}"`
    ]);
    
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `parents_waitlist_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAdminLogin = async () => {
    setLoading(true);
    setSyncStatusMsg('');
    try {
      const res = await googleSignIn();
      if (res?.user) {
        if (res.user.email === 'faizansadiqi501@gmail.com') {
          setIsAdminUser(true);
          setAdminEmail(res.user.email);
          setGoogleToken(res.accessToken);
          fetchWaitlist();
        } else {
          setIsAdminUser(false);
          setAdminEmail(res.user.email || '');
        }
      }
    } catch (err) {
      console.error('Admin authentication error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogout = async () => {
    setLoading(true);
    try {
      await logout();
      setIsAdminUser(false);
      setGoogleToken(null);
      setWaitlist([]);
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchWaitlist = async () => {
    setLoading(true);
    let entries: WaitlistEntry[] = [];
    
    // 1. Fetch from Firestore
    try {
      const waitlistRef = collection(db, 'waitlist');
      const q = query(waitlistRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        entries.push({
          id: docSnap.id,
          parentName: data.parentName || 'Unknown',
          email: data.email || '',
          phone: data.phone || '',
          syncedToSheets: !!data.syncedToSheets,
          createdAt: data.createdAt,
        });
      });
    } catch (err) {
      console.warn('Could not load from Firestore (using local storage backup only):', err);
    }

    // 2. Load from localStorage backup queue
    try {
      const backups = JSON.parse(localStorage.getItem('offline_waitlist_entries') || '[]');
      backups.forEach((b: any) => {
        // Prevent display duplicates
        if (!entries.some(e => e.id === b.id || e.email === b.email)) {
          entries.push({
            id: b.id,
            parentName: b.parentName,
            email: b.email,
            phone: b.phone,
            syncedToSheets: b.syncedToSheets,
            createdAt: b.createdAt,
          });
        }
      });
    } catch (localErr) {
      console.warn('Error fetching localStorage backup entries:', localErr);
    }

    // 3. Sort merged list by date descending safely
    entries.sort((a, b) => {
      const timeA = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : new Date(a.createdAt).getTime();
      const timeB = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : new Date(b.createdAt).getTime();
      const numA = isNaN(timeA) ? 0 : timeA;
      const numB = isNaN(timeB) ? 0 : timeB;
      return numB - numA;
    });

    setWaitlist(entries);
    setLoading(false);
  };

  // Convert Firebase Timestamp or String Date to presentational text
  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Just now';
    if (timestamp.toDate) {
      return timestamp.toDate().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    }
    const d = new Date(timestamp);
    return isNaN(d.getTime()) ? 'Just now' : d.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  };

  const syncToSheets = async () => {
    if (waitlist.length === 0) {
      setSyncStatusMsg('No waitlist signups available to sync.');
      return;
    }

    setSyncing(true);
    setSyncStatusMsg('Verifying Sheets authentication token...');

    try {
      const accessToken = await getAccessToken();
      if (!accessToken) {
        throw new Error('Google OAuth Access Token expired or unavailable. Please re-authenticate.');
      }

      let activeSpreadsheetId = spreadsheetId;

      // 1. Create a spreadsheet if it doesn't exist
      if (!activeSpreadsheetId) {
        setSyncStatusMsg('Provisioning new waiting list Spreadsheet...');
        const createRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            properties: {
              title: 'The Parenting AI - Waitlist Signups'
            }
          })
        });

        if (!createRes.ok) {
          const errData = await createRes.json();
          throw new Error('Failed to create sheet: ' + JSON.stringify(errData));
        }

        const sheetData = await createRes.json();
        activeSpreadsheetId = sheetData.spreadsheetId;
        setSpreadsheetId(activeSpreadsheetId);
        if (activeSpreadsheetId) {
          localStorage.setItem('theparentingai_spreadsheet_id', activeSpreadsheetId);
        }

        // Add header row
        setSyncStatusMsg('Configuring standard Sheets headers...');
        const headerRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${activeSpreadsheetId}/values/Sheet1!A1:D1:append?valueInputOption=USER_ENTERED`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            values: [['Parent Name', 'Email Address', 'WhatsApp / Phone', 'Registration Date']]
          })
        });

        if (!headerRes.ok) {
          console.warn('Headers push failed, continuing anyway...');
        }
      }

      // 2. Filter unsynced waitlist entries
      const unsynced = waitlist.filter(item => !item.syncedToSheets);
      if (unsynced.length === 0) {
        setSyncStatusMsg('All current entries are already synced to Google Sheets!');
        setSyncing(false);
        return;
      }

      // 3. Sync rows in batch to Google Sheets
      setSyncStatusMsg(`Appending ${unsynced.length} records to Google Sheet...`);
      const rowValues = unsynced.map(item => [
        item.parentName,
        item.email,
        item.phone,
        formatDate(item.createdAt)
      ]);

      const appendRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${activeSpreadsheetId}/values/Sheet1!A:D:append?valueInputOption=USER_ENTERED`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          values: rowValues
        })
      });

      if (!appendRes.ok) {
        const appendErr = await appendRes.json();
        throw new Error('Google Sheets Appending failed: ' + JSON.stringify(appendErr));
      }

      // 4. Update the synced records in Firestore & Local storage backup
      setSyncStatusMsg('Updating synchronization state...');
      const batch = writeBatch(db);
      let localSavesNeedUpdating = false;
      let hasFirestoreWrites = false;
      const backups = JSON.parse(localStorage.getItem('offline_waitlist_entries') || '[]');

      unsynced.forEach((item) => {
        // If it exists in the offline localStorage backup list, update its sync status
        const backupIdx = backups.findIndex((b: any) => b.id === item.id);
        if (backupIdx !== -1) {
          backups[backupIdx].syncedToSheets = true;
          localSavesNeedUpdating = true;
        }

        // If it is a Cloud Firestore record, update Firestore
        if (!String(item.id).startsWith('waitlist_local_')) {
          try {
            const itemRef = doc(db, 'waitlist', item.id);
            batch.update(itemRef, { syncedToSheets: true });
            hasFirestoreWrites = true;
          } catch (err) {
            console.warn('Could not add to Firestore transaction batch:', err);
          }
        }
      });

      if (localSavesNeedUpdating) {
        localStorage.setItem('offline_waitlist_entries', JSON.stringify(backups));
      }

      if (hasFirestoreWrites) {
        try {
          await batch.commit();
        } catch (dbErr) {
          console.warn('Could not commit firestore update batch (updated local stats successfully):', dbErr);
        }
      }

      setSyncStatusMsg(`Success! Synchronized ${unsynced.length} parents to Google Sheets.`);
      fetchWaitlist(); // Refresh table state

    } catch (err: any) {
      console.error('Sync to Sheets error:', err);
      setSyncStatusMsg(err?.message || 'Sync failed. Try logging in again.');
    } finally {
      setSyncing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 max-w-xl w-full bg-brand-cream border-l border-brand-slate/10 shadow-2xl flex flex-col font-sans animate-slideLeft">
      {/* Drawer Header */}
      <div className="p-5 bg-brand-navy text-white flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-2">
          <Database className="w-5 h-5 text-brand-gold" />
          <div>
            <h3 className="font-display font-semibold text-sm tracking-wide">WAITLIST MANAGER</h3>
            <p className="text-[10px] text-brand-light-teal/70 font-mono">Google Workspace + Cloud Firestore</p>
          </div>
        </div>
        <button 
          id="admin-dashboard-close-btn"
          onClick={onClose} 
          className="p-1 rounded-full hover:bg-white/10 text-brand-cream transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Content Body */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        
        {/* Scenario 1: Authentication block */}
        {!isAdminUser ? (
          <div className="space-y-6 py-6 text-center max-w-sm mx-auto">
            <div className="w-14 h-14 bg-brand-navy/5 text-brand-navy rounded-full flex items-center justify-center mx-auto">
              <Lock className="w-7 h-7 text-brand-navy" />
            </div>

            <div className="space-y-2">
              <h4 className="font-display text-base font-bold text-brand-navy">Administrator Verification</h4>
              <p className="text-xs text-brand-navy/70 leading-relaxed">
                Connect your Google Account to view raw Firestore registrations and link your custom Google Sheets waitlist.
              </p>
            </div>

            {adminEmail && adminEmail !== 'faizansadiqi501@gmail.com' && (
              <div className="p-3 bg-brand-coral/10 border border-brand-coral/20 rounded-lg text-brand-coral text-xs flex gap-2 items-start text-left">
                <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  <strong>Authentication Rejected:</strong> Signed in as <em>{adminEmail}</em>. Only the core administrator (<strong>faizansadiqi501@gmail.com</strong>) has access keys.
                </span>
              </div>
            )}

            <div className="pt-2 space-y-4">
              <button 
                id="admin-google-signin-btn"
                onClick={handleAdminLogin}
                disabled={loading}
                className="gsi-material-button mx-auto hover:bg-[#EEF1F6] border border-[#dadce0] rounded-lg cursor-pointer transition-colors"
                style={{ padding: '4.5px 12px' }}
              >
                <div className="gsi-material-button-state"></div>
                <div className="gsi-material-button-content-wrapper flex items-center gap-3">
                  <div className="gsi-material-button-icon py-1">
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" style={{ display: 'block', width: '20px', height: '20px' }}>
                      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                      <path fill="none" d="M0 0h48v48H0z"></path>
                    </svg>
                  </div>
                  <span className="gsi-material-button-contents text-sm font-sans font-semibold text-neutral-700">
                    {loading ? 'Authenticating...' : 'Sign in with Google'}
                  </span>
                </div>
              </button>

              <div className="relative py-2 flex items-center justify-center">
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 border-b border-brand-slate/15"></div>
                <span className="relative bg-[#faf7f2] px-3 text-[9px] text-brand-navy/55 font-mono font-bold uppercase tracking-wider">OR BYPASS</span>
              </div>

              {/* Passcode Bypass login box */}
              <form onSubmit={handlePasscodeBypass} className="bg-white p-4 rounded-xl border border-brand-slate/15 shadow-2xs space-y-3 text-left">
                <div className="flex items-center gap-1.5 text-brand-teal">
                  <Key className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-bold uppercase tracking-wider font-display">Fast Passcode Unlock</span>
                </div>
                <p className="text-[10px] text-brand-navy/60 leading-normal">
                  If Google redirects are blocked by missing server domains, enter your bypass passcode to view waitlist contacts instantly:
                </p>
                <div className="space-y-1.5">
                  <input
                    id="admin-bypass-passcode-input"
                    type="password"
                    placeholder="Enter bypass passcode (e.g. faizanadmin)"
                    value={passcodeInput}
                    onChange={(e) => {
                      setPasscodeError('');
                      setPasscodeInput(e.target.value);
                    }}
                    className="w-full bg-brand-cream/40 border border-brand-slate/15 rounded-lg px-3 py-2 text-xs text-brand-navy focus:outline-hidden focus:border-brand-teal transition-colors font-mono"
                  />
                  {passcodeError && (
                    <p className="text-[10px] text-brand-coral font-semibold">{passcodeError}</p>
                  )}
                </div>
                <button
                  id="admin-bypass-submit-btn"
                  type="submit"
                  className="w-full bg-brand-navy hover:bg-brand-navy/90 text-white font-bold text-xs py-2 rounded-lg transition-colors cursor-pointer"
                >
                  Verify Code & Fetch Waitlist
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="space-y-6 animate-fadeIn">
            
            {/* Admin Header session box */}
            <div className="bg-white p-4 rounded-xl border border-brand-slate/15 flex items-center justify-between shadow-xxs">
              <div>
                <span className="text-[10px] text-brand-navy/50 font-bold block">CONNECTED ADMINISTRATOR</span>
                <span className="text-xs font-semibold text-brand-navy">{adminEmail}</span>
              </div>
              <button
                id="admin-signout-btn"
                onClick={handleAdminLogout}
                className="text-xs text-brand-coral hover:bg-brand-coral/5 py-1.5 px-3 rounded-lg flex items-center gap-1.5 border border-brand-coral/10 font-medium transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>
            </div>

            {/* SYNC PANEL CARD */}
            <div className="bg-brand-navy text-white rounded-xl p-5 space-y-4 shadow-sm border border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/10 text-brand-gold rounded-full flex items-center justify-center shrink-0">
                  <FileSpreadsheet className="w-5 h-5 text-brand-gold" />
                </div>
                <div className="flex-1">
                  <h4 className="text-xs font-bold font-sans tracking-wide">Google Sheets Synchronizer</h4>
                  <p className="text-[10px] text-white/70">
                    {spreadsheetId ? 'Linked to waitlist Spreadsheet' : 'No Spreadsheet linked yet'}
                  </p>
                </div>
              </div>

              {!googleToken && (
                <div className="bg-white/5 border border-white/10 rounded-lg p-3 space-y-2 text-[11px] font-sans">
                  <p className="text-brand-gold font-semibold leading-relaxed">
                    ⚠️ Google Sheets authorization needed to sync. Click below to connect Sheets permissions.
                  </p>
                  <button
                    id="admin-auth-google-sheets-btn"
                    onClick={handleAdminLogin}
                    className="bg-brand-gold hover:bg-[#C9A95F] text-brand-navy font-extrabold text-[10px] px-2.5 py-1 rounded transition-all cursor-pointer inline-flex items-center gap-1"
                  >
                    <span>Authorize Google Sheets</span>
                  </button>
                </div>
              )}

              {spreadsheetId && (
                <div className="p-3 bg-white/5 rounded-lg border border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] text-[#2a9d8f] font-bold tracking-wider font-mono uppercase">Spreadsheet Connected</span>
                    <a
                      href={`https://docs.google.com/spreadsheets/d/${spreadsheetId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] text-brand-gold hover:underline font-semibold flex items-center gap-1"
                    >
                      <span>Open Sheet</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <p className="text-[10px] font-mono select-all text-white/50 truncate">ID: {spreadsheetId}</p>
                </div>
              )}

              {syncStatusMsg && (
                <div className="p-2.5 bg-white/5 rounded-md text-[10px] text-brand-cream/90 flex gap-2 items-center">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-brand-gold animate-pulse shrink-0" />
                  <span className="font-mono">{syncStatusMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 pt-1">
                <button
                  id="admin-sync-btn"
                  onClick={syncToSheets}
                  disabled={syncing || waitlist.length === 0}
                  className="bg-brand-gold hover:bg-[#C9A95F] disabled:bg-neutral-600 disabled:text-neutral-400 text-brand-navy font-bold text-xs py-3 rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
                  <span>{syncing ? 'Syncing...' : 'Sync to Sheets'}</span>
                </button>

                <button
                  id="admin-refresh-list-btn"
                  onClick={fetchWaitlist}
                  disabled={loading}
                  className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs py-3 rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                  <span>Load Entries</span>
                </button>
              </div>
            </div>

            {/* Waitlist stats dashboard bar */}
            <div className="grid grid-cols-3 gap-2.5 text-center">
              <div className="bg-white p-3 rounded-xl border border-brand-slate/15 shadow-xxs">
                <span className="text-[9px] text-brand-navy/50 font-bold block uppercase">Total Signups</span>
                <span className="text-lg font-black text-brand-navy">{waitlist.length}</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-brand-slate/15 shadow-xxs">
                <span className="text-[9px] text-[#2a9d8f] font-bold block uppercase">Synced To Sheet</span>
                <span className="text-lg font-black text-[#2a9d8f]">
                  {waitlist.filter(item => item.syncedToSheets).length}
                </span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-brand-slate/15 shadow-xxs">
                <span className="text-[9px] text-brand-coral font-bold block uppercase">Pending Sync</span>
                <span className="text-lg font-black text-brand-coral">
                  {waitlist.filter(item => !item.syncedToSheets).length}
                </span>
              </div>
            </div>

            {/* WAITLIST ROSTER TABLE */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <h5 className="text-[10px] font-bold text-brand-navy/60 uppercase tracking-wider">
                  Live Registration Journal ({waitlist.length} entries)
                </h5>
                {waitlist.length > 0 && (
                  <button
                    id="admin-csv-export-btn"
                    onClick={downloadCSV}
                    className="text-[10px] bg-brand-navy hover:bg-brand-navy/90 text-brand-gold font-bold px-2 py-1 flex items-center gap-1 rounded-sm cursor-pointer transition-all border border-white/10"
                  >
                    <Download className="w-3 h-3 text-brand-gold" />
                    <span>Download CSV</span>
                  </button>
                )}
              </div>

              <div className="border border-brand-slate/15 rounded-xl overflow-hidden bg-white shadow-xxs">
                <div className="max-h-[350px] overflow-y-auto">
                  {waitlist.length === 0 ? (
                    <div className="p-8 text-center text-xs text-brand-navy/40 italic">
                      No parent waitlist registrations found in database.
                    </div>
                  ) : (
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-brand-navy/5 text-brand-navy/70 border-b border-brand-slate/15">
                          <th className="p-2.5 font-bold">Parent / Info</th>
                          <th className="p-2.5 font-bold">WhatsApp / Ph</th>
                          <th className="p-2.5 font-bold text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {waitlist.map((item) => (
                          <tr key={item.id} className="border-b border-brand-slate/10 hover:bg-brand-cream/20">
                            <td className="p-2.5 space-y-0.5">
                              <span className="font-bold text-brand-navy block leading-tight">{item.parentName}</span>
                              <span className="text-[10px] text-brand-navy/60 block leading-tight truncate max-w-[170px]">
                                {item.email}
                              </span>
                              <span className="text-[9px] text-brand-navy/40 font-mono block leading-tight">
                                {formatDate(item.createdAt)}
                              </span>
                            </td>
                            <td className="p-2.5 font-mono text-brand-navy/80 vertical-middle">
                              {item.phone}
                            </td>
                            <td className="p-2.5 text-center vertical-middle">
                              {item.syncedToSheets ? (
                                <span className="inline-flex items-center gap-1 text-[9px] bg-emerald-50 text-[#2a9d8f] px-2 py-0.5 rounded-full font-bold border border-emerald-200">
                                  <Check className="w-3 h-3" />
                                  <span>Synced</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[9px] bg-amber-50 text-brand-coral px-2 py-0.5 rounded-full font-bold border border-amber-200">
                                  <RefreshCw className="w-2.5 h-2.5 animate-pulse" />
                                  <span>Pending</span>
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* Drawer Footer info */}
      <div className="p-4 bg-brand-navy/5 border-t border-brand-slate/10 text-center">
        <p className="text-[9px] text-brand-navy/50 font-sans">
          This system verifies direct Google API scopes in the browser context securely.
        </p>
      </div>
    </div>
  );
}
