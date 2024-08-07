import React from 'react';
import Header from '../basis/Header';

const Faq = () => {
    const [openIndex, setOpenIndex] = React.useState(null);

    const faqs = [
        {
        question: '"이 증상이 코로나19 증상일 수 있나요?"',
        answer: "코로나19의 일반적인 증상으로는 발열, 기침, 피로, 미각 및 후각 상실이 포함됩니다. 이런 증상이 나타나면 자가격리하고, 가까운 보건소나 의료기관에서 코로나 검사를 받는 것이 좋습니다. 추가적인 정보와 지침은 보건 당국의 안내를 따르세요."
        },
        {
        question: '"이 통증이 특정 질병의 신호일 수 있나요?"',
        answer: "통증의 위치와 유형에 따라 다양한 원인이 있을 수 있습니다. 예를 들어, 지속적인 가슴 통증은 심장 문제일 수 있지만, 근육통일 수도 있습니다. 정확한 진단을 위해 의료 전문가의 검진이 필요합니다."
        },
        {
        question: '"증상이 얼마나 오래 지속되면 병원을 가야 하나요?"',
        answer: "일반적으로 가벼운 증상은 며칠 내에 호전될 수 있습니다. 그러나 일주일 이상 지속되거나 악화되는 경우, 또는 심각한 증상이 나타나면 병원을 방문하는 것이 좋습니다."
        },
        {
        question: '"이 피부 발진이 알레르기 반응일까요?"',
        answer: "피부 발진은 알레르기 반응, 감염, 자극성 접촉 등의 다양한 원인으로 발생할 수 있습니다. 알레르기 반응의 경우 가려움이나 부기가 동반될 수 있습니다. 새로운 음식, 약물, 화장품을 사용한 후 발진이 발생했다면 알레르기일 가능성이 높습니다. 정확한 원인을 파악하기 위해 의료 전문가의 상담이 필요합니다."
        },
        {
        question: '"더위 때문에 자주 어지러운데, 괜찮은 건가요?"',
        answer: "더위로 인해 어지러움을 느끼는 것은 탈수나 열사병의 초기 증상일 수 있습니다. 물을 충분히 마시고, 시원한 곳에서 휴식을 취하는 것이 중요합니다. 어지러움이 지속되거나 심해지면, 특히 두통, 메스꺼움, 혼란 등의 증상이 동반될 경우 즉시 의료 전문가의 도움을 받는 것이 좋습니다."
        }
    ];

    const toggleAnswer = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="faq-container">
            <div className='title'>Setting</div>
            <Header/>
            <h2 className='faq-subtitle ' style={{color:'#5a5a59'}}>FAQ</h2>
            {faqs.map((faq, index) => (
                <div key={index} className="faq-item">
                <div className="faq-question" onClick={() => toggleAnswer(index)}>
                    {faq.question}
                    <span className="faq-icon">{openIndex === index ? "▼" : "▶"}</span>
                </div>
                {openIndex === index && (
                    <div className="faq-answer">
                    {faq.answer.split('.').map((sentence, i) => (
                        <React.Fragment key={i}>
                        {sentence.trim() && <span>{sentence.trim()}.</span>}
                        <br />
                        </React.Fragment>
                    ))}
                    </div>
                )}
                </div>
            ))}
            </div>
    );
};

export default Faq;
