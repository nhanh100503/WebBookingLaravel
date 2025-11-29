import React, { useState, useEffect, useRef } from 'react';
import { format, parse, startOfMonth, endOfMonth, startOfWeek, addDays, addMonths, subMonths, isSameDay, getMonth, getYear, isBefore, isAfter, startOfDay } from 'date-fns';
import { ja } from 'date-fns/locale';

const JapaneseDatePicker = ({
  name,
  value,
  onChange,
  placeholder = "年/月/日",
  className = "",
  minDate = null,
  maxDate = null,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const calendarRef = useRef(null);
  const inputRef = useRef(null);

  // Parse the value string (YYYY-MM-DD) to Date object
  const getDateFromValue = (val) => {
    if (!val) return null;
    try {
      return parse(val, 'yyyy-MM-dd', new Date());
    } catch {
      return null;
    }
  };

  const initialDate = getDateFromValue(value);
  const [selectedDate, setSelectedDate] = useState(initialDate);

  // Sync with external value changes
  useEffect(() => {
    const date = getDateFromValue(value);
    if (date) {
      const shouldUpdate = !selectedDate || !isSameDay(date, selectedDate);
      if (shouldUpdate) {
        setSelectedDate(date);
        setCurrentMonth(date);
      }
    } else if (selectedDate) {
      setSelectedDate(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  // Ensure currentMonth is within allowed range when minDate/maxDate changes
  useEffect(() => {
    const currentMonthStart = startOfMonth(currentMonth);
    if (minDate) {
      const minMonthStart = startOfMonth(minDate);
      if (isBefore(currentMonthStart, minMonthStart)) {
        setCurrentMonth(minMonthStart);
        return;
      }
    }
    if (maxDate) {
      const maxMonthStart = startOfMonth(maxDate);
      if (isAfter(currentMonthStart, maxMonthStart)) {
        setCurrentMonth(maxMonthStart);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minDate, maxDate]);

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target) &&
        inputRef.current && !inputRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setIsOpen(false);
    if (date) {
      const formattedDate = format(date, 'yyyy-MM-dd');
      onChange({
        target: {
          name: name,
          value: formattedDate
        }
      });
    } else {
      onChange({
        target: {
          name: name,
          value: ''
        }
      });
    }
  };

  const handlePrevMonth = () => {
    const prevMonth = subMonths(currentMonth, 1);
    if (minDate && isBefore(startOfMonth(prevMonth), startOfMonth(minDate))) {
      return; // Don't navigate if it would go before minDate
    }
    setCurrentMonth(prevMonth);
  };

  const handleNextMonth = () => {
    const nextMonth = addMonths(currentMonth, 1);
    if (maxDate && isAfter(startOfMonth(nextMonth), startOfMonth(maxDate))) {
      return; // Don't navigate if it would go after maxDate
    }
    setCurrentMonth(nextMonth);
  };

  const handleMonthChange = (e) => {
    const newMonth = parseInt(e.target.value);
    const newDate = new Date(getYear(currentMonth), newMonth, 1);

    // Ensure the new date is within allowed range
    if (minDate && isBefore(startOfMonth(newDate), startOfMonth(minDate))) {
      setCurrentMonth(startOfMonth(minDate));
    } else if (maxDate && isAfter(startOfMonth(newDate), startOfMonth(maxDate))) {
      setCurrentMonth(startOfMonth(maxDate));
    } else {
      setCurrentMonth(newDate);
    }
  };

  const handleYearChange = (e) => {
    const newYear = parseInt(e.target.value);
    const currentMonthIndex = getMonth(currentMonth);
    let newDate = new Date(newYear, currentMonthIndex, 1);

    // If the current month is not valid for the new year, adjust it
    if (minDate && newYear === getYear(minDate)) {
      const minMonth = getMonth(minDate);
      if (currentMonthIndex < minMonth) {
        newDate = new Date(newYear, minMonth, 1);
      }
    }
    if (maxDate && newYear === getYear(maxDate)) {
      const maxMonth = getMonth(maxDate);
      if (currentMonthIndex > maxMonth) {
        newDate = new Date(newYear, maxMonth, 1);
      }
    }

    // Ensure the new date is within allowed range
    if (minDate && isBefore(startOfMonth(newDate), startOfMonth(minDate))) {
      setCurrentMonth(startOfMonth(minDate));
    } else if (maxDate && isAfter(startOfMonth(newDate), startOfMonth(maxDate))) {
      setCurrentMonth(startOfMonth(maxDate));
    } else {
      setCurrentMonth(newDate);
    }
  };

  const renderCalendar = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 }); // Monday

    const days = [];
    let day = startDate;

    // Always show 6 rows (42 days = 6 weeks)
    const totalDays = 42;
    for (let i = 0; i < totalDays; i++) {
      days.push(day);
      day = addDays(day, 1);
    }

    const weekDays = ['月', '火', '水', '木', '金', '土', '日'];
    const currentYear = getYear(currentMonth);
    const currentMonthIndex = getMonth(currentMonth);

    // Filter years based on minDate/maxDate
    let availableYears = Array.from({ length: 50 }, (_, i) => currentYear - 25 + i);
    if (minDate) {
      const minYear = getYear(minDate);
      availableYears = availableYears.filter(year => year >= minYear);
    }
    if (maxDate) {
      const maxYear = getYear(maxDate);
      availableYears = availableYears.filter(year => year <= maxYear);
    }

    // Filter months based on minDate/maxDate and current year
    let availableMonths = Array.from({ length: 12 }, (_, i) => i);
    if (minDate && currentYear === getYear(minDate)) {
      const minMonth = getMonth(minDate);
      availableMonths = availableMonths.filter(month => month >= minMonth);
    }
    if (maxDate && currentYear === getYear(maxDate)) {
      const maxMonth = getMonth(maxDate);
      availableMonths = availableMonths.filter(month => month <= maxMonth);
    }

    // Check if prev/next month buttons should be disabled
    const canGoPrev = () => {
      if (minDate) {
        const prevMonth = subMonths(currentMonth, 1);
        return !isBefore(startOfMonth(prevMonth), startOfMonth(minDate));
      }
      return true;
    };

    const canGoNext = () => {
      if (maxDate) {
        const nextMonth = addMonths(currentMonth, 1);
        return !isAfter(startOfMonth(nextMonth), startOfMonth(maxDate));
      }
      return true;
    };

    return (
      <div className="absolute bottom-10 left-0 bg-white border border-gray-200  shadow-lg z-50 w-100" ref={calendarRef}>
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-gray-200">
          <button
            onClick={handlePrevMonth}
            disabled={!canGoPrev()}
            className={`text-lg font-semibold h-8 w-8 flex items-center justify-center ${canGoPrev()
              ? 'text-gray-600 hover:text-gray-900'
              : 'text-gray-300 cursor-not-allowed'
              }`}
            type="button"
          >
            &lt;
          </button>

          <div className="flex items-center gap-2">
            <div className="relative">
              <select
                value={currentMonthIndex}
                onChange={handleMonthChange}
                className="appearance-none bg-transparent border-none text-gray-900 font-medium pr-6 cursor-pointer focus:outline-none"
              >
                {availableMonths.map((month) => (
                  <option key={month} value={month}>
                    {format(new Date(2024, month, 1), 'M月', { locale: ja })}
                  </option>
                ))}
              </select>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            <div className="relative">
              <select
                value={currentYear}
                onChange={handleYearChange}
                className="appearance-none bg-transparent border-none text-gray-900 font-medium pr-6 cursor-pointer focus:outline-none"
              >
                {availableYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <button
            onClick={handleNextMonth}
            disabled={!canGoNext()}
            className={`text-lg font-semibold h-8 w-8 flex items-center justify-center ${canGoNext()
              ? 'text-gray-600 hover:text-gray-900'
              : 'text-gray-300 cursor-not-allowed'
              }`}
            type="button"
          >
            &gt;
          </button>
        </div>

        {/* Day names */}
        <div className="grid grid-cols-7 gap-0 px-2 pt-2">
          {weekDays.map((day, index) => (
            <div
              key={index}
              className="text-center text-sm text-gray-600 font-medium py-2"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-2 px-2 pb-4">
          {days.map((day, index) => {
            const isSelected = selectedDate && isSameDay(day, selectedDate);
            const isPreviousMonth = isBefore(day, monthStart);
            const isNextMonth = isAfter(day, monthEnd);

            // Check if date should be hidden based on minDate/maxDate
            const dayStart = startOfDay(day);
            const minDateStart = minDate ? startOfDay(minDate) : null;
            const maxDateStart = maxDate ? startOfDay(maxDate) : null;
            const isOutsideRange = (minDateStart && isBefore(dayStart, minDateStart)) || (maxDateStart && isAfter(dayStart, maxDateStart));

            // Hide dates outside allowed range
            if (isOutsideRange) {
              return <div key={index} className="aspect-square"></div>;
            }

            let className = 'aspect-square flex items-center justify-center text-sm rounded-full mx-1';

            if (isPreviousMonth || isNextMonth) {
              // Previous or next month days: #f2f3f5 background with box-shadow and border
              className += ' bg-[#f2f3f5] text-gray-400 border border-gray-200 shadow-md';
            } else if (isSelected) {
              // Selected day: #607382 background
              className += ' bg-[#607382] text-white font-medium transition-all duration-100';
            } else {
              // Current month days (not selected, border outline)
              className += ' text-gray-900 border-2 border-transparent hover:border-black hover:border-[1.5px] transition-all duration-200';
            }

            return (
              <button
                key={index}
                onClick={() => handleDateChange(day)}
                type="button"
                className={className}
              >
                {format(day, 'd')}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  let displayValue = '';
  if (selectedDate) {
    displayValue = format(selectedDate, 'yyyy/MM/dd');
  }

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={displayValue}
        onClick={() => setIsOpen(!isOpen)}
        readOnly
        className={className}
        placeholder={placeholder}
      />
      {isOpen && renderCalendar()}
    </div>
  );
};

export default JapaneseDatePicker;

