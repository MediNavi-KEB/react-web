import React from 'react'
import { Link } from 'react-router-dom'
import { FaHome, FaCalendarAlt, FaMap } from "react-icons/fa";
import { IoChatbubbleEllipsesSharp, IoSettingsSharp } from "react-icons/io5";

const Footer = () => {
    return (
        <div className='footer'>
            <div className='icon-text'>
                <Link to ='/calendar'>
                    <FaCalendarAlt className='icon'/>
                </Link>
                <span>Calendar</span>
            </div>
            <div className='icon-text'>
                <Link to ='/chatbot'>
                    <IoChatbubbleEllipsesSharp className='icon'/>
                </Link>
                <span>Chatboot</span>
            </div>
            <div className='icon-text'>
                <Link to ='/home'>
                    <FaHome className='icon'/>
                </Link>
                <span>Home</span>
            </div>
            <div className='icon-text'>
                <Link to ='/local'>
                    <FaMap className='icon'/>
                </Link>
                <span>Map</span>
            </div>
            <div className='icon-text'>
                <Link to ='/mypage'>
                    <IoSettingsSharp className='icon'/>
                </Link>
                <span>Setting</span>
            </div>
        </div>
    )
}

export default Footer
