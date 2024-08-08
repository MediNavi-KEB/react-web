import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Papa from 'papaparse';
import './Home.css';

function Home() {
  const [query, setQuery] = useState('');
  const [newsData, setNewsData] = useState([]);
  const [randomNews, setRandomNews] = useState(null);
  const [wordCloudData, setWordCloudData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/healthnews_data.csv")
      .then((response) => response.text())
      .then((text) => {
        Papa.parse(text, {
          header: true,
          complete: (results) => {
            if (results.data && results.data.length > 0) {
              setNewsData(results.data);
              const index = Math.floor(Math.random() * results.data.length);
              setRandomNews(results.data[index]);
            }
          },
        });
      })
      .catch((error) => console.error('Error fetching news:', error));
  }, []);

  useEffect(() => {
    // 테스트 데이터 설정
    const data = [
      { name: '고혈압', frequency: 4 },
      { name: '구토', frequency: 7 },
      { name: '빈혈', frequency: 5 },
      { name: '열', frequency: 8 },
      { name: '심장병', frequency: 6 },
      { name: '당뇨병', frequency: 3 },
      { name: '우울증', frequency: 12 },
    ];
    setWordCloudData(data);
  }, []);

  const handleSearchChange = (event) => {
    setQuery(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    navigate('/chatbot', { state: { query } });
  };

  const handleCardClick = (link) => {
    window.open(link, '_blank');
  };

  const truncateSummary = (summary) => {
    return summary.length > 50 ? summary.slice(0, 50) + '...' : summary;
  };

  const renderHistogram = () => {
    // 상위 7개의 빈도수를 가진 데이터만 표시
    const sortedData = wordCloudData
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, 7);
    
    return (
      <div className="home-histogram-container">
        {sortedData.map((item, index) => (
          <div key={index} className="home-histogram-bar">
            <span>{item.name}</span>
            <div
              className="home-bar"
              style={{ '--bar-height': `${item.frequency * 10}px` }} // 동적 높이 설정
            ></div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="home-dashboard">
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
          {['🤕 고혈압', '🤢 구토', '🤒 감기몸살', '🩸 빈혈'].map((condition, index) => (
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
        {randomNews ? (
          <div className="home-news-card" onClick={() => handleCardClick(randomNews.Link)}>
            <h4>{randomNews.Title}</h4>
            <p>{truncateSummary(randomNews.Summary)}</p>
            <button onClick={() => handleCardClick(randomNews.Link)}>Read ▷</button>
          </div>
        ) : (
          <p>뉴스를 불러오는 중입니다...</p>
        )}
      </div>
    </div>
  );
}

export default Home;
