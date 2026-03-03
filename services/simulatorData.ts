import { QuoteCategory, VenueSuggestion } from "../types";

export interface CatalogItem {
  id: string;
  category: QuoteCategory | 'Plan' | 'Taxes';
  name: Record<string, string>;
  unitPrice: number;
  isPerGuest: boolean;
  defaultQty: number;
  allowQtyEdit?: boolean;
  description?: string;
  info?: Record<string, string>;
  minPrice?: number;
  maxPrice?: number;
}

export const VENUE_LIST: VenueSuggestion[] = [
  // --- TOKYO AREA (Central / Highly Requested) ---
  {
    id: 'tokyo-chinzanso',
    name: 'Hotel Chinzanso Tokyo',
    location: 'Bunkyo-ku, Tokyo',
    avgPricePerPerson: 42000,
    style: 'Luxury Hotel / Garden',
    description: {
      en: 'A legendary hotel known for its massive, historic Japanese garden and world-class hospitality.',
      ja: '広大な由緒ある日本庭園と、世界クラスのホスピタリティで知られる東京を代表するラグジュアリーホテル。',
      my: 'သမိုင်းဝင် ဂျပန်ဥယျာဉ်ကြီးနှင့် ကမ္ဘာ့အဆင့်မီ ဝန်ဆောင်မှုကြောင့် လူသိများသော တိုကျို၏ နာမည်ကြီး ဟိုတယ်ကြီး။'
    }
  },
  {
    id: 'tokyo-gajoen',
    name: 'Hotel Gajoen Tokyo',
    location: 'Meguro-ku, Tokyo',
    avgPricePerPerson: 45000,
    style: 'Art Museum / Traditional',
    description: {
      en: 'Known as the "Museum of Japanese Beauty," featuring breathtaking ornate art and traditional aesthetics.',
      ja: '「昭和の竜宮城」と称される、豪華絢爛な美術品に彩られた日本初の総合結婚式場。',
      my: 'ဂျပန်အနုပညာပြတိုက်သဖွယ် လှပဆန်းသစ်သော အလှဆင်မှုများရှိသည့် မီဂူရိုရှိ နာမည်ကြီးနေရာ။'
    }
  },
  {
    id: 'tokyo-palace',
    name: 'Palace Hotel Tokyo',
    location: 'Chiyoda-ku, Tokyo',
    avgPricePerPerson: 55000,
    style: 'Luxury / Imperial View',
    description: {
      en: 'Ultra-luxury hotel overlooking the Imperial Palace gardens, offering the pinnacle of Japanese hospitality.',
      ja: '皇居の緑を望む絶好のロケーション。日本の「おもてなし」の真髄を体験できる至高のホテル。',
      my: 'နန်းတော်ဥယျာဉ်ကို မြင်ရသည့် အလွန်ဇိမ်ခံသော ဟိုတယ်ဖြစ်ပြီး အကောင်းဆုံး ဝန်ဆောင်မှုပေးသည်။'
    }
  },
  {
    id: 'tokyo-grand-ginza',
    name: 'THE GRAND GINZA (GINZA SIX)',
    location: 'Chuo-ku, Tokyo',
    avgPricePerPerson: 38000,
    style: 'Luxury Lounge / Ginza',
    description: {
      en: 'Located at the top of GINZA SIX, offering a sophisticated and modern adult wedding experience.',
      ja: 'GINZA SIXの最上階。銀座の街並みを望む、洗練された大人のためのモダン・ラグジュアリー。',
      my: 'GINZA SIX ၏ အပေါ်ဆုံးထပ်တွင် တည်ရှိပြီး ခေတ်မီဆန်းသစ်သော မြို့ပြမင်္ဂလာပွဲများအတွက် အကောင်းဆုံး။'
    }
  },
  {
    id: 'tokyo-aoyama-geihinkan',
    name: 'Aoyama Geihinkan',
    location: 'Minato-ku, Tokyo',
    avgPricePerPerson: 40000,
    style: 'Mansion / Retractable Roof',
    description: {
      en: 'A high-end mansion in Minato with a famous retractable chapel roof that opens to the sky.',
      ja: '青山の閑静な住宅街に佇む白亜の邸宅。開閉式のチャペル天井から降り注ぐ光の演出が有名。',
      my: 'အိုယားမားရှိ အမိုးဖွင့်နိုင်သော ဝတ်ပြုဆောင်ပါရှိသည့် ခမ်းနားသော အိမ်ဂေဟာစတိုင်နေရာ။'
    }
  },
  {
    id: 'tokyo-classica-omotesando',
    name: 'CLASSICA Omotesando',
    location: 'Shibuya-ku, Tokyo',
    avgPricePerPerson: 36000,
    style: 'Modern Japanese / Architecture',
    description: {
      en: 'A beautiful blend of Japanese tradition and modern architecture in the heart of Omotesando.',
      ja: '表参道にありながら、古都の趣と現代美が融合した、独創的な建築美を誇る邸宅ウェディング。',
      my: 'အိုမိုတဲဆန်ဒိုတွင် ဂျပန်ရိုးရာနှင့် ခေတ်မီဗိသုကာပညာကို ပေါင်းစပ်ထားသည့် လှပသောနေရာ။'
    }
  },
  {
    id: 'tokyo-happoen',
    name: 'Happo-en',
    location: 'Minato-ku, Tokyo',
    avgPricePerPerson: 38000,
    style: 'Traditional / Garden',
    description: {
      en: 'One of Tokyo\'s most famous wedding venues featuring a 400-year-old Japanese garden.',
      ja: '400年の歴史を持つ日本庭園を舞台にした、日本を代表する結婚式場のひとつ。',
      my: 'နှစ်ပေါင်း ၄၀၀ သက်တမ်းရှိ ဂျပန်ဥယျာဉ်ပါရှိသည့် တိုကျို၏ အကျော်ကြားဆုံး မင်္ဂလာဆောင် ခန်းမတစ်ခု။'
    }
  },
  {
    id: 'tokyo-trunk',
    name: 'TRUNK(HOTEL)',
    location: 'Shibuya-ku, Tokyo',
    avgPricePerPerson: 34000,
    style: 'Boutique / Social',
    description: {
      en: 'A trendy boutique hotel in Shibuya focusing on social contribution and high-end design.',
      ja: '渋谷にある、ソーシャライジングをコンセプトにした、デザイン性の高いブティックホテル。',
      my: 'Shibuya ရှိ ဒီဇိုင်းပိုင်း အလွန်ကောင်းမွန်ပြီး ခေတ်မီဆန်းသစ်သော ဘူးတစ်ဟိုတယ် (Boutique Hotel)။'
    }
  },
  {
    id: 'tokyo-landmark-square',
    name: 'The Landmark Square Tokyo',
    location: 'Minato-ku, Tokyo',
    avgPricePerPerson: 31000,
    style: 'Modern / Skyscraper',
    description: {
      en: 'Dynamic city views from Shinagawa, offering a modern, cosmopolitan wedding atmosphere.',
      ja: '品川駅直結。東京のパノラマラビューと、モダンでダイナミックな空間がゲストを圧倒します。',
      my: 'ရှင်နာဂါဝါတွင် တရှိပြီး တိုကျိုမြို့၏ မြင်ကွင်းကျယ်ကို ကြည့်နိုင်သည့် ခေတ်မီခန်းမ။'
    }
  },
  {
    id: 'tokyo-barkers-ebisu',
    name: 'Barker\'s Ebisu (SHOWCASE)',
    location: 'Shibuya-ku, Tokyo',
    avgPricePerPerson: 22000,
    style: 'Artistic / Boutique',
    description: {
      en: 'A unique, artistic space in Ebisu perfect for custom DIY weddings and creative couples.',
      ja: '恵比寿にある、アートと遊び心が詰まった空間。自分たちらしい自由な演出が叶う場所。',
      my: 'အဲဘိဆုရှိ အနုပညာဆန်ပြီး မိမိစိတ်ကြိုက် ဖန်တီးနိုင်သည့် ထူးခြားသောနေရာ။'
    }
  },
  {
    id: 'tokyo-meiji-kinenkan',
    name: 'Meiji Kinenkan',
    location: 'Minato-ku, Tokyo',
    avgPricePerPerson: 34000,
    style: 'Imperial / Historic',
    description: {
      en: 'A historic venue originally part of the Imperial Palace, offering elegant banquets and gardens.',
      ja: '明治神宮の結婚式場。広大な芝生庭園と、明治の面影を残す歴史的な名建築が魅力。',
      my: 'နန်းတော်၏ အစိတ်အပိုင်းတစ်ခုဖြစ်ခဲ့သည့် သမိုင်းဝင်နေရာဖြစ်ပြီး လှပသော ဥယျာဉ်နှင့် ခန်းမများရှိသည်။'
    }
  },

  // --- KANAGAWA / YOKOHAMA AREA ---
  {
    id: 'kanagawa-royal-park',
    name: 'Yokohama Royal Park Hotel',
    location: 'Yokohama, Kanagawa',
    avgPricePerPerson: 36000,
    style: 'Sky Luxury / Hotel',
    description: {
      en: 'A wedding in the sky, located in Japan\'s landmark tower with panoramic views of the bay.',
      ja: '横浜ランドマークタワー内に位置する「天空のウェディング」。圧倒的な眺望がゲストを魅了します。',
      my: 'ဂျပန်နိုင်ငံ၏ အထင်ကရမျှော်စင်တွင် တည်ရှိပြီး ပင်လယ်အလှကို အပေါ်စီးမှ မြင်နိုင်သည့် ကောင်းကင်ယံ မင်္ဂလာပွဲ။'
    }
  },
  {
    id: 'kanagawa-intercon',
    name: 'InterContinental Yokohama Grand',
    location: 'Yokohama, Kanagawa',
    avgPricePerPerson: 34000,
    style: 'Classic / Waterfront',
    description: {
      en: 'The iconic sail-shaped hotel of Minato Mirai, offering elegant waterfront ceremonies.',
      ja: 'みなとみらいのシンボル、ヨットの帆を模した外観が印象的な国際的ラグジュアリーホテル。',
      my: 'Minato Mirai ၏ သင်္ကေတဖြစ်သော ရွက်လှေပုံစံ ဟိုတယ်တွင် ကျင်းပနိုင်သည့် ခန့်ညားသော မင်္ဂလာပွဲ။'
    }
  },
  {
    id: 'kanagawa-casa',
    name: 'Casa d\'Angela',
    location: 'Yokohama, Kanagawa',
    avgPricePerPerson: 27000,
    style: 'Grand Cathedral',
    description: {
      en: 'A majestic venue featuring one of the largest cathedrals in the Kanto region with authentic stained glass.',
      ja: '本物のステンドグラスと圧倒的なスケールを誇る大聖堂が魅力の、本格的な教会ウェディング。',
      my: 'လှပသော ရောင်စုံမှန်စီရွှေချများနှင့် ခန့်ညားသော ဝတ်ပြုဆောင်ပါရှိသည့် နေရာ။'
    }
  },
  {
    id: 'kanagawa-grand-orient',
    name: 'Grand Orient Yokohama',
    location: 'Yokohama, Kanagawa',
    avgPricePerPerson: 28000,
    style: 'Modern / View',
    description: {
      en: 'A stunning Minato Mirai venue featuring a transparent chapel and 360-degree ocean views.',
      ja: 'みなとみらいの絶景を独占。全面ガラス張りのチャペルと開放感溢れる空間が魅力。',
      my: 'Minato Mirai ၏ အလှကို တွေ့မြင်နိုင်သည့် ဖန်သားဝတ်ပြုဆောင်နှင့် ၃၆၀ ဒီဂရီ ပင်လယ်ရှုခင်း။'
    }
  },
  {
    id: 'kanagawa-geihinkan',
    name: 'Yokohama Geihinkan',
    location: 'Yokohama, Kanagawa',
    avgPricePerPerson: 26000,
    style: 'Traditional / Elegant',
    description: {
      en: 'Located on a hill in Nogeyama, this venue offers timeless elegance and seasonal beauty.',
      ja: '野毛山の丘の上に建つ、横浜の迎賓館。四季折々の自然と上質なホスピタリティが魅力。',
      my: 'Yokohama တောင်ကုန်းပေါ်ရှိ ခေတ်အဆက်ဆက် ခန့်ညားမှုရှိပြီး သဘာဝအလှနှင့် ပြည့်စုံသော ခန်းမ။'
    }
  },
  {
    id: 'kanagawa-hotel-new-grand',
    name: 'Hotel New Grand',
    location: 'Yokohama, Kanagawa',
    avgPricePerPerson: 32000,
    style: 'Historic / Classic',
    description: {
      en: 'Historic hotel in Yokohama known for its classic European architecture and prestige.',
      ja: '横浜・山下公園前に位置する、クラシックで重厚な歴史と伝統を誇る名門ホテル。',
      my: 'Yokohama ရှိ သမိုင်းဝင်ပြီး ခန့်ညားထည်ဝါသော ဥရောပစတိုင် ဟိုတယ်ကြီး။'
    }
  },
  {
    id: 'kanagawa-scapes',
    name: 'SCAPES THE SUITE',
    location: 'Hayama, Kanagawa',
    avgPricePerPerson: 28000,
    style: 'Beach Resort / Boutique',
    description: {
      en: 'A boutique luxury hotel in Hayama with breathtaking sunset views over the Morito coast.',
      ja: '葉山の森戸海岸に面した、絶景の夕日を望む大人の隠れ家的なコンパクトラグジュアリー。',
      my: 'Hayama ပင်လယ်ကမ်းခြေရှိ နေဝင်ချိန်အလှကို ခံစားနိုင်သည့် ဇိမ်ခံဟိုတယ်စတိုင် ခန်းမ။'
    }
  },
  {
    id: 'kanagawa-kamakura-prince',
    name: 'Kamakura Prince Hotel',
    location: 'Kamakura, Kanagawa',
    avgPricePerPerson: 28000,
    style: 'Ocean Resort / Hotel',
    description: {
      en: 'Overlooking Shichirigahama beach with views of Enoshima and Mt. Fuji on clear days.',
      ja: '七里ヶ浜の海を一望。江の島や富士山を望む絶景の中でのリゾートウェディング。',
      my: 'Shichirigahama ကမ်းခြေကို မြင်နိုင်ပြီး ကြည်လင်သောနေ့များတွင် ဖူဂျီတောင်ကို မြင်နိုင်သည့်နေရာ။'
    }
  },
  {
    id: 'kanagawa-matsubaraan',
    name: 'Kamakura Matsubara-an',
    location: 'Kamakura, Kanagawa',
    avgPricePerPerson: 20000,
    style: 'Traditional / Restaurant',
    description: {
      en: 'A historic Japanese house turned high-end Soba restaurant, offering an intimate traditional vibe.',
      ja: '古民家を改装した隠れ家レストラン。鎌倉らしい情緒溢れる大人の隠れ家パーティーに。',
      my: 'ရှေးဟောင်းဂျပန်အိမ်ကို အဆင့်မြင့်စားသောက်ဆိုင်အဖြစ် ပြောင်းလဲထားသည့် သီးသန့်နေရာ။'
    }
  }
];

