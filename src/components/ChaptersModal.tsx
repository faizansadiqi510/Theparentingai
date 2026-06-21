import React from 'react';
import { X, Sparkles, AlertCircle, Quote } from 'lucide-react';

interface ChaptersModalProps {
  isOpen: boolean;
  onClose: () => void;
  chapters?: { title: string; bullets: string[] }[];
  bookTitle: string;
}

export default function ChaptersModal({ isOpen, onClose, chapters, bookTitle }: ChaptersModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-brand-navy/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        id="chapters-dialog-box"
        className="bg-brand-cream rounded-2xl shadow-xl max-w-lg w-full overflow-hidden border border-brand-teal/20"
      >
        {/* Header */}
        <div className="p-5 bg-brand-teal text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-brand-gold animate-pulse" />
            <div>
              <h3 className="font-display text-sm md:text-base font-bold">Interactive Preview</h3>
              <p className="text-[10px] text-brand-cream/80 font-mono uppercase tracking-wider">{bookTitle}</p>
            </div>
          </div>
          <button 
            id="chapters-close-btn"
            onClick={onClose} 
            className="p-1 rounded-full hover:bg-black/10 text-brand-cream cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dynamic preview content */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          <div className="text-xs text-brand-navy/70 leading-relaxed font-sans space-y-2">
            <p className="font-semibold text-brand-navy font-display text-sm">
              Here is a glimpse of what Indian families are reading inside this chapter outline:
            </p>
            <p>
              This isn't generic theoretical explanation. It offers exact phrases to use, router configurations, and daily routines tailored to Indian households.
            </p>
          </div>

          <div className="space-y-4">
            {chapters?.map((chapter, i) => (
              <div 
                key={i} 
                className="bg-white p-4.5 rounded-xl border border-brand-teal/10 shadow-xxs space-y-3"
              >
                <h4 className="font-display text-sm font-bold text-brand-teal">
                  {chapter.title}
                </h4>
                <ul className="space-y-2 text-xs font-sans text-brand-navy/85">
                  {chapter.bullets.map((bullet, bulletIdx) => (
                    <li key={bulletIdx} className="flex items-start gap-2">
                      <span className="text-brand-gold mt-1 shrink-0">•</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Practical Dialogue script example */}
          <div className="p-4 bg-brand-light-teal/35 rounded-xl border border-brand-teal/15 space-y-2.5">
            <span className="text-[9px] uppercase tracking-wider font-bold text-brand-teal flex items-center gap-1.5 font-sans">
              <AlertCircle className="w-3.5 h-3.5" />
              Parent-Child Script Highlight: Talking about Deepfakes
            </span>
            <div className="text-xs italic space-y-1.5 text-brand-navy/80 font-sans border-l-2 border-brand-teal pl-3">
              <p>
                <strong>You: </strong> "Have you seen those videos where someone's face changes into actor Shah Rukh Khan or a video-game character?"
              </p>
              <p>
                <strong>Child: </strong> "Yes, on Reels/YouTube Shorts! They look so real."
              </p>
              <p>
                <strong>You: </strong> "That is called AI Generative Deepfake. It's like magic tricks, but on screens. This is why if we see any strange video or get a call asking for money in a friend's voice, our first rule is to stop, take a deep breath, and check with each other in person first."
              </p>
            </div>
            <p className="text-[10px] text-brand-navy/55 leading-relaxed font-sans pt-1">
              *The guide contains 12 such direct domestic dialogues to discuss screen control, cyber bullying, and smart AI prompts without causing family arguments or digital paralysis.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-brand-navy text-center border-t border-brand-teal/10">
          <p className="text-[11px] text-brand-cream/70 font-sans">
            Ready to read all 3 PDF guides? Instantly delivered on purchase of Rs. 299.
          </p>
        </div>
      </div>
    </div>
  );
}
