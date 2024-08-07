import React, { useEffect, useState } from 'react';
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { useNavigate, useLocation } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  // const location = useLocation();
  // const [previousPath, setPreviousPath] = useState(null);

  // useEffect(() => {
  //   // 페이지 이동 시마다 현재 경로를 이전 경로로 설정
  //   return () => {
  //     setPreviousPath(location.pathname);
  //   };
  // }, [location]);

  const handleBack = () => {
    navigate(-1);
    // if (previousPath !== '/login') {
      
    // }
  };

  return (
    <div className="header">
      <IoArrowBackCircleOutline className='icon-header' onClick={handleBack} />
    </div>
  );
}

export default Header;
