import React, { useState } from 'react';
import { Button, Card, Form, InputGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../App.css';

const Join = () => {
    const navi = useNavigate();
    const [form, setForm] = useState({
        id: '',
        password: '',
        name: '',
        phone: '',
        email: '',
        address: '',
        gender: ''
    });
    const { id, password, name, phone, email, address, gender } = form;

    const onChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleJoin = async () => {
        try {
            const response = await axios.post('/user/register', {
                id, password, name, phone, email, address, gender
            });
            if (response.status === 200) {
                alert("등록 성공");
                navi('/login');
            }
        }catch(error){
            if(error.response){
                alert(`Registration failed\n${error.response.data.detail|| "Please try again."}`)
            }
        }
    };

    return (
        <div className="register-container">
            <Card className="card">
                <Card.Header className="card-header mb-3">
                    <h3 className='text-center'>Register</h3>
                </Card.Header>
                <Card.Body>
                    <InputGroup className='mb-2'>
                        <InputGroup.Text style={{ width: '90px' }} className='justify-content-center'>ID</InputGroup.Text>
                        <Form.Control value={id} name='id' onChange={onChange} />
                    </InputGroup>
                    <InputGroup className='mb-2'>
                        <InputGroup.Text style={{ width: '90px' }} className='justify-content-center'>Password</InputGroup.Text>
                        <Form.Control value={password} name='password' type="password" onChange={onChange} />
                    </InputGroup>
                    <InputGroup className='mb-2'>
                        <InputGroup.Text style={{ width: '90px' }} className='justify-content-center'>Name</InputGroup.Text>
                        <Form.Control value={name} name='name' onChange={onChange} />
                    </InputGroup>
                    <InputGroup className='mb-2'>
                        <InputGroup.Text style={{ width: '90px' }} className='justify-content-center'>Phone</InputGroup.Text>
                        <Form.Control value={phone} name='phone' onChange={onChange} />
                    </InputGroup>
                    <InputGroup className='mb-2'>
                        <InputGroup.Text style={{ width: '90px' }} className='justify-content-center'>Email</InputGroup.Text>
                        <Form.Control value={email} name='email' onChange={onChange} />
                    </InputGroup>
                    <InputGroup className='mb-2'>
                        <InputGroup.Text style={{ width: '90px' }} className='justify-content-center'>Address</InputGroup.Text>
                        <Form.Control value={address} name='address' onChange={onChange} />
                    </InputGroup>
                    <InputGroup className='mb-2'>
                        <InputGroup.Text style={{ width: '90px' }} className='justify-content-center'>Gender</InputGroup.Text>
                        <Form.Control value={gender} name='gender' onChange={onChange} />
                    </InputGroup>
                    <div className="text-center mt-4">
                        <Button  onClick={handleJoin}>등록</Button>
                    </div>
                </Card.Body>
            </Card>
        </div>
    );
};

export default Join;
