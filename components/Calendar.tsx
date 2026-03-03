import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import solarLunar from 'solarlunar';

interface CalendarProps {
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
  language: 'en' | 'ja' | 'my';
}

const MONTH_NAMES = {
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  ja: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
  my: ['ဇန်နဝါရီ', 'ဖေဖော်ဝါရီ', 'မတ်', 'ဧပြီ', 'မေ', 'ဇွန်', 'ဇူလိုင်', 'ဩဂုတ်', 'စက်တင်ဘာ', 'အောက်တိုဘာ', 'နိုဝင်ဘာ', 'ဒီဇင်ဘာ'],
};

const DAY_NAMES = {
  en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  ja: ['日', '月', '火', '水', '木', '金', '土'],
  my: ['တနင်္ဂနွေ', 'တနင်္လာ', 'အင်္ဂါ', 'ဗုဒ္ဓဟူး', 'ကြာသပတေး', 'သောကြာ', 'စနေ'],
};

const getRokuyo = (date: Date) => {
  const solarYear = date.getFullYear();
  const solarMonth = date.getMonth() + 1;
  const solarDay = date.getDate();
  const lunarData = solarLunar.solar2lunar(solarYear, solarMonth, solarDay);
  const month = lunarData.lMonth;
  const day = lunarData.lDay;
  const sum = month + day;
  
  const remainder = sum % 6;
  
  switch (remainder) {
    case 0: return { kanji: '大安', en: 'Taian', lucky: true };
    case 1: return { kanji: '赤口', en: 'Shakko', lucky: false };
    case 2: return { kanji: '先勝', en: 'Sensho', lucky: false };
    case 3: return { kanji: '友引', en: 'Tomobiki', lucky: true };
    case 4: return { kanji: '先負', en: 'Sakimake', lucky: false };
    case 5: return { kanji: '仏滅', en: 'Butsumetsu', lucky: false };
    default: return { kanji: '-', en: '-', lucky: false };
  }
};

export const Calendar: React.FC<CalendarProps> = ({ selectedDate, onDateSelect, language }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const changeMonth = (delta: number) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + delta);
      return newDate;
    });
  };

  const renderHeader = () => (
    <div className="flex items-center justify-between py-2 px-1">
      <button onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-gray-100"><ChevronLeft size={20} /></button>
      <div className="font-bold text-lg">
        {MONTH_NAMES[language][currentDate.getMonth()]} {currentDate.getFullYear()}
      </div>
      <button onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-gray-100"><ChevronRight size={20} /></button>
    </div>
  );

  const renderDays = () => (
    <div className="grid grid-cols-7 text-center text-xs text-gray-500 font-semibold">
      {DAY_NAMES[language].map(day => <div key={day} className="py-2">{day}</div>)}
    </div>
  );

  const renderCells = () => {
    const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startDate = new Date(monthStart);
    startDate.setDate(startDate.getDate() - monthStart.getDay());
    const endDate = new Date(monthEnd);
    if (monthEnd.getDay() !== 6) {
        endDate.setDate(endDate.getDate() + (6 - monthEnd.getDay()));
    }

    const rows = [];
    let days = [];
    const day = startDate;

    // Loop through days
    // We need to clone 'day' carefully in the loop
    const loopEnd = new Date(endDate);
    
    while (day <= loopEnd) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = new Date(day);
        const isSelected = selectedDate && cloneDay.toDateString() === selectedDate.toDateString();
        const isCurrentMonth = cloneDay.getMonth() === currentDate.getMonth();
        const isToday = new Date().toDateString() === cloneDay.toDateString();
        
        const rokuyo = getRokuyo(cloneDay);
        const isLucky = rokuyo.lucky;

        days.push(
          <div
            key={day.toString() + i}
            className={`py-1 flex flex-col items-center justify-center cursor-pointer rounded-lg transition-all border border-transparent
              ${isSelected ? 'bg-amore-50 border-amore-200' : 'hover:bg-gray-50'}
              ${!isCurrentMonth ? 'opacity-30' : ''}
            `}
            onClick={() => onDateSelect(cloneDay)}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium mb-0.5
              ${isSelected ? 'bg-amore-500 text-white shadow-md' : (isToday ? 'bg-gray-200 text-gray-900' : 'text-gray-700')}
            `}>
              {cloneDay.getDate()}
            </div>
            <div className={`text-[10px] font-medium ${isLucky ? 'text-amore-600' : 'text-gray-400'}`}>
               {language === 'en' ? rokuyo.en : rokuyo.kanji}
            </div>
          </div>
        );
        day.setDate(day.getDate() + 1);
      }
      rows.push(<div className="grid grid-cols-7 gap-1 mb-1" key={day.toString()}>{days}</div>);
      days = [];
    }
    return <div>{rows}</div>;
  };

  return (
    <div className="max-w-md mx-auto bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
      {renderHeader()}
      {renderDays()}
      {renderCells()}
    </div>
  );
};
