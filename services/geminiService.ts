
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { QuoteItem, MochikomiItem } from "../types";

// Helper to compress and convert file to base64
export const fileToGenerativePart = async (file: File): Promise<{ inlineData: { data: string; mimeType: string } }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.src = e.target?.result as string;
    };

    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;
      // Increased from 800 to 1600 to improve OCR accuracy on text-heavy documents
      const maxDim = 1600; 

      if (width > height) {
        if (width > maxDim) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        }
      } else {
        if (height > maxDim) {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        // Quality 0.6 balances legibility with payload size
        const dataUrl = canvas.toDataURL('image/jpeg', 0.6);
        const base64Data = dataUrl.split(',')[1];
        resolve({
          inlineData: {
            data: base64Data,
            mimeType: 'image/jpeg',
          },
        });
      } else {
        reject(new Error("Canvas context failed"));
      }
    };

    reader.onerror = reject;
    img.onerror = reject;
    
    // Start reading
    reader.readAsDataURL(file);
  });
};

// Retry helper
const callWithRetry = async <T>(fn: () => Promise<T>, retries = 5, initialDelay = 1500): Promise<T> => {
  let lastError: unknown;
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (e: unknown) {
      console.warn(`API Attempt ${i + 1} failed:`, e);
      lastError = e;
      
      const code = e.status || e.error?.code || e.code;
      const statusText = e.statusText || e.error?.status || '';
      const message = e.message || e.error?.message || '';
      
      const isTransient = 
        code === 500 || 
        code === 503 || 
        code === 504 ||
        code === 429 || 
        statusText === 'UNAVAILABLE' || 
        statusText === 'UNKNOWN' ||
        (typeof message === 'string' && (
          message.includes('500') || 
          message.includes('503') || 
          message.includes('429') || 
          message.includes('xhr error') || 
          message.includes('Rpc failed') ||
          message.toLowerCase().includes('unavailable') ||
          message.toLowerCase().includes('too many requests') ||
          message.toLowerCase().includes('overloaded') ||
          message.toLowerCase().includes('deadline exceeded')
        ));
        
      if (isTransient && i < retries - 1) {
        const delay = initialDelay * Math.pow(2, i); // Exponential backoff
        const jitter = Math.random() * 500;
        await new Promise(resolve => setTimeout(resolve, delay + jitter));
        continue;
      }
      break; 
    }
  }
  throw lastError;
};

// Helper to clean JSON string from Markdown fences or accidental text
const cleanJsonResponse = (text: string): string => {
  let cleaned = text.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }
  return cleaned;
};

export const parseVenuePackage = async (
  files: File[], 
  textContext: string,
  currentGuestCount: number,
  venueNameHint?: string
): Promise<{ items: QuoteItem[], venueName?: string }> => {
  
  // Initialize ai right before use to ensure it uses the latest process.env.API_KEY
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = "gemini-3-flash-preview";
  const imageParts = await Promise.all(files.map(fileToGenerativePart));

  const prompt = `
    You are an expert wedding planner assistant for Amore Wedding Tokyo.
    
    Your task is to analyze the provided wedding venue package information and extract a structured cost breakdown.
    The input may be images of a quotation/plan or text/URL describing the plan.
    
    Context:
    - Target Guest Count: ${currentGuestCount}
    - Venue Name Hint: ${venueNameHint ? venueNameHint : "Not provided (extract if visible)"}
    
    If the text input contains a URL, use the Google Search tool to find the official wedding plans and pricing for that specific venue.
    
    Please extract the following:
    1. The name of the Venue (only if not provided in hint).
    2. A list of ALL line items included in the cost. Be thorough.
    
    CRITICAL INSTRUCTION FOR DETAIL PRESERVATION:
    - Capture every single line item visible in the image or described in the text.
    - Do NOT simplify item names. Preserve specific details (e.g., "Snap Photography (300 cuts)", "French Full Course 'Elegance'", "Free drink plan (Alcohol included)").
    - Extract a 'description' for each item if there are extra notes.
    
    CRITICAL INSTRUCTION FOR PACKAGE PLANS:
    If the document provides a "Plan Price" or "Package Price" for a specific number of guests:
    1. Calculate the 'Unit Price' by dividing the Total Plan Price by the number of guests INCLUDED IN THE PLAN.
    2. Set 'isPerGuest' to true.
    3. Set 'Quantity' to ${currentGuestCount}.
    4. Name the item "Base Plan (Calculated per person)".
    5. In the 'description', clearly state the original plan details (e.g. "Original Plan: 1,200,000 JPY for 40 guests").
    
    For other items:
    - Determine the Category (Venue & Facilities, Food & Beverage, Attire & Beauty, Floral & Decoration, Photography & Videography, Entertainment & Sound, Other Services).
    - Determine Unit Price. 
      - If it's a fixed fee, Unit Price is the price, Quantity is 1, isPerGuest is false.
      - If it's a per-person fee, Unit Price is the price, Quantity is ${currentGuestCount}, isPerGuest is true.
      - If the item is "Included" in the plan, set Unit Price to 0.
    
    Return the response as a valid JSON object only.
  `;

  const response = await callWithRetry<GenerateContentResponse>(() => ai.models.generateContent({
    model: model,
    contents: {
      parts: [
        ...imageParts,
        { text: prompt + (textContext ? `\n\nAdditional Context/URL:\n${textContext}` : "") }
      ]
    },
    config: {
      thinkingConfig: { thinkingBudget: 0 },
      tools: [{ googleSearch: {} }], // Enabled to handle URLs in text input
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          venueName: { type: Type.STRING },
          items: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                category: { type: Type.STRING },
                name: { type: Type.STRING },
                description: { type: Type.STRING },
                unitPrice: { type: Type.NUMBER },
                quantity: { type: Type.NUMBER },
                isPerGuest: { type: Type.BOOLEAN },
              },
              required: ["category", "name", "unitPrice", "quantity", "isPerGuest"]
            }
          }
        }
      }
    }
  }));

  if (!response.text) {
    throw new Error("No response from AI");
  }

  let result;
  try {
    const cleanedText = cleanJsonResponse(response.text);
    result = JSON.parse(cleanedText);
  } catch {
    console.error("JSON Parse Error. Raw text snippet:", (response.text || "").substring(0, 500) + "...");
    throw new Error("Failed to parse the venue data. Please ensure the image is clear or try providing text details.");
  }
  
  const itemsWithIds: QuoteItem[] = (result.items || []).map((item: QuoteItem) => ({
    ...item,
    id: crypto.randomUUID(),
  }));

  return {
    items: itemsWithIds,
    venueName: result.venueName || "Unknown Venue"
  };
};

