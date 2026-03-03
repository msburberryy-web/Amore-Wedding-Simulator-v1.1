import React from 'react';

interface RokuyoGlossaryProps {
  language: 'en' | 'ja' | 'my';
  onClose: () => void;
}

const ROKUYO_TERMS = {
  en: [
    { name: 'Taian (大安)', meaning: 'Most lucky day. Good for all events, especially weddings.' },
    { name: 'Tomobiki (友引)', meaning: 'Good luck day, but funerals should be avoided.' },
    { name: 'Sensho (先勝)', meaning: 'Good luck in the morning, bad luck in the afternoon.' },
    { name: 'Sakimake (先負)', meaning: 'Bad luck in the morning, good luck in the afternoon.' },
    { name: 'Shakko (赤口)', meaning: 'Bad luck day, except for noon (11am-1pm).' },
    { name: 'Butsumetsu (仏滅)', meaning: 'Most unlucky day. Best to avoid important events.' },
  ],
  ja: [
    { name: '大安 (Taian)', meaning: '最も吉日。結婚式など、すべてのイベントに適しています。' },
    { name: '友引 (Tomobiki)', meaning: '幸運な日ですが、葬式は避けるべきです。' },
    { name: '先勝 (Sensho)', meaning: '午前は吉、午後は凶。' },
    { name: '先負 (Sakimake)', meaning: '午前は凶、午後は吉。' },
    { name: '赤口 (Shakko)', meaning: '正午（午前11時〜午後1時）を除いて凶日。' },
    { name: '仏滅 (Butsumetsu)', meaning: '最も不吉な日。重要なイベントは避けるのが最善です。' },
  ],
  my: [
    { name: 'Taian (大安)', meaning: 'ကံအကောင်းဆုံးနေ့။ မင်္ဂလာဆောင် အပါအဝင် အခမ်းအနားအားလုံးအတွက် ကောင်းသည်။' },
    { name: 'Tomobiki (友引)', meaning: 'ကံကောင်းသောနေ့ဖြစ်သော်လည်း အသုဘအခမ်းအနားများကို ရှောင်သင့်သည်။' },
    { name: 'Sensho (先勝)', meaning: 'မနက်ပိုင်းတွင် ကံကောင်းပြီး နေ့လည်ပိုင်းတွင် ကံမကောင်းပါ။' },
    { name: 'Sakimake (先負)', meaning: 'မနက်ပိုင်းတွင် ကံမကောင်းပါ၊ နေ့လည်ပိုင်းတွင် ကံကောင်းပါသည်။' },
    { name: 'Shakko (赤口)', meaning: 'နေ့လည် (၁၁ နာရီမှ ၁ နာရီ) မှလွဲ၍ ကံမကောင်းသောနေ့။' },
    { name: 'Butsumetsu (仏滅)', meaning: 'ကံအဆိုးဆုံးနေ့။ အရေးကြီးသောပွဲများကို ရှောင်တာ အကောင်းဆုံးဖြစ်သည်။' },
  ],
};

export const RokuyoGlossary: React.FC<RokuyoGlossaryProps> = ({ language, onClose }) => {
  const terms = ROKUYO_TERMS[language];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl p-6 m-4 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-xl font-bold text-gray-800 mb-4">Rokuyo Glossary</h3>
        <div className="space-y-3">
          {terms.map(term => (
            <div key={term.name}>
              <p className="font-semibold text-gray-700">{term.name}</p>
              <p className="text-sm text-gray-500">{term.meaning}</p>
            </div>
          ))}
        </div>
        <button 
          onClick={onClose} 
          className="mt-6 w-full bg-gray-100 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};
