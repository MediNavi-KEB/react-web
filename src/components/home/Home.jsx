// // import React, { useState, useEffect } from 'react';
// // import { useNavigate } from 'react-router-dom';
// // import './Home.css';
// // import axios from 'axios';

// // const Home = () => {
// //     const [query, setQuery] = useState('');
// //     const [newsData, setNewsData] = useState([]);
// //     const [diseaseData, setDiseaseData] = useState([]);
// //     const [recentDisease, setRecentDisease] = useState([]);
// //     const [icons, setIcons] = useState({});
// //     const [isModalOpen, setIsModalOpen] = useState(false);
// //     const navigate = useNavigate();
// //     const userId = localStorage.getItem('user_id');

// //     const readRecentDisease = async() => {
// //         const response = await axios.get(`/disease/get/data-recent/${userId}`)
// //         setRecentDisease(response.data);
// //     }

// //     const fetchIcons = async () => {
// //         const newIcons = {};
// //         for (const disease of recentDisease) {
// //             const response = await axios.get(`/disease/get/icon/${disease.disease_name}`);
// //             newIcons[disease.disease_name] = response.data.icon;
// //         }
// //         setIcons(newIcons);
// //     };

// //     useEffect(() => {
// //         const storedNewsData = JSON.parse(localStorage.getItem('newsData'));
// //         const storedDiseaseData = JSON.parse(localStorage.getItem('diseaseData'));
// //         readRecentDisease();

// //         setDiseaseData(storedDiseaseData);
// //         setNewsData(storedNewsData);
// //     }, []);

// //     useEffect(() => {
// //         if (recentDisease.length > 0) {
// //             fetchIcons();
// //         }
// //     }, [recentDisease]);

// //     const handleSearchChange = (event) => {
// //         setQuery(event.target.value);
// //     };

// //     const handleSearchSubmit = (event) => {
// //         event.preventDefault();
// //         navigate('/chatbot', { state: { query, chatType: '질병 상담' } });
// //     };

// //     const handleCardClick = (link) => {
// //         window.open(link, '_blank');
// //     };

// //     const truncateSummary = (summary) => {
// //         return summary && summary.length > 50 ? summary.slice(0, 50) + '...' : summary;
// //     };

// //     const renderHistogram = () => {
// //         if (!diseaseData || diseaseData.length === 0) {
// //             return (
// //                 <div className='home-nodata'>
// //                     <p>아직 수집된 데이터가 없습니다</p>
// //                     <p>챗봇을 이용하여 데이터를 수집해보세요!</p>
// //                 </div>
// //             );
// //         }
        
// //         const sortedData = diseaseData
// //         .sort((a, b) => b.frequency - a.frequency)
// //         .slice(0, 7);
    
// //         return (
// //             <div className="home-histogram-container">
// //                 {sortedData.map((item, index) => {
// //                     const displayName = item.name.length > 3 ? item.name.slice(0, 3) + '...' : item.name;

// //                     return (
// //                         <div key={index} className="home-histogram-bar">
// //                             <span className="home-disease-name" title={item.name}>{displayName}</span>
// //                             <div
// //                                 className="home-bar"
// //                                 style={{ '--bar-height': `${item.frequency * 20}px` }} // 동적 높이 설정
// //                             ></div>
// //                         </div>
// //                     );
// //                 })}
// //             </div>
// //         );
// //     };

