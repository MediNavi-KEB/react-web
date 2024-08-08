import axios from 'axios';
import React, { useState, useEffect } from 'react';
import Header from '../basis/Header';

const Account = () => {
    const [user, setUser] = useState({});
    const [form, setForm] = useState({
        user_id: '',
        password: '',
        name: '',
        phone: '',
        email: '',
        address: '',
        gender: ''
    });

    const loadingUserData = async () => {
        const userId = localStorage.getItem('user_id');
        try {
            const response = await axios.get(`/user/get/${userId}`);
            setUser(response.data);
            setForm(response.data);
        } catch (error) {
            console.error("Failed to fetch user data", error);
        }
    };

    useEffect(() => {
        loadingUserData();
    }, []);

    const { user_id, password, name, phone, email, address, gender } = form;

    const onChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const userUpdate = async () => {
        if (window.confirm('사용자 정보를 업데이트 하겠습니까?')) {
            try {
                const response = await axios.put(`/user/update/${user_id}`, {
                    user_id, password, name, phone, email, address, gender 
                });

                if (response.status === 200) {
                    alert('사용자 정보가 업데이트되었습니다.');
                    setUser(form); // 업데이트 성공 시, user 상태를 최신 데이터로 설정
                }
            } catch (error) {
                alert('사용자 정보 업데이트에 실패했습니다.');
            }
        } else {
            // 취소를 누른 경우, 초기 상태로 되돌림
            setForm(user);
        }
    };

    return (
        <div className='account-container'>
            <div className='title'>Account</div>
            <Header/>
            <div className='account-wrap'>
                <div className='account-list'>
                    <label className='account-label-spacing'>Name*</label>
                    <input className='account-input' value={name} name="name" size={40} onChange={onChange}></input>
                </div>
                <hr className='account-section-divider'></hr>
                
                <div className='account-list'>
                    <label className='account-label-spacing'>Email*</label>
                    <input className='account-input' value={email} name="email" size={40} onChange={onChange}></input>
                </div>
                <hr className='account-section-divider'></hr>
                
                <div className='account-list'>
                    <label className='account-label-spacing'>Phone*</label>
                    <input className='account-input' value={phone} name="phone" size={40} onChange={onChange}></input>
                </div>
                <hr className='account-section-divider'></hr>
                
                <div className='account-list'>
                    <label className='account-label-spacing'>Address*</label>
                    <input className='account-input' value={address} name="address" size={40} onChange={onChange}></input>
                </div>
                <hr className='account-section-divider'></hr>
                
                <div className='account-list'>
                    <label className='account-label-spacing'>Gender*</label>
                    <select value={gender} name="gender" onChange={onChange} className="account-input">
                        <option value="남성">남성</option>
                        <option value="여성">여성</option>
                    </select>
                </div>
                <hr className='account-section-divider'></hr>
                
                <div className='account-list'>
                    <label className='account-label-spacing'>Password**</label>
                    <input value={password} name="password" className='account-input' size={40} onChange={onChange}></input>
                </div>
                <hr className='account-section-divider'></hr>
            </div>
            <div className='account-button'>
                <button className='account-button-update' onClick={userUpdate}>Update</button>
            </div>
        </div>
    );
}

export default Account;
