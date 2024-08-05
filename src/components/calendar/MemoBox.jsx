import React from 'react';
import { Typography, IconButton, Box } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const MemoBox = ({ date, memo, handleDeleteMemo }) => {
  const isEmptyMemo = !memo.hospital?.length && !memo.medicationTime?.length && !memo.pain?.length;

  const handleDelete = (section, index) => {
    const updatedMemo = { ...memo };
    updatedMemo[section].splice(index, 1);
    handleDeleteMemo(date, updatedMemo);
  };

  return (
    <Box
      mt={0.5}
      display="flex"
      flexDirection="row"
      alignItems="center"
      justifyContent={isEmptyMemo ? 'center' : 'flex-start'}
      sx={{
        height: '100px',
        maxHeight: '200px',
        overflow: 'hidden',
        fontSize: '14px',
        border: '1px solid #ccc',
        padding: '4px',
        borderRadius: '8px',
        position: 'relative',
        textAlign: isEmptyMemo ? 'center' : 'left',
      }}
    >
      {isEmptyMemo ? (
        <Typography variant="body2" sx={{ fontFamily: 'GmarketSans' }}>
          I'm your Medinavi
        </Typography>
      ) : (
        <>
          <Box sx={{ minWidth: '80px', paddingRight: '8px', borderRight: '1px solid #ccc', display: 'flex', alignItems: 'center' }}>
            <Typography variant="body2" sx={{ fontFamily: 'GmarketSans', textAlign: 'left', fontSize: '0.83em' }}>
              {date}
            </Typography>
          </Box>
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
            width: '100%',
            height: 'calc(100% - 24px)',
            overflowY: 'auto',
            paddingLeft: '8px',
            paddingTop: '12px',
          }}>
            {(memo.hospital && Array.isArray(memo.hospital) ? memo.hospital : []).map((item, index) => (
              <Box key={index} display="flex" alignItems="center" width="100%" sx={{ minHeight: '24px', padding: '1px 0', marginBottom: '1px', borderRadius: '4px' }}>
                <Typography variant="body2" sx={{ fontFamily: 'GmarketSans', flex: 1 }}>병원(처방내용): {item}</Typography>
                <IconButton onClick={() => handleDelete('hospital', index)} size="small">
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            ))}
            {(memo.medicationTime && Array.isArray(memo.medicationTime) ? memo.medicationTime : []).map((item, index) => (
              <Box key={index} display="flex" alignItems="center" width="100%" sx={{ minHeight: '24px', padding: '1px 0', marginBottom: '1px', borderRadius: '4px' }}>
                <Typography variant="body2" sx={{ fontFamily: 'GmarketSans', flex: 1 }}>약 복용 시간: {item}</Typography>
                <IconButton onClick={() => handleDelete('medicationTime', index)} size="small">
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            ))}
            {(memo.pain && Array.isArray(memo.pain) ? memo.pain : []).map((item, index) => (
              <Box key={index} display="flex" alignItems="center" width="100%" sx={{ minHeight: '24px', padding: '1px 0', marginBottom: '1px', borderRadius: '4px' }}>
                <Typography variant="body2" sx={{ fontFamily: 'GmarketSans', flex: 1 }}>통증: {item}</Typography>
                <IconButton onClick={() => handleDelete('pain', index)} size="small">
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            ))}
          </Box>
        </>
      )}
    </Box>
  );
};

export default MemoBox;
