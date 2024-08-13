import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, addMonths, isSameDay } from 'date-fns';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import './Calendar.css';
import { FaAngleRight, FaAngleLeft } from "react-icons/fa6";

const Calendar = () => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today);
  const [selectedDate, setSelectedDate] = useState(today);
  const [memos, setMemos] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [memoRange, setMemoRange] = useState({ start: today, end: today });
  const [selectedMemo, setSelectedMemo] = useState(null);
  const userId = localStorage.getItem('user_id'); 

  const fetchMemos = async () => {
    try {
      const response = await axios.get(`/calendar/read/${userId}`);
      const memos = response.data.map(memo => ({
        ...memo,
        date_time: new Date(memo.date_time) 
      }));
      setMemos(memos.reduce((acc, memo) => {
        const dateKey = format(new Date(memo.date_time), 'yyyy-MM-dd');
        acc[dateKey] = acc[dateKey] || [];
        acc[dateKey].push(memo);
        return acc;
      }, {}));
    } catch (error) {
      console.error('메모를 가져오는 데 실패했습니다:', error);
    }
  };

  useEffect(() => {
    fetchMemos();
  }, [currentMonth]);

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
    setSelectedMemo(memo); 
    setMemoRange({ start: new Date(memo.date_time), end: new Date(memo.date_time) });
    setIsModalOpen(true);
  };

  const handleMemoAction = async (e, action) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const category = formData.get('category');
    const memo = formData.get('memo');

    // 시작 날짜와 종료 날짜를 각각 ISO 8601 형식으로 변환
    const startDate = new Date(memoRange.start.getTime() + (9 * 60 * 60 * 1000)).toISOString();
    const endDate = new Date(memoRange.end.getTime() + (9 * 60 * 60 * 1000)).toISOString();

    const memoData = {
        user_id: userId,
        start_date: startDate,
        end_date: endDate,
        memo_category: category,
        memo_content: memo,
    };

    try {
      if (action === 'submit') {
        await axios.post('/calendar/register', memoData);
        fetchMemos();
      } else if (action === 'edit') {
        if (selectedMemo && selectedMemo.calendar_id) {
          await axios.put(`/calendar/update/${selectedMemo.calendar_id}`, memoData);
          fetchMemos();
        } else {
          console.error('메모를 업데이트하는 데 실패했습니다: calendar_id가 없습니다');
        }
      }
    } catch (error) {
      console.error('메모 작업을 처리하는 데 실패했습니다:', error);
    }
    closeModal();
  };

  const handleMemoDelete = async () => {
    try {
      if (selectedMemo && selectedMemo.calendar_id) {
        await axios.delete(`/calendar/delete/${selectedMemo.calendar_id}`);
        fetchMemos();
      } else {
        console.error('메모를 삭제하는 데 실패했습니다: calendar_id가 없습니다');
      }
    } catch (error) {
      console.error('메모를 삭제하는 데 실패했습니다:', error);
    }
    setSelectedMemo(null);
    closeModal();
  };

  const changeMonth = direction => {
    setCurrentMonth(prev => addMonths(prev, direction));
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;

    const holidays = [
      '2024-01-01', '2024-02-09', '2024-02-10', '2024-02-11', '2024-03-01',
      '2024-05-05', '2024-05-15', '2024-06-06', '2024-08-15', '2024-09-16',
      '2024-09-17', '2024-09-18', '2024-10-03', '2024-10-09', '2024-12-25'
    ];

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        const formattedDate = format(day, 'd');
        const dateKey = format(day, 'yyyy-MM-dd');
        const isSelected = isSameDay(day, selectedDate);
        const isHoliday = holidays.includes(dateKey) || day.getDay() === 0 || day.getDay() === 6; // Check for holidays and weekends
        const isDisabled = false;

        days.push(
          <div
            className={`cal-col cal-cell ${isDisabled ? 'cal-disabled' : isSelected ? 'cal-selected' : ''}`}
            key={dateKey}
            data-date={day}
            onClick={() => handleDateClick(cloneDay)}
            style={{ cursor: 'pointer' }}
          >
            <span className={`cal-number ${isHoliday ? 'cal-holiday' : ''}`}>{formattedDate}</span>
            {memos[dateKey] && (
              <div className="cal-memos">
                {memos[dateKey].map((memo, index) => (
                  <div
                    key={index}
                    className={`cal-memo cal-memo-${memo.memo_category === '병원' ? 'hospital' : memo.memo_category === '약' ? 'medicine' : 'pain'}`}
                    onClick={e => handleMemoClick(e, dateKey, memo, index)}
                    style={{ cursor: 'pointer' }}
                  >
                    {memo.memo_category}
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
      {/* <div className="cal-brand">
            <div>MEDINAVI</div>
        </div> */}
      <div className="cal-header cal-row cal-flex-middle">
        <div className="cal-col-yyyymm">{format(currentMonth, 'yyyy MMM')}</div>
        <div className='cal-start-end-wrap'>
          <div className="cal-col-start" onClick={() => changeMonth(-1)} style={{ cursor: 'pointer' }}>
            <FaAngleLeft />
          </div>
          <div className="cal-col-end" onClick={() => changeMonth(1)} style={{ cursor: 'pointer' }}>
            <FaAngleRight />
          </div>
        </div>
      </div>
      {/* <hr/> */}
      <div className='cal-body-wrap'>
        <div className="cal-days cal-row">
          {Array.from({ length: 7 }).map((_, i) => (
            <div className={`cal-col cal-col-center ${i === 0 || i === 6 ? 'cal-weekend' : ''}`} key={i}>
              {format(addDays(startOfWeek(currentMonth), i), 'eee')}
            </div>
          ))}
        </div>
        <div className="cal-body">{renderCells()}</div>
        {isModalOpen && (
          <div className="cal-modal">
            <div className="cal-modal-content">
              <span className="cal-modal-close" onClick={closeModal} style={{ cursor: 'pointer' }}>&times;</span>
              <h4>{selectedMemo ? '메모 수정' : '메모 추가'}</h4>
              <form onSubmit={e => handleMemoAction(e, selectedMemo ? 'edit' : 'submit')}>
                <div className="cal-radio-group">
                  {['통증', '약', '병원'].map(category => (
                    <label key={category}>
                      <input type="radio" name="category" value={category} required defaultChecked={selectedMemo ? selectedMemo.memo_category === category : false} /> {category}
                    </label>
                  ))}
                </div>
                <div className="cal-range-inputs">
                  <label className='cal-range-label'>
                    시작 날짜:
                    <DatePicker
                      selected={memoRange.start}
                      onChange={date => handleDateChange('start', date)}
                      selectsStart
                      startDate={memoRange.start}
                      endDate={memoRange.end}
                      dateFormat="yyyy/MM/dd"
                      className="cal-datepicker"
                    />
                  </label>
                  <label className='cal-range-label'>
                    종료 날짜:
                    <DatePicker
                      selected={memoRange.end}
                      onChange={date => handleDateChange('end', date)}
                      selectsEnd
                      startDate={memoRange.start}
                      endDate={memoRange.end}
                      minDate={memoRange.start}
                      dateFormat="yyyy/MM/dd"
                      className="cal-datepicker"
                    />
                  </label>
                </div>
                <textarea name="memo" className="cal-textarea" rows="4" defaultValue={selectedMemo ? selectedMemo.memo_content : ''} placeholder="메모 내용을 입력하세요" required></textarea>
                <div className="button-group">
                  <button type="submit" className="cal-button">{selectedMemo ? '수정' : '추가'}</button>
                  {selectedMemo && <button type="button" className="cal-button cal-button-delete" onClick={handleMemoDelete}>삭제</button>}
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
      {/* <hr/> */}
    </div>
  );
};

export default Calendar;
