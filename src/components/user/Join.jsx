import React, { useState } from 'react';
import { Button, Form, InputGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../App.css';

const Join = () => {
    const navi = useNavigate();
    const [form, setForm] = useState({
        user_id: '',
        password: '',
        name: '',
        phone: '',
        email: '',
        address: '',
        gender: ''
    });
    const { user_id, password, name, phone, email, address, gender } = form;

    const [idCheck, setIdCheck] = useState('');
    const [idErr, setIdErr] = useState(false);

    const onChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const idDuplicateCheck = async() => {
        try {
            const response = await axios.post('/user/id-check', {user_id})
            console.log(response)
            if(response.data.exists){
                setIdCheck('ID가 중복됩니다.');
                setIdErr(true);
                setForm({
                    ...form,
                    user_id: ''
                });
            }else if(user_id === '') {
                setIdCheck('ID를 입력해주세요..');
                setIdErr(true);
            } else {
                setIdCheck('사용가능한 ID입니다.');
                setIdErr(false);
            }
        } catch (error) {
            console.error(error);
        }
        
    }

    const handleJoin = async () => {
        try {
            const response = await axios.post('/user/register', {
                user_id, password, name, phone, email, address, gender
            });
            if (response.status === 200) {
                navi('/login');
            }
        }catch(error){
            if(error.response){
                alert(`Registration failed\n${error.response.data.detail|| "Please try again."}`)
            }
        }
    };

    const handleBack =  () => {
        navi('/login');
    }

    return (
        <div className="register-container">
            <h1 className='text-center mb-4'>회원가입</h1>
            <InputGroup className='user-input-group-custom mb-2'>
                <InputGroup.Text style={{ width: '90px' }} className='justify-content-center'>ID</InputGroup.Text>
                <Form.Control value={user_id} name='user_id' onChange={onChange} />
                <Button onClick={idDuplicateCheck}>중복확인</Button>
            </InputGroup>
            {idCheck && (
                <h6 style={{textAlign: 'left', color: idErr ? 'red' : 'green'}} className='mb-3'>{idCheck}</h6>
            )}
            <InputGroup className='user-input-group-custom mb-2'>
                <InputGroup.Text style={{ width: '90px' }} className='justify-content-center'>Password</InputGroup.Text>
                <Form.Control value={password} name='password' type="password" onChange={onChange} />
            </InputGroup>
            <InputGroup className='user-input-group-custom mb-2'>
                <InputGroup.Text style={{ width: '90px' }} className='justify-content-center'>Name</InputGroup.Text>
                <Form.Control value={name} name='name' onChange={onChange} />
            </InputGroup>
            <InputGroup className='user-input-group-custom mb-2'>
                <InputGroup.Text style={{ width: '90px' }} className='justify-content-center'>Phone</InputGroup.Text>
                <Form.Control value={phone} name='phone' onChange={onChange} />
            </InputGroup>
            <InputGroup className='user-input-group-custom mb-2'>
                <InputGroup.Text style={{ width: '90px' }} className='justify-content-center'>Email</InputGroup.Text>
                <Form.Control value={email} name='email' onChange={onChange} />
            </InputGroup>
            <InputGroup className='user-input-group-custom mb-2'>
                <InputGroup.Text style={{ width: '90px' }} className='justify-content-center'>Address</InputGroup.Text>
                <Form.Control value={address} name='address' onChange={onChange} />
            </InputGroup>
            <InputGroup className='user-input-group-custom mb-2'>
                <InputGroup.Text style={{ width: '90px' }} className='justify-content-center'>Gender</InputGroup.Text>
                <Form.Select value={gender} name="gender" onChange={onChange}>
                <option value="남성">남성</option>
                <option value="여성">여성</option>
                </Form.Select>

                
            </InputGroup>
            <div className="text-center mt-4">
                <Button className='me-2' size='lg'  onClick={handleJoin}>등록</Button>
                <Button size='lg' variant='secondary'  onClick={handleBack}>취소</Button>
            </div>
        </div>
    );
};

export default Join;
