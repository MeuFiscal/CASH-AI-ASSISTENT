import { DASHBOARD_MOCKS } from '../mocks';
import { DashboardCard } from '../components/DashboardCard';
import { CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function DailyIntelligenceCard() {
  const data = DASHBOARD_MOCKS.dailyIntelligence;
  const navigate = useNavigate();

  return (
    <DashboardCard className="col-span-1 lg:col-span-2 relative overflow-hidden group border-white/10 hover:border-white/20 transition-all duration-500 p-6 sm:p-7 max-h-[360px] flex flex-col">
      {/* Glow Effect mais proeminente pois é o coração do sistema */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#3B82F6]/5 to-[#8B5CF6]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      
      <div className="relative z-10 flex flex-col h-full">
        <h2 className="text-lg md:text-xl font-semibold text-white tracking-tight mb-1">
          {data.greeting}
        </h2>
        
        <p className="text-[#A8B3CF] whitespace-pre-line text-[14px] md:text-[15px] leading-relaxed mb-4">
          {data.summary}
        </p>

        <ul className="flex flex-col gap-2 mb-4 overflow-y-auto pr-2 scrollbar-hide">
          {data.tasks.map((task, index) => (
            <li 
              key={index} 
              className="flex items-center gap-3 animate-in fade-in slide-in-from-left-4 duration-500 fill-mode-both"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <CheckCircle2 className="w-5 h-5 text-[#10B981]" />
              <span className="text-white text-[15px]">{task}</span>
            </li>
          ))}
        </ul>

        <div className="pt-4 border-t border-white/10 mt-auto">
          <p className="text-[#A8B3CF] whitespace-pre-line text-[13px] leading-relaxed mb-3 font-medium">
            {data.recommendation}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {data.actions.map((action, index) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.id}
                  onClick={() => navigate(action.action)}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#181C28]/80 border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all duration-300 group/btn animate-in fade-in slide-in-from-bottom-2 duration-500 fill-mode-both"
                  style={{ animationDelay: `${(data.tasks.length * 150) + (index * 100)}ms` }}
                >
                  <Icon className="w-4 h-4 text-[#3B82F6] group-hover/btn:scale-110 transition-transform" />
                  <span className="text-[13px] font-semibold text-white tracking-wide">
                    {action.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </DashboardCard>
  );
}
