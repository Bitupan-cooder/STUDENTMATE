import React, { useState, useEffect } from 'react';
import { useStudyStore } from '../store/useStudyStore';
import { Calendar, ChevronLeft, ChevronRight, Award, Flame, Zap, ShieldCheck } from 'lucide-react';

export default function CalendarPlanner() {
  const { history, streak, fetchHistory } = useStudyStore();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    fetchHistory();
  }, []);

  // Compute stats of each day
  const getLogsForDate = (dateStr: string) => {
    return history.filter((log) => log.date === dateStr);
  };

  const getFocusMinutesForDate = (dateStr: string) => {
    const logs = getLogsForDate(dateStr);
    return logs.reduce((sum, item) => sum + item.duration, 0);
  };

  // Calendar render details
  const currentYear = currentMonth.getFullYear();
  const currentMonthIdx = currentMonth.getMonth();

  const daysInMonth = new Date(currentYear, currentMonthIdx + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonthIdx, 1).getDay(); // 0 is Sunday

  const prevMonth = () => {
    setCurrentMonth(new Date(currentYear, currentMonthIdx - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentYear, currentMonthIdx + 1, 1));
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Helper to compile density class
  const getDensityClass = (mins: number) => {
    if (mins === 0) return 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700';
    if (mins < 25) return 'bg-indigo-100 dark:bg-indigo-950 text-indigo-705 cursor-pointer hover:bg-indigo-200';
    if (mins < 50) return 'bg-indigo-305 bg-indigo-200 dark:bg-indigo-900 text-indigo-805 cursor-pointer hover:bg-indigo-300';
    return 'bg-indigo-600 text-white font-bold cursor-pointer hover:bg-indigo-705 shadow-xs';
  };

  const formattedSelectedDateLogs = getLogsForDate(selectedDate);
  const selectedDateFocusMins = getFocusMinutesForDate(selectedDate);

  // Month days builder
  const daysArray = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    daysArray.push(null); // padding for preceding month cells
  }
  for (let d = 1; d <= daysInMonth; d++) {
    daysArray.push(d);
  }

  return (
    <div id="calendar-planner" className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-1.5">
            Focus & Streak Calendar Matrix
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs">
            Review history heatmap. Click on any colored block to investigate completed Pomodoro lists, subject logs, and stretch achievements.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* HEATMAP GRIDS CONTAINER */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-205 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-50 dark:border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-805 dark:text-slate-100 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-indigo-505" />
              <span>{monthNames[currentMonthIdx]} {currentYear}</span>
            </h3>

            <div className="flex gap-1.5">
              <button
                onClick={prevMonth}
                className="p-1 rounded-lg border border-slate-200 dark:border-slate-750 text-slate-500 dark:text-slate-350 hover:bg-slate-50 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextMonth}
                className="p-1 rounded-lg border border-slate-200 dark:border-slate-750 text-slate-500 dark:text-slate-350 hover:bg-slate-50 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Grid Headers */}
          <div className="grid grid-cols-7 gap-1.5 text-center text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider select-none">
            <span>Su</span>
            <span>Mo</span>
            <span>Tu</span>
            <span>We</span>
            <span>Th</span>
            <span>Fr</span>
            <span>Sa</span>
          </div>

          {/* Grid Cells */}
          <div className="grid grid-cols-7 gap-1.5 min-h-[180px]">
            {daysArray.map((day, idx) => {
              if (day === null) {
                return <div key={`empty-${idx}`} className="aspect-square bg-slate-50/50 dark:bg-slate-850/20 rounded-lg"></div>;
              }

              const dateStr = `${currentYear}-${(currentMonthIdx + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
              const focusMins = getFocusMinutesForDate(dateStr);
              const densityClass = getDensityClass(focusMins);
              const isSelected = dateStr === selectedDate;

              // Streak highlights: if last active or has logs, show little glowing border/icon
              const hasActivity = focusMins > 0;

              return (
                <div
                  key={`day-${day}`}
                  onClick={() => setSelectedDate(dateStr)}
                  className={`aspect-square flex flex-col justify-between p-1.5 rounded-xl text-xs transition-all relative select-none ${densityClass} ${
                    isSelected ? 'ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-slate-900 border-indigo-500 scale-102 z-10 shadow-md' : ''
                  }`}
                >
                  <span className="font-extrabold">{day}</span>
                  {hasActivity && (
                    <div className="absolute bottom-1 right-1 w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse shadow-sm shadow-amber-500"></div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Grid Labels/Legends */}
          <div className="flex items-center gap-3 text-[10px] font-bold text-slate-505 select-none pt-2 justify-end">
            <span>Density levels:</span>
            <div className="flex items-center gap-1">
              <span className="w-3.5 h-3.5 bg-slate-100 dark:bg-slate-800 rounded-sm inline-block"></span>
              <span>0 mins</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3.5 h-3.5 bg-indigo-100 dark:bg-indigo-950 rounded-sm inline-block"></span>
              <span>1 - 24 mins</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3.5 h-3.5 bg-indigo-200 dark:bg-indigo-900 rounded-sm inline-block"></span>
              <span>25 - 49 mins</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3.5 h-3.5 bg-indigo-600 rounded-sm inline-block"></span>
              <span>50+ mins</span>
            </div>
          </div>
        </div>

        {/* LOGS LEDGER FOR CLICKED DATE */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-205 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="space-y-4">
            <div className="border-b border-slate-50 dark:border-slate-800 pb-3">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Date Inspector Details</span>
              <h4 className="text-sm font-black text-slate-800 dark:text-slate-100 mt-0.5">{selectedDate}</h4>
              <p className="text-[11px] text-slate-500">Focus mins logged today: <strong className="text-slate-700 dark:text-slate-300">{selectedDateFocusMins} minutes</strong></p>
            </div>

            <div className="space-y-2.5 max-h-[220px] overflow-y-auto">
              {formattedSelectedDateLogs.length > 0 ? (
                formattedSelectedDateLogs.map((log) => (
                  <div key={log.id} className="p-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-150 dark:border-slate-850 rounded-xl flex items-center justify-between">
                    <div className="space-y-0.5 text-left">
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-100">Interval Sprints</p>
                      <span className="text-[10px] px-1.5 py-0.2 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100/30 text-indigo-600 dark:text-indigo-400 font-semibold rounded-sm">
                        {log.subject}
                      </span>
                    </div>
                    <span className="text-xs font-black text-slate-905">{log.duration} mins</span>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-slate-400 text-xs italic">
                  No focus activities logged for this date.
                </div>
              )}
            </div>
          </div>

          <div className="bg-amber-500/5 border border-amber-500/10 p-3 rounded-xl flex items-start gap-2 text-xs text-slate-505">
            <Flame className="w-4 h-4 text-amber-500 flex-shrink-0 stroke-2 fill-amber-500/5 animate-bounce" />
            <p className="leading-normal">
              Continuous focus logs protect your learning health! Streak is currently active at <strong>{streak?.currentStreak || 0} consecutive days</strong>.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
