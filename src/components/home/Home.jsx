import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
    const [query, setQuery] = useState('');
    const [newsData, setNewsData] = useState([]);
    const [memo, setMemo] = useState([]);
    const [diseaseData, setDiseaseData] = useState([]);
    const [recentDisease, setRecentDisease] = useState([]);
    const [icons, setIcons] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isMemoOpen, setIsMemoOpen] = useState(false);
    const [selectedDiseaseDescription, setSelectedDiseaseDescription] = useState('');
    const [selectedDiseaseName, setSelectedDiseaseName] = useState('');
    const [selectedDiseaseTime, setSelectedDiseaseTime] = useState('');
    const [selectedDepartments, setSelectedDepartments] = useState([]);
    const navigate = useNavigate();
    const userId = localStorage.getItem('user_id');

    // 최근 질병 데이터 및 빈도수 가져오기
    const readRecentDisease = async () => {
        const response = await axios.get(`/disease/get/data-recent/${userId}`);
        setRecentDisease(response.data);

        const diseaseDataResponse = await axios.get(`/disease/disease-frequencies/${userId}`);
        const diseaseData = diseaseDataResponse.data;
        setDiseaseData(diseaseData);
    };

    // 질병에 대한 아이콘 가져오기
    const fetchIcons = async () => {
        const newIcons = {};
        for (const disease of recentDisease) {
            const response = await axios.get(`/disease/get/icon/${disease.disease_name}`);
            newIcons[disease.disease_name] = response.data.icon;
        }
        setIcons(newIcons);
    };

    // 처음 들어올 때 localStorage 데이터 가져오기
    useEffect(() => {
        const storedNewsData = JSON.parse(localStorage.getItem('newsData'));
        readRecentDisease();
        setNewsData(storedNewsData);
    }, []);

    
    // 최근 질병 데이터가 변경될 때마다 새로 가져오기
    useEffect(() => {
        if (recentDisease.length > 0) {
            fetchIcons();
        }
    }, [recentDisease]);

    // 검색어 입력하기 위한 Change 함수
    const handleSearchChange = (event) => {
        setQuery(event.target.value);
    };

    // 검색어 입력 시 chatbot page 이동
    const handleSearchSubmit = (event) => {
        event.preventDefault();
        navigate('/chatbot', { state: { query, chatType: '질병 상담' } });
    };

    // 뉴스 link 이동
    const handleCardClick = (link) => {
        window.open(link, '_blank');
    };

    // 뉴스 정보 요약
    const truncateSummary = (summary) => {
        return summary && summary.length > 50 ? summary.slice(0, 50) + '...' : summary;
    };

    // 최근 질병 클릭 시 질병 정보 Modal창 열기 & 해당 정보 가져오기
    const handleDiseaseClick = async(diseaseName, dateTime) => {
        const disease = await axios.get(`/disease/get/description/${diseaseName}`);
        setSelectedDiseaseName(diseaseName);
        setSelectedDiseaseDescription(disease.data.description); 
        setSelectedDiseaseTime(dateTime.substr(0,10));

        const response = await axios.get(`/disease/department_by_disease/${diseaseName}`);
        const departments = response.data.map(dept => dept.department_name);
        setSelectedDepartments(departments); 
        setIsModalOpen(true);
    };

    // Modal 닫기
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedDiseaseName('');
        setSelectedDiseaseDescription('');
        setSelectedDiseaseTime('');
    };

    // 메모 아이콘 클릭 시 Memo Modal 창 열기 & 캘린더 데이터 가져오기
    const handleMemoClick = async() => {
        const memo = await axios.get(`/calendar/monthly-frequency/${userId}`);
        setMemo(memo.data);
        console.log(memo.data);
        setIsMemoOpen(true);
    }

    // Memo Modal 창 닫기
    const closeMemo = () => {
        setIsMemoOpen(false);
        setMemo('');
    };

    // 질병 빈도수 히스토그램으로 표현
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
    
            const maxFrequency = sortedData[0].frequency;
            const maxHeight = 120;
    
        return (
            <div className="home-histogram-container">
                {sortedData.map((item, index) => {
                    const displayName = item.name.length > 3 ? item.name.slice(0, 3) + '...' : item.name;
                    const intensity = (item.frequency / maxFrequency) * 0.7 + 0.3; 
                    const barHeight = (item.frequency / maxFrequency) * maxHeight;
    
                    return (
                        <div key={index} className="home-histogram-bar">
                            <span className="home-frequency-label">{item.frequency}</span>
                            <span className="home-disease-name" title={item.name}>{displayName}</span>
                            <div
                                className="home-bar"
                                style={{ 
                                     '--bar-height': `${barHeight}px`,
                                    backgroundColor: `rgba(0, 123, 255, ${intensity})`
                                }}
                            ></div>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="home-dashboard">
            <div className='home-other-wrap'>
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
                <div className="home-previous-conditions-header">
                    <div className="home-previous-conditions-title">최근 상담 내역</div>
                    <div className="home-memo-icon" onClick={handleMemoClick}>📝</div>
                </div>
                    <div className="home-conditions-list">
                        {recentDisease.length > 0 ? (
                            recentDisease.map((data, index) => (
                                <div key={index} className="home-condition-disease" onClick={() => handleDiseaseClick(data.disease_name, data.date_time)}>
                                    {icons[data.disease_name]}
                                    {data.disease_name}
                                </div>
                            ))
                        ) : (
                            <div></div>
                        )}
                    </div>
                    <div className="home-word-cloud">
                        {renderHistogram()}
                    </div>
                </div>
                <div className="home-points">
                    <div className='home-news-card-header-title'>오늘의 건강소식</div>
                </div>
            </div>
            <div>
                <div className='home-news-card-wrap'>
                        {newsData ? (
                            newsData.map((news, index) => (
                                <div className="home-news-card" key={index} onClick={() => handleCardClick(news.link)}>
                                    <div className="home-news-card-title">{news.title}</div>
                                    <p>{truncateSummary(news.summary)}</p>
                                    <button onClick={() => handleCardClick(news.link)}>Read ▷</button>
                                </div>
                            ))
                        ) : (<p>뉴스를 불러오는 중입니다.....</p>)}
                </div>
            </div>
            
            

            {isModalOpen && (
                <div className="home-modal">
                    <div className="home-modal-content">
                        <span className="home-modal-close" onClick={closeModal}>&times;</span>
                        <h4>{selectedDiseaseName}</h4>
                        <hr></hr>
                        <p className='home-modal-content-title'>상담 날짜: {selectedDiseaseTime}</p>
                        <p className='home-modal-content-title'>{selectedDiseaseDescription}</p>
                        {selectedDepartments.length > 0 ? (
                            <div>
                                <p className='home-modal-department-title'>MediNavi는 다음 진료과를 추천합니다</p>
                                {selectedDepartments.map((department, index) => (
                                    <button
                                        key={index}
                                        className="home-department-button"
                                        onClick={() => navigate(`/local?query=${department}`)}>
                                        {department}
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <p>진료과 정보를 가져오는 중입니다...</p>
                        )}
                    </div>
                </div>
            )}

            {isMemoOpen && (
                <div className="home-memo">
                    <div className="home-memo-content">
                        <span className="home-memo-close" onClick={closeMemo}>&times;</span>
                        <p><span className="highlighted-memo">이번 달 의료 기록은</span></p>
                        <p>병원을 <span className="highlighted-memo">{memo.병원}</span>번 방문하셨고</p>
                        <p>약은 <span className="highlighted-memo">{memo.약}</span>번 복용하셨고</p>
                        <p><span className="highlighted-memo">{memo.통증}</span>번의 통증이 있으셨습니다.</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Home;



