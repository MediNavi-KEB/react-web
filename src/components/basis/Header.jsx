import React from 'react';
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="header">
      <IoArrowBackCircleOutline className='icon-header' onClick={handleBack} />
    </div>
  );
}

export default Header;
