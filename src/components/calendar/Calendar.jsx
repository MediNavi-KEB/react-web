import React, { useState, useEffect, useReducer } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { PickersDay } from '@mui/x-date-pickers';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { Typography, TextField, Box, Modal, Paper } from '@mui/material';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import HealingIcon from '@mui/icons-material/Healing';
import MemoModal from './MemoModal';
import MemoBox from './MemoBox';
// import '../fonts.css';
import './Calendar.css';

const daysOfWeekEnglish = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function ResponsiveDatePickers() {
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [currentMonth, setCurrentMonth] = useState(dayjs().startOf('month'));
  const [memos, setMemos] = useState(() => {
    try {
      const savedMemos = localStorage.getItem('memos');
      if (savedMemos) {
        const parsedMemos = JSON.parse(savedMemos);
        if (typeof parsedMemos === 'object' && !Array.isArray(parsedMemos)) {
          return parsedMemos;
        } else {
          console.error('Invalid memos format:', parsedMemos);
          return {};
        }
      } else {
        return {};
      }
    } catch (error) {
      console.error('Error loading memos from localStorage', error);
      return {};
    }
  });

  const [currentMemo, setCurrentMemo] = useState({
    hospital: [],
    medicationTime: [],
    pain: []
  });
  const [currentView, setCurrentView] = useState('day');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState([]);

  const [, forceUpdate] = useReducer(x => x + 1, 0);

  useEffect(() => {
    try {
      localStorage.setItem('memos', JSON.stringify(memos));
    } catch (error) {
      console.error('Error saving memos to localStorage', error);
    }
  }, [memos]);

  const handleDayClick = (date) => {
    const formattedDate = date.format('YYYY/MM/DD');
    const memoForDate = memos[formattedDate] || {
      hospital: [],
      medicationTime: [],
      pain: []
    };

    setSelectedDate(date);
    setCurrentMemo(memoForDate);
    setOpen(true);
  };

  const handleMonthChange = (date) => {
    setCurrentMonth(date.startOf('month'));
  };

  const handleYearChange = (date) => {
    setCurrentMonth(date.startOf('month'));
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSaveMemo = (date, memo) => {
    setMemos((prevMemos) => ({
      ...prevMemos,
      [date]: memo
    }));
  };

  const handleDeleteMemo = (date, updatedMemo) => {
    setMemos((prevMemos) => {
      const newMemos = { ...prevMemos, [date]: updatedMemo };
      if (!newMemos[date].hospital?.length) delete newMemos[date].hospital;
      if (!newMemos[date].medicationTime?.length) delete newMemos[date].medicationTime;
      if (!newMemos[date].pain?.length) delete newMemos[date].pain;
      if (!newMemos[date].hospital && !newMemos[date].medicationTime && !newMemos[date].pain) {
        delete newMemos[date];
      }
      return newMemos;
    });
  };

  const handleIconClick = (type) => {
    const startOfYear = selectedDate.startOf('year');
    const endOfYear = selectedDate.endOf('year');

    const content = Object.entries(memos)
      .filter(([date, memo]) => {
        const memoDate = dayjs(date, 'YYYY/MM/DD');
        return memo[type] && memo[type].length > 0 && memoDate.isBetween(startOfYear, endOfYear, null, '[]');
      })
      .map(([date, memo]) => ({ date, text: memo[type] }));

    setModalContent(content.length > 0 ? content : [{ date: '', text: '메모가 없습니다.' }]);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setModalContent([]);
  };

  const renderDay = (day, _selectedDate, _isInCurrentMonth, dayComponent) => {
    const isSelected = selectedDate.isSame(day, 'day');
    const isToday = dayjs().isSame(day, 'day');
    const formattedDate = day.format('YYYY/MM/DD');
    const hasMemo = !!memos[formattedDate];
  
    return (
      <Box
        sx={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: isSelected ? 'lightblue' : 'transparent',
          border: isToday ? '2px solid blue' : 'none',
          borderRadius: '50%',
          overflow: 'hidden',
        }}
        onClick={() => handleDayClick(day)}
      >
        {dayComponent}
        {hasMemo && (
          <Box
            sx={{
              position: 'relative',
              top: 0,
              right: 0,
              width: '24px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transform: 'translate(50%, -50%)',
            }}
          />
        )}
      </Box>
    );
  };

  const renderDayOfWeekHeader = () => {
    return (
      <Box display="flex" justifyContent="space-around" sx={{ padding: '0 0 8px' }}>
        {daysOfWeekEnglish.map((day, index) => (
          <Box key={index} className="calendar-day-of-week">
            <Typography variant="caption" className="calendar-day-of-week">
              {day}
            </Typography>
          </Box>
        ))}
      </Box>
    );
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box className="calendar-container" sx={{ position: 'relative' }}>
        <div className="memo-box-container">
          {memos[selectedDate.format('YYYY/MM/DD')] ? (
            <MemoBox
              date={selectedDate.format('DD MMM YYYY')}
              memo={memos[selectedDate.format('YYYY/MM/DD')]}
              handleDeleteMemo={handleDeleteMemo}
            />
          ) : (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                border: '1px solid #ccc',
                borderRadius: '8px',
                padding: '44px',
                marginTop: '4px',
                textAlign: 'center',
              }}
            >
              <Typography variant="body2" sx={{ fontFamily: 'GmarketSans' }}>
                I'm your Medinavi
              </Typography>
            </Box>
          )}
        </div>
        <DemoContainer components={['StaticDatePicker']}>
          <DemoItem label=" ">
            <StaticDatePicker
              displayStaticWrapperAs="desktop"
              value={selectedDate}
              onChange={(newValue) => { 
                if (currentView === 'day') {
                handleDayClick(newValue);
              }
              setSelectedDate(newValue);
            }}
              onMonthChange={handleMonthChange}
              onYearChange={handleYearChange}
              renderDay={renderDay}
              componentsProps={{
                actionBar: { actions: ['today'] },
                dayOfWeek: { render: renderDayOfWeekHeader },
              }}
              slots={{
                textField: (params) => <TextField {...params} />,
                day: (date) => {
                  const formattedDate = date.day.format('YYYY/MM/DD');
                  const hasMemo = Object.keys(memos).includes(formattedDate);
                  const hospital = memos[formattedDate]?.hospital?.length;
                  const medicationTime = memos[formattedDate]?.medicationTime?.length;
                  const pain = memos[formattedDate]?.pain?.length;

                  return (
                    <PickersDay {...date} onClick={() => handleDayClick(date.day)}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                        {hasMemo && (
                          <Box sx={{ display: 'flex', flexDirection: 'row', position: 'absolute', top: 0, left: '40%', transform: 'translateX(-50%)', mt: -0.5 }}>
                            {hospital ? <Box sx={{ width: 3.5, height: 3.5, borderRadius: '50%', backgroundColor: 'blue', ml: 0.2 }} /> : null}
                            {medicationTime ? <Box sx={{ width: 3.5, height: 3.5, borderRadius: '50%', backgroundColor: 'orange', ml: 0.2 }} /> : null}
                            {pain ? <Box sx={{ width: 3.5, height: 3.5, borderRadius: '50%', backgroundColor: 'red', ml: 0.2 }} /> : null}
                          </Box>
                        )}
                        <Typography variant="body2" sx={{ margin: 'auto', fontSize: '0.875rem' }}>
                          {date.day.format('D')}
                        </Typography>
                      </Box>
                    </PickersDay>
                  );
                }
              }}
              view={currentView}
              onViewChange={(newView) => setCurrentView(newView)}
              sx={{ fontFamily: 'Gmarket Sans Light' }}
            />
          </DemoItem>
        </DemoContainer>

        <MemoModal
          open={open}
          handleClose={handleClose}
          selectedDate={selectedDate}
          memo={currentMemo}
          setMemo={setCurrentMemo}
          handleSaveMemo={handleSaveMemo}
          handleDeleteMemo={handleDeleteMemo}
        />

        <Box sx={{ position: 'absolute', bottom: '12px', right: '25px', display: 'flex', flexDirection: 'row', gap: '10px' }}>
          <Box
            onClick={() => handleIconClick('hospital')}
            sx={{ width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', backgroundColor: '#f0f0f0', cursor: 'pointer' }}
          >
            <LocalHospitalIcon />
          </Box>
          <Box
            onClick={() => handleIconClick('medicationTime')}
            sx={{ width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', backgroundColor: '#f0f0f0', cursor: 'pointer' }}
          >
            <AccessTimeIcon />
          </Box>
          <Box
            onClick={() => handleIconClick('pain')}
            sx={{ width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', backgroundColor: '#f0f0f0', cursor: 'pointer' }}
          >
            <HealingIcon />
          </Box>
        </Box>

        <Modal open={modalOpen} onClose={handleModalClose}>
          <Paper style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', padding: '20px', maxHeight: '80vh', overflowY: 'auto' }}>
            {modalContent.map((item, index) => (
              <Box key={index} sx={{ marginBottom: '10px' }}>
                <Typography variant="h6">{item.date}</Typography>
                {Array.isArray(item.text) ? (
                  item.text.map((memo, memoIndex) => (
                    <Typography key={memoIndex} variant="body1" sx={{ marginLeft: '20px' }}>
                      {memo}
                    </Typography>
                  ))
                ) : (
                  <Typography variant="body1" sx={{ marginLeft: '20px' }}>
                    {item.text}
                  </Typography>
                )}
              </Box>
            ))}
          </Paper>
        </Modal>
      </Box>
    </LocalizationProvider>
  );
}