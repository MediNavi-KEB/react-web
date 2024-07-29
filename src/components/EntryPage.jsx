// EntryPage.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BeatLoader } from 'react-spinners';

const EntryPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/login'); // 3초 후에 로그인 페이지로 이동
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className='entry-container'>
      <BeatLoader
        color="#3da2eb"
        loading
        margin={3}
        size={20}
        speedMultiplier={1}
      />
      <h3 className='mt-5' style={{ color: 'skyblue' }}>
        페이지를 불러오고 있습니다👋🏻
      </h3>
    </div>
  );
}

export default EntryPage;
