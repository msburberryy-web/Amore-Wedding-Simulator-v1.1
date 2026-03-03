import React, { useState, useEffect } from 'react';
import { QuoteItem, AmoreService, VenueInfo, QuoteCategory, TabType } from './types';
import solarLunar from 'solarlunar';

import { MENU_CATALOG, CatalogItem } from './services/simulatorData';

import { Calendar } from './components/Calendar';
import { RokuyoGlossary } from './components/RokuyoGlossary';
import { Heart, Loader2, X, Info, Plus, Minus, Download, ChevronRight, FileText, LayoutGrid, Users, BookOpen, Wallet, TrendingUp, TrendingDown, ArrowRight, HelpCircle, Star, Check, ListChecks, MessageCircle, Clock, PackagePlus } from 'lucide-react';
import html2canvas from 'html2canvas';

// --- TYPES ---
type Language = 'en' | 'ja' | 'my';
type VenueCalcMode = 'detailed' | 'perPerson';

// --- DATA FOR ADDITIONAL OPTIONS ---
const ADDITIONAL_OPTIONS_DATA: CatalogItem[] = [
  {
    id: 'opt_tech',
    category: QuoteCategory.ENTERTAINMENT,
    name: { en: 'Technical Control (Sound/Lighting)', ja: '音響照明オペレート', my: 'အသံနှင့် မီးအလင်းရောင် ထိန်းချုပ်မှု' },
    unitPrice: 50000,
    isPerGuest: false,
    defaultQty: 1,
    info: { en: "Professional operator for PA system and lighting effects.", ja: "当日の音響と照明を操作する専任オペレーターです。", my: "ပွဲအခမ်းအနားအတွက် အသံနှင့် မီးအလင်းရောင် ကျွမ်းကျင်ပညာရှင်။" }
  },
  {
    id: 'opt_cake',
    category: QuoteCategory.FOOD_DRINK,
    name: { en: 'Wedding Cake', ja: 'ウェディングケーキ', my: 'မင်္ဂလာ ကိတ်မုန့်' },
    unitPrice: 40000,
    isPerGuest: false,
    defaultQty: 1,
    minPrice: 40000,
    maxPrice: 150000,
    info: { en: "Fresh wedding cake. Price varies by tiers and design.", ja: "フレッシュウェディングケーキ。段数やデザインにより価格が異なります。", my: "မင်္ဂလာကိတ်မုန့်။ အထပ်အရေအတွက်နှင့် ဒီဇိုင်းပေါ်မူတည်၍ ဈေးနှုန်းကွာခြားနိုင်သည်။" }
  },
  {
    id: 'opt_champagne',
    category: QuoteCategory.FOOD_DRINK,
    name: { en: 'Champagne Tower', ja: 'シャンパンタワー', my: 'ရှန်ပိန်တာဝါ' },
    unitPrice: 45000,
    isPerGuest: false,
    defaultQty: 1,
    minPrice: 45000,
    maxPrice: 100000,
    info: { en: "Festive champagne tower setup including bottles.", ja: "華やかなシャンパンタワー演出（ボトル込）です。", my: "ပွဲကို ပိုမိုစည်ကားစေမည့် ရှန်ပိန်တာဝါ အစီအစဉ်။" }
  },
  {
    id: 'opt_extension',
    category: QuoteCategory.VENUE_FEE,
    name: { en: 'Venue Extension (30 min)', ja: '会場延長料 (30分)', my: 'ခန်းမအချိန်ပိုကြေး (မိနစ် ၃၀)' },
    unitPrice: 25000,
    isPerGuest: false,
    defaultQty: 1,
    minPrice: 25000,
    maxPrice: 50000,
    allowQtyEdit: true,
    info: { en: "Extension fee per 30 minutes block.", ja: "30分ごとの延長料金です。", my: "မိနစ် ၃၀ လျှင် ကျသင့်မည့် အချိန်ပိုကြေး။" }
  },
  {
    id: 'opt_sulyar',
    category: QuoteCategory.OTHER,
    name: { en: 'SuLyar Yit Pat Ceremony Set', ja: 'スリヤ・イッパ儀式セット', my: 'စုလျားရစ်ပတ် မင်္ဂလာအခမ်းအနား' },
    unitPrice: 50000,
    isPerGuest: false,
    defaultQty: 1,
    minPrice: 50000,
    maxPrice: 150000,
    info: { en: "Includes Batethate set rental, MC, Planning, and Rehearsal.", ja: "バテタ（儀式用セット）レンタル、司会、進行、リハーサルを含みます。", my: "ပတ္တမြားကလပ်ငှားရမ်းခြင်း၊ အခမ်းအနားမှူး၊ စီစဉ်ညွှန်ကြားမှုနှင့် အစမ်းလေ့ကျင့်မှုများ ပါဝင်သည်။" }
  },
  {
    id: 'opt_waiting',
    category: QuoteCategory.VENUE_FEE,
    name: { en: 'Waiting Room', ja: '親族控室', my: 'ဧည့်သည်နားနေခန်း' },
    unitPrice: 15000,
    isPerGuest: false,
    defaultQty: 1,
    info: { en: "Private waiting room for family or bride/groom.", ja: "ご親族や新郎新婦用の個室控室です。", my: "မိသားစု သို့မဟုတ် သတို့သားသတို့သမီးအတွက် သီးသန့်နားနေခန်း။" }
  },
  {
    id: 'opt_seating',
    category: QuoteCategory.OTHER,
    name: { en: 'Guest Seating Chart', ja: '席次表 (人数分)', my: 'ဧည့်သည် နေရာချထားမှု ဇယား' },
    unitPrice: 500,
    isPerGuest: true,
    defaultQty: 1,
    info: { en: "Printed seating chart per guest.", ja: "ゲスト1名様ごとの席次表作成費です。", my: "ဧည့်သည်တစ်ဦးချင်းစီအတွက် နေရာထိုင်ခင်းပြ ဇယား။" }
  },
  {
    id: 'opt_redcarpet',
    category: QuoteCategory.FLORAL_DECOR,
    name: { en: 'Red Carpet', ja: 'レッドカーペット', my: 'ကော်ဇောနီ' },
    unitPrice: 16000,
    isPerGuest: false,
    defaultQty: 1,
    info: { en: "Red carpet for the aisle.", ja: "バージンロード用のレッドカーペットです。", my: "လျှောက်လမ်းအတွက် ကော်ဇောနီ။" }
  }
];

