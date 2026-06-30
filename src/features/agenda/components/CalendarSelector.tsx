import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarSelectorProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  activeDates: Set<string>; // formato 'YYYY-MM-DD' local
}

export function CalendarSelector({ selectedDate, onSelectDate, activeDates }: CalendarSelectorProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1));

  const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const days = [];
  // Dias vazios no início
  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`empty-${i}`} className="h-10 w-10"></div>);
  }

  // Dias do mês
  for (let d = 1; d <= daysInMonth; d++) {
    const dateObj = new Date(year, month, d);
    
    // Normalizar a string para comparar sem problema de fuso
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const isSelected = dateObj.toDateString() === selectedDate.toDateString();
    
    const isToday = dateObj.toDateString() === new Date().toDateString();
    const hasEvent = activeDates.has(dateStr);

    let btnClass = "h-10 w-10 rounded-full flex items-center justify-center text-[14px] font-medium transition-all relative ";
    
    if (isSelected) {
      btnClass += "bg-[#8B5CF6] text-white shadow-[0_0_10px_rgba(139,92,246,0.5)]";
    } else if (isToday) {
      btnClass += "border border-[#8B5CF6]/50 text-[#8B5CF6] hover:bg-[#8B5CF6]/10";
    } else {
      btnClass += "text-[#E2E8F0] hover:bg-white/5";
    }

    days.push(
      <button
        key={d}
        onClick={() => onSelectDate(dateObj)}
        className="flex items-center justify-center relative w-full h-10"
      >
        <div className={btnClass}>
          {d}
          {hasEvent && !isSelected && (
            <div className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-[#3B82F6] shadow-[0_0_5px_rgba(59,130,246,0.8)]" />
          )}
          {hasEvent && isSelected && (
            <div className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_5px_rgba(255,255,255,0.8)]" />
          )}
        </div>
      </button>
    );
  }

  return (
    <div className="bg-[#181C28]/80 border border-white/5 backdrop-blur-xl p-5 md:p-6 rounded-3xl shadow-xl w-full">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-white font-bold text-[16px] tracking-wide">
          {monthNames[month]} <span className="text-[#A8B3CF] font-normal">{year}</span>
        </h3>
        <div className="flex items-center gap-2">
          <button onClick={handlePrevMonth} className="p-1.5 rounded-lg hover:bg-white/10 text-[#A8B3CF] transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button onClick={handleNextMonth} className="p-1.5 rounded-lg hover:bg-white/10 text-[#A8B3CF] transition-colors">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Weekdays */}
      <div className="grid grid-cols-7 gap-1 mb-2 text-center">
        {daysOfWeek.map(day => (
          <div key={day} className="text-[#7B879D] text-[12px] font-semibold uppercase tracking-wider h-8 flex items-center justify-center">
            {day}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-y-2 gap-x-1 place-items-center">
        {days}
      </div>

    </div>
  );
}
