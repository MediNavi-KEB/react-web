import React, { useEffect, useState } from 'react';
import homeClickImg from './images/homeClick.png';
import sectionClickImg from './images/sectionClick.png';
import chattingClickImg from './images/chattingClick.png';
import mapClickImg from './images/mapClick.png';
import './ChatDescription.css';
import axios from 'axios';


const ChatDescription = ({ onClose }) => { // onClose prop 추가
    const [currentPopup, setCurrentPopup] = useState(0);
    const [showPopup, setShowPopup] = useState(true);
    const [showDiseaseList, setShowDiseaseList] = useState(false);
    const [doNotShowAgain, setDoNotShowAgain] = useState(false);
    const userId = localStorage.getItem('user_id');

    const handleNext = () => {
        if (currentPopup < popups.length - 1) {
        setCurrentPopup((prev) => (prev + 1));
        }
    };

    const handlePrev = () => {
        if (currentPopup > 0) {
        setCurrentPopup((prev) => (prev - 1));
        }
    };

    const updateUserPreference = async () => {
        try {
            await axios.put(`/user/update/chat_description/${userId}`, { chat_description: 'X' });
        } catch (error) {
            console.error("Error updating user preference", error);
        }
    };

    const handleCheckboxChange = () => {
        setDoNotShowAgain(!doNotShowAgain);
    };

    const handleSkip = () => {
        if (doNotShowAgain) {
            updateUserPreference(); 
        }
        setShowPopup(false);
        onClose(); // ChatDescription을 닫는 함수 호출
    };

    const handleShowDiseaseList = () => {
        setShowDiseaseList(true); 
    };

    const handleCloseDiseaseList = () => {
        setShowDiseaseList(false);
    };

    const popups = [
        {
        id: 1,
        content: (
            <div className="popup-content-id-1">
            <span className="bold-large-text-1">반갑습니다!</span>
            <span className="bold-large-text-2">의료챗봇 이용 방법 안내드릴게요.</span>
            <span className="small-gray-text-1">화면 상단의 검색창</span>
            <span className="small-gray-text-2">혹은 하단의 '챗봇' 아이콘을 클릭해주세요</span>
            <img src={homeClickImg} className="popup-image" alt="홈 클릭" />
            </div>
        ),
        },
        {
        id: 2,
        content: (
            <div className="popup-content-id-2">
            <span className="bold-large-text-1">챗봇 이용 카테고리를 선택해주세요.</span>
            <span className="small-gray-text-1">질병상담과 기타문의 중 한가지를 선택해주세요</span>
            <span className="small-gray-text-2">질병 상담: 증상 - 질병 유추 - 병원 추천의 프로세스로 진행됩니다</span>
            <span className="small-gray-text-3">기타 문의: 질병 및 메디컬 이슈에 대한 궁금증을 답변해드립니다.</span>
            <img src={sectionClickImg} className="popup-image" alt="섹션 클릭" />
            </div>
        ),
        },
        {
        id: 3,
        content: (
            <div className="popup-content-id-3">
            <span className="bold-large-text">증상 입력 방법을 알려드릴게요.</span>
            <span className="small-gray-text-1 with-margin">사용자님의 증상을 자세하게 입력해주세요.</span>
            <span className="small-gray-text-2">MediNavi는 총 29개의 질병에 대해 측정합니다.</span>
            <span className="small-gray-text clickable" onClick={handleShowDiseaseList}>
                질병 목록 보기
            </span>
            <img src={chattingClickImg} className="popup-image" alt="채팅 클릭" />
            </div>
        ),
        },
        {
        id: 4,
        content: (
            <div className="popup-content-id-4">
            <span className="bold-large-text">가장 가까운 병원을 추천해드릴게요.</span>
            <span className="small-gray-text-1 with-margin">챗봇에서 '병원 추천' 아이콘을 클릭하면</span>
            <span className="small-gray-text-2">맵으로 이동해 사용자님 근처의 병원을 추천해드릴게요.</span>
            <button className="square-btn" onClick={handleSkip}>채팅을 시작할게요</button>
            <img src={mapClickImg} className="popup-image" alt="맵클릭" />
            <div className='popup-checkbox-wrap'>
                <input className='popup-checkbox' type='checkbox' checked={doNotShowAgain} onChange={handleCheckboxChange}/>
                <label className='popup-checkbox-label'>다시 보지 않기</label>
            </div>
            </div>
        ),
        },
    ];

    return (
        <div>
        {showPopup && (
            <div className="popup-container">
            <div className="popup">
                <button className="skip-btn" onClick={handleSkip}>건너뛰기</button>
                <button className="arrow-btn left" onClick={handlePrev}>&lt;</button>
                <div className="popup-content">{popups[currentPopup].content}</div>
                <button className="arrow-btn right" onClick={handleNext}>&gt;</button>
                <div className="page-indicators">
                {popups.map((_, index) => (
                    <div
                    key={index}
                    className={`indicator ${index === currentPopup ? 'active' : ''}`}
                    />
                ))}
                </div>
            </div>
            </div>
        )}

        {showDiseaseList && (
            <div className="disease-list-popup">
            <div className="disease-list-content">
                <div className='disease-list-title-wrap'>
                <h2 className='disease-list-title'>질병 목록</h2>
                <button className="close-btn" onClick={handleCloseDiseaseList}>
                    닫기
                </button>
                </div>
                <ul className="disease-list">
                {[
                    "간염",
                    "감기",
                    "갑상샘 저하증",
                    "갑상샘 향진증",
                    "건선",
                    "결핵",
                    "고혈압",
                    "관절염",
                    "기관지 천식",
                    "뇌출혈",
                    "당뇨병",
                    "디스크",
                    "방광염",
                    "위궤양",
                    "수두",
                    "식중독",
                    "알레르기",
                    "여드름",
                    "요로감염",
                    "위식도역류질환",
                    "위장염",
                    "이석증",
                    "장염",
                    "저혈당증",
                    "정맥류",
                    "진균 감염",
                    "편두통",
                    "폐렴",
                    "황달"
                ].map((disease, index) => (
                    <li key={index}>{disease}</li>
                ))}
                </ul>
            </div>
            </div>
        )}
        </div>
    );
}

export default ChatDescription;
