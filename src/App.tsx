import React, { useState } from 'react';
import { 
  CheckCircle, 
  HelpCircle, 
  ChevronDown, 
  ShieldCheck, 
  Star, 
  Smartphone, 
  Cpu, 
  Heart, 
  ArrowRight, 
  Download, 
  Share2,
  Lock,
  Mail,
  Instagram,
  AlertCircle,
  Quote
} from 'lucide-react';
import { BOOKS, FAQS, TESTIMONIALS } from './data';
import { BookDetail } from './types';
import BookMockup from './components/BookMockup';
import CheckoutModal from './components/CheckoutModal';
import ChaptersModal from './components/ChaptersModal';

export default function App() {
  // Modal states
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isChaptersOpen, setIsChaptersOpen] = useState(false);
  const [selectedBookForPreview, setSelectedBookForPreview] = useState<BookDetail | null>(null);

  // FAQ accordion state
  const [expandedFaq, setExpandedFaq] = useState<string | null>('faq-1');

  // Customer conversion details
  const [hasCompletedPurchase, setHasCompletedPurchase] = useState(false);
  const [buyerEmail, setBuyerEmail] = useState('');
  const [notification, setNotification] = useState<string | null>(
    '🔥 Special Launch Price of Rs. 299 ending soon for Indian parents.'
  );

  const handleOpenCheckout = () => {
    setIsCheckoutOpen(true);
  };

  const handleScrollToPricing = () => {
    const pricingSection = document.getElementById('pricing-and-offer-section');
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenChapters = (book: BookDetail) => {
    setSelectedBookForPreview(book);
    setIsChaptersOpen(true);
  };

  const handleToggleFaq = (id: string) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  const handlePurchaseSuccess = (email: string) => {
    setBuyerEmail(email);
    setHasCompletedPurchase(true);
    setNotification('🎉 Lifetime access unlocked! Check your simulated download dashboard below.');
    // Scroll down to the delivery panel smoothly
    setTimeout(() => {
      const receiptSection = document.getElementById('delivery-vault-dashboard');
      if (receiptSection) {
        receiptSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 500);
  };

  return (
    <div className="min-h-screen bg-brand-cream text-brand-navy antialiased selection:bg-brand-gold/20 selection:text-brand-navy font-sans">
      
      {/* HEADER: Navy */}
      <header className="bg-brand-navy text-white px-5 py-4 border-b border-white/10 shadow-xs">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-brand-gold" />
            <span className="font-display font-black text-xs tracking-widest text-white">THEPARENTINGAI</span>
          </div>
          <button 
            onClick={handleScrollToPricing}
            className="bg-brand-gold text-brand-navy hover:bg-[#C9A95F] font-sans font-extrabold text-[10px] px-3.5 py-1.5 rounded-md transition-all shadow-sm cursor-pointer border border-brand-gold/20"
          >
            ORDER BUNDLE
          </button>
        </div>
      </header>

      {/* SECTION 1: HERO */}
      <section className="bg-brand-cream px-5 py-10 md:py-16 border-b border-brand-teal/10">
        <div className="max-w-xl mx-auto text-center space-y-6">
          <span className="text-[11px] md:text-sm font-bold uppercase tracking-[0.3em] overflow-hidden text-brand-navy font-display block">
            THEPARENTINGAI
          </span>
          
          <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-brand-teal font-sans block">
            INDY'S LEADING DIGITAL SAFETY BUNDLE
          </span>
          
          <h1 className="font-display text-3xl md:text-5xl font-bold leading-tight text-brand-navy tracking-tight">
            Your Child Will Grow Up in an <span className="text-brand-teal underline decoration-brand-gold decoration-3">AI World</span>. Will They Be Ready?
          </h1>

          <p className="text-sm md:text-base text-brand-navy/80 leading-relaxed font-sans max-w-lg mx-auto">
            A simple, jargon-free guide that helps Indian parents understand AI, protect their kids online, and build custom habits that raise future-ready, exceptional children.
          </p>

          {/* 3D Mockup Highlight */}
          <div className="py-6 flex justify-center">
            <BookMockup 
              title={BOOKS[0].title}
              subtitle={BOOKS[0].subtitle}
              gradient={BOOKS[0].covers}
              size="lg"
              highlightText="Practical 30-Day Family AI Action Plan"
              onClickPreview={() => handleOpenChapters(BOOKS[0])}
            />
          </div>

          {/* Hero Core CTA */}
          <div className="space-y-3 pt-2">
            <button
              id="cta-hero-download"
              onClick={handleScrollToPricing}
              className="w-full bg-brand-gold hover:bg-[#C9A95F] text-brand-navy font-sans font-extrabold text-base py-4 px-6 rounded-lg shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all transform flex items-center justify-center gap-2 cursor-pointer border border-brand-gold/30"
            >
              <span>DOWNLOAD NOW FOR Rs. 299 →</span>
            </button>
            <p className="text-[11px] text-brand-navy/55 font-sans">
              Instant download • Read on phone, tablet, or laptop. No subscription required.
            </p>
          </div>
        </div>
      </section>

      {/* DELIVERY VAULT CONTROLLER (ONLY Visible instantly after purchase simulation to fulfill complete functionality) */}
      {hasCompletedPurchase && (
        <section id="delivery-vault-dashboard" className="bg-white border-y-2 border-brand-gold px-5 py-8">
          <div className="max-w-lg mx-auto space-y-5">
            <div className="text-center space-y-2">
              <span className="bg-brand-gold text-brand-navy font-mono text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                UNLOCKED ACCESS VAULT
              </span>
              <h3 className="font-display text-xl font-bold text-brand-navy">Your parenting resources are ready</h3>
              <p className="text-xs text-brand-navy/70">
                A copy of these PDFs has been routed to <strong>{buyerEmail}</strong>. You can also download them directly below:
              </p>
            </div>

            <div className="space-y-2.5">
              {BOOKS.map((book) => (
                <div key={book.id} className="bg-white rounded-xl p-3.5 border border-brand-gold/20 flex items-center justify-between shadow-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-14 bg-gradient-to-br from-brand-gold to-brand-navy rounded-xs flex items-center justify-center text-white shrink-0 shadow-xxs">
                      <Cpu className="w-5 h-5 text-brand-navy" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-brand-navy">{book.title}</h4>
                      <p className="text-[10px] text-brand-navy/60 font-sans italic">{book.isBonus ? 'Bonus Companion File' : 'Official Primary Guide'}</p>
                    </div>
                  </div>
                  <a
                    id={`active-direct-download-${book.id}`}
                    href={`data:text/plain;charset=utf-8,${encodeURIComponent(`Simulated Content for: ${book.title}. Detailed parenting chapters compiled for learning.`)}`}
                    download={`${book.title.replace(/\s+/g, '_')}_SecureAccess.pdf`}
                    className="bg-brand-gold hover:bg-[#C9A95F] text-brand-navy px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Download className="w-3.5 h-3.5 text-brand-navy" />
                    <span>PDF</span>
                  </a>
                </div>
              ))}
            </div>

            <div className="p-4 bg-brand-cream border border-brand-teal/10 rounded-xl space-y-2 text-xs">
              <span className="font-bold text-brand-teal block">💡 Quick Parenting Tip:</span>
              <p className="text-brand-navy/80">
                Start with <strong>The Parenting AI (Main Guide), Chapter 2</strong>. It outlines a beautiful conversational safeguard to talk to your kids about cyber trust, which builds immediate alignment before setting up tech locks from the Safe Home guide.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* SECTION 2: THE PAIN POINT */}
      <section className="bg-brand-navy text-white px-5 py-12 md:py-20">
        <div className="max-w-xl mx-auto space-y-8">
          <div className="space-y-3 text-center md:text-left">
            <span className="inline-block px-3 py-1 bg-brand-coral/10 text-brand-coral text-xs font-bold uppercase tracking-widest rounded-md">
              THE REALITY NO ONE TALKS ABOUT
            </span>
            <h2 className="font-display text-2xl md:text-4xl font-bold leading-tight">
              Your child already lives in an AI world.<br/>
              <span className="text-brand-coral italic">Do you understand it?</span>
            </h2>
          </div>

          {/* Dilemma Bento Cards */}
          <div className="grid grid-cols-1 gap-4 font-sans">
            <div className="bg-[#11274c] border border-white/10 rounded-xl p-5 flex gap-4 items-start hover:border-brand-coral/30 transition-colors">
              <div className="w-10 h-10 rounded-full bg-brand-coral/10 text-brand-coral flex items-center justify-center shrink-0">
                <Smartphone className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-brand-coral">COGNITIVE IMPACT & CURIOSITY</span>
                <p className="text-sm font-semibold text-white">Smart Speakers vs. Real Life Questions</p>
                <p className="text-xs text-white/70 leading-relaxed">
                  Your 8-year-old is asking smart speakers complex questions about life, and you aren't sure how the algorithm shapes their daily worldview.
                </p>
              </div>
            </div>

            <div className="bg-[#11274c] border border-white/10 rounded-xl p-5 flex gap-4 items-start hover:border-brand-coral/30 transition-colors">
              <div className="w-10 h-10 rounded-full bg-brand-coral/10 text-brand-coral flex items-center justify-center shrink-0">
                <Cpu className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-brand-coral">EDUCATION & CHEATING DILEMMA</span>
                <p className="text-sm font-semibold text-white">Homework Automated by Chat Generative Bots</p>
                <p className="text-xs text-white/70 leading-relaxed">
                  Your teenager uses platforms like ChatGPT or Snapchat AI bots to compile homework, and you wonder: <em>are they learning anything, or is it cutting off critical reasoning?</em>
                </p>
              </div>
            </div>

            <div className="bg-[#11274c] border border-white/10 rounded-xl p-5 flex gap-4 items-start hover:border-brand-coral/30 transition-colors">
              <div className="w-10 h-10 rounded-full bg-brand-coral/10 text-brand-coral flex items-center justify-center shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-brand-coral">DIGITAL SAFETY & THREATS</span>
                <p className="text-sm font-semibold text-white">Synthetic Scams & Deepfake Scrapes</p>
                <p className="text-xs text-white/70 leading-relaxed">
                  You see news about deepfakes and vocal cloning fraud, worrying about how to protect family photographs and keep your child's digital identity safe from scraping.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/5 border-l-4 border-brand-coral p-4 rounded-r-xl">
            <p className="text-xs text-white/85 leading-relaxed">
              <strong>The truth is, school textbooks don't have answers for this.</strong> You can't just tell children to "stay off screens." Technology is changing how they think, write, and play from age five onwards.
            </p>
          </div>

          <div className="pt-4 border-t border-white/10 text-center md:text-left">
            <p className="font-display text-lg text-brand-coral italic font-medium">
              "You're not behind. You just need the right guide."
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 3: THE DREAM STATE */}
      <section className="bg-brand-cream px-5 py-12 md:py-20 border-b border-brand-teal/10">
        <div className="max-w-xl mx-auto space-y-6">
          <h2 className="font-display text-2xl md:text-4xl font-bold leading-tight text-brand-navy">
            What if you could raise a child who...
          </h2>

          <ul className="space-y-3">
            {[
              "Understands AI better than most adults",
              "Knows how to stay safe online without being scared",
              "Uses technology as a creative tool, not a mindless crutch",
              "Thinks critically and solves real-world domestic problems",
              "Has the habits of children raised in the world's most successful families"
            ].map((title, index) => (
              <li key={index} className="flex gap-3 items-center bg-white p-4 rounded-xl border border-brand-slate/15 shadow-xs">
                <div className="w-5 h-5 rounded-full bg-brand-navy/10 text-brand-navy flex items-center justify-center shrink-0">
                  <CheckCircle className="w-4 h-4 text-brand-navy" />
                </div>
                <h4 className="font-sans text-sm font-bold text-brand-navy">{title}</h4>
              </li>
            ))}
          </ul>

          <p className="text-sm italic font-display text-brand-slate font-semibold text-center pt-3">
            "This bundle gives you everything you need to make it happen."
          </p>
        </div>
      </section>

      {/* SECTION 4: WHAT YOU'RE GETTING (BUNDLE VIEW WITH CTA #2) */}
      <section className="bg-brand-cream px-5 py-12 md:py-20 border-b border-brand-slate/15">
        <div className="max-w-xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-brand-slate font-sans block">
              THE COMPLETE BUNDLE
            </span>
            <h2 className="font-display text-2xl md:text-4xl font-bold text-brand-navy font-sans">
              Here’s everything inside
            </h2>
          </div>

          <div className="space-y-6">
            {BOOKS.map((book) => (
              <div 
                key={book.id}
                className="bg-white rounded-2xl p-5 border border-brand-slate/15 flex flex-col md:flex-row gap-5 items-center md:items-start transition-all hover:shadow-xs"
              >
                {/* Book Frame left */}
                <div className="shrink-0">
                  <BookMockup 
                    title={book.title}
                    subtitle={book.subtitle}
                    isBonus={book.isBonus}
                    badge={book.badge}
                    gradient={book.covers}
                    size="md"
                    onClickPreview={() => handleOpenChapters(book)}
                  />
                </div>

                {/* Info Text Right */}
                <div className="flex-1 space-y-3 font-sans">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base font-extrabold text-brand-navy">{book.title}</h3>
                      {book.isBonus && (
                        <span className="bg-brand-gold/15 text-brand-coral font-bold text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-sm">
                          FREE BONUS
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-brand-teal font-semibold italic">{book.subtitle}</p>
                  </div>

                  <ul className="space-y-2">
                    {book.bullets.map((bullet, idx) => (
                      <li key={idx} className="flex gap-2 items-start text-xs text-brand-navy/85">
                        <span className="text-brand-teal font-bold shrink-0">•</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>

                  {!book.isBonus && book.chaptersPreview && (
                    <button
                      id={`btn-outline-trigger-${book.id}`}
                      onClick={() => handleOpenChapters(book)}
                      className="text-[11px] font-bold text-brand-teal hover:underline flex items-center gap-1 cursor-pointer pt-1"
                    >
                      <span>Click to preview sample dialogue & chapter outline</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Connect statement */}
          <div className="p-4 bg-brand-light-teal/30 rounded-xl border border-brand-teal/10 text-center font-sans space-y-1">
            <p className="text-xs text-brand-teal font-bold font-display uppercase tracking-wider">
              "This bundle covers it all"
            </p>
            <p className="text-[11px] text-brand-navy/70">
              From devices setup to household psychology—delivered in unified non-tech language.
            </p>
          </div>

          {/* CTA Button 2 placed after Bundle */}
          <div className="space-y-3 pt-3">
            <button
              id="cta-bundle-access"
              onClick={handleScrollToPricing}
              className="w-full bg-brand-gold hover:bg-[#C9A95F] text-brand-navy font-sans font-extrabold text-base py-4 px-6 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer border border-brand-gold/30"
            >
              <span>GET INSTANT ACCESS →</span>
            </button>
            <p className="text-center text-[11px] text-brand-navy/55 font-sans">
              Instant download • Read on phone, tablet, or laptop. No subscription required.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 5: TRUST & CREDIBILITY */}
      <section className="bg-brand-cream px-5 py-12 border-b border-brand-slate/15">
        <div className="max-w-xl mx-auto space-y-8">
          
          {/* Trust badges row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { label: 'Instant Download', detail: 'Received as safe PDFs in 60 seconds' },
              { label: 'Written for Indian Families', detail: 'Cultural context, setup & board references' },
              { label: 'No Jargon, No Coding', detail: 'Perfect even for absolute non-tech parents' }
            ].map((badge, idx) => (
              <div key={idx} className="bg-white p-3.5 rounded-xl border border-brand-slate/15 text-center space-y-1.5 shadow-xs">
                <div className="w-7 h-7 mx-auto rounded-full bg-brand-navy/10 text-brand-navy flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 text-brand-navy" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-brand-navy font-sans leading-tight">{badge.label}</h4>
                  <p className="text-[9px] text-brand-navy/60 font-sans leading-tight mt-0.5">{badge.detail}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Testimonials stack */}
          <div className="space-y-4">
            <div className="text-center">
              <div className="flex justify-center text-brand-gold h-5 mb-1.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current animate-pulse" />
                ))}
              </div>
              <h3 className="font-display text-lg font-bold text-brand-navy">What Other Indian Parents Are Saying</h3>
            </div>

            <div className="space-y-4 font-sans">
              {TESTIMONIALS.map((test) => (
                <div key={test.id} className="bg-white rounded-xl p-4.5 border border-brand-slate/15 shadow-xs space-y-3 relative animate-fadeIn">
                  <span className="absolute top-4 right-4 text-brand-slate/15">
                    <Quote className="w-10 h-10 transform scale-x-[-1] text-brand-slate" />
                  </span>
                  
                  <p className="text-xs text-brand-navy/85 italic leading-relaxed relative z-10 select-none">
                    "{test.comment}"
                  </p>

                  <div className="flex items-center justify-between pt-2.5 border-t border-brand-slate/10 text-[11px] text-brand-slate font-sans relative z-10">
                    <div>
                      <strong className="text-brand-navy font-semibold">{test.name}</strong> 
                      <span className="mx-1">•</span> 
                      <span>{test.role}</span>
                    </div>
                    <strong>{test.location}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: WHO IS THIS FOR */}
      <section className="bg-brand-cream px-5 py-12 md:py-20 border-b border-brand-teal/15">
        <div className="max-w-xl mx-auto space-y-6">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-brand-navy text-center md:text-left leading-tight">
            This guide is for you if...
          </h2>

          <div className="space-y-3 font-sans">
            {[
              'You’re a parent who wants to understand and discuss AI with children, but feels overwhelmed by raw tech instructions.',
              'You worry about your kid’s continuous screen exposure, deepfakes, bad habits, and want concrete, safe boundaries.',
              'You want to raise a child who handles creative prompt intelligence, preparation, and is future-ready for automated workplaces.',
              'You are looking for quick practical walkthroughs (step-by-step parent locks) rather than theoretical lectures.',
              'You are an Indian parent navigating a curriculum paradigm that changes much faster than local school board revisions.'
            ].map((text, idx) => (
              <div key={idx} className="bg-white/60 p-4 rounded-xl border border-brand-teal/5 shadow-xxs flex gap-3 items-start">
                <div className="w-5 h-5 rounded-full bg-brand-teal/10 text-brand-teal flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle className="w-3.5 h-3.5" />
                </div>
                <p className="text-xs text-brand-navy/85 leading-relaxed font-sans">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 7: PRICING & VALUE STACK & CTA #3 */}
      <section id="pricing-and-offer-section" className="bg-brand-navy text-white px-5 py-12 md:py-20">
        <div className="max-w-xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-brand-coral font-sans block">
              SPECIAL LAUNCH PRICE OFFER
            </span>
            <h2 className="font-display text-2xl md:text-4xl font-bold leading-tight text-white">
              Get all three premium guides today
            </h2>
          </div>

          {/* Value Stack Board */}
          <div className="bg-[#11274c] rounded-2xl border border-white/10 overflow-hidden shadow-xl font-sans">
            <div className="p-5 border-b border-white/10 bg-brand-navy">
              <h4 className="text-xs uppercase tracking-widest text-brand-gold font-bold">Standard Value Stack</h4>
            </div>

            <div className="p-5 space-y-4">
              <div className="flex justify-between text-xs text-white/90">
                <div className="space-y-0.5">
                  <span className="font-bold">The Parenting AI (Primary Guide)</span>
                  <p className="text-[10px] text-white/60">Practical future readiness and safety framework</p>
                </div>
                <span className="line-through text-white/50">Rs. 499</span>
              </div>

              <div className="flex justify-between text-xs text-white/90">
                <div className="space-y-0.5">
                  <span className="font-bold text-brand-gold">Bonus #1: The AI-Safe Home</span>
                  <p className="text-[10px] text-brand-gold/80">Step-by-step parental controls & device setups</p>
                </div>
                <span className="line-through text-white/50">Rs. 299</span>
              </div>

              <div className="flex justify-between text-xs text-white/90">
                <div className="space-y-0.5">
                  <span className="font-bold text-brand-gold">Bonus #2: The 1% Parent</span>
                  <p className="text-[10px] text-brand-gold/80">21 strategic habits from global leader families</p>
                </div>
                <span className="line-through text-white/50">Rs. 299</span>
              </div>

              <div className="pt-4 border-t border-white/10 space-y-3">
                <div className="flex justify-between text-xs text-white/70">
                  <span>Total Standard Value:</span>
                  <span className="line-through font-semibold">Rs. 1,097</span>
                </div>
                
                <div className="flex justify-between items-center bg-[#18396c]/60 p-4 rounded-xl border border-white/20">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-white block">TODAY'S SPECIAL DISPATCH</span>
                    <span className="text-lg font-bold text-white/90">Complete Bundle Price</span>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-white select-all">Rs. 299</span>
                    <p className="text-[9px] text-white/60 font-mono italic">one-time payment</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Core CTA Pricing Button */}
          <div className="space-y-3 pt-2">
            <button
              id="cta-pricing-down"
              onClick={handleOpenCheckout}
              className="w-full bg-brand-gold hover:bg-[#C9A95F] text-brand-navy font-sans font-extrabold text-base py-4 py-4.5 px-6 rounded-lg transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.01] cursor-pointer flex items-center justify-center gap-2 border border-brand-gold/30"
            >
              <span>YES, I WANT THE BUNDLE →</span>
            </button>
            <p className="text-center text-[11px] text-white/60 font-sans">
              Instant digital download. Read on any phone, tablet, smartphone, or laptop.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 8: FAQ */}
      <section className="bg-brand-cream px-5 py-12 md:py-20 border-b border-brand-teal/15">
        <div className="max-w-xl mx-auto space-y-6">
          <div className="text-center space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-brand-teal font-sans">
              COMMON QUESTIONS
            </span>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-brand-navy">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3.5 pt-3">
            {FAQS.map((faq) => {
              const isExpanded = expandedFaq === faq.id;
              return (
                <div 
                  key={faq.id}
                  className="bg-white rounded-xl border border-brand-teal/10 shadow-xs overflow-hidden"
                >
                  <button
                    id={`faq-btn-${faq.id}`}
                    onClick={() => handleToggleFaq(faq.id)}
                    className="w-full text-left p-4 flex items-center justify-between gap-4 font-sans focus:outline-hidden hover:bg-neutral-50/50 cursor-pointer"
                  >
                    <span className="text-xs md:text-sm font-bold text-brand-navy">
                      {faq.question}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-brand-teal shrink-0 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                  </button>

                  <div 
                    className="overflow-hidden transition-all duration-300 ease-in-out"
                    style={{ maxHeight: isExpanded ? '300px' : '0px' }}
                  >
                    <div className="p-4 pt-0 border-t border-neutral-100 text-xs text-brand-navy/70 leading-relaxed font-sans bg-brand-cream/10">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Thin orange divider specified in PDF section 8 instructions */}
          <div className="w-full h-[1px] bg-brand-coral/45 my-8" />
        </div>
      </section>

      {/* SECTION 9: CLOSING STATEMENT */}
      <section className="bg-brand-navy text-white px-5 py-12 md:py-16 text-center">
        <div className="max-w-xl mx-auto space-y-6">
          <p className="font-display text-xl md:text-2xl text-brand-cream italic font-normal leading-relaxed">
            "The best time to prepare your child for the future was yesterday. The second best time is right now."
          </p>

          <button
            id="cta-bottom-closure"
            onClick={handleOpenCheckout}
            className="inline-flex w-full bg-brand-gold hover:bg-[#C9A95F] text-brand-navy font-sans font-extrabold text-base py-4 px-6 rounded-lg transition-all shadow-md hover:shadow-lg cursor-pointer items-center justify-center gap-2 border border-brand-gold/30"
          >
            <span>DOWNLOAD BUNDLE NOW FOR Rs. 299</span>
          </button>

          <div className="pt-6 space-y-2 border-t border-white/10 text-[11px] text-brand-cream/60 font-sans">
            <p>Direct lifetime support email & updates coordinate:</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-xs font-semibold text-brand-teal/90">
              <a href="mailto:support@theparentingai.com" className="flex items-center gap-1.5 hover:underline">
                <Mail className="w-4 h-4 text-brand-teal" />
                <span>support@theparentingai.com</span>
              </a>
              <a href="https://instagram.com/theparenting.ai" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:underline">
                <Instagram className="w-4 h-4 text-brand-teal" />
                <span>@theparenting.ai</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* INTERACTIVE MODALS */}
      <CheckoutModal 
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onSuccess={handlePurchaseSuccess}
      />

      {isChaptersOpen && selectedBookForPreview && (
        <ChaptersModal 
          isOpen={isChaptersOpen}
          onClose={() => setIsChaptersOpen(false)}
          bookTitle={selectedBookForPreview.title}
          chapters={selectedBookForPreview.chaptersPreview}
        />
      )}
    </div>
  );
}
