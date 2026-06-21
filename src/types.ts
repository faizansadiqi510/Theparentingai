export interface BookDetail {
  id: string;
  title: string;
  subtitle: string;
  isBonus: boolean;
  badge?: string;
  originalPrice: number;
  salePrice: number;
  covers: {
    bgGradient: string;
    iconColor: string;
  };
  bullets: string[];
  coversHighlight?: string;
  chaptersPreview?: { title: string; bullets: string[] }[];
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  role: string;
  rating: number;
  comment: string;
  date: string;
}

export interface OrderState {
  email: string;
  parentName: string;
  phone: string;
  paymentMethod: 'upi' | 'card' | 'netbanking';
  paymentState: 'idle' | 'processing' | 'success' | 'failed';
  simulatedUPIId?: string;
  orderId?: string;
}
