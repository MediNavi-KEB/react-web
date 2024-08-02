import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const [query, setQuery] = useState('');
    const navigate = useNavigate();

    const handleSearchChange = (event) => {
        setQuery(event.target.value);
    };

    const handleSearchSubmit = (event) => {
        event.preventDefault();
        navigate('/chatbot', { state: { query } });
    };

    const handleCardClick = (url) => {
        window.location.href = url;
    };

    return (
        <div className="home-dashboard">
        <div className='title'>Home</div>
        <div className="home-search-section">
            <form onSubmit={handleSearchSubmit} className="home-search-form">
            <input
                type="text"
                placeholder="어디가 불편하신가요?"
                value={query}
                onChange={handleSearchChange}
                className="home-search-input"
            />
            <button type="submit" className="home-search-icon">
                🔍
            </button>
            </form>
        </div>
        <div className="home-previous-conditions">
            <h3>최근 상담 내역</h3>
            <div className="home-conditions-list">
            <div className="home-condition-item">🤕 고혈압</div>
            <div className="home-condition-item">🤢 구토</div>
            <div className="home-condition-item">🤒 감기몸살</div>
            <div className="home-condition-item">🩸 빈혈</div>
            <div className="home-condition-item">🌡️ 열</div>
            <div className="home-condition-item">💊 항생제</div>
            <div className="home-condition-item">💊 항생제</div>
            <div className="home-condition-item">💊 항생제</div>
            <div className="home-condition-item">💊 항생제</div>
            {/* More items can be added here */}
            </div>
        </div>
        <hr className="home-divider" />
        <div className="home-points">
            <div className="home-news-card" onClick={() => handleCardClick('https://kormedi.com/todayhealth/')}>
            <h4>오늘의 소식</h4>
            <p>오늘의 건강 소식을 확인하세요!</p>
            <button onClick={() => window.location.href = 'https://kormedi.com/todayhealth/'}>Read</button>
            </div>
            <div className="home-news-card" onClick={() => handleCardClick('https://www.newsis.com/view/NISX20240731_0002833595')}>
            <h4>Today</h4>
            <p>장마 끝 무더위 시작.. 건강관리 유의</p>
            </div>
            <div className="home-news-card" onClick={() => handleCardClick('https://news.sbs.co.kr/news/endPage.do?news_id=N1007746552&plink=ORI&cooper=NAVER')}>
            <h4>Yesterday</h4>
            <p>코로나19 다시 유행... 입원환자 3배 증가</p>
            </div>
        </div>
        </div>
    );
}

export default Home;