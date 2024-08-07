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
    const [chatType, setChatType] = useState('');

    const [departments, setDepartments] = useState([]);
    const chatBodyRef = useRef(null);

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

    useEffect(() => {
        setMessages([{ sender: 'bot', text: '안녕하세요, 상담 종류를 선택해주세요.', options: ['질병 상담', '기타 문의'] }]);
    }, []);

    const handleSend = async () => {
        if (inputText.trim() && !isSending) {
            setIsSending(true);
            const userMessage = { sender: 'user', text: inputText };
            setMessages(prevMessages => [...prevMessages, userMessage]);
            setInputText('');

            if (chatType === '질병 상담') {
                try {
                    const response = await axios.post('http://127.0.0.1:8000/ai/disease_recommendation', { input: inputText });
                    console.log('Server response:', response.data);
                    setMessages(prevMessages => [...prevMessages, { sender: 'bot', text: response.data.output, options: response.data.disease }]);
                } catch (error) {
                    console.error("Error fetching disease recommendation", error);
                    setMessages(prevMessages => [...prevMessages, { sender: 'bot', text: "Error fetching disease recommendation" }]);
                } finally {
                    setIsSending(false);
                }
            } else if (chatType === '기타 문의') {
                try {
                    const response = await fetch('http://127.0.0.1:8000/ai/disease-advice', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ input: inputText })
                    });

                    const reader = response.body.getReader();
                    const decoder = new TextDecoder('utf-8');
                    let done = false;

                    // 임시 메시지 추가
                    let streamingMessage = { sender: 'bot', text: '' };
                    setMessages(prevMessages => [...prevMessages, streamingMessage]);

                    while (!done) {
                        const { value, done: doneReading } = await reader.read();
                        done = doneReading;
                        const chunk = decoder.decode(value, { stream: true });
                        streamingMessage.text += chunk.replace(/[\r\n]+/g, ' ');  // 줄바꿈을 공백으로 대체
                        setMessages(prevMessages => {
                            const updatedMessages = [...prevMessages];
                            updatedMessages[updatedMessages.length - 1] = streamingMessage;
                            return updatedMessages;
                        });
                    }
                } catch (error) {
                    console.error("Error fetching advice", error);
                    setMessages(prevMessages => [...prevMessages, { sender: 'bot', text: "Error fetching advice" }]);
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

                    const response = await fetch('http://127.0.0.1:8000/ai/hospital_recommendation', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ input: option })
                    });

                    const reader = response.body.getReader();
                    const decoder = new TextDecoder('utf-8');
                    let done = false;

                    // 임시 메시지 추가
                    let streamingMessage = { sender: 'bot', text: '' };
                    setMessages(prevMessages => [...prevMessages, streamingMessage]);

                    while (!done) {
                        const { value, done: doneReading } = await reader.read();
                        done = doneReading;
                        const chunk = decoder.decode(value, { stream: true });
                        streamingMessage.text += chunk.replace(/[\r\n]+/g, ' ');  // 줄바꿈을 공백으로 대체
                        setMessages(prevMessages => {
                            const updatedMessages = [...prevMessages];
                            updatedMessages[updatedMessages.length - 1] = streamingMessage;
                            return updatedMessages;
                        });
                    }

                    const departmentResponse = await axios.get(`/disease/department_by_disease/${option}`);
                    setDepartments(departmentResponse.data);

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
                        <div className="chat-header-info">
                            <div className="chat-header-title">
                                <div className="chat-header-icon"></div>
                                <span className="chat-header-name">MediNavi</span>
                            </div>
                            <div className="chat-header-status">
                                <div className="chat-status-indicator"></div>
                                <span>Always active</span>
                            </div>
                        </div>
                    </Col>
                    <Col className='my-3 ml-auto text-right' onClick={selectService}>
                        <IoReloadCircleOutline className='chat-header-refresh-icon text-right' />
                    </Col>
                </Row>
            </div>
            <div className="chat-body" ref={chatBodyRef}>
                <div className="chat-current-time">{currentTime}</div>
                {messages.map((message, index) => (
                    <div key={index} className={`message ${message.sender}-message`}>
                        {message.sender === 'bot' && <div className="bot-icon"></div>}
                        <div className={`message-bubble ${message.options ? 'option-message' : ''}`}>
                            {message.text}
                            {message.options && (
                                <div className="chat-btn-options">
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
