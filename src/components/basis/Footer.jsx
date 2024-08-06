import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaCalendarAlt, FaMap } from "react-icons/fa";
import { IoChatbubbleEllipsesSharp, IoSettingsSharp } from "react-icons/io5";

const Footer = () => {
    const location = useLocation();

    const getIconColor = (path) => {
        const currentPath = location.pathname;
        if (Array.isArray(path)) {
            return path.some(p => currentPath.startsWith(p)) ? 'rgb(54, 138, 255)' : 'rgb(152, 152, 152)';
        }
        return currentPath.startsWith(path) ? 'rgb(54, 138, 255)' : 'rgb(152, 152, 152)';
    };

    return (
        <div className='footer'>
            <div className='footer-box'>
                <div className='icon-text'>
                    <Link to='/calendar'>
                        <FaCalendarAlt className='icon' style={{ color: getIconColor('/calendar') }} />
                    </Link>
                    <span style={{ color: getIconColor('/calendar') }}>Calendar</span>
                </div>
                <div className='icon-text'>
                    <Link to='/chatbot'>
                        <IoChatbubbleEllipsesSharp className='icon' style={{ color: getIconColor('/chatbot') }} />
                    </Link>
                    <span style={{ color: getIconColor('/chatbot') }}>Chatbot</span>
                </div>
                <div className='icon-text'>
                    <Link to='/home'>
                        <FaHome className='icon' style={{ color: getIconColor('/home') }} />
                    </Link>
                    <span style={{ color: getIconColor('/home') }}>Home</span>
                </div>
                <div className='icon-text'>
                    <Link to='/local'>
                        <FaMap className='icon' style={{ color: getIconColor(['/local', '/local/list']) }} />
                    </Link>
                    <span style={{ color: getIconColor(['/local', '/local/list']) }}>Map</span>
                </div>
                <div className='icon-text'>
                    <Link to='/mypage'>
                        <IoSettingsSharp className='icon' style={{ color: getIconColor(['/mypage', '/mypage/account', '/mypage/faq', '/mypage/about']) }} />
                    </Link>
                    <span style={{ color: getIconColor(['/mypage', '/mypage/account', '/mypage/faq', '/mypage/about']) }}>Setting</span>
                </div>
            </div>
        </div>
    );
}

export default Footer;