// --- TRANSLATIONS ---
const TRANSLATIONS = {
  en: {
    title: "Wedding Service Estimate",
    subtitle: "Prepared exclusively for your special day",
    appIntro: "This app is to estimate your wedding budget based on what services you need. The actual cost will depends on the venue of your choice and your plan.",
    guestCount: "Guest Count",
    date: "Date",
    totalEstimate: "Total Estimate",
    subtotalVenue: "Venue Subtotal",
    subtotalAmore: "Amore Services",
    subtotal: "Subtotal",
    tax: "Consumption Tax (10%)",
    totalRange: "Total Est. Range",
    disclaimer: "This document is an estimate only. Prices are subject to availability and final confirmation by the venue.",
    budgetFriendlyNote: "Budget friendly option? Please freely discuss with us. We are happy to tailor the plan to your needs.",
    menuBook: "Venue Selection",
    menuBookDesc: "How would you like to calculate venue costs?",
    calcModeDetailed: "Pick Detailed Items",
    calcModeDetailedDesc: "Select rental, food, and drinks separately.",
    calcModePerPerson: "Simple Per-Person Rate",
    calcModePerPersonDesc: "Use a flat-rate venue package fee.",
    targetBudget: "Target Budget",
    budgetStatus: "Budget Usage",
    remaining: "Remaining",
    overBudget: "Over Budget",
    budgetSummary: "Budget Planning",
    step1: "Budget",
    step2: "Venue",
    step3: "Amore",
    step4: "Options",
    step5: "Final",
    step2_date: "Date",
    dateSelectionTitle: "Select Your Date",
    dateSelectionDesc: "Choose your desired wedding date. We'll provide insights on how it might affect your budget.",
    dateNoticeTitle: "Date Insights",
    dateNoticePeak: "This is a popular time for weddings (weekends in Spring/Autumn). Prices may be higher.",
    dateNoticeOffPeak: "This is during an off-peak season. You might find more budget-friendly options.",
    dateNoticeRokuyo: "This day is considered lucky (Taian/Tomobiki) in the Rokuyo calendar, which can increase demand.",
    nextStepVenue: "Next: Venue Style",
    guide: "Guide",
    whySelect: "Why select this?",
    qualityVolume: "Quality & Volume",
    addToEstimate: "Add to Estimate",
    removeFromEstimate: "Remove",
    included: "Included in Estimate",
    notIncluded: "Not Selected",
    nextStepAmore: "Next: Amore Services",
    nextStepOptions: "Next: Additional Options",
    generateSummary: "Generate Final Summary",
    viewDocument: "View Document",
    estimateTotal: "Estimate Total (Inc. Tax)",
    quantity: "Quantity",
    table: "Table",
    perPerson: "per person",
    recommendedVenues: "Sample venues",
    recommendedVenuesDesc: "Matching your selection (Up to ¥",
    venuePackageNote: "Note: These package prices may already include services like floral decor, dress, hair/makeup, etc., in addition to food and beverage. Please check their official websites for exact details.",
    selectVenue: "Select this Venue",
    selected: "Selected",
    serviceDetails: "Service Details",
    generatedOn: "Generated on",
    amoreTokyo: "Amore Wedding Tokyo",
    additionalOptionsTitle: "Additional Options",
    additionalOptionsDesc: "Add specific requirements like cake, technical production, or traditional ceremonies.",
    categories: {
      [QuoteCategory.VENUE_FEE]: 'Venue & Facilities',
      [QuoteCategory.FOOD_DRINK]: 'Food & Beverage',
      [QuoteCategory.ATTIRE_BEAUTY]: 'Attire & Beauty',
      [QuoteCategory.FLORAL_DECOR]: 'Floral & Decoration',
      [QuoteCategory.PHOTO_VIDEO]: 'Photography & Videography',
      [QuoteCategory.ENTERTAINMENT]: 'Entertainment & Sound',
      [QuoteCategory.OTHER]: 'Other Services',
    }
  },
  ja: {
    title: "御見積書",
    subtitle: "お二人の特別な日のために",
    appIntro: "このアプリは、必要なサービスに基づいて結婚式の予算を概算するためのものです。実際の費用は、選択した会場やプランによって異なります。",
    guestCount: "招待客数",
    date: "発行日",
    totalEstimate: "御見積総額",
    subtotalVenue: "会場関係費",
    subtotalAmore: "Amoreサービス料",
    subtotal: "小計",
    tax: "消費税 (10%)",
    totalRange: "御見積総額（目安）",
    buffer: "(予備費 +5%)",
    disclaimer: "この見積書は概算です。価格は空き状況や会場の最終確認により変更される場合があります。",
    budgetFriendlyNote: "ご予算に応じたプランのご提案も可能です。お気軽にご相談ください。",
    menuBook: "会場費用の選択",
    menuBookDesc: "会場費用の算出方法をお選びください。",
    calcModeDetailed: "項目ごとに選ぶ",
    calcModeDetailedDesc: "挙式、料理、飲物を個別に選択します。",
    calcModePerPerson: "1名あたりの一律料金",
    calcModePerPersonDesc: "会場パッケージ料金で算出します。",
    targetBudget: "目標予算",
    budgetStatus: "予算使用率",
    remaining: "残予算",
    overBudget: "予算超過",
    budgetSummary: "予算計画",
    step1: "予算",
    step2: "会場",
    step3: "Amore",
    step4: "オプション",
    step5: "概要",
    step2_date: "日付",
    dateSelectionTitle: "ご希望の日程を選択",
    dateSelectionDesc: "結婚式のご希望日を選択してください。日程がご予算にどう影響するかについての情報をご提供します。",
    dateNoticeTitle: "日程に関するアドバイス",
    dateNoticePeak: "人気のシーズン（春・秋の週末）です。料金が割高になる可能性があります。",
    dateNoticeOffPeak: "オフシーズンです。比較的リーズナブルなプランが見つかるかもしれません。",
    dateNoticeRokuyo: "この日は六曜で「大安」または「友引」にあたり、人気が高まる傾向があります。",
    nextStepVenue: "次へ: 会場選択",

    guide: "解説",
    whySelect: "なぜこれが必要？",
    qualityVolume: "品質・ボリューム",
    addToEstimate: "見積に追加",
    removeFromEstimate: "削除",
    included: "見積に含まれています",
    notIncluded: "未選択",
    nextStepAmore: "次へ: Amoreサービス",
    nextStepOptions: "次へ: 追加オプション",
    generateSummary: "最終確認へ",
    viewDocument: "見積書を表示",
    estimateTotal: "御見積総額（税込）",
    quantity: "数量",
    table: "卓",
    perPerson: "1名あたり",
    recommendedVenues: "会場のサンプル",
    recommendedVenuesDesc: "選択範囲内の会場 (最大 ¥",
    venuePackageNote: "注意：これらのパッケージ価格には、料理や飲料に加えて、装花、衣装、ヘアメイクなどのサービスが含まれている場合があります。詳細は各会場の公式サイトをご確認ください。",
    selectVenue: "この会場を選択",
    selected: "選択済み",
    serviceDetails: "サービス詳細",
    generatedOn: "作成日時",
    amoreTokyo: "Amore Wedding Tokyo",
    additionalOptionsTitle: "追加オプション",
    additionalOptionsDesc: "ケーキ、音響照明、伝統儀式などのオプションを追加できます。",
    categories: {
      [QuoteCategory.VENUE_FEE]: '会場費・設備',
      [QuoteCategory.FOOD_DRINK]: '料理・飲料',
      [QuoteCategory.ATTIRE_BEAUTY]: '衣装・美容',
      [QuoteCategory.FLORAL_DECOR]: '装花・装飾',
      [QuoteCategory.PHOTO_VIDEO]: '写真・映像',
      [QuoteCategory.ENTERTAINMENT]: '演出・音響',
      [QuoteCategory.OTHER]: 'その他サービス',
    }
  },
  my: {
    title: "မင်္ဂလာဆောင် ဝန်ဆောင်မှု ခန့်မှန်းခြေစာရင်း",
    subtitle: "သင့်မင်္ဂလာပွဲအတွက် အထူးစီစဉ်ထားခြင်း",
    appIntro: "ဤအက်ပ်သည် သင်လိုအပ်သော ဝန်ဆောင်မှုများပေါ်မူတည်၍ သင်၏မင်္ဂလာဆောင်ဘတ်ဂျက်ကို ခန့်မှန်းရန်ဖြစ်သည်။ အမှန်တကယ်ကုန်ကျစရိတ်မှာ သင်ရွေးချယ်ထားသော ခန်းမနှင့် အစီစဉ်ပေါ်တွင် မူတည်ပါသည်။",
    guestCount: "ဧည့်သည်အရေအတွက်",
    date: "ရက်စွဲ",
    totalEstimate: "စုစုပေါင်း ခန့်မှန်းခြေစာရင်း",
    subtotalVenue: "ခန်းမနှင့် ဝန်ဆောင်မှုစရိတ်",
    subtotalAmore: "Amore ဝန်ဆောင်မှုများ",
    subtotal: "စုစုပေါင်း",
    tax: "အခွန် (၁၀%)",
    totalRange: "ခန့်မှန်းခြေ စုစုပေါင်း",
    disclaimer: "ဤစာရွက်စာတမ်းသည် ခန့်မှန်းခြေသာဖြစ်သည်။ ဈေးနှုန်းများသည် ခန်းမ၏ အတည်ပြုချက်အပေါ် မူတည်၍ ပြောင်းလဲနိုင်သည်။",
    budgetFriendlyNote: "ဘတ်ဂျက်နှင့်အညီ ညှိနှိုင်းလိုပါက ပွင့်လင်းလွတ်လပ်စွာ ဆွေးနွေးနိုင်ပါသည်။ လူကြီးမင်းတို့ စိတ်တိုင်းကျဖြစ်စေရန် ကျွန်ုပ်တို့ဘက်မှ အတတ်နိုင်ဆုံး ကူညီဆောင်ရွက်ပေးပါမည်။",
    menuBook: "ခန်းမစရိတ် တွက်ချက်ခြင်း",
    menuBookDesc: "ခန်းမစရိတ်ကို မည်သို့တွက်ချက်လိုသနည်း?",
    calcModeDetailed: "တစ်ခုချင်းစီ ရွေးချယ်မည်",
    calcModeDetailedDesc: "အစားအသောက်၊ အချိုရည်နှင့် အဆောင်အဦများကို ခွဲခြားရွေးချယ်ပါ။",
    calcModePerPerson: "တစ်ဦးလျှင် တစ်ပြေးညီနှုန်းထား",
    calcModePerPersonDesc: "ခန်းမ ဝန်ဆောင်မှု Package (တစ်ဦးလျှင်) စရိတ်ဖြင့် တွက်ချက်ပါ။",
    targetBudget: "သတ်မှတ်ဘတ်ဂျက်",
    budgetStatus: "ဘတ်ဂျက်သုံးစွဲမှု",
    remaining: "ပိုလျှံ",
    overBudget: "ဘတ်ဂျက်ကျော်",
    budgetSummary: "ဘတ်ဂျက် စီမံချက်",
    step1: "ဘတ်ဂျက်",
    step2: "ခန်းမ",
    step3: "Amore",
    step4: "အပိုထပ်ဆောင်း",
    step5: "အကျဉ်းချုပ်",
    step2_date: "ရက်စွဲ",
    dateSelectionTitle: "သင်၏မင်္ဂလာရက်ကိုရွေးချယ်ပါ",
    dateSelectionDesc: "သင်အလိုရှိသော မင်္ဂလာရက်ကို ရွေးချယ်ပါ။ သင့်ဘတ်ဂျက်အပေါ် မည်သို့အကျိုးသက်ရောက်နိုင်သည်ကို ကျွန်ုပ်တို့အကြံပြုပေးပါမည်။",
    dateNoticeTitle: "ရက်စွဲဆိုင်ရာ အကြံပြုချက်",
    dateNoticePeak: "ဤအချိန်သည် မင်္ဂလာဆောင်များအတွက် လူကြိုက်များသောအချိန်ဖြစ်သည် (နွေဦး/ဆောင်းဦးရာသီ စနေ၊ တနင်္ဂနွေ)။ ဈေးနှုန်းများ ပိုမိုမြင့်မားနိုင်ပါသည်။",
    dateNoticeOffPeak: "ဤအချိန်သည် လူကြိုက်နည်းသောရာသီဖြစ်သည်။ ဘတ်ဂျက်နှင့်ကိုက်ညီသော ရွေးချယ်မှုများကို သင်ရှာဖွေနိုင်ပါသည်။",
    dateNoticeRokuyo: "ဤနေ့သည် Rokuyo ပြက္ခဒိန်တွင် ကံကောင်းသောနေ့ (Taian/Tomobiki) ဖြစ်သောကြောင့် ဝယ်လိုအားများနိုင်ပါသည်။",
    nextStepVenue: "ရှေ့ဆက်ရန်- ခန်းမပုံစံ",

    guide: "လမ်းညွှန်",
    whySelect: "ဒါကို ဘာကြောင့် ရွေးချယ်သင့်သလဲ?",
    qualityVolume: "အရည်အသွေးနှင့် ပမာဏ",
    addToEstimate: "စာရင်းထဲထည့်မည်",
    removeFromEstimate: "ပယ်ဖျက်မည်",
    included: "စာရင်းထဲထည့်ပြီး",
    notIncluded: "မရွေးချယ်ရသေးပါ",
    nextStepAmore: "ရှေ့ဆက်မည်: Amore ဝန်ဆောင်မှုများ",
    nextStepOptions: "ရှေ့ဆက်မည်: အပိုဝန်ဆောင်မှုများ",
    generateSummary: "အကျဉ်းချုပ်ကြည့်မည်",
    viewDocument: "စာရွက်စာတမ်းကြည့်မည်",
    estimateTotal: "စုစုပေါင်း (အခွန်အပါဝင်)",
    quantity: "အရေအတွက်",
    table: "စားပွဲ",
    perPerson: "တစ်ဦးလျှင်",
    recommendedVenues: "နမူနာခန်းမများ",
    recommendedVenuesDesc: "သင်ရွေးချယ်ထားသော အတိုင်းအတာအတွင်းရှိ ခန်းမများ (အများဆုံး ¥",
    venuePackageNote: "မှတ်ချက်- ဤခန်းမ Package ဈေးနှုန်းများတွင် အစားအသောက်နှင့် အဖျော်ယမကာများအပြင် ပန်းအလှဆင်ခြင်း၊ ဝတ်စုံနှင့် အလှပြင်ခြင်း စသည့် ဝန်ဆောင်မှုများ ပါဝင်နေနိုင်ပါသည်။ အသေးစိတ်ကို သက်ဆိုင်ရာ ခန်းမ၏ တရားဝင် ဝဘ်ဆိုဒ်များတွင် စစ်ဆေးကြည့်ရှုပါ။",
    selectVenue: "ဤခန်းမကို ရွေးချယ်မည်",
    selected: "ရွေးချယ်ပြီး",
    serviceDetails: "ဝန်ဆောင်မှု အသေးစိတ်",
    generatedOn: "ထုတ်ပေးသည့်အချိန်",
    amoreTokyo: "Amore Wedding Tokyo",
    additionalOptionsTitle: "အပိုဝန်ဆောင်မှုများ",
    additionalOptionsDesc: "ကိတ်မုန့်၊ အသံပိုင်းဆိုင်ရာ နှင့် ရိုးရာအခမ်းအနားများကဲ့သို့သော အထူးလိုအပ်ချက်များ ထပ်ဖြည့်နိုင်ပါသည်။",
    categories: {
      [QuoteCategory.VENUE_FEE]: 'ခန်းမနှင့် အဆောက်အအုံ',
      [QuoteCategory.FOOD_DRINK]: 'အစားအသောက်နှင့် အဖျော်ယမကာ',
      [QuoteCategory.ATTIRE_BEAUTY]: 'ဝတ်စုံနှင့် အလှပြင်',
      [QuoteCategory.FLORAL_DECOR]: 'ပန်းနှင့် အလှဆင်',
      [QuoteCategory.PHOTO_VIDEO]: 'ဓာတ်ပုံနှင့် ဗီဒီယို',
      [QuoteCategory.ENTERTAINMENT]: 'ဖျော်ဖြေရေးနှင့် အသံ',
      [QuoteCategory.OTHER]: 'အခြားဝန်ဆောင်မှုများ',
    }
  }
};

