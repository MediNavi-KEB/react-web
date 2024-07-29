import React from 'react';
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  return (
    <div className="header">
      <IoArrowBackCircleOutline className='icon-header' onClick={() => navigate(-1)} />
    </div>
  );
}

export default Header;