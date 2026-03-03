
export interface QuoteItem {
  id: string;
  category: string;
  name: string;
  description?: string; 
  info?: string; // Guidance for the user
  unitPrice: number;
  quantity: number;
  isPerGuest: boolean; 
  minPrice?: number;
  maxPrice?: number;
}

export interface AmoreService {
  id: string;
  name: string;
  currentPrice: number;
  minPrice: number;
  maxPrice: number;
  isSelected: boolean;
  quantity?: number; // Added for per-table/unit items
  description?: string;
  info?: Record<string, string>; // Multi-lang guidance
}

export interface MochikomiItem {
  id: string;
  name: string;
  price: number;
  source: 'Venue Website' | 'Industry Estimation' | 'Manual Input';
  isSelected: boolean;
}

export interface VenueInfo {
  name: string;
  hideName: boolean;
  guestCount: number;
  taxRate: number; 
  imageUrl?: string; 
  minimumUsageFee?: number; 
  targetBudget?: number; 
}

export interface VenueSuggestion {
  id: string;
  name: string;
  location: string;
  avgPricePerPerson: number;
  description: Record<string, string>;
  style: string;
}

export enum QuoteCategory {
  VENUE_FEE = 'Venue & Facilities',
  FOOD_DRINK = 'Food & Beverage',
  ATTIRE_BEAUTY = 'Attire & Beauty',
  FLORAL_DECOR = 'Floral & Decoration',
  PHOTO_VIDEO = 'Photography & Videography',
  ENTERTAINMENT = 'Entertainment & Sound',
  OTHER = 'Other Services',
}

export type TabType = 'budget' | 'date' | 'venue' | 'amore' | 'options' | 'preview';
