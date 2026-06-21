import React from 'react';
import { BookOpen, ShieldCheck, Sparkles, Award } from 'lucide-react';
// @ts-ignore
import mainBookCover from '../assets/images/parenting_ai_full_cover_1782056840495.jpg';
// @ts-ignore
import aiSafeHomeCover from '../assets/images/ai_safe_home_cover_1782058132462.jpg';
// @ts-ignore
import onePercentParentCover from '../assets/images/one_percent_parent_cover_1782063243363.jpg';

interface BookMockupProps {
  title: string;
  subtitle: string;
  isBonus?: boolean;
  badge?: string;
  gradient?: { bgGradient: string; iconColor: string };
  size?: 'sm' | 'md' | 'lg';
  highlightText?: string;
  onClickPreview?: () => void;
}

export default function BookMockup({
  title,
  subtitle,
  isBonus = false,
  badge,
  gradient = { bgGradient: 'from-brand-teal to-brand-navy', iconColor: 'text-brand-gold' },
  size = 'md',
  highlightText,
  onClickPreview
}: BookMockupProps) {
  const sizeClasses = {
    sm: {
      container: 'w-[140px] h-[200px]',
      title: 'text-xs',
      subtitle: 'text-[9px]',
      badgeText: 'text-[8px] px-1.5 py-0.5',
      icon: 'w-5 h-5',
    },
    md: {
      container: 'w-[185px] h-[260px]',
      title: 'text-sm md:text-base',
      subtitle: 'text-[10px] md:text-xs',
      badgeText: 'text-[9px] px-2 py-1',
      icon: 'w-7 h-7',
    },
    lg: {
      container: 'w-[230px] h-[320px]',
      title: 'text-lg md:text-xl',
      subtitle: 'text-xs md:text-sm',
      badgeText: 'text-[10px] px-2.5 py-1',
      icon: 'w-10 h-10',
    }
  }[size];

  return (
    <div className="relative group perspective-[1200px] flex flex-col items-center">
      {/* 3D Book Container */}
      <div 
        id={`mockup-${title.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
        className={`relative ${sizeClasses.container} duration-500 ease-out transition-transform [transform-style:preserve-3d] group-hover:[transform:rotateY(-15deg)_rotateX(5deg)] shadow-[15px_15px_25px_rgba(11,29,58,0.15)] rounded-r-lg`}
      >
        {/* Soft Gold Badge / FREE BONUS */}
        {badge && (
          <div className="absolute -top-3 -right-3 z-30 transform rotate-12">
            <span className="bg-brand-gold text-brand-navy font-semibold uppercase tracking-wider rounded-md shadow-md text-[10px] px-2 py-1 flex items-center gap-1 border border-white">
              <Award className="w-3.5 h-3.5 animate-pulse" />
              {badge}
            </span>
          </div>
        )}

        {/* Book Spine Edge Shadow */}
        <div className="absolute left-0 top-0 bottom-0 w-3 bg-black/30 z-20 rounded-l-sm" />
        <div className="absolute left-[3px] top-0 bottom-0 w-[2px] bg-white/20 z-20" />

        {/* Dynamic Cover Gradient background or Bespoke Uploaded Design */}
        {title === "The Parenting AI" ? (
          <div className="absolute inset-0 bg-[#FDF8F0] rounded-r-lg border-y border-r border-[#0B1D3A]/15 z-10 overflow-hidden select-none">
            <img 
              src={mainBookCover} 
              alt="The Parenting AI Full Book Cover"
              className="w-full h-full object-cover pointer-events-none"
              referrerPolicy="no-referrer"
            />
          </div>
        ) : title === "The AI-Safe Home" ? (
          <div className="absolute inset-0 bg-[#FDF8F0] rounded-r-lg border-y border-r border-[#0B1D3A]/15 z-10 overflow-hidden select-none">
            <img 
              src={aiSafeHomeCover} 
              alt="The AI-Safe Home Book Cover"
              className="w-full h-full object-cover pointer-events-none"
              referrerPolicy="no-referrer"
            />
          </div>
        ) : title === "The 1% Parent" ? (
          <div className="absolute inset-0 bg-[#FDF8F0] rounded-r-lg border-y border-r border-[#0B1D3A]/15 z-10 overflow-hidden select-none">
            <img 
              src={onePercentParentCover} 
              alt="The 1% Parent Book Cover"
              className="w-full h-full object-cover pointer-events-none"
              referrerPolicy="no-referrer"
            />
          </div>
        ) : (
          <div className={`absolute inset-0 bg-gradient-to-br ${gradient.bgGradient} text-white flex flex-col justify-between p-4 md:p-5 rounded-r-lg border-y border-r border-white/15 z-10 overflow-hidden`}>
            {/* Cover decorative border */}
            <div className="absolute inset-2 border border-white/10 rounded-md pointer-events-none" />
            
            {/* Content Header */}
            <div className="z-10 flex items-center justify-between">
              <span className="text-[9px] uppercase tracking-widest font-sans opacity-80 text-brand-cream font-medium">
                THE PARENTING AI
              </span>
              {isBonus ? (
                <ShieldCheck className={`w-5 h-5 ${gradient.iconColor}`} />
              ) : (
                <Sparkles className={`w-5 h-5 ${gradient.iconColor}`} />
              )}
            </div>

            {/* Book Title */}
            <div className="z-10 my-auto text-center px-1">
              <h4 className={`font-display ${sizeClasses.title} font-bold leading-tight text-brand-cream group-hover:text-white transition-colors`}>
                {title}
              </h4>
              <div className="w-12 h-[1.5px] bg-brand-gold mx-auto my-3 opacity-60" />
              <p className={`${sizeClasses.subtitle} font-sans italic opacity-90 line-clamp-4 leading-relaxed`}>
                {subtitle}
              </p>
            </div>

            {/* Cover Footer */}
            <div className="z-10 flex items-center justify-between text-white/70 text-[9px] border-t border-white/10 pt-2 font-mono">
              <span>VOL. 3 (2026/27)</span>
              <span>PDF GUIDE</span>
            </div>
          </div>
        )}

        {/* Realistic Book Pages Stack (Edge thickness) */}
        <div className="absolute top-[2px] bottom-[2px] -right-[4px] w-[5px] bg-neutral-200/90 z-0 rounded-r-sm shadow-inner overflow-hidden border-y border-neutral-300">
          <div className="w-full h-full bg-[linear-gradient(to_right,rgba(0,0,0,0.03)_2px,rgba(255,255,255,0.8)_3px)] repeating-linear-grid" />
        </div>
      </div>

      {highlightText && (
        <span className="mt-4 text-xs font-medium font-sans text-brand-navy/60 group-hover:text-brand-teal transition-colors flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5" />
          {highlightText}
        </span>
      )}

      {/* Chapter preview trigger if available */}
      {onClickPreview && (
        <button
          id={`btn-preview-${title.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
          onClick={(e) => {
            e.stopPropagation();
            onClickPreview();
          }}
          className="mt-3 text-xs bg-brand-cream hover:bg-brand-light-teal text-brand-teal font-semibold px-3 py-1 rounded-full border border-brand-teal/20 transition-all flex items-center gap-1 group/btn shadow-xs cursor-pointer"
        >
          <span>Look Inside</span>
          <Sparkles className="w-3 h-3 group-hover/btn:rotate-12 duration-300" />
        </button>
      )}
    </div>
  );
}