export const fetchMinimumFee = async (venueName: string): Promise<number | undefined> => {
  // Initialize ai right before use to ensure it uses the latest process.env.API_KEY
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = "gemini-3-flash-preview";
  const prompt = `
    Find the 'Saitei Riyou Ryoukin' (最低利用料金) or minimum spend requirement for holding a wedding at "${venueName}" in Japan.
    
    This is often a total contract amount or a minimum food/drink spend.
    Search for information on official venue sites, Wedding Park, Minna no Wedding, or Zexy.
    
    If you find multiple minimums for different days (e.g. Saturday vs weekday), provide the highest one found (usually Saturday peak).
    
    Return a JSON object with a single property 'minimumFee' as a number. 
    If not found, return null for that property.
  `;

  const response = await callWithRetry<GenerateContentResponse>(() => ai.models.generateContent({
    model: model,
    contents: { text: prompt },
    config: {
      thinkingConfig: { thinkingBudget: 0 },
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          minimumFee: { type: Type.NUMBER, nullable: true }
        }
      }
    }
  }));

  if (!response.text) return undefined;
  try {
    const res = JSON.parse(cleanJsonResponse(response.text));
    return res.minimumFee || undefined;
  } catch {
    return undefined;
  }
};

export const findMochikomiFees = async (venueName: string): Promise<MochikomiItem[]> => {
  // Initialize ai right before use to ensure it uses the latest process.env.API_KEY
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = "gemini-3-flash-preview";
  
  const prompt = `
    Find the wedding 'mochikomi' (bring-in/corkage) fees for the venue: "${venueName}" in Japan.
    
    Search for fees related to:
    1. Wedding Dress / Tuxedo
    2. Photographer / Videographer
    3. Hair & Makeup Artist
    4. Floral / Bouquet
    5. Hikidemono (Gifts/Favors)

    If you find specific fees on the venue's website or wedding review sites (like Wedding Park, Minna no Wedding), use those.
    If you CANNOT find specific fees for an item, provide a standard Tokyo industry estimation.
    
    Mark the source as "Venue Website" if found, or "Industry Estimation" if estimated.
    
    Return valid JSON only.
  `;

  const response = await callWithRetry<GenerateContentResponse>(() => ai.models.generateContent({
    model: model,
    contents: { text: prompt },
    config: {
      thinkingConfig: { thinkingBudget: 0 }, 
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          items: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                price: { type: Type.NUMBER },
                source: { type: Type.STRING, enum: ["Venue Website", "Industry Estimation"] }
              },
              required: ["name", "price", "source"]
            }
          }
        }
      }
    }
  }));

  if (!response.text) {
    throw new Error("No response from AI");
  }

  let result;
  try {
    const cleanedText = cleanJsonResponse(response.text);
    result = JSON.parse(cleanedText);
  } catch {
    console.error("JSON Parse Error in Mochikomi search:", response.text);
    throw new Error("Failed to parse fee data.");
  }
  
  return (result.items || []).map((item: MochikomiItem) => ({
    ...item,
    id: crypto.randomUUID(),
    isSelected: false 
  }));
};
