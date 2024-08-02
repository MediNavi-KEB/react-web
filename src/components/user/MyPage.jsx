import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { IoAccessibility } from "react-icons/io5";
import { FaStar } from "react-icons/fa6";
import { FaQuestionCircle } from "react-icons/fa";
import { FaCircleExclamation } from "react-icons/fa6";
import { IoIosArrowForward } from "react-icons/io";
import { RiLogoutBoxLine } from "react-icons/ri";
import { MdOutlineDeleteForever } from "react-icons/md";
import { Link, useNavigate } from 'react-router-dom';

const MyPage = () => {

    const [user, setUser] = useState({});
    const navigate = useNavigate();

    const loadingUserData = async() => {
        const userId = localStorage.getItem('user_id');
        const response = await axios.get(`/user/get/${userId}`);
        // console.log(response.data)
        setUser(response.data)
    }
    useEffect(()=> {
        loadingUserData();
    }, []);

    const onClickLogout = () => {
        if(window.confirm('로그아웃 하시겠습니까?')){
            localStorage.removeItem('user_id');
            navigate('/login');
        }
    }

    const onClickQuit = async() => {
        if(window.confirm('계정을 삭제하시겠습니까?')){
            try{
                const userId = localStorage.getItem('user_id');
                await axios.delete(`/user/delete/${userId}`);
                localStorage.removeItem('user_id');
                alert('계정이 삭제되었습니다.');
                navigate('/login');
            } catch(error){
                console.error('계정 삭제 실패 :', error);
                alert('계정 삭제를 실패했습니다.');
            }
        }
    }

    return (
        <div>
            <div className='title'>Setting</div>
            <div className='mypage-img-container'>
                <img src={user.gender === '남성' ? 'https://cdn-icons-png.flaticon.com/128/6997/6997506.png' : 'https://cdn-icons-png.flaticon.com/128/6997/6997662.png'} alt="Profile" />
                <h3 className='mt-3' style={{color:'#5a5a59'}}>{user.user_id}</h3>
            </div>

            <div className='mypage-list-group-total'>
                <div className='mypage-list-group'>
                    <Link to="/mypage/account" state={{ user }} className='custom-link'>
                        <div className='mypage-list' style={{float:'left'}}><IoAccessibility className='mypage-icon-spacing'/>  Account</div>
                        <div className='mypage-list-forward ' style={{float:'right'}}><IoIosArrowForward/></div>
                    </Link>
                </div>
                <hr className="section-divider" />

                <div className='mypage-list-group'>
                    <div className='mypage-list' style={{float:'left'}}><FaStar className='mypage-icon-spacing'/>  Saved</div>
                    <div className='mypage-list-forward ' style={{float:'right'}}><IoIosArrowForward/></div>
                </div>
                <hr className="section-divider" />

                <div className='mypage-list-group'>
                    <Link to="/mypage/faq" className='custom-link'>
                        <div className='mypage-list' style={{float:'left'}}><FaQuestionCircle className='mypage-icon-spacing'/>  FAQ</div>
                        <div className='mypage-list-forward ' style={{float:'right'}}><IoIosArrowForward/></div>
                    </Link>
                </div>
                <hr className="section-divider" />

                <div className='mypage-list-group'>
                    <Link to="/mypage/about" className='custom-link'>
                        <div className='mypage-list' style={{float:'left'}}><FaCircleExclamation className='mypage-icon-spacing'/>  About</div>
                        <div className='mypage-list-forward ' style={{float:'right'}}><IoIosArrowForward/></div>
                    </Link>
                </div>
                <hr className="section-divider" />
            </div>
            <div className='mypage-button-container'>
                <div className='mypage-button-group' onClick={onClickLogout}>
                        <div className='mypage-button'><RiLogoutBoxLine className='mypage-icon-spacing'/>  Logout</div>
                        <div className='mypage-button-forward' ><IoIosArrowForward/></div>
                </div>
                <div className='mypage-button-group' onClick={onClickQuit}>
                        <div className='mypage-button'><MdOutlineDeleteForever className='mypage-icon-spacing'/> Quit</div>
                        <div className='mypage-button-forward' ><IoIosArrowForward/></div>
                </div>
            </div>
            
            <hr className="section-divider" />
        </div>
    )
}

export default MyPage
