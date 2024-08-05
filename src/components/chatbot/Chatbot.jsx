import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../basis/Header';
import { Col, Row } from 'react-bootstrap';
import { IoReloadCircleOutline } from "react-icons/io5";
import axios from 'axios';

const Chatbot = () => {
    const navigate = useNavigate();
    const userId = localStorage.getItem('user_id');
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [currentTime, setCurrentTime] = useState('');
    const [chatType, setChatType] = useState('');
    const [selectedDisease, setSelectedDisease] = useState(null);
    const [departments, setDepartments] = useState([]);
    const chatBodyRef = useRef(null);

    const updateTime = () => {
        const now = new Date();
        let hours = now.getHours();
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const day = days[now.getDay()];
        const minutes = now.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        const minutesStr = minutes < 10 ? '0' + minutes : minutes;
        const currentTime = `${day} ${hours}:${minutesStr} ${ampm}`;
        setCurrentTime(currentTime);
    };

    useEffect(() => {
        updateTime();
        const timer = setInterval(updateTime, 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        setMessages([{ sender: 'bot', text: '안녕하세요, 상담 종류를 선택해주세요.', options: ['질병 상담', '기타 문의'] }]);
    }, []);

    const handleSend = async () => {
        if (inputText.trim() && !isSending) {
            setIsSending(true);
            const newMessages = [...messages, { sender: 'user', text: inputText }];
            setMessages(newMessages);
            setInputText('');

            if (chatType === '질병 상담') {
                try {
                    const response = await axios.post('http://127.0.0.1:8000/api/disease_recommendation', { input: inputText });
                    console.log('Server response:', response.data);
                    setMessages([...newMessages, { sender: 'bot', text: response.data.output, options: response.data.disease }]);
                } catch (error) {
                    console.error("Error translating text", error);
                    setMessages([...newMessages, { sender: 'bot', text: "Error translating text" }]);
                } finally {
                    setIsSending(false);
                }
            } else if (chatType === '기타 문의') {
                try {
                    const response = await axios.post('http://127.0.0.1:8000/api/disease-advice', { input: inputText });
                    console.log('Server response:', response.data);
                    setMessages([...newMessages, { sender: 'bot', text: response.data.description }]);
                } catch (error) {
                    console.error("Error fetching advice", error);
                    setMessages([...newMessages, { sender: 'bot', text: "Error fetching advice" }]);
                } finally {
                    setIsSending(false);
                }
            }
        }
    };

    const handleOptionClick = async (option) => {
        setMessages(prevMessages => [...prevMessages, { sender: 'user', text: option }]);

        if (option === '질병 상담' || option === '기타 문의') {
            setChatType(option);
            if (option === '질병 상담') {
                setMessages(prevMessages => [...prevMessages, { sender: 'bot', text: '질병 상담을 선택하셨습니다. 증상을 입력해주세요.' }]);
            } else {
                setMessages(prevMessages => [...prevMessages, { sender: 'bot', text: '기타 문의를 선택하셨습니다. 질문을 입력해주세요.' }]);
            }
        } else {
            if (chatType === '질병 상담') {
                try {
                    const kstDateTime = new Date(new Date().getTime() + (9 * 60 * 60 * 1000)).toISOString();
                    const user_disease_data = {
                        user_id: userId,
                        disease_name: option,
                        date_time: kstDateTime
                    }

                    const user_disease_response = await axios.post('/disease/user_disease', user_disease_data);
                    console.log('user_disease response:', user_disease_response);

                    const response = await axios.post('http://127.0.0.1:8000/api/hospital_recommendation', { input: option });
                    console.log('Server response:', response.data);
                    setSelectedDisease(option);

                    const departmentResponse = await axios.get(`/disease/department_by_disease/${option}`);
                    setDepartments(departmentResponse.data);

                    setMessages(prevMessages => [...prevMessages, { sender: 'bot', text: response.data.description, options: departmentResponse.data.map(dept => dept.department_name) }]);

                    setMessages(prevMessages => [...prevMessages, { sender: 'bot', text: '아래 진료과로 가보세요', options: departmentResponse.data.map(dept => dept.department_name) }]);
                } catch (error) {
                    console.error("Error fetching disease info", error);
                    setMessages(prevMessages => [...prevMessages, { sender: 'bot', text: "Error fetching disease info" }]);
                }
            } else {
                handleSend(option);
            }
        }
    };

    const handleOptionSelection = (option) => {
        if (departments.some(department => department.department_name === option)) {
            navigate(`/local?query=${option}`);
        } else {
            handleOptionClick(option);
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            handleSend();
        }
    };

    const selectService = () => {
        setChatType('');
        setMessages([{ sender: 'bot', text: '안녕하세요, 상담 종류를 선택해주세요.', options: ['질병 상담', '기타 문의'] }]);
        setInputText('');
    };

    return (
        <div className="chatbot-container">
            <div className="chat-header">
                <Row>
                    <Col>
                        <Header />
                    </Col>
                    <Col className='my-3'>
                        <div className="header-info">
                            <div className="header-title">
                                <div className="header-icon"></div>
                                <span className="header-name">MediNavi</span>
                            </div>
                            <div className="header-status">
                                <div className="status-indicator"></div>
                                <span>Always active</span>
                            </div>
                        </div>
                    </Col>
                    <Col className='my-3 ml-auto text-right' onClick={selectService}>
                        <IoReloadCircleOutline className='header-refresh-icon text-right' />
                    </Col>
                </Row>
            </div>
            <div className="chat-body" ref={chatBodyRef}>
                <div className="current-time">{currentTime}</div>
                {messages.map((message, index) => (
                    <div key={index} className={`message ${message.sender}-message`}>
                        {message.sender === 'bot' && <div className="bot-icon"></div>}
                        <div className={`message-bubble ${message.options ? 'option-message' : ''}`}>
                            {message.text}
                            {message.options && (
                                <div className="options">
                                    {message.options.map((option, idx) => (
                                        <button key={idx} onClick={() => handleOptionSelection(option)}>
                                            {option}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            <div className="chat-footer mb-3">
                <input
                    type="text"
                    placeholder="Type a message..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <button onClick={handleSend} disabled={isSending}>
                    <img src="https://img.icons8.com/ios-glyphs/30/000000/filled-sent.png" alt="Send Icon" />
                </button>
            </div>
        </div>
    );
};

export default Chatbot;