export const MENU_CATALOG: CatalogItem[] = [
  // PLAN & VENUE
  { 
    id: 'venue_package_per_person', category: QuoteCategory.VENUE_FEE, 
    name: { en: 'Venue Service Package (Per Person)', ja: '会場サービスパッケージ (1名様あたり)', my: 'ခန်းမဝန်ဆောင်မှု Package (တစ်ဦးလျှင်)' },
    unitPrice: 15000, isPerGuest: true, defaultQty: 1,
    minPrice: 10000,
    maxPrice: 60000, 
    info: { en: "A simplified all-inclusive rate covering venue rental, basic staff, and facility usage.", ja: "会場使用料、基本スタッフ、設備利用を含んだシンプルな1名あたりの一律料金です。", my: "ခန်းမငှားရမ်းခ၊ အခြေခံဝန်ထမ်းနှင့် အဆောက်အအုံ အသုံးပြုခများ ပါဝင်သော ရိုးရှင်းသော တစ်ဦးလျှင် တစ်ပြေးညီနှုန်းထား။" }
  },
  { 
    id: 'venue_rental', category: QuoteCategory.VENUE_FEE, 
    name: { en: 'Venue Rental & Service fees', ja: '会場使用料・サービス料', my: 'ခန်းမငှားရမ်းခနှင့် ဝန်ဆောင်ခ' },
    unitPrice: 150000, isPerGuest: false, defaultQty: 1,
    minPrice: 150000,
    maxPrice: 400000,
    info: { en: "Base rental fee for the reception hall and general staff service.", ja: "披露宴会場の使用料と一般的なサービス料です。", my: "ခန်းမငှားရမ်းခနှင့် ဝန်ထမ်းဝန်ဆောင်မှု စရိတ်များ။" }
  },
  { 
    id: 'chapel_usage', category: QuoteCategory.VENUE_FEE, 
    name: { en: 'Chapel Usage fees', ja: '挙式料 (チャペル)', my: 'ဝတ်ပြုဆောင် အသုံးပြုခ' },
    unitPrice: 100000, isPerGuest: false, defaultQty: 1,
    minPrice: 100000,
    maxPrice: 250000,
    info: { en: "Rental and arrangement fee for the ceremony chapel.", ja: "挙式会場（チャペル）の利用および手配料です。", my: "မင်္ဂလာအခမ်းအနား ကျင်းပမည့် ဝတ်ပြုဆောင် အသုံးပြုခ။" }
  },
  
  // FOOD & DRINK
  { 
    id: 'f_range', category: QuoteCategory.FOOD_DRINK, 
    name: { en: 'Venue Food Menu (Buffet/Course)', ja: 'お料理 (ビュッフェ/コース)', my: 'အစားအသောက် မီနူး' },
    unitPrice: 11000, isPerGuest: true, defaultQty: 1,
    minPrice: 8800,
    maxPrice: 19000,
    info: { en: "Cuisine selection range.", ja: "お料理コースの選択幅です。", my: "အစားအသောက် ရွေးချယ်နိုင်သော ဈေးနှုန်းများ။" }
  },
  { 
    id: 'f2', category: QuoteCategory.FOOD_DRINK, 
    name: { en: 'Drinks (Free Drink Plan)', ja: 'お飲み物 (フリードリンク)', my: 'အချိုရည်နှင့် အဖျော်ယမကာ' },
    unitPrice: 3800, isPerGuest: true, defaultQty: 1,
    minPrice: 500,
    maxPrice: 8000,
    info: { en: "Standard drink package including alcoholic and soft drinks.", ja: "アルコールとソフトドリンクを含む標準的なドリンクパックです。", my: "အရက်နှင့် အအေးများ ပါဝင်သော အဖျော်ယမကာ အစီအစဉ်။" }
  },

  // ATTIRE & BEAUTY
  { 
    id: 'groom_hdl_w', category: QuoteCategory.ATTIRE_BEAUTY, 
    name: { en: 'Groom: Handling Fee (Western)', ja: '新郎洋装持込料', my: 'သတို့သား ဝတ်စုံခ (အနောက်တိုင်း)' },
    unitPrice: 15000, isPerGuest: false, defaultQty: 1,
    info: { en: "Handling fee for brought-in Tuxedo.", ja: "新郎洋装持ち込み料です。", my: "ပြင်ပမှ သတို့သား ဝတ်စုံ ယူဆောင်လာခ။" }
  },
  { 
    id: 'bride_hdl_w', category: QuoteCategory.ATTIRE_BEAUTY, 
    name: { en: 'Bride: Handling Fee (Western)', ja: '新婦洋装持込料', my: 'သတို့သမီး ဝတ်စုံခ (အနောက်တိုင်း)' },
    unitPrice: 30000, isPerGuest: false, defaultQty: 1,
    info: { en: "Handling fee for brought-in Wedding Dress.", ja: "新婦洋装（ドレス）持ち込み料です。", my: "ပြင်ပမှ သတို့သမီး ဝတ်စုံ ယူဆောင်လာခ။" }
  }
];
