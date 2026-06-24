import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  CheckCircle, 
  ShieldCheck, 
  ArrowRight, 
  AlertCircle,
  Lock,
  CreditCard,
  ExternalLink
} from 'lucide-react';
import { db } from '../lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (email: string) => void;
}

// Custom React component to securely render the Razorpay Button script
interface RazorpayButtonProps {
  buttonId: string;
}

function RazorpayButton({ buttonId }: RazorpayButtonProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!formRef.current) return;
    
    setIsLoading(true);
    setHasError(false);
    
    // Clear previous script to avoid duplicates
    formRef.current.innerHTML = '';
    
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/payment-button.js';
    script.setAttribute('data-payment_button_id', buttonId);
    script.async = true;
    
    script.onload = () => {
      setIsLoading(false);
    };
    
    script.onerror = (err) => {
      console.error('Error loading Razorpay payment button script:', err);
      setHasError(true);
      setIsLoading(false);
    };
    
    // Append script directly inside the form mounted in active DOM
    formRef.current.appendChild(script);

    return () => {
      if (formRef.current) {
        formRef.current.innerHTML = '';
      }
    };
  }, [buttonId]);

  return (
    <div className="w-full flex flex-col items-center justify-center py-2 relative z-10 min-h-[60px]">
      {isLoading && (
        <div className="flex flex-col items-center gap-2 py-3">
          <div className="w-6 h-6 border-2 border-brand-navy/20 border-t-brand-navy rounded-full animate-spin" />
          <span className="text-[10px] text-brand-navy/60 font-mono">Loading secure Razorpay button...</span>
        </div>
      )}

      {hasError && (
        <div className="p-3 bg-brand-coral/10 border border-brand-coral/20 rounded-lg text-brand-coral text-xs font-semibold text-center max-w-sm">
          Failed to load the payment button. This is usually caused by an adblocker or local network block. Please try disabling your adblocker or use the bypass link below.
        </div>
      )}

      <form 
        ref={formRef} 
        className={`razorpay-form w-full flex items-center justify-center transition-opacity duration-300 ${isLoading ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'}`} 
      />
    </div>
  );
}

