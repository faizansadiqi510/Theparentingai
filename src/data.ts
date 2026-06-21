import { BookDetail, FAQItem, Testimonial } from './types';

export const BOOKS: BookDetail[] = [
  {
    id: 'main-guide',
    title: 'The Parenting AI',
    subtitle: 'Practical Guidance for Raising Calm, Curious & Confident Kids in a Changing World',
    isBonus: false,
    originalPrice: 499,
    salePrice: 299,
    covers: {
      bgGradient: 'from-brand-teal via-brand-teal to-brand-navy',
      iconColor: 'text-brand-gold'
    },
    coversHighlight: 'Warm Teal & Deep Navy Premium Cover',
    bullets: [
      'Understanding AI simply — no programming language, no high-tech coding, no complex jargon.',
      'How to talk to your child (ages 4-17) about AI without fear, fostering critical thinking instead.',
      'Protecting children from modern digital threats (deepfakes, voice-cloning scams, identity theft, and fake news).',
      'Using AI as an organic learning buddy to boost school grades and curiosity instead of dynamic cheating.',
      'Your step-by-step 30-Day Family AI Roadmap including simple weekend exercises for the whole family.'
    ],
    chaptersPreview: [
      {
        title: 'Chapter 1: The Modern Playground',
        bullets: [
          'Why the AI world is changing faster than school curriculums.',
          'How to explain ChatGPT, Midjourney, and algorithms in everyday language.',
          'The 3 core questions every child should ask any AI system.'
        ]
      },
      {
        title: 'Chapter 2: Shields Up: Navigating Risks',
        bullets: [
          'The threat landscape: Deepfakes, synthetic voice clones, and social manipulation.',
          'Simple steps to protect family photos and identity from digital scraping.',
          'Custom age-by-age conversational scripts for safe boundaries.'
        ]
      },
      {
        title: 'Chapter 3: The Ultimate Learning Catalyst',
        bullets: [
          'Using AI as a personalized tutor for history, science, and math.',
          'Building active learning habits vs passive internet consumption.',
          'How to stop homework lazy-cheat, turning it into structured peer-review.'
        ]
      },
      {
        title: 'Chapter 4: Future Careers & Empathy',
        bullets: [
          'Which human skills will remain premium in the age of automation.',
          'The Power of Curiosity: Creating prompt habits that cultivate leadership.',
          'Weekly digital-detox rules that strengthen offline emotional grounding.'
        ]
      }
    ]
  },
  {
    id: 'bonus-1',
    title: 'The AI-Safe Home',
    subtitle: 'A Step-by-Step Setup Guide to Protect Your Child\'s Devices, Apps & Online World',
    isBonus: true,
    badge: 'FREE BONUS',
    originalPrice: 299,
    salePrice: 0,
    covers: {
      bgGradient: 'from-brand-navy to-[#153462]',
      iconColor: 'text-brand-teal'
    },
    coversHighlight: 'Bonus Guide #1',
    bullets: [
      'Parental lock setups on Android, iPhones, iPads, Windows/Mac laptops, and Android Smart TVs.',
      'App-by-app configuration wizards (foolproofing YouTube Kids, Instagram, WhatsApp, Roblox, and safe messaging).',
      'Setting up search protections, DNS ad-blockers, and anti-scam web shields at the home Wi-Fi router level.',
      'The Weekly Digital Check-In: A friendly 10-minute check-in script that enhances parental trust without policing.'
    ]
  },
  {
    id: 'bonus-2',
    title: 'The 1% Parent',
    subtitle: '21 Habits Elite Families Use to Raise Exceptional Kids',
    isBonus: true,
    badge: 'FREE BONUS',
    originalPrice: 299,
    salePrice: 0,
    covers: {
      bgGradient: 'from-[#6E48AA] to-[#9D50BB]',
      iconColor: 'text-brand-gold'
    },
    coversHighlight: 'Bonus Guide #2',
    bullets: [
      'Practical weekly habits inspired by families like the Obamas, Tatas, Nadellas, Kalam, and Nooyi.',
      'Weeks 1-7 (Thinking Child): Exercises for deep reasoning, structured questioning, and smart problem-solving.',
      'Weeks 8-14 (Confident Child): Habits for failure-tolerance, healthy screening balance, and digital safety confidence.',
      'Weeks 15-21 (Emotionally Strong Child): High empathy coaching, self-regulation rules, and staying grounded in family values.'
    ]
  }
];

export const FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'Do I need to know anything about technology to use this guide?',
    answer: 'Not at all. This guide was written specifically for parents with zero technical background. Everything is explained in simple, everyday language. If you can use WhatsApp, you can easily understand and utilize this guide.'
  },
  {
    id: 'faq-2',
    question: 'What age group is this for?',
    answer: 'The main guide covers ages 4 to 17 with age-specific explanations and family activities. The AI-Safe Home guide works for any age where your child first starts using any screen or device. The 1% Parent habits work from age 5 onwards.'
  },
  {
    id: 'faq-3',
    question: 'Is this only for Indian families?',
    answer: 'It is written specifically with Indian families in mind. The cultural examples, school context (CBSE/ICSE/State boards versus AI future), language style, and device setups are matched perfectly to Indian parent lifestyles. However, the core safety and learning principles work globally.'
  },
  {
    id: 'faq-4',
    question: 'How do I get the guides after purchase?',
    answer: 'Instantly! Right after your simulated payment completes of Rs. 299, you will receive a direct digital access panel. All three guides are delivered as high-quality, readable PDFs that you can view on your phone, tablet, laptop, or print out.'
  },
  {
    id: 'faq-5',
    question: 'What if this doesn\'t help me?',
    answer: 'These guides are designed for action, packed with direct device setup screenshots and real parenting scripts. If you follow them, you see immediate alignment from week one. This is a practical, supportive reference, not a generic lecture.'
  },
  {
    id: 'faq-6',
    question: 'Is this just another parenting book?',
    answer: 'No, this is a hands-on protection package. Part 3 of the main guide alone acts as a literal walkthrough for locking devices. The 1% Parent gives you 1 concrete, actionable habit per week to build together. It’s an interactive system.'
  },
  {
    id: 'faq-7',
    question: 'Can I share this with my spouse or family?',
    answer: 'Absolutely. We highly encourage shared implementation! The 30-day family plan is designed so that both parents and kids can act as a team, building safe digital protective spaces together.'
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    name: 'Rajesh Krishnan',
    location: 'Bangalore',
    role: 'Father of an 11-year-old',
    rating: 5,
    comment: 'I was honestly anxious reading news about AI scams, voice clones, and homework copying. This guide gave me a step-by-step checklist to lock our household devices and, more importantly, started a continuous, open chat at our dining table about healthy tech.',
    date: 'June 2026'
  },
  {
    id: 'test-2',
    name: 'Priya Iyer',
    location: 'Mumbai',
    role: 'Mother of a 14-year-old',
    rating: 5,
    comment: 'No textbook lectures here. This reads exactly like a calm advice from a smart parent friend. Specially, the step-by-step YouTube and Instagram privacy setups saved me hours of confusing configurations. Really practical!',
    date: 'May 2026'
  },
  {
    id: 'test-3',
    name: 'Dr. Ashish Mehta',
    location: 'Delhi NCR',
    role: 'Father of twins (8 & 12 years)',
    rating: 5,
    comment: 'The 1% Parent habits are gold. My kids used to throw tantrums regarding screentime. We started implementing the Week 3 and 4 rituals, and it completely shifted their approach to tech — now they treat it like a creative tool, not a mindless pacifier.',
    date: 'June 2026'
  }
];
