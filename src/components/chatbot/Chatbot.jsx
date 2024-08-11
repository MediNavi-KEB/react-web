import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../basis/Header';
import { IoReloadCircleOutline } from "react-icons/io5";
import axios from 'axios';
import ChatDescription from './ChatDescription'; 

const Chatbot = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { query, chatType: initialChatType } = location.state || {};
    const userId = localStorage.getItem('user_id');
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState(query || '');
    const [isSending, setIsSending] = useState(false);
    const [chatType, setChatType] = useState(initialChatType || '');
    const [diseaseName, setDiseaseName] = useState('');
    const [departments, setDepartments] = useState([]);
    const chatBodyRef = useRef(null);
    const hasInitialized = useRef(false);
    const [showDescription, setShowDescription] = useState(false);  // 기본값을 false로 설정

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
        const fetchUserPreference = async () => {
            try {
                const response = await axios.get(`/user/get/${userId}`);
                if (response.data.chat_description === 'O') {
                    setShowDescription(true);  // 'O'일 때만 설명 페이지를 보여줌
                }
            } catch (error) {
                console.error("Error fetching user data", error);
            }
        };

        fetchUserPreference();

        if (!hasInitialized.current) {
            if (initialChatType === '질병 상담' && query) {
                const initializeDiseaseConsultation = async () => {
                    setMessages([
                        { sender: 'bot', text: '질병 상담을 선택하셨습니다. 증상을 입력해주세요.' },
                        { sender: 'user', text: query }
                    ]);

                    try {
                        const response = await axios.post('http://127.0.0.1:8000/ai/disease_recommendation', { input: query });
                        console.log('Server response:', response.data);
                        setMessages(prevMessages => [...prevMessages, { sender: 'bot', text: response.data.output, options: response.data.disease }]);
                    } catch (error) {
                        console.error("Error fetching disease recommendation", error);
                        setMessages(prevMessages => [...prevMessages, { sender: 'bot', text: "Error fetching disease recommendation" }]);
                    }
                };

                initializeDiseaseConsultation();
            } else {
                setMessages([{ sender: 'bot', text: '안녕하세요, 상담 종류를 선택해주세요.', options: ['질병 상담', '기타 문의'] }]);
            }
            hasInitialized.current = true;
        }
    }, [initialChatType, query, userId]);

    useEffect(() => {
        if (chatBodyRef.current) {
            chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
        }
    }, [messages]);

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
                    setDiseaseName(option);
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

    const handleOptionSelection = async(option) => {
        if (departments.some(department => department.department_name === option)) {
            const kstDateTime = new Date(new Date().getTime() + (9 * 60 * 60 * 1000)).toISOString();
            const user_disease_data = {
                user_id: userId,
                disease_name: diseaseName,
                date_time: kstDateTime
            };

            const user_disease_response = await axios.post('/disease/user_disease', user_disease_data);
            console.log('user_disease response:', user_disease_response);
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

    const handleSkipOrStart = () => {
        setShowDescription(false);
    };

    return (
        <div className={`chatbot-container ${showDescription ? 'blur-background' : ''}`}>
            {showDescription && <ChatDescription onClose={handleSkipOrStart} />}
            <div className="chat-header">
                <Header/>
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
                <div className='chat-header-refresh' onClick={selectService}>
                    <IoReloadCircleOutline className='chat-header-refresh-icon' />
                </div>
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
