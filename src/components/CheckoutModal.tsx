import React, { useState } from 'react';
import { X, CheckCircle, ShieldCheck, Mail, Phone, CreditCard, ArrowRight, Download, Check, Library } from 'lucide-react';
import { OrderState } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (email: string) => void;
}

export default function CheckoutModal({ isOpen, onClose, onSuccess }: CheckoutModalProps) {
  const [form, setForm] = useState<OrderState>({
    email: '',
    parentName: '',
    phone: '',
    paymentMethod: 'upi',
    paymentState: 'idle',
    simulatedUPIId: '',
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [step, setStep] = useState<'details' | 'processing' | 'success'>('details');
  const [progressText, setProgressText] = useState('Initiating payment gateway...');

  // Standard validation
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setErrorMessage('');
  };

  const handleSelectPayment = (method: 'upi' | 'card' | 'netbanking') => {
    setForm(prev => ({ ...prev, paymentMethod: method }));
  };

  const handleSubmitDetails = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.parentName.trim()) return setErrorMessage('Please enter your full name.');
    if (!form.email.trim() || !form.email.includes('@')) return setErrorMessage('Please enter a valid email address.');
    if (!form.phone.trim() || form.phone.length < 10) return setErrorMessage('Please enter a valid 10-digit mobile number.');
    
    if (form.paymentMethod === 'upi' && !form.simulatedUPIId?.trim()) {
      // Auto-generate or require
      setForm(prev => ({ ...prev, simulatedUPIId: `${prev.phone}@paytm` }));
    }

    startSimulation();
  };

  const startSimulation = () => {
    setStep('processing');
    
    const sequence = [
      { text: 'Securing connection with Indian Payment Gateway...', delay: 600 },
      { text: 'Waiting for secure UPI confirmation / card protocol authentication token...', delay: 1300 },
      { text: 'Verifying Rs. 299 transaction clearance with bank safety checks...', delay: 2000 },
      { text: 'Generating instant download vault & lifetime parent keys...', delay: 2700 }
    ];

    sequence.forEach((item) => {
      setTimeout(() => {
        setProgressText(item.text);
      }, item.delay);
    });

    setTimeout(() => {
      const generatedOrderId = 'TPAI-' + Math.floor(Math.random() * 900000 + 100000);
      setForm(prev => ({ ...prev, paymentState: 'success', orderId: generatedOrderId }));
      setStep('success');
      onSuccess(form.email);
    }, 3200);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-brand-navy/80 backdrop-blur-xs flex items-center justify-center p-4">
      {/* Modal Container */}
      <div 
        id="checkout-dialog-box"
        className="relative bg-brand-cream rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-brand-teal/20"
      >
        {/* Header (Hidden on success to focus on receipt) */}
        {step !== 'success' && (
          <div className="p-5 bg-brand-navy text-white flex items-center justify-between border-b border-white/10">
            <div>
              <h3 className="font-display text-lg font-bold">Secure Checkout</h3>
              <p className="text-xs text-brand-light-teal/85 font-mono">TheParentingAI Bundle Access</p>
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
            <div className="bg-brand-light-teal/40 border border-brand-teal/20 rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-brand-navy/60 font-medium font-sans">You are purchasing:</p>
                <h4 className="text-sm font-semibold text-brand-navy">3-Book Parenting AI Bundle</h4>
                <p className="text-[10px] text-brand-teal/80 font-mono mt-0.5">Lifetime Access • Instant PDFs</p>
              </div>
              <div className="text-right">
                <span className="text-xs line-through text-brand-navy/40">Rs. 1,097</span>
                <p className="text-xl font-bold text-brand-teal">Rs. 299</p>
              </div>
            </div>

            {errorMessage && (
              <div className="p-3 bg-brand-coral/10 border border-brand-coral/20 rounded-lg text-brand-coral text-xs font-semibold">
                {errorMessage}
              </div>
            )}

            {/* Inputs */}
            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-brand-navy mb-1.5 font-sans">Parent Name</label>
                <div className="relative">
                  <input
                    type="text"
                    name="parentName"
                    value={form.parentName}
                    onChange={handleInputChange}
                    placeholder="E.g., Dr. Meera Patil"
                    className="w-full bg-white text-sm text-brand-navy border border-brand-teal/20 rounded-lg py-2.5 pl-3 pr-4 focus:outline-hidden focus:ring-2 focus:ring-brand-teal/30 focus:border-brand-teal font-sans"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-brand-navy mb-1.5 font-sans">Email Address (For Delivery)</label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleInputChange}
                      placeholder="name@gmail.com"
                      className="w-full bg-white text-sm text-brand-navy border border-brand-teal/20 rounded-lg py-2.5 pl-3 pr-4 focus:outline-hidden focus:ring-2 focus:ring-brand-teal/30 focus:border-brand-teal font-sans"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-brand-navy mb-1.5 font-sans">Mobile Number (WhatsApp)</label>
                  <div className="relative">
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleInputChange}
                      placeholder="98765 43210"
                      maxLength={12}
                      className="w-full bg-white text-sm text-brand-navy border border-brand-teal/20 rounded-lg py-2.5 pl-3 pr-4 focus:outline-hidden focus:ring-2 focus:ring-brand-teal/30 focus:border-brand-teal font-sans"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Indian payment systems selection */}
            <div>
              <label className="block text-xs font-semibold text-brand-navy mb-2.5 font-sans">Select Payment Method</label>
              <div className="grid grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => handleSelectPayment('upi')}
                  className={`flex flex-col items-center justify-center py-3 px-2 rounded-xl border transition-all cursor-pointer ${
                    form.paymentMethod === 'upi'
                      ? 'border-brand-teal bg-brand-light-teal/20 font-bold text-brand-teal shadow-[0_4px_12px_rgba(42,157,143,0.1)]'
                      : 'border-brand-teal/15 bg-white text-brand-navy/70 hover:bg-neutral-50'
                  }`}
                >
                  <CreditCard className="w-5 h-5 mb-1" />
                  <span className="text-[11px] font-sans">BHIM / UPI</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectPayment('card')}
                  className={`flex flex-col items-center justify-center py-3 px-2 rounded-xl border transition-all cursor-pointer ${
                    form.paymentMethod === 'card'
                      ? 'border-brand-teal bg-brand-light-teal/20 font-bold text-brand-teal shadow-[0_4px_12px_rgba(42,157,143,0.1)]'
                      : 'border-brand-teal/15 bg-white text-brand-navy/70 hover:bg-neutral-50'
                  }`}
                >
                  <CreditCard className="w-5 h-5 mb-1" />
                  <span className="text-[11px] font-sans">Debit / Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectPayment('netbanking')}
                  className={`flex flex-col items-center justify-center py-3 px-2 rounded-xl border transition-all cursor-pointer ${
                    form.paymentMethod === 'netbanking'
                      ? 'border-brand-teal bg-brand-light-teal/20 font-bold text-brand-teal shadow-[0_4px_12px_rgba(42,157,143,0.1)]'
                      : 'border-brand-teal/15 bg-white text-brand-navy/70 hover:bg-neutral-50'
                  }`}
                >
                  <Library className="w-5 h-5 mb-1" />
                  <span className="text-[11px] font-sans">Net Banking</span>
                </button>
              </div>
            </div>

            {/* Conditional UPI input */}
            {form.paymentMethod === 'upi' && (
              <div className="bg-white p-3 rounded-lg border border-brand-teal/20 space-y-2">
                <span className="text-[10px] uppercase font-bold tracking-wider text-brand-teal">Simulate Indian UPI</span>
                <input
                  type="text"
                  name="simulatedUPIId"
                  value={form.simulatedUPIId}
                  onChange={handleInputChange}
                  placeholder="E.g., yourname@upi (or leave blank to auto-generate)"
                  className="w-full bg-neutral-50 text-xs text-brand-navy border border-brand-teal/15 rounded-md p-2 focus:outline-hidden focus:border-brand-teal font-sans"
                />
                <p className="text-[9px] text-brand-navy/50 leading-relaxed font-sans">
                  *This simulates Razorpay/Instamojo payment flow. Live UPI callback webhook triggers instantly on payment processing.
                </p>
              </div>
            )}

            {/* Bullet trust list */}
            <div className="text-[11px] text-brand-navy/70 space-y-1.5 pt-1.5 border-t border-brand-teal/10 font-sans">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-teal shrink-0" />
                <span>Secure 256-Bit SSL protection & safe payment clearing.</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-brand-teal shrink-0" />
                <span>Instant PDF email delivery & Lifetime WhatsApp Updates.</span>
              </div>
            </div>

            {/* Proceed Action */}
            <button
              id="checkout-confirm-payment-btn"
              type="submit"
              className="w-full bg-brand-teal hover:bg-[#238c80] text-white font-sans font-bold text-sm py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-brand-teal/10"
            >
              <span>Verify & Simulate Indian Gateway</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* PROCESSING LOADER STEP */}
        {step === 'processing' && (
          <div className="p-10 text-center space-y-6 flex flex-col items-center">
            {/* Spinning Circle */}
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border-4 border-brand-teal/20" />
              <div className="absolute inset-0 rounded-full border-4 border-t-brand-teal animate-spin" />
            </div>

            <div className="space-y-2">
              <h4 className="font-display text-lg font-bold text-brand-navy">Processing Simulated Payment...</h4>
              <p className="text-xs text-brand-navy/60 font-mono italic max-w-sm">
                "{progressText}"
              </p>
            </div>

            <p className="text-[11px] text-brand-navy/40 font-sans">
              Please do not hit refresh or press back. This replicates a live secure direct checkout callback.
            </p>
          </div>
        )}

        {/* SUCCESS RECEIPT / DELIVERY STEP */}
        {step === 'success' && (
          <div className="text-brand-navy">
            {/* Successful Top Header Banner */}
            <div className="bg-brand-teal p-6 text-center text-white space-y-2 relative">
              <div className="absolute right-4 top-4">
                <button 
                  id="checkout-success-close-btn"
                  onClick={onClose} 
                  className="p-1 rounded-full hover:bg-black/10 text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-full mx-auto flex items-center justify-center">
                <CheckCircle className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-display text-xl font-bold">Rs. 299 Payment Successful!</h3>
              <p className="text-xs text-white/90 font-sans max-w-sm mx-auto">
                Thank you for taking a confident step. We have dispatched your digital guides to <strong className="underline">{form.email}</strong>.
              </p>
            </div>

            {/* Official Looking Receipt */}
            <div className="p-6 space-y-5 bg-gradient-to-b from-brand-light-teal/20 to-brand-cream/10">
              <div className="bg-white rounded-xl border border-brand-teal/20 p-4 space-y-3 shadow-xs">
                <div className="flex justify-between items-center pb-2 border-b border-brand-teal/10">
                  <span className="text-[10px] text-brand-navy/50 font-mono">ORDER ID: {form.orderId}</span>
                  <span className="text-[10px] text-brand-teal font-bold font-mono">STATUS: PAID</span>
                </div>

                <div className="grid grid-cols-2 gap-y-2.5 text-xs font-sans">
                  <div>
                    <span className="text-brand-navy/50 block text-[10px] uppercase font-semibold">Ordered For</span>
                    <span className="text-brand-navy font-medium">{form.parentName}</span>
                  </div>
                  <div>
                    <span className="text-brand-navy/50 block text-[10px] uppercase font-semibold">Delivery Email</span>
                    <span className="text-brand-navy font-medium truncate max-w-[140px] block">{form.email}</span>
                  </div>
                  <div>
                    <span className="text-brand-navy/50 block text-[10px] uppercase font-semibold">Date of Purchase</span>
                    <span className="text-brand-navy font-medium">June 21, 2026</span>
                  </div>
                  <div>
                    <span className="text-brand-navy/50 block text-[10px] uppercase font-semibold">Paid Amount</span>
                    <span className="text-brand-teal font-bold">Rs. 299 (Nett)</span>
                  </div>
                </div>
              </div>

              {/* Direct Simulated PDF Downloads */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold font-sans text-brand-navy tracking-wider uppercase flex items-center gap-1.5">
                  <Library className="w-4 h-4 text-brand-teal" />
                  Your Download Library
                </h4>

                <div className="space-y-2">
                  <div className="bg-white border border-brand-teal/10 rounded-lg p-3 flex items-center justify-between shadow-xxs">
                    <div className="font-sans">
                      <span className="text-[9px] font-bold text-brand-navy/40 uppercase block">Main Guide</span>
                      <span className="text-xs font-bold text-brand-navy">The Parenting AI.pdf</span>
                    </div>
                    <a
                      id="download-main-guide-link"
                      href={`data:text/plain;charset=utf-8,${encodeURIComponent('Simulated PDF Download Code: The Parenting AI - Guide for Indian Families.')}`}
                      download="TheParentingAI_Main_Guide.pdf"
                      className="bg-brand-teal hover:bg-[#238c80] text-white p-2 rounded-lg transition-colors flex items-center gap-1 text-[11px] font-semibold font-sans cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </a>
                  </div>

                  <div className="bg-white border border-brand-teal/10 rounded-lg p-3 flex items-center justify-between shadow-xxs">
                    <div className="font-sans">
                      <span className="text-[9px] font-bold text-brand-gold uppercase block">Free Bonus #1</span>
                      <span className="text-xs font-bold text-brand-navy">The AI-Safe Home.pdf</span>
                    </div>
                    <a
                      id="download-bonus1-link"
                      href={`data:text/plain;charset=utf-8,${encodeURIComponent('Simulated PDF Download Code: The AI-Safe Home - Device config router locks.')}`}
                      download="The_AI_Safe_Home_Bonus_Guide_1.pdf"
                      className="bg-brand-teal hover:bg-[#238c80] text-white p-2 rounded-lg transition-colors flex items-center gap-1 text-[11px] font-semibold font-sans cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </a>
                  </div>

                  <div className="bg-white border border-brand-teal/10 rounded-lg p-3 flex items-center justify-between shadow-xxs">
                    <div className="font-sans">
                      <span className="text-[9px] font-bold text-brand-gold uppercase block">Free Bonus #2</span>
                      <span className="text-xs font-bold text-brand-navy">The 1 Percent Parent.pdf</span>
                    </div>
                    <a
                      id="download-bonus2-link"
                      href={`data:text/plain;charset=utf-8,${encodeURIComponent('Simulated PDF Download Code: The 1% Parent - 21 Habits of Elite families.')}`}
                      download="The_1_Percent_Parent_Bonus_Guide_2.pdf"
                      className="bg-brand-teal hover:bg-[#238c80] text-white p-2 rounded-lg transition-colors flex items-center gap-1 text-[11px] font-semibold font-sans cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Action Close */}
              <button
                id="close-success-dialog-btn"
                onClick={onClose}
                className="w-full bg-brand-navy hover:bg-[#132c54] text-white font-sans font-semibold text-xs py-2.5 rounded-lg text-center transition-colors cursor-pointer"
              >
                Close Delivery Panel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