const INITIAL_SERVICES: (Omit<AmoreService, 'name'> & { name: Record<string, string> })[] = [
  { 
    id: '1', 
    name: { en: 'Event Planning Service + MC', ja: 'プランニング & 司会進行', my: 'မင်္ဂလာပွဲ စီစဉ်မှုနှင့် အခမ်းအနားမှူး' },
    minPrice: 105000, maxPrice: 220000, currentPrice: 105000,
    isSelected: false, 
    info: {
      en: "Professional coordination and MC services for the wedding banquet.",
      ja: "プロのコーディネートと披露宴の司会進行サービスです。",
      my: "မင်္ဂလာပွဲ အစီစဉ်တစ်ခုလုံး အဆင်ပြေစေရန် စီစဉ်ညှိနှိုင်းပေးခြင်းနှင့် အခမ်းအနားမှူး (MC) ဝန်ဆောင်မှု။"
    }
  },
  { 
    id: '2', 
    name: { en: 'Photo + Video', ja: '写真 & ビデオ撮影', my: 'ဓာတ်ပုံနှင့် ဗီဒီယို' },
    minPrice: 120000, maxPrice: 200000, currentPrice: 120000,
    isSelected: false, 
    info: {
      en: "Professional photography and videography for the event day.",
      ja: "当日の写真撮影とビデオ撮影のパッケージです。",
      my: "မင်္ဂလာပွဲနေ့ ဓာတ်ပုံနှင့် ဗီဒီယို မှတ်တမ်းတင်ခြင်း။"
    }
  },
  { 
    id: 'dress', 
    name: { en: 'Bride Dress & Groom Suit', ja: '新婦ドレス & 新郎タキシード', my: 'သတို့သမီးနှင့် သတို့သား ဝတ်စုံ' },
    minPrice: 35000, maxPrice: 75000, currentPrice: 35000,
    isSelected: false, 
    info: {
      en: "Rental for one wedding dress and one tuxedo set including accessories.",
      ja: "ドレス1着とタキシード1着のレンタルパッケージです。",
      my: "သတို့သမီးနှင့် သတို့သား ဝတ်စုံ ငှားရမ်းခနှင့် အသုံးအဆောင်များ။"
    }
  },
  { 
    id: 'makeup', 
    name: { en: 'Makeup & Hair (with Rehearsal)', ja: 'ヘアメイク (リハーサル込)', my: 'အလှပြင်နှင့် ဆံပင် (အစမ်းပြင်ဆင်မှုပါဝင်)' },
    minPrice: 35000, maxPrice: 85000, currentPrice: 35000,
    isSelected: false, 
    info: {
      en: "Professional bridal beauty service with a trial rehearsal.",
      ja: "当日のブライダルヘアメイクとリハーサルのセットです。",
      my: "သတို့သမီး အလှပြင်ဝန်ဆောင်မှုနှင့် အစမ်းပြင်ဆင်မှု။"
    }
  },
  { 
    id: 'amore_bouquet', 
    name: { en: 'Real Flower Bouquet', ja: '生花ブーケ', my: 'ပန်းအစစ် ပန်းစည်း' },
    minPrice: 10000, maxPrice: 50000, currentPrice: 20000,
    isSelected: false, 
    info: {
      en: "Fresh floral bouquet for the bride. Range depends on size and seasonality.",
      ja: "新婦用の生花ブーケです。サイズや季節により価格が変動します。",
      my: "သတို့သမီးအတွက် ပန်းအစစ် ပန်းစည်း။"
    }
  },
  { 
    id: 'amore_main_fl', 
    name: { en: 'Main Table Flowers', ja: 'メインテーブル装花', my: 'ပင်မစားပွဲ ပန်းအလှဆင်ခြင်း' },
    minPrice: 60000, maxPrice: 150000, currentPrice: 60000,
    isSelected: false, 
    info: {
      en: "Luxury floral arrangement for the couple's head table.",
      ja: "新郎新婦メインテーブルの豪華な装花演出です。",
      my: "သတို့သားသတို့သမီး ထိုင်သည့် ပင်မစားပွဲ ပန်းအလှဆင်ခြင်း။"
    }
  },
  { 
    id: 'amore_guest_fl', 
    name: { en: 'Guest Table Flowers (Set)', ja: 'ゲストテーブル装花 (セット)', my: 'ဧည့်သည်စားပွဲ ပန်းအလှဆင်ခြင်း' },
    minPrice: 3500, maxPrice: 15000, currentPrice: 3500,
    isSelected: false,
    quantity: 1, 
    info: {
      en: "Floral decor for all guest tables. Starts from 3,500 per table (max 10 guests).",
      ja: "ゲストテーブル用の装花です。1卓（最大10名）あたり3,500円より承ります。",
      my: "ဧည့်သည်စားပွဲ ပန်းအလှဆင်ခြင်း။ ၁ စားပွဲလျှင် ၃,၅၀၀ မှ စတင်ပါသည် (ဧည့်သည် ၁၀ ဦးအထိ)။"
    }
  },
  { 
    id: 'webinv', 
    name: { en: 'Web Invitation & Seating Chart', ja: 'WEB招待状 & 席次ボード', my: 'အွန်လိုင်း ဖိတ်စာနှင့် ဧည့်သည်နေရာပြဘုတ်' },
    minPrice: 10000, maxPrice: 25000, currentPrice: 10000,
    isSelected: false, 
    info: {
      en: "Digital wedding invitation and printed board for guest seating.",
      ja: "WEB招待状と出欠管理、当日用の席次ボードです。",
      my: "အွန်လိုင်း ဖိတ်စာနှင့် ဧည့်သည် နေရာထိုင်ခင်းပြ ဘုတ်။"
    }
  },
  { 
    id: 'transport', 
    name: { en: 'Transport Fee (交通費)', ja: 'スタッフ交通費・運搬費', my: 'သယ်ယူပို့ဆောင်ခ' },
    minPrice: 20000, maxPrice: 35000, currentPrice: 20000,
    isSelected: false, 
    info: {
      en: "Transportation costs for staff, apparel, and equipment to the venue.",
      ja: "スタッフや機材の搬入、移動に伴う交通費です。",
      my: "ဝန်ဆောင်မှုအဖွဲ့နှင့် ပစ္စည်းများအတွက် သယ်ယူပို့ဆောင်ခ။"
    }
  },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('budget');
  const [weddingDate, setWeddingDate] = useState<Date | null>(null);
  const [language, setLanguage] = useState<Language>('en');
  
  const t = TRANSLATIONS[language];

  const [venueCalcMode, setVenueCalcMode] = useState<VenueCalcMode>('perPerson');
  const [expandedInfo, setExpandedInfo] = useState<string | null>(null);
  const [capturing, setCapturing] = useState(false);
  const [downloadTime, setDownloadTime] = useState<string>('');
  const [showGlossary, setShowGlossary] = useState(false);

  const getDateAnalysis = (date: Date | null) => {
    if (!date) return [];
    const insights = [];
    const month = date.getMonth(); // 0-indexed (0 = Jan, 11 = Dec)
    const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday

    // Peak season check (Spring: Mar-May, Autumn: Sep-Nov)
    if ((month >= 2 && month <= 4) || (month >= 8 && month <= 10)) {
      if (dayOfWeek === 6 || dayOfWeek === 0) { // Saturday or Sunday
        insights.push({ type: 'peak', message: t.dateNoticePeak });
      }
    }

    // Off-peak season check (Winter: Dec-Feb, Summer: Jun-Aug)
    if ((month >= 11 || month <= 1) || (month >= 5 && month <= 7)) {
      insights.push({ type: 'off-peak', message: t.dateNoticeOffPeak });
    }

    // Rokuyo check using solarlunar
    const solarYear = date.getFullYear();
    const solarMonth = date.getMonth() + 1;
    const solarDay = date.getDate();
    const lunarData = solarLunar.solar2lunar(solarYear, solarMonth, solarDay);
    const lMonth = lunarData.lMonth;
    const lDay = lunarData.lDay;
    const remainder = (lMonth + lDay) % 6;

    // 0: Taian (Lucky), 3: Tomobiki (Lucky)
    if (remainder === 0 || remainder === 3) {
        insights.push({ type: 'rokuyo', message: t.dateNoticeRokuyo });
    }

    return insights;
  };

  const dateInsights = getDateAnalysis(weddingDate);

  const todayDate = new Date().toLocaleDateString(
    language === 'ja' ? 'ja-JP' : (language === 'my' ? 'my-MM' : 'en-US')
  );
  
  const [venueInfo, setVenueInfo] = useState<VenueInfo>({
    name: 'East Gallery Template',
    hideName: false,
    guestCount: 60,
    taxRate: 0.10,
    imageUrl: '',
    minimumUsageFee: undefined,
    targetBudget: 1500000 
  });
  
  const [quoteItems, setQuoteItems] = useState<QuoteItem[]>([]);
  const [amoreServices, setAmoreServices] = useState<AmoreService[]>(
    INITIAL_SERVICES.map(s => ({ ...s, name: s.name.en, quantity: s.id === 'amore_guest_fl' ? Math.ceil(60 / 10) : (s.quantity || 1) }))
  );

  const targetBudgetPerPerson = venueInfo.targetBudget ? Math.floor(venueInfo.targetBudget / venueInfo.guestCount) : 0;

  // Sync effective reference price for venue suggestions
  
  
  
  

  

  useEffect(() => {
    if (venueCalcMode === 'perPerson') {
      const packageItem = MENU_CATALOG.find(i => i.id === 'venue_package_per_person');
      if (packageItem) {
        setQuoteItems(prev => {
           const others = prev.filter(i => 
             i.category !== QuoteCategory.VENUE_FEE && 
             i.category !== QuoteCategory.FOOD_DRINK
           );
           const exists = others.find(i => i.name === packageItem.name.en);
           if (exists) return others;

           const newItem: QuoteItem = {
              id: crypto.randomUUID(),
              category: QuoteCategory.VENUE_FEE,
              name: packageItem.name.en,
              unitPrice: packageItem.unitPrice,
              quantity: venueInfo.guestCount,
              isPerGuest: true,
              minPrice: packageItem.minPrice,
              maxPrice: packageItem.maxPrice,
              description: packageItem.info?.[language] || packageItem.info?.en 
           };
           return [...others, newItem];
        });
      }
    } else {
      setQuoteItems(prev => prev.filter(i => i.name !== 'Venue Service Package (Per Person)'));
    }
  }, [venueCalcMode, venueInfo.guestCount, language]);

  useEffect(() => {
    setAmoreServices(prev => prev.map(s => {
      if (s.id === 'amore_guest_fl') {
        return { ...s, quantity: Math.ceil(venueInfo.guestCount / 10) };
      }
      return s;
    }));
    if (venueCalcMode === 'perPerson') {
       setQuoteItems(prev => prev.map(i => {
         if (i.name === 'Venue Service Package (Per Person)') {
           return { ...i, quantity: venueInfo.guestCount };
         }
         return i;
       }));
    }
  }, [venueInfo.guestCount]);



  const getServiceName = (id: string) => {
    const original = INITIAL_SERVICES.find(s => s.id === id);
    return original?.name[language] || original?.name.en || "";
  };

  const getAmoreOptionText = (service: AmoreService) => {
    const configs: Record<string, Record<string, string>> = {
      '1': {
        en: service.currentPrice >= 120000 ? "Sulryar yit pat burmese style included." : (service.currentPrice >= 115000 ? "Includes chapel style." : "Standard planning without chapel."),
        ja: service.currentPrice >= 120000 ? "ミャンマー伝統儀式（スリヤ・イッパ）対応。" : (service.currentPrice >= 115000 ? "チャペル挙式進行を含む。" : "スタンダードな披露宴のみの進行。"),
        my: service.currentPrice >= 120000 ? "မြန်မာရိုးရာ စုလျားရစ်ပတ် မင်္ဂလာအခမ်းအနား ပါဝင်သည်။" : (service.currentPrice >= 115000 ? "ဝတ်ပြုဆောင် အစီအစဉ် ပါဝင်သည်။" : "ခန်းမအတွင်း အစီအစဉ်သာ ပါဝင်သည်။")
      },
      'amore_main_fl': {
        en: service.currentPrice >= 120000 ? "One Rank Up Luxury Floral" : "Standard Main Table Arrangement",
        ja: service.currentPrice >= 120000 ? "ワンランク上の豪華装花演出" : "標準メインテーブル装花",
        my: service.currentPrice >= 120000 ? "အဆင့်မြင့် ပန်းအလှဆင်မှု" : "စံနှုန်းမီ ပင်မစားပွဲ ပန်းအလှဆင်မှု"
      },
      '2': {
        en: service.currentPrice >= 150000 ? "Full HD Quality / Premium Cuts" : "Standard Day-of Recording",
        ja: service.currentPrice >= 150000 ? "高画質フルHD / プレミアム編集" : "標準当日記録撮影",
        my: service.currentPrice >= 150000 ? "Full HD အရည်အသွေးမြင့် မှတ်တမ်း" : "စံနှုန်းမီ မင်္ဂလာပွဲနေ့ မှတ်တမ်း"
      },
      'dress': {
        en: service.currentPrice >= 50000 ? "2 dresses and accessories set" : "One dress and accessories set",
        ja: service.currentPrice >= 50000 ? "ドレス2点と小物一式のセット" : "ドレス1点と小物一式のセット",
        my: service.currentPrice >= 50000 ? "ဝတ်စုံ ၂ စုံနှင့် အသုံးအဆောင်များ" : "ဝတ်စုံ ၁ စုံနှင့် အသုံးအဆောင်များ"
      },
      'makeup': {
        en: service.currentPrice >= 70000 ? "2 looks with trial rehearsal" : (service.currentPrice >= 50000 ? "With trial rehearsal included" : "One standard bridal look"),
        ja: service.currentPrice >= 70000 ? "ヘアメイク2スタイル（リハーサル込）" : (service.currentPrice >= 50000 ? "ヘアメイク1スタイル（リハーサル込）" : "当日ヘアメイクのみ"),
        my: service.currentPrice >= 70000 ? "အလှပြင် ၂ မျိုး (အစမ်းပြင်ဆင်မှု ပါဝင်)" : (service.currentPrice >= 50000 ? "အလှပြင် ၁ မျိုး (အစမ်းပြင်ဆင်မှု ပါဝင်)" : "မင်္ဂလာပွဲနေ့ အလှပြင်ခြင်း")
      }
    };

    return configs[service.id]?.[language] || configs[service.id]?.en || "";
  };

  const handleDownloadImage = async () => {
    const now = new Date();
    const timeStr = now.toLocaleString(language === 'ja' ? 'ja-JP' : (language === 'my' ? 'my-MM' : 'en-US'));
    setDownloadTime(timeStr);
    
    // Wait for the state update and render
    setTimeout(async () => {
      const element = document.getElementById('quote-content');
      if (!element) return;
      setCapturing(true);
      try {
        const canvas = await html2canvas(element, { scale: 2, useCORS: true });
        const link = document.createElement('a');
        link.download = `amore-estimate-${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      } catch (e) {
        console.error("Export failed", e);
      } finally {
        setCapturing(false);
      }
    }, 100);
  };

  const updateItemQty = (name: string, delta: number) => {
    setQuoteItems(prev => prev.map(item => {
      if (item.name === name) {
        return { ...item, quantity: Math.max(0, item.quantity + delta) };
      }
      return item;
    }));
  };

  const updateItemPrice = (name: string, price: number) => {
    setQuoteItems(prev => prev.map(item => {
      if (item.name === name) {
        return { ...item, unitPrice: price };
      }
      return item;
    }));
  };

  const toggleCatalogItem = (catalogItem: CatalogItem) => {
    const itemNameEn = catalogItem.name.en;
    setQuoteItems(prev => {
      const exists = prev.find(i => i.name === itemNameEn);
      if (exists) {
        return prev.filter(i => i.name !== itemNameEn);
      } else {
        const newItem: QuoteItem = {
          id: crypto.randomUUID(),
          category: catalogItem.category === 'Plan' ? QuoteCategory.VENUE_FEE : catalogItem.category as QuoteCategory,
          name: itemNameEn, 
          unitPrice: catalogItem.unitPrice,
          quantity: catalogItem.isPerGuest ? venueInfo.guestCount : catalogItem.defaultQty,
          isPerGuest: catalogItem.isPerGuest,
          description: catalogItem.info?.[language] || catalogItem.info?.en,
          info: catalogItem.info?.[language] || catalogItem.info?.['en'],
          minPrice: catalogItem.minPrice,
          maxPrice: catalogItem.maxPrice
        };
        return [...prev, newItem];
      }
    });
  };

  const toggleAmoreService = (id: string) => {
    setAmoreServices(prev => prev.map(s => 
      s.id === id ? { ...s, isSelected: !s.isSelected } : s
    ));
  };

  const updateAmorePrice = (id: string, price: number) => {
    setAmoreServices(prev => prev.map(s => 
      s.id === id ? { ...s, currentPrice: price } : s
    ));
  };

  const updateAmoreQty = (id: string, delta: number) => {
    setAmoreServices(prev => prev.map(s => 
      s.id === id ? { ...s, quantity: Math.max(1, (s.quantity || 1) + delta) } : s
    ));
  };



  const venueSubtotal = quoteItems.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
  const amoreSubtotal = amoreServices
    .filter(s => s.isSelected)
    .reduce((sum, s) => sum + (s.currentPrice * (s.quantity || 1)), 0);
  
  const subtotalBeforeTax = venueSubtotal + amoreSubtotal;
  const taxAmount = Math.floor(subtotalBeforeTax * venueInfo.taxRate);
  const grandTotal = subtotalBeforeTax + taxAmount;
  
  const isOverBudget = venueInfo.targetBudget ? grandTotal > venueInfo.targetBudget : false;
  const budgetUsage = venueInfo.targetBudget ? (grandTotal / venueInfo.targetBudget) * 100 : 0;

  const groupedFinalItems = Object.values(QuoteCategory).reduce((acc, category) => {
    const venueItemsInCat = quoteItems.filter(i => i.category === category);
    
    const amoreInCategory = amoreServices.filter(s => {
      if (!s.isSelected) return false;
      const original = INITIAL_SERVICES.find(init => init.id === s.id);
      const name = original?.name.en.toLowerCase() || "";
      
      if (category === QuoteCategory.ATTIRE_BEAUTY) return name.includes('makeup') || name.includes('hair') || name.includes('dress') || name.includes('suit');
      if (category === QuoteCategory.FLORAL_DECOR) return name.includes('flower') || name.includes('bouquet') || name.includes('decoration');
      if (category === QuoteCategory.PHOTO_VIDEO) return name.includes('photo') || name.includes('video');
      if (category === QuoteCategory.ENTERTAINMENT) return name.includes('mc') || name.includes('planning');
      if (category === QuoteCategory.OTHER) {
         const isMatchedElsewhere = (
           name.includes('makeup') || name.includes('hair') || name.includes('dress') || name.includes('suit') ||
           name.includes('flower') || name.includes('bouquet') || name.includes('photo') || name.includes('video') ||
           name.includes('mc') || name.includes('planning')
         );
         return !isMatchedElsewhere || name.includes('invitation') || name.includes('transport');
      }
      return false;
    });

    acc[category] = { venue: venueItemsInCat, amore: amoreInCategory };
    return acc;
  }, {} as Record<string, { venue: QuoteItem[], amore: AmoreService[] }>);

  const catalogByCategory = MENU_CATALOG.reduce((acc, item) => {
    if (item.id === 'venue_package_per_person') return acc; 
    const cat = item.category === 'Plan' ? QuoteCategory.VENUE_FEE : item.category as QuoteCategory;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {} as Record<string, CatalogItem[]>);

  const steps = [
    { id: 'budget', label: t.step1, icon: <Wallet size={16}/> },
    { id: 'date', label: t.step2_date, icon: <Clock size={16}/> },
    { id: 'venue', label: t.step2, icon: <BookOpen size={16}/> },
    { id: 'amore', label: t.step3, icon: <LayoutGrid size={16}/> },
    { id: 'options', label: t.step4, icon: <PackagePlus size={16}/> },
    { id: 'preview', label: t.step5, icon: <FileText size={16}/> }
  ];

  return (
    <div className={`min-h-screen bg-gray-50/50 text-gray-800 font-sans pb-48 print:bg-white print:pb-0 print:text-black ${language === 'my' ? 'font-[Padauk]' : ''}`}>
      {showGlossary && <RokuyoGlossary language={language} onClose={() => setShowGlossary(false)} />}
      <header className="bg-white border-b border-rose-100 shadow-sm sticky top-0 z-40 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-amore-600">
            <Heart className="fill-amore-500" />
            <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight">{t.amoreTokyo}</span>
          </div>
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
             {(['en', 'ja', 'my'] as const).map(l => (
               <button key={l} onClick={() => setLanguage(l)} className={`px-3 sm:px-4 py-1.5 text-xs font-bold rounded-md transition-all ${language === l ? 'bg-white shadow text-amore-600' : 'text-gray-500 hover:text-gray-700'}`}>
                 {l === 'en' ? 'EN' : l === 'ja' ? '日本語' : 'မြန်မာ'}
               </button>
             ))}
          </div>
        </div>
      </header>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-8 no-print">
        <div className="flex items-center justify-between bg-white border border-gray-100 p-2 rounded-2xl shadow-sm overflow-x-auto">
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <button 
                onClick={() => setActiveTab(step.id as TabType)} 
                className={`flex-1 min-w-[80px] sm:min-w-[100px] flex flex-col items-center justify-center py-2 sm:py-4 rounded-xl transition-all relative ${activeTab === step.id ? 'bg-amore-50 text-amore-600 font-bold' : 'text-gray-400'}`}
              >
                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center mb-2 border-2 transition-all ${activeTab === step.id ? 'bg-white border-amore-500 text-amore-600 shadow-md scale-105 sm:scale-110' : 'bg-gray-50 border-gray-100'}`}>
                  {React.cloneElement(step.icon, { size: 14, className: "sm:hidden"})}
                  {React.cloneElement(step.icon, { size: 16, className: "hidden sm:block"})}
                </div>
                <span className="text-[10px] uppercase tracking-widest">{step.label}</span>
              </button>
              {index < steps.length - 1 && <div className="text-gray-200"><ArrowRight size={16} /></div>}
            </React.Fragment>
          ))}
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className={activeTab === 'budget' ? 'block animate-in fade-in' : 'hidden'}>
           <section className="bg-white rounded-[2rem] p-6 md:p-10 lg:p-14 shadow-xl border border-gray-100 space-y-12">
              <div className="bg-rose-50 border border-rose-100 p-6 rounded-3xl">
                <p className="text-amore-700 font-medium leading-relaxed italic text-center text-sm sm:text-base">
                  {t.appIntro}
                </p>
              </div>

              <div className="flex flex-col lg:flex-row gap-16">
                 <div className="flex-[2] space-y-12">
                    <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900">{t.budgetSummary}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                       <div className="space-y-4">
                          <label className="text-xs font-black text-gray-400 uppercase tracking-widest">{t.targetBudget}</label>
                          <div className="relative">
                             <span className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 text-2xl sm:text-3xl font-serif text-amore-400">¥</span>
                             <input type="number" value={venueInfo.targetBudget || ''} onChange={(e) => setVenueInfo(prev => ({...prev, targetBudget: Number(e.target.value)}))} className="w-full bg-gray-50 rounded-3xl pl-10 sm:pl-12 pr-6 sm:pr-8 py-6 sm:py-8 text-3xl sm:text-4xl font-serif font-bold text-gray-900 focus:bg-white outline-none" placeholder="0" />
                          </div>
                          {venueInfo.targetBudget && (
                            <div className="flex items-center gap-2 text-sm text-gray-500 font-medium bg-gray-50 px-4 py-2 rounded-full w-fit">
                              <Users size={14} className="text-amore-400" />
                              ¥{targetBudgetPerPerson.toLocaleString()} <span className="text-[10px] uppercase font-black tracking-tighter opacity-70">{t.perPerson}</span>
                            </div>
                          )}
                       </div>
                    </div>
                    
                    <div className="pt-8 flex justify-center">
                       <button onClick={() => setActiveTab('date')} className="bg-gray-900 text-white px-10 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-black transition-all shadow-lg group">
                          Next: {t.step2_date} <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                       </button>
                    </div>
                 </div>
              </div>
           </section>
        </div>

        <div className={activeTab === 'date' ? 'block animate-in fade-in' : 'hidden'}>
          <section className="bg-white rounded-[2rem] p-6 md:p-10 lg:p-14 shadow-xl border border-gray-100 space-y-12">
            <header className="text-center max-w-2xl mx-auto space-y-4">
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900">{t.dateSelectionTitle}</h2>
              <p className="text-gray-500 text-sm sm:text-base">{t.dateSelectionDesc}</p>
            </header>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
              <div className="lg:col-span-2">
                <Calendar selectedDate={weddingDate} onDateSelect={setWeddingDate} language={language} />
              </div>
              <div className="space-y-6">
                <h3 className="font-serif text-2xl font-bold text-gray-800">{t.dateNoticeTitle}</h3>
                  <button onClick={() => setShowGlossary(true)} className="text-gray-400 hover:text-amore-500 transition-colors">
                    <HelpCircle size={16} />
                  </button>
                {dateInsights.length > 0 ? (
                  <ul className="space-y-4">
                    {dateInsights.map((insight, index) => (
                      <li key={index} className="flex items-start gap-3 p-4 rounded-xl bg-rose-50 border border-rose-100">
                        <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center flex-shrink-0 mt-1">
                          {insight.type === 'peak' && <TrendingUp size={14} className="text-red-500" />}
                          {insight.type === 'off-peak' && <TrendingDown size={14} className="text-green-500" />}
                          {insight.type === 'rokuyo' && <Star size={14} className="text-yellow-500" />}
                        </div>
                        <p className="text-sm text-amore-800 leading-relaxed">{insight.message}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center text-gray-500 p-8 bg-gray-50 rounded-2xl">
                    <p>{t.dateSelectionDesc}</p>
                  </div>
                )}
              </div>
            </div>
            <div className="pt-8 flex justify-center">
              <button onClick={() => setActiveTab('venue')} className="bg-gray-900 text-white px-10 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-black transition-all shadow-lg group">
                {t.nextStepVenue} <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </section>
        </div>

        <div className={activeTab === 'venue' ? 'block space-y-12 animate-in slide-in-from-bottom-4' : 'hidden'}>
           <header className="text-center max-w-2xl mx-auto space-y-4">
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900">{t.menuBook}</h2>
              <p className="text-gray-500 text-sm sm:text-base">{t.menuBookDesc}</p>
           </header>

           <div id="manual-venue-selector" className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              <button 
                onClick={() => setVenueCalcMode('perPerson')}
                className={`flex flex-col items-center gap-4 p-6 sm:p-8 rounded-3xl border-2 transition-all ${venueCalcMode === 'perPerson' ? 'bg-white border-amore-500 shadow-xl ring-4 ring-rose-50' : 'bg-gray-50 border-gray-100 hover:border-amore-200'}`}
              >
                 <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center transition-colors ${venueCalcMode === 'perPerson' ? 'bg-amore-500 text-white' : 'bg-gray-200 text-gray-400'}`}>
                    <Users size={28} />
                 </div>
                 <div className="text-center">
                    <span className="block font-bold text-base sm:text-lg">{t.calcModePerPerson}</span>
                    <span className="text-xs text-gray-500">{t.calcModePerPersonDesc}</span>
                 </div>
              </button>

              <button 
                onClick={() => setVenueCalcMode('detailed')}
                className={`flex flex-col items-center gap-4 p-6 sm:p-8 rounded-3xl border-2 transition-all ${venueCalcMode === 'detailed' ? 'bg-white border-amore-500 shadow-xl ring-4 ring-rose-50' : 'bg-gray-50 border-gray-100 hover:border-amore-200'}`}
              >
                 <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center transition-colors ${venueCalcMode === 'detailed' ? 'bg-amore-500 text-white' : 'bg-gray-200 text-gray-400'}`}>
                    <ListChecks size={28} />
                 </div>
                 <div className="text-center">
                    <span className="block font-bold text-base sm:text-lg">{t.calcModeDetailed}</span>
                    <span className="text-xs text-gray-500">{t.calcModeDetailedDesc}</span>
                 </div>
              </button>
           </div>
           
           {venueCalcMode === 'perPerson' ? (
             <div className="space-y-16">
                <div id="venue-package-selector" className="max-w-2xl mx-auto animate-in fade-in zoom-in-95">
                    {(() => {
                       const packageItem = MENU_CATALOG.find(i => i.id === 'venue_package_per_person');
                       const selectedPkg = quoteItems.find(i => i.name === packageItem?.name.en);
                       if (!packageItem) return null;
                       return (
                         <div className="bg-white p-6 sm:p-10 rounded-[3rem] border border-gray-100 shadow-xl space-y-8">
                            <div className="flex justify-between items-center">
                               <h3 className="font-serif text-xl sm:text-2xl font-bold">{packageItem.name[language]}</h3>
                               <Info className="text-gray-300" size={20} />
                            </div>
                            <p className="text-sm text-gray-500 leading-relaxed italic border-l-4 border-amore-200 pl-4">{packageItem.info?.[language]}</p>
                            
                            <div className="bg-gray-50 p-6 sm:p-8 rounded-[2rem] space-y-6">
                               <div className="flex justify-between items-baseline">
                                  <span className="text-xs font-black uppercase text-gray-400 tracking-widest">{t.qualityVolume}</span>
                                  <div className="text-right">
                                     <div className="text-3xl sm:text-4xl font-serif font-bold text-amore-600">¥{selectedPkg?.unitPrice.toLocaleString()}</div>
                                     <div className="text-[10px] text-gray-400 uppercase font-black">Per Person</div>
                                  </div>
                               </div>
                               <input 
                                 type="range" 
                                 min={packageItem.minPrice} 
                                 max={packageItem.maxPrice} 
                                 step={500} 
                                 value={selectedPkg?.unitPrice || packageItem.minPrice}
                                 onChange={(e) => updateItemPrice(packageItem.name.en, parseInt(e.target.value))}
                                 className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-amore-500"
                               />
                               <div className="flex justify-between text-xs text-gray-400 font-mono">
                                  <span>¥{packageItem.minPrice?.toLocaleString()}</span>
                                  <span>¥{packageItem.maxPrice?.toLocaleString()}</span>
                               </div>
                            </div>

                            <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                               <div className="text-gray-400 text-xs font-medium">Estimated Venue Subtotal:</div>
                               <div className="text-xl sm:text-2xl font-serif font-bold text-gray-900">¥{((selectedPkg?.unitPrice || 0) * venueInfo.guestCount).toLocaleString()}</div>
                            </div>
                         </div>
                       );
                    })()}
                </div>

                {/* Sample Venues Temporarily Hidden */}
                {false && (venueInfo.targetBudget || venueCalcMode === 'perPerson') && (
                  <div className="max-w-7xl mx-auto space-y-8 animate-in slide-in-from-bottom-8 duration-500">
                    {/* ... hidden content ... */}
                  </div>
                )}
             </div>
           ) : (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Object.entries(catalogByCategory).map(([category, items]) => (
                  <div key={category} className="space-y-6">
                     <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100 pb-2">{t.categories[category]}</h3>
                     <div className="space-y-4">
                        {items.map(item => {
                          const itemNameEn = item.name.en;
                          const selectedItem = quoteItems.find(i => i.name === itemNameEn);
                          const isSelected = !!selectedItem;
                          const isExpanded = expandedInfo === item.id;
                          return (
                            <div key={item.id} className={`rounded-[1.5rem] border-2 transition-all overflow-hidden flex flex-col ${isSelected ? 'bg-white border-amore-500 shadow-md' : 'bg-white border-gray-100'}`}>
                              <div className="p-5 flex-1">
                                 <div className="flex justify-between items-start mb-2">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2">
                                         <span className={`font-bold text-sm ${isSelected ? 'text-amore-600' : 'text-gray-800'}`}>{item.name[language]}</span>
                                         <button onClick={() => setExpandedInfo(isExpanded ? null : item.id)} className="text-gray-300 hover:text-amore-400 transition-colors">
                                            <HelpCircle size={14} />
                                         </button>
                                      </div>
                                      <div className="text-[10px] text-gray-400 font-mono mt-1">
                                        {item.minPrice ? `¥${item.minPrice.toLocaleString()} - ¥${item.maxPrice?.toLocaleString()}` : `¥${item.unitPrice.toLocaleString()}`}
                                      </div>
                                    </div>
                                    <button onClick={() => toggleCatalogItem(item)} className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all ${isSelected ? 'bg-amore-500 border-amore-500 text-white' : 'bg-gray-50 border-gray-200 text-gray-300'}`}>
                                       {isSelected ? <Check size={18} /> : <Plus size={18} />}
                                    </button>
                                 </div>
                                 {isSelected && item.minPrice && (
                                   <div className="mt-4 px-2 py-4 bg-gray-50 rounded-2xl">
                                      <div className="flex justify-between text-[9px] font-black uppercase text-gray-400 mb-2">
                                         <span>{t.qualityVolume}</span>
                                         <span className="text-amore-600">¥{selectedItem?.unitPrice.toLocaleString()}</span>
                                      </div>
                                      <input 
                                        type="range" 
                                        min={item.minPrice} 
                                        max={item.maxPrice} 
                                        step={100} 
                                        value={selectedItem?.unitPrice || item.minPrice}
                                        onChange={(e) => updateItemPrice(itemNameEn, parseInt(e.target.value))}
                                        className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-amore-500"
                                      />
                                      <div className="flex justify-between text-[8px] text-gray-300 mt-1 font-mono">
                                        <span>¥{item.minPrice.toLocaleString()}</span>
                                        <span>¥{item.maxPrice?.toLocaleString()}</span>
                                      </div>
                                   </div>
                                 )}
                                 {isSelected && item.allowQtyEdit && (
                                    <div className="mt-4 flex items-center justify-between bg-gray-50 rounded-2xl p-3">
                                       <span className="text-[10px] font-black uppercase text-gray-400">{t.quantity}</span>
                                       <div className="flex items-center gap-4">
                                          <button onClick={() => updateItemQty(itemNameEn, -1)} className="text-amore-600 bg-white p-1 rounded-md shadow-sm border border-gray-100"><Minus size={12} /></button>
                                          <span className="text-xs font-bold font-mono">{selectedItem?.quantity}</span>
                                          <button onClick={() => updateItemQty(itemNameEn, 1)} className="text-amore-600 bg-white p-1 rounded-md shadow-sm border border-gray-100"><Plus size={12} /></button>
                                       </div>
                                    </div>
                                 )}
                              </div>
                              {isExpanded && (
                                <div className="px-5 pb-5 bg-white border-t border-gray-50">
                                   <p className="text-[11px] text-gray-500 leading-relaxed mt-4 italic">{item.info?.[language] || item.info?.['en']}</p>
                                </div>
                              )}
                            </div>
                          );
                        })}
                     </div>
                  </div>
                ))}
             </div>
           )}

           <div className="flex justify-center pt-8 border-t border-gray-100">
              <button onClick={() => setActiveTab('amore')} className="bg-gray-900 text-white px-8 sm:px-12 py-4 sm:py-5 rounded-2xl font-bold flex items-center gap-3 hover:bg-black transition-all shadow-xl group">
                 {t.nextStepAmore} <ChevronRight className="group-hover:translate-x-1 transition-transform" />
              </button>
           </div>
        </div>

        <div className={activeTab === 'amore' ? 'block space-y-12 animate-in' : 'hidden'}>
           <header className="text-center max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-serif font-bold">Amore Specialized Services</h2>
              <p className="text-gray-500 mt-2 text-sm sm:text-base">Personalize your wedding with our premium support options.</p>
           </header>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {amoreServices.map(service => {
                const isSelected = service.isSelected;
                const isExpanded = expandedInfo === service.id;
                const localizedName = getServiceName(service.id);
                const original = INITIAL_SERVICES.find(s => s.id === service.id);
                const isPerTableItem = service.id === 'amore_guest_fl';

                return (
                  <div key={service.id} className={`group relative flex flex-col rounded-[2.5rem] border-2 transition-all duration-300 ${isSelected ? 'bg-white border-amore-500 shadow-[0_20px_50px_rgba(244,63,94,0.1)] ring-1 ring-amore-100' : 'bg-white border-gray-100 hover:border-amore-200 shadow-sm hover:shadow-md'}`}>
                    <div className="p-6 sm:p-8 flex-1">
                      <div className="flex justify-between items-start mb-4">
                        <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${isSelected ? 'bg-amore-100 text-amore-600' : 'bg-gray-100 text-gray-400'}`}>
                          {isSelected ? t.included : t.notIncluded}
                        </div>
                        <button onClick={() => setExpandedInfo(isExpanded ? null : service.id)} className="text-gray-300 hover:text-amore-500 transition-colors">
                          <HelpCircle size={20} />
                        </button>
                      </div>

                      <h3 className={`font-serif text-lg sm:text-xl font-bold mb-4 leading-tight transition-colors ${isSelected ? 'text-gray-900' : 'text-gray-500'}`}>
                        {localizedName}
                      </h3>

                      {isSelected && (
                        <div className="mt-4 px-4 py-6 bg-gray-50 rounded-[2rem] animate-in zoom-in-95 space-y-4">
                           <div>
                              <div className="flex justify-between text-[10px] font-black uppercase text-gray-400 mb-3 tracking-widest">
                                 <span>{t.qualityVolume}</span>
                                 <span className="text-amore-600 font-mono text-sm">¥{service.currentPrice.toLocaleString()} {isPerTableItem ? '/ ' + t.table : ''}</span>
                              </div>
                              <input 
                                type="range" 
                                min={service.minPrice} 
                                max={service.maxPrice} 
                                step={5000} 
                                value={service.currentPrice}
                                onChange={(e) => updateAmorePrice(service.id, parseInt(e.target.value))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-amore-500 mb-2"
                              />
                              <div className="flex justify-between text-[9px] text-gray-400 font-mono">
                                <span>¥{service.minPrice.toLocaleString()}</span>
                                <span>¥{service.maxPrice.toLocaleString()}</span>
                              </div>
                           </div>
                           
                           {['1', 'amore_main_fl', '2', 'dress', 'makeup'].includes(service.id) && (
                              <div className="text-center text-xs text-amore-700 font-semibold bg-amore-100/70 p-3 rounded-lg border border-amore-100 italic">
                                {getAmoreOptionText(service)}
                              </div>
                           )}

                           {isSelected && isPerTableItem && (
                              <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                                 <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{t.table} Count</span>
                                 <div className="flex items-center gap-4">
                                    <button onClick={() => updateAmoreQty(service.id, -1)} className="text-amore-600 bg-white p-2 rounded-xl shadow-sm border border-gray-100 hover:bg-rose-50"><Minus size={14} /></button>
                                    <span className="text-lg font-bold font-mono">{service.quantity || 1}</span>
                                    <button onClick={() => updateAmoreQty(service.id, 1)} className="text-amore-600 bg-white p-2 rounded-xl shadow-sm border border-gray-100 hover:bg-rose-50"><Plus size={14} /></button>
                                 </div>
                              </div>
                           )}
                        </div>
                      )}

                      {!isSelected && (
                         <div className="text-xl font-mono font-bold text-gray-300 mb-6">
                            ¥{service.minPrice.toLocaleString()} ~
                         </div>
                      )}

                      {isExpanded && (
                        <div className="mt-6 p-4 bg-rose-50/50 rounded-2xl animate-in slide-in-from-top-2 border border-rose-100">
                           <p className="text-xs text-gray-600 leading-relaxed italic">{original?.info?.[language] || original?.info?.en}</p>
                        </div>
                      )}
                    </div>

                    <div className="p-4 bg-gray-50/50 rounded-b-[2.5rem] border-t border-gray-100">
                      <button 
                        onClick={() => toggleAmoreService(service.id)}
                        className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all duration-300 ${isSelected ? 'bg-white border border-rose-200 text-rose-500 hover:bg-rose-50' : 'bg-gray-900 text-white hover:bg-black shadow-lg'}`}
                      >
                        {isSelected ? <><X size={18} />{t.removeFromEstimate}</> : <><Plus size={18} />{t.addToEstimate}</>}
                      </button>
                    </div>
                  </div>
                );
              })}
           </div>

           <div className="flex justify-center pt-12">
              <button onClick={() => setActiveTab('options')} className="bg-gray-900 text-white px-8 sm:px-12 py-4 sm:py-5 rounded-2xl font-bold flex items-center gap-3 hover:bg-black transition-all shadow-xl group">
                 {t.nextStepOptions} <ChevronRight className="group-hover:translate-x-1 transition-transform" />
              </button>
           </div>
        </div>
        
        <div className={activeTab === 'options' ? 'block space-y-12 animate-in' : 'hidden'}>
           <header className="text-center max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-serif font-bold">{t.additionalOptionsTitle}</h2>
              <p className="text-gray-500 mt-2 text-sm sm:text-base">{t.additionalOptionsDesc}</p>
           </header>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {ADDITIONAL_OPTIONS_DATA.map(item => {
                 const itemNameEn = item.name.en;
                 const selectedItem = quoteItems.find(i => i.name === itemNameEn);
                 const isSelected = !!selectedItem;
                 const isExpanded = expandedInfo === item.id;
                 
                 return (
                  <div key={item.id} className={`group relative flex flex-col rounded-[2rem] border-2 transition-all duration-300 ${isSelected ? 'bg-white border-blue-500 shadow-lg ring-1 ring-blue-100' : 'bg-white border-gray-100 hover:border-blue-200 shadow-sm'}`}>
                      <div className="p-6 flex-1">
                          <div className="flex justify-between items-start mb-2">
                             <div className="flex-1">
                                <div className="flex items-center gap-2">
                                   <span className={`font-bold text-base ${isSelected ? 'text-blue-600' : 'text-gray-800'}`}>{item.name[language]}</span>
                                   <button onClick={() => setExpandedInfo(isExpanded ? null : item.id)} className="text-gray-300 hover:text-blue-400 transition-colors">
                                      <HelpCircle size={14} />
                                   </button>
                                </div>
                                <div className="text-[10px] text-gray-400 font-mono mt-1">
                                  {item.minPrice ? `¥${item.minPrice.toLocaleString()} - ¥${item.maxPrice?.toLocaleString()}` : `¥${item.unitPrice.toLocaleString()}`}
                                </div>
                             </div>
                             <button onClick={() => toggleCatalogItem(item)} className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all ${isSelected ? 'bg-blue-500 border-blue-500 text-white' : 'bg-gray-50 border-gray-200 text-gray-300'}`}>
                                {isSelected ? <Check size={18} /> : <Plus size={18} />}
                             </button>
                          </div>
                          
                          {isSelected && (
                            <div className="mt-4 px-3 py-4 bg-blue-50/50 rounded-xl space-y-3 animate-in zoom-in-95">
                               {item.minPrice && (
                                 <div>
                                   <div className="flex justify-between text-[10px] font-black uppercase text-gray-400 mb-1">
                                       <span>{t.qualityVolume}</span>
                                       <span className="text-blue-600 font-mono">¥{selectedItem?.unitPrice.toLocaleString()}</span>
                                   </div>
                                   <input 
                                     type="range" 
                                     min={item.minPrice} 
                                     max={item.maxPrice} 
                                     step={1000} 
                                     value={selectedItem?.unitPrice || item.minPrice}
                                     onChange={(e) => updateItemPrice(itemNameEn, parseInt(e.target.value))}
                                     className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                   />
                                 </div>
                               )}
                               
                               {item.allowQtyEdit && (
                                  <div className="flex items-center justify-between bg-white rounded-lg p-2 border border-blue-100">
                                     <span className="text-[10px] font-black uppercase text-gray-400">{t.quantity}</span>
                                     <div className="flex items-center gap-3">
                                        <button onClick={() => updateItemQty(itemNameEn, -1)} className="text-blue-600 hover:bg-blue-50 p-1 rounded"><Minus size={12} /></button>
                                        <span className="text-xs font-bold font-mono">{selectedItem?.quantity}</span>
                                        <button onClick={() => updateItemQty(itemNameEn, 1)} className="text-blue-600 hover:bg-blue-50 p-1 rounded"><Plus size={12} /></button>
                                     </div>
                                  </div>
                               )}

                               {item.isPerGuest && (
                                  <div className="flex items-center gap-2 text-[10px] text-blue-600 font-medium">
                                    <Users size={12} />
                                    <span>x {venueInfo.guestCount} {t.perPerson}</span>
                                  </div>
                               )}
                            </div>
                          )}
                          
                          {isExpanded && (
                            <div className="mt-4 pt-3 border-t border-gray-100">
                               <p className="text-[11px] text-gray-500 leading-relaxed italic">{item.info?.[language] || item.info?.['en']}</p>
                            </div>
                          )}
                      </div>
                  </div>
                 );
              })}
           </div>

           <div className="flex justify-center pt-12">
              <button onClick={() => setActiveTab('preview')} className="bg-amore-600 text-white px-12 sm:px-16 py-5 sm:py-6 rounded-3xl font-serif text-xl sm:text-2xl font-bold flex items-center gap-4 hover:bg-amore-700 hover:scale-105 transition-all shadow-2xl shadow-amore-200 group">
                 {t.generateSummary} <ChevronRight className="group-hover:translate-x-2 transition-transform" />
              </button>
           </div>
        </div>

        <div className={activeTab === 'preview' ? 'block animate-in fade-in' : 'hidden'}>
           <div id="quote-content" className="bg-white p-6 sm:p-12 rounded-[3rem] shadow-2xl max-w-[900px] mx-auto border border-gray-100">
              <section className="text-center border-b-2 border-gray-50 pb-8 sm:pb-12 mb-8 sm:mb-12 space-y-8">
                 <div className="flex justify-center">
                    <div className="w-16 h-16 bg-amore-50 rounded-2xl flex items-center justify-center">
                       <Heart className="text-amore-500 fill-amore-500" size={32} />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <h1 className="text-4xl sm:text-5xl font-serif font-bold text-gray-900">{t.title}</h1>
                    <p className="text-gray-400 tracking-widest uppercase text-[10px] font-black">{t.guestCount}: {venueInfo.guestCount} Guests • {t.date}: {todayDate}</p>
                    {venueInfo.name && <p className="text-amore-600 font-serif text-lg italic mt-2">Venue: {venueInfo.name}</p>}
                 </div>
                 
                 <div className="bg-rose-50/50 border border-rose-100 p-6 rounded-3xl mx-auto max-w-2xl">
                    <p className="text-amore-700 text-sm italic leading-relaxed">
                       {t.appIntro}
                    </p>
                 </div>
              </section>

              <div className="space-y-16 mb-20 px-4 sm:px-8">
                 {Object.entries(groupedFinalItems).map(([category, { venue, amore }]) => {
                   if (venue.length === 0 && amore.length === 0) return null;
                   return (
                     <div key={category} className="break-inside-avoid group">
                        <div className="flex items-center gap-4 mb-6">
                           <div className="h-px flex-1 bg-gray-100 group-hover:bg-amore-200 transition-colors"></div>
                           <h3 className="text-[10px] font-black text-gray-300 group-hover:text-amore-400 uppercase tracking-[0.3em] transition-colors">{t.categories[category]}</h3>
                           <div className="h-px flex-1 bg-gray-100 group-hover:bg-amore-200 transition-colors"></div>
                        </div>
                        <div className="space-y-8">
                           {venue.map(item => {
                             // Check in both main catalog and additional options
                             const originalCatItem = MENU_CATALOG.find(c => c.name.en === item.name) || ADDITIONAL_OPTIONS_DATA.find(c => c.name.en === item.name);
                             const itemDescription = originalCatItem?.info?.[language] || item.description || originalCatItem?.info?.en;
                             return (
                              <div key={item.id} className="space-y-1">
                                <div className="flex justify-between items-baseline">
                                   <div className="flex flex-col">
                                      <span className="font-serif text-lg sm:text-xl text-gray-800">{originalCatItem?.name[language] || item.name}</span>
                                      <span className="text-[10px] text-gray-400 font-mono mt-1">¥{item.unitPrice.toLocaleString()} {item.quantity > 1 ? `x ${item.quantity}` : ''}</span>
                                   </div>
                                   <span className="font-mono font-bold text-base sm:text-lg">¥{(item.unitPrice * item.quantity).toLocaleString()}</span>
                                </div>
                                {itemDescription && (
                                  <p className="text-xs text-gray-500 italic mt-1 pl-4 border-l-2 border-gray-100 leading-relaxed">
                                    {itemDescription}
                                  </p>
                                )}
                              </div>
                             );
                           })}
                           {amore.map(item => {
                             const isPerTable = item.id === 'amore_guest_fl';
                             const totalItemPrice = item.currentPrice * (item.quantity || 1);
                             const optionDesc = getAmoreOptionText(item);
                             const baseInfo = item.info?.[language] || item.info?.en;
                             return (
                              <div key={item.id} className="space-y-2">
                                <div className="flex justify-between items-baseline text-amore-700 bg-amore-50/30 px-4 sm:px-6 py-4 -mx-4 sm:-mx-6 rounded-3xl border border-amore-50">
                                   <div className="flex flex-col">
                                      <span className="font-serif text-lg sm:text-xl font-bold">{getServiceName(item.id)}</span>
                                      {isPerTable && <span className="text-[10px] text-amore-400 font-mono mt-1">¥{item.currentPrice.toLocaleString()} x {item.quantity} {t.table}</span>}
                                   </div>
                                   <span className="font-mono font-bold text-lg sm:text-xl">¥{totalItemPrice.toLocaleString()}</span>
                                </div>
                                <div className="flex flex-col gap-1 pl-4 border-l-2 border-amore-100">
                                  {optionDesc && (
                                    <p className="text-xs text-amore-600/80 italic font-bold leading-relaxed">
                                      {optionDesc}
                                    </p>
                                  )}
                                  {baseInfo && (
                                    <p className="text-[10px] text-gray-400 italic leading-relaxed">
                                      {baseInfo}
                                    </p>
                                  )}
                                </div>
                              </div>
                             );
                           })}
                        </div>
                     </div>
                   );
                 })}
              </div>

              <div className="mb-12 px-4 sm:px-8">
                 <div className="bg-amber-50 border border-amber-100 p-6 sm:p-8 rounded-[2.5rem] flex items-start gap-5 shadow-sm">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm shrink-0">
                       <MessageCircle className="text-amber-500" size={24} />
                    </div>
                    <div className="space-y-2">
                       <h4 className="font-bold text-amber-800 text-base sm:text-lg">Budget Friendly Planning</h4>
                       <p className="text-amber-700/80 text-sm leading-relaxed italic">{t.budgetFriendlyNote}</p>
                    </div>
                 </div>
              </div>

              <section className="bg-gray-900 text-white rounded-[2rem] sm:rounded-[4rem] p-8 sm:p-16 shadow-2xl relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-amore-500/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 relative z-10">
                    <div className="space-y-6">
                       <h3 className="text-4xl md:text-5xl font-serif font-bold text-amore-400 leading-tight">{t.totalEstimate}</h3>
                       <p className="text-gray-400 text-xs leading-relaxed max-w-xs">{t.disclaimer}</p>
                    </div>
                    <div className="text-right space-y-8 self-end">
                       <div className="text-gray-400 space-y-3">
                          <div className="flex justify-between items-center border-b border-gray-800 pb-3"> 
                            <span className="text-[10px] uppercase tracking-widest font-bold">{t.subtotal}</span> 
                            <span className="text-white font-mono text-lg sm:text-xl font-bold">¥{subtotalBeforeTax.toLocaleString()}</span> 
                          </div>
                          <div className="flex justify-between items-center"> 
                            <span className="text-[10px] uppercase tracking-widest font-bold">{t.tax}</span> 
                            <span className="text-white font-mono text-lg sm:text-xl font-bold">¥{taxAmount.toLocaleString()}</span> 
                          </div>
                       </div>
                       <div className="text-5xl sm:text-6xl md:text-7xl font-serif font-bold text-white tracking-tighter shadow-amore-500/20 drop-shadow-2xl">¥{Math.floor(grandTotal).toLocaleString()}</div>
                    </div>
                 </div>
              </section>

              {/* Branding and timestamp footer for the download */}
              <div className="mt-12 pt-8 border-t border-gray-50 flex flex-col sm:flex-row justify-between items-center gap-4 text-gray-400 text-[10px] font-bold uppercase tracking-widest italic">
                  <div className="flex items-center gap-2">
                    <Heart size={12} className="text-amore-500 fill-amore-500" />
                    <span>{t.amoreTokyo}</span>
                  </div>
                  {downloadTime && (
                    <div className="flex items-center gap-2">
                      <Clock size={12} />
                      <span>{t.generatedOn}: {downloadTime}</span>
                    </div>
                  )}
              </div>
           </div>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 w-full z-50 no-print">
        <div className="max-w-7xl mx-auto px-2 sm:px-0">
            <div className="bg-white/95 backdrop-blur-xl border-t border-x border-gray-100 rounded-t-3xl shadow-[0_-20px_50px_rgba(0,0,0,0.08)] p-2 sm:p-3 flex flex-col gap-2">
                <div className="grid grid-cols-1 sm:grid-cols-5 items-center gap-3 sm:gap-4">
                    <div className="col-span-1 hidden sm:flex items-center gap-2 text-gray-500">
                        <Users size={20} />
                        <span className="text-sm font-bold uppercase tracking-wider">{t.guestCount}</span>
                    </div>
                    <div className="col-span-1 sm:hidden flex justify-between items-center">
                        <span className="text-xs font-bold uppercase tracking-wider text-gray-500">{t.guestCount}</span>
                        <span className="text-xl font-serif font-bold text-amore-600">{venueInfo.guestCount}</span>
                    </div>
                    <div className="sm:col-span-3 flex-1 flex items-center gap-4">
                        <button onClick={() => setVenueInfo(p => ({...p, guestCount: Math.max(10, p.guestCount - 1)}))} className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"><Minus size={16} /></button>
                        <input 
                          type="range"
                          min="10"
                          max="200"
                          value={venueInfo.guestCount}
                          onChange={(e) => setVenueInfo(p => ({ ...p, guestCount: Number(e.target.value) }))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-amore-500"
                        />
                        <button onClick={() => setVenueInfo(p => ({...p, guestCount: Math.min(200, p.guestCount + 1)}))} className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"><Plus size={16} /></button>
                    </div>
                    <div className="col-span-1 text-right hidden sm:block">
                        <span className="text-2xl font-serif font-bold text-amore-600">{venueInfo.guestCount}</span>
                    </div>
                </div>

                <div className="border-b border-gray-100 !my-2"></div>

                <div className="flex flex-col md:flex-row justify-between items-center gap-3">
                   <div className="flex items-center gap-4 sm:gap-8 w-full md:w-auto">
                      <div className="shrink-0">
                         <span className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mb-1 block">{t.estimateTotal}</span>
                         <div className={`text-2xl sm:text-3xl font-serif font-bold ${isOverBudget ? 'text-red-500' : 'text-amore-600'}`}>¥{Math.floor(grandTotal).toLocaleString()}</div>
                      </div>
                      <div className="hidden lg:block flex-1 min-w-[300px]">
                         <div className="flex justify-between text-[10px] font-black mb-2 uppercase tracking-widest">
                            <span className="text-gray-400">{t.budgetStatus}</span>
                            <span className={isOverBudget ? 'text-red-500' : 'text-amore-500'}>{budgetUsage.toFixed(0)}% used</span>
                         </div>
                         <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                            <div className={`h-full transition-all duration-700 cubic-bezier(0.4, 0, 0.2, 1) ${isOverBudget ? 'bg-red-500' : 'bg-amore-500 shadow-[0_0_15px_rgba(244,63,94,0.4)]'}`} style={{ width: `${Math.min(budgetUsage, 100)}%` }}></div>
                         </div>
                      </div>
                   </div>
                   <div className="flex gap-2 sm:gap-4 w-full md:w-auto">
                      <button 
                        onClick={() => setActiveTab('preview')} 
                        className={`flex-1 md:flex-none px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'preview' ? 'bg-amore-600 text-white shadow-xl scale-105' : 'bg-white border border-gray-200 text-gray-700 hover:border-amore-300'}`}
                      > 
                        {t.viewDocument} 
                      </button>
                      <button onClick={handleDownloadImage} disabled={capturing} className="bg-gray-900 text-white px-5 sm:px-6 py-2 sm:py-3 rounded-xl hover:bg-black transition-all flex items-center justify-center shadow-lg hover:shadow-xl disabled:opacity-50"> 
                        {capturing ? <Loader2 className="animate-spin" /> : <Download size={16} />} 
                      </button>
                   </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
