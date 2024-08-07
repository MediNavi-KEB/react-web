import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, addMonths, isSameMonth, isSameDay, eachDayOfInterval, differenceInCalendarDays } from 'date-fns';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const Calendar = () => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today);
  const [selectedDate, setSelectedDate] = useState(today);
  const [memos, setMemos] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [memoRange, setMemoRange] = useState({ start: today, end: today });
  const [selectedMemo, setSelectedMemo] = useState(null);

  useEffect(() => {
    document.querySelectorAll('.cal-cell').forEach(cell => {
      const cellDate = new Date(cell.dataset.date);
      const isInRange = cellDate >= memoRange.start && cellDate <= memoRange.end;
      cell.classList.toggle('cal-in-range', isInRange);
    });
  }, [memoRange]);

  const handleDateChange = (name, date) => {
    if (name === 'end' && date < memoRange.start) {
      alert('종료 날짜는 시작 날짜보다 빠를 수 없습니다.');
      return;
    }
    setMemoRange(prevRange => ({ ...prevRange, [name]: date }));
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMemo(null);
  };

  const handleDateClick = day => {
    setSelectedDate(day);
    setMemoRange({ start: day, end: day });
    setIsModalOpen(true);
    setSelectedMemo(null);
  };

  const handleMemoClick = (e, dateKey, memo, index) => {
    e.stopPropagation();
    setSelectedMemo({ dateKey, memo, index });
    setMemoRange({ start: new Date(dateKey), end: new Date(dateKey) });
    setIsModalOpen(true);
  };

  const handleMemoAction = (e, action) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const category = formData.get('category');
    const memo = formData.get('memo');
    const dates = eachDayOfInterval({ start: memoRange.start, end: memoRange.end });
    const duration = differenceInCalendarDays(memoRange.end, memoRange.start) + 1;

    if (action === 'submit') {
      const newMemos = dates.reduce((acc, date) => {
        const dateKey = format(date, 'yyyy-MM-dd');
        acc[dateKey] = acc[dateKey] || [];
        acc[dateKey].push({ category, memo, duration, idx: acc[dateKey].length });
        return acc;
      }, {});

      setMemos(prev => ({
        ...prev,
        ...Object.keys(newMemos).reduce((acc, key) => {
          acc[key] = [...(prev[key] || []), ...newMemos[key]];
          return acc;
        }, {}),
      }));
    } else if (action === 'edit') {
      const { dateKey, index } = selectedMemo;
      setMemos(prev => {
        const newMemos = { ...prev };
        newMemos[dateKey][index] = { ...newMemos[dateKey][index], category, memo };
        return newMemos;
      });
      setSelectedMemo(null);
    }
    closeModal();
  };

  const handleMemoDelete = () => {
    const { dateKey, index } = selectedMemo;
    setMemos(prev => {
      const newMemos = { ...prev };
      newMemos[dateKey].splice(index, 1);
      if (newMemos[dateKey].length === 0) delete newMemos[dateKey];
      return newMemos;
    });
    setSelectedMemo(null);
    closeModal();
  };

  const changeMonth = direction => setCurrentMonth(prev => addMonths(prev, direction));

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        const formattedDate = format(day, 'd');
        const dateKey = format(day, 'yyyy-MM-dd');
        // const isInCurrentMonth = isSameMonth(day, currentMonth);
        const isSelected = isSameDay(day, selectedDate);
        const isDisabled = false;

        days.push(
          <div
            className={`cal-col cal-cell ${isDisabled ? 'cal-disabled' : isSelected ? 'cal-selected' : ''}`}
            key={dateKey}
            data-date={day}
            onClick={() => handleDateClick(cloneDay)}
            style={{ cursor: 'pointer' }}
          >
            <span className={`cal-number ${isDisabled ? 'cal-disabled' : ''}`}>{formattedDate}</span>
            {memos[dateKey] && (
              <div className="cal-memos">
                {memos[dateKey].map((memo, index) => (
                  <div
                    key={index}
                    className={`cal-memo cal-memo-${memo.category} ${memo.idx === 0 ? 'cal-memo-start' : memo.idx === memo.duration - 1 ? 'cal-memo-end' : 'cal-memo-middle'}`}
                    onClick={e => handleMemoClick(e, dateKey, memo, index)}
                    style={{ gridColumn: `span ${memo.duration}`, cursor: 'pointer' }}
                  >
                    {memo.category === 'diagnosis' ? '진단' : memo.category === 'prescription' ? '처방' : '통증'}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(<div className="cal-row" key={day}>{days}</div>);
      days = [];
    }
    return rows;
  };

  return (
    <div className="cal-calendar">
      <div className="cal-header cal-row cal-flex-middle">
        <div className="cal-col cal-col-start" onClick={() => changeMonth(-1)} style={{ cursor: 'pointer' }}>
          &#8592;
        </div>
        <div className="cal-col cal-col-center">{format(currentMonth, 'yyyy년 MM월')}</div>
        <div className="cal-col cal-col-end" onClick={() => changeMonth(1)} style={{ cursor: 'pointer' }}>
          &#8594;
        </div>
      </div>
      <div className="cal-days cal-row">
        {Array.from({ length: 7 }).map((_, i) => (
          <div className="cal-col cal-col-center" key={i}>
            {format(addDays(startOfWeek(currentMonth), i), 'eee')}
          </div>
        ))}
      </div>
      <div className="cal-body">{renderCells()}</div>
      {isModalOpen && (
        <div className="cal-modal">
          <div className="cal-modal-content">
            <span className="cal-modal-close" onClick={closeModal} style={{ cursor: 'pointer' }}>&times;</span>
            <h2>{selectedMemo ? '메모 수정' : '메모 추가'}</h2>
            <form onSubmit={e => handleMemoAction(e, selectedMemo ? 'edit' : 'submit')}>
              <div className="cal-radio-group">
                {['diagnosis', 'prescription', 'pain'].map(category => (
                  <label key={category}>
                    <input type="radio" name="category" value={category} required defaultChecked={selectedMemo ? selectedMemo.memo.category === category : false} /> {category === 'diagnosis' ? '진단' : category === 'prescription' ? '처방기록' : '통증'}
                  </label>
                ))}
              </div>
              <div className="cal-range-inputs">
                <label className='cal-range-label'>
                  시작 날짜:
                  <DatePicker className='cal-datepicker' selected={memoRange.start} onChange={date => handleDateChange('start', date)} dateFormat="yyyy-MM-dd" />
                </label>
                <label>
                  종료 날짜:
                  <DatePicker className='cal-datepicker' selected={memoRange.end} onChange={date => handleDateChange('end', date)} dateFormat="yyyy-MM-dd" />
                </label>
              </div>
              <textarea className='cal-textarea' name="memo" placeholder="카테고리를 선택 후, 메모를 작성하세요." rows="4" required defaultValue={selectedMemo ? selectedMemo.memo.memo : ''}></textarea>
              <div className="button-group">
                <button className='cal-button' type="submit" style={{ cursor: 'pointer' }}>{selectedMemo ? '수정' : '추가'}</button>
                {selectedMemo && <button className='cal-button-delete' type="button" onClick={handleMemoDelete} style={{ cursor: 'pointer' }}>삭제</button>}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;