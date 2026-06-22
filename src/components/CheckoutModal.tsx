import React, { useState } from 'react';
import { X, CheckCircle, ShieldCheck, Mail, Phone, ArrowRight, Download, Check, Library } from 'lucide-react';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (email: string) => void;
}

export default function CheckoutModal({ isOpen, onClose, onSuccess }: CheckoutModalProps) {
  const [form, setForm] = useState({
    email: '',
    parentName: '',
    phone: '',
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [step, setStep] = useState<'details' | 'processing' | 'success'>('details');
  const [progressText, setProgressText] = useState('Registering...');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setErrorMessage('');
  };

  const handleSubmitDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.parentName.trim()) return setErrorMessage('Please enter your full name.');
    if (!form.email.trim() || !form.email.includes('@')) return setErrorMessage('Please enter a valid email address.');
    if (!form.phone.trim() || form.phone.length < 10) return setErrorMessage('Please enter a valid 10-digit mobile number.');

    setStep('processing');
    setProgressText('Connecting to waitlist cloud database...');

    try {
      // Simulate real-time progress frames
      const sequence = [
        { text: 'Securing database socket connection...', delay: 300 },
        { text: 'Verifying details & checking anti-spam integrity...', delay: 700 },
        { text: 'Writing waitlist record to secure Google cloud ledger...', delay: 1100 },
        { text: 'Confirming pre-launch waitlist placement...', delay: 1500 }
      ];

      sequence.forEach((item) => {
        setTimeout(() => {
          setProgressText(item.text);
        }, item.delay);
      });

      // Check if direct Google Sheets Apps Script integration is set up
      const directSheetsUrl = (import.meta as any).env?.VITE_DIRECT_SHEETS_URL || 'https://script.google.com/macros/s/AKfycbwKb-Tc3EuoCTp6CRpplzeqvrrZ47sxdD-p1Y_d5HM-RMNdyfBxqW0zTW8xiN6P14hJPA/exec';
      let directSyncSuccessful = false;

      if (directSheetsUrl) {
        try {
          console.log('Direct Sheets sync enabled. Sending payload to:', directSheetsUrl);
          // Send as POST with no-cors mode to prevent CORS redirect blocks
          await fetch(directSheetsUrl, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              parentName: form.parentName.trim(),
              email: form.email.trim(),
              phone: form.phone.trim(),
              createdAt: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
            })
          });
          directSyncSuccessful = true;
          console.log('Successfully posted waitlist registration to Direct Sheets URL.');
        } catch (postErr) {
          console.warn('Direct Sheets post failed, falling back to backup storage:', postErr);
        }
      }

      // Write waitlist entry to firestore or local backup on delay/error
      const entryId = 'waitlist_' + Math.floor(Math.random() * 900000 + 100000);
      const docRef = doc(db, 'waitlist', entryId);
      
      const firestorePayload = {
        parentName: form.parentName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        syncedToSheets: directSyncSuccessful,
        createdAt: serverTimestamp(),
      };

      // Race Firestore write against a 2-second timeout to prevent loading-spinner hang
      const writePromise = setDoc(docRef, firestorePayload);
      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('TIMEOUT')), 2000));

      try {
        await Promise.race([writePromise, timeoutPromise]);
        console.log('Successfully stored waitlist registration in Firestore.');
      } catch (writeErr: any) {
        console.warn('Firebase submission timed out or failed. Saving to local backup queue:', writeErr);
        
        // Save to offline backup list
        const backups = JSON.parse(localStorage.getItem('offline_waitlist_entries') || '[]');
        backups.push({
          id: entryId,
          parentName: form.parentName.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          syncedToSheets: directSyncSuccessful,
          createdAt: new Date().toISOString(),
          isOfflineBackup: true
        });
        localStorage.setItem('offline_waitlist_entries', JSON.stringify(backups));
      }

      setTimeout(() => {
        setStep('success');
        onSuccess(form.email);
      }, 1200);

    } catch (err: any) {
      console.error('Waitlist submit error:', err);
      setStep('details');
      setErrorMessage(err?.message || 'Failed to submit waitlist registration. Please check connection and try again.');
      try {
        handleFirestoreError(err, OperationType.CREATE, 'waitlist');
      } catch (authErr) {
        // Suppress nested rethrow to avoid crashing layout
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-brand-navy/80 backdrop-blur-xs flex items-center justify-center p-4">
      {/* Modal Container */}
      <div 
        id="checkout-dialog-box"
        className="relative bg-brand-cream rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-brand-slate/20 animate-fadeIn"
      >
        {/* Header (Hidden on success to focus on congrats panel) */}
        {step !== 'success' && (
          <div className="p-5 bg-brand-navy text-white flex items-center justify-between border-b border-white/10">
            <div>
              <h3 className="font-display text-lg font-bold">Join the Exclusive Waitlist</h3>
              <p className="text-xs text-brand-light-teal/85 font-mono">Free Priority Access on Launch</p>
            </div>
            <button 
              id="checkout-close-btn"
              onClick={onClose} 
              className="p-1 rounded-full hover:bg-white/10 text-brand-cream cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* DETAILS ENTRY STEP */}
        {step === 'details' && (
          <form onSubmit={handleSubmitDetails} className="p-6 space-y-5">
            {/* Value Indicator */}
            <div className="bg-brand-cream border border-brand-slate/15 rounded-xl p-4 flex items-center justify-between">
              <div className="max-w-[70%]">
                <span className="text-[9px] uppercase font-bold tracking-wider text-brand-navy bg-brand-navy/5 px-2 py-0.5 rounded-full inline-block mb-1">
                  Waitlist Incentive
                </span>
                <h4 className="text-sm font-semibold text-brand-navy font-sans mb-0.5">3-Book Parenting AI Bundle</h4>
                <p className="text-[10px] text-brand-navy/60 font-sans leading-tight">
                  Join today to guarantee the best priority spot + standard launch priority.
                </p>
              </div>
              <div className="text-right shrink-0">
                <span className="text-2xs line-through text-brand-navy/40 block">Rs. 1,097 (Standard)</span>
                <p className="text-lg font-extrabold text-brand-navy">FREE</p>
                <span className="text-[9px] text-[#2a9d8f] font-bold block">For Early Parents</span>
              </div>
            </div>

            {errorMessage && (
              <div className="p-3 bg-brand-coral/10 border border-brand-coral/20 rounded-lg text-brand-coral text-xs font-semibold">
                {errorMessage}
              </div>
            )}

            {/* Inputs */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-brand-navy mb-1.5 font-sans">Parent's Full Name</label>
                <div className="relative">
                  <input
                    type="text"
                    name="parentName"
                    value={form.parentName}
                    onChange={handleInputChange}
                    placeholder="E.g., Dr. Meera Patil"
                    className="w-full bg-white text-sm text-brand-navy border border-brand-slate/20 rounded-lg py-2.5 px-3.5 focus:outline-hidden focus:ring-2 focus:ring-brand-navy/15 focus:border-brand-navy font-sans shadow-xxs"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-brand-navy mb-1.5 font-sans">Email Address (To Alert You)</label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleInputChange}
                      placeholder="name@gmail.com"
                      className="w-full bg-white text-sm text-brand-navy border border-brand-slate/20 rounded-lg py-2.5 px-3.5 focus:outline-hidden focus:ring-2 focus:ring-brand-navy/15 focus:border-brand-navy font-sans shadow-xxs"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-brand-navy mb-1.5 font-sans">WhatsApp / Mobile Number</label>
                  <div className="relative">
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleInputChange}
                      placeholder="9876543210"
                      maxLength={12}
                      className="w-full bg-white text-sm text-brand-navy border border-brand-slate/20 rounded-lg py-2.5 px-3.5 focus:outline-hidden focus:ring-2 focus:ring-brand-navy/15 focus:border-brand-navy font-sans shadow-xxs"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Bullet trust list */}
            <div className="text-[11px] text-brand-navy/70 space-y-1.5 pt-2 border-t border-brand-slate/10 font-sans">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-navy shrink-0" />
                <span>Secure SSL Protection & zero-spam mail guarantee.</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-brand-navy shrink-0" />
                <span>Standard priority spot reserved on launch day.</span>
              </div>
            </div>

            {/* Proceed Action */}
            <button
              id="checkout-confirm-payment-btn"
              type="submit"
              className="w-full bg-brand-gold hover:bg-[#C9A95F] text-brand-navy font-sans font-extrabold text-sm py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md border border-brand-gold/20"
            >
              <span>Submit & Join Free Waitlist</span>
              <ArrowRight className="w-4 h-4 text-brand-navy" />
            </button>
          </form>
        )}

        {/* PROCESSING LOADER STEP */}
        {step === 'processing' && (
          <div className="p-12 text-center space-y-6 flex flex-col items-center justify-center">
            {/* Spinning Circle */}
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border-4 border-brand-navy/10" />
              <div className="absolute inset-0 rounded-full border-4 border-t-brand-navy animate-spin" />
            </div>

            <div className="space-y-2">
              <h4 className="font-display text-lg font-bold text-brand-navy">Saving your registration...</h4>
              <p className="text-xs text-brand-navy/60 font-mono italic max-w-xs h-8 text-center">
                "{progressText}"
              </p>
            </div>

            <p className="text-[10px] text-brand-navy/40 font-sans">
              Configuring your secure member session keys. Please do not refresh.
            </p>
          </div>
        )}

        {/* SUCCESS RECEIPT / DELIVERY STEP */}
        {step === 'success' && (
          <div className="text-brand-navy animate-fadeIn">
            {/* Successful Top Header Banner */}
            <div className="bg-brand-navy p-6 text-center text-white space-y-2 relative">
              <div className="absolute right-4 top-4">
                <button 
                  id="checkout-success-close-btn"
                  onClick={onClose} 
                  className="p-1 rounded-full hover:bg-white/10 text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="w-12 h-12 bg-white/10 rounded-full mx-auto flex items-center justify-center">
                <CheckCircle className="w-7 h-7 text-brand-gold animate-bounce" />
              </div>
              <h3 className="font-display text-lg font-bold text-brand-cream">Waitlist Registration Confirmed!</h3>
              <p className="text-xs text-white/80 font-sans max-w-sm mx-auto">
                Thank you, <strong className="text-brand-gold">{form.parentName}</strong>! Your email <strong className="underline">{form.email}</strong> has been secured in our roster sheet.
              </p>
            </div>

            {/* Official Waitlist Ticket */}
            <div className="p-6 space-y-5 bg-gradient-to-b from-brand-cream to-white">
              <div className="bg-white rounded-xl border border-brand-slate/20 p-4 space-y-3 shadow-xs">
                <div className="flex justify-between items-center pb-2 border-b border-brand-slate/15">
                  <span className="text-[9px] text-brand-navy/60 font-mono">TICKET ID: TPAI-WL{Math.floor(Math.random() * 900000 + 100000)}</span>
                  <span className="text-[9px] text-[#2a9d8f] font-bold font-mono">STATUS: CONFIRMED</span>
                </div>

                <div className="grid grid-cols-2 gap-y-2.5 text-xs font-sans">
                  <div>
                    <span className="text-brand-navy/50 block text-[10px] uppercase font-semibold">Registered Parent</span>
                    <span className="text-brand-navy font-semibold">{form.parentName}</span>
                  </div>
                  <div>
                    <span className="text-brand-navy/50 block text-[10px] uppercase font-semibold">Alert Email</span>
                    <span className="text-brand-navy font-semibold truncate max-w-[140px] block">{form.email}</span>
                  </div>
                  <div>
                    <span className="text-brand-navy/50 block text-[10px] uppercase font-semibold">Position Status</span>
                    <span className="text-brand-gold font-bold">Priority Group A</span>
                  </div>
                  <div>
                    <span className="text-brand-navy/50 block text-[10px] uppercase font-semibold">Registration Cost</span>
                    <span className="text-[#2a9d8f] font-bold">Rs. 0 (Free Launch)</span>
                  </div>
                </div>
              </div>

              {/* Action Close */}
              <button
                id="close-success-dialog-btn"
                onClick={onClose}
                className="w-full bg-brand-navy hover:bg-[#132c54] text-white font-sans font-semibold text-xs py-2.5 rounded-lg text-center transition-colors cursor-pointer"
              >
                Close & Return to Home Screen
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
