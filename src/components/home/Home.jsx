import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import axios from 'axios';

const Home = () => {
    const [query, setQuery] = useState('');
    const [newsData, setNewsData] = useState({});
    const [diseaseData, setDiseaseData] = useState([]);
    const [recentDisease, setRecentDisease] = useState([]);
    const navigate = useNavigate();
    const userId = localStorage.getItem('user_id');

    const readRecentDisease = async() => {
        const response = await axios.get(`/disease/get/data-recent/${userId}`)
        const diseaseNames = response.data.map(item => item.disease_name);
        console.log(diseaseNames.data)
        setRecentDisease(diseaseNames)
    }

    useEffect(() => {
        // Home 페이지로 이동할 때 Local Storage에서 데이터를 가져옴
        const storedNewsData = JSON.parse(localStorage.getItem('newsData'));
        const storedDiseaseData = JSON.parse(localStorage.getItem('diseaseData'));
        readRecentDisease();

        setDiseaseData(storedDiseaseData);
        setNewsData(storedNewsData);
    }, []);

    const handleSearchChange = (event) => {
        setQuery(event.target.value);
    };

    const handleSearchSubmit = (event) => {
        event.preventDefault();
        navigate('/chatbot', { state: { query, chatType: '질병 상담' } });
    };

    const handleCardClick = (link) => {
        window.open(link, '_blank');
    };

    const truncateSummary = (summary) => {
        return summary && summary.length > 50 ? summary.slice(0, 50) + '...' : summary;
    };

    const renderHistogram = () => {
        if (!diseaseData || diseaseData.length === 0) {
            return (
                <div className='home-nodata'>
                    <p>아직 수집된 데이터가 없습니다</p>
                    <p>챗봇을 이용하여 데이터를 수집해보세요!</p>
                </div>
            );
        }
        
        const sortedData = diseaseData
        .sort((a, b) => b.frequency - a.frequency)
        .slice(0, 7);
    
        return (
            <div className="home-histogram-container">
                {sortedData.map((item, index) => {
                    const displayName = item.name.length > 3 ? item.name.slice(0, 3) + '...' : item.name;

                    return (
                        <div key={index} className="home-histogram-bar">
                            <span className="home-disease-name" title={item.name}>{displayName}</span>
                            <div
                                className="home-bar"
                                style={{ '--bar-height': `${item.frequency * 10}px` }} // 동적 높이 설정
                            ></div>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
    <div className="home-dashboard">
        <div className="home-brand">
            <h1>MEDINAVI</h1>
        </div>
        <div className="home-search-section">
            <form onSubmit={handleSearchSubmit} className="home-search-form">
            <input
                type="text"
                placeholder="어디가 불편하신가요?"
                value={query}
                onChange={handleSearchChange}
                className="home-search-input"
            />
            </form>
        </div>
        <div className="home-previous-conditions">
            <h3>최근 상담 내역</h3>
            <div className="home-conditions-list">
            {/* {['🤕 고혈압', '🤢 구토', '🤒 감기몸살', '🩸 빈혈'].map((condition, index) => ( */}
            {recentDisease.map((condition, index) => (
                <div key={index} className="home-condition-item">{condition}</div>
            ))}
            </div>
            <div className="home-word-cloud">
            {renderHistogram()}
            </div>
        </div>
        <div className="home-points">
            <div className="home-news-card-header">
            <h4>오늘의 건강소식</h4>
            </div>
            {newsData ? (
            <div className="home-news-card" onClick={() => handleCardClick(newsData.link)}>
                <h4>{newsData.title}</h4>
                <p>{truncateSummary(newsData.summary)}</p>
                <button onClick={() => handleCardClick(newsData.link)}>Read ▷</button>
            </div>
            ) : (
            <p>뉴스를 불러오는 중입니다...</p>
            )}
        </div>
    </div>
    );
}

export default Home;
