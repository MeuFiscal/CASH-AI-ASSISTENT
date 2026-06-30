import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, ChevronDown } from 'lucide-react';

interface CalendarSelectorProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  activeDates: Set<string>; // formato 'YYYY-MM-DD' local
}

export function CalendarSelector({ selectedDate, onSelectDate, activeDates }: CalendarSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1));
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const days = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`empty-${i}`} className="h-8 w-8 sm:h-10 sm:w-10"></div>);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const dateObj = new Date(year, month, d);
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const isSelected = dateObj.toDateString() === selectedDate.toDateString();
    const isToday = dateObj.toDateString() === new Date().toDateString();
    const hasEvent = activeDates.has(dateStr);

    let btnClass = "h-8 w-8 sm:h-10 sm:w-10 rounded-full flex items-center justify-center text-[13px] sm:text-[14px] font-medium transition-all relative ";
    
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
        onClick={(e) => {
          e.stopPropagation();
          onSelectDate(dateObj);
          setIsOpen(false);
        }}
        className="flex items-center justify-center relative w-full h-8 sm:h-10"
      >
        <div className={btnClass}>
          {d}
          {hasEvent && !isSelected && (
            <div className="absolute bottom-0 sm:bottom-1 w-1.5 h-1.5 rounded-full bg-[#3B82F6] shadow-[0_0_5px_rgba(59,130,246,0.8)]" />
          )}
          {hasEvent && isSelected && (
            <div className="absolute bottom-0 sm:bottom-1 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_5px_rgba(255,255,255,0.8)]" />
          )}
        </div>
      </button>
    );
  }

  const displayDate = `${selectedDate.getDate()} de ${monthNames[selectedDate.getMonth()]} de ${selectedDate.getFullYear()}`;

  return (
    <div className="relative w-full md:w-auto" ref={popoverRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full md:w-[300px] bg-[#181C28]/80 border border-white/10 hover:bg-white/5 backdrop-blur-xl px-4 py-3 rounded-2xl transition-colors shadow-lg"
      >
        <div className="flex items-center gap-3 text-white font-medium">
          <CalendarIcon className="w-5 h-5 text-[#8B5CF6]" />
          <span>{displayDate}</span>
        </div>
        <ChevronDown className={`w-5 h-5 text-[#A8B3CF] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 top-full mt-2 left-0 w-full md:w-[340px] bg-[#181C28]/95 border border-white/10 backdrop-blur-2xl p-4 sm:p-5 rounded-3xl shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-white font-bold text-[15px] tracking-wide">
              {monthNames[month]} <span className="text-[#A8B3CF] font-normal">{year}</span>
            </h3>
            <div className="flex items-center gap-1">
              <button onClick={handlePrevMonth} className="p-1.5 rounded-lg hover:bg-white/10 text-[#A8B3CF] transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button onClick={handleNextMonth} className="p-1.5 rounded-lg hover:bg-white/10 text-[#A8B3CF] transition-colors">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2 text-center">
            {daysOfWeek.map(day => (
              <div key={day} className="text-[#7B879D] text-[11px] font-semibold uppercase tracking-wider h-6 flex items-center justify-center">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-y-1 gap-x-1 place-items-center">
            {days}
          </div>
        </div>
      )}
    </div>
  );
}