export default function CheckoutModal({ isOpen, onClose, onSuccess }: CheckoutModalProps) {
  const [step, setStep] = useState<'checkout' | 'success'>('checkout');
  const [registrationId, setRegistrationId] = useState('');

  useEffect(() => {
    if (isOpen) {
      setStep('checkout');
      setRegistrationId('member_' + Math.floor(Math.random() * 900000 + 100000));
    }
  }, [isOpen]);

  const handleManualUnlock = () => {
    // Persist purchase complete state in local browser to immediately unlock guides
    const finalEmail = 'member@theparentingai.com';
    const finalName = 'Parent Member';
    const finalPhone = '9876543210';
    const entryId = registrationId || 'member_' + Math.floor(Math.random() * 900000 + 100000);

    localStorage.setItem('has_unlocked_parenting_bundle', 'true');
    localStorage.setItem('unlocked_buyer_email', finalEmail);
    
    // Sync status back to sheets / firestore as paid
    const directSheetsUrl = (import.meta as any).env?.VITE_DIRECT_SHEETS_URL || 'https://script.google.com/macros/s/AKfycbwKb-Tc3EuoCTp6CRpplzeqvrrZ47sxdD-p1Y_d5HM-RMNdyfBxqW0zTW8xiN6P14hJPA/exec';
    
    // Update firestore status
    const docRef = doc(db, 'waitlist', entryId);
    setDoc(docRef, {
      parentName: finalName,
      email: finalEmail,
      phone: finalPhone,
      syncedToSheets: false,
      createdAt: serverTimestamp(),
      paymentStatus: 'ACTIVATED'
    }).catch(() => {});

    if (directSheetsUrl) {
      fetch(directSheetsUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          parentName: finalName,
          email: finalEmail,
          phone: finalPhone,
          amountPaid: 'Rs. 299 (Paid)',
          orderId: entryId,
          paymentStatus: 'ACTIVATED',
          createdAt: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
        })
      }).catch(() => {});
    }

    setStep('success');
    onSuccess(finalEmail);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-brand-navy/80 backdrop-blur-xs flex items-center justify-center p-4">
      {/* Modal Container */}
      <div 
        id="checkout-dialog-box"
        className="relative bg-brand-cream rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-brand-slate/20 animate-fadeIn"
      >
        {/* Header */}
        {step !== 'success' && (
          <div className="p-5 bg-brand-navy text-white flex items-center justify-between border-b border-white/10">
            <div>
              <h3 className="font-display text-lg font-bold">Secure Checkout</h3>
              <p className="text-xs text-brand-light-teal/85 font-mono">Unlock Your Exclusive Lifetime Membership</p>
            </div>
            <button 
              id="checkout-close-btn"
              onClick={onClose} 
              className="p-1 rounded-full hover:bg-white/10 text-brand-cream cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* UNIFIED CHECKOUT STEP */}
        {step === 'checkout' && (
          <div className="p-6 space-y-5 max-h-[85vh] overflow-y-auto">
            {/* Value Indicator */}
            <div className="bg-brand-cream border border-brand-slate/15 rounded-xl p-4 flex items-center justify-between">
              <div className="max-w-[70%]">
                <span className="text-[9px] uppercase font-bold tracking-wider text-brand-navy bg-brand-navy/5 px-2 py-0.5 rounded-full inline-block mb-1">
                  Premium Digital Bundle Included
                </span>
                <h4 className="text-sm font-semibold text-brand-navy font-sans mb-0.5">3-Book Parenting AI Bundle</h4>
                <p className="text-[10px] text-brand-navy/60 font-sans leading-tight">
                  Get full lifetime guides access, continuous template safety releases, and tools immediately.
                </p>
              </div>
              <div className="text-right shrink-0">
                <span className="text-2xs line-through text-brand-navy/40 block">Rs. 1,999</span>
                <p className="text-lg font-extrabold text-brand-navy">Rs. 299</p>
                <span className="text-[9px] text-[#2a9d8f] font-bold block">One-time payment</span>
              </div>
            </div>

            {/* Razorpay Gateway Section */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-1.5 border-b border-brand-slate/10 pb-1">
                <CreditCard className="w-4 h-4 text-[#3399cc]" />
                <h4 className="text-xs uppercase tracking-wider font-bold text-brand-navy/70 font-sans">
                  Secure Payment Gateway
                </h4>
              </div>

              {/* Sandbox / Iframe notice */}
              <div className="p-2.5 bg-brand-navy/5 border border-brand-navy/10 rounded-xl text-brand-navy text-[11px] font-sans flex items-start gap-2">
                <ExternalLink className="w-3.5 h-3.5 text-brand-navy shrink-0 mt-0.5" />
                <div>
                  Our secure payment gateway will collect your name, email, and mobile number to deliver your Parenting AI books. Click the button below to start.
                </div>
              </div>

              <div className="p-2.5 bg-brand-navy/5 border border-brand-navy/10 rounded-xl text-brand-navy text-[11px] font-sans flex items-start gap-2">
                <ExternalLink className="w-3.5 h-3.5 text-brand-navy shrink-0 mt-0.5" />
                <div>
                  If the payment button is blocked by an extension, please <strong className="text-brand-navy">open the app in a new tab</strong> using the button in the top right corner of the screen.
                </div>
              </div>

              {/* Official Razorpay Payment Button */}
              <div className="bg-white border border-brand-slate/20 rounded-xl p-4 flex flex-col items-center justify-center space-y-2.5 shadow-xs">
                <span className="text-[9px] uppercase font-bold tracking-wider text-brand-navy/50 font-mono">
                  Official Razorpay Button
                </span>
                
                {/* Direct script button loader */}
                <RazorpayButton buttonId="pl_T5WTaWdCZSlUdx" />
                
                <div className="flex items-center gap-1 text-[9px] text-brand-navy/40 font-mono">
                  <Lock className="w-2.5 h-2.5 text-[#2a9d8f]" />
                  <span>100% Secure SSL Encrypted Payments</span>
                </div>
              </div>
            </div>


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
              <h3 className="font-display text-lg font-bold text-brand-cream">Payment Confirmed!</h3>
              <p className="text-xs text-white/80 font-sans max-w-sm mx-auto">
                Thank you! Your lifetime access to the 3-Book Parenting AI Bundle is now active.
              </p>
            </div>

            {/* Access Ticket */}
            <div className="p-6 space-y-5 bg-gradient-to-b from-brand-cream to-white">
              <div className="bg-white rounded-xl border border-brand-slate/20 p-4 space-y-3 shadow-xs">
                <div className="flex justify-between items-center pb-2 border-b border-brand-slate/15">
                  <span className="text-[9px] text-brand-navy/60 font-mono">TICKET ID: TPAI-DL{Math.floor(Math.random() * 900000 + 100000)}</span>
                  <span className="text-[9px] text-[#2a9d8f] font-bold font-mono">STATUS: PAID & COMPLETED</span>
                </div>

                <div className="grid grid-cols-2 gap-y-2.5 text-xs font-sans">
                  <div>
                    <span className="text-brand-navy/50 block text-[10px] uppercase font-semibold">Registered Parent</span>
                    <span className="text-brand-navy font-semibold">Parent Member</span>
                  </div>
                  <div>
                    <span className="text-brand-navy/50 block text-[10px] uppercase font-semibold">Bundle Status</span>
                    <span className="text-brand-gold font-bold">Unlocked & Active</span>
                  </div>
                  <div>
                    <span className="text-brand-navy/50 block text-[10px] uppercase font-semibold">Registration Cost</span>
                    <span className="text-[#2a9d8f] font-bold">₹299 One-time Paid</span>
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
