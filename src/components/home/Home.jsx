import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Papa from 'papaparse';
// import './Dashboard.css';

function Home() {
  const [query, setQuery] = useState('');
  const [newsData, setNewsData] = useState([]);
  const [randomNews1, setRandomNews1] = useState(null);
  const [randomNews2, setRandomNews2] = useState(null);
  const [randomNews3, setRandomNews3] = useState(null);
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
              let index1 = Math.floor(Math.random() * results.data.length);
              let index2 = Math.floor(Math.random() * results.data.length);
              let index3 = Math.floor(Math.random() * results.data.length);
              while (index2 === index1) {
                index2 = Math.floor(Math.random() * results.data.length);
              }
              setRandomNews1(results.data[index1]);
              setRandomNews2(results.data[index2]);
              setRandomNews3(results.data[index3]);
            }
          },
        });
      })
      .catch((error) => console.error('Error fetching news:', error));
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
        </div>
      </div>
      <hr className="home-divider" />
      <div className="home-points">
      <div className="home-news-card-header">
        <h4>오늘의 건강소식</h4>
        </div>
        {randomNews1 ? (
          <div className="home-news-card" onClick={() => handleCardClick(randomNews1.Link)}>
            <h4>{randomNews1.Title}</h4>
            <p>{truncateSummary(randomNews1.Summary)}</p>
            <button onClick={() => handleCardClick(randomNews1.Link)}>Read ▷</button>
          </div>
        ) : (
          <p>뉴스를 불러오는 중입니다...</p>
        )}
        {randomNews2 ? (
          <div className="home-news-card" onClick={() => handleCardClick(randomNews2.Link)}>
            <h4>{randomNews2.Title}</h4>
            <p>{truncateSummary(randomNews2.Summary)}</p>
            <button onClick={() => handleCardClick(randomNews2.Link)}>Read ▷</button>
          </div>
        ) : (
          <p>뉴스를 불러오는 중입니다...</p>
        )}
      </div>
  </div>
  );
}

export default Home;