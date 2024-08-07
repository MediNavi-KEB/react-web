import React from 'react';
import Header from '../basis/Header';

const About = () => {

  return (
    <div className="about-container">
      <div className='title'>About</div>
      <Header/>
      <div className="about-image-container">
        <img className="about-image" src="https://cdn-icons-png.flaticon.com/128/6134/6134346.png" alt="Sample" />
        <p className="about-description">
          MediNavi는 의료 정보를 제공하고 상담을 도와주는 AI 챗봇입니다. 
          <br/>사용자가 필요로 하는 정보를 쉽게 찾아볼 수 있습니다.
        </p>
      </div>
      <div className="about-content">
        <h2 className="about-section-title">What</h2>
        <p className="about-text">
          MediNavi는 사용자들에게 신속하고 정확한 의료 정보를 제공하며, <br/>
          사용자가 궁금해하는 건강 관련 질문에 답변을 제공합니다. <br/>
          사용자는 자신이 겪고 있는 증상이나 의심되는 질병에 대해 질문할 수 있으며, 
          MediNavi는 이를 바탕으로 유익한 정보를 제공합니다.
        </p>

        <h2 className="about-section-title">How</h2>
        <p className="about-text">
          사용자 친화적인 인터페이스와 정확한 데이터 기반의 상담으로 차별화됩니다. <br/>
          개인 맞춤형 건강 정보를 제공하여, 보다 나은 건강 결정을 내릴 수 있도록 합니다.
        </p>

        <h2 className="about-section-title">주요 기능</h2>
        <ul className="about-list">
          <li>실시간 건강 상담</li>
          <li>질병 및 증상에 대한 상세 정보 제공</li>
          <li>개인 건강 정보 기록 feat. Calendar</li>
          <li>위치 정보를 활용한 근거리 병원 추천</li>
        </ul>

        <h2 className="about-section-title">개발 배경</h2>
        <p className="about-text">
          코로나19 팬데믹 상황에서 의료 정보를 갈망한다는 인식에서 시작되었습니다. <br/>
          많은 사용자들이 자신의 증상에 대해 쉽게 접근할 수 있는 정보를 원하며, 
          MediNavi는 그 니즈를 충족시키기 위해 개발되었습니다.
        </p>

        <h2 className="about-section-title">How?</h2>
        <p className="about-text">
          회원가입 후, 로그인을 통해 챗봇에 진입하세요. <br/>
          이후 궁금한 점이 있을 때 질문을 입력하고, MediNavi의 답변을 받아보세요.<br/> 
          또한, 제공되는 건강 관리 팁을 활용하여 일상 속에서 건강을 챙기세요!
        </p>
      </div>
    </div>
  );
};

export default About;
