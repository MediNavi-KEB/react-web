import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, IconButton, TextField, Grid, Button, Checkbox, FormControlLabel } from '@mui/material';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import HealingIcon from '@mui/icons-material/Healing';

const MemoModal = ({ open, handleClose, selectedDate, memo, setMemo, handleSaveMemo, handleDeleteMemo }) => {
  const [section, setSection] = useState(null);
  const [tempMemo, setTempMemo] = useState('');
  const [checked, setChecked] = useState({
    hospital: [],
    medicationTime: [],
    pain: [],
  });

  useEffect(() => {
    if (open) {
      console.log('Opened modal with memo:', memo);
      if (typeof memo !== 'object' || Array.isArray(memo)) {
        console.error('Invalid memo format:', memo);
        return;
      }
      setTempMemo('');
      setChecked({ hospital: [], medicationTime: [], pain: [] });
      setSection(null);
    }
  }, [open, memo]);

  const handleSectionClick = (sectionName) => {
    if (section === sectionName) {
      setSection(null);
      setTempMemo('');
    } else {
      setSection(sectionName);
      setTempMemo('');
    }
  };

  const handleSave = () => {
    if (section && tempMemo.trim()) {
      const updatedMemo = {
        ...memo,
        [section]: [...(memo[section] || []), tempMemo],
      };
      setMemo(updatedMemo);
      handleSaveMemo(selectedDate.format('YYYY/MM/DD'), updatedMemo);
      setSection(null);
      setTempMemo('');
    }
  };

  const handleDelete = () => {
    const updatedMemo = { ...memo };
    Object.keys(checked).forEach((key) => {
      if (checked[key].length > 0) {
        updatedMemo[key] = updatedMemo[key].filter((_, index) => !checked[key].includes(index));
      }
    });
    setMemo(updatedMemo);
    handleDeleteMemo(selectedDate.format('YYYY/MM/DD'), updatedMemo);
    setChecked({ hospital: [], medicationTime: [], pain: [] });
  };

  const handleCheckboxChange = (sectionName, index) => {
    setChecked((prevChecked) => ({
      ...prevChecked,
      [sectionName]: prevChecked[sectionName].includes(index)
        ? prevChecked[sectionName].filter((i) => i !== index)
        : [...prevChecked[sectionName], index],
    }));
  };

  const handleCancel = () => {
    setSection(null);
    setTempMemo('');
    handleClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ fontFamily: 'Gmarket Sans Light, sans-serif' }}>
          {selectedDate ? selectedDate.format('YYYY/MM/DD') : '날짜를 선택하세요'}
        </Typography>

        <Grid container spacing={1} sx={{ mt: 1 }} justifyContent="space-around">
          <Grid item>
            <Box sx={boxStyle} onClick={() => handleSectionClick('hospital')}>
              <IconButton onClick={() => handleSectionClick('hospital')}>
                <LocalHospitalIcon />
              </IconButton>
              <Typography variant="caption" sx={{ display: 'inline', cursor: 'pointer', fontFamily: 'Gmarket Sans Light, sans-serif' }}>
                병원(처방내용)
              </Typography>
            </Box>
            {memo.hospital && Array.isArray(memo.hospital) && !section && (
              <Grid container alignItems="center" direction="column">
                {memo.hospital.map((item, index) => (
                  <FormControlLabel
                    key={index}
                    control={
                      <Checkbox
                        checked={checked.hospital.includes(index)}
                        onChange={() => handleCheckboxChange('hospital', index)}
                      />
                    }
                    label={item}
                    sx={{
                      '& .MuiTypography-root': {
                        fontFamily: 'Gmarket Sans Light, sans-serif'
                      }
                    }}
                  />
                ))}
              </Grid>
            )}
          </Grid>
          <Grid item>
            <Box sx={boxStyle} onClick={() => handleSectionClick('medicationTime')}>
              <IconButton onClick={() => handleSectionClick('medicationTime')}>
                <AccessTimeIcon />
              </IconButton>
              <Typography variant="caption" sx={{ display: 'inline', cursor: 'pointer', fontFamily: 'Gmarket Sans Light, sans-serif' }}>
                약 복용 시간
              </Typography>
            </Box>
            {memo.medicationTime && Array.isArray(memo.medicationTime) && !section && (
              <Grid container alignItems="center" direction="column">
                {memo.medicationTime.map((item, index) => (
                  <FormControlLabel
                    key={index}
                    control={
                      <Checkbox
                        checked={checked.medicationTime.includes(index)}
                        onChange={() => handleCheckboxChange('medicationTime', index)}
                      />
                    }
                    label={item}
                    sx={{
                      '& .MuiTypography-root': {
                        fontFamily: 'Gmarket Sans Light, sans-serif'
                      }
                    }}
                  />
                ))}
              </Grid>
            )}
          </Grid>
          <Grid item>
            <Box sx={boxStyle} onClick={() => handleSectionClick('pain')}>
              <IconButton onClick={() => handleSectionClick('pain')}>
                <HealingIcon />
              </IconButton>
              <Typography variant="caption" sx={{ display: 'inline', cursor: 'pointer', fontFamily: 'Gmarket Sans Light, sans-serif' }}>
                통증
              </Typography>
            </Box>
            {memo.pain && Array.isArray(memo.pain) && !section && (
              <Grid container alignItems="center" direction="column">
                {memo.pain.map((item, index) => (
                  <FormControlLabel
                    key={index}
                    control={
                      <Checkbox
                        checked={checked.pain.includes(index)}
                        onChange={() => handleCheckboxChange('pain', index)}
                      />
                    }
                    label={item}
                    sx={{
                      '& .MuiTypography-root': {
                        fontFamily: 'Gmarket Sans Light, sans-serif'
                      }
                    }}
                  />
                ))}
              </Grid>
            )}
          </Grid>
        </Grid>

        {section && (
          <TextField
            fullWidth
            label={section === 'hospital' ? '병원(처방내용)' : section === 'medicationTime' ? '약 복용 시간' : '통증'}
            multiline
            rows={4}
            variant="outlined"
            value={tempMemo}
            onChange={(e) => setTempMemo(e.target.value)}
            sx={{
              mt: 3,
              '& .MuiInputBase-input': { fontFamily: 'Gmarket Sans Light, sans-serif' },
              '& .MuiInputLabel-root': { fontFamily: 'Gmarket Sans Light, sans-serif' }
            }}
          />
        )}

        <Grid container spacing={1} sx={{ mt: 2 }} justifyContent="center">
          <Grid item>
            <Button variant="contained" color="primary" onClick={handleSave} sx={buttonStyle}>
              저장
            </Button>
          </Grid>
          <Grid item>
            <Button variant="contained" color="secondary" onClick={handleDelete} sx={buttonStyle}>
              삭제
            </Button>
          </Grid>
          <Grid item>
            <Button variant="outlined" onClick={handleCancel} sx={buttonStyle}>
              취소
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
};

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const boxStyle = {
  display: 'flex',
  flexDirection: 'column', // Set the flex direction to column
  alignItems: 'center',
  border: '1px solid #ccc',
  borderRadius: '8px',
  padding: '1px 8px',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  fontSize: '0.875rem',
  fontFamily: 'Gmarket Sans Light, sans-serif',
};

const buttonStyle = {
  minWidth: '64px',
  padding: '4px 8px',
  fontSize: '0.75rem',
  fontFamily: 'Gmarket Sans Light, sans-serif',
};

export default MemoModal;
