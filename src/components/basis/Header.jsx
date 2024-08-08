import React from 'react';
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { useLocation, useNavigate } from 'react-router-dom';

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleBack = () => {
        if (location.pathname === '/chatbot'){
            navigate('/home');
        } else {
            navigate(-1);
        }
    };

    return (
        <div className="header">
            <IoArrowBackCircleOutline className='icon-header' onClick={handleBack} />
        </div>
    );
}

export default Header;
