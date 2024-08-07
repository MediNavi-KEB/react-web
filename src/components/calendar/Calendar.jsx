import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, addMonths, isSameMonth, isSameDay, eachDayOfInterval, differenceInCalendarDays } from 'date-fns';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';

// Axios 설정
const api = axios.create({
  baseURL: '/calendar', // FastAPI 서버 주소
  headers: {
    'Content-Type': 'application/json',
  },
});

// API 호출 함수
const registerCalendar = async (calendarData) => {
  console.log('registerCalendar', calendarData);
  const response = await api.post('/register', calendarData);
  return response.data;
};

const readCalendarsByUser = async (userId) => {
  console.log('readCalendarsByUser', userId);
  const response = await api.get(`/read/${userId}`);
  return response.data;
};

const deleteCalendar = async (calendarId) => {
  console.log('deleteCalendar', calendarId);
  const response = await api.delete(`/delete/${calendarId}`);
  return response.data;
};

const updateCalendar = async (calendarId, calendarUpdate) => {
  console.log('updateCalendar', calendarId, calendarUpdate);
  const response = await api.put(`/update/${calendarId}`, calendarUpdate);
  return response.data;
};

const Calendar = () => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today);
  const [selectedDate, setSelectedDate] = useState(today);
  const [memos, setMemos] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [memoRange, setMemoRange] = useState({ start: today, end: today });
  const [selectedMemo, setSelectedMemo] = useState(null);

  const userId = localStorage.getItem('user_id'); // user_id를 로컬 스토리지에서 가져오기

  const fetchMemos = async () => {
    try {
      const memos = await readCalendarsByUser(userId);
      console.log('Fetched memos:', memos);
      setMemos(memos.reduce((acc, memo) => {
        const dateKey = format(new Date(memo.date_time), 'yyyy-MM-dd');
        acc[dateKey] = acc[dateKey] || [];
        acc[dateKey].push(memo);
        return acc;
      }, {}));
    } catch (error) {
      console.error('Failed to fetch memos:', error);
    }
  };

  useEffect(() => {
    fetchMemos();
  }, [currentMonth]);

  const handleDateChange = (name, date) => {
    console.log('handleDateChange', name, date);
    if (name === 'end' && date < memoRange.start) {
      alert('종료 날짜는 시작 날짜보다 빠를 수 없습니다.');
      return;
    }
    setMemoRange(prevRange => ({ ...prevRange, [name]: date }));
  };

  const closeModal = () => {
    console.log('closeModal');
    setIsModalOpen(false);
    setSelectedMemo(null);
  };

  const handleDateClick = day => {
    console.log('handleDateClick', day);
    setSelectedDate(day);
    setMemoRange({ start: day, end: day });
    setIsModalOpen(true);
    setSelectedMemo(null);
  };

  const handleMemoClick = (e, dateKey, memo, index) => {
    e.stopPropagation();
    console.log('handleMemoClick', dateKey, memo, index);
    setSelectedMemo(memo); // 올바르게 설정
    setMemoRange({ start: new Date(memo.date_time), end: new Date(memo.date_time) });
    setIsModalOpen(true);
  };

  const handleMemoAction = async (e, action) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const category = formData.get('category');
    const memo = formData.get('memo');
    const dates = eachDayOfInterval({ start: memoRange.start, end: memoRange.end });
    const duration = differenceInCalendarDays(memoRange.end, memoRange.start) + 1;

    // KST로 변환된 날짜 시간
    const kstDateTime = new Date(memoRange.start.getTime() + (9 * 60 * 60 * 1000)).toISOString();

    const memoData = {
      user_id: userId,
      date_time: kstDateTime,
      memo_category: category,
      memo_content: memo,
    };

    console.log('handleMemoAction', action, memoData, selectedMemo);

    try {
      if (action === 'submit') {
        await registerCalendar(memoData);
        fetchMemos();
      } else if (action === 'edit') {
        if (selectedMemo && selectedMemo.calendar_id) {
          await updateCalendar(selectedMemo.calendar_id, memoData); // 올바르게 설정
          fetchMemos();
        } else {
          console.error('Failed to update memo: selectedMemo is missing calendar_id');
        }
      }
    } catch (error) {
      console.error('Failed to handle memo action:', error);
    }
    closeModal();
  };

  const handleMemoDelete = async () => {
    console.log('handleMemoDelete', selectedMemo);
    try {
      if (selectedMemo && selectedMemo.calendar_id) {
        await deleteCalendar(selectedMemo.calendar_id); // 올바르게 설정
        fetchMemos();
      } else {
        console.error('Failed to delete memo: selectedMemo is missing calendar_id');
      }
    } catch (error) {
      console.error('Failed to delete memo:', error);
    }
    setSelectedMemo(null);
    closeModal();
  };

  const changeMonth = direction => {
    console.log('changeMonth', direction);
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

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        const formattedDate = format(day, 'd');
        const dateKey = format(day, 'yyyy-MM-dd');
        const isInCurrentMonth = isSameMonth(day, currentMonth);
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
                    className={`cal-memo cal-memo-${memo.memo_category === '병원' ? 'hospital' : memo.memo_category === '약' ? 'medicine' : 'pain'} ${memo.idx === 0 ? 'cal-memo-start' : memo.idx === memo.duration - 1 ? 'cal-memo-end' : 'cal-memo-middle'}`}
                    onClick={e => handleMemoClick(e, dateKey, memo, index)}
                    style={{ gridColumn: `span ${memo.duration}`, cursor: 'pointer' }}
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
                {['통증', '약', '병원'].map(category => (
                  <label key={category}>
                    <input type="radio" name="category" value={category} required defaultChecked={selectedMemo ? selectedMemo.memo_category === category : false} /> {category}
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
              <textarea className='cal-textarea' name="memo" placeholder="카테고리를 선택 후, 메모를 작성하세요." rows="4" required defaultValue={selectedMemo ? selectedMemo.memo_content : ''}></textarea>
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