// //     return (
// //     <div className="home-dashboard">
// //         <div className="home-brand">
// //             <h1>MEDINAVI</h1>
// //         </div>
// //         <div className="home-search-section">
// //             <form onSubmit={handleSearchSubmit} className="home-search-form">
// //             <input
// //                 type="text"
// //                 placeholder="어디가 불편하신가요?"
// //                 value={query}
// //                 onChange={handleSearchChange}
// //                 className="home-search-input"
// //             />
// //             </form>
// //         </div>
// //         <div className="home-previous-conditions">
// //             <div className="home-previous-conditions-title">최근 상담 내역</div>
// //             <div className="home-conditions-list">
// //             {recentDisease.length > 0 ? (
// //                 recentDisease.map((data, index) => (
// //                     <div key={index} className="home-condition-item">
// //                         {icons[data.disease_name]}
// //                         {data.disease_name}
// //                     </div>
// //                 ))
// //             ) : (
// //                 <div>상담 내역이 없습니다.</div>
// //             )}
// //             </div>
// //             <div className="home-word-cloud">
// //             {renderHistogram()}
// //             </div>
// //         </div>
// //         <div className="home-points">
// //             <div className="home-news-card-header">
// //             <div className='home-news-card-header-title'>오늘의 건강소식</div>
// //             </div>
// //             {newsData ? (
// //               newsData.map((news, index) => (
// //                 <div className="home-news-card" key={index} onClick={() => handleCardClick(news.link)}>
// //                   <div className="home-news-card-title">{news.title}</div>
// //                   <p>{truncateSummary(news.summary)}</p>
// //                   <button onClick={() => handleCardClick(news.link)}>Read ▷</button>
// //                 </div>
// //               ))
// //             )  : (<p>뉴스를 불러오는 중입니다.....</p>)}
// //         </div>
// //     </div>
// //     );
// // }

// // export default Home;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import axios from 'axios';

const Home = () => {
    const [query, setQuery] = useState('');
    const [newsData, setNewsData] = useState([]);
    const [diseaseData, setDiseaseData] = useState([]);
    const [recentDisease, setRecentDisease] = useState([]);
    const [icons, setIcons] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDiseaseDescription, setSelectedDiseaseDescription] = useState('');
    const [selectedDiseaseName, setSelectedDiseaseName] = useState('');
    const [selectedDiseaseTime, setSelectedDiseaseTime] = useState('');
    const [selectedDepartments, setSelectedDepartments] = useState([]);
    const navigate = useNavigate();
    const userId = localStorage.getItem('user_id');

    const readRecentDisease = async () => {
        const response = await axios.get(`/disease/get/data-recent/${userId}`);
        setRecentDisease(response.data);
    };

    const fetchIcons = async () => {
        const newIcons = {};
        for (const disease of recentDisease) {
            const response = await axios.get(`/disease/get/icon/${disease.disease_name}`);
            newIcons[disease.disease_name] = response.data.icon;
        }
        setIcons(newIcons);
    };

    useEffect(() => {
        const storedNewsData = JSON.parse(localStorage.getItem('newsData'));
        const storedDiseaseData = JSON.parse(localStorage.getItem('diseaseData'));
        readRecentDisease();

        setDiseaseData(storedDiseaseData);
        setNewsData(storedNewsData);
    }, []);

    useEffect(() => {
        if (recentDisease.length > 0) {
            fetchIcons();
        }
    }, [recentDisease]);

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

    const handleDiseaseClick = async(diseaseName, dateTime) => {
        const disease = await axios.get(`/disease/get/description/${diseaseName}`);
        setSelectedDiseaseName(diseaseName);
        setSelectedDiseaseDescription(disease.data.description); 
        setSelectedDiseaseTime(dateTime.substr(0,10));

        const response = await axios.get(`/disease/department_by_disease/${diseaseName}`);
        const departments = response.data.map(dept => dept.department_name); // department_name만 추출
        setSelectedDepartments(departments); 
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedDiseaseName('');
        setSelectedDiseaseDescription('');
        setSelectedDiseaseTime('');
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
                                style={{ '--bar-height': `${item.frequency * 20}px` }} // 동적 높이 설정
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
                <div className="home-previous-conditions-title">최근 상담 내역</div>
                <div className="home-conditions-list">
                    {recentDisease.length > 0 ? (
                        recentDisease.map((data, index) => (
                            <div key={index} className="home-condition-item" onClick={() => handleDiseaseClick(data.disease_name, data.date_time)}>
                                {icons[data.disease_name]}
                                {data.disease_name}
                            </div>
                        ))
                    ) : (
                        <div>상담 내역이 없습니다.</div>
                    )}
                </div>
                <div className="home-word-cloud">
                    {renderHistogram()}
                </div>
            </div>
            <div className="home-points">
                <div className="home-news-card-header">
                    <div className='home-news-card-header-title'>오늘의 건강소식</div>
                </div>
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
        </div>
    );
}

export default Home;



